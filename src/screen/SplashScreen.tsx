"use client"

import { useEffect } from "react"
import { View, Text, StyleSheet, Image } from "react-native"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { RFPercentage, RFValue } from "react-native-responsive-fontsize"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from "../../App"
import { colors } from "../theme/Color"

type Props = NativeStackScreenProps<RootStackParamList, "SplashScreen">

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.brandMint,
    alignItems: "center",
    justifyContent: "center",
  },
  phone: {
    width: wp("90%"),
    maxWidth: wp("100%"),
    paddingVertical: hp("6%"),
    paddingHorizontal: wp("6%"),
    borderRadius: wp("7%"),
    alignItems: "center",
    justifyContent: "center",
    gap: wp("4%"),
  },
  logo: { width: wp("30%"), height: wp("30%"), marginBottom: hp("1%") },
  row: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: wp("2%") },
  mbg: { fontFamily: "Madimi-One", fontSize: RFValue(28), color: colors.brandOrange, letterSpacing: 0.5 },
  superapp: { fontFamily: "Madimi-One", fontSize: RFValue(28), color: colors.brandGreen, letterSpacing: 0.5 },
})
