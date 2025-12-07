import { Pressable, Text, StyleSheet, type ViewStyle } from "react-native"
import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import { RFValue } from "react-native-responsive-fontsize"
import { colors } from "../theme/Color"

export default function Button({
  title,
  onPress,
  style,
  disabled,
  fontSize,
}: {
  title: string
  onPress: () => void
  style?: ViewStyle
  disabled?: boolean
  fontSize?: number
}) {
  const computedFontSize = fontSize ? RFValue(fontSize) : RFValue(18)

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={({ pressed }) => [
        styles.btn,
        style,
        pressed && { opacity: 0.9 },
        disabled && { opacity: 0.6 },
      ]}
    >
      <Text style={[styles.text, { fontSize: computedFontSize }]}>{title}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  btn: {
    height: hp("7%"),
    borderRadius: hp("3.5%"),
    backgroundColor: colors.brandGreen,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: colors.white,
    fontFamily: "Fredoka-SemiBold",
    letterSpacing: 1,
  },
})
