"use client"

import { View, Text, StyleSheet, ScrollView, SafeAreaView, Pressable, Image } from "react-native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from "../../App"
import { colors } from "../theme/Color"
import StatusBar from "../components/StatusBar"
import TimelineItem from "../components/TimelineItem"
import Button from "../components/Button"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { RFValue } from "react-native-responsive-fontsize"
import { useState } from "react"

type Props = NativeStackScreenProps<RootStackParamList, "DistributionTracker">

export default function DistributionTracker({ navigation }: Props) {
    const [completedIndex, setCompletedIndex] = useState(5)

    const timelineData = [
        { label: "Catering checking order list", time: "06:00 AM" },
        { label: "Catering buy raw ingredients", time: "06:30 AM" },
        { label: "Food being cooked", time: "07:30 AM" },
        { label: "Food ready", time: "10:00 AM" },
        { label: "Food being delivered", time: "10:30 AM" },
        { label: "Food has been arrived", time: "12:00 PM" },
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
                        { label: "Exp", icon: require("../../assets/icon/thunder.png"), value: "70000", textColor: colors.textGold },
                        { label: "Gems", icon: require("../../assets/icon/diamond.png"), value: "70000", textColor: colors.textBlue },
                    ]}
                />
            </View>

            <Text style={styles.title}>MBG Progress Status</Text>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Current Status Card */}
                <View style={styles.currentStatusCard}>
                    <View style={styles.currentStatusContent}>
                        <Text style={styles.statusLabel}>Current Status</Text>
                        <Text style={styles.statusText}>Food being delivered</Text>
                    </View>
                    <Image style={styles.truckIcon} source={require("../../assets/icon/distribution.png")} resizeMode="contain" />
                </View>

                {/* Timeline */}
                <View style={styles.timeline}>
                    {timelineData.map((item, idx) => (
                        <TimelineItem
                            key={idx}
                            label={item.label}
                            time={item.time}
                            isActive={idx === completedIndex}
                            isCompleted={idx <= completedIndex}
                            isLast={idx === timelineData.length - 1}
                        />
                    ))}
                </View>

                <View style={{ height: hp("2%") }} />
            </ScrollView>

            {/* Button */}
            <View style={styles.buttonContainer}>
                <Button title="FOOD RECEIVED" onPress={() => setCompletedIndex(timelineData.length)} />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.white },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: wp("2.5%"),
        marginTop: hp("1.25%"),
        paddingHorizontal: wp("4%"),
        paddingTop: hp("2%"),
        paddingBottom: hp("2%"),
    },
    back: { paddingVertical: hp("1%"), paddingHorizontal: wp("1%") },
    backIcon: { width: wp("6%"), height: wp("6%") },
    title: {
        fontFamily: "Fredoka-SemiBold",
        fontSize: RFValue(22),
        color: colors.textBlack,
        paddingHorizontal: wp("4%"),
        marginBottom: hp("2%"),
        textAlign: "center",
    },
    content: { paddingHorizontal: wp("4%"), paddingBottom: hp("2%") },
    currentStatusCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.brandMint,
        borderWidth: 2,
        borderColor: colors.brandBorder,
        borderRadius: wp("4%"),
        padding: wp("4%"),
        marginBottom: hp("3%"),
    },
    currentStatusContent: { flex: 1 },
    statusLabel: { fontFamily: "Fredoka", fontSize: RFValue(12), color: colors.textBlack, marginBottom: hp("0.5%") },
    statusText: { fontFamily: "Fredoka-SemiBold", fontSize: RFValue(14), color: colors.textBlack },
    truckIcon: { width: wp("12%"), height: wp("12%") },
    timeline: { marginVertical: hp("2%") },
    buttonContainer: { paddingHorizontal: wp("4%"), paddingBottom: hp("2%") },
})
