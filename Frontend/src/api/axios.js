// ============================================================
// SHANTI ENTERPRISES
// Axios API Configuration
// Frontend Phase 1 - Foundation
// ============================================================

import axios from "axios";

// ============================================================
// API BASE URL
// ============================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

// ============================================================
// AXIOS INSTANCE
// ============================================================

const api = axios.create({
  baseURL: API_URL,

  headers: {
    "Content-Type": "application/json",
  },

  withCredentials: true,

  timeout: 15000,
});

// ============================================================
// REQUEST INTERCEPTOR
// ============================================================

api.interceptors.request.use(
  (config) => {
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
    // --------------------------------------------------------
    // SERVER RESPONSE AVAILABLE
    // --------------------------------------------------------

    if (error.response) {
      const status =
        error.response.status;

      const serverMessage =
        error.response.data?.message;

      if (serverMessage) {
        error.message =
          serverMessage;
      }

      // ------------------------------------------------------
      // UNAUTHORIZED
      // ------------------------------------------------------

      if (status === 401) {
        console.warn(
          "Authentication required."
        );
      }

      // ------------------------------------------------------
      // FORBIDDEN
      // ------------------------------------------------------

      if (status === 403) {
        console.warn(
          "Access forbidden."
        );
      }

      // ------------------------------------------------------
      // NOT FOUND
      // ------------------------------------------------------

      if (status === 404) {
        console.warn(
          "Requested resource not found."
        );
      }

      // ------------------------------------------------------
      // SERVER ERROR
      // ------------------------------------------------------

      if (status >= 500) {
        console.error(
          "Server error:",
          serverMessage ||
            "Internal server error"
        );
      }
    }

    // --------------------------------------------------------
    // REQUEST SENT BUT NO RESPONSE
    // --------------------------------------------------------

    else if (error.request) {
      error.message =
        "Unable to connect to the server.";
    }

    // --------------------------------------------------------
    // REQUEST SETUP ERROR
    // --------------------------------------------------------

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