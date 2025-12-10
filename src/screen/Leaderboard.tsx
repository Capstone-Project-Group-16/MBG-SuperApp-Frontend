import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Pressable,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../App";
import { colors } from "../theme/Color";
import StatusBar from "../components/StatusBar";
import TopWinner from "../components/TopWinner";
import LeaderboardList from "../components/LeaderboardList";
import NavBar from "../components/NavBar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFValue } from "react-native-responsive-fontsize";
import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";

type Props = NativeStackScreenProps<RootStackParamList, "Leaderboard">;

type LeaderboardEntry = {
  rank: number;
  studentProfileId: number;
  userId: number;
  userFullName: string;
  userProfilePictureLink: string | null;
  schoolId: number;
  schoolName: string;
  expPoints: number;
};

export default function Leaderboard({ navigation, route }: Props) {
  const studentProfileId = route?.params?.studentProfileId;
  const [exp, setExp] = useState<string>("0");
  const [gems, setGems] = useState<string>("0");
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load student profile (exp & gems)
  const loadProfile = async () => {
    if (!studentProfileId) {
      console.warn("studentProfileId tidak ada di route params");
      return;
    }

    try {
      const { res, data } = await apiFetch(
        `/api/account/student-profile/get/${studentProfileId}`,
        {
          method: "GET",
        }
      );

      if (!res.ok) {
        console.log("Gagal fetch student profile:", data);
        return;
      }

      setExp(String(data?.expPoints ?? "0"));
      setGems(String(data?.mbgPoints ?? "0"));
    } catch (err) {
      console.log("Error fetch student profile:", err);
    }
  };

  // Load leaderboard data
  const loadLeaderboard = async () => {
    try {
      const { res, data } = await apiFetch(
        "/api/account/student-profile/leaderboard?filter_type=all",
        {
          method: "GET",
        }
      );

      if (!res.ok) {
        console.log("Gagal fetch leaderboard:", data);
        return;
      }

      setLeaderboardData(data?.leaderboard ?? []);
    } catch (err) {
      console.log("Error fetch leaderboard:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProfile();
    loadLeaderboard();
  }, [studentProfileId]);

  const onRefresh = () => {
    setRefreshing(true);
    loadProfile();
    loadLeaderboard();
  };

  // Get top 10 only
  const top10 = leaderboardData.slice(0, 10);
  const topThree = top10.slice(0, 3);
  const restOfLeaderboard = top10.slice(3);

  // Find current user's position in full leaderboard
  const currentUserEntry = leaderboardData.find(
    (entry) => entry.studentProfileId === studentProfileId
  );
  const isUserInTop10 = currentUserEntry && currentUserEntry.rank <= 10;

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.goBack()}
          style={styles.back}
        >
          <Image
            style={styles.backIcon}
            source={require("../../assets/icon/back.png")}
            resizeMode="contain"
          />
        </Pressable>

        <View style={{ flex: 1 }} />
        <StatusBar
          items={[
            {
              label: "Exp",
              icon: require("../../assets/icon/thunder.png"),
              value: exp,
              textColor: colors.textGold,
            },
            {
              label: "Gems",
              icon: require("../../assets/icon/diamond.png"),
              value: gems,
              textColor: colors.textBlue,
            },
          ]}
        />
      </View>

      <Text style={styles.title}>Leaderboard</Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.brandGreen} />
          <Text style={styles.loadingText}>Memuat Leaderboard...</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Top 3 Winners */}
          {topThree.length > 0 && (
            <View style={styles.topWinnersContainer}>
              {/* Rank 2 (Left) */}
              {topThree[1] && (
                <TopWinner
                  rank={2}
                  name={topThree[1].userFullName}
                  xp={`${topThree[1].expPoints} XP`}
                  bgColor="#B8EDFF"
                />
              )}

              {/* Rank 1 (Center) */}
              {topThree[0] && (
                <TopWinner
                  rank={1}
                  name={topThree[0].userFullName}
                  xp={`${topThree[0].expPoints} XP`}
                  bgColor="#FFD23D"
                />
              )}

              {/* Rank 3 (Right) */}
              {topThree[2] && (
                <TopWinner
                  rank={3}
                  name={topThree[2].userFullName}
                  xp={`${topThree[2].expPoints} XP`}
                  bgColor="#F69A4C"
                />
              )}
            </View>
          )}

          {/* Leaderboard List (Rank 4-10) */}
          <View style={styles.listContainer}>
            {restOfLeaderboard.length > 0 ? (
              restOfLeaderboard.map((item) => (
                <LeaderboardList
                  key={item.studentProfileId}
                  rank={item.rank}
                  name={item.userFullName}
                  xp={`${item.expPoints} XP`}
                  isCurrentUser={item.studentProfileId === studentProfileId}
                />
              ))
            ) : (
              <Text style={styles.emptyText}>Belum ada data leaderboard</Text>
            )}
          </View>

          {/* Current User Position (if not in top 10) */}
          {!isUserInTop10 && currentUserEntry && (
            <>
              <View style={styles.separator}>
                <View style={styles.separatorLine} />
                <Text style={styles.separatorText}>...</Text>
                <View style={styles.separatorLine} />
              </View>

              <View style={styles.listContainer}>
                <LeaderboardList
                  rank={currentUserEntry.rank}
                  name={currentUserEntry.userFullName}
                  xp={`${currentUserEntry.expPoints} XP`}
                  isCurrentUser={true}
                />
              </View>
            </>
          )}

          <View style={{ height: hp("3%") }} />
        </ScrollView>
      )}

      <NavBar
        items={[
          {
            label: "Home",
            icon: require("../../assets/icon/home.png"),
            onPress: () => navigation.navigate("Home", { studentProfileId }),
          },
          {
            label: "Distribution Tracker",
            icon: require("../../assets/icon/distribution.png"),
            onPress: () =>
              navigation.navigate("DistributionTracker", { studentProfileId }),
          },
          {
            label: "Spin Wheel",
            icon: require("../../assets/icon/spin-wheel.png"),
            onPress: () => navigation.navigate("SpinWheel", { studentProfileId }),
          },
          {
            label: "Leaderboard",
            icon: require("../../assets/icon/leaderboard.png"),
            active: true,
            onPress: () => {},
          },
        ]}
      />
    </SafeAreaView>
  );
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
    tintColor: colors.brandBorder,
  },
  title: {
    fontFamily: "Fredoka-SemiBold",
    fontSize: RFValue(22),
    color: colors.textBlack,
    marginBottom: hp("2%"),
    paddingTop: hp("1.5%"),
    alignItems: "center",
    justifyContent: "center",
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp("6%"),
  },
  loadingText: {
    marginTop: hp("2%"),
    textAlign: "center",
    color: colors.brandBorder,
    fontSize: RFValue(12),
  },
  emptyText: {
    textAlign: "center",
    color: colors.brandBorder,
    fontSize: RFValue(12),
    marginTop: hp("3%"),
  },
  separator: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: hp("2%"),
    paddingHorizontal: wp("4%"),
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.brandBorder,
  },
  separatorText: {
    fontFamily: "Fredoka-Medium",
    fontSize: RFValue(14),
    color: colors.brandBorder,
    marginHorizontal: wp("3%"),
  },
});