import { View, Text, StyleSheet, ScrollView, Pressable, Image } from "react-native"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { RFValue } from "react-native-responsive-fontsize"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { RootStackParamList } from "../../App"
import { colors } from "../theme/Color"
import CircularProgress from "../components/CircularProgress"
import ScoreCard from "../components/ScoreCard"
import Button from "../components/Button"
import StatusBar from "../components/StatusBar"

type QuizResultNavigationProp = NativeStackNavigationProp<RootStackParamList, "QuizResult">

interface QuizResultScreenProps {
    route: {
        params: {
            score: number
            correct: number
            incorrect: number
            xp: number
            gems: number
        }
    }
}

export default function QuizResult({ route }: QuizResultScreenProps) {
    const navigation = useNavigation<QuizResultNavigationProp>()
    const { score, correct, incorrect, xp, gems } = route.params

    const handleClaimReward = () => {
        navigation.navigate("Home")
    }

    const handleClose = () => {
        navigation.navigate("Home")
    }

    return (
        <View style={styles.container}>
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

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                {/* Total Score Card */}
                <View style={styles.scoreCard}>
                    <Text style={styles.scoreTitle}>Total Score</Text>

                    <View style={styles.circularProgressContainer}>
                        <CircularProgress
                            value={score}
                            max={100}
                            unit="%"
                            gradientColors={["#3DD806", "#3DD806"]}
                            backgroundColor="#7BFF5A"
                            sizePercent={45}
                            strokePercent={8}
                            valueFontSize={RFValue(28)}
                            unitFontSize={RFValue(28)}
                        />
                    </View>

                    {/* Stats Grid */}
                    <View style={styles.statsGrid}>
                        <View style={styles.cardWrapper}>
                            <ScoreCard
                                label="True"
                                value={`${correct}/3`}
                                icon={<Text style={styles.checkIcon}>✓</Text>}
                                backgroundColor={colors.scoreGreen}
                                borderColor={colors.nutriGreen}
                            />
                        </View>

                        <View style={styles.cardWrapper}>
                            <ScoreCard
                                label="False"
                                value={`${incorrect}/3`}
                                icon={<Text style={styles.xIcon}>×</Text>}
                                backgroundColor={colors.scorePink}
                                borderColor={colors.nutriPink}
                            />
                        </View>

                        <View style={styles.cardWrapper}>
                            <ScoreCard
                                label="XP"
                                value={xp}
                                icon={<Text style={styles.xpIcon}>⚡</Text>}
                                backgroundColor={colors.scoreOrange}
                                borderColor={colors.nutriOrange}
                            />
                        </View>

                        <View style={styles.cardWrapper}>
                            <ScoreCard
                                label="Gems"
                                value={gems}
                                icon={<Text style={styles.gemsIcon}>💎</Text>}
                                backgroundColor={colors.scoreBlue}
                                borderColor={colors.nutriBlue}
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Claim Reward Button */}
            <View style={styles.buttonContainer}>
                <Button title="CLAIM REWARD" onPress={handleClaimReward} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
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
    statsPill: {
        flexDirection: "row",
        backgroundColor: colors.white,
        borderWidth: wp("0.5%"),
        borderColor: colors.brandBorder,
        borderRadius: wp("8%"),
        paddingHorizontal: wp("4%"),
        paddingVertical: hp("1%"),
        alignItems: "center",
        gap: wp("2%"),
    },
    statsText: {
        fontFamily: "Fredoka-Medium",
        fontSize: RFValue(12),
        color: colors.textBlack,
    },
    statsDivider: {
        color: colors.brandBorder,
        fontSize: RFValue(16),
    },
    cardWrapper: {
        width: "48%",
        marginBottom: hp("2%"),
    },
    scoreCard: {
        backgroundColor: colors.white,
        borderWidth: wp("0.8%"),
        borderColor: colors.brandBorder,
        borderRadius: wp("6%"),
        padding: wp("6%"),
        marginBottom: hp("2%"),
        alignItems: "center",
        shadowColor: colors.brandGreen,
        shadowOpacity: 0.05,
        shadowRadius: 6,
        shadowOffset: { width: 2, height: 2 },
        elevation: 6,
    },
    scoreTitle: {
        fontFamily: "Fredoka-Bold",
        fontSize: RFValue(24),
        color: colors.textBlack,
        marginBottom: hp("2%"),
    },
    circularProgressContainer: {
        marginVertical: hp("2%"),
    },
    statsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: wp("3%"),
        marginTop: hp("3%"),
        marginLeft: wp("2%"),
        width: "100%",
    },
    checkIcon: {
        fontSize: RFValue(24),
        color: "#4BB444",
        fontWeight: "bold",
    },
    xIcon: {
        fontSize: RFValue(24),
        color: "#F0A0A0",
        fontWeight: "bold",
    },
    xpIcon: {
        fontSize: RFValue(24),
    },
    gemsIcon: {
        fontSize: RFValue(24),
    },
    buttonContainer: { paddingHorizontal: wp("4%"), paddingBottom: hp("7%"), },
})
