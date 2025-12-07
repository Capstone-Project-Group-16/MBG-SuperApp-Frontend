import { View, Text, StyleSheet } from "react-native"
import { colors } from "../theme/Color"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { RFValue } from "react-native-responsive-fontsize"

type LeaderboardListProps = {
  rank: number
  name: string
  xp: string
  isHighlighted?: boolean
}

export default function LeaderboardList({ rank, name, xp, isHighlighted }: LeaderboardListProps) {
  const bgColor = isHighlighted ? "#7CFF85" : colors.brandGrey
  const textColor = isHighlighted ? colors.textBlack : "#666666"

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Text style={[styles.rank, { color: textColor }]}>{rank}</Text>
      <Text style={[styles.name, { color: textColor }]}>{name}</Text>
      <Text style={[styles.xp, { color: textColor }]}>{xp}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("2%"),
    borderRadius: wp("3%"),
    marginBottom: hp("1.5%"),
  },
  rank: { fontFamily: "Fredoka-SemiBold", fontSize: RFValue(14), width: wp("8%") },
  name: { flex: 1, fontFamily: "Fredoka-Medium", fontSize: RFValue(14), marginLeft: wp("2%") },
  xp: { fontFamily: "Fredoka-SemiBold", fontSize: RFValue(14) },
})
