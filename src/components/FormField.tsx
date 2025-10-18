import type React from "react"
import { View, Text, TextInput, StyleSheet, type TextInputProps, Pressable } from "react-native"
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
  wrap: { marginBottom: 14 },
  label: { fontFamily: "Jost", fontSize: 16, fontWeight: "400", color: colors.textBlack, marginBottom: 8 },
  inputWrap: { position: "relative" },
  input: {
    height: 48,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.brandBorder,
    backgroundColor: colors.brandMint,
    paddingHorizontal: 14,
    color: colors.textBlack,
    fontFamily: "Jost",
    fontSize: 16,
  },
  adornment: { position: "absolute", right: 12, top: 0, bottom: 0, justifyContent: "center", alignItems: "center" },
})
