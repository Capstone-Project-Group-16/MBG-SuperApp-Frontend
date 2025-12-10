import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { apiLogin } from "../lib/api";


export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
  try {
    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }

    const data = await apiLogin(email, password);

    const { access_token, user } = data;

    await AsyncStorage.setItem("access_token", access_token);
    await AsyncStorage.setItem("user", JSON.stringify(user));
    // await AsyncStorage.setItem('cateringId', data.userId);

    router.replace("/home");

    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      alert(message);
    }
  };


  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/superapp-logo-name.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Sign in Your Account</Text>

      {/* EMAIL */}
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#6B6B6B"
        value={email}
        onChangeText={setEmail}
      />

      {/* PASSWORD */}
      <Text style={[styles.label, { marginTop: 10 }]}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        placeholderTextColor="#6B6B6B"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* FORGOT PASSWORD
      <TouchableOpacity>
        <Text style={styles.forgot}>Forgot password?</Text>
      </TouchableOpacity> */}

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>SIGN IN</Text>
      </TouchableOpacity>

      {error ? (
        <Text style={{ color: "black", marginTop: 10, fontSize: 14 }}>
          {error}
        </Text>
      ) : null}

      {/* REGISTER LINK */}
      <Text style={styles.footerText}>
        Don’t have an account?{" "}
        <Text style={styles.link} onPress={() => Linking.openURL("https://forms.gle/b4Qvpz9kCi9QF6dt5")}>
          Register here
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
  },
  logo: {
    width: 180,
    height: 100,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 30,
    color: "#000",
  },
  label: {
    alignSelf: "flex-start",
    marginLeft: 5,
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
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
    marginTop: 5,
  },
  forgot: {
    alignSelf: "flex-end",
    marginTop: 8,
    color: "#000",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  button: {
    width: "100%",
    height: 57,
    backgroundColor: "#214626",
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
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