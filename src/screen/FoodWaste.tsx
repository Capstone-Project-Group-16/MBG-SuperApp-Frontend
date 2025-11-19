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
                title: "Meals 1",
                description: "Gurnihya ikan segar, nasi pulen, dan sayur penuh vitamin bikin kuat seharian!",
                icon: require("../../assets/icon/bento-1.png"),
            },
            {
                title: "Meals 2",
                description: "Nasi goreng dengan ikan, telur, dan sayur gula bikin semangat belajar!",
                icon: require("../../assets/icon/bento-2.png"),
            },
        ],
    })

    const [likedItems, setLikedItems] = useState<{ [key: number]: boolean }>({})

    const toggleLike = (index: number) => {
        setLikedItems((prev) => ({
            ...prev,
            [index]: !prev[index],
        }))
    }

    return (
        <SafeAreaView style={styles.root}>
            <View style={styles.header}>
                <Pressable accessibilityRole="button" onPress={() => navigation.navigate("Home")} style={styles.close}>
                    <Image style={styles.closeIcon} source={require("../../assets/icon/close.png")} resizeMode="contain" />
                </Pressable>
                <View style={{ flex: 1 }} />
                <StatusBar
                    items={[
                        { label: "Energy", icon: require("../../assets/icon/thunder.png"), value: "70000", textColor: colors.textGold },
                        { label: "Hearts", icon: require("../../assets/icon/diamond.png"), value: "70000", textColor: colors.textBlue },
                    ]}
                />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Food Waste Analysis</Text>

                <View style={styles.circleContainer}>
                    <Text style={styles.scoreLabel}>Meal Score</Text>
                    <CircularProgress
                        value={wasteData.mealScore}
                        max={100}
                        unit="%"
                        gradientColors={["#3DD806", "#3DD806"]}
                        backgroundColor="#7BFF5A"
                        sizePercent={50}
                        strokePercent={6}
                        valueFontSize={RFValue(28)}
                        unitFontSize={RFValue(28)}
                    />
                </View>

                <SuggestionCard label="Suggestion" text={wasteData.suggestion} />

                {/* Recommendations */}
                <Text style={styles.sectionTitle}>Recommendation</Text>
                {wasteData.recommendations.map((rec, idx) => (
                    <SuggestionCard
                        key={idx}
                        isRecommendation={true}
                        mealIcon={rec.icon}
                        mealTitle={rec.title}
                        mealDescription={rec.description}
                        label=""
                        text=""
                        isLiked={likedItems[idx] || false}
                        onLikPress={() => toggleLike(idx)}
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
    closeIcon: { width: wp("6%"), height: wp("6%"), marginBottom: hp("0.5%") }, content: { paddingHorizontal: wp("4%"), paddingTop: hp("1.5%") },
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
    scoreLabel: { fontFamily: "Fredoka-SemiBold", fontSize: RFValue(16), color: colors.textBlack },
    sectionTitle: { fontFamily: "Fredoka-SemiBold", fontSize: RFValue(16), color: colors.textBlack, marginBottom: hp("2%") },
})
