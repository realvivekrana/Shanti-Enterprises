import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';

const Register = () => {
  const navigate = useNavigate();

  // =====================================================
  // FORM STATE
  // =====================================================

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    // ===================================================
    // PASSWORD CHECK
    // ===================================================

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError(
        'Password and Confirm Password do not match.'
      );

      return;
    }

    if (formData.password.length < 6) {
      setError(
        'Password must be at least 6 characters.'
      );

      return;
    }

    setLoading(true);

    try {
      // =================================================
      // SEND ONLY BASIC USER DATA
      // =================================================

      const { data } = await API.post(
        '/auth/register',
        {
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
        }
      );

      // =================================================
      // SAVE USER IF BACKEND RETURNS LOGIN DATA
      // =================================================

      if (data?.token || data?.user) {
        localStorage.setItem(
          'userInfo',
          JSON.stringify(data)
        );
      }

      setSuccess(
        'Account created successfully!'
      );

      // =================================================
      // REDIRECT
      // =================================================

      setTimeout(() => {
        navigate('/login');
      }, 1200);

    } catch (err) {
      console.error(
        'Registration Error:',
        err
      );

      setError(
        err.response?.data?.message ||
        'Registration failed. Please try again.'
      );

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INPUT CLASS
  // =====================================================

  const inputClass =
    `
      w-full
      border
      border-slate-300
      rounded-lg
      px-4
      py-3
      text-sm
      text-slate-800
      bg-white
      focus:outline-none
      focus:ring-2
      focus:ring-teal-500
      focus:border-transparent
    `;

  // =====================================================
  // UI
  // =====================================================

  return (
    <div
      className="
        min-h-[75vh]
        flex
        items-center
        justify-center
        px-4
        py-12
        bg-slate-50
      "
    >

      <div className="w-full max-w-md">

        <div
          className="
            bg-white
            border
            border-slate-200
            rounded-2xl
            shadow-sm
            p-6
            sm:p-8
          "
        >

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="text-center mb-7">

            <div
              className="
                w-14
                h-14
                mx-auto
                rounded-full
                bg-teal-50
                text-teal-700
                flex
                items-center
                justify-center
                text-2xl
                mb-4
              "
            >
              👤
            </div>

            <h1
              className="
                text-2xl
                font-extrabold
                text-slate-900
              "
            >
              Create Account
            </h1>

            <p
              className="
                text-sm
                text-slate-500
                mt-2
              "
            >
              Create your Shanti Enterprises
              customer account
            </p>

          </div>


          {/* =================================================
              FORM
          ================================================= */}

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* =================================================
                NAME
            ================================================= */}

            <div>

              <label
                className="
                  block
                  text-sm
                  font-semibold
                  text-slate-700
                  mb-1.5
                "
              >
                Full Name
              </label>

              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
                autoComplete="name"
                className={inputClass}
              />

            </div>


            {/* =================================================
                EMAIL
            ================================================= */}

            <div>

              <label
                className="
                  block
                  text-sm
                  font-semibold
                  text-slate-700
                  mb-1.5
                "
              >
                Email
              </label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
                className={inputClass}
              />

            </div>


            {/* =================================================
                PASSWORD
            ================================================= */}

            <div>

              <label
                className="
                  block
                  text-sm
                  font-semibold
                  text-slate-700
                  mb-1.5
                "
              >
                Password
              </label>

              <input
                type="password"
                name="password"
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                autoComplete="new-password"
                className={inputClass}
              />

            </div>


            {/* =================================================
                CONFIRM PASSWORD
            ================================================= */}

            <div>

              <label
                className="
                  block
                  text-sm
                  font-semibold
                  text-slate-700
                  mb-1.5
                "
              >
                Confirm Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
                autoComplete="new-password"
                className={inputClass}
              />

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

              <div
                className="
                  bg-red-50
                  border
                  border-red-200
                  text-red-700
                  rounded-lg
                  p-3
                  text-sm
                "
              >
                {error}
              </div>

            )}


            {/* =================================================
                SUCCESS
            ================================================= */}

            {success && (

              <div
                className="
                  bg-green-50
                  border
                  border-green-200
                  text-green-700
                  rounded-lg
                  p-3
                  text-sm
                "
              >
                {success}
              </div>

            )}


            {/* =================================================
                REGISTER BUTTON
            ================================================= */}

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
                ? 'Creating Account...'
                : 'Create Account'}
            </button>

          </form>


          {/* =================================================
              LOGIN
          ================================================= */}

          <div
            className="
              text-center
              mt-6
              pt-5
              border-t
              border-slate-200
            "
          >

            <p
              className="
                text-sm
                text-slate-600
              "
            >
              Already have an account?{' '}

              <Link
                to="/login"
                className="
                  text-teal-700
                  font-semibold
                  hover:underline
                "
              >
                Login
              </Link>
            </p>

          </div>


          {/* =================================================
              PROFILE INFORMATION NOTE
          ================================================= */}

          <div
            className="
              mt-5
              bg-slate-50
              border
              border-slate-200
              rounded-xl
              p-4
            "
          >

            <p
              className="
                text-xs
                font-semibold
                text-slate-700
                mb-1
              "
            >
              💡 Complete your profile later
            </p>

            <p
              className="
                text-xs
                leading-5
                text-slate-500
              "
            >
              Business details, phone number,
              shipping address and GST information
              can be added later from your account
              or during checkout.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Register;