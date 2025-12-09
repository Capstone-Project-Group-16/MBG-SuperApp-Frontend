"use client"

import { View, Text, StyleSheet, ScrollView, SafeAreaView, Image, ImageBackground } from "react-native"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { RFPercentage, RFValue } from "react-native-responsive-fontsize"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from "../../App"
import { colors } from "../theme/Color"
import { useEffect, useState } from "react"
import { apiFetch } from "../lib/api";
import StatusBar from "../components/StatusBar"
import Button from "../components/Button"

type Props = NativeStackScreenProps<RootStackParamList, "FoodOrder">

export default function FoodOrder({ route, navigation }: Props) {
    const { menuId, menuTitle, price, tray } = route.params
    const studentProfileId = route?.params?.studentProfileId
    const [exp, setExp] = useState<string>("0")
    const [gems, setGems] = useState<string>("0")
    const [budget, setBudget] = useState<string>("0")

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
                setBudget(String(data?.budget ?? "0"))
            } catch (err) {
                console.log("Error fetch student profile:", err)
            }
        }

        loadProfile()
    }, [studentProfileId])

    const handleOrderNow = () => {
        console.log("[v0] Order placed with items:", menuId, menuTitle, price, tray)
        navigation.navigate("Home", { studentProfileId })
    }

    return (
        <SafeAreaView style={styles.root}>
            {/* Header with stats */}
            <View style={styles.header}>
                <StatusBar
                    items={[
                        { label: "Money", icon: require("../../assets/icon/money.png"), value: budget, textColor: colors.textGreen },
                    ]}
                />
                <View style={{ flex: 1 }} />
                <StatusBar
                    items={[
                        { label: "Exp", icon: require("../../assets/icon/thunder.png"), value: exp, textColor: colors.textGold },
                        { label: "Gems", icon: require("../../assets/icon/diamond.png"), value: gems, textColor: colors.textBlue },
                    ]}
                />
            </View>

            {/* Character avatar */}
            <View style={styles.avatarContainer}>
                <Text style={styles.avatar}>👩</Text>
            </View>

            <View style={styles.trayWrapper}>
                {/* Background for food tray */}
                <ImageBackground
                    source={require("../../assets/icon/table.png")}
                    style={styles.tableBackground}
                    resizeMode="cover"
                >
                    {/* Food tray with selected items */}
                    <View style={styles.trayContainer}>
                        <Image source={tray} style={styles.trayImage} resizeMode="contain" />
                    </View>

                    {/* Order button */}
                    <View style={styles.buttonContainer}>
                        <Button title="ORDER NOW" onPress={handleOrderNow} />
                    </View>
                </ImageBackground>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: colors.white,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: wp("2.5%"),
        paddingHorizontal: wp("4%"),
        paddingTop: hp("4%"),
        paddingBottom: hp("1.5%"),
        marginTop: hp("1.25%"),
    },
    avatarContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: hp("3%"),
    },
    avatar: {
        fontSize: RFValue(100),
    },
    trayWrapper: {
        flex: 1,
        width: "100%",
        overflow: "hidden",
    },
    tableBackground: {
        width: "100%",
        height: "90%",
        justifyContent: "flex-end",
        marginTop: hp("15%"),
    },
    trayContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: hp("1%"),
    },
    trayImage: { width: wp("75%"), height: wp("75%") },
    buttonContainer: { paddingHorizontal: wp("5%"), paddingBottom: hp("15%") },
})
