import type React from "react"
import { View, Text, TextInput, StyleSheet, type TextInputProps, Pressable } from "react-native"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { RFPercentage, RFValue } from "react-native-responsive-fontsize"
import { colors } from "../theme/Color"

type FormFieldProps = TextInputProps & {
  label: string
  rightAdornment?: React.ReactNode
  onPressRightAdornment?: () => void
}

export function FormField({ label, rightAdornment, onPressRightAdornment, style, ...inputProps }: FormFieldProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrap}>
        <TextInput style={[ styles.input, style ]} placeholderTextColor={colors.brandBorder} {...inputProps} />
        {rightAdornment ? (
          <Pressable
            onPress={onPressRightAdornment}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={`${label} toggle`}
            style={styles.adornment}
          >
            {rightAdornment}
          </Pressable>
        ) : null}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { marginBottom: hp("1.75%") },
  label: { fontFamily: "Jost", fontSize: RFValue(14), color: colors.textBlack, marginBottom: hp("1%") },
  inputWrap: { position: "relative" },
  input: {
    height: hp("6%"),
    borderRadius: wp("2.5%"),
    borderWidth: 2,
    borderColor: colors.brandBorder,
    backgroundColor: colors.brandMint,
    paddingHorizontal: wp("3.5%"),
    color: colors.textBlack,
    fontFamily: "Jost",
    fontSize: RFValue(14),
  },
  adornment: { position: "absolute", right: wp("3%"), top: 0, bottom: 0, justifyContent: "center", alignItems: "center" },
})
