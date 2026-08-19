import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000';

const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  // =====================================================
  // HANDLE LOGIN
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');

    // ===================================================
    // VALIDATION
    // ===================================================

    if (!email.trim()) {
      setError(
        'Please enter admin email.'
      );
      return;
    }

    if (!password) {
      setError(
        'Please enter password.'
      );
      return;
    }

    try {

      setLoading(true);

      // =================================================
      // ADMIN LOGIN API
      // =================================================

      const response = await fetch(
        `${API_URL}/api/auth/admin/login`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            email:
              email.trim().toLowerCase(),

            password,
          }),
        }
      );

      const result =
        await response.json();

      // =================================================
      // API ERROR
      // =================================================

      if (!response.ok) {
        throw new Error(
          result?.message ||
          result?.error ||
          result?.data?.message ||
          'Invalid admin email or password'
        );
      }

      // =================================================
      // RESPONSE DATA
      //
      // Supports:
      //
      // {
      //   user: {...},
      //   token: "..."
      // }
      //
      // OR
      //
      // {
      //   data: {
      //     user: {...},
      //     token: "..."
      //   }
      // }
      // =================================================

      const data =
        result?.data || result;

      const user =
        data?.user ||
        data?.admin ||
        null;

      const token =
        data?.token ||
        data?.accessToken ||
        null;

      // =================================================
      // USER CHECK
      // =================================================

      if (!user) {
        throw new Error(
          'Administrator information was not received.'
        );
      }

      // =================================================
      // TOKEN CHECK
      // =================================================

      if (!token) {
        throw new Error(
          'Login successful, but authentication token was not received.'
        );
      }

      // =================================================
      // ADMIN ROLE CHECK
      // =================================================

      if (
        user.role !== 'admin'
      ) {
        throw new Error(
          'This account does not have administrator access.'
        );
      }

      // =================================================
      // STANDARD AUTH OBJECT
      // =================================================

      const adminUser = {
        ...user,
        token,
      };

      // =================================================
      // SAVE USER
      // =================================================

      localStorage.setItem(
        'userInfo',
        JSON.stringify(adminUser)
      );

      // =================================================
      // SAVE TOKEN
      // =================================================

      localStorage.setItem(
        'token',
        token
      );

      // Keep this because some existing
      // admin code may use adminToken.

      localStorage.setItem(
        'adminToken',
        token
      );

      // =================================================
      // REDIRECT
      // =================================================

      navigate(
        '/admin/dashboard',
        {
          replace: true,
        }
      );

    } catch (error) {

      console.error(
        'Admin login error:',
        error
      );

      setError(
        error.message ||
        'Unable to login as administrator.'
      );

    } finally {

      setLoading(false);

    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-md">

        {/* =================================================
            CARD
        ================================================= */}

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="px-6 sm:px-8 pt-8 pb-6 border-b border-slate-100">

            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center text-xl font-bold">
                S
              </div>

              <div>

                <p className="text-xs font-semibold uppercase tracking-wider text-teal-600">
                  Shanti Enterprises
                </p>

                <h1 className="text-xl font-bold text-slate-900">
                  Admin Login
                </h1>

              </div>

            </div>

            <p className="text-sm text-slate-500 mt-5">
              Sign in to manage your wholesale business.
            </p>

          </div>

          {/* =================================================
              FORM
          ================================================= */}

          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8 space-y-5"
          >

            {/* ERROR */}

            {error && (

              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">

                <p className="font-semibold">
                  Login failed
                </p>

                <p className="mt-1">
                  {error}
                </p>

              </div>

            )}

            {/* EMAIL */}

            <div>

              <label
                htmlFor="admin-email"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Admin Email
              </label>

              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
                placeholder="admin@test.com"
                autoComplete="email"
                disabled={loading}
                required
                className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white text-slate-800 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-50 disabled:bg-slate-100 disabled:cursor-not-allowed"
              />

            </div>

            {/* PASSWORD */}

            <div>

              <label
                htmlFor="admin-password"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Password
              </label>

              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                placeholder="Enter password"
                autoComplete="current-password"
                disabled={loading}
                required
                className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white text-slate-800 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-50 disabled:bg-slate-100 disabled:cursor-not-allowed"
              />

            </div>

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-teal-600 text-white font-bold text-sm hover:bg-teal-700 transition disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              {loading
                ? 'Signing in...'
                : 'Sign in as Admin'}
            </button>

          </form>

        </div>

        {/* BACK TO WEBSITE */}

        <button
          type="button"
          onClick={() =>
            navigate('/')
          }
          className="w-full mt-4 text-sm text-slate-500 hover:text-teal-600 transition"
        >
          ← Back to website
        </button>

      </div>

    </div>
  );
};

export default AdminLogin;