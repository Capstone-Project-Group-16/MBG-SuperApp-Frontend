"use client"

import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from "../../App"
import { colors } from "../theme/Color"
import StatusBar from "../components/StatusBar"
import FeatureCard from "../components/FeatureCard"
import NavBar from "../components/NavBar"

type Props = NativeStackScreenProps<RootStackParamList, "Home">

export default function HomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarLetter}>E</Text>
        </View>
        <Text style={styles.userName}>Erina</Text>
        <View style={{ flex: 1 }} />
        <StatusBar
          items={[
            { label: "Exp", icon: require("../../assets/icon/thunder.png"), value: "70000", textColor: colors.textGold },
            { label: "Gems", icon: require("../../assets/icon/diamond.png"), value: "70000", textColor: colors.textBlue },
          ]}
        />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <FeatureCard
          title="Food Customizer"
          description="Pilih menu makan siangmu sendiri. Seru kayak main game!"
          icon={require("../../assets/icon/food-customizer.png")}
          onPress={() => {}}
        />
        <View style={{ height: 24 }} />
        <FeatureCard
          title="Nutrition Analysis"
          description="Scan makananmu, lihat kekuatan nutrisi di baliknya!"
          icon={require("../../assets/icon/nutrition-analysis.png")}
          onPress={() => {}}
        />
        <View style={{ height: 24 }} />
        <FeatureCard
          title="Food Waste"
          description="Foto piringmu, lihat seberapa jago kamu ngabisin makan!"
          icon={require("../../assets/icon/food-waste.png")}
          onPress={() => {}}
        />
        <View style={{ height: 24 }} />
        <FeatureCard
          title="MBG Quiz"
          description="Siap-siap! Quiz ini bakal bikin kamu cerdas pilih makanan."
          icon={require("../../assets/icon/mbg-quiz.png")}
          onPress={() => {}}
        />
        <View style={{ height: 80 }} />
      </ScrollView>

      <NavBar
        items={[
          { label: "Home", icon: require("../../assets/icon/home.png"), active: true, onPress: () => {} },
          { label: "Distribution", icon: require("../../assets/icon/distribution.png"), onPress: () => {} },
          { label: "Spin Wheel", icon: require("../../assets/icon/spin-wheel.png"), onPress: () => {} },
          { label: "Leaderboard", icon: require("../../assets/icon/leaderboard.png"), onPress: () => {} },
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
    gap: 10,
    marginTop: 10,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 22,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 24,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.brandBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLetter: { fontFamily: "Fredoka-SemiBold", fontSize: 16, color: colors.brandGreen },
  userName: { fontFamily: "Fredoka-SemiBold", fontSize: 18, color: colors.textBlack, letterSpacing: 0.5 },
  content: { paddingHorizontal: 16, paddingTop: 10 },
})
