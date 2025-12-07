import { View, Text, StyleSheet, ScrollView, SafeAreaView, Pressable, Image } from "react-native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from "../../App"
import { colors } from "../theme/Color"
import TopWinner from "../components/TopWinner"
import LeaderboardList from "../components/LeaderboardList"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { RFValue } from "react-native-responsive-fontsize"

type Props = NativeStackScreenProps<RootStackParamList, "Leaderboard">

const leaderboardData = [
  { rank: 1, name: "Full Name", xp: "9999 XP" },
  { rank: 2, name: "Full Name", xp: "9900 XP" },
  { rank: 3, name: "Full Name", xp: "9800 XP" },
  { rank: 4, name: "Full Name", xp: "9700 XP" },
  { rank: 5, name: "Full Name", xp: "9600 XP" },
  { rank: 6, name: "Full Name", xp: "9500 XP" },
  { rank: 7, name: "Full Name", xp: "9400 XP" },
  { rank: 8, name: "Full Name", xp: "9300 XP" },
  { rank: 9, name: "Full Name", xp: "9200 XP" },
  { rank: 10, name: "Full Name", xp: "9100 XP" },
  { rank: 16, name: "Full Name", xp: "8500 XP" },
]

export default function Leaderboard({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" onPress={() => navigation.goBack()} style={styles.back}>
          <Image style={styles.backIcon} source={require("../../assets/icon/back.png")} resizeMode="contain" />
        </Pressable>
      </View>

      <Text style={styles.title}>Leaderboard</Text>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Top 3 Winners */}
        <View style={styles.topWinnersContainer}>
          <TopWinner rank={2} name="Full Name" xp="XP" bgColor="#B8EDFF" />
          <TopWinner rank={1} name="Full Name" xp="XP" bgColor="#FFD23D" />
          <TopWinner rank={3} name="Full Name" xp="XP" bgColor="#F69A4C" />
        </View>

        {/* Leaderboard List */}
        <View style={styles.listContainer}>
          {leaderboardData.map((item) => (
            <LeaderboardList
              key={item.rank}
              rank={item.rank}
              name={item.name}
              xp={item.xp}
              isHighlighted={item.rank === 16}
            />
          ))}
        </View>

        <View style={{ height: hp("3%") }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp("4%"),
    paddingTop: hp("2%"),
    paddingBottom: hp("1%"),
  },
  back: { paddingVertical: hp("1%"), paddingHorizontal: wp("1%") },
  backIcon: { width: wp("6%"), height: wp("6%") },
  title: {
    fontFamily: "Fredoka-SemiBold",
    fontSize: RFValue(22),
    color: colors.textBlack,
    paddingHorizontal: wp("4%"),
    marginBottom: hp("2.5%"),
    textAlign: "center",
  },
  content: { paddingHorizontal: wp("4%") },
  topWinnersContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    gap: wp("2%"),
    marginBottom: hp("3%"),
  },
  listContainer: { marginTop: hp("2%") },
})
