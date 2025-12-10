import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DEFAULT_LOCAL_BASE_URL =
  Platform.OS === "web"
    ? "http://localhost:8000"      
    : "https://9ee26450f95f.ngrok-free.app";   

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? DEFAULT_LOCAL_BASE_URL;

type ApiOptions = RequestInit & {
  skipAuth?: boolean;
};

export async function apiFetch(path: string, options: ApiOptions = {}) {
  const { skipAuth, headers, ...rest } = options;

  let token: string | null = null;

  if (!skipAuth) {
    try {
      token = await AsyncStorage.getItem("accessToken");
    } catch (e) {
      console.log("Gagal membaca accessToken dari AsyncStorage:", e);
    }
  }
  
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch (e) {
    console.log("Gagal parse JSON dari", path, e);
  }

  return { res, data };
}
