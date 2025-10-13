import { View, Text, StyleSheet, Image } from "react-native"
import { colors } from "../theme/Color"

export default function BrandWordmark({ showIcon = false }: { showIcon?: boolean }) {
  return (
    <View style={styles.row} accessible accessibilityRole="text" accessibilityLabel="SuperApp brand">
      {showIcon ? (
        <Image
          source={require("../../assets/logo/Logo.png")}
          style={styles.icon}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
        />
      ) : null}
      <Text style={styles.super}>Super</Text>
      <Text style={styles.app}>App</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  icon: { width: 28, height: 20, marginRight: 4 },
  super: { fontSize: 28, fontWeight: "700", color: colors.brandOrange, letterSpacing: 0.3 },
  app: { fontSize: 28, fontWeight: "700", color: colors.brandGreen, letterSpacing: 0.3 },
})
