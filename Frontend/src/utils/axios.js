import axios from 'axios';

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    'http://localhost:5000/api',

  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem('adminToken') ||
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

API.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    if (
      error.response?.status === 401
    ) {
      const currentPath =
        window.location.pathname;

      if (
        currentPath.startsWith('/admin')
      ) {
        localStorage.removeItem(
          'adminToken'
        );

        localStorage.removeItem(
          'token'
        );

        localStorage.removeItem(
          'admin'
        );
      }
    }

    return Promise.reject(error);
  }
);

export default API;