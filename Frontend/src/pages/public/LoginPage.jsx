// ============================================================
// SHANTI ENTERPRISES
// Professional Customer / Admin Login Page
// Frontend - Authentication
// ============================================================

import { useEffect, useState } from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

// ============================================================
// INLINE SVG ICONS
// ============================================================

const ShieldIcon = ({ size = 22 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6l7-3z" />
    <path d="M9.5 12l1.7 1.7 3.5-3.7" />
  </svg>
);

const UserIcon = ({ size = 22 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5 20c.8-3.5 3.2-5.5 7-5.5s6.2 2 7 5.5" />
  </svg>
);

const UserPlusIcon = ({ size = 22 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="9" cy="8" r="3.2" />
    <path d="M2.8 20c.7-3.4 2.8-5.3 6.2-5.3 2.2 0 3.8.7 5 2" />
    <path d="M18 8v6" />
    <path d="M15 11h6" />
  </svg>
);

const MailIcon = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect
      x="3"
      y="5"
      width="18"
      height="14"
      rx="2"
    />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

const LockIcon = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect
      x="4"
      y="10"
      width="16"
      height="11"
      rx="2"
    />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </svg>
);

const EyeIcon = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z" />
    <circle cx="12" cy="12" r="2.5" />
  </svg>
);

const EyeOffIcon = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3 3l18 18" />
    <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
    <path d="M9.2 5.4A9.8 9.8 0 0 1 12 5c6 0 9.5 7 9.5 7a17 17 0 0 1-3.1 3.7" />
    <path d="M6.2 6.2C3.8 8.1 2.5 12 2.5 12S6 19 12 19c1.5 0 2.8-.3 4-.9" />
  </svg>
);

const ArrowRightIcon = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h13" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

const ArrowLeftIcon = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M19 12H5" />
    <path d="m11 18-6-6 6-6" />
  </svg>
);

