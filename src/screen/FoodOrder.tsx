"use client"

import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  Alert,
} from "react-native"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { RFValue } from "react-native-responsive-fontsize"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from "../../App"
import { colors } from "../theme/Color"
import StatusBar from "../components/StatusBar"
import Button from "../components/Button"
import { apiFetch } from "../lib/api"
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = NativeStackScreenProps<RootStackParamList, "FoodOrder">

export default function FoodOrder({ navigation, route }: Props) {
  const { studentProfileId, foodId, foodName, foodPrice, foodImageLink } = route.params

  const [budget, setBudget] = useState<string>("0")
  const [exp, setExp] = useState<string>("0")
  const [gems, setGems] = useState<string>("0")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { res, data } = await apiFetch(
          `/api/account/student-profile/get/${studentProfileId}`,
          { method: "GET" }
        )

        if (res.ok && data) {
          setBudget(String(data.budget ?? "0"))
          setExp(String(data.expPoints ?? "0"))
          setGems(String(data.mbgPoints ?? "0"))
        }
      } catch (err) {
        console.log("Failed to load student profile in FoodOrder:", err)
      }
    }

    loadProfile()
  }, [studentProfileId])

  const handleOrderNow = async () => {
    if (submitting) return
    setSubmitting(true)

    try {
      const { res, data } = await apiFetch(
        `/api/mbg-food-customizer/food-demand/order`,
        {
          method: "POST",
          body: JSON.stringify({ foodId }),
        }
      )

    if (!res.ok) {
        console.log("Order gagal:", data);
        Alert.alert("Order gagal", data?.detail || "Terjadi kesalahan saat memproses pesanan");
    } else {
        console.log("Order berhasil:", data);
        const orderId =
        data.orderId ?? data.foodDemandId ?? data.id ?? null; // SESUAIKAN dengan field sebenarnya

      if (orderId) {
        try {
          await AsyncStorage.setItem("lastOrderId", String(orderId));
          console.log("lastOrderId disimpan:", orderId);
        } catch (err) {
          console.warn("Gagal menyimpan lastOrderId ke AsyncStorage:", err);
        }
      } else {
        console.warn("orderId tidak ditemukan di response order:", data);
      }
        Alert.alert("Order berhasil", "Kamu berhasil memesan paket MBG hari ini!");

        // Langsung reset ke Home setelah order sukses
        navigation.reset({
            index: 0,
            routes: [{ name: "Home", params: { studentProfileId } }],
        });
        }
    } catch (err) {
      console.log("Error order food:", err)
      Alert.alert("Order gagal", "Terjadi kesalahan jaringan")
    } finally {
      setSubmitting(false)
    }
  }

  const displayPrice = `Rp${foodPrice.toLocaleString("id-ID")}`

  // kalau BE kirim link gambar tray → pakai itu
  // kalau tidak → pakai asset lokal default
  const hasImage = !!foodImageLink

  return (
    <SafeAreaView style={styles.root}>
      {/* Header status */}
      <View style={styles.header}>
        <StatusBar
          items={[
            {
              label: "Money",
              icon: require("../../assets/icon/money.png"),
              value: budget,
              textColor: colors.textGreen,
            },
          ]}
        />
        <View style={{ flex: 1 }} />
        <StatusBar
          items={[
            {
              label: "Exp",
              icon: require("../../assets/icon/thunder.png"),
              value: exp,
              textColor: colors.textGold,
            },
            {
              label: "Gems",
              icon: require("../../assets/icon/diamond.png"),
              value: gems,
              textColor: colors.textBlue,
            },
          ]}
        />
      </View>

      <Text style={styles.title}>{foodName}</Text>

      <View style={styles.trayWrapper}>
        {hasImage ? (
          <ImageBackground
            source={{ uri: foodImageLink! }}
            style={styles.trayImage}
            imageStyle={{ borderRadius: 24 }}
          />
        ) : (
          <View style={[styles.trayImage, { borderRadius: 24, backgroundColor: "#EEE", justifyContent: "center", alignItems: "center" }]}>
            <Text style={{ fontFamily: "Fredoka-Medium", color: "#777" }}>
              Gambar paket belum tersedia
            </Text>
          </View>
        )}
      </View>

      {/* Info harga & deskripsi singkat */}
      <View style={styles.infoBox}>
        <Text style={styles.priceLabel}>Harga Paket</Text>
        <Text style={styles.priceValue}>{displayPrice}</Text>
        <Text style={styles.descText}>
          Paket makan siang bergizi untukmu hari ini. Setelah memesan, saldo MBG harianmu akan terpakai.
        </Text>
      </View>

      {/* Tombol order */}
      <View style={styles.footer}>
        <Button
          title={submitting ? "Memproses..." : "Order Sekarang"}
          onPress={handleOrderNow}
          disabled={submitting}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("2.5%"),
    paddingHorizontal: wp("4%"),
    paddingTop: hp("4%"),
    paddingBottom: hp("1.5%"),
    marginTop: hp("1.25%"),
  },
  title: {
    fontFamily: "Fredoka-SemiBold",
    fontSize: RFValue(22),
    color: colors.textBlack,
    marginBottom: hp("1%"),
    textAlign: "center",
  },
  trayWrapper: {
    alignItems: "center",
    marginTop: hp("1%"),
    marginBottom: hp("2%"),
  },
  trayImage: {
    width: wp("80%"),
    height: hp("30%"),
    justifyContent: "center",
    alignItems: "center",
  },
  infoBox: {
    marginHorizontal: wp("6%"),
    padding: wp("4%"),
    borderRadius: 16,
    backgroundColor: "#FFF7D6", // atau colors.softYellow kalau ada
    gap: hp("0.5%"),
  },
  priceLabel: {
    fontFamily: "Fredoka-Medium",
    fontSize: RFValue(14),
    color: "#777777",
  },
  priceValue: {
    fontFamily: "Fredoka-Bold",
    fontSize: RFValue(20),
    color: colors.textBlack,
  },
  descText: {
    fontFamily: "Fredoka-Regular",
    fontSize: RFValue(12),
    color: "#777777",
    marginTop: hp("0.5%"),
  },
  footer: {
    marginTop: "auto",
    marginHorizontal: wp("6%"),
    marginBottom: hp("4%"),
  },
})
