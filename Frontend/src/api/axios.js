// ============================================================
// SHANTI ENTERPRISES
// Axios API Configuration
// ============================================================

import axios from "axios";

// ============================================================
// API BASE URL
// ============================================================

// VITE_API_URL mein "/api" na bhi likha ho to yahan khud add ho jaata hai.
// Trailing slash bhi hata diya jaata hai.
const normalizeApiUrl = (url) => {
  const clean = String(url).trim().replace(/\/+$/, "");

  return clean.endsWith("/api")
    ? clean
    : `${clean}/api`;
};

const API_URL = normalizeApiUrl(
  import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api"
);

// ============================================================
// AXIOS INSTANCE
// ============================================================

const api = axios.create({
  baseURL: API_URL,

  withCredentials: true,

  timeout: 15000,

  headers: {
    "Content-Type": "application/json",
  },
});

// ============================================================
// REQUEST INTERCEPTOR
// ============================================================

api.interceptors.request.use(
  (config) => {
    // ========================================================
    // FORM DATA
    // ========================================================

    if (
      config.data instanceof FormData
    ) {
      if (
        config.headers &&
        typeof config.headers.delete ===
          "function"
      ) {
        config.headers.delete(
          "Content-Type"
        );
      } else if (config.headers) {
        delete config.headers[
          "Content-Type"
        ];
      }
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

// ============================================================
// RESPONSE INTERCEPTOR
// ============================================================

api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    // ========================================================
    // SERVER RESPONSE
    // ========================================================

    if (error.response) {
      const status =
        error.response.status;

      const responseData =
        error.response.data;

      const serverMessage =
        responseData?.message ||
        responseData?.error;

      // ======================================================
      // BACKEND MESSAGE
      // ======================================================

      if (serverMessage) {
        error.message =
          serverMessage;
      }

      // ======================================================
      // 401
      // ======================================================

      if (status === 401) {
        console.warn(
          "Authentication required."
        );
      }

      // ======================================================
      // 403
      // ======================================================

      if (status === 403) {
        console.warn(
          "Access forbidden."
        );
      }

      // ======================================================
      // 404
      // ======================================================

      if (status === 404) {
        console.warn(
          "Requested resource not found."
        );
      }

      // ======================================================
      // 400
      // ======================================================

      if (status === 400) {
        console.warn(
          "Invalid request:",
          serverMessage ||
            "Please check the submitted data."
        );
      }

      // ======================================================
      // 429
      // ======================================================

      if (status === 429) {
        console.warn(
          "Too many requests. Please try again later."
        );
      }

      // ======================================================
      // 500+
      // ======================================================

      if (status >= 500) {
        console.error(
          "Server error:",
          serverMessage ||
            "Internal server error."
        );
      }
    }

    // ========================================================
    // REQUEST SENT BUT NO RESPONSE
    // ========================================================

    else if (error.request) {
      error.message =
        "Unable to connect to the server. Please check your connection.";
    }

    // ========================================================
    // REQUEST SETUP ERROR
    // ========================================================

    else {
      error.message =
        error.message ||
        "Something went wrong.";
    }

    return Promise.reject(error);
  }
);

// ============================================================
// EXPORT
// ============================================================

export default api;