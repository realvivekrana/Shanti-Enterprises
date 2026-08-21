import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import API from '../utils/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    try {
      const storedAdmin = localStorage.getItem('admin');

      return storedAdmin
        ? JSON.parse(storedAdmin)
        : null;
    } catch (error) {
      console.error(
        'Admin localStorage parse error:',
        error
      );

      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    try {
      setLoading(true);

      const response = await API.post(
        '/auth/admin/login',
        {
          email,
          password,
        }
      );

      const responseData =
        response.data || {};

      const adminData =
        responseData.admin ||
        responseData.user ||
        responseData.data?.admin ||
        responseData.data?.user ||
        responseData.data ||
        null;

      const token =
        responseData.token ||
        responseData.data?.token ||
        responseData.accessToken ||
        null;

      if (token) {
        localStorage.setItem(
          'adminToken',
          token
        );

        localStorage.setItem(
          'token',
          token
        );
      }

      if (adminData) {
        localStorage.setItem(
          'admin',
          JSON.stringify(adminData)
        );

        setAdmin(adminData);
      }

      return {
        success: true,
        data: responseData,
      };
    } catch (error) {
      console.error(
        'Admin login error:',
        error
      );

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('admin');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('token');

    setAdmin(null);
  };

  useEffect(() => {
    const storedAdmin =
      localStorage.getItem('admin');

    if (storedAdmin) {
      try {
        setAdmin(
          JSON.parse(storedAdmin)
        );
      } catch (error) {
        console.error(
          'Stored admin parse error:',
          error
        );

        localStorage.removeItem('admin');
      }
    }
  }, []);

  const value = useMemo(
    () => ({
      admin,
      loading,
      login,
      logout,
    }),
    [admin, loading]
  );

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider'
    );
  }

  return context;
};

export default AuthContext;