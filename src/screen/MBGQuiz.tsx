import { View, Text, StyleSheet, ScrollView, Pressable, SafeAreaView, TouchableOpacity, Image } from "react-native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from "../../App"
import { colors } from "../theme/Color"
import StatusBar from "../components/StatusBar"
import QuestionCard from "../components/QuestionCard"
import Button from "../components/Button"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { RFValue } from "react-native-responsive-fontsize"
import { useState, useEffect } from "react"

type Props = NativeStackScreenProps<RootStackParamList, "MBGQuiz">

const quizData = [
    {
        id: 1,
        question: "Ani sedang pilek dan ibunya menyarankan makan buah yang bisa meningkatkan daya lahan tubuhnya. Buah apa yang sebaiknya dipilih Ani karena terkenal mengandung vitamin C yang tinggi?",
        options: ["Jeruk", "Pisang", "Mangga", "Apel"],
        correctAnswer: 0,
    },
    {
        id: 2,
        question: "Manakah dari makanan berikut yang merupakan sumber protein hewani terbaik?",
        options: ["Tahu", "Telur", "Kacang tanah", "Beras merah"],
        correctAnswer: 1,
    },
    {
        id: 3,
        question: "Vitamin apa yang paling penting untuk kesehatan tulang dan gigi?",
        options: ["Vitamin A", "Vitamin C", "Vitamin D", "Vitamin E"],
        correctAnswer: 2,
    },
]

export default function QuizScreen({ navigation }: Props) {
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
    const [timeLeft, setTimeLeft] = useState(3600) // 60:00 in seconds
    const [score, setScore] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, "0")}`
    }

    const handleAnswerSelect = (index: number) => {
        setSelectedAnswer(index)
    }

    const goNext = () => {
        if (selectedAnswer === null) return

        if (currentQuestion < quizData.length - 1) {
            setCurrentQuestion((prev) => prev + 1)
            setSelectedAnswer(null)
        } else {
            handleSubmit()
        }
    }

    const goBack = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion((prev) => prev - 1)
            setSelectedAnswer(null)
        }
    }

    const handleSubmit = () => {
        let updatedScore = score

        if (selectedAnswer === quizData[currentQuestion].correctAnswer) {
            setScore(score + 1)
        }

        if (currentQuestion < quizData.length - 1) {
            setCurrentQuestion(currentQuestion + 1)
            setSelectedAnswer(null)
            return
        }

        navigation.navigate("QuizResult", {
            score: Math.round((updatedScore / quizData.length) * 100),
            correct: updatedScore,
            incorrect: quizData.length - updatedScore,
            xp: updatedScore * 10,
            gems: updatedScore * 2,
        })
    }

    const progressPercent = ((currentQuestion + 1) / quizData.length) * 100

    return (
        <SafeAreaView style={styles.root}>
            <View style={styles.header}>
                <Pressable accessibilityRole="button" onPress={() => navigation.goBack()} style={styles.back}>
                    <Image style={styles.backIcon} source={require("../../assets/icon/back.png")} resizeMode="contain" />
                </Pressable>
                <View style={{ flex: 1 }} />
                <StatusBar
                    items={[
                        { label: "", icon: require("../../assets/icon/stopwatch.png"), value: formatTime(timeLeft), textColor: colors.textGold },
                    ]}
                />
            </View>

            <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { width: `${progressPercent}%` }]} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <QuestionCard
                    questionNumber={currentQuestion + 1}
                    question={quizData[currentQuestion].question}
                    options={quizData[currentQuestion].options}
                    selectedAnswer={selectedAnswer}
                    onSelectAnswer={handleAnswerSelect}
                />
            </ScrollView>

            <View style={styles.buttonContainer}>
                <View style={styles.rowButtons}>
                    <View style={{ flex: 1, marginRight: hp("6%") }}>
                        <Button
                            title="BACK"
                            onPress={goBack}
                            disabled={currentQuestion === 0}
                        />
                    </View>

                    <View style={{ flex: 1, marginLeft: hp("6%") }}>
                        <Button
                            title="NEXT"
                            onPress={goNext}
                            disabled={selectedAnswer === null}
                        />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.white },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: hp("1.25%"),
        paddingHorizontal: wp("4%"),
        paddingTop: hp("4%"),
        paddingBottom: hp("2%"),
    },
    back: { paddingVertical: hp("1%"), paddingHorizontal: wp("1%") },
    backIcon: { width: wp("6%"), height: wp("6%"), tintColor: colors.brandBorder, marginBottom: hp("0.5%") },
    progressContainer: {
        height: hp("2%"),
        backgroundColor: colors.brandGrey,
        marginHorizontal: wp("4%"),
        borderRadius: wp("3%"),
        overflow: "hidden",
    },
    progressBar: {
        height: "100%",
        backgroundColor: colors.brandGreen,
        borderRadius: wp("3%"),
    },
    content: { paddingHorizontal: wp("4%"), paddingTop: hp("3%"), paddingBottom: hp("2%") },
    rowButtons: { flexDirection: "row", justifyContent: "space-between", },
    buttonContainer: { paddingHorizontal: wp("4%"), paddingBottom: hp("7%"), },
})
