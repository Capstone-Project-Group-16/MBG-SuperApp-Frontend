"use client"

import { useState } from "react"
import { View, Text, StyleSheet, Modal, Pressable, FlatList, KeyboardAvoidingView, Platform, Image } from "react-native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from "../../App"
import { colors } from "../theme/Color"
import { FormField } from "../components/FormField"
import Button from "../components/Button"

type Props = NativeStackScreenProps<RootStackParamList, "SignUp">

const ROLES = ["User", "Vendor"]

export default function SignUpScreen({ navigation }: Props) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<string | null>(null)
  const [roleOpen, setRoleOpen] = useState(false)
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const onSignUp = () => {
    if (password !== confirm) {
      alert("Passwords do not match")
      return
    }
    alert(`Signed up as ${name} (${role ?? "Role not set"})`)
    ;(navigation as any).replace("SignIn")
  }

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.container}>
        <Pressable accessibilityRole="button" onPress={() => navigation.goBack()} style={styles.back}>
          <Image style={styles.backIcon} source={require("../../assets/icon/back.png")} resizeMode="contain"/>
        </Pressable>

        <Text style={styles.title}>Create Your Account</Text>

        <FormField label="Full Name" value={name} onChangeText={setName} placeholder="Your full name" />

        <FormField
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="email@domain.com"
        />

        {/* Role dropdown */}
        <Pressable onPress={() => setRoleOpen(true)} style={{ marginBottom: 14 }} accessibilityRole="button">
          <Text style={styles.label}>Role</Text>
          <View style={styles.dropdown}>
            <Text style={styles.dropdownText}>{role ?? "Select a role"}</Text>
            <Image style={styles.dropdownIcon} source={require("../../assets/icon/dropdown.png")} resizeMode="contain"/>
          </View>
        </Pressable>

        <FormField
          label="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          placeholder="Create a password"
          rightAdornment={<Image style={styles.icon} source={showPassword ? require("../../assets/icon/eye-alt.png") : require("../../assets/icon/eye-slash.png")} resizeMode="contain"/>}
          onPressRightAdornment={() => setShowPassword((s) => !s)}
        />

        <FormField
          label="Confirm Password"
          secureTextEntry={!showPassword}
          value={confirm}
          onChangeText={setConfirm}
          placeholder="Repeat your password"
        />

        <Button title="SIGN UP" onPress={onSignUp} style={{ marginTop: 8 }} />

        <Text style={styles.footer}>
          Already have an account?{" "}
          <Text style={styles.link} onPress={() => navigation.navigate("SignIn")}>
            Sign in here
          </Text>
        </Text>

        {/* Role modal */}
        <Modal visible={roleOpen} transparent animationType="fade" onRequestClose={() => setRoleOpen(false)}>
          <Pressable style={styles.modalBackdrop} onPress={() => setRoleOpen(false)}>
            <View />
          </Pressable>
          <View style={styles.modalSheet}>
            <FlatList
              data={ROLES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    setRole(item)
                    setRoleOpen(false)
                  }}
                  style={styles.option}
                >
                  <Text style={styles.optionText}>{item}</Text>
                </Pressable>
              )}
            />
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 12 },
  back: { paddingVertical: 8, paddingHorizontal: 4 },
  backIcon: { width: 18, height: 18, tintColor: colors.brandBorder, marginBottom: 4 },
  title: { fontFamily: "Fredoka-SemiBold", fontSize: 24, color: colors.textBlack, marginTop: 4, marginBottom: 16 },
  icon: { width: 20, height: 20, tintColor: colors.brandBorder, marginRight: 6 },
  label: { fontFamily: "Jost", fontSize: 16, color: colors.textBlack, marginBottom: 8 },
  dropdown: {
    height: 48,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.brandBorder,
    backgroundColor: colors.brandMint,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownText: { color: colors.brandBorder, fontFamily: "Jost", fontSize: 16, opacity: 0.9 },
  dropdownIcon: { width: 15, height: 15, tintColor: colors.brandBorder, marginRight: 4 },
  footer: { fontFamily: "Jost", fontSize: 14, fontWeight: "400", marginTop: 16, textAlign: "center", color: colors.textBlack },
  link: { fontFamily: "Jost-SemiBold", fontSize: 14, color: colors.textBlack, textDecorationLine: "underline" },
  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.25)" },
  modalSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    paddingBottom: 24,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  option: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e5e5e5",
  },
  optionText: { fontSize: 16, color: colors.textBlack },
})
