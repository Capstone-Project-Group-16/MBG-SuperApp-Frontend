"use client"

import { View, Text, StyleSheet, ScrollView, SafeAreaView, ImageBackground } from "react-native"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { RFPercentage, RFValue } from "react-native-responsive-fontsize"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from "../../App"
import { colors } from "../theme/Color"
import StatusBar from "../components/StatusBar"
import FoodTray from "../components/FoodTray"
import Button from "../components/Button"

type Props = NativeStackScreenProps<RootStackParamList, "FoodOrder">

const MENU_ITEMS = [
    {
        id: "1",
        title: "Ultimate Hero Feast",
        description:
            "Santapan para pahlawan utama yang meningkatkan daya tahan tubuh",
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
        description:
            "Bekal dari hutan pelindung yang meningkatkan kekuatan alami tubuh",
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
        description:
            "Makanan favorit para pejung agar dapat memulihkan tenaga",
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

export default function FoodOrder({ route, navigation }: Props) {
    const { selectedFoods } = route.params

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

            <View style={styles.trayWrapper}>
                {/* Background for food tray */}
                <ImageBackground
                    source={require("../../assets/icon/table.png")}
                    style={styles.tableBackground}
                    resizeMode="cover"
                >
                    {/* Food tray with selected items */}
                    <View style={styles.trayContainer}>
                        <FoodTray selectedFoods={selectedFoods} size={0.9} />
                    </View>

                    {/* Order button */}
                    <View style={styles.buttonContainer}>
                        <Button title="ORDER NOW" onPress={handleOrderNow} />
                    </View>
                </ImageBackground>
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
    trayWrapper: {
        flex: 1,
        width: "100%",
        overflow: "hidden",
    },
    tableBackground: {
        width: "100%",
        height: "90%",
        justifyContent: "flex-end",
        marginTop: hp("15%"),
    },
    trayContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginBottom: hp("2.5%"),
    },
    buttonContainer: { paddingHorizontal: wp("5%"), paddingBottom: hp("15%") },
})
