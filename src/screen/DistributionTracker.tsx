"use client"

import { View, Text, StyleSheet, ScrollView, SafeAreaView, Pressable, Image, Alert } from "react-native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from "../../App"
import { colors } from "../theme/Color"
import StatusBar from "../components/StatusBar"
import TimelineItem from "../components/TimelineItem"
import Button from "../components/Button"
import NavBar from "../components/NavBar"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { RFValue } from "react-native-responsive-fontsize"
import { useState, useCallback } from "react"
import { apiFetch } from "../lib/api";
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useFocusEffect } from "@react-navigation/native"

type Props = NativeStackScreenProps<RootStackParamList, "DistributionTracker">

// Mapping Status
const STATUS_CONFIG: Record<string, { index: number, label: string }> = {
    "NO_ACTIVE_ORDER": { index: 0, label: "No Active Order" },
    "BEING_PREPARED": { index: 0, label: "Kitchen is preparing your food" },
    "READY_TO_SEND": { index: 0, label: "Food ready to send" },
    "ON_DELIVERY": { index: 1, label: "Driver is on the way" },
    "ARRIVED_AT_SCHOOL": { index: 2, label: "Food arrived! Scan to Eat." },
    "FINISHED_EATING": { index: 3, label: "You finished eating. Waiting pickup." },
    "RETURNING_TO_CATERING": { index: 4, label: "Driver picking up plates" }, 
    "RETURNED_TO_CATERING": { index: 5, label: "Plate returned. See you tomorrow!" }
};

