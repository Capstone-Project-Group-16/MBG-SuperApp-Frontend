"use client"

import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { RFPercentage, RFValue } from "react-native-responsive-fontsize"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from "../../App"
import { colors } from "../theme/Color"
import StatusBar from "../components/StatusBar"
import FoodTray from "../components/FoodTray"
import Button from "../components/Button"

type Props = NativeStackScreenProps<RootStackParamList, "FoodOrder">

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

export default function FoodOrder({ route, navigation }: Props) {
    const { selectedItems } = route.params
    const selectedFoods = FOOD_ITEMS.filter((item) => selectedItems.includes(item.id))

    const handleOrderNow = () => {
        console.log("[v0] Order placed with items:", selectedFoods)
        navigation.navigate("Home")
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

            {/* Character avatar */}
            <View style={styles.avatarContainer}>
                <Text style={styles.avatar}>👩</Text>
            </View>

            {/* Food tray with selected items */}
            <View style={styles.trayContainer}>
                <FoodTray selectedFoods={selectedFoods} />
            </View>

            {/* Order button */}
            <View style={styles.buttonContainer}>
                <Button title="ORDER NOW" onPress={handleOrderNow} />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: colors.white,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: wp("2.5%"),
        paddingHorizontal: wp("4%"),
        paddingTop: hp("4%"),
        paddingBottom: hp("1.5%"),
        marginTop: hp("1.25%"),
    },
    avatarContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: hp("3%"),
    },
    avatar: {
        fontSize: RFValue(100),
    },
    trayContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: wp("4%"),
        marginBottom: hp("3%"),
    },
    buttonContainer: { paddingHorizontal: wp("4%"), paddingBottom: hp("7%"),},
})
