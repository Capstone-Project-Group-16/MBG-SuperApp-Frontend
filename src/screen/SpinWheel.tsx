"use client"

import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert, Pressable, Image } from "react-native"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { RFValue } from "react-native-responsive-fontsize"
import { useEffect, useState } from "react"
import { apiFetch } from "../lib/api";
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from "../../App"
import { colors } from "../theme/Color"
import StatusBar from "../components/StatusBar"
import SpinWheelItem from "../components/SpinWheelItem"
import NavBar from "../components/NavBar"

type Props = NativeStackScreenProps<RootStackParamList, "SpinWheel">

interface Prize {
    prizeId: number
    prizeName: string
    prizeDescription: string
    prizeType: string
    prizeImageLink: string | null
}

export default function SpinWheelScreen({ navigation, route }: Props) {
    const studentProfileId = route?.params?.studentProfileId
    const [exp, setExp] = useState<string>("0")
    const [gems, setGems] = useState<string>("0")
    const [isSpinning, setIsSpinning] = useState(false)
    const [prizes, setPrizes] = useState<Prize[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadData = async () => {
            setLoading(true)
            try {
                if (studentProfileId) {
                    const { res: profileRes, data: profileData } = await apiFetch(
                        `/api/account/student-profile/get/${studentProfileId}`,
                        { method: "GET" },
                    )

                    if (profileRes.ok) {
                        setExp(String(profileData?.expPoints ?? "0"))
                        setGems(String(profileData?.mbgPoints ?? "0"))
                    }
                }
            } catch (err) {
                console.log("[v0] Error loading data:", err)
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [studentProfileId])

    const WHEEL_SEGMENTS = [
        { id: 1, label: "100 Exp", icon: require("../../assets/icon/thunder.png") },
        { id: 2, label: "200 Exp", icon: require("../../assets/icon/thunder.png") },
        { id: 3, label: "500 Exp", icon: require("../../assets/icon/thunder.png") },
        { id: 4, label: "1000 Exp", icon: require("../../assets/icon/thunder.png") },
        { id: 5, label: "200 MBG", icon: require("../../assets/icon/diamond.png") },
        { id: 6, label: "800 MBG", icon: require("../../assets/icon/diamond.png") },
        { id: 7, label: "Sticker", icon: require("../../assets/icon/sticker.png") },
        { id: 8, label: "Sticker", icon: require("../../assets/icon/sticker.png") },
    ];

    const handleSpin = (result: {
        prizeId: number
        prizeName: string
        prizeType: string
        studentExpPoints: number
        studentMbgPoints: number
    }) => {
        setIsSpinning(false)
        setExp(String(result.studentExpPoints))
        setGems(String(result.studentMbgPoints))
        Alert.alert("🎉 Selamat!", `Anda memenangkan: ${result.prizeName}`, [{ text: "OK", onPress: () => { } }])
    }

    return (
        <SafeAreaView style={styles.root}>
            <View style={styles.header}>
                <Pressable accessibilityRole="button" onPress={() => navigation.goBack()} style={styles.back}>
                    <Image style={styles.backIcon} source={require("../../assets/icon/back.png")} resizeMode="contain" />
                </Pressable>

                <View style={{ flex: 1 }} />
                <StatusBar
                    items={[
                        { label: "Exp", icon: require("../../assets/icon/thunder.png"), value: exp, textColor: colors.textGold },
                        { label: "Gems", icon: require("../../assets/icon/diamond.png"), value: gems, textColor: colors.textBlue },
                    ]}
                />
            </View>

            <Text style={styles.title}>Spin Wheel</Text>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <SpinWheelItem isSpinning={isSpinning} onSpin={handleSpin} segments={WHEEL_SEGMENTS} studentProfileId={studentProfileId} />
            </ScrollView>

            <NavBar
                items={[
                    { label: "Home", icon: require("../../assets/icon/home.png"), onPress: () => navigation.navigate("Home", { studentProfileId }) },
                    { label: "Distribution Tracker", icon: require("../../assets/icon/distribution.png"), onPress: () => navigation.navigate("DistributionTracker", { studentProfileId }) },
                    { label: "Spin Wheel", icon: require("../../assets/icon/spin-wheel.png"), active: true, onPress: () => { } },
                    { label: "Leaderboard", icon: require("../../assets/icon/leaderboard.png"), onPress: () => navigation.navigate("Leaderboard", { studentProfileId }), },
                ]}
            />
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
    back: { paddingVertical: hp("1%"), paddingHorizontal: wp("1%") },
    backIcon: {
        width: wp("6%"),
        height: wp("6%"),
        marginBottom: hp("0.5%"),
        tintColor: colors.brandBorder
    },
    title: {
        fontFamily: "Fredoka-SemiBold",
        fontSize: RFValue(22),
        color: colors.textBlack,
        marginBottom: hp("2%"),
        paddingTop: hp("1.5%"),
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center"
    },
    content: {
        paddingHorizontal: wp("4%"),
        paddingVertical: hp("2%"),
        alignItems: "center",
    },
})
