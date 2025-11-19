import { View, Text, StyleSheet } from "react-native"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { RFValue } from "react-native-responsive-fontsize"
import { colors } from "../theme/Color"

type Props = {
  label: string
  text: string
  isRecommendation?: boolean
  mealIcon?: any
  mealTitle?: string
  mealDescription?: string
  isLiked?: boolean
  onLikPress?: () => void
}

export default function SuggestionCard({
  label,
  text,
  isRecommendation = false,
  mealIcon,
  mealTitle,
  mealDescription,
  isLiked = false,
  onLikPress,
}: Props) {
  if (isRecommendation) {
    return (
      <View style={styles.recommendationCard}>
        <View style={styles.mealIconWrapper}>
          {mealIcon && <Image source={mealIcon} style={styles.mealIcon} resizeMode="contain" />}
        </View>
        <View style={styles.mealContent}>
          <Text style={styles.mealTitle}>{mealTitle}</Text>
          <Text style={styles.mealDescription}>{mealDescription}</Text>
        </View>
        <Pressable onPress={onLikPress}>
          <Text style={styles.heartIcon}>{isLiked ? "❤️" : "🤍"}</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <View style={styles.suggestionBox}>
      <Text style={styles.suggestionLabel}>{label}</Text>
      <Text style={styles.suggestionText}>{text}</Text>
    </View>
  )
}

import { Image, Pressable } from "react-native"

const styles = StyleSheet.create({
  suggestionBox: {
    borderRadius: wp("8%"),
    padding: wp("4.5%"),
    marginBottom: hp("3%"),
    borderWidth: 2,
    borderColor: colors.brandBorder,
    backgroundColor: colors.brandMint,
    shadowColor: colors.brandGreen,
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 2, height: 2 },
    elevation: 6,
  },
  suggestionLabel: {
    fontFamily: "Fredoka-SemiBold",
    fontSize: RFValue(14),
    color: colors.textBlack,
    marginBottom: hp("1%"),
  },
  suggestionText: {
    fontFamily: "Jost",
    fontSize: RFValue(13),
    color: colors.textBlack,
    lineHeight: 20,
  },
  recommendationCard: {
    flexDirection: "row",
    borderColor: colors.brandBorder,
    backgroundColor: colors.brandMint,
    borderRadius: wp("8%"),
    padding: wp("3.5%"),
    marginBottom: hp("2%"),
    alignItems: "center",
    borderWidth: 2,
    gap: wp("3%"),
    shadowColor: colors.brandGreen,
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 2, height: 2 },
    elevation: 6,
  },
  mealIconWrapper: {
    width: wp("15%"),
    height: wp("15%"),
    borderRadius: wp("2%"),
    justifyContent: "center",
    alignItems: "center",
  },
  mealIcon: {
    width: "100%",
    height: "100%",
    borderRadius: wp("2%"),
  },
  mealContent: {
    flex: 1,
  },
  mealTitle: {
    fontFamily: "Fredoka-SemiBold",
    fontSize: RFValue(14),
    color: colors.textBlack,
    marginBottom: hp("0.5%"),
  },
  mealDescription: {
    fontFamily: "Jost",
    fontSize: RFValue(12),
    color: colors.textBlack,
    lineHeight: 18,
  },
  heartIcon: {
    fontSize: RFValue(20),
  },
})
