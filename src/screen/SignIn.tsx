"use client"

import { useState } from "react"
import { View, Text, StyleSheet, Pressable, Alert, KeyboardAvoidingView, Platform, Image, Linking } from "react-native"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { RFPercentage, RFValue } from "react-native-responsive-fontsize"
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

  const onSignIn = async () => {
  if (!email || !password) {
    Alert.alert("Error", "Email dan password harus diisi");
    return;
  }

  try {
    const res = await fetch("http://192.168.1.9:8000/api/account/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userEmail: email,
        userPassword: password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      Alert.alert("Login Failed", data.detail || "Invalid credentials");
      return;
    }

    console.log("LOGIN SUCCESS:", data);

    Alert.alert("Success", "Login berhasil!");
    (navigation as any).replace("Home");
  } catch (error) {
    console.log(error);
    Alert.alert("Network Error", "Tidak bisa terhubung ke server");
  }
};


  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Logo/>
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

        <Button title="SIGN IN" onPress={onSignIn} style={{ marginTop: hp("1%") }} />

        <Text style={styles.footer}>
          {"Don't have an account? "}
          <Text style={styles.link} onPress={() => Linking.openURL("https://forms.gle/6H4VXToNmtwMtbDu6")}>
            Register here
          </Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  container: { flex: 1, paddingHorizontal: wp("5%"), paddingTop: hp("6%") },
  headerRow: { marginBottom: hp("2%"), flexDirection: "row", alignItems: "center", gap: wp("2%") },
  title: { fontFamily: "Fredoka-SemiBold", fontSize: RFValue(22), color: colors.textBlack, marginBottom: hp("2.5%") },
  icon: { width: wp("5%"), height: wp("5%"), tintColor: colors.brandBorder, marginRight: wp("1.5%") },
  forgot: { alignSelf: "flex-start", marginTop: hp("0.75%"), marginBottom: hp("1.25%") },
  forgotText: { fontFamily: "Jost", fontSize: RFValue(14), fontWeight: "400", textDecorationLine: "underline", color: colors.textBlack, marginBottom: hp("0.75%") },
  footer: { fontFamily: "Jost", fontSize: RFValue(12), marginTop: hp("2%"), textAlign: "center", color: colors.textBlack },
  link: { fontFamily: "Jost-SemiBold", fontSize: RFValue(12), color: colors.textBlack, textDecorationLine: "underline" },
})
