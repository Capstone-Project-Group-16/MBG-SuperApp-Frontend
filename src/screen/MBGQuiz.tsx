import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../App";
import { colors } from "../theme/Color";
import StatusBar from "../components/StatusBar";
import QuestionCard from "../components/QuestionCard";
import Button from "../components/Button";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFValue } from "react-native-responsive-fontsize";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiFetch } from "../lib/api";

type Props = NativeStackScreenProps<RootStackParamList, "MBGQuiz">;

type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
};

const getTodayStr = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export default function QuizScreen({ navigation, route }: Props) {
  const { orderId, studentProfileId } = route.params; // dikirim dari Home
  const LAST_QUIZ_DATE_KEY = `mbgquiz:lastQuizDate:${studentProfileId}`;

  const [quizData, setQuizData] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 menit (dalam detik)
  const [quizId, setQuizId] = useState<number | null>(null);

  const [checkingLimit, setCheckingLimit] = useState(true);
  const [hasPlayedToday, setHasPlayedToday] = useState(false);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [scoring, setScoring] = useState(false);

  // TIMER
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // 🔁 Generate Quiz via backend (PAKAI apiFetch)
  const fetchQuiz = async () => {
    if (!orderId) {
      Alert.alert(
        "Error",
        "Order tidak ditemukan. Silakan pesan paket MBG terlebih dahulu."
      );
      return;
    }

    setLoadingQuiz(true);
    try {
      const { res, data } = await apiFetch(
        "/api/mbg-food-gamification/food-quiz/generateQuiz",
        {
          method: "POST",
          body: JSON.stringify({ orderId }),
        }
      );

      if (!res.ok) {
        console.log("Generate quiz error:", data);
        Alert.alert(
          "Gagal memuat quiz",
          data?.detail || "Terjadi kesalahan saat membuat quiz."
        );
        return;
      }

      setQuizId(data.quizId);

      const questions: QuizQuestion[] = [];
      for (let i = 1; i <= 5; i++) {
        const qText = data[`question${i}`];
        if (!qText) continue;

        const options = [
          data[`choiceA${i}`],
          data[`choiceB${i}`],
          data[`choiceC${i}`],
          data[`choiceD${i}`],
        ].filter(Boolean);

        questions.push({
          id: i,
          question: qText,
          options,
        });
      }

      if (!questions.length) {
        Alert.alert("Error", "Quiz tidak memiliki pertanyaan.");
        return;
      }

      setQuizData(questions);
      setCurrentQuestion(0);
      setSelectedAnswer(null);

      const initialAnswers: Record<number, number | null> = {};
      questions.forEach((_, idx) => {
        initialAnswers[idx] = null;
      });
      setAnswers(initialAnswers);
    } catch (err) {
      console.error("Generate quiz exception:", err);
      Alert.alert("Error", "Tidak dapat terhubung ke server.");
    } finally {
      setLoadingQuiz(false);
    }
  };

  // cek sudah main hari ini + load quiz
  useEffect(() => {
    const init = async () => {
      try {
        const saved = await AsyncStorage.getItem(LAST_QUIZ_DATE_KEY);
        const today = getTodayStr();

        if (saved === today) {
          setHasPlayedToday(true);
          setCheckingLimit(false);
          return;
        }

        setHasPlayedToday(false);
        setCheckingLimit(false);

        // belum main hari ini → load quiz
        await fetchQuiz();
      } catch (err) {
        console.warn("Failed to check daily limit", err);
        setCheckingLimit(false);
      }
    };

    init();
  }, []);

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: index,
    }));
  };

  const goNext = () => {
    if (selectedAnswer === null) return;
    if (!quizData.length) return;

    if (currentQuestion < quizData.length - 1) {
      const newIndex = currentQuestion + 1;
      setCurrentQuestion(newIndex);
      setSelectedAnswer(
        answers[newIndex] !== undefined ? answers[newIndex] : null
      );
    } else {
      handleSubmit();
    }
  };

  const goBack = () => {
    if (currentQuestion > 0) {
      const newIndex = currentQuestion - 1;
      setCurrentQuestion(newIndex);
      setSelectedAnswer(
        answers[newIndex] !== undefined ? answers[newIndex] : null
      );
    }
  };

  // 🔁 Submit & scoring (PAKAI apiFetch)
  const handleSubmit = async () => {
    if (!quizId) {
      Alert.alert("Error", "Quiz belum siap. Coba muat ulang.");
      return;
    }

    const totalQuestions = quizData.length || 5;

    for (let i = 0; i < totalQuestions; i++) {
      if (answers[i] === null || answers[i] === undefined) {
        Alert.alert("Perhatian", "Masih ada soal yang belum dijawab.");
        return;
      }
    }

    setScoring(true);
    try {
      const indexToChoice = ["A", "B", "C", "D"];

      const body: any = {
        quizId,
        choice1: indexToChoice[answers[0]!],
        choice2: indexToChoice[answers[1]!],
        choice3: indexToChoice[answers[2]!],
        choice4: indexToChoice[answers[3]!],
        choice5: indexToChoice[answers[4]!],
      };

      const { res, data } = await apiFetch(
        "/api/mbg-food-gamification/food-quiz/scoreQuiz",
        {
          method: "POST",
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) {
        console.log("Score quiz error:", data);
        // Jika quiz sudah di-score sebelumnya, ambil score yang ada
      if (data?.detail === "Quiz already scored") {
        try {
          const { res: scoreRes, data: scoreData } = await apiFetch(
            `/api/mbg-food-gamification/food-quiz/getQuizScore?orderId=${orderId}`,
            { method: "GET" }
          );

          if (scoreRes.ok) {
            const quizScore = scoreData.quizScore ?? 0;
            const correctAnswers = Math.floor(quizScore / 20);
            const incorrectAnswers = totalQuestions - correctAnswers;

            const today = getTodayStr();
            await AsyncStorage.setItem(LAST_QUIZ_DATE_KEY, today);
            setHasPlayedToday(true);

            navigation.navigate("QuizResult", {
              score: quizScore,
              correct: correctAnswers,
              incorrect: incorrectAnswers,
              xp: scoreData.earnedExp ?? 0,
              gems: scoreData.earnedMbgPoints ?? 0,
            });
            return;
          }
        } catch (err) {
          console.error("Failed to fetch existing score:", err);
        }
      }
        Alert.alert(
          "Gagal submit quiz",
          data?.detail || "Terjadi kesalahan saat mengirim jawaban."
        );
        return;
      }

      const quizScore: number = data.quizScore ?? 0;

      // 5 soal, 20 poin per soal (0–100)
      const correctAnswers = Math.floor(quizScore / 20);
      const incorrectAnswers = totalQuestions - correctAnswers;

      const expPoints: number = data.earnedExp ?? 0;
      const mbgPoints: number = data.earnedMbgPoints ?? 0;

      const today = getTodayStr();
      await AsyncStorage.setItem(LAST_QUIZ_DATE_KEY, today);
      setHasPlayedToday(true);

      navigation.navigate("QuizResult", {
        score: quizScore,
        correct: correctAnswers,
        incorrect: incorrectAnswers,
        xp: expPoints,
        gems: mbgPoints,
      });
    } catch (err) {
      console.error("Score quiz exception:", err);
      Alert.alert("Error", "Tidak dapat terhubung ke server.");
    } finally {
      setScoring(false);
    }
  };

  const progressPercent = quizData.length
    ? ((currentQuestion + 1) / quizData.length) * 100
    : 0;

  // state loading awal (cek limit / load quiz)
  if (checkingLimit || loadingQuiz) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.brandGreen} />
          <Text style={styles.loadingText}>Memuat MBGQuiz...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // sudah main hari ini → lock
  if (hasPlayedToday) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.goBack()}
            style={styles.back}
          >
            <Image
              style={styles.backIcon}
              source={require("../../assets/icon/back.png")}
              resizeMode="contain"
            />
          </Pressable>
          <View style={{ flex: 1 }} />
        </View>

        <View style={styles.lockContainer}>
          <Text style={styles.lockTitle}>MBGQuiz</Text>
          <Text style={styles.lockText}>
            Kamu sudah mengerjakan MBGQuiz hari ini.{"\n"}
            Coba lagi besok untuk dapat EXP dan MBG Points lagi! 🎁
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // quiz gagal dimuat
  if (!quizData.length) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>
            Quiz tidak tersedia. Coba kembali dari halaman sebelumnya.
          </Text>
          <View style={{ height: hp("2%") }} />
          <Button title="Kembali" onPress={() => navigation.goBack()} />
        </View>
      </SafeAreaView>
    );
  }

  // state normal
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.goBack()}
          style={styles.back}
        >
          <Image
            style={styles.backIcon}
            source={require("../../assets/icon/back.png")}
            resizeMode="contain"
          />
        </Pressable>
        <View style={{ flex: 1 }} />
        <StatusBar
          items={[
            {
              label: "",
              icon: require("../../assets/icon/stopwatch.png"),
              value: formatTime(timeLeft),
              textColor: colors.textGold,
            },
          ]}
        />
      </View>

      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${progressPercent}%` }]} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
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
              disabled={currentQuestion === 0 || scoring}
            />
          </View>

          <View style={{ flex: 1, marginLeft: hp("6%") }}>
            <Button
              title={
                currentQuestion === quizData.length - 1 ? "SUBMIT" : "NEXT"
              }
              onPress={goNext}
              disabled={selectedAnswer === null || scoring}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
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
  backIcon: {
    width: wp("6%"),
    height: wp("6%"),
    tintColor: colors.brandBorder,
    marginBottom: hp("0.5%"),
  },
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
  content: {
    paddingHorizontal: wp("4%"),
    paddingTop: hp("3%"),
    paddingBottom: hp("2%"),
  },
  rowButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonContainer: {
    paddingHorizontal: wp("4%"),
    paddingBottom: hp("7%"),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp("6%"),
  },
  loadingText: {
    marginTop: hp("2%"),
    textAlign: "center",
    color: colors.brandBorder,
    fontSize: RFValue(12),
  },
  lockContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp("8%"),
  },
  lockTitle: {
    fontSize: RFValue(18),
    fontWeight: "700",
    color: colors.brandBorder,
    marginBottom: hp("2%"),
  },
  lockText: {
    fontSize: RFValue(12),
    color: colors.brandBorder,
    textAlign: "center",
  },
});
