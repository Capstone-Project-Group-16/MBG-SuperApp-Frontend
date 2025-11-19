import { View, Text, StyleSheet, ImageSourcePropType, Image } from "react-native"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { RFPercentage, RFValue } from "react-native-responsive-fontsize"
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
    gap: wp("3.5%"),
    paddingHorizontal: wp("3%"),
    paddingVertical: hp("1%"),
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.brandBorder,
    borderRadius: wp("6%"),
  },
  item: { flexDirection: "row", alignItems: "center", gap: wp("1.5%") },
  icon: { width: wp("5%"), height: wp("5%"), borderRadius: wp("1.5%") },
  text: { fontFamily: "Fredoka-Medium", fontSize: RFValue(14), color: colors.textBlack },
})
