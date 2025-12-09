"use client"

import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { RFValue } from "react-native-responsive-fontsize"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from "../../App"
import { colors } from "../theme/Color"
import { useEffect, useState } from "react"
import { apiFetch } from "../lib/api";
import StatusBar from "../components/StatusBar"
import MenuItemCard from "../components/MenuItemCard"

type Props = NativeStackScreenProps<RootStackParamList, "FoodCustomizer">

const MENU_ITEMS = [
  {
    id: "1",
    title: "Ultimate Hero Feast",
    description: "Santapan para pahlawan utama yang meningkatkan daya tahan tubuh",
    price: "Rp15.000",
    trayImage: require("../../assets/icon/ultimate-hero-feast.png"),
  },
  {
    id: "2",
    title: "Speed Runner Combo",
    description: "Kombinasi makanan yang membuatmu bergerak cepat seperti kilat",
    price: "Rp15.000",
    trayImage: require("../../assets/icon/speed-runner-combo.png"),
  },
  {
    id: "3",
    title: "Nature Guardian Set",
    description: "Bekal dari hutan pelindung yang meningkatkan kekuatan alami tubuh",
    price: "Rp15.000",
    trayImage: require("../../assets/icon/nature-guardian-set.png"),
  },
  {
    id: "4",
    title: "Warrior Meal Boost",
    description: "Makanan favorit para pejung agar dapat memulihkan tenaga",
    price: "Rp15.000",
    trayImage: require("../../assets/icon/warrior-meal-boost.png"),
  },
  {
    id: "5",
    title: "Power Up Starter",
    description: "Paket pemula yang membangkitkan energi dasar tubuh",
    price: "Rp15.000",
    trayImage: require("../../assets/icon/power-up-starter.png"),
  },
]

export default function FoodCustomizer({ route, navigation }: Props) {
  const studentProfileId = route?.params?.studentProfileId
  const [exp, setExp] = useState<string>("0")
  const [gems, setGems] = useState<string>("0")
  const [budget, setBudget] = useState<string>("0")

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
        setBudget(String(data?.budget ?? "0"))
      } catch (err) {
        console.log("Error fetch student profile:", err)
      }
    }

    loadProfile()
  }, [studentProfileId])

  const handleOrder = (menuItem: (typeof MENU_ITEMS)[0]) => {
    navigation.navigate("FoodOrder", { studentProfileId, menuId: menuItem.id, menuTitle: menuItem.title, price: menuItem.price, tray: menuItem.trayImage })
  }

  return (
    <SafeAreaView style={styles.root}>
      {/* Header with stats */}
      <View style={styles.header}>
        <StatusBar
          items={[
            { label: "Money", icon: require("../../assets/icon/money.png"), value: budget, textColor: colors.textGreen },
          ]}
        />
        <View style={{ flex: 1 }} />
        <StatusBar
          items={[
            { label: "Exp", icon: require("../../assets/icon/thunder.png"), value: exp, textColor: colors.textGold },
            { label: "Gems", icon: require("../../assets/icon/diamond.png"), value: gems, textColor: colors.textBlue },
          ]}
        />
      </View>

      {/* Title */}
      <Text style={styles.title}>MBG Menu</Text>

      {/* Menu Items List */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {MENU_ITEMS.map((item) => (
          <MenuItemCard key={item.id} item={item} onOrder={() => handleOrder(item)} />
        ))}
        <View style={{ height: hp("2%") }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("2.5%"),
    paddingHorizontal: wp("4%"),
    paddingTop: hp("4%"),
    paddingBottom: hp("1.5%"),
    marginTop: hp("1.25%"),
  },
  title: {
    fontFamily: "Fredoka-SemiBold",
    fontSize: RFValue(22),
    color: colors.textBlack,
    marginBottom: hp("0.5%"),
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center"
  },
  scrollContent: { paddingBottom: hp("2%") },
})
