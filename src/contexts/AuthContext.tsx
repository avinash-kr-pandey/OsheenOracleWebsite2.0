"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { fetchData, setAuthToken } from "@/utils/api/api";
import { toast } from "react-hot-toast";

/* =======================
   Types
======================= */

// Core User Data Interface
export interface UserData {
  id: string;
  name: string;
  email: string;
  type: string; // Required property
  phone?: string;
  avatar?: string;
  joinDate?: string;
  membership?: string;
  loyaltyPoints?: number;
  dateOfBirth?: string;
  // Optional backend properties
  _id?: string; // For MongoDB _id
  picture?: string; // For Google login
  createdAt?: string;
  updatedAt?: string;
}

// API Response Interface
export interface ApiResponse {
  success: boolean;
  message?: string;
  data?: UserData | Record<string, unknown>;
  user?: UserData;
  token?: string;
}

// Auth Response Interface
export interface AuthResponse {
  success?: boolean;
  token?: string;
  user?: UserData;
  message?: string;
  resetToken?: string;
  otpId?: string;
  verified?: boolean;
  requiresOtp?: boolean;
  data?: {
    token?: string;
    user?: UserData;
  };
}

// Google Auth Types
export interface GoogleUserData {
  email: string;
  name: string;
  picture?: string;
  googleId?: string;
  [key: string]: unknown;
  token?: string;
}

export interface GoogleAuthResponse {
  token: string;
  user: UserData;
  success: boolean;
  message?: string;
}

export interface GoogleTokenResponse {
  success: boolean;
  user?: UserData;
  message?: string;
}

// Extended Session for NextAuth
export interface ExtendedSession {
  user?: {
    email?: string | null;
    name?: string | null;
    image?: string | null;
  };
  accessToken?: string;
  expires?: string;
}

// Error Response Interface
export interface ErrorResponse {
  response?: {
    data?: {
      message: string;
      requiresOtp?: boolean;
      otpId?: string;
    };
  };
  message?: string;
}

// Auth Context Type
export interface AuthContextType {
  user: UserData | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string, userData: UserData) => void;
  logout: () => void;
  updateUser: (userData: UserData) => void;
  checkAuth: () => Promise<void>;
}

// ✅ AuthProviderProps type define करें
export interface AuthProviderProps {
  children: ReactNode;
}

/* =======================
   Context
======================= */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* =======================
   Hook
======================= */

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

/* =======================
   Provider
======================= */

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  /* =======================
     Initial Auth Check
  ======================= */

  useEffect(() => {
    const initializeAuth = async () => {
      // First check localStorage for existing auth
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      console.log("Initial auth check:", {
        storedToken: !!storedToken,
        storedUser: !!storedUser,
      });

      if (storedToken && storedUser) {
        try {
          // Set token immediately for better UX
          setTokenState(storedToken);
          setAuthToken(storedToken);

          const userData = JSON.parse(storedUser) as UserData;
          if (userData && userData.id && userData.email) {
            setUser(userData);
            setIsAuthenticated(true);
            console.log("User authenticated from localStorage:", userData);
          }
        } catch (error) {
          console.error("Error parsing stored user:", error);
          localStorage.removeItem("user");
        }
      }

      setInitialized(true);
      setLoading(false);
    };

    initializeAuth();
  }, []);

  /* =======================
     Check Auth with Server
  ======================= */

  const checkAuth = async () => {
    try {
      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        console.log("No token found, user is not authenticated");
        setUser(null);
        setIsAuthenticated(false);
        setTokenState(null);
        return;
      }

      // Set token for API calls
      setTokenState(storedToken);
      setAuthToken(storedToken);

      console.log("Fetching user profile with token...");

      // Fetch user profile from server
      const response = (await fetchData("/auth/profile")) as ApiResponse;

      console.log("Profile API response:", response);

      // Handle different response formats
      let userData: UserData | null = null;

      if (response.success) {
        if (response.user) {
          userData = response.user;
        } else if (
          response.data &&
          typeof response.data === "object" &&
          "id" in response.data &&
          "email" in response.data
        ) {
          userData = response.data as UserData;
        }
      }

      if (userData && userData.id && userData.email) {
        console.log("User authenticated from server:", userData);
        setUser(userData);
        setIsAuthenticated(true);

        // Update localStorage with fresh data
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        console.error("Invalid user data received");
        throw new Error("Invalid user data");
      }
    } catch (error: unknown) {
      console.error("Auth check failed:", error);

      // Clear invalid auth data
      if (
        error instanceof Error &&
        (error.message.includes("401") ||
          error.message.includes("token") ||
          error.message.includes("auth"))
      ) {
        console.log("Clearing invalid auth data");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setIsAuthenticated(false);
        setTokenState(null);
        setAuthToken("");
      }
    }
  };

  /* =======================
     Login
  ======================= */

  const login = (token: string, userData: UserData) => {
    console.log("AuthContext: Login called", { token, userData });

    // Store in localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));

    // Update state
    setTokenState(token);
    setAuthToken(token);
    setUser(userData);
    setIsAuthenticated(true);

    console.log("AuthContext: Login successful, user authenticated");

    // Trigger re-render in components
    window.dispatchEvent(new Event("authStateChange"));
  };

  /* =======================
     Logout
  ======================= */

  const logout = () => {
    console.log("AuthContext: Logout called");

    // Clear everything
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setTokenState(null);
    setAuthToken("");
    setUser(null);
    setIsAuthenticated(false);

    console.log("AuthContext: Logout successful");

    // Trigger re-render
    window.dispatchEvent(new Event("authStateChange"));
  };

  /* =======================
     Update User
  ======================= */

  const updateUser = (userData: UserData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  /* =======================
     Context Value
  ======================= */

  const contextValue: AuthContextType = {
    user,
    token,
    isAuthenticated,
    loading: loading || !initialized,
    login,
    logout,
    updateUser,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
