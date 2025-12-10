"use client"

import { View, Text, StyleSheet, Pressable, SafeAreaView, TouchableOpacity, Image, Alert, ActivityIndicator } from "react-native"
import { useRef, useEffect, useState } from "react"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { RFValue } from "react-native-responsive-fontsize"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from "../../App"
import { CameraView, CameraType, useCameraPermissions } from "expo-camera"
import { colors } from "../theme/Color"
import { apiFetch } from "../lib/api"
import AsyncStorage from "@react-native-async-storage/async-storage"

type Props = NativeStackScreenProps<RootStackParamList, "FoodScanner">

export default function FoodScanner({ navigation, route }: Props) {
  const studentProfileId = route?.params?.studentProfileId
  const orderId = route?.params?.orderId
  const phase = route?.params?.phase || "before" // before or after
  const [actualOrderId, setActualOrderId] = useState<number | null>(orderId || null)
  const [currentPhase, setCurrentPhase] = useState<"before" | "after">(phase as "before" | "after")
  const cameraRef = useRef<CameraView>(null)
  const [flashEnabled, setFlashEnabled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const scanMode = route.params?.scanMode || "distribution"
  
  // Request camera permissions
  const [permission, requestPermission] = useCameraPermissions()

  useEffect(() => {
    const init = async () => {
      // Request camera permission first
      if (!permission?.granted) {
        await requestPermission()
      }

      // Load orderId from AsyncStorage if not provided
      if (!actualOrderId) {
        try {
          const stored = await AsyncStorage.getItem("lastOrderId");
          if (stored) {
            setActualOrderId(Number(stored));
            console.log("orderId loaded from AsyncStorage:", stored);
          }
        } catch (err) {
          console.warn("Failed to load orderId from AsyncStorage:", err);
        }
      }
    }

    init()
  }, [])

  // Save waste tracking state whenever phase changes
  useEffect(() => {
    const saveState = async () => {
      if (scanMode === "waste" && actualOrderId) {
        try {
          await AsyncStorage.setItem(
            `wasteTracking_${actualOrderId}`,
            currentPhase
          );
          console.log("Saved waste tracking state:", currentPhase);
        } catch (err) {
          console.warn("Failed to save waste tracking state:", err);
        }
      }
    }
    
    saveState()
  }, [currentPhase, actualOrderId, scanMode])

  const toggleFlash = async () => {
    setFlashEnabled((prev) => !prev)
  }

  const getInstructionText = () => {
    if (scanMode === "waste") {
      if (currentPhase === "before") {
        return "Foto piringmu SEBELUM makan"
      } else {
        return "Foto piringmu SETELAH selesai makan"
      }
    }
    return "Foto piringmu untuk konfirmasi pesanan diterima"
  }

  const getTitle = () => {
    if (scanMode === "waste") {
      return currentPhase === "before" ? "Before Eating" : "After Eating"
    }
    return "Confirm Delivery"
  }

  const handleCapture = async () => {
    if (!cameraRef.current) return

    setIsLoading(true)
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        exif: false,
      })

      if (!photo) {
        Alert.alert("Error", "Gagal mengambil foto")
        setIsLoading(false)
        return
      }

      // Handle different scan modes
      if (scanMode === "waste") {
        // Upload to appropriate endpoint based on phase
        // uploadWasteImage will handle setting isLoading state
        await uploadWasteImage(photo)
      } else {
        // Distribution/Delivery mode
        setIsLoading(false)
        navigation.navigate("DistributionTracker", { studentProfileId })
      }
    } catch (error) {
      console.error("Camera error:", error)
      setIsLoading(false)
      Alert.alert("Error", "Gagal mengambil foto: " + (error as any).message)
    }
  }

  const uploadWasteImage = async (photo: any) => {
    if (!actualOrderId) {
      Alert.alert("Error", "Order ID tidak ditemukan. Silahkan pesan makanan terlebih dahulu.")
      setIsLoading(false)
      return
    }

    try {
      const endpoint = currentPhase === "before" ? "/api/storage/addBeforeEatImage" : "/api/storage/addAfterEatImage"

      // Create FormData for multipart upload using photo URI
      const formData = new FormData()
      
      // Use photo URI instead of base64
      const photoUri = photo.uri
      const filename = `${currentPhase}_eat_${Date.now()}.jpg`
      
      formData.append("file", {
        uri: photoUri,
        type: "image/jpeg",
        name: filename,
      } as any)
      formData.append("orderId", String(actualOrderId))

      const token = await AsyncStorage.getItem("accessToken")
      const { API_BASE_URL } = await import("../lib/api")

      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      let data: any = null
      try {
        const text = await res.text()
        if (text) {
          data = JSON.parse(text)
        }
      } catch (parseError) {
        console.warn("Failed to parse response JSON:", parseError)
        // If JSON parsing fails, we'll just use null data
      }

      if (!res.ok) {
        Alert.alert("Upload Failed", data?.detail || `Server error (${res.status})`)
        setIsLoading(false)
        return
      }

      console.log("Upload success:", data)
      // Don't show success alert - just proceed to avoid blocking

      if (currentPhase === "after") {
        // After eating photo uploaded, calculate waste
        setIsLoading(false)
        await calculateWaste()
      } else {
        // Before eating photo uploaded, switch to after phase
        setCurrentPhase("after")
        setIsLoading(false)
        Alert.alert("Sukses", "Foto sebelum makan berhasil diunggah. Setelah selesai makan, foto kembali piringmu!")
      }
    } catch (error) {
      console.error("Upload error:", error)
      setIsLoading(false)
      Alert.alert("Error", "Gagal mengupload foto: " + (error as any).message)
    }
  }

  const calculateWaste = async () => {
    if (!actualOrderId) {
      return
    }

    setIsLoading(true)
    try {
      console.log("Calling food calculation API for order:", actualOrderId)
      const { res, data } = await apiFetch(
        `/api/mbg-food-waste-tracker/food-calculation/waste-percentage/${actualOrderId}`,
        { method: "GET" }
      )

      console.log("Food calculation response:", { status: res.status, data })
      setIsLoading(false)

      if (!res.ok) {
        Alert.alert(
          "Calculation Failed",
          data?.detail || "Gagal menghitung waste. Coba lagi?",
          [
            {
              text: "Coba Lagi",
              onPress: () => calculateWaste(),
            },
            {
              text: "Kembali",
              onPress: () => navigation.goBack(),
            },
          ]
        )
        return
      }

      if (!data || data.wastePercentage === undefined) {
        Alert.alert("Error", "Data perhitungan waste tidak lengkap")
        return
      }

      // Clear tracking state after successful calculation
      await AsyncStorage.removeItem(`wasteTracking_${actualOrderId}`)

      // Navigate to FoodWaste with the calculated data
      console.log("Navigating to FoodWaste with data:", data)
      navigation.replace("FoodWaste", {
        studentProfileId,
        orderId: actualOrderId,
        wastePercentage: data?.wastePercentage,
        beforeArea: data?.beforeArea,
        afterArea: data?.afterArea,
      })
    } catch (error) {
      console.error("Calculation error:", error)
      setIsLoading(false)
      Alert.alert(
        "Error",
        "Gagal menghitung waste: " + (error as any).message,
        [
          {
            text: "Coba Lagi",
            onPress: () => calculateWaste(),
          },
          {
            text: "Kembali",
            onPress: () => navigation.goBack(),
          },
        ]
      )
    }
  }

  const handleScan = async () => {
    if (scanMode === "waste") {
      // For waste mode, we need orderId to start
      if (!actualOrderId) {
        Alert.alert("Error", "Order ID tidak ditemukan. Silahkan pesan makanan terlebih dahulu.")
        return
      }
      // Photo will be taken on button press
      await handleCapture()
    } else {
      navigation.navigate("DistributionTracker", { studentProfileId })
    }
  }

  if (!permission?.granted) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={[styles.overlay, { backgroundColor: "rgba(0,0,0,0.8)", justifyContent: "center", alignItems: "center" }]}>
          <Text style={[styles.title, { marginBottom: 20 }]}>Camera Permission Required</Text>
          <Text style={[styles.instructionText, { marginBottom: 30 }]}>Aplikasi membutuhkan akses ke kamera untuk mengambil foto</Text>
          <Pressable 
            style={[styles.captureButton, { marginBottom: 0 }]} 
            onPress={requestPermission}
          >
            <Text style={{ color: colors.brandGreen, fontWeight: "bold", fontSize: RFValue(16) }}>Allow Camera</Text>
          </Pressable>
        </View>
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
      />
      
      {/* UI Overlay using absolute positioning */}
      <View style={styles.overlay}>
        <View style={styles.header}>
          <Pressable accessibilityRole="button" onPress={() => navigation.goBack()} style={styles.back}>
            <Image style={styles.backIcon} source={require("../../assets/icon/back.png")} resizeMode="contain" />
          </Pressable>

          <View style={{ flex: 1 }} />

          <TouchableOpacity
            style={[styles.flashButton, flashEnabled && styles.flashButtonActive]}
            onPress={toggleFlash}
          >
            <Image style={styles.flashIcon} source={require("../../assets/icon/flashlight.png")} />
          </TouchableOpacity>
        </View>

        <View style={styles.centerContent}>
          <Text style={styles.title}>{getTitle()}</Text>

          <View style={styles.scannerFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>

          <Text style={styles.instructionText}>{getInstructionText()}</Text>

          <Pressable style={styles.captureButton} onPress={handleScan} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator size="large" color={colors.brandGreen} />
            ) : (
              <View style={styles.captureButtonInner} />
            )}
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.textBlack },
  camera: { flex: 1 },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp("1.25%"),
    paddingHorizontal: wp("4%"),
    paddingTop: hp("4%"),
    paddingBottom: hp("2%"),
  },
  back: { paddingVertical: hp("1%"), paddingHorizontal: wp("1%") },
  backIcon: { width: wp("8%"), height: wp("8%"), tintColor: colors.white, marginBottom: hp("0.5%") },
  flashButton: {
    width: wp("11%"),
    height: wp("11%"),
    borderRadius: wp("4.5%"),
    borderWidth: 2,
    borderColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  flashButtonActive: { backgroundColor: colors.white },
  flashIcon: { width: wp("8%"), height: wp("8%") },
  centerContent: { flex: 1, alignItems: "center", marginTop: hp("6%"), paddingHorizontal: wp("4%") },
  title: { fontFamily: "Fredoka-SemiBold", fontSize: RFValue(28), color: colors.white, marginBottom: hp("5%") },
  scannerFrame: {
    width: wp("80%"),
    height: hp("40%"),
    position: "relative",
    marginBottom: hp("4%"),
  },
  corner: {
    position: "absolute",
    width: wp("20%"),
    height: wp("20%"),
    borderColor: colors.white,
    borderWidth: 4,
    borderRadius: wp("4%"),
  },
  topLeft: { top: 0, left: 0, borderRightWidth: wp("-3%"), borderBottomWidth: wp("-3%") },
  topRight: { top: 0, right: 0, borderLeftWidth: wp("-3%"), borderBottomWidth: wp("-3%") },
  bottomLeft: { bottom: 0, left: 0, borderRightWidth: wp("-3%"), borderTopWidth: wp("-3%") },
  bottomRight: { bottom: 0, right: 0, borderLeftWidth: wp("-3%"), borderTopWidth: wp("-3%") },
  instructionText: {
    fontSize: RFValue(14),
    color: colors.white,
    textAlign: "center",
    marginTop: hp("2.5%"),
    fontFamily: "Jost",
    opacity: 0.9,
    lineHeight: 22
  },
  captureButton: {
    width: wp("16%"),
    height: wp("16%"),
    borderRadius: wp("8%"),
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp("4%"),
    marginBottom: hp("6%"),
  },
  captureButtonInner: {
    width: wp("13%"),
    height: wp("13%"),
    borderRadius: wp("6.5%"),
    backgroundColor: colors.white,
    borderWidth: 3,
    borderColor: colors.brandGreen,
  },
})
