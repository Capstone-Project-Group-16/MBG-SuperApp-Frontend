"use client"

import { useState } from "react"
import {
  View,
  Text as RNText,
  StyleSheet,
  Modal,
  Pressable,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
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
  const [showPass, setShowPass] = useState(false)

  const onSignUp = () => {
    if (password !== confirm) {
      alert("Passwords do not match")
      return
    }
    alert(`Signed up as ${name} (${role ?? "Role not set"})`)
  }

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.container}>
        <Pressable accessibilityRole="button" onPress={() => navigation.goBack()} style={styles.back}>
          <RNText style={styles.backText}>{"←"}</RNText>
        </Pressable>

        <RNText style={styles.title}>Create Your Account</RNText>

        <FormField label="Full Name" value={name} onChangeText={setName} placeholder="Your full name" />

        <FormField
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="you@domain.com"
        />

        {/* Role dropdown */}
        <Pressable onPress={() => setRoleOpen(true)} style={{ marginBottom: 14 }} accessibilityRole="button">
          <RNText style={styles.label}>Role</RNText>
          <View style={styles.dropdown}>
            <RNText style={styles.dropdownText}>{role ?? "Select a role"}</RNText>
            <RNText style={styles.chev}>⌄</RNText>
          </View>
        </Pressable>

        <FormField
          label="Password"
          secureTextEntry={!showPass}
          value={password}
          onChangeText={setPassword}
          placeholder="Create a password"
          rightAdornment={<RNText style={{ fontSize: 16, color: colors.brandGreen }}>{showPass ? "🙈" : "👁"}</RNText>}
          onPressRightAdornment={() => setShowPass((s) => !s)}
        />

        <FormField
          label="Confirm Password"
          secureTextEntry={!showPass}
          value={confirm}
          onChangeText={setConfirm}
          placeholder="Repeat your password"
        />

        <Button title="SIGN UP" onPress={onSignUp} style={{ marginTop: 8 }} />

        <RNText style={styles.footer}>
          Already have an account?{" "}
          <RNText style={styles.link} onPress={() => navigation.navigate("SignIn")}>
            Sign in here
          </RNText>
        </RNText>

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
                  <RNText style={styles.optionText}>{item}</RNText>
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
  root: { flex: 1, backgroundColor: colors.brandMint },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 12 },
  back: { paddingVertical: 8, paddingHorizontal: 4 },
  backText: { fontSize: 20, color: colors.brandGreen },
  title: { fontSize: 24, fontWeight: "800", color: colors.text, marginTop: 4, marginBottom: 16 },
  label: { fontSize: 16, fontWeight: "600", color: colors.text, marginBottom: 8 },
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
  dropdownText: { color: colors.text, fontSize: 16, opacity: 0.9 },
  chev: { color: colors.brandGreen, fontSize: 18 },
  footer: { marginTop: 16, textAlign: "center", color: colors.text },
  link: { color: colors.text, textDecorationLine: "underline", fontWeight: "600" },
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
  optionText: { fontSize: 16, color: colors.text },
})
