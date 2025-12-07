"use client"

import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { RFValue } from "react-native-responsive-fontsize"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from "../../App"
import { colors } from "../theme/Color"
import StatusBar from "../components/StatusBar"
import MenuItemCard from "../components/MenuItemCard"

type Props = NativeStackScreenProps<RootStackParamList, "FoodCustomizer">

const MENU_ITEMS = [
  {
    id: "1",
    title: "Ultimate Hero Feast",
    description: "Santapan para pahlawan utama yang meningkatkan daya tahan tubuh",
    price: "Rp15.000",
    foods: [
      { id: "1", label: "Milk", icon: require("../../assets/icon/menu/milk.png") },
      { id: "2", label: "Banana", icon: require("../../assets/icon/menu/banana.png") },
      { id: "3", label: "Broccoli", icon: require("../../assets/icon/menu/broccoli.png") },
      { id: "4", label: "Rice", icon: require("../../assets/icon/menu/rice.png") },
      { id: "5", label: "Chicken", icon: require("../../assets/icon/menu/chicken.png") },
    ],
  },
  {
    id: "2",
    title: "Speed Runner Combo",
    description: "Kombinasi makanan yang membuatmu bergerak cepat seperti kilat",
    price: "Rp15.000",
    foods: [
      { id: "1", label: "Orange Juice", icon: require("../../assets/icon/menu/orange-juice.png") },
      { id: "2", label: "Watermelon", icon: require("../../assets/icon/menu/watermelon.png") },
      { id: "3", label: "Carrot", icon: require("../../assets/icon/menu/carrot.png") },
      { id: "4", label: "Rice", icon: require("../../assets/icon/menu/rice.png") },
      { id: "5", label: "Fish", icon: require("../../assets/icon/menu/fish.png") },
    ],
  },
  {
    id: "3",
    title: "Nature Guardian Set",
    description: "Bekal dari hutan pelindung yang meningkatkan kekuatan alami tubuh",
    price: "Rp15.000",
    foods: [
      { id: "1", label: "Apple Juice", icon: require("../../assets/icon/menu/apple-juice.png") },
      { id: "2", label: "Papaya", icon: require("../../assets/icon/menu/papaya.png") },
      { id: "3", label: "Lettuce", icon: require("../../assets/icon/menu/lettuce.png") },
      { id: "4", label: "Potato", icon: require("../../assets/icon/menu/potato.png") },
      { id: "5", label: "Tempe", icon: require("../../assets/icon/menu/tempe.png") },
    ],
  },
  {
    id: "4",
    title: "Warrior Meal Boost",
    description: "Makanan favorit para pejung agar dapat memulihkan tenaga",
    price: "Rp15.000",
    foods: [
      { id: "1", label: "Oat Milk", icon: require("../../assets/icon/menu/oat-milk.png") },
      { id: "2", label: "Orange", icon: require("../../assets/icon/menu/orange.png") },
      { id: "3", label: "Tomato", icon: require("../../assets/icon/menu/tomato.png") },
      { id: "4", label: "Bread", icon: require("../../assets/icon/menu/bread.png") },
      { id: "5", label: "Eggs", icon: require("../../assets/icon/menu/eggs.png") },
    ],
  },
  {
    id: "5",
    title: "Power Up Starter",
    description: "Paket pemula yang membangkitkan energi dasar tubuh",
    price: "Rp15.000",
    foods: [
      { id: "1", label: "Milk", icon: require("../../assets/icon/menu/milk.png") },
      { id: "2", label: "Watermelon", icon: require("../../assets/icon/menu/watermelon.png") },
      { id: "3", label: "Lettuce", icon: require("../../assets/icon/menu/lettuce.png") },
      { id: "4", label: "Rice", icon: require("../../assets/icon/menu/rice.png") },
      { id: "5", label: "Eggs", icon: require("../../assets/icon/menu/eggs.png") },
    ],
  },
]

export default function FoodCustomizer({ navigation }: Props) {
  const handleOrder = (menuItem: (typeof MENU_ITEMS)[0]) => {
    navigation.navigate("FoodOrder", { selectedFoods: menuItem.foods })
  }

  return (
    <SafeAreaView style={styles.root}>
      {/* Header with stats */}
      <View style={styles.header}>
        <StatusBar
          items={[
            { label: "Money", icon: require("../../assets/icon/money.png"), value: "70.000", textColor: colors.textGreen },
          ]}
        />
        <View style={{ flex: 1 }} />
        <StatusBar
          items={[
            { label: "Exp", icon: require("../../assets/icon/thunder.png"), value: "70000", textColor: colors.textGold },
            { label: "Gems", icon: require("../../assets/icon/diamond.png"), value: "70000", textColor: colors.textBlue },
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
