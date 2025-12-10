import { BarCodeScanner } from "expo-barcode-scanner";
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
import { assignOrderToPlate, scanPlateQR } from "../lib/api"; // pastikan path relatif sesuai

const COLORS = {
  white: "#FFFFFF",
  brandGreen: "#45A246",
  darkBg: "#0B2A17",
};

export default function PlateScan() {
  const params = useLocalSearchParams(); // expects orderId, studentId, studentName, foodId, foodName
  const router = useRouter();

  // parameters passed from OrderListt
    const orderId = Number(params.orderId) || null;
    const studentId = Number(params.studentId) || null;
    const studentName = (params.studentName as string) || "";
    const foodId = Number(params.foodId) || null;
    const foodName = (params.foodName as string) || "";


  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const scannedRef = useRef(false); // prevent multiple scans

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scannedRef.current) return;
    scannedRef.current = true;
    setIsProcessing(true);

    try {
      if (!data) {
        Alert.alert("Scan failed", "QR code tidak terbaca.");
        scannedRef.current = false;
        setIsProcessing(false);
        return;
      }

      // 1) optional: call scanPlateQR to let backend decode/validate QR
      let qrResult;
      try {
        qrResult = await scanPlateQR(data);
      } catch (err: any) {
        console.error("scanPlateQR error:", err);
        Alert.alert("Scanner error", err?.message || "Gagal memproses QR (scanPlateQR).");
        scannedRef.current = false;
        setIsProcessing(false);
        return;
      }

      // Expect backend returns something like { plateCode: "PLATE-001", ... }
      const plateCode = qrResult?.plateCode ?? qrResult?.plate_code ?? qrResult?.code ?? null;
      if (!plateCode) {
        Alert.alert("Invalid QR", "QR tidak dapat dikenali sebagai plate.");
        scannedRef.current = false;
        setIsProcessing(false);
        return;
      }

    // 2) assign order to plate
        if (!orderId) {
        Alert.alert("Order missing", "Order ID tidak ditemukan. Buka Assign Delivery dari daftar order.");
        scannedRef.current = false;
        setIsProcessing(false);
        return;
        }

        try {
        await assignOrderToPlate(orderId, plateCode);
        } catch (err: any) {
        console.error("assignOrderToPlate error:", err);
        Alert.alert("Assign failed", err?.message || "Gagal assign order ke plate.");
        scannedRef.current = false;
        setIsProcessing(false);
        return;
        }

      // 3) navigate to deliveryStatus with params
      router.replace({
        pathname: "/deliveryStatus",
        params: {
            orderId: String(orderId),
            studentId: String(studentId),
            studentName,
            foodId: String(foodId),
            foodName,
            plateCode
        },
        });
    } catch (error: any) {
      console.error("Unexpected scan error:", error);
      Alert.alert("Error", error?.message || "Terjadi kesalahan saat scan.");
      scannedRef.current = false;
      setIsProcessing(false);
    }
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.brandGreen} />
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={{ color: COLORS.brandGreen, marginBottom: 12 }}>Camera permission is required.</Text>
        <Pressable onPress={() => BarCodeScanner.requestPermissionsAsync()}>
          <Text style={{ color: COLORS.brandGreen }}>Allow Camera</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={isProcessing ? undefined : handleBarCodeScanned}
        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
        style={StyleSheet.absoluteFillObject}
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

          {isProcessing && <ActivityIndicator size="large" color={COLORS.brandGreen} style={{ marginTop: 20 }} />}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
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
  cornerTopLeft: { position: "absolute", top: 0, left: 0, width: 40, height: 40, borderLeftWidth: 4, borderTopWidth: 4, borderColor: COLORS.white },
  cornerTopRight: { position: "absolute", top: 0, right: 0, width: 40, height: 40, borderRightWidth: 4, borderTopWidth: 4, borderColor: COLORS.white },
  cornerBottomLeft: { position: "absolute", bottom: 0, left: 0, width: 40, height: 40, borderLeftWidth: 4, borderBottomWidth: 4, borderColor: COLORS.white },
  cornerBottomRight: { position: "absolute", bottom: 0, right: 0, width: 40, height: 40, borderRightWidth: 4, borderBottomWidth: 4, borderColor: COLORS.white },
  hint: { color: COLORS.white, marginTop: 12, textAlign: "center" },
});
