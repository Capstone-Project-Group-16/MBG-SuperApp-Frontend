import { View, Text, StyleSheet } from "react-native"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { RFValue } from "react-native-responsive-fontsize"

type Props = {
  label: string
  value: number
  unit?: string
  color: string
  max?: number
}

export default function NutritionBar({ label, value, unit, color, max = 30 }: Props) {
  const percentage = Math.min((value / max) * 100, 100)

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value} {unit}</Text>
      </View>

      <View style={styles.barBackground}>
        <View style={[styles.barFill, { backgroundColor: color, width: `${percentage}%` }]} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: hp("2.5%"),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hp("0.75%"),
  },
  label: {
    fontFamily: "Fredoka-Medium",
    fontSize: RFValue(12),
    color: "#000",
  },
  value: {
    fontFamily: "Fredoka-Medium",
    fontSize: RFValue(12),
    color: "#000",
  },
  barBackground: {
    height: hp("2%"),
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: wp("3%"),
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: wp("1%"),
  },
})
