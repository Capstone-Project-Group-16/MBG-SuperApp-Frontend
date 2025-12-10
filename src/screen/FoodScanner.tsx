"use client"

import { View, Text, StyleSheet, Pressable, SafeAreaView, TouchableOpacity, Image, Alert, ActivityIndicator } from "react-native"
import { useRef, useEffect, useState } from "react"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { RFValue } from "react-native-responsive-fontsize"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from "../../App"
import { CameraView, useCameraPermissions, BarcodeScanningResult } from "expo-camera"
import { colors } from "../theme/Color"
import { apiFetch } from "../lib/api"
import AsyncStorage from "@react-native-async-storage/async-storage"

type Props = NativeStackScreenProps<RootStackParamList, "FoodScanner">

export default function FoodScanner({ navigation, route }: Props) {
  // Ambil params dengan default value yang aman
  const { studentProfileId, orderId, phase = "before", scanMode = "distribution" } = route.params || {}
  
  const [actualOrderId, setActualOrderId] = useState<number | null>(orderId || null)
  const [currentPhase, setCurrentPhase] = useState<"before" | "after">(phase)
  const cameraRef = useRef<CameraView>(null)
  const [flashEnabled, setFlashEnabled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  // State untuk lock scanner QR
  const [scanned, setScanned] = useState(false)
  
  const [permission, requestPermission] = useCameraPermissions()

  useEffect(() => {
    const init = async () => {
      if (!permission?.granted) {
        await requestPermission()
      }

      // Fallback: Jika orderId tidak dikirim lewat params, ambil dari Storage
      if (!actualOrderId) {
        try {
          const stored = await AsyncStorage.getItem("lastOrderId");
          if (stored) {
            setActualOrderId(Number(stored));
            console.log("OrderId recovered from storage:", stored);
          }
        } catch (err) {
          console.warn("Failed to load orderId:", err);
        }
      }
    }
    init()
  }, [])

  // Reset scanner lock setiap kali masuk layar
  useEffect(() => {
    setScanned(false);
  }, [navigation]);

  const toggleFlash = () => setFlashEnabled((prev) => !prev)

  // Teks Instruksi Dinamis
  const getInstructionText = () => {
    if (scanMode === "waste") {
      return currentPhase === "before" 
        ? "Foto piringmu SEBELUM makan" 
        : "Foto piringmu SETELAH selesai makan"
    }
    return "Arahkan kamera ke QR Code di piring"
  }

  const getTitle = () => {
    if (scanMode === "waste") {
      return currentPhase === "before" ? "Before Eating" : "After Eating"
    }
    return "Confirm Receipt"
  }

  // --- LOGIC 1: MODE DISTRIBUTION (SCAN QR OTOMATIS) ---
  const handleBarCodeScanned = async ({ data }: BarcodeScanningResult) => {
    if (scanned || isLoading) return;
    
    setScanned(true); // Lock agar tidak scan berkali-kali
    setIsLoading(true);
    
    try {
      console.log("Scanned QR:", data);

      // Panggil API Confirm Receipt
      const { res, data: resData } = await apiFetch(
        "/api/mbg-food-distribution-tracker/food-distributor/confirm-receipt",
        {
          method: "POST",
          body: JSON.stringify({ plateCode: data }), // Kirim string QR code
        }
      );

      if (!res.ok) {
        throw new Error(resData?.detail || "Gagal konfirmasi penerimaan.");
      }

      // Sukses
      Alert.alert("Berhasil!", "Makanan diterima. Selamat makan!", [
        {
          text: "OK",
          onPress: () => {
            // Kembali ke tracker
            navigation.navigate("DistributionTracker", { studentProfileId });
          },
        },
      ]);

    } catch (error: any) {
      Alert.alert("Gagal Scan", error.message, [
        { 
            text: "Coba Lagi", 
            onPress: () => { 
                setScanned(false); // Buka lock
                setIsLoading(false); 
            }
        }
      ]);
    }
  };

  // --- LOGIC 2: MODE WASTE (AMBIL FOTO MANUAL) ---
  const handleCapture = async () => {
    if (scanMode !== "waste") return; 
    if (!cameraRef.current) return;

    setIsLoading(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        exif: false,
      });

      if (!photo) {
        Alert.alert("Error", "Gagal mengambil foto");
        setIsLoading(false);
        return;
      }

      await uploadWasteImage(photo);
    } catch (error: any) {
      console.error("Camera error:", error);
      setIsLoading(false);
      Alert.alert("Error", "Gagal mengambil foto: " + error.message);
    }
  }

  const uploadWasteImage = async (photo: any) => {
    if (!actualOrderId) {
      Alert.alert("Error", "Order ID tidak ditemukan. Pastikan kamu sudah order makanan.");
      setIsLoading(false);
      return;
    }

    try {
      const endpoint = currentPhase === "before" ? "/api/storage/addBeforeEatImage" : "/api/storage/addAfterEatImage"
      const formData = new FormData()
      
      const filename = `${currentPhase}_eat_${Date.now()}.jpg`
      formData.append("file", {
        uri: photo.uri,
        type: "image/jpeg",
        name: filename,
      } as any)
      formData.append("orderId", String(actualOrderId))

      const token = await AsyncStorage.getItem("accessToken")
      const { API_BASE_URL } = require("../lib/api")

      // Upload Fetch Manual (karena FormData butuh handling khusus boundary)
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        Alert.alert("Upload Failed", data?.detail || `Server error (${res.status})`)
        setIsLoading(false)
        return
      }

      // Logic Transisi Phase
      if (currentPhase === "after") {
        // Jika phase 'after' selesai, hitung waste
        await calculateWaste()
      } else {
        // Jika phase 'before' selesai, ganti ke 'after'
        setCurrentPhase("after")
        setIsLoading(false)
        Alert.alert("Sukses", "Foto sebelum makan tersimpan. Foto lagi setelah selesai makan ya!")
      }
    } catch (error: any) {
      setIsLoading(false)
      Alert.alert("Error", "Gagal upload: " + error.message)
    }
  }

  const calculateWaste = async () => {
    try {
      const { res, data } = await apiFetch(
        `/api/mbg-food-waste-tracker/food-calculation/waste-percentage/${actualOrderId}`,
        { method: "GET" }
      )
      
      if (res.ok) {
          // --- PENTING: Set Flag bahwa user sudah scan waste ---
          // Ini agar DistributionTracker tahu tombol "Finish Eating" boleh ditekan
          await AsyncStorage.setItem("temp_has_scanned_waste", "true");

          navigation.replace("FoodWaste", {
            studentProfileId,
            orderId: actualOrderId!, // Kirim orderId yang valid
            wastePercentage: data?.wastePercentage,
            beforeArea: data?.beforeArea,
            afterArea: data?.afterArea,
          })
      } else {
          Alert.alert("Gagal", data?.detail || "Gagal menghitung waste.")
      }
    } catch (error: any) {
      setIsLoading(false)
      Alert.alert("Error", error.message)
    } finally {
        setIsLoading(false);
    }
  }

  if (!permission?.granted) {
    return (
      <SafeAreaView style={[styles.root, {justifyContent:'center', alignItems:'center'}]}>
        <Text style={{color:'white', marginBottom: 20}}>Meminta izin kamera...</Text>
        <Pressable onPress={requestPermission} style={{backgroundColor:'white', padding:10, borderRadius:5}}>
            <Text>Izinkan Akses Kamera</Text>
        </Pressable>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.root}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
        enableTorch={flashEnabled}
        // SCANNER QR AKTIF JIKA: Mode distribution & Belum terscan
        onBarcodeScanned={scanMode === "distribution" && !scanned ? handleBarCodeScanned : undefined}
        barcodeScannerSettings={{
            barcodeTypes: ["qr"],
        }}
      />
      
      <View style={styles.overlay}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.back}>
            <Image style={styles.backIcon} source={require("../../assets/icon/back.png")} resizeMode="contain" />
          </Pressable>
          <View style={{ flex: 1 }} />
          <TouchableOpacity style={[styles.flashButton, flashEnabled && styles.flashButtonActive]} onPress={toggleFlash}>
            <Image style={styles.flashIcon} source={require("../../assets/icon/flashlight.png")} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.centerContent}>
          <Text style={styles.title}>{getTitle()}</Text>

          {/* Frame Scanner */}
          <View style={styles.scannerFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
            
            {/* Loading Overlay */}
            {isLoading && (
                <View style={StyleSheet.absoluteFillObject}>
                    <View style={{flex:1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent:'center', alignItems:'center', borderRadius: 20}}>
                        <ActivityIndicator size="large" color={colors.brandGreen} />
                        <Text style={{color:'white', marginTop: 10, fontWeight:'bold'}}>Processing...</Text>
                    </View>
                </View>
            )}
          </View>

          <Text style={styles.instructionText}>{getInstructionText()}</Text>

          {/* Tombol Foto HANYA MUNCUL DI MODE WASTE */}
          {scanMode === "waste" && (
            <Pressable style={styles.captureButton} onPress={handleCapture} disabled={isLoading}>
              <View style={styles.captureButtonInner} />
            </Pressable>
          )}
          
          {/* Info Text DI MODE DISTRIBUTION */}
          {scanMode === "distribution" && (
             <View style={{ marginTop: hp("4%"), marginBottom: hp("6%") }}>
                 <Text style={{color: colors.white, opacity: 0.8}}>Memindai QR Code otomatis...</Text>
             </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.textBlack },
  camera: { flex: 1 },
  overlay: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    flexDirection: "column", justifyContent: "space-between",
  },
  header: {
    flexDirection: "row", alignItems: "center",
    marginTop: hp("1.25%"), paddingHorizontal: wp("4%"),
    paddingTop: hp("4%"), paddingBottom: hp("2%"),
  },
  back: { padding: wp("2%") },
  backIcon: { width: wp("8%"), height: wp("8%"), tintColor: colors.white },
  flashButton: {
    width: wp("11%"), height: wp("11%"), borderRadius: wp("4.5%"),
    borderWidth: 2, borderColor: colors.white,
    alignItems: "center", justifyContent: "center",
  },
  flashButtonActive: { backgroundColor: colors.white },
  flashIcon: { width: wp("6%"), height: wp("6%") },
  centerContent: { flex: 1, alignItems: "center", marginTop: hp("6%"), paddingHorizontal: wp("4%") },
  title: { fontFamily: "Fredoka-SemiBold", fontSize: RFValue(28), color: colors.white, marginBottom: hp("5%") },
  scannerFrame: {
    width: wp("70%"), height: wp("70%"),
    position: "relative", marginBottom: hp("4%"),
  },
  corner: {
    position: "absolute", width: wp("10%"), height: wp("10%"),
    borderColor: colors.white, borderWidth: 4, borderRadius: wp("4%"),
  },
  topLeft: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  topRight: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  bottomLeft: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  bottomRight: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
  instructionText: {
    fontSize: RFValue(14), color: colors.white, textAlign: "center",
    marginTop: hp("2%"), fontFamily: "Jost", opacity: 0.9,
  },
  captureButton: {
    width: wp("18%"), height: wp("18%"), borderRadius: wp("9%"),
    backgroundColor: "rgba(255,255,255,0.3)",
    alignItems: "center", justifyContent: "center",
    marginTop: hp("4%"), marginBottom: hp("6%"),
  },
  captureButtonInner: {
    width: wp("14%"), height: wp("14%"), borderRadius: wp("7%"),
    backgroundColor: colors.white,
  },
})