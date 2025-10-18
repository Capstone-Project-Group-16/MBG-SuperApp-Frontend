import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function RegisterScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = () => {
    // sementara redirect ke login
    router.replace("/login");
  };

  const goToLogin = () => {
    router.push("/login");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Your Account</Text>

      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your full name"
        placeholderTextColor="#6B6B6B"
        value={fullName}
        onChangeText={setFullName}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#6B6B6B"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <Text style={styles.label}>Role</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={role}
          onValueChange={(itemValue) => setRole(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select your role" value="" />
          <Picker.Item label="Student" value="student" />
          <Picker.Item label="Teacher" value="teacher" />
          <Picker.Item label="Catering" value="catering" />
        </Picker>
      </View>

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        placeholderTextColor="#6B6B6B"
        secureTextEntry={!showPassword}
        value={password}
        onChangeText={setPassword}
      />

      <Text style={styles.label}>Confirm Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Re-enter your password"
        placeholderTextColor="#6B6B6B"
        secureTextEntry={!showPassword}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>SIGN UP</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Already have an account?{" "}
        <Text style={styles.link} onPress={goToLogin}>
          Sign in here
        </Text>
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
    paddingVertical: 60,
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    color: "#000",
    marginBottom: 30,
  },
  label: {
    alignSelf: "flex-start",
    marginLeft: 5,
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    height: 48,
    backgroundColor: "rgba(245,255,230,0.75)",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "rgba(69,162,70,0.65)",
    paddingHorizontal: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  pickerContainer: {
    width: "100%",
    height: 48,
    backgroundColor: "rgba(245,255,230,0.75)",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "rgba(69,162,70,0.65)",
    justifyContent: "center",
    marginBottom: 15,
  },
  picker: {
    color: "#000",
  },
  button: {
    width: "100%",
    height: 57,
    backgroundColor: "#214626",
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },
  footerText: {
    fontSize: 14,
    color: "#000",
    marginTop: 15,
  },
  link: {
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
