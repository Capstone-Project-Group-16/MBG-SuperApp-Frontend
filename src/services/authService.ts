import type {
  AuthResponse,
  LoginRequest,
  RefreshTokenResponse,
  User,
} from "../types/auth";
import {
  apiRequest,
  API_ENDPOINTS,
  getStoredToken,
  storeToken,
  removeToken,
} from "./api";

class AuthService {
  /**
   * Login with email and password
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiRequest<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    // Store token if login successful
    if (response.access_token) {
      storeToken(response.access_token);
    }

    return response;
  }

  /**
   * Get current authenticated user info
   */
  async getCurrentUser(token?: string): Promise<User> {
    const authToken = token || getStoredToken();

    if (!authToken) {
      throw new Error("No authentication token found");
    }

    return apiRequest<User>(API_ENDPOINTS.AUTH.ME, {
      method: "GET",
      token: authToken,
    });
  }

  /**
   * Refresh access token
   */
  async refreshToken(token?: string): Promise<RefreshTokenResponse> {
    const authToken = token || getStoredToken();

    if (!authToken) {
      throw new Error("No authentication token found");
    }

    const response = await apiRequest<RefreshTokenResponse>(
      API_ENDPOINTS.AUTH.REFRESH,
      {
        method: "POST",
        token: authToken,
      }
    );

    // Update stored token
    if (response.access_token) {
      storeToken(response.access_token);
    }

    return response;
  }

  /**
   * Logout - remove stored token
   */
  logout(): void {
    removeToken();
    localStorage.removeItem("userData");
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!getStoredToken();
  }

  /**
   * Get stored user data
   */
  getStoredUser(): User | null {
    const userData = localStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Store user data
   */
  storeUser(user: User): void {
    localStorage.setItem("userData", JSON.stringify(user));
  }
}

export default new AuthService();
