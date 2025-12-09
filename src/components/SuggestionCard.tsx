import { View, Text, StyleSheet, Image } from "react-native"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { RFValue } from "react-native-responsive-fontsize"
import { colors } from "../theme/Color"
import MenuItemCard from "./MenuItemCard"

type Props = {
  label?: string
  text?: string
  item?: {
    id: string
    title: string
    description: string
    trayImage: any
  }
}

export default function SuggestionCard({ label, text, item }: Props) {
  return (
    <View style={styles.wrapper}>
      {/* Suggestion Box */}
      {label && text &&
        <View style={styles.suggestionBox}>
          <Text style={styles.suggestionLabel}>{label}</Text>
          <Text style={styles.suggestionText}>{text}</Text>
        </View>
      }

      {/* Recommended Meal */}
      {item && (
        <View style={{ marginHorizontal: -hp("2%") }}>
          <MenuItemCard
            item={item}
            showPrice={false}
            showOrderButton={false}
          />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
  },
  suggestionBox: {
    borderRadius: wp("8%"),
    padding: wp("4.5%"),
    marginBottom: hp("3%"),
    marginHorizontal: wp("3%"),
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
})
