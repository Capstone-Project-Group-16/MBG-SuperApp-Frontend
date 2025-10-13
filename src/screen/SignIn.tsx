"use client"

import { useState } from "react"
import { View, Text, StyleSheet, Pressable, Alert, KeyboardAvoidingView, Platform } from "react-native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from "../../App"
import { colors } from "../theme/Color"
import Logo from "../components/Logo"
import { FormField } from "../components/FormField"
import Button from "../components/Button"

type Props = NativeStackScreenProps<RootStackParamList, "SignIn">

export default function SignInScreen({ navigation }: Props) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const onSignIn = () => {
    Alert.alert("Signed In", `Email: ${email}`)
  }

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Logo showIcon />
        </View>

        <Text style={styles.title}>Sign in Your Account</Text>

        <FormField
          label="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          placeholder="you@domain.com"
        />

        <FormField
          label="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          placeholder="Your password"
          rightAdornment={<Text style={{ fontSize: 16, color: colors.brandGreen }}>{showPassword ? "🙈" : "👁"}</Text>}
          onPressRightAdornment={() => setShowPassword((s) => !s)}
        />

        <Pressable
          onPress={() => Alert.alert("Forgot Password", "Implement your reset flow")}
          accessibilityRole="button"
          style={styles.forgot}
        >
          <Text style={styles.forgotText}>Forgot password?</Text>
        </Pressable>

        <Button title="SIGN IN" onPress={onSignIn} style={{ marginTop: 8 }} />

        <Text style={styles.footer}>
          {"Don't have an account? "}
          <Text style={styles.link} onPress={() => navigation.navigate("SignUp")}>
            Sign up here
          </Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.brandMint },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 28 },
  headerRow: { marginBottom: 24, flexDirection: "row", alignItems: "center", gap: 8 },
  title: { fontSize: 24, fontWeight: "800", color: colors.text, marginBottom: 20 },
  forgot: { alignSelf: "flex-start", marginTop: 6, marginBottom: 10 },
  forgotText: { textDecorationLine: "underline", color: colors.text },
  footer: { marginTop: 16, textAlign: "center", color: colors.text },
  link: { color: colors.text, textDecorationLine: "underline", fontWeight: "600" },
})
