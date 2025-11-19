import { View, Text, StyleSheet } from "react-native"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { RFValue } from "react-native-responsive-fontsize"
import { colors } from "../theme/Color"

type Props = {
  label: string
  value: string | number
  icon: React.ReactNode
  backgroundColor: string
  borderColor: string
}

export default function ScoreCard({ label, value, icon, backgroundColor, borderColor }: Props) {
  return (
    <View style={[styles.card, { backgroundColor, borderColor }]}>
      <View style={styles.iconContainer}>{icon}</View>
      <Text style={styles.label}>{label}</Text>
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
  iconContainer: {
    marginBottom: hp("1%"),
  },
  label: {
    fontFamily: "Fredoka-Medium",
    fontSize: RFValue(14),
    color: colors.textBlack,
    marginBottom: hp("0.5%"),
  },
  value: {
    fontFamily: "Fredoka-Bold",
    fontSize: RFValue(22),
    color: colors.textBlack,
  },
})
