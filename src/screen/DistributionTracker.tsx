"use client"

import { View, Text, StyleSheet, ScrollView, SafeAreaView, Pressable, Image } from "react-native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from "../../App"
import { colors } from "../theme/Color"
import StatusBar from "../components/StatusBar"
import TimelineItem from "../components/TimelineItem"
import Button from "../components/Button"
import NavBar from "../components/NavBar"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { RFValue } from "react-native-responsive-fontsize"
import { useEffect, useState } from "react"
import { apiFetch } from "../lib/api";

type Props = NativeStackScreenProps<RootStackParamList, "DistributionTracker">

export default function DistributionTracker({ navigation, route }: Props) {
    const studentProfileId = route?.params?.studentProfileId
    const [exp, setExp] = useState<string>("0")
    const [gems, setGems] = useState<string>("0")
    const [completedIndex, setCompletedIndex] = useState(2)

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

    const timelineData = [
        { label: "Catering ready to send MBG", time: "06:00 AM" },
        { label: "Driver picks up MBG from catering", time: "06:30 AM" },
        { label: "Driver delivers to school" },
        { label: "Student finished eating" },
        { label: "Driver picks up from school" },
        { label: "Catering receives plate back" },
    ]

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

            <Text style={styles.title}>MBG Progress Status</Text>

            {/* Current Status Card */}
                <View style={styles.currentStatusCard}>
                    <View style={styles.currentStatusContent}>
                        <Text style={styles.statusLabel}>Current Status</Text>
                        <Text style={styles.statusText}>Food being delivered</Text>
                    </View>
                    <Image style={styles.truckIcon} source={require("../../assets/icon/distribution.png")} resizeMode="contain" />
                </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Timeline */}
                <View style={styles.timeline}>
                    {timelineData.map((item, idx) => (
                        <TimelineItem
                            key={idx}
                            label={item.label}
                            time={item.time}
                            isStatus={item.time ? undefined : idx === completedIndex ? true : false}
                            isLast={idx === timelineData.length - 1}
                        />
                    ))}
                </View>
            </ScrollView>

            {/* Button */}
            <View style={styles.buttonContainer}>
                <Button
                    title="FOOD RECEIVED"
                    onPress={() => {
                        setCompletedIndex(timelineData.length)
                        navigation.navigate("FoodScanner", { studentProfileId, scanMode: "distribution" })
                    }}
                />
            </View>

            <NavBar
                items={[
                    { label: "Home", icon: require("../../assets/icon/home.png"), onPress: () => navigation.navigate("Home", { studentProfileId }) },
                    { label: "Distribution Tracker", icon: require("../../assets/icon/distribution.png"), active: true, onPress: () => { } },
                    { label: "Spin Wheel", icon: require("../../assets/icon/spin-wheel.png"), onPress: () => navigation.navigate("SpinWheel", { studentProfileId }), },
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
    content: { paddingHorizontal: wp("4%"), paddingBottom: hp("2%") },
    currentStatusCard: {
        flexDirection: "row",
        marginHorizontal: wp("4%"),
        alignItems: "center",
        padding: wp("4.5%"),
        paddingBottom: wp("5%"),
        paddingHorizontal: wp("6%"),
        borderRadius: wp("8%"),
        borderWidth: 2,
        borderColor: colors.brandBorder,
        backgroundColor: colors.brandMint,
        gap: wp("3%"),
        shadowColor: colors.brandGreen,
        shadowOpacity: 0.05,
        shadowRadius: 6,
        shadowOffset: { width: 2, height: 2 },
        elevation: 6,
    },
    currentStatusContent: { flex: 1 },
    statusLabel: { fontFamily: "Fredoka-SemiBold", fontSize: RFValue(16), color: colors.textBlack, marginBottom: hp("0.5%") },
    statusText: { fontFamily: "Jost-Medium", fontSize: RFValue(14), color: colors.textBlack },
    truckIcon: { width: wp("14%"), height: wp("14%") },
    timeline: { marginVertical: hp("2%") },
    buttonContainer: { paddingHorizontal: wp("4%"), paddingBottom: hp("2%") },
})
