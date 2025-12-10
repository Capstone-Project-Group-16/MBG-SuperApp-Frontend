"use client"

import React, { useCallback, useEffect, useState } from "react"
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Alert, TouchableOpacity, Image, ActivityIndicator } from "react-native"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { RFPercentage, RFValue } from "react-native-responsive-fontsize"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import { useFocusEffect } from "@react-navigation/native"
import type { RootStackParamList } from "../../App"
import { colors } from "../theme/Color"
import StatusBar from "../components/StatusBar"
import FeatureCard from "../components/FeatureCard"
import NavBar from "../components/NavBar"
import { apiFetch } from "../lib/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = NativeStackScreenProps<RootStackParamList, "Home">

interface User {
  userFullName: string
  userProfilePictureLink?: string | null
}

interface StudentProfile {
  studentProfileId: number
  user: User
  expPoints: number
  mbgPoints: number
}

export default function HomeScreen({ navigation, route }: Props) {
  const studentProfileId = route?.params?.studentProfileId
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [avatarLetter, setAvatarLetter] = useState<string>("?")
  const [lastOrderId, setLastOrderId] = useState<number | null>(null);
  const [profileLoading, setProfileLoading] = useState(true)

  useFocusEffect(
    useCallback(() => {
      const loadProfile = async () => {
        if (!studentProfileId) {
          console.warn("studentProfileId tidak ada di route params")
          return
        }

        try {
          const { res, data } = await apiFetch(`/api/account/student-profile/get/${studentProfileId}`, {
            method: "GET",
          })

          if (!res.ok || !data) {
            console.warn("Failed to fetch student profile", data)
            return
          }

          setProfile(data)
          setAvatarLetter(data.user.userFullName.charAt(0).toUpperCase())
        } catch (err) {
          console.log("Error loading profile:", err);
        } finally {
          setProfileLoading(false);
        }
      }

      loadProfile()
    }, [studentProfileId])
  )

  useEffect(() => {
    const loadLastOrderId = async () => {
      try {
        const stored = await AsyncStorage.getItem("lastOrderId");
        if (stored) {
          setLastOrderId(Number(stored));
        } else if (studentProfileId) {
          // If not in AsyncStorage, fetch from API
          const { res, data } = await apiFetch(`/api/account/student-profile/get/${studentProfileId}`, {
            method: "GET",
          });

          if (res.ok && data?.orders && data.orders.length > 0) {
            // Get the most recent order
            const latestOrder = data.orders[0];
            setLastOrderId(latestOrder.orderId || latestOrder.id);
            // Save it for future use
            if (latestOrder.orderId || latestOrder.id) {
              await AsyncStorage.setItem("lastOrderId", String(latestOrder.orderId || latestOrder.id));
            }
          }
        }
      } catch (err) {
        console.warn("Failed to load lastOrderId", err);
      }
    };

    loadLastOrderId();
  }, [studentProfileId]);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        { /* Profile Picture */}
        <TouchableOpacity style={styles.avatar} onPress={() => navigation.navigate("Profile", { studentProfileId })}>
          {profileLoading ? (
            <ActivityIndicator size="small" color={colors.brandGreen} />
          ) : profile?.user.userProfilePictureLink ? (
            <Image source={{ uri: profile.user.userProfilePictureLink }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarLetter}>{avatarLetter}</Text>
          )}
        </TouchableOpacity>

        { /* Username */}
        <Text style={styles.userName}>
          {profileLoading ? "Loading..." : profile?.user.userFullName ? profile.user.userFullName.split(" ")[0] : "Student"}
        </Text>

        <View style={{ flex: 1 }} />
        <StatusBar
          items={[
            { label: "Exp", icon: require("../../assets/icon/thunder.png"), value: String(profile?.expPoints), textColor: colors.textGold },
            { label: "Gems", icon: require("../../assets/icon/diamond.png"), value: String(profile?.mbgPoints), textColor: colors.textBlue },
          ]}
        />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <FeatureCard
          title="Food Customizer"
          description="Pilih menu makan siangmu sendiri. Seru kayak main game!"
          icon={require("../../assets/icon/food-customizer.png")}
          onPress={() => navigation.navigate("FoodCustomizer", { studentProfileId })}
        />
        <View style={{ height: hp("3%") }} />
        <FeatureCard
          title="Nutrition Facts"
          description="Cek kekuatan nutrisi yang ada di balik makananmu!"
          icon={require("../../assets/icon/nutrition-facts.png")}
          onPress={() => navigation.navigate("NutritionFacts", { studentProfileId: studentProfileId })}
        />
        <View style={{ height: hp("3%") }} />
        <FeatureCard
          title="Food Waste"
          description="Foto piringmu, lihat seberapa jago kamu ngabisin makan!"
          icon={require("../../assets/icon/food-waste.png")}
          onPress={async () => {
            if (!lastOrderId) {
              Alert.alert(
                "Food Waste Tracker",
                "Kamu belum punya riwayat order. Lakukan pemesanan makanan dulu sebelum tracking food waste ya! 😊"
              );
              return;
            }

            // First, check if waste percentage already exists
            try {
              const { res, data } = await apiFetch(
                `/api/mbg-food-waste-tracker/food-calculation/waste-percentage/${lastOrderId}`,
                { method: "GET" }
              );

              if (res.ok && data && data.wastePercentage !== undefined) {
                // Data exists, go directly to FoodWaste screen
                navigation.navigate("FoodWaste", {
                  studentProfileId,
                  orderId: lastOrderId,
                  wastePercentage: data.wastePercentage,
                  beforeArea: data.beforeArea,
                  afterArea: data.afterArea,
                });
                return;
              }
            } catch (err) {
              console.log("No existing waste data, continuing to scanner");
            }

            // Check for saved waste tracking state (before or after)
            let phase = "before";
            try {
              const savedPhase = await AsyncStorage.getItem(`wasteTracking_${lastOrderId}`);
              if (savedPhase === "after") {
                phase = "after";
              }
              console.log("Loaded saved phase:", phase);
            } catch (err) {
              console.warn("Failed to load saved state:", err);
            }

            navigation.navigate("FoodScanner", { studentProfileId, orderId: lastOrderId, scanMode: "waste", phase })
          }}
        />
        <View style={{ height: hp("3%") }} />
        <FeatureCard
          title="MBG Quiz"
          description="Siap-siap! Quiz ini bakal bikin kamu cerdas pilih makanan."
          icon={require("../../assets/icon/mbg-quiz.png")}
          onPress={() => {
            if (!lastOrderId) {
              Alert.alert(
                "MBGQuiz",
                "Kamu belum punya riwayat order. Lakukan pemesanan makanan dulu sebelum ikut MBGQuiz ya! 😊"
              );
              return;
            }

            if (!studentProfileId) {
              Alert.alert(
                "MBGQuiz",
                "Profil siswa tidak ditemukan. Coba login ulang."
              );
              return;
            }

            navigation.navigate("MBGQuiz", {
              orderId: lastOrderId,
              studentProfileId
            });
          }}
        />
        <View style={{ height: hp("10%") }} />
      </ScrollView>

      <NavBar
        items={[
          { label: "Home", icon: require("../../assets/icon/home.png"), active: true, onPress: () => { } },
          { label: "Distribution Tracker", icon: require("../../assets/icon/distribution.png"), onPress: () => navigation.navigate("DistributionTracker", { studentProfileId }) },
          { label: "Spin Wheel", icon: require("../../assets/icon/spin-wheel.png"), onPress: () => navigation.navigate("SpinWheel", { studentProfileId }), },
          { label: "Leaderboard", icon: require("../../assets/icon/leaderboard.png"), onPress: () => navigation.navigate("Leaderboard", { studentProfileId }), },
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
    gap: wp("2.5%"),
    marginTop: hp("1.25%"),
    paddingHorizontal: wp("4%"),
    paddingTop: hp("4%"),
    paddingBottom: hp("2%"),
  },
  avatar: {
    width: wp("10%"),
    height: wp("10%"),
    borderRadius: wp("5%"),
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.brandBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLetter: { fontFamily: "Fredoka-SemiBold", fontSize: RFValue(16), color: colors.brandGreen },
  userName: { fontFamily: "Fredoka-SemiBold", fontSize: RFValue(18), color: colors.textBlack, letterSpacing: 0.5 },
  content: { paddingHorizontal: wp("4%"), paddingTop: hp("1.25%") },
  avatarImage: { width: "100%", height: "100%", borderRadius: wp("5%") },
})
