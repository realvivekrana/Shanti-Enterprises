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
    // --------------------------------------------------------
    // FormData requests
    // --------------------------------------------------------
    // Browser automatically adds the correct multipart
    // boundary. Therefore we remove the default JSON
    // content type when FormData is being sent.
    // --------------------------------------------------------

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
    // --------------------------------------------------------
    // SERVER RESPONSE AVAILABLE
    // --------------------------------------------------------

    if (error.response) {
      const status =
        error.response.status;

      const responseData =
        error.response.data;

      const serverMessage =
        responseData?.message ||
        responseData?.error;

      // ------------------------------------------------------
      // USE BACKEND ERROR MESSAGE
      // ------------------------------------------------------

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
      // VALIDATION ERROR
      // ------------------------------------------------------

      if (status === 400) {
        console.warn(
          "Invalid request:",
          serverMessage ||
            "Please check the submitted data."
        );
      }

      // ------------------------------------------------------
      // SERVER ERROR
      // ------------------------------------------------------

      if (status >= 500) {
        console.error(
          "Server error:",
          serverMessage ||
            "Internal server error."
        );
      }
    }

    // --------------------------------------------------------
    // REQUEST SENT BUT NO RESPONSE
    // --------------------------------------------------------

    else if (error.request) {
      error.message =
        "Unable to connect to the server. Please check your connection.";
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