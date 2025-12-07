import { View, Text, StyleSheet, ScrollView, SafeAreaView, Pressable, Image } from "react-native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from "../../App"
import { colors } from "../theme/Color"
import StatusBar from "../components/StatusBar"
import CircularProgress from "../components/CircularProgress"
import SuggestionCard from "../components/SuggestionCard"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { RFValue } from "react-native-responsive-fontsize"
import { useState } from "react"

type Props = NativeStackScreenProps<RootStackParamList, "FoodWaste">

export default function FoodWaste({ navigation }: Props) {
    const [wasteData] = useState({
        mealScore: 80,
        suggestion: "Mantap! Kamu sudah menghabiskan 80% makananmu. Teruskan kebiasaan baik ini agar tubuh sehat dan makanan tidak terbuang sia-sia!",
        recommendations: [
            {
                id: "1",
                title: "Ultimate Hero Feast",
                description: "Santapan para pahlawan utama yang meningkatkan daya tahan tubuh",
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
                foods: [
                    { id: "1", label: "Orange Juice", icon: require("../../assets/icon/menu/orange-juice.png") },
                    { id: "2", label: "Watermelon", icon: require("../../assets/icon/menu/watermelon.png") },
                    { id: "3", label: "Carrot", icon: require("../../assets/icon/menu/carrot.png") },
                    { id: "4", label: "Rice", icon: require("../../assets/icon/menu/rice.png") },
                    { id: "5", label: "Fish", icon: require("../../assets/icon/menu/fish.png") },
                ],
            }
        ],
    })

    return (
        <SafeAreaView style={styles.root}>
            <View style={styles.header}>
                <Pressable accessibilityRole="button" onPress={() => navigation.navigate("Home")} style={styles.close}>
                    <Image style={styles.closeIcon} source={require("../../assets/icon/close.png")} resizeMode="contain" />
                </Pressable>
                <View style={{ flex: 1 }} />
                <StatusBar
                    items={[
                        { label: "Exp", icon: require("../../assets/icon/thunder.png"), value: "70000", textColor: colors.textGold },
                        { label: "Gems", icon: require("../../assets/icon/diamond.png"), value: "70000", textColor: colors.textBlue },
                    ]}
                />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Food Waste Analysis</Text>

                <View style={styles.circleContainer}>
                    <CircularProgress
                        value={wasteData.mealScore}
                        max={100}
                        unit="%"
                        gradientColors={[colors.gradDarkGreen, colors.gradLightGreen]}
                        backgroundColor={colors.bgGreen}
                        sizePercent={55}
                        strokePercent={8}
                        valueFontSize={RFValue(30)}
                    />
                </View>
                
                {/* Suggestion */}
                <SuggestionCard label="Suggestion" text={wasteData.suggestion} />

                {/* Recommendations */}
                <Text style={styles.sectionTitle}>Recommendation</Text>
                {wasteData.recommendations.map((rec, idx) => (
                    <SuggestionCard
                        key={idx}
                        item={rec}
                    />
                ))}

                <View style={{ height: hp("4%") }} />
            </ScrollView>
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
    close: { paddingVertical: hp("1%"), paddingHorizontal: wp("1%") },
    closeIcon: {
        width: wp("6%"),
        height: wp("6%"),
        marginBottom: hp("0.5%"),
        tintColor: colors.brandBorder
    },
    content: { paddingHorizontal: wp("4%"), paddingTop: hp("1.5%") },
    title: {
        fontFamily: "Fredoka-SemiBold",
        fontSize: RFValue(22),
        color: colors.textBlack,
        marginBottom: hp("2%"),
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center"
    },
    circleContainer: { alignItems: "center", marginBottom: hp("3%"), gap: hp("1.5%") },
    sectionTitle: { fontFamily: "Fredoka-SemiBold", fontSize: RFValue(20), color: colors.textBlack, marginLeft: hp("1.5%")},
})
