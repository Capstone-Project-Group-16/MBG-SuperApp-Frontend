"use client";

import {
    BarcodeScanningResult,
    CameraView,
    useCameraPermissions,
} from "expo-camera";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Platform,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { assignOrderToPlate, scanPlateQR } from "../lib/api";

const COLORS = {
  white: "#FFFFFF",
  brandGreen: "#45A246",
  darkBg: "#0B2A17",
};

export default function PlateScan() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // menerima parameter dari previous page
  const orderId = Number(params.orderId) || null;
  const studentId = Number(params.studentId) || null;
  const studentName = (params.studentName as string) || "";
  const foodId = Number(params.foodId) || null;
  const foodName = (params.foodName as string) || "";

  const [permission, requestPermission] = useCameraPermissions();
  const [isProcessing, setIsProcessing] = useState(false);
  const scannedRef = useRef(false);

  // ==== CHECK PERMISSION ON LOAD ====
  useEffect(() => {
    if (!permission) return;
    if (!permission.granted) {
      requestPermission();
    }
  }, [permission]);

  // ==== QR SCAN HANDLER ====
  const onBarcodeScanned = async (result: BarcodeScanningResult) => {
    if (!result?.data) return;
    if (scannedRef.current) return;

    scannedRef.current = true;
    setIsProcessing(true);

    const data = result.data;

    try {
      // Step 1 → Validate QR via backend
      let qrResult;
      try {
        qrResult = await scanPlateQR(data);
      } catch (err: any) {
        Alert.alert("Scanner Error", err?.message || "Gagal memproses QR.");
        scannedRef.current = false;
        setIsProcessing(false);
        return;
      }

      const plateCode =
        qrResult?.plateCode ||
        qrResult?.plate_code ||
        qrResult?.code ||
        null;

      if (!plateCode) {
        Alert.alert("Invalid QR", "QR tidak dikenali sebagai plate.");
        scannedRef.current = false;
        setIsProcessing(false);
        return;
      }

      // Step 2 → Assign order ke plate
      if (!orderId) {
        Alert.alert(
          "Order Missing",
          "Order ID tidak ditemukan. Buka Assign Delivery dari daftar order."
        );
        scannedRef.current = false;
        setIsProcessing(false);
        return;
      }

      try {
        await assignOrderToPlate(orderId, plateCode);
      } catch (err: any) {
        Alert.alert("Assign Failed", err?.message || "Gagal assign order.");
        scannedRef.current = false;
        setIsProcessing(false);
        return;
      }

      // Step 3 → Navigate
      router.replace({
        pathname: "/deliveryStatus",
        params: {
          orderId: String(orderId),
          studentId: String(studentId),
          studentName,
          foodId: String(foodId),
          foodName,
          plateCode,
        },
      });
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Terjadi kesalahan saat scan.");
      scannedRef.current = false;
    } finally {
      setIsProcessing(false);
    }
  };

  // ==== PERMISSION STATE ====
  if (!permission) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.brandGreen} />
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={{ color: COLORS.brandGreen, marginBottom: 12 }}>
          Kamera butuh izin untuk scan.
        </Text>
        <Pressable onPress={requestPermission}>
          <Text style={{ color: COLORS.brandGreen }}>Allow Camera</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  // ==== MAIN UI ====
  return (
    <SafeAreaView style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={isProcessing ? undefined : onBarcodeScanned}
      />

      <View style={styles.overlay}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.backText}>{"< Back"}</Text>
          </Pressable>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Scan Plate QR</Text>

          <View style={styles.scanBox}>
            <View style={styles.cornerTopLeft} />
            <View style={styles.cornerTopRight} />
            <View style={styles.cornerBottomLeft} />
            <View style={styles.cornerBottomRight} />
          </View>

          <Text style={styles.hint}>Arahkan kamera ke QR code di piring</Text>

          {isProcessing && (
            <ActivityIndicator
              size="large"
              color={COLORS.brandGreen}
              style={{ marginTop: 20 }}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

// ==== STYLES ====
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "space-between",
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 50 : 24,
    paddingHorizontal: 16,
  },
  backText: { color: COLORS.white, fontWeight: "700" },
  content: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 40,
  },
  title: { color: COLORS.white, fontSize: 22, fontWeight: "700", marginBottom: 20 },
  scanBox: {
    width: 280,
    height: 200,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  cornerTopLeft: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 40,
    height: 40,
    borderLeftWidth: 4,
    borderTopWidth: 4,
    borderColor: COLORS.white,
  },
  cornerTopRight: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderColor: COLORS.white,
  },
  cornerBottomLeft: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 40,
    height: 40,
    borderLeftWidth: 4,
    borderBottomWidth: 4,
    borderColor: COLORS.white,
  },
  cornerBottomRight: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRightWidth: 4,
    borderBottomWidth: 4,
    borderColor: COLORS.white,
  },
  hint: { color: COLORS.white, marginTop: 12, textAlign: "center" },
});
