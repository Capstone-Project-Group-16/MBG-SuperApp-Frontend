import { View, Text, StyleSheet, ScrollView, SafeAreaView, Pressable, Image } from "react-native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from "../../App"
import { colors } from "../theme/Color"
import StatusBar from "../components/StatusBar"
import TopWinner from "../components/TopWinner"
import LeaderboardList from "../components/LeaderboardList"
import NavBar from "../components/NavBar"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { RFValue } from "react-native-responsive-fontsize"
import { useEffect, useState } from "react"
import { apiFetch } from "../lib/api";

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
]

export default function Leaderboard({ navigation, route }: Props) {
  const studentProfileId = route?.params?.studentProfileId
  const [exp, setExp] = useState<string>("0")
  const [gems, setGems] = useState<string>("0")

  useEffect(() => {
    const loadProfile = async () => {
      if (!studentProfileId) {
        console.warn("studentProfileId tidak ada di route params")
        return
      }

      try {
        const { res, data } = await apiFetch(`/api/account/student-profile/get/${studentProfileId}`, {
          method: "GET",
        })

        if (!res.ok) {
          console.log("Gagal fetch student profile:", data)
          return
        }

        setExp(String(data?.expPoints ?? "0"))
        setGems(String(data?.mbgPoints ?? "0"))
      } catch (err) {
        console.log("Error fetch student profile:", err)
      }
    }

    loadProfile()
  }, [studentProfileId])

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" onPress={() => navigation.goBack()} style={styles.back}>
          <Image style={styles.backIcon} source={require("../../assets/icon/back.png")} resizeMode="contain" />
        </Pressable>

        <View style={{ flex: 1 }} />
        <StatusBar
          items={[
            { label: "Exp", icon: require("../../assets/icon/thunder.png"), value: exp, textColor: colors.textGold },
            { label: "Gems", icon: require("../../assets/icon/diamond.png"), value: gems, textColor: colors.textBlue },
          ]}
        />
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
            />
          ))}
        </View>

        <View style={{ height: hp("3%") }} />
      </ScrollView>

      <NavBar
        items={[
          { label: "Home", icon: require("../../assets/icon/home.png"), onPress: () => navigation.navigate("Home", { studentProfileId }) },
          { label: "Distribution Tracker", icon: require("../../assets/icon/distribution.png"), onPress: () => navigation.navigate("DistributionTracker", { studentProfileId }) },
          { label: "Spin Wheel", icon: require("../../assets/icon/spin-wheel.png"), onPress: () => navigation.navigate("SpinWheel", { studentProfileId }), },
          { label: "Leaderboard", icon: require("../../assets/icon/leaderboard.png"), active: true, onPress: () => { } },
        ]}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp("4%"),
    marginTop: hp("1.25%"),
    paddingTop: hp("4%"),
    gap: wp("3%"),
  },
  back: { paddingVertical: hp("1%"), paddingHorizontal: wp("1%") },
  backIcon: {
    width: wp("6%"),
    height: wp("6%"),
    marginBottom: hp("0.5%"),
    tintColor: colors.brandBorder
  },
  title: {
    fontFamily: "Fredoka-SemiBold",
    fontSize: RFValue(22),
    color: colors.textBlack,
    marginBottom: hp("2%"),
    paddingTop: hp("1.5%"),
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center"
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
