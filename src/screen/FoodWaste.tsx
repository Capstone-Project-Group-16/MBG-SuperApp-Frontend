import { View, Text, StyleSheet, ScrollView, SafeAreaView, Pressable, Image } from "react-native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from "../../App"
import { colors } from "../theme/Color"
import StatusBar from "../components/StatusBar"
import CircularProgress from "../components/CircularProgress"
import SuggestionCard from "../components/SuggestionCard"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { RFValue } from "react-native-responsive-fontsize"
import { useEffect, useState } from "react"
import { apiFetch } from "../lib/api";

type Props = NativeStackScreenProps<RootStackParamList, "FoodWaste">

export default function FoodWaste({ route, navigation }: Props) {
    const studentProfileId = route?.params?.studentProfileId
    const [exp, setExp] = useState<string>("0")
    const [gems, setGems] = useState<string>("0")
    const [wasteData] = useState({
        mealScore: 80,
        suggestion: "Mantap! Kamu sudah menghabiskan 80% makananmu. Teruskan kebiasaan baik ini agar tubuh sehat dan makanan tidak terbuang sia-sia!",
        recommendations: [
            {
                id: "1",
                title: "Ultimate Hero Feast",
                description: "Santapan para pahlawan utama yang meningkatkan daya tahan tubuh",
                trayImage: require("../../assets/icon/ultimate-hero-feast.png"),
            },
            {
                id: "2",
                title: "Speed Runner Combo",
                description: "Kombinasi makanan yang membuatmu bergerak cepat seperti kilat",
                trayImage: require("../../assets/icon/speed-runner-combo.png"),
            }
        ],
    })

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
            } catch (err) {
                console.log("Error fetch student profile:", err)
            }
        }

        loadProfile()
    }, [studentProfileId])

    return (
        <SafeAreaView style={styles.root}>
            <View style={styles.header}>
                <Pressable accessibilityRole="button" onPress={() => navigation.navigate("Home", { studentProfileId })} style={styles.close}>
                    <Image style={styles.closeIcon} source={require("../../assets/icon/close.png")} resizeMode="contain" />
                </Pressable>
                <View style={{ flex: 1 }} />
                <StatusBar
                    items={[
                        { label: "Exp", icon: require("../../assets/icon/thunder.png"), value: exp, textColor: colors.textGold },
                        { label: "Gems", icon: require("../../assets/icon/diamond.png"), value: gems, textColor: colors.textBlue },
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
    sectionTitle: { fontFamily: "Fredoka-SemiBold", fontSize: RFValue(20), color: colors.textBlack, marginLeft: hp("1.5%") },
})
