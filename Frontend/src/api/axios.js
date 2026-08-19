import axios from 'axios';

// =====================================================
// API BASE URL
// =====================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000';

// =====================================================
// AXIOS INSTANCE
// =====================================================

const API = axios.create({
  baseURL: `${API_URL}/api`,

  headers: {
    'Content-Type': 'application/json',
  },
});

// =====================================================
// REQUEST INTERCEPTOR
// =====================================================

API.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem('token');

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

// =====================================================
// RESPONSE INTERCEPTOR
// =====================================================

API.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    // =================================================
    // UNAUTHORIZED
    // =================================================

    if (
      error.response?.status === 401
    ) {
      const currentPath =
        window.location.pathname;

      // ===============================================
      // ADMIN
      // ===============================================

      if (
        currentPath.startsWith('/admin')
      ) {
        localStorage.removeItem(
          'userInfo'
        );

        localStorage.removeItem(
          'token'
        );

        localStorage.removeItem(
          'adminToken'
        );

        window.location.href =
          '/admin/login';
      }

      // ===============================================
      // CUSTOMER
      // ===============================================

      else {
        localStorage.removeItem(
          'userInfo'
        );

        localStorage.removeItem(
          'token'
        );

        localStorage.removeItem(
          'adminToken'
        );

        window.location.href =
          '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default API;