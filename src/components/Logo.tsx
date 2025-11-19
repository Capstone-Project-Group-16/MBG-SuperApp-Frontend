import { View, Text, StyleSheet, Image } from "react-native"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { RFPercentage, RFValue } from "react-native-responsive-fontsize"
import { colors } from "../theme/Color"

export default function Logo() {
  return (
    <View style={styles.row} accessible accessibilityRole="text" accessibilityLabel="MBG SuperApp Brand">
      <Image
        source={require("../../assets/logo/logo.png")}
        style={styles.icon}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
      />
      <Text style={styles.mbg}>MBG</Text>
      <Text style={styles.superapp}>SuperApp</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  row: { flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: wp("2%") },
  icon: { width: wp("10%"), height: wp("10%"), marginRight: 0 },
  mbg: { fontFamily: "Madimi-One", fontSize: RFValue(28), color: colors.brandOrange, letterSpacing: 0.5 },
  superapp: { fontFamily: "Madimi-One", fontSize: RFValue(28), color: colors.brandGreen, letterSpacing: 0.5 },
})
