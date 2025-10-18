import { View, Text, StyleSheet, Image } from "react-native"
import { colors } from "../theme/Color"

export default function MBGBrand({ showIcon = false }: { showIcon?: boolean }) {
  return (
    <View style={styles.row} accessible accessibilityRole="text" accessibilityLabel="MBG SuperApp Brand">
      {showIcon ? (
        <Image
          source={require("../../assets/logo/logo.png")}
          style={styles.icon}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
        />
      ) : null}
      <Text style={styles.mbg}>MBG</Text>
      <Text style={styles.superapp}>SuperApp</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  row: { flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8 },
  icon: { width: 40, height: 40, marginRight: 0 },
  mbg: { fontFamily: "Madimi-One", fontSize: 28, fontWeight: "400", color: colors.brandOrange, letterSpacing: 0.5 },
  superapp: { fontFamily: "Madimi-One", fontSize: 28, fontWeight: "400", color: colors.brandGreen, letterSpacing: 0.5 },
})
