"use client"

import { useState } from "react"
import { View, Text, StyleSheet, Pressable, Alert, KeyboardAvoidingView, Platform, Image } from "react-native"
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
    ;(navigation as any).replace("Home")
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
          placeholder="email@domain.com"
        />

        <FormField
          label="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          placeholder="Your password"
          rightAdornment={<Image style={styles.icon} source={showPassword ? require("../../assets/icon/eye-alt.png") : require("../../assets/icon/eye-slash.png")} resizeMode="contain"/>}
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
  root: { flex: 1, backgroundColor: colors.white },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 28 },
  headerRow: { marginBottom: 24, flexDirection: "row", alignItems: "center", gap: 8 },
  title: { fontFamily: "Fredoka-SemiBold", fontSize: 24, color: colors.textBlack, marginBottom: 20 },
  icon: { width: 20, height: 20, tintColor: colors.brandBorder, marginRight: 6 },
  forgot: { alignSelf: "flex-start", marginTop: 6, marginBottom: 10 },
  forgotText: { fontFamily: "Jost", fontSize: 14, fontWeight: "400", textDecorationLine: "underline", color: colors.textBlack, marginBottom: 6 },
  footer: { fontFamily: "Jost", fontSize: 14, fontWeight: "400", marginTop: 16, textAlign: "center", color: colors.textBlack },
  link: { fontFamily: "Jost-SemiBold", fontSize: 14, color: colors.textBlack, textDecorationLine: "underline" },
})
