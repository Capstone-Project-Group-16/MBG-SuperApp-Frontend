import { View, Text, StyleSheet } from "react-native"
import { colors } from "../theme/Color"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { RFValue } from "react-native-responsive-fontsize"

type LeaderboardListProps = {
  rank: number
  name: string
  xp: string
  isCurrentUser?: boolean
}

export default function LeaderboardList({ rank, name, xp, isCurrentUser = false }: LeaderboardListProps) {
  return (
    <View style={[
      styles.container,
      isCurrentUser && styles.currentUserContainer
    ]}>
      <Text style={[
        styles.rank,
        isCurrentUser && styles.currentUserText
      ]}>{rank}</Text>
      <Text style={[
        styles.name,
        isCurrentUser && styles.currentUserText
      ]}>{name}</Text>
      <Text style={[
        styles.xp,
        isCurrentUser && styles.currentUserText
      ]}>{xp}</Text>
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
    backgroundColor: colors.brandGrey,
  },
  currentUserContainer: {
    backgroundColor: colors.brandGreen,
    borderWidth: 2,
    borderColor: colors.brandBorder,
  },
  rank: { 
    fontFamily: "Fredoka-SemiBold", 
    fontSize: RFValue(14), 
    width: wp("8%"), 
    color: colors.textBlack 
  },
  name: { 
    flex: 1, 
    fontFamily: "Fredoka-Medium", 
    fontSize: RFValue(14), 
    marginLeft: wp("2%"), 
    color: colors.textBlack 
  },
  xp: { 
    fontFamily: "Fredoka-SemiBold", 
    fontSize: RFValue(14), 
    color: colors.textBlack 
  },
  currentUserText: {
    color: colors.white,
    fontFamily: "Fredoka-Bold",
  },
})