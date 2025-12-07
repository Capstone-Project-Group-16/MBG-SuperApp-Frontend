import { View, Text, StyleSheet } from "react-native"
import { colors } from "../theme/Color"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { RFValue } from "react-native-responsive-fontsize"

type TopWinnerProps = {
  rank: 1 | 2 | 3
  name: string
  xp: string
  bgColor: string
}

export default function TopWinner({ rank, name, xp, bgColor }: TopWinnerProps) {
  const getAvatarEmoji = () => {
    const emojis = ["😊", "😄", "🤩"]
    return emojis[rank - 1]
  }

  const containerHeight = rank === 1 ? hp("22%") : hp("18%")
  const containerWidth = rank === 1 ? wp("28%") : wp("24%")

  return (
    <View style={[styles.container, { backgroundColor: bgColor, height: containerHeight, width: containerWidth }]}>
      <View style={styles.avatarContainer}>
        <Text style={styles.avatar}>{getAvatarEmoji()}</Text>
      </View>
      <Text style={styles.rank}>{rank}</Text>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.xp}>{xp}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: wp("4%"),
    alignItems: "center",
    justifyContent: "center",
    padding: wp("2%"),
  },
  avatarContainer: {
    width: wp("14%"),
    height: wp("14%"),
    borderRadius: wp("7%"),
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp("1%"),
  },
  avatar: { fontSize: RFValue(32) },
  rank: { fontFamily: "Fredoka-SemiBold", fontSize: RFValue(18), color: colors.textBlack, marginBottom: hp("0.5%") },
  name: { fontFamily: "Fredoka-Medium", fontSize: RFValue(11), color: colors.textBlack, textAlign: "center" },
  xp: { fontFamily: "Fredoka-Medium", fontSize: RFValue(10), color: colors.textBlack, marginTop: hp("0.5%") },
})
