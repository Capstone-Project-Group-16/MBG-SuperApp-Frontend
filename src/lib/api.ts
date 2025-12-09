import { Platform } from "react-native";

const DEFAULT_LOCAL_BASE_URL =
  Platform.OS === "web"
    ? "http://localhost:8000"      
    : "http://192.168.1.2:8000";   

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? DEFAULT_LOCAL_BASE_URL;


export async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch (e) {
    console.log("Gagal parse JSON dari", path, e);
  }

  return { res, data };
}
