import { View, Text, StyleSheet, ScrollView, SafeAreaView, Pressable, Image, Alert } from "react-native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from "../../App"
import { colors } from "../theme/Color"
import StatusBar from "../components/StatusBar"
import CircularProgress from "../components/CircularProgress"
import SuggestionCard from "../components/SuggestionCard"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { RFValue } from "react-native-responsive-fontsize"
import { useEffect, useState } from "react"
import { apiFetch } from "../lib/api"
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = NativeStackScreenProps<RootStackParamList, "FoodWaste">

export default function FoodWaste({ route, navigation }: Props) {
    const studentProfileId = route?.params?.studentProfileId
    const orderId = route?.params?.orderId
    const wastePercentage = route?.params?.wastePercentage ?? 0
    const [exp, setExp] = useState<string>("0")
    const [gems, setGems] = useState<string>("0")
    
    // Calculate consumed percentage (opposite of waste)
    const consumedPercentage = 100 - wastePercentage

    const getWasteSuggestion = (percentage: number) => {
        if (percentage <= 10) {
            return "Mantap! Kamu sudah menghabiskan hampir semua makananmu. Kebiasaan luar biasa ini membantu mengurangi food waste!"
        } else if (percentage <= 30) {
            return "Bagus! Kamu sudah menghabiskan " + Math.round(consumedPercentage) + "% makananmu. Teruskan usahamu untuk mengurangi food waste!"
        } else if (percentage <= 50) {
            return "Cukup baik. Kamu telah menghabiskan " + Math.round(consumedPercentage) + "% makananmu. Cobalah untuk makan lebih banyak agar tidak ada yang terbuang."
        } else {
            return "Kamu masih meninggalkan " + Math.round(percentage) + "% makananmu. Coba fokus untuk menghabiskan lebih banyak agar tidak ada food waste!"
        }
    }

    const [wasteData] = useState({
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

    const handleClose = async () => {
        // Clear waste tracking state for this order
        if (orderId) {
            try {
                await AsyncStorage.removeItem(`wasteTracking_${orderId}`);
                console.log("Cleared waste tracking state for order:", orderId);
            } catch (err) {
                console.warn("Failed to clear waste tracking state:", err);
            }
        }
        navigation.navigate("Home", { studentProfileId })
    }

    return (
        <SafeAreaView style={styles.root}>
            <View style={styles.header}>
                <Pressable accessibilityRole="button" onPress={handleClose} style={styles.close}>
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
                        value={consumedPercentage}
                        max={100}
                        unit="%"
                        gradientColors={[colors.gradDarkGreen, colors.gradLightGreen]}
                        backgroundColor={colors.bgGreen}
                        sizePercent={55}
                        strokePercent={8}
                        valueFontSize={RFValue(30)}
                    />
                    <Text style={styles.wasteSubtext}>Consumed</Text>
                </View>

                {/* Suggestion */}
                <SuggestionCard label="Suggestion" text={getWasteSuggestion(wastePercentage)} />

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
    wasteSubtext: { fontSize: RFValue(14), color: colors.textGray, fontFamily: "Jost" },
    sectionTitle: { fontFamily: "Fredoka-SemiBold", fontSize: RFValue(20), color: colors.textBlack, marginLeft: hp("1.5%") },
})