const BoxIcon = ({ size = 22 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3z" />
    <path d="m4 7.5 8 4.5 8-4.5" />
    <path d="M12 12v9" />
  </svg>
);

const RupeeIcon = ({ size = 22 }) => (
  <span
    style={{
      fontSize: size,
      fontWeight: 700,
      lineHeight: 1,
    }}
    aria-hidden="true"
  >
    ₹
  </span>
);

const ZapIcon = ({ size = 22 }) => (
  <span
    style={{
      fontSize: size,
      lineHeight: 1,
    }}
    aria-hidden="true"
  >
    ⚡
  </span>
);

// ============================================================
// FEATURE DATA
// ============================================================

const features = [
  {
    icon: <ShieldIcon size={24} />,
    title: "Secure Account",
    text: "Protected authentication for your business",
  },
  {
    icon: <RupeeIcon size={25} />,
    title: "Easy Payments",
    text: "Fast and secure checkout experience",
  },
  {
    icon: <BoxIcon size={24} />,
    title: "Order Tracking",
    text: "Real-time updates on every purchase",
  },
  {
    icon: <ZapIcon size={24} />,
    title: "Business Ready",
    text: "Built for growing businesses",
  },
];

// ============================================================
// LOGIN PAGE
// ============================================================

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    user,
    loading: authLoading,
    login,
    error: authError,
    clearError,
  } = useAuth();

  // ==========================================================
  // ROLE
  // ==========================================================

  const [loginType, setLoginType] =
    useState("customer");

  // ==========================================================
  // FORM
  // ==========================================================

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [rememberMe, setRememberMe] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [localError, setLocalError] =
    useState("");

  // ==========================================================
  // DETECT ADMIN LOGIN URL
  // ==========================================================

  useEffect(() => {
    if (location.pathname === "/admin/login") {
      setLoginType("admin");
    } else {
      setLoginType("customer");
    }
  }, [location.pathname]);

  // ==========================================================
  // IF ALREADY LOGGED IN
  // ==========================================================

  useEffect(() => {
    if (!user) {
      return;
    }

    if (user.role === "admin") {
      navigate("/admin", {
        replace: true,
      });

      return;
    }

    navigate("/orders", {
      replace: true,
    });
  }, [user, navigate]);

  // ==========================================================
  // CHANGE LOGIN TYPE
  // ==========================================================

  const handleLoginTypeChange = (type) => {
    setLoginType(type);
    setLocalError("");

    if (clearError) {
      clearError();
    }

    if (type === "admin") {
      navigate("/admin/login", {
        replace: true,
      });
    } else {
      navigate("/login", {
        replace: true,
      });
    }
  };

  // ==========================================================
  // SUBMIT LOGIN
  // ==========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLocalError("");

    if (clearError) {
      clearError();
    }

    const cleanEmail =
      email.trim().toLowerCase();

    if (!cleanEmail) {
      setLocalError(
        "Please enter your email address."
      );

      return;
    }

    if (!password) {
      setLocalError(
        "Please enter your password."
      );

      return;
    }

    setSubmitting(true);

    try {
      const response = await login(
        cleanEmail,
        password
      );

      const loggedInUser =
        response?.user;

      if (!loggedInUser) {
        throw new Error(
          "Login succeeded but user information was not returned."
        );
      }

      // ------------------------------------------------------
      // ROLE PROTECTION
      // ------------------------------------------------------

      if (
        loginType === "admin" &&
        loggedInUser.role !== "admin"
      ) {
        setLocalError(
          "This account is not an administrator account."
        );

        return;
      }

      if (
        loginType === "customer" &&
        loggedInUser.role === "admin"
      ) {
        setLocalError(
          "Please use Admin Login for this account."
        );

        return;
      }

      // ------------------------------------------------------
      // REMEMBER ME
      // ------------------------------------------------------

      if (rememberMe) {
        localStorage.setItem(
          "shantiRememberEmail",
          cleanEmail
        );
      } else {
        localStorage.removeItem(
          "shantiRememberEmail"
        );
      }

      // ------------------------------------------------------
      // REDIRECT
      // ------------------------------------------------------

      if (loggedInUser.role === "admin") {
        navigate("/admin", {
          replace: true,
        });
      } else {
        navigate("/orders", {
          replace: true,
        });
      }
    } catch (error) {
      setLocalError(
        error?.message ||
          "Unable to sign in. Please check your credentials."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================================
  // LOAD REMEMBERED EMAIL
  // ==========================================================

  useEffect(() => {
    const savedEmail =
      localStorage.getItem(
        "shantiRememberEmail"
      );

    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // ==========================================================
  // ACTIVE ERROR
  // ==========================================================

  const errorMessage =
    localError ||
    authError ||
    "";

  // ==========================================================
  // LOADING
  // ==========================================================

  const isSubmitting =
    submitting || authLoading;

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="se-login-page">
      {/* ====================================================
          PAGE STYLES
      ==================================================== */}

      <style>{`
        .se-login-page {
          width: 100%;
          min-height: calc(100vh - 86px);
          background: #f5f8fc;
          color: #14213d;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
          overflow-x: hidden;
        }

        .se-login-page *,
        .se-login-page *::before,
        .se-login-page *::after {
          box-sizing: border-box;
        }

        .se-login-page button,
        .se-login-page input {
          font: inherit;
        }

        /* ==================================================
           MAIN LOGIN LAYOUT
        ================================================== */

        .se-login-main {
          width: 100%;
          min-height: calc(100vh - 86px);
          display: grid;
          grid-template-columns:
            minmax(0, 0.9fr)
            minmax(0, 1.1fr);
        }

        /* ==================================================
           LEFT BRAND PANEL
        ================================================== */

        .se-brand-panel {
          position: relative;
          overflow: hidden;
          min-height: 760px;
          padding: 76px 64px 42px;

          background:
            radial-gradient(
              circle at 80% 8%,
              rgba(59, 130, 246, 0.26),
              transparent 27%
            ),
            linear-gradient(
              145deg,
              #061a38 0%,
              #082a59 52%,
              #061a37 100%
            );

          color: #ffffff;
        }

        .se-brand-panel::before {
          content: "";
          position: absolute;
          inset: 0;
          opacity: 0.22;

          background-image:
            radial-gradient(
              rgba(147, 197, 253, 0.65) 1px,
              transparent 1px
            );

          background-size: 22px 22px;

          mask-image: linear-gradient(
            to bottom,
            black 0%,
            transparent 50%
          );

          pointer-events: none;
        }

        .se-brand-panel::after {
          content: "";
          position: absolute;
          left: -15%;
          right: -15%;
          bottom: -130px;
          height: 350px;

          background:
            linear-gradient(
              to top,
              rgba(2, 12, 28, 0.85),
              transparent
            );

          pointer-events: none;
        }

        .se-panel-content {
          position: relative;
          z-index: 2;
          max-width: 620px;
        }

        /* ==================================================
           MARKET BADGE
        ================================================== */

        .se-market-badge {
          display: inline-flex;
          align-items: center;
          gap: 9px;

          padding: 10px 16px;

          border-radius: 12px;

          background: rgba(37, 99, 235, 0.13);

          border: 1px solid
            rgba(96, 165, 250, 0.22);

          color: #a9ccff;

          font-size: 13px;
          font-weight: 750;
          letter-spacing: 0.1px;
        }

        /* ==================================================
           LEFT TITLE
        ================================================== */

        .se-panel-title {
          margin: 30px 0 18px;

          font-size:
            clamp(42px, 4vw, 64px);

          line-height: 1.02;

          letter-spacing: -2.6px;

          font-weight: 850;
        }

        .se-panel-title-highlight {
          color: #4d8cff;
        }

        .se-panel-description {
          max-width: 590px;
          margin: 0;

          color: #d6e2f4;

          font-size: 17px;
          line-height: 1.65;
        }

        /* ==================================================
           FEATURES
        ================================================== */

        .se-feature-grid {
          margin-top: 46px;

          display: grid;

          grid-template-columns:
            repeat(2, minmax(0, 1fr));

          gap: 30px 34px;
        }

        .se-feature {
          display: flex;
          align-items: flex-start;
          gap: 17px;
        }

        .se-feature-icon {
          width: 58px;
          height: 58px;

          flex: 0 0 58px;

          border-radius: 50%;

          display: flex;
          align-items: center;
          justify-content: center;

          background:
            rgba(74, 130, 229, 0.27);

          border: 1px solid
            rgba(147, 197, 253, 0.14);

          color: #e5efff;
        }

        .se-feature-title {
          margin: 3px 0 7px;

          font-size: 16px;
          font-weight: 800;

          color: #ffffff;
        }

        .se-feature-text {
          margin: 0;

          color: #b9c9de;

          font-size: 14px;
          line-height: 1.55;
        }

        /* ==================================================
           LEFT FOOTER
        ================================================== */

        .se-panel-footer {
          position: absolute;

          left: 64px;
          right: 64px;
          bottom: 34px;

          z-index: 3;

          display: flex;
          align-items: center;
          justify-content: space-between;

          color: #c5d5e9;

          font-size: 13px;
        }

        .se-secure-label {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .se-secure-dot {
          color: #4ade80;
        }

        /* ==================================================
           RIGHT FORM PANEL
        ================================================== */

        .se-form-panel {
          min-height: 760px;

          padding: 50px 55px;

          display: flex;
          align-items: center;
          justify-content: center;

          background:
            radial-gradient(
              circle at 20% 15%,
              rgba(59, 130, 246, 0.07),
              transparent 28%
            ),
            #f8fafc;
        }

        .se-form-wrapper {
          width: 100%;
          max-width: 650px;
        }

        /* ==================================================
           LOGIN CARD
        ================================================== */

        .se-login-card {
          width: 100%;

          background: #ffffff;

          border: 1px solid #e4e9f0;

          border-radius: 20px;

          box-shadow:
            0 25px 65px rgba(15, 23, 42, 0.10),
            0 4px 14px rgba(15, 23, 42, 0.04);

          overflow: hidden;
        }

        .se-login-card-main {
          padding: 38px 42px 40px;
        }

        /* ==================================================
           CUSTOMER / ADMIN TABS
        ================================================== */

        .se-role-tabs {
          display: grid;

          grid-template-columns: 1fr 1fr;

          border-bottom: 1px solid #e1e6ee;

          margin-bottom: 34px;
        }

        .se-role-tab {
          position: relative;

          height: 54px;

          border: 0;

          background: transparent;

          cursor: pointer;

          color: #65748b;

          font-size: 16px;
          font-weight: 700;

          display: flex;
          align-items: center;
          justify-content: center;

          gap: 10px;

          transition:
            color 0.2s ease,
            background 0.2s ease;
        }

        .se-role-tab:hover {
          color: #155eef;
        }

        .se-role-tab.active {
          color: #155eef;
        }

        .se-role-tab.active::after {
          content: "";

          position: absolute;

          bottom: -1px;

          left: 7%;
          right: 7%;

          height: 3px;

          border-radius: 3px 3px 0 0;

          background: #155eef;
        }

        /* ==================================================
           HEADING
        ================================================== */

        .se-form-heading {
          margin-bottom: 23px;
        }

        .se-form-heading h1 {
          margin: 0 0 8px;

          color: #14213d;

          font-size: 32px;

          line-height: 1.2;

          letter-spacing: -1px;

          font-weight: 850;
        }

        .se-form-heading p {
          margin: 0;

          color: #64748b;

          font-size: 15px;

          line-height: 1.6;
        }

        /* ==================================================
           ROLE NOTE
        ================================================== */

        .se-role-note {
          margin: 0 0 24px;

          padding: 11px 14px;

          border-radius: 9px;

          background: #eff6ff;

          border: 1px solid #dbeafe;

          color: #1d4ed8;

          font-size: 12.5px;

          line-height: 1.45;

          font-weight: 600;
        }

        /* ==================================================
           ERROR
        ================================================== */

        .se-error {
          margin: 0 0 19px;

          padding: 12px 14px;

          border-radius: 9px;

          border: 1px solid #fecaca;

          background: #fef2f2;

          color: #b91c1c;

          font-size: 13px;

          line-height: 1.45;

          font-weight: 600;
        }

        /* ==================================================
           FORM GROUP
        ================================================== */

        .se-form-group {
          margin-bottom: 20px;
        }

        .se-form-label-row {
          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 12px;

          margin-bottom: 9px;
        }

        .se-form-label {
          color: #1e293b;

          font-size: 14px;

          font-weight: 750;
        }

        .se-forgot {
          border: 0;

          background: transparent;

          color: #155eef;

          font-size: 13px;

          font-weight: 700;

          cursor: pointer;

          padding: 0;
        }

        .se-forgot:hover {
          text-decoration: underline;
        }

        /* ==================================================
           INPUT
        ================================================== */

        .se-input-wrap {
          position: relative;

          display: flex;

          align-items: center;
        }

        .se-input-icon {
          position: absolute;

          left: 16px;

          color: #75839a;

          display: flex;

          pointer-events: none;

          z-index: 2;
        }

        .se-input {
          width: 100%;

          height: 58px;

          border: 1px solid #d8e0ea;

          border-radius: 11px;

          background: #ffffff;

          color: #17233b;

          outline: none;

          padding: 0 16px 0 50px;

          font-size: 15px;

          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .se-input.password-input {
          padding-right: 54px;
        }

        .se-input::placeholder {
          color: #9aa7b9;
        }

        .se-input:hover {
          border-color: #b9c5d5;
        }

        .se-input:focus {
          border-color: #4285f4;

          box-shadow:
            0 0 0 4px
            rgba(66, 133, 244, 0.10);
        }

        .se-input:disabled {
          background: #f8fafc;

          cursor: not-allowed;
        }

        /* ==================================================
           PASSWORD TOGGLE
        ================================================== */

        .se-password-toggle {
          position: absolute;

          right: 13px;

          border: 0;

          background: transparent;

          color: #65758e;

          cursor: pointer;

          padding: 7px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 7px;

          transition:
            color 0.2s ease,
            background 0.2s ease;
        }

        .se-password-toggle:hover {
          color: #155eef;

          background: #eff6ff;
        }

        /* ==================================================
           REMEMBER ME
        ================================================== */

        .se-remember {
          display: flex;

          align-items: center;

          gap: 10px;

          margin: 3px 0 23px;

          color: #526177;

          font-size: 14px;

          cursor: pointer;

          user-select: none;
        }

        .se-remember input {
          appearance: none;

          width: 19px;
          height: 19px;

          margin: 0;

          border: 1px solid #b9c5d4;

          border-radius: 5px;

          background: #ffffff;

          cursor: pointer;

          position: relative;

          flex: 0 0 19px;
        }

        .se-remember input:checked {
          border-color: #155eef;

          background: #155eef;
        }

        .se-remember input:checked::after {
          content: "✓";

          position: absolute;

          color: white;

          font-size: 13px;

          font-weight: 800;

          left: 3px;
          top: -1px;
        }

        /* ==================================================
           SUBMIT BUTTON
        ================================================== */

        .se-submit {
          width: 100%;

          min-height: 56px;

          border: 0;

          border-radius: 11px;

          background:
            linear-gradient(
              135deg,
              #1769ed,
              #0b57d0
            );

          color: #ffffff;

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 11px;

          font-size: 15px;

          font-weight: 800;

          cursor: pointer;

          box-shadow:
            0 10px 22px
            rgba(21, 94, 239, 0.20);

          transition:
            transform 0.18s ease,
            box-shadow 0.18s ease,
            opacity 0.18s ease;
        }

        .se-submit:hover:not(:disabled) {
          transform: translateY(-1px);

          box-shadow:
            0 14px 28px
            rgba(21, 94, 239, 0.27);
        }

        .se-submit:active:not(:disabled) {
          transform: translateY(0);
        }

        .se-submit:disabled {
          opacity: 0.68;

          cursor: not-allowed;
        }

        /* ==================================================
           SPINNER
        ================================================== */

        .se-spinner {
          width: 18px;
          height: 18px;

          border: 2px solid
            rgba(255, 255, 255, 0.35);

          border-top-color: #ffffff;

          border-radius: 50%;

          animation:
            se-spin 0.75s linear infinite;
        }

        @keyframes se-spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* ==================================================
           REGISTER
        ================================================== */

        .se-divider {
          display: flex;

          align-items: center;

          gap: 15px;

          margin: 25px 0;

          color: #7c899d;

          font-size: 12px;

          font-weight: 700;
        }

        .se-divider::before,
        .se-divider::after {
          content: "";

          flex: 1;

          height: 1px;

          background: #e1e6ed;
        }

        .se-register-button {
          width: 100%;

          min-height: 52px;

          border: 1px solid #d9e1eb;

          border-radius: 10px;

          background: #ffffff;

          color: #155eef;

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 10px;

          text-decoration: none;

          font-size: 14px;

          font-weight: 750;

          transition:
            border-color 0.2s ease,
            background 0.2s ease,
            transform 0.2s ease;
        }

        .se-register-button:hover {
          border-color: #8eb5ff;

          background: #f7faff;

          transform: translateY(-1px);
        }

        /* ==================================================
           BOTTOM ROW
        ================================================== */

        .se-bottom-row {
          margin-top: 22px;

          display: flex;

          align-items: center;

          justify-content: space-between;

          color: #617088;

          font-size: 13px;
        }

        .se-back-home {
          display: inline-flex;

          align-items: center;

          gap: 7px;

          color: #155eef;

          text-decoration: none;

          font-weight: 650;
        }

        .se-back-home:hover {
          text-decoration: underline;
        }

        .se-secure-connection {
          display: inline-flex;

          align-items: center;

          gap: 7px;
        }

        .se-secure-connection svg {
          color: #16a34a;
        }

        /* ==================================================
           TABLET
        ================================================== */

        @media (max-width: 1150px) {
          .se-brand-panel {
            padding-left: 42px;
            padding-right: 42px;
          }

          .se-panel-footer {
            left: 42px;
            right: 42px;
          }

          .se-form-panel {
            padding: 40px 30px;
          }

          .se-login-card-main {
            padding-left: 34px;
            padding-right: 34px;
          }
        }

        /* ==================================================
           MOBILE / TABLET
        ================================================== */

        @media (max-width: 900px) {
          .se-login-main {
            grid-template-columns: 1fr;
          }

          .se-brand-panel {
            min-height: auto;

            padding:
              55px 32px 65px;
          }

          .se-panel-title {
            max-width: 680px;
          }

          .se-feature-grid {
            max-width: 700px;
          }

          .se-panel-footer {
            position: static;

            margin-top: 50px;
          }

          .se-form-panel {
            min-height: auto;

            padding:
              45px 25px 55px;
          }
        }

        /* ==================================================
           SMALL MOBILE
        ================================================== */

        @media (max-width: 600px) {
          .se-login-page {
            min-height: auto;
          }

          .se-brand-panel {
            padding:
              38px 22px 45px;
          }

          .se-panel-title {
            margin-top: 23px;

            font-size: 40px;

            letter-spacing: -1.7px;
          }

          .se-panel-description {
            font-size: 15px;
          }

          .se-feature-grid {
            grid-template-columns: 1fr;

            gap: 22px;

            margin-top: 35px;
          }

          .se-panel-footer {
            margin-top: 38px;

            font-size: 11px;
          }

          .se-form-panel {
            padding:
              22px 12px 35px;
          }

          .se-login-card {
            border-radius: 16px;
          }

          .se-login-card-main {
            padding:
              26px 20px 28px;
          }

          .se-role-tab {
            height: 50px;

            font-size: 14px;

            gap: 7px;
          }

          .se-form-heading h1 {
            font-size: 28px;
          }

          .se-form-heading p {
            font-size: 14px;
          }

          .se-input {
            height: 55px;
          }

          .se-bottom-row {
            flex-direction: column;

            align-items: flex-start;

            gap: 13px;

            font-size: 12px;
          }
        }
      `}</style>

      {/* ====================================================
          MAIN LOGIN AREA
          NOTE:
          No Navbar/Header here.
          Existing application Navbar will remain on top.
      ==================================================== */}

      <main className="se-login-main">

        {/* ==================================================
            LEFT BRAND PANEL
        ================================================== */}

        <section className="se-brand-panel">
          <div className="se-panel-content">

            <div className="se-market-badge">
              <ShieldIcon size={17} />

              Trusted Industrial Marketplace
            </div>

            <h2 className="se-panel-title">
              Powering businesses
              <br />
              with industrial
              <br />

              <span className="se-panel-title-highlight">
                solutions.
              </span>
            </h2>

            <p className="se-panel-description">
              Manage your orders, products,
              quotations and business
              requirements from one powerful
              platform.
            </p>

            <div className="se-feature-grid">
              {features.map(
                (feature, index) => (
                  <div
                    className="se-feature"
                    key={index}
                  >
                    <div className="se-feature-icon">
                      {feature.icon}
                    </div>

                    <div>
                      <h3 className="se-feature-title">
                        {feature.title}
                      </h3>

                      <p className="se-feature-text">
                        {feature.text}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="se-panel-footer">
            <span>
              © 2026 Shanti Enterprises
            </span>

            <span className="se-secure-label">
              <span className="se-secure-dot">
                ●
              </span>

              Secure Business Platform
            </span>
          </div>
        </section>

        {/* ==================================================
            RIGHT FORM PANEL
        ================================================== */}

        <section className="se-form-panel">
          <div className="se-form-wrapper">

            <div className="se-login-card">

              <div className="se-login-card-main">

                {/* ==========================================
                    CUSTOMER / ADMIN TABS
                ========================================== */}

                <div className="se-role-tabs">

                  <button
                    type="button"
                    className={`se-role-tab ${
                      loginType === "customer"
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      handleLoginTypeChange(
                        "customer"
                      )
                    }
                  >
                    <UserIcon size={21} />

                    Customer Login
                  </button>

                  <button
                    type="button"
                    className={`se-role-tab ${
                      loginType === "admin"
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      handleLoginTypeChange(
                        "admin"
                      )
                    }
                  >
                    <ShieldIcon size={21} />

                    Admin Login
                  </button>

                </div>

                {/* ==========================================
                    HEADING
                ========================================== */}

                <div className="se-form-heading">
                  <h1>
                    Welcome back!
                  </h1>

                  <p>
                    Sign in to continue to your{" "}
                    {loginType === "admin"
                      ? "Shanti Enterprises admin"
                      : "Shanti Enterprises account"}
                    .
                  </p>
                </div>

                {/* ==========================================
                    ROLE NOTE
                ========================================== */}

                <div className="se-role-note">
                  {loginType === "admin"
                    ? "Administrator access: manage products, orders, customers and business operations."
                    : "Customer access: shop products, manage your cart, orders, payments and account."}
                </div>

                {/* ==========================================
                    ERROR
                ========================================== */}

                {errorMessage && (
                  <div className="se-error">
                    {errorMessage}
                  </div>
                )}

                {/* ==========================================
                    LOGIN FORM
                ========================================== */}

                <form
                  onSubmit={handleSubmit}
                  noValidate
                >

                  {/* ========================================
                      EMAIL
                  ======================================== */}

                  <div className="se-form-group">

                    <div className="se-form-label-row">
                      <label
                        className="se-form-label"
                        htmlFor="login-email"
                      >
                        Email address
                      </label>
                    </div>

                    <div className="se-input-wrap">

                      <span className="se-input-icon">
                        <MailIcon size={19} />
                      </span>

                      <input
                        id="login-email"
                        type="email"
                        className="se-input"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(event) =>
                          setEmail(
                            event.target.value
                          )
                        }
                        autoComplete="email"
                        disabled={isSubmitting}
                        required
                      />

                    </div>
                  </div>

                  {/* ========================================
                      PASSWORD
                  ======================================== */}

                  <div className="se-form-group">

                    <div className="se-form-label-row">

                      <label
                        className="se-form-label"
                        htmlFor="login-password"
                      >
                        Password
                      </label>

                      <button
                        type="button"
                        className="se-forgot"
                        onClick={() => {
                          setLocalError(
                            "Password recovery will be available in the next authentication phase."
                          );
                        }}
                      >
                        Forgot password?
                      </button>

                    </div>

                    <div className="se-input-wrap">

                      <span className="se-input-icon">
                        <LockIcon size={19} />
                      </span>

                      <input
                        id="login-password"
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        className="se-input password-input"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(event) =>
                          setPassword(
                            event.target.value
                          )
                        }
                        autoComplete="current-password"
                        disabled={isSubmitting}
                        required
                      />

                      <button
                        type="button"
                        className="se-password-toggle"
                        onClick={() =>
                          setShowPassword(
                            (previous) =>
                              !previous
                          )
                        }
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOffIcon size={20} />
                        ) : (
                          <EyeIcon size={20} />
                        )}
                      </button>

                    </div>
                  </div>

                  {/* ========================================
                      REMEMBER ME
                  ======================================== */}

                  <label className="se-remember">

                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(event) =>
                        setRememberMe(
                          event.target.checked
                        )
                      }
                      disabled={isSubmitting}
                    />

                    <span>
                      Keep me signed in
                    </span>

                  </label>

                  {/* ========================================
                      SUBMIT BUTTON
                  ======================================== */}

                  <button
                    type="submit"
                    className="se-submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="se-spinner" />

                        Signing in...
                      </>
                    ) : (
                      <>
                        <ArrowRightIcon size={20} />

                        Sign in as{" "}
                        {loginType === "admin"
                          ? "Admin"
                          : "Customer"}
                      </>
                    )}
                  </button>

                </form>

                {/* ==========================================
                    CUSTOMER REGISTER
                ========================================== */}

                {loginType === "customer" && (
                  <>
                    <div className="se-divider">
                      OR
                    </div>

                    <Link
                      to="/register"
                      className="se-register-button"
                    >
                      <UserPlusIcon size={20} />

                      Create an account
                    </Link>
                  </>
                )}

              </div>
            </div>

            {/* ==============================================
                BOTTOM LINKS
            ============================================== */}

            <div className="se-bottom-row">

              <Link
                to="/"
                className="se-back-home"
              >
                <ArrowLeftIcon size={17} />

                Back to home
              </Link>

              <span className="se-secure-connection">
                <ShieldIcon size={16} />

                Secure connection
              </span>

            </div>

          </div>
        </section>

      </main>
    </div>
  );
}

// ============================================================
// EXPORT
// ============================================================

export default LoginPage;