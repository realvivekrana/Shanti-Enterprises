import { useState } from 'react';
import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import API from '../api/axios';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =====================================================
  // HANDLE LOGIN
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      // =================================================
      // LOGIN API
      // =================================================

      const response = await API.post(
        '/auth/login',
        formData
      );

      const data = response?.data;

      // =================================================
      // BACKEND RESPONSE
      //
      // {
      //   user: {...},
      //   token: "..."
      // }
      // =================================================

      const user = data?.user;
      const token = data?.token;

      // =================================================
      // VALIDATE RESPONSE
      // =================================================

      if (!user) {
        throw new Error(
          'User information was not received from server.'
        );
      }

      if (!token) {
        throw new Error(
          'Authentication token was not received from server.'
        );
      }

      // =================================================
      // CREATE STANDARD USER INFO
      //
      // IMPORTANT:
      // Whole project will use this structure.
      // =================================================

      const userInfo = {
        ...user,
        token,
      };

      // =================================================
      // SAVE USER
      // =================================================

      localStorage.setItem(
        'userInfo',
        JSON.stringify(userInfo)
      );

      // =================================================
      // SAVE TOKEN SEPARATELY
      // =================================================

      localStorage.setItem(
        'token',
        token
      );

      // =================================================
      // ADMIN LOGIN FROM CUSTOMER LOGIN PAGE
      // =================================================

      if (user.role === 'admin') {
        navigate(
          '/admin/dashboard',
          {
            replace: true,
          }
        );

        return;
      }

      // =================================================
      // CUSTOMER REDIRECT
      // =================================================

      const from =
        location.state?.from ||
        '/dashboard';

      navigate(
        from,
        {
          replace: true,
        }
      );

    } catch (err) {

      console.error(
        'Customer login error:',
        err
      );

      setError(
        err.response?.data?.message ||
        err.message ||
        'Login failed. Please check your email and password.'
      );

    } finally {

      setLoading(false);

    }
  };

  // =====================================================
  // INPUT CLASS
  // =====================================================

  const inputClass =
    'w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent';

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-slate-50">

      <div className="w-full max-w-md">

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="text-center mb-7">

            <div className="w-14 h-14 mx-auto rounded-full bg-teal-50 text-teal-700 flex items-center justify-center text-2xl mb-4">
              👤
            </div>

            <h1 className="text-2xl font-extrabold text-slate-900">
              Customer Login
            </h1>

            <p className="text-sm text-slate-500 mt-2">
              Login to your Shanti Enterprises account
            </p>

          </div>

          {/* =================================================
              FORM
          ================================================= */}

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* EMAIL */}

            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Email
              </label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                className={inputClass}
              />

            </div>

            {/* PASSWORD */}

            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Password
              </label>

              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                className={inputClass}
              />

            </div>

            {/* ERROR */}

            {error && (

              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
                {error}
              </div>

            )}

            {/* LOGIN */}

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                bg-teal-600
                hover:bg-teal-700
                disabled:bg-slate-300
                disabled:cursor-not-allowed
                text-white
                font-semibold
                py-3
                rounded-lg
                transition
              "
            >
              {loading
                ? 'Logging in...'
                : 'Login'}
            </button>

          </form>

          {/* =================================================
              REGISTER
          ================================================= */}

          <div className="text-center mt-6">

            <p className="text-sm text-slate-600">

              Don't have an account?{' '}

              <Link
                to="/register"
                className="text-teal-700 font-semibold hover:underline"
              >
                Create Account
              </Link>

            </p>

          </div>

          {/* =================================================
              ADMIN LOGIN
          ================================================= */}

          <div className="mt-6 pt-5 border-t border-slate-200 text-center">

            <p className="text-xs text-slate-400 mb-2">
              Are you a website administrator?
            </p>

            <Link
              to="/admin/login"
              className="text-sm font-semibold text-slate-700 hover:text-teal-700"
            >
              🏢 Admin Login
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;