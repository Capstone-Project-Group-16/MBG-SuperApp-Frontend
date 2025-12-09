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

export default function SpinWheelScreen({ navigation, route }: Props) {
    const studentProfileId = route?.params?.studentProfileId
    const [exp, setExp] = useState<string>("0")
    const [gems, setGems] = useState<string>("0")
    const [isSpinning, setIsSpinning] = useState(false)
    const [lastReward, setLastReward] = useState<string | null>(null)

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

    const handleSpin = (reward: string) => {
        setIsSpinning(false)
        setLastReward(reward)
        Alert.alert("🎉 Selamat!", `Anda memenangkan: ${reward}`)
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
                <SpinWheelItem isSpinning={isSpinning} onSpin={handleSpin} />

                {lastReward && (
                    <View style={styles.rewardBox}>
                        <Text style={styles.rewardText}>Reward Terakhir: {lastReward}</Text>
                    </View>
                )}
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
    rewardBox: {
        marginTop: hp("3%"),
        paddingHorizontal: wp("4%"),
        paddingVertical: hp("2%"),
        backgroundColor: colors.brandMint,
        borderRadius: wp("3%"),
        borderWidth: 2,
        borderColor: colors.brandBorder,
    },
    rewardText: {
        fontFamily: "Fredoka-Medium",
        fontSize: RFValue(14),
        color: colors.textBlack,
        textAlign: "center",
    },
})
