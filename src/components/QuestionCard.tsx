import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { colors } from "../theme/Color"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { RFValue } from "react-native-responsive-fontsize"

interface QuestionCardProps {
  questionNumber: number
  question: string
  options: string[]
  selectedAnswer: number | null
  onSelectAnswer: (index: number) => void
}

export default function QuestionCard({
  questionNumber,
  question,
  options,
  selectedAnswer,
  onSelectAnswer,
}: QuestionCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.questionNumber}>Question {questionNumber}</Text>
      <Text style={styles.questionText}>{question}</Text>

      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.optionButton, selectedAnswer === index && styles.optionButtonSelected]}
            onPress={() => onSelectAnswer(index)}
          >
            <Text style={[styles.optionText, selectedAnswer === index && styles.optionTextSelected]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.brandBorder,
    borderRadius: wp("5%"),
    padding: wp("5%"),
    shadowColor: colors.brandGreen,
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 2, height: 2 },
    elevation: 6,
  },
  questionNumber: { fontFamily: "Fredoka-SemiBold", fontSize: RFValue(16), color: colors.textBlack, marginBottom: hp("1%") },
  questionText: { fontFamily: "Jost", fontSize: RFValue(14), color: colors.textBlack, lineHeight: RFValue(21), marginBottom: hp("2.5%") },
  optionsContainer: { gap: hp("1.5%") },
  optionButton: {
    paddingVertical: hp("1.8%"),
    paddingHorizontal: wp("4%"),
    backgroundColor: colors.active,
    borderRadius: wp("3%"),
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  optionButtonSelected: {
    backgroundColor: colors.brandGreen,
    borderColor: colors.brandGreen,
  },
  optionText: { fontFamily: "Jost", fontSize: RFValue(14), color: colors.textBlack },
  optionTextSelected: { color: colors.white, fontFamily: "Fredoka-SemiBold" },
})
