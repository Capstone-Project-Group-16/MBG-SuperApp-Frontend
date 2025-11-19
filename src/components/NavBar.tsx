import { View, Text, StyleSheet, Pressable, ImageSourcePropType, Image } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { RFPercentage, RFValue } from "react-native-responsive-fontsize"
import { colors } from "../theme/Color"

type Item = { 
  label: string
  icon?: ImageSourcePropType
  active?: boolean
  onPress?: () => void
}

export default function NavBar({ items }: { items: Item[] }) {
  const insets = useSafeAreaInsets()

  return (
    <View style={[styles.wrap, { paddingBottom: hp("4%") }]} accessibilityRole="tablist">
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
  row: { flexDirection: "row", justifyContent: "space-around", paddingVertical: hp("1.5%"), paddingHorizontal: wp("3%") },
  item: { alignItems: "center", gap: wp("1.5%"), paddingVertical: hp("0.75%"), paddingHorizontal: wp("2.5%"), borderRadius: wp("3%") },
  activeItem: { width: wp("14.5%"), height: wp("14.5%"), backgroundColor: colors.active, justifyContent: "center", alignItems: "center" },
  icon: { width: wp("11%"), height: wp("11%"), borderRadius: wp("1.5%") },
})
