"use client"

import { View, Text, StyleSheet, ScrollView, SafeAreaView, Image, ActivityIndicator, Pressable } from "react-native"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { RFValue } from "react-native-responsive-fontsize"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import { useEffect, useState } from "react"
import type { RootStackParamList } from "../../App"
import { colors } from "../theme/Color"
import StatusBar from "../components/StatusBar"
import { FormField } from "../components/FormField"
import { apiFetch } from "../lib/api"

type Props = NativeStackScreenProps<RootStackParamList, "Profile">

interface User {
    userId: number
    userEmail: string
    userFullName: string
    userRole: string
    userPhoneNumber: string
    userProfilePictureLink?: string | null
}

interface StudentProfile {
    studentProfileId: number
    userId: number
    schoolId: number
    dateOfBirth: string
    budget?: number
    expPoints: number
    mbgPoints: number
    user: User
}

export default function ProfileScreen({ route, navigation }: Props) {
    const studentProfileId = route?.params?.studentProfileId
    const [avatarLetter, setAvatarLetter] = useState<string>("?")
    const [profile, setProfile] = useState<StudentProfile | null>(null)
    const [loading, setLoading] = useState(true)

    const loadProfile = async () => {
        if (!studentProfileId) {
            setLoading(false);
            return;
        }

        try {
            const { res, data } = await apiFetch(
                `/api/account/student-profile/get/${studentProfileId}`,
                { method: "GET" }
            )

            if (res.ok && data) {
                setProfile(data);
                setAvatarLetter(data.user.userFullName.charAt(0).toUpperCase())
            } else {
                console.log("Failed to fetch profile", data);
            }
        } catch (err) {
            console.log("Error loading profile:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, [studentProfileId]);

    useEffect(() => {
        if (profile?.user?.userFullName) {
            setAvatarLetter(profile.user.userFullName.charAt(0).toUpperCase());
        }
    }, [profile]);

    if (loading) {
        return (
            <SafeAreaView style={styles.root}>
                <ActivityIndicator size="large" color={colors.brandGreen} style={{ marginTop: hp("50%") }} />
            </SafeAreaView>
        )
    }

    if (!profile) {
        return (
            <SafeAreaView style={styles.root}>
                <Text style={styles.errorText}>Failed to load profile</Text>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.root}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable
                    accessibilityRole="button"
                    onPress={() => navigation.goBack()}
                    style={styles.close}
                >
                    <Image
                        style={styles.closeIcon}
                        source={require("../../assets/icon/close.png")}
                        resizeMode="contain"
                    />
                </Pressable>

                <View style={{ flex: 1 }} />
                <StatusBar
                    items={[
                        {
                            label: "Exp",
                            icon: require("../../assets/icon/thunder.png"),
                            value: String(profile.expPoints),
                            textColor: colors.textGold,
                        },
                        {
                            label: "Gems",
                            icon: require("../../assets/icon/diamond.png"),
                            value: String(profile.mbgPoints),
                            textColor: colors.textBlue,
                        },
                    ]}
                />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Title */}
                <Text style={styles.title}>Profile</Text>

                {/* Avatar */}
                <View style={styles.avatarContainer}>
                    {profile.user.userProfilePictureLink ? (
                        <Image source={{ uri: profile.user.userProfilePictureLink }} style={styles.avatar} />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarText}>{avatarLetter}</Text>
                        </View>
                    )}
                </View>

                {/* Detail Profile */}
                <View style={styles.formContainer}>
                    <FormField
                        label="Nama"
                        value={profile.user.userFullName}
                        editable={false}
                        placeholderTextColor={colors.brandGrey}
                    />

                    <FormField
                        label="Email"
                        value={profile.user.userEmail}
                        editable={false}
                        placeholderTextColor={colors.brandGrey}
                    />

                    <FormField
                        label="Nomor Telepon"
                        value={profile.user.userPhoneNumber}
                        editable={false}
                        placeholderTextColor={colors.brandGrey}
                    />

                    <FormField
                        label="Tanggal Lahir"
                        value={profile.dateOfBirth}
                        editable={false}
                        placeholderTextColor={colors.brandGrey}
                    />
                </View>

                <View style={{ height: hp("5%") }} />
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
        tintColor: colors.brandBorder,
    },
    content: {
        paddingHorizontal: wp("4%"),
        paddingTop: hp("2%"),
    },
    title: {
        fontFamily: "Fredoka-Bold",
        fontSize: RFValue(24),
        color: colors.textBlack,
        textAlign: "center",
        marginBottom: hp("3%"),
    },
    avatarContainer: {
        alignItems: "center",
        marginBottom: hp("4%"),
    },
    avatar: {
        width: wp("35%"),
        height: wp("35%"),
        borderRadius: wp("17.5%"),
        borderWidth: 2,
        borderColor: colors.brandBorder,
    },
    avatarPlaceholder: {
        width: wp("35%"),
        height: wp("35%"),
        borderRadius: wp("17.5%"),
        borderWidth: 2,
        borderColor: colors.brandBorder,
        backgroundColor: colors.brandMint,
        alignItems: "center",
        justifyContent: "center",
    },
    avatarText: {
        fontFamily: "Fredoka-Bold",
        fontSize: RFValue(32),
        color: colors.brandGreen,
    },
    formContainer: {
        gap: hp("1%"),
        marginHorizontal: wp("2%"),
    },
    errorText: {
        fontFamily: "Jost",
        fontSize: RFValue(16),
        color: colors.textBlack,
        textAlign: "center",
    },
})
