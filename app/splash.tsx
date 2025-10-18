import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";

export default function SplashScreen() {
  const router = useRouter();

  // Redirect otomatis ke halaman utama setelah 2 detik
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/login");
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/superapp-logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Image
        source={require("@/assets/images/superapp-name.png")}
        style={styles.name}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FFE6",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  name: {
    width: 200,
    height: 60,
  },
});
