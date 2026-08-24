// ============================================================
// SHANTI ENTERPRISES
// Authentication Context
// Frontend Phase 1 - Foundation
// ============================================================

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../api/axios";

// ============================================================
// CREATE CONTEXT
// ============================================================

const AuthContext = createContext(null);

// ============================================================
// AUTH PROVIDER
// ============================================================

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  // ==========================================================
  // CLEAR AUTH ERROR
  // ==========================================================

  const clearError = () => {
    setError(null);
  };

  // ==========================================================
  // GET CURRENT USER
  // ==========================================================

  const getCurrentUser = async () => {
    try {
      setLoading(true);
      setError(null);

      const response =
        await api.get("/auth/me");

      if (
        response.data?.success &&
        response.data?.user
      ) {
        setUser(
          response.data.user
        );
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);

      // 401 is normal when nobody is logged in.
      if (
        err.response?.status !== 401
      ) {
        setError(
          err.response?.data?.message ||
            "Unable to get current user"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // LOGIN
  // ==========================================================

  const login = async (
    email,
    password
  ) => {
    try {
      setLoading(true);
      setError(null);

      const response =
        await api.post(
          "/auth/login",
          {
            email,
            password,
          }
        );

      if (
        response.data?.success &&
        response.data?.user
      ) {
        setUser(
          response.data.user
        );

        return response.data;
      }

      throw new Error(
        response.data?.message ||
          "Login failed"
      );
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Login failed";

      setError(message);

      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // REGISTER
  // ==========================================================

  const register = async (
    userData
  ) => {
    try {
      setLoading(true);
      setError(null);

      const response =
        await api.post(
          "/auth/register",
          userData
        );

      if (
        response.data?.success &&
        response.data?.user
      ) {
        setUser(
          response.data.user
        );

        return response.data;
      }

      throw new Error(
        response.data?.message ||
          "Registration failed"
      );
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Registration failed";

      setError(message);

      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // LOGOUT
  // ==========================================================

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);

      await api.post(
        "/auth/logout"
      );
    } catch (err) {
      // Even if logout API fails,
      // clear frontend authentication state.
      setError(
        err.response?.data?.message ||
          "Logout request failed"
      );
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  // ==========================================================
  // CHECK AUTHENTICATION ON APP START
  // ==========================================================

  useEffect(() => {
    getCurrentUser();
  }, []);

  // ==========================================================
  // CONTEXT VALUE
  // ==========================================================

  const value = {
    user,

    loading,

    error,

    isAuthenticated:
      Boolean(user),

    isAdmin:
      user?.role === "admin",

    login,

    register,

    logout,

    getCurrentUser,

    clearError,
  };

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ============================================================
// CUSTOM AUTH HOOK
// ============================================================

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}