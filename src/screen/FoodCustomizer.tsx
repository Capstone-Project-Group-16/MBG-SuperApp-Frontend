"use client"

import { View, Text, StyleSheet, ScrollView, SafeAreaView, FlatList, ImageBackground, Image, Dimensions } from "react-native"
import { useState } from "react"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from "../../App"
import { colors } from "../theme/Color"
import StatusBar from "../components/StatusBar"
import FoodItem from "../components/FoodItem"
import Button from "../components/Button"

type Props = NativeStackScreenProps<RootStackParamList, "FoodCustomizer">

const FOOD_ITEMS = [
  { id: "1", label: "Rice", icon: require("../../assets/icon/menu/rice.png") },
  { id: "2", label: "Potato", icon: require("../../assets/icon/menu/potato.png") },
  { id: "3", label: "Bread", icon: require("../../assets/icon/menu/bread.png") },
  { id: "4", label: "Corn", icon: require("../../assets/icon/menu/corn.png") },
  { id: "5", label: "Chicken", icon: require("../../assets/icon/menu/chicken.png") },
  { id: "6", label: "Eggs", icon: require("../../assets/icon/menu/eggs.png") },
  { id: "7", label: "Fish", icon: require("../../assets/icon/menu/fish.png") },
  { id: "8", label: "Tempe", icon: require("../../assets/icon/menu/tempe.png") },
  { id: "9", label: "Broccoli", icon: require("../../assets/icon/menu/broccoli.png") },
  { id: "10", label: "Carrot", icon: require("../../assets/icon/menu/carrot.png") },
  { id: "11", label: "Tomato", icon: require("../../assets/icon/menu/tomato.png") },
  { id: "12", label: "Lettuce", icon: require("../../assets/icon/menu/lettuce.png") },
  { id: "13", label: "Watermelon", icon: require("../../assets/icon/menu/watermelon.png") },
  { id: "14", label: "Orange", icon: require("../../assets/icon/menu/orange.png") },
  { id: "15", label: "Banana", icon: require("../../assets/icon/menu/banana.png") },
  { id: "16", label: "Papaya", icon: require("../../assets/icon/menu/papaya.png") },
  { id: "17", label: "Milk", icon: require("../../assets/icon/menu/milk.png") },
  { id: "18", label: "Orange Juice", icon: require("../../assets/icon/menu/orange-juice.png") },
  { id: "19", label: "Apple Juice", icon: require("../../assets/icon/menu/apple-juice.png") },
  { id: "20", label: "Coconut Water", icon: require("../../assets/icon/menu/coconut.png") },
]

export default function FoodCustomizer({ navigation }: Props) {
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const screenWidth = Dimensions.get("window").width

  const toggleItem = (id: string) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const handleMakeFood = () => {
    console.log("[v0] Selected items:", selectedItems)
    // TODO: Navigate to result screen or show confirmation
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

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Food grid */}
        <View style={styles.refrigeratorWrapper}>
          <ImageBackground
            source={require("../../assets/icon/refrigerator.png")}
            style={[styles.refrigeratorContainer, { width: screenWidth * 0.9 }]}
            imageStyle={styles.refrigeratorImage}
            resizeMode="contain"
          >
            <View style={styles.gridContainer}>
              <FlatList
                data={FOOD_ITEMS}
                numColumns={4}
                scrollEnabled={false}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <FoodItem 
                    id={item.id} 
                    label={item.label}
                    icon={item.icon}
                    isSelected={selectedItems.includes(item.id)} 
                    onToggle={() => toggleItem(item.id)} 
                  />
              )}
                columnWrapperStyle={styles.gridRow}
              />
            </View>
          </ImageBackground>
        </View>

        {/* Make Food button */}
        <View style={styles.buttonContainer}>
          <Button title="MAKE FOOD" onPress={handleMakeFood} />
        </View>
        
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 12,
    marginTop: 10,
  },
  scrollContent: { paddingBottom: 20 },
  refrigeratorWrapper: { alignItems: "center", marginTop: -4 },
  refrigeratorContainer: { 
    aspectRatio: 0.5,
    borderRadius: 16, 
    overflow: "hidden", 
    paddingVertical: Dimensions.get("window").height * 0.133, 
    paddingHorizontal: Dimensions.get("window").width * 0.03,
    justifyContent: "center",
  },
  refrigeratorImage: { borderRadius: 16 },
  gridContainer: { flex: 1 },
  gridRow: { justifyContent: "center", marginBottom: Dimensions.get("window").width * 0.0282 },
  buttonContainer: { paddingHorizontal: 16, marginTop: -4, marginBottom: -8 },
})
