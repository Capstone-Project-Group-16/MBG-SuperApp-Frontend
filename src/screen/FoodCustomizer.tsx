"use client"

import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator } from "react-native"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { RFValue } from "react-native-responsive-fontsize"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from "../../App"
import { colors } from "../theme/Color"
import StatusBar from "../components/StatusBar"
import MenuItemCard from "../components/MenuItemCard"
import { apiFetch } from "../lib/api"

type Props = NativeStackScreenProps<RootStackParamList, "FoodCustomizer">

type FoodMenuItem = {
  foodId: number
  foodName: string
  foodPrice: number
  foodImageLink: string | null
}

export default function FoodCustomizer({ navigation, route }: Props) {
  const studentProfileId = route.params?.studentProfileId

  const [budget, setBudget] = useState<string>("0")
  const [exp, setExp] = useState<string>("0")
  const [gems, setGems] = useState<string>("0")
  const [menuItems, setMenuItems] = useState<FoodMenuItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const loadData = async () => {
      if (!studentProfileId) {
        console.warn("studentProfileId tidak ada di route params")
        setLoading(false)
        return
      }

      try {
        // 1) Ambil student profile -> budget, exp, gems
        const { res: profRes, data: profData } = await apiFetch(
          `/api/account/student-profile/get/${studentProfileId}`,
          { method: "GET" }
        )

        if (profRes.ok && profData) {
          setBudget(String(profData.budget ?? "0"))
          setExp(String(profData.expPoints ?? "0"))
          setGems(String(profData.mbgPoints ?? "0"))
        } else {
          console.log("Gagal fetch student profile:", profData)
        }

        // 2) Ambil menu harian dari BE
        const { res: menuRes, data: menuData } = await apiFetch(
          `/api/mbg-food-customizer/food-supply/menu`,
          {
            method: "GET",
          }
        )

        if (!menuRes.ok) {
          console.log("Gagal fetch student menu:", menuData)
        } else {
          const items: FoodMenuItem[] =
            menuData?.items?.map((f: any) => ({
              foodId: f.foodId,
              foodName: f.foodName,
              foodPrice: f.foodPrice,
              foodImageLink: f.foodImageLink ?? null,
            })) ?? []
          setMenuItems(items)
        }
      } catch (err) {
        console.log("Error load data FoodCustomizer:", err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [studentProfileId])

  const handleOrder = (item: FoodMenuItem) => {
    navigation.navigate("FoodOrder", {
      studentProfileId,
      foodId: item.foodId,
      foodName: item.foodName,
      foodPrice: item.foodPrice,
      foodImageLink: item.foodImageLink,
      tray: null, // ✅ supaya sesuai dengan RootStackParamList
    })
  }

  return (
    <SafeAreaView style={styles.root}>
      {/* Header with stats */}
      <View style={styles.header}>
        <StatusBar
          items={[
            {
              label: "Money",
              icon: require("../../assets/icon/money.png"),
              value: budget,
              textColor: colors.textGreen,
            },
          ]}
        />
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

      <Text style={styles.title}>MBG Menu</Text>

      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {menuItems.map((item) => (
            <MenuItemCard
              key={item.foodId.toString()}
              item={{
                id: item.foodId.toString(),
                title: item.foodName,
                description: "", // nanti bisa diisi dari BE kalau mau
                price: `Rp${item.foodPrice.toLocaleString("id-ID")}`,
                imageUrl: item.foodImageLink ?? undefined,
              }}
              onOrder={() => handleOrder(item)}
            />
          ))}
          <View style={{ height: hp("2%") }} />
        </ScrollView>
      )}
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
    textAlign: "center",
  },
  scrollContent: { paddingBottom: hp("2%") },
})
