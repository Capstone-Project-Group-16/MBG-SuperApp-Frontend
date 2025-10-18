import { View, Text, StyleSheet, ImageSourcePropType, Image } from "react-native"
import { colors } from "../theme/Color"

type Item = { 
  label: string 
  icon?: ImageSourcePropType 
  value: string
  textColor?: string
}

export default function StatusBar({ items }: { items: Item[] }) {
  return (
    <View style={styles.container} accessibilityRole="summary">
      {items.map((it, idx) => (
        <View key={idx} style={styles.item}>
          <Image source={it.icon} style={styles.icon} resizeMode="contain" />
          <Text style={[styles.text, { color: it.textColor }]}>{it.value}</Text>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.brandBorder,
    borderRadius: 24,
  },
  item: { flexDirection: "row", alignItems: "center", gap: 6 },
  icon: { width: 20, height: 20, borderRadius: 6 },
  text: { fontFamily: "Fredoka-Medium", fontSize: 16, color: colors.textBlack },
})
