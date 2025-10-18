import { View, Text, StyleSheet, Pressable, ImageSourcePropType, Image } from "react-native"
import { colors } from "../theme/Color"

type Item = { 
  label: string
  icon?: ImageSourcePropType
  active?: boolean
  onPress?: () => void
}

export default function NavBar({ items }: { items: Item[] }) {
  return (
    <View style={styles.wrap} accessibilityRole="tablist">
      <View style={styles.row}>
        {items.map((it) => (
          <Pressable
            key={it.label}
            onPress={it.onPress}
            style={[styles.item, it.active && styles.activeItem]}
            accessibilityRole="tab"
            accessibilityState={{ selected: !!it.active }}
          >
            <Image source={it.icon} style={styles.icon} resizeMode="contain" />
          </Pressable>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { borderTopWidth: 2, borderTopColor: colors.brandBorder, backgroundColor: colors.white },
  row: { flexDirection: "row", justifyContent: "space-around", paddingVertical: 12, paddingHorizontal: 12 },
  item: { alignItems: "center", gap: 6, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 12 },
  activeItem: { width: 58, height: 58, backgroundColor: colors.active, justifyContent: "center", alignItems: "center" },
  icon: { width: 44, height: 44, borderRadius: 6 },
})
