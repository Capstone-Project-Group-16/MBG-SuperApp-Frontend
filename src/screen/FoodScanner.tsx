"use client"

import { View, Text, StyleSheet, Pressable, SafeAreaView, TouchableOpacity, Image } from "react-native"
import { useRef, useEffect, useState } from "react"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { RFValue } from "react-native-responsive-fontsize"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from "../../App"
import { CameraView } from "expo-camera"
import { colors } from "../theme/Color"
import { apiFetch } from "../lib/api";

type Props = NativeStackScreenProps<RootStackParamList, "FoodScanner">

export default function FoodScanner({ navigation, route }: Props) {
  const studentProfileId = route?.params?.studentProfileId
  const [exp, setExp] = useState<string>("0")
  const [gems, setGems] = useState<string>("0")
  const cameraRef = useRef<CameraView>(null)
  const [flashEnabled, setFlashEnabled] = useState(false)
  const scanMode = route.params?.scanMode || "distribution"

  useEffect(() => {
    const loadProfile = async () => {
      if (!studentProfileId) {
        console.warn("studentProfileId tidak ada di route params")
        return
      }

      try {
        const { res, data } = await apiFetch(`/api/account/student-profile/get/${studentProfileId}`, {
          method: "GET",
        })

        if (!res.ok) {
          console.log("Gagal fetch student profile:", data)
          return
        }

        setExp(String(data?.expPoints ?? "0"))
        setGems(String(data?.mbgPoints ?? "0"))
      } catch (err) {
        console.log("Error fetch student profile:", err)
      }
    }

    loadProfile()
  }, [studentProfileId])

  const toggleFlash = async () => {
    setFlashEnabled((prev) => !prev)
  }

  const getInstructionText = () => {
    if (scanMode === "waste") {
      return "Foto piringmu setelah selesai makan"
    }
    return "Foto piringmu untuk konfirmasi pesanan diterima"
  }

  const getTitle = () => {
    if (scanMode === "waste") {
      return "Waste Scanner"
    }
    return "Confirm Delivery"
  }

  const handleScan = () => {
    if (scanMode === "waste") {
      navigation.navigate("FoodWaste", { studentProfileId })
    } else {
      navigation.navigate("DistributionTracker", { studentProfileId })
    }
  }

  return (
    <SafeAreaView style={styles.root}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
        enableTorch={flashEnabled}
      >
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

          <Pressable style={styles.captureButton} onPress={handleScan}>
            <View style={styles.captureButtonInner} />
          </Pressable>
        </View>
      </CameraView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.textBlack },
  camera: { flex: 1, justifyContent: "space-between" },
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