export default function DistributionTracker({ navigation, route }: Props) {
    const studentProfileId = route?.params?.studentProfileId
    const LAST_ORDER_KEY = `lastOrderId_${studentProfileId}`;

    const [exp, setExp] = useState<string>("0")
    const [gems, setGems] = useState<string>("0")
    
    const [completedIndex, setCompletedIndex] = useState(0)
    const [currentStatusLabel, setCurrentStatusLabel] = useState("Checking status...")
    const [hasScannedWaste, setHasScannedWaste] = useState(false)

    // Auto Refresh saat layar aktif
    useFocusEffect(
        useCallback(() => {
            if (studentProfileId) {
                loadProfileData();
                loadTrackingStatus();
                checkLocalWasteFlag();
            }
        }, [studentProfileId])
    );

    const checkLocalWasteFlag = async () => {
        const wasteFlag = await AsyncStorage.getItem("temp_has_scanned_waste");
        if (wasteFlag === "true") {
            setHasScannedWaste(true);
        }
    }

    const loadProfileData = async () => {
        try {
            const { res, data: profileData } = await apiFetch(`/api/account/student-profile/get/${studentProfileId}`, { method: "GET" })
            if (res.ok) {
                setExp(String(profileData?.expPoints ?? "0"))
                setGems(String(profileData?.mbgPoints ?? "0"))
            }
        } catch (e) { }
    }

    const loadTrackingStatus = async () => {
        try {
            const { res, data } = await apiFetch("/api/mbg-food-distribution-tracker/food-distributor/my-status", { method: "GET" });
            
            if (res.ok && data) {
                const status = data.status;
                const config = STATUS_CONFIG[status] || STATUS_CONFIG["BEING_PREPARED"];
                
                setCompletedIndex(config.index);
                setCurrentStatusLabel(config.label);

                if (config.index >= 3) {
                    setHasScannedWaste(true);
                }
            }
        } catch (e) {
            setCurrentStatusLabel("Status unavailable");
        }
    }

    const handleMainButton = async () => {
        // 1. Scan Terima Makanan
        if (completedIndex < 2) {
            navigation.navigate("FoodScanner", { studentProfileId, scanMode: "distribution" });
        } 
        // 2. Selesaikan Makan
        else if (completedIndex === 2) {
            
            if (!hasScannedWaste) {
                Alert.alert(
                    "Selesaikan Makan",
                    "Foto piring kosongmu (Food Waste) dulu ya!",
                    [
                        { 
                            text: "Scan Sekarang", 
                            onPress: async () => {
                                const lastOrderId = await AsyncStorage.getItem(LAST_ORDER_KEY);
                                if (!lastOrderId) {
                                    Alert.alert("Error", "Silahkan order kembali.");
                                    return;
                                }
                                navigation.navigate("FoodScanner", { 
                                    studentProfileId, 
                                    scanMode: "waste",
                                    orderId: Number(lastOrderId),
                                    phase: "before"
                                });
                            }
                        },
                        { text: "Nanti", style: "cancel" }
                    ]
                );
            } else {
                try {
                    const { res, data } = await apiFetch("/api/mbg-food-distribution-tracker/food-distributor/finish-eating", {
                        method: "POST"
                    });

                    if (res.ok) {
                        await AsyncStorage.removeItem("temp_has_scanned_waste");
                        loadTrackingStatus(); 
                        Alert.alert("Terima Kasih!", "Piring siap dikembalikan ke Catering.");
                    } else {
                        Alert.alert("Gagal", data?.detail || "Gagal update status.");
                    }
                } catch (e) {
                    Alert.alert("Error", "Network error");
                }
            }
        }
    }

    const getButtonTitle = () => {
        if (completedIndex < 2) return "SCAN TO RECEIVE FOOD";
        if (completedIndex === 2) {
            // Text lebih pendek agar muat dan rapi
            return hasScannedWaste ? "FINISH EATING" : "SCAN WASTE & FINISH";
        }
        if (completedIndex === 3) return "WAITING PICKUP";
        return "ORDER COMPLETED";
    }

    const isButtonDisabled = () => {
        return completedIndex >= 3;
    }

    const timelineData = [
        { label: "Catering ready to send", time: completedIndex > 0 ? "Done" : undefined },
        { label: "On Delivery to School", time: completedIndex > 1 ? "Done" : undefined },
        { label: "Arrived (Scan to Eat)", time: completedIndex > 2 ? "Done" : undefined },
        { label: "Finished Eating", time: completedIndex > 3 ? "Done" : undefined },
        { label: "Plate Returned", time: completedIndex > 4 ? "Done" : undefined },
    ]

    return (
        <SafeAreaView style={styles.root}>
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()} style={styles.back}>
                    <Image style={styles.backIcon} source={require("../../assets/icon/back.png")} resizeMode="contain" />
                </Pressable>
                <View style={{ flex: 1 }} />
                <StatusBar items={[
                    { label: "Exp", icon: require("../../assets/icon/thunder.png"), value: exp, textColor: colors.textGold },
                    { label: "Gems", icon: require("../../assets/icon/diamond.png"), value: gems, textColor: colors.textBlue },
                ]} />
            </View>

            <Text style={styles.title}>MBG Progress Status</Text>

            <View style={styles.currentStatusCard}>
                <View style={styles.currentStatusContent}>
                    <Text style={styles.statusLabel}>Current Status</Text>
                    <Text style={styles.statusText}>{currentStatusLabel}</Text>
                </View>
                <Image style={styles.truckIcon} source={require("../../assets/icon/distribution.png")} resizeMode="contain" />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.timeline}>
                    {timelineData.map((item, idx) => (
                        <TimelineItem
                            key={idx}
                            label={item.label}
                            time={item.time}
                            isStatus={idx === completedIndex}
                            isLast={idx === timelineData.length - 1}
                        />
                    ))}
                </View>
            </ScrollView>

            <View style={styles.buttonContainer}>
                <Button
                    title={getButtonTitle()}
                    onPress={handleMainButton}
                    style={isButtonDisabled() ? { backgroundColor: colors.brandGrey } : (completedIndex === 2 && !hasScannedWaste ? { backgroundColor: colors.brandBlue } : {})}
                    disabled={isButtonDisabled()}
                    // Fix text alignment specifically for this button
                    textStyle={{ 
                        textAlign: 'center',
                        color: isButtonDisabled() ? colors.textGray : colors.white 
                    }}
                />
            </View>

            <NavBar items={[
                { label: "Home", icon: require("../../assets/icon/home.png"), onPress: () => navigation.navigate("Home", { studentProfileId }) },
                { label: "Distribution Tracker", icon: require("../../assets/icon/distribution.png"), active: true, onPress: () => { } },
                { label: "Spin Wheel", icon: require("../../assets/icon/spin-wheel.png"), onPress: () => navigation.navigate("SpinWheel", { studentProfileId }), },
                { label: "Leaderboard", icon: require("../../assets/icon/leaderboard.png"), onPress: () => navigation.navigate("Leaderboard", { studentProfileId }), },
            ]} />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.white },
    header: { flexDirection: "row", alignItems: "center", paddingHorizontal: wp("4%"), marginTop: hp("1.25%"), paddingTop: hp("4%"), gap: wp("3%"), },
    back: { paddingVertical: hp("1%"), paddingHorizontal: wp("1%") },
    backIcon: { width: wp("6%"), height: wp("6%"), marginBottom: hp("0.5%"), tintColor: colors.brandBorder },
    title: { fontFamily: "Fredoka-SemiBold", fontSize: RFValue(22), color: colors.textBlack, marginBottom: hp("2%"), paddingTop: hp("1.5%"), textAlign: "center" },
    content: { paddingHorizontal: wp("4%"), paddingBottom: hp("2%") },
    currentStatusCard: {
        flexDirection: "row", marginHorizontal: wp("4%"), alignItems: "center", padding: wp("4.5%"), paddingBottom: wp("5%"), paddingHorizontal: wp("6%"),
        borderRadius: wp("8%"), borderWidth: 2, borderColor: colors.brandBorder, backgroundColor: colors.brandMint, gap: wp("3%"),
        shadowColor: colors.brandGreen, shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 2, height: 2 }, elevation: 6,
    },
    currentStatusContent: { flex: 1 },
    statusLabel: { fontFamily: "Fredoka-SemiBold", fontSize: RFValue(16), color: colors.textBlack, marginBottom: hp("0.5%") },
    statusText: { fontFamily: "Jost-Medium", fontSize: RFValue(14), color: colors.textBlack },
    truckIcon: { width: wp("14%"), height: wp("14%") },
    timeline: { marginVertical: hp("2%") },
    buttonContainer: { paddingHorizontal: wp("4%"), paddingBottom: hp("2%") },
})