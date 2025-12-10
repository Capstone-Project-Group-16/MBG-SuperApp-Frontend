import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import styled from "styled-components/native";
import BottomNavigation from "../components/bottomNavigation";
import {
    createMenu,
    getFoodList,
    getMbgList,
    getNutritionList,
    updateMenu,
    uploadFoodImage,
} from "../lib/api";

// BACK BUTTON (styled-components)
const BackButton = styled.TouchableOpacity`
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 10;
  background-color: #c1e5c0;
  padding: 6px 12px;
  border-radius: 20px;
`;

export default function CreateMenu() {
  const [level, setLevel] = useState<1 | 2>(1);

  const [menuList, setMenuList] = useState<MenuItem[]>([]);
  const [nutritionList, setNutritionList] = useState<NutritionItem[]>([]);
  const [foodOptions, setFoodOptions] = useState<FoodItem[]>([]);

  const [menuId, setMenuId] = useState<number | null>(null);

  // FORM FIELDS
  const [foodName, setFoodName] = useState("");
  const [supplyDate, setSupplyDate] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [nutritionId, setNutritionId] = useState("");
  const [imageUri, setImageUri] = useState("");

  interface MenuItem {
    foodId: number;
    foodName: string;
    foodSupplyDate: string;
    foodStock: number;
    foodOrdered: number;
    foodPrice: number;
    foodImageLink: string;
  }

  interface NutritionItem {
    nutritionId: number;
  }

  interface FoodItem {
    foodId: number;
    foodName: string;
  }

  // LOAD MENU LIST
  const loadMenu = async () => {
    const data = await getMbgList();
    setMenuList(data);
  };

  // LOAD FOOD NAME OPTIONS
  const loadFoodOptions = async () => {
    const data = await getFoodList();
    setFoodOptions(data);
  };

  // LOAD NUTRITION LIST
  const loadNutritionList = async () => {
    const data = await getNutritionList();
    setNutritionList(data);
  };

  useEffect(() => {
    loadMenu();
    loadFoodOptions();
    loadNutritionList();
  }, []);

  // PICK IMAGE
  const pickImage = async () => {
    const result: any = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  // VALIDATE SUPPLY DATE
  const isValidSupplyDate = () => {
    if (!supplyDate.includes(":")) return false;
    const parts = supplyDate.split(":");
    if (parts.length !== 3) return false;

    const [dd, mm, yyyy] = parts.map(Number);
    if (isNaN(dd) || isNaN(mm) || isNaN(yyyy)) return false;

    const date = new Date(yyyy, mm - 1, dd);
    return date instanceof Date && !isNaN(date.getTime());
  };

  // HANDLE EDIT
  const handleEdit = (item: MenuItem) => {
    setMenuId(item.foodId);
    setFoodName(item.foodName);
    setSupplyDate(item.foodSupplyDate);
    setStock(String(item.foodStock));
    setPrice(String(item.foodPrice));
    setImageUri(item.foodImageLink);
    setLevel(2);
  };

  // HANDLE SUBMIT
  const handleSubmit = async () => {
    if (!foodName || !stock || !price || !supplyDate) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    if (!isValidSupplyDate()) {
      Alert.alert("Invalid Format", "Supply date must be DD:MM:YYYY");
      return;
    }

    const cateringId = await AsyncStorage.getItem("cateringId");
    if (!cateringId) {
      Alert.alert("Error", "Missing catering ID");
      return;
    }

    const body = {
      foodName,
      foodSupplyDate: supplyDate,
      foodStock: Number(stock),
      foodPrice: Number(price),
      foodImageLink: imageUri,
      foodNutrition: nutritionId ? Number(nutritionId) : null,
      cateringId: Number(cateringId),
    };

    let result;

    if (menuId) {
      result = await updateMenu(menuId, body);
    } else {
      result = await createMenu(body);
    }

    if (imageUri && menuId) {
      await uploadFoodImage(menuId, imageUri);
    }

    Alert.alert("Success", "Menu saved successfully");

    loadMenu();
    setLevel(1);
  };

  const router = useRouter();

  const handleBack = () => {
  if (level === 1) {
        router.push("/home");
    } else {
        setLevel(1);
    }
};

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      {/* BACK BUTTON */}
      <BackButton onPress={handleBack}>
        <Text style={{ fontWeight: "700" }}>Back</Text>
    </BackButton>

      {level === 1 ? (
        // tampilan 1
        <View style={{ flex: 1 }}>
          <Text style={styles.header}>MBG Menu</Text>
          <Text style={styles.subHeader}>List of menu created</Text>

          <ScrollView
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
          >
            {menuList.map((item) => (
              <View key={item.foodId} style={styles.menuCard}>
                <Image
                  source={{ uri: item.foodImageLink }}
                  style={styles.menuImage}
                />

                <View style={{ flex: 1, marginLeft: 15 }}>
                  <Text style={styles.menuTitle}>{item.foodName}</Text>
                  <Text>Supply date: {item.foodSupplyDate}</Text>
                  <Text>Stock: {item.foodStock}</Text>
                  <Text>Total ordered: {item.foodOrdered}</Text>
                  <Text>Rp{item.foodPrice}</Text>
                </View>

                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => handleEdit(item)}
                >
                  <Text style={styles.editBtnText}>Edit</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          {/* FLOATING ADD BUTTON */}
          <TouchableOpacity
            style={styles.addFloating}
            onPress={() => {
              setMenuId(null);
              setFoodName("");
              setSupplyDate("");
              setStock("");
              setPrice("");
              setNutritionId("");
              setImageUri("");
              setLevel(2);
            }}
          >
            <Text style={styles.addBtnText}>+ ADD</Text>
          </TouchableOpacity>

          <BottomNavigation />
        </View>
      ) : (
        // tampilan 2
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ paddingBottom: 200, padding: 20 }}>
            <Text style={styles.header}>MBG Menu</Text>
            <Text style={styles.subHeader}>Make new menu</Text>

            {/* FOOD NAME DROPDOWN */}
            <View style={styles.dropdownBox}>
              <Text style={styles.dropdownLabel}>Food Name</Text>
              {foodOptions.map((f) => (
                <TouchableOpacity
                  key={f.foodId}
                  style={[
                    styles.dropdownItem,
                    foodName === f.foodName && { backgroundColor: "#b9d9b8" },
                  ]}
                  onPress={() => setFoodName(f.foodName)}
                >
                  <Text>{f.foodName}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* SUPPLY DATE + STOCK */}
            <View style={styles.row}>
              <TextInput
                style={[styles.input, { flex: 1, marginRight: 10 }]}
                placeholder="Supply Date (DD:MM:YYYY)"
                value={supplyDate}
                onChangeText={setSupplyDate}
              />

              <TextInput
                style={[styles.input, { width: 90 }]}
                placeholder="Stock"
                keyboardType="numeric"
                value={stock}
                onChangeText={setStock}
              />
            </View>

            {/* NUTRITION + PRICE */}
            <View style={styles.row}>
              <View style={[styles.dropdownBox, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.dropdownLabel}>Nutrition</Text>
                {nutritionList.map((n) => (
                  <TouchableOpacity
                    key={n.nutritionId}
                    style={[
                      styles.dropdownItem,
                      nutritionId === String(n.nutritionId) && {
                        backgroundColor: "#b9d9b8",
                      },
                    ]}
                    onPress={() => setNutritionId(String(n.nutritionId))}
                  >
                    <Text>ID: {n.nutritionId}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                style={[styles.input, { width: 120 }]}
                placeholder="Price (IDR)"
                value={price}
                keyboardType="numeric"
                onChangeText={setPrice}
              />
            </View>

            {/* IMAGE UPLOAD */}
            <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
              <Text style={{ color: "#3B5F41" }}>
                {imageUri ? "Image Selected" : "Upload Food Image"}
              </Text>
            </TouchableOpacity>
          </ScrollView>

          {/* FLOATING CONFIRM BUTTON */}
          <TouchableOpacity style={styles.confirmFloating} onPress={handleSubmit}>
            <Text style={styles.confirmText}>CONFIRM</Text>
          </TouchableOpacity>

          <BottomNavigation />
        </View>
      )}
    </View>
  );
}

// ==============================
//          STYLES
// ==============================
const styles = StyleSheet.create({
  header: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 70,
  },
  subHeader: {
    textAlign: "center",
    marginBottom: 15,
    fontSize: 14,
  },

  menuCard: {
    flexDirection: "row",
    backgroundColor: "#E8F3E5",
    borderRadius: 15,
    padding: 12,
    marginVertical: 8,
    alignItems: "center",
  },
  menuImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "700",
  },

  editBtn: {
    backgroundColor: "#2D6A4F",
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 10,
  },
  editBtnText: {
    color: "white",
  },

  addFloating: {
    position: "absolute",
    bottom: 90,
    right: 20,
    backgroundColor: "#204E35",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 50,
    elevation: 4,
  },
  addBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },

  input: {
    backgroundColor: "#E8F3E5",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },

  uploadBtn: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#3B5F41",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#E8F3E5",
  },

  dropdownBox: {
    backgroundColor: "#E8F3E5",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  dropdownLabel: {
    fontWeight: "700",
    marginBottom: 6,
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 4,
  },

  confirmFloating: {
    position: "absolute",
    bottom: 90,
    alignSelf: "center",
    backgroundColor: "#204E35",
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 40,
    elevation: 4,
  },
  confirmText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
});
