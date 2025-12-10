import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Pressable,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../App";
import { colors } from "../theme/Color";
import StatusBar from "../components/StatusBar";
import CircularProgress from "../components/CircularProgress";
import NutritionBar from "../components/NutritionBar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFValue } from "react-native-responsive-fontsize";
import { useState, useEffect } from "react";
import { apiFetch } from "../lib/api";

type Props = NativeStackScreenProps<RootStackParamList, "NutritionFacts">;

type NutritionData = {
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number;
  fiber: number;
  sodium: number;
  potassium: number;
  calcium: number;
  iron: number;
  vitaminA: number;
  vitaminC: number;
  vitaminD: number;
  magnesium: number;
};

type OrderDetails = {
  orderId: number;
  foodId: number;
  foodName: string;
  orderDate: string;
  orderStatus: string;
  foodDetails: {
    foodPrice: number;
  };
};

export default function NutritionFacts({ navigation, route }: Props) {
  const studentProfileId = route?.params?.studentProfileId;

  const [exp, setExp] = useState<string>("0");
  const [gems, setGems] = useState<string>("0");
  const [nutrition, setNutrition] = useState<NutritionData | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Target harian untuk remaja (bisa disesuaikan)
  const dailyTarget = {
    calories: 2400,
    carbohydrates: 100, // gram
    protein: 60, // gram
    fat: 50, // gram
    fiber: 30, // gram
    sodium: 2000, // mg
  };

  const getTodayDate = () => {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yyyy = now.getFullYear();
    return `${dd}:${mm}:${yyyy}`;
  };

  const loadProfile = async () => {
    if (!studentProfileId) return;

    try {
      const { res, data } = await apiFetch(
        `/api/account/student-profile/get/${studentProfileId}`,
        { method: "GET" }
      );

      if (res.ok && data) {
        setExp(String(data.expPoints ?? "0"));
        setGems(String(data.mbgPoints ?? "0"));
      }
    } catch (err) {
      console.log("Error loading profile:", err);
    }
  };

  const loadNutritionData = async () => {
    try {
      // 1. Get order history untuk hari ini
      const { res: historyRes, data: historyData } = await apiFetch(
        "/api/mbg-food-customizer/food-demand/history",
        { method: "GET" }
      );

      if (!historyRes.ok || !historyData?.orders) {
        console.log("No order history found");
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const today = getTodayDate();
      const todayOrder = historyData.orders.find(
        (order: any) =>
          order.orderDate === today &&
          (order.orderStatus === "ONGOING" || order.orderStatus === "COMPLETED")
      );

      if (!todayOrder) {
        console.log("No order found for today");
        setLoading(false);
        setRefreshing(false);
        return;
      }

      // 2. Get detail order untuk mendapatkan nutrition info
      const { res: statusRes, data: statusData } = await apiFetch(
        `/api/mbg-food-customizer/food-demand/status/${todayOrder.orderId}`,
        { method: "GET" }
      );

      if (!statusRes.ok || !statusData) {
        console.log("Failed to get order status");
        setLoading(false);
        setRefreshing(false);
        return;
      }

      setOrderDetails(statusData);

      // 3. Get food details dengan nutrition info
      const { res: foodRes, data: foodData } = await apiFetch(
        `/api/food/get/${todayOrder.foodId}`,
        { method: "GET" }
      );

      if (!foodRes.ok || !foodData?.nutrition) {
        console.log("Failed to get food nutrition");
        setLoading(false);
        setRefreshing(false);
        return;
      }

      setNutrition(foodData.nutrition);
    } catch (err) {
      console.log("Error loading nutrition data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProfile();
    loadNutritionData();
  }, [studentProfileId]);

  const onRefresh = () => {
    setRefreshing(true);
    loadProfile();
    loadNutritionData();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.brandGreen} />
          <Text style={styles.loadingText}>Memuat Data Nutrisi...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!nutrition) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.goBack()}
            style={styles.close}
          >
            <Image
              style={styles.closeIcon}
              source={require("../../assets/icon/close.png")}
              resizeMode="contain"
            />
          </Pressable>

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

        <Text style={styles.title}>Nutrition Facts</Text>

        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Belum ada data nutrisi hari ini.{"\n"}
            Pesan paket MBG untuk melihat informasi nutrisi!
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const caloriePercentage = Math.round(
    (nutrition.calories / dailyTarget.calories) * 100
  );

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.goBack()}
          style={styles.close}
        >
          <Image
            style={styles.closeIcon}
            source={require("../../assets/icon/close.png")}
            resizeMode="contain"
          />
        </Pressable>

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

      <Text style={styles.title}>Nutrition Facts</Text>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Info Order */}
        {orderDetails && orderDetails.foodDetails && (
          <View style={styles.orderInfo}>
            <Text style={styles.orderInfoText}>
              {(orderDetails.foodDetails as any).foodName || "Paket MBG Hari Ini"}
            </Text>
            <Text style={styles.orderInfoDate}>{orderDetails.orderDate}</Text>
          </View>
        )}

        {/* Calorie Circle */}
        <View style={styles.container}>
          <CircularProgress
            value={nutrition.calories}
            max={dailyTarget.calories}
            unit="KCal"
            gradientColors={[colors.gradDarkOrange, colors.gradLightOrange]}
            backgroundColor={colors.bgOrange}
            sizePercent={55}
            strokePercent={8}
            valueFontSize={RFValue(18)}
            unitFontSize={RFValue(18)}
          />
          <Text style={styles.calorieInfo}>
            {caloriePercentage}% dari target harian
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Nutrition Values</Text>

        {/* Makronutrien */}
        <NutritionBar
          label="Carbohydrate"
          value={Math.round(nutrition.carbohydrates)}
          unit="g"
          color={colors.nutriOrange}
          max={dailyTarget.carbohydrates}
        />

        <NutritionBar
          label="Protein"
          value={Math.round(nutrition.protein)}
          unit="g"
          color={colors.nutriBlue}
          max={dailyTarget.protein}
        />

        <NutritionBar
          label="Fats"
          value={Math.round(nutrition.fat)}
          unit="g"
          color={colors.nutriYellow}
          max={dailyTarget.fat}
        />

        <NutritionBar
          label="Fiber"
          value={Math.round(nutrition.fiber)}
          unit="g"
          color={colors.nutriGreen}
          max={dailyTarget.fiber}
        />

        {/* Mikronutrien */}
        <Text style={styles.sectionTitle}>Minerals & Vitamins</Text>

        <NutritionBar
          label="Sodium"
          value={Math.round(nutrition.sodium)}
          unit="mg"
          color={colors.nutriPink}
          max={dailyTarget.sodium}
        />

        <NutritionBar
          label="Potassium"
          value={Math.round(nutrition.potassium)}
          unit="mg"
          color={colors.nutriOrange}
          max={3500}
        />

        <NutritionBar
          label="Calcium"
          value={Math.round(nutrition.calcium)}
          unit="mg"
          color={colors.nutriBlue}
          max={1300}
        />

        <NutritionBar
          label="Iron"
          value={Math.round(nutrition.iron)}
          unit="mg"
          color={colors.nutriYellow}
          max={15}
        />

        <NutritionBar
          label="Vitamin A"
          value={Math.round(nutrition.vitaminA)}
          unit="mcg"
          color={colors.nutriGreen}
          max={900}
        />

        <NutritionBar
          label="Vitamin C"
          value={Math.round(nutrition.vitaminC)}
          unit="mg"
          color={colors.nutriPink}
          max={90}
        />

        <NutritionBar
          label="Vitamin D"
          value={Math.round(nutrition.vitaminD)}
          unit="mcg"
          color={colors.nutriOrange}
          max={15}
        />

        <NutritionBar
          label="Magnesium"
          value={Math.round(nutrition.magnesium)}
          unit="mg"
          color={colors.nutriBlue}
          max={400}
        />

        <View style={{ height: hp("4%") }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp("4%"),
    marginTop: hp("1.25%"),
    paddingTop: hp("4%"),
    gap: wp("3%"),
  },
  close: { paddingVertical: hp("1%"), paddingHorizontal: wp("1%") },
  closeIcon: {
    width: wp("6%"),
    height: wp("6%"),
    marginBottom: hp("0.5%"),
    tintColor: colors.brandBorder,
  },
  title: {
    fontFamily: "Fredoka-SemiBold",
    fontSize: RFValue(22),
    color: colors.textBlack,
    marginTop: hp("2%"),
    marginBottom: hp("2%"),
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  content: { paddingHorizontal: wp("4%"), paddingTop: hp("1.5%") },
  container: { alignItems: "center", marginBottom: hp("3%") },
  orderInfo: {
    backgroundColor: colors.brandGrey,
    borderRadius: wp("3%"),
    padding: wp("4%"),
    marginBottom: hp("2%"),
    alignItems: "center",
  },
  orderInfoText: {
    fontFamily: "Fredoka-SemiBold",
    fontSize: RFValue(14),
    color: colors.textBlack,
    marginBottom: hp("0.5%"),
  },
  orderInfoDate: {
    fontFamily: "Fredoka-Medium",
    fontSize: RFValue(12),
    color: colors.brandBorder,
  },
  calorieInfo: {
    fontFamily: "Fredoka-Medium",
    fontSize: RFValue(12),
    color: colors.brandBorder,
    marginTop: hp("1%"),
  },
  sectionTitle: {
    fontFamily: "Fredoka-SemiBold",
    fontSize: RFValue(16),
    color: colors.textBlack,
    marginBottom: hp("2%"),
    marginTop: hp("1%"),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp("6%"),
  },
  loadingText: {
    marginTop: hp("2%"),
    textAlign: "center",
    color: colors.brandBorder,
    fontSize: RFValue(12),
    fontFamily: "Fredoka-Medium",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp("8%"),
  },
  emptyText: {
    fontFamily: "Fredoka-Medium",
    fontSize: RFValue(14),
    color: colors.brandBorder,
    textAlign: "center",
    lineHeight: RFValue(20),
  },
});