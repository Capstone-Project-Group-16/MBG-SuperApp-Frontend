"use client"

import { useEffect } from "react"
import { View, Text, StyleSheet, Image, Dimensions } from "react-native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from "../../App"
import { colors } from "../theme/Color"

type Props = NativeStackScreenProps<RootStackParamList, "Splash">

export default function SplashScreen({ navigation }: Props) {
  useEffect(() => {
    const t = setTimeout(() => navigation.replace("SignIn"), 1200)
    return () => clearTimeout(t)
  }, [navigation])

  return (
    <View style={styles.container}>
      <View style={styles.phone}>
        <Image
          source={require("../../assets/logo/logo.png")}
          style={styles.logo}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
        />
        <View style={styles.row}>
          <Text style={styles.mbg}>MBG</Text>
          <Text style={styles.superapp}>SuperApp</Text>
        </View>
      </View>
    </View>
  )
}

const { width } = Dimensions.get("window")
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.brandMint,
    alignItems: "center",
    justifyContent: "center",
  },
  phone: {
    width: Math.min(360, width - 32),
    paddingVertical: 48,
    paddingHorizontal: 24,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  logo: { width: 120, height: 120, marginBottom: 8 },
  row: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8 },
  mbg: { fontFamily: "Madimi-One", fontSize: 28, color: colors.brandOrange, letterSpacing: 0.5 },
  superapp: { fontFamily: "Madimi-One", fontSize: 28, color: colors.brandGreen, letterSpacing: 0.5 },
})
