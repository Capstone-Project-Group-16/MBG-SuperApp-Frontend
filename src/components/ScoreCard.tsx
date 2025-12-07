import { View, Text, StyleSheet, ImageSourcePropType, Image } from "react-native"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { RFValue } from "react-native-responsive-fontsize"
import { colors } from "../theme/Color"

type Props = {
  label: string
  value: string | number
  icon?: ImageSourcePropType
  backgroundColor: string
  borderColor: string
}

export default function ScoreCard({ label, value, icon, backgroundColor, borderColor }: Props) {
  return (
    <View style={[styles.card, { backgroundColor, borderColor }]}>
      <View style={styles.row}>
        {icon && <Image source={icon} style={styles.icon} resizeMode="contain" />}
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    width: wp("35%"),
    aspectRatio: 1,
    borderRadius: wp("8%"),
    borderWidth: wp("0.8%"),
    padding: wp("3%"),
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: wp("2%"),
    marginBottom: hp("0.8%"),
  },
  icon: {
    width: wp("6%"),
    height: wp("6%"),
    borderRadius: wp("1.5%"),
  },
  label: {
    fontFamily: "Jost-SemiBold",
    fontSize: RFValue(16),
    color: colors.textBlack,
    marginBottom: hp("0.5%"),
  },
  value: {
    fontFamily: "Jost-Bold",
    fontSize: RFValue(22),
    color: colors.textBlack,
  },
})
