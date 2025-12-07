import { View, Text, StyleSheet, ScrollView, SafeAreaView, Pressable, Image } from "react-native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from "../../App"
import { colors } from "../theme/Color"
import StatusBar from "../components/StatusBar"
import CircularProgress from "../components/CircularProgress"
import NutritionBar from "../components/NutritionBar"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { RFValue } from "react-native-responsive-fontsize"
import { useState } from "react"

type Props = NativeStackScreenProps<RootStackParamList, "NutritionFacts">

export default function NutritionFacts({ navigation }: Props) {
    const [nutritionData] = useState({
        calorieConsumed: 1000,
        calorieLimit: 2400,
        nutrients: [
            { label: "Carbohydrate", value: 30, unit: "gm", color: colors.nutriOrange },
            { label: "Protein", value: 20, unit: "gm", color: colors.nutriBlue },
            { label: "Fats", value: 15, unit: "gm", color: colors.nutriYellow },
            { label: "Fibers", value: 25, unit: "gm", color: colors.nutriGreen },
            { label: "Sugar", value: 15, unit: "gm", color: colors.nutriPink },
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

            <Text style={styles.title}>Nutrition Facts</Text>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Calorie Circle */}
                <View style={styles.container}>
                    <CircularProgress
                        value={nutritionData.calorieConsumed}
                        max={nutritionData.calorieLimit}
                        unit="KCal"
                        gradientColors={[colors.gradDarkOrange, colors.gradLightOrange]}
                        backgroundColor={colors.bgOrange}
                        sizePercent={55}
                        strokePercent={8}
                        valueFontSize={RFValue(18)}
                        unitFontSize={RFValue(18)}
                    />
                </View>

                <Text style={styles.sectionTitle}>Nutrition Values</Text>

                {/* Nutrition Bars */}
                {nutritionData.nutrients.map((nutrient, idx) => (
                    <NutritionBar
                        key={idx}
                        label={nutrient.label}
                        value={nutrient.value}
                        unit={nutrient.unit}
                        color={nutrient.color}
                        max={40}
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
    closeIcon: { width: wp("6%"), height: wp("6%"), marginBottom: hp("0.5%"), tintColor: colors.brandBorder },
    title: {
        fontFamily: "Fredoka-SemiBold",
        fontSize: RFValue(22),
        color: colors.textBlack,
        marginTop: hp("2%"),
        marginBottom: hp("2%"),
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center"
    },
    content: { paddingHorizontal: wp("4%"), paddingTop: hp("1.5%") },
    container: { alignItems: "center", marginBottom: hp("4%"), },
    calorieValue: { fontFamily: "Fredoka-SemiBold", fontSize: RFValue(24), color: colors.textBlack },
    calorieLabel: { fontFamily: "Fredoka-Medium", fontSize: RFValue(14), color: colors.textBlack, marginTop: hp("0.5%") },
    sectionTitle: { fontFamily: "Fredoka-SemiBold", fontSize: RFValue(16), color: colors.textBlack, marginBottom: hp("2%") },
    nutrientItem: { marginBottom: hp("2.5%") },
})
