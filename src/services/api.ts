// API Configuration and utilities
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/account/auth/login",
    ME: "/account/auth/me",
    REFRESH: "/account/auth/refresh",
  },
  FOOD_DEMAND: {
    MOST_ORDERED: "/mbg-food-customizer/food-demand/most-ordered",
    AVERAGE_NUTRITION: "/mbg-food-customizer/food-demand/average-nutrition",
  },
  LEADERBOARD: {
    GET: "/account/student-profile/leaderboard",
  },
};

// Helper function to make API requests
interface ApiRequestOptions extends RequestInit {
  token?: string;
}

export async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { token, ...requestOptions } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (requestOptions.headers) {
    if (requestOptions.headers instanceof Headers) {
      requestOptions.headers.forEach((value, key) => {
        headers[key] = value;
      });
    } else if (typeof requestOptions.headers === "object") {
      Object.assign(headers, requestOptions.headers);
    }
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...requestOptions,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || error.message || `API error: ${response.status}`);
  }

  return response.json();
}

// Helper to get stored token
export function getStoredToken(): string | null {
  return localStorage.getItem("authToken");
}

// Helper to store token
export function storeToken(token: string): void {
  localStorage.setItem("authToken", token);
}

// Helper to remove token
export function removeToken(): void {
  localStorage.removeItem("authToken");
}
