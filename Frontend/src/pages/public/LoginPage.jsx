// ============================================================
// SHANTI ENTERPRISES — LoginPage
// Premium Responsive UI
// ============================================================

import { useEffect, useState } from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

// ============================================================
// CSS
// ============================================================

import "./LoginPage.css";


// ============================================================
// ICONS
// ============================================================

const IconMail = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
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


const IconLock = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
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


const IconEye = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z" />

    <circle
      cx="12"
      cy="12"
      r="2.5"
    />
  </svg>
);


const IconEyeOff = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
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


const IconPackage = () => (
  <svg
    width="21"
    height="21"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m16.5 9.4-9-5.19" />

    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />

    <path d="m3.3 7 8.7 5 8.7-5" />

    <path d="M12 22V12" />
  </svg>
);


const IconPrice = () => (
  <svg
    width="21"
    height="21"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 2v20" />

    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H7" />
  </svg>
);


const IconShield = () => (
  <svg
    width="21"
    height="21"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />

    <path d="m9 12 2 2 4-4" />
  </svg>
);


const IconArrow = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14" />

    <path d="m13 6 6 6-6 6" />
  </svg>
);


const IconCheck = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m5 12 4 4L19 6" />
  </svg>
);


// ============================================================
// FIELD COMPONENT
// ============================================================

function Field({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  disabled,
  icon,
  extra,
}) {
  return (
    <div className="login-field">

      <label
        htmlFor={id}
        className="login-field-label"
      >
        {label}
      </label>

      <div className="login-input-wrap">

        {icon && (
          <span className="login-input-icon">
            {icon}
          </span>
        )}

        <input
          id={id}
          className="login-input"
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
        />

        {extra}

      </div>

    </div>
  );
}


// ============================================================
// SIDE FEATURE
// ============================================================

function SideFeature({
  icon,
  title,
  desc,
}) {
  return (
    <div className="login-feature">

      <div className="login-feature-icon">
        {icon}
      </div>

      <div className="login-feature-content">

        <h3>
          {title}
        </h3>

        <p>
          {desc}
        </p>

      </div>

    </div>
  );
}


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
  // STATE
  // ==========================================================

  const [
    loginType,
    setLoginType,
  ] = useState("customer");


  const [
    email,
    setEmail,
  ] = useState("");


  const [
    password,
    setPassword,
  ] = useState("");


  const [
    showPwd,
    setShowPwd,
  ] = useState(false);


  const [
    rememberMe,
    setRememberMe,
  ] = useState(false);


  const [
    submitting,
    setSubmitting,
  ] = useState(false);


  const [
    localError,
    setLocalError,
  ] = useState("");


  // ==========================================================
  // DETECT ADMIN URL
  // ==========================================================

  useEffect(() => {

    setLoginType(
      location.pathname === "/admin/login"
        ? "admin"
        : "customer"
    );

  }, [location.pathname]);


  // ==========================================================
  // REDIRECT ALREADY LOGGED IN USER
  // ==========================================================

  useEffect(() => {

    if (!user) {
      return;
    }

    navigate(
      user.role === "admin"
        ? "/admin"
        : "/orders",
      {
        replace: true,
      }
    );

  }, [
    user,
    navigate,
  ]);


  // ==========================================================
  // LOAD REMEMBERED EMAIL
  // ==========================================================

  useEffect(() => {

    const saved =
      localStorage.getItem(
        "shantiRememberEmail"
      );

    if (saved) {

      setEmail(saved);

      setRememberMe(true);

    }

  }, []);


  // ==========================================================
  // SWITCH LOGIN TYPE
  // ==========================================================

  const switchType = (type) => {

    setLoginType(type);

    setLocalError("");

    if (clearError) {
      clearError();
    }

    navigate(
      type === "admin"
        ? "/admin/login"
        : "/login",
      {
        replace: true,
      }
    );

  };


  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit = async (event) => {

    event.preventDefault();

    setLocalError("");

    if (clearError) {
      clearError();
    }

    const cleanEmail =
      email
        .trim()
        .toLowerCase();


    // --------------------------------------------------------
    // VALIDATION
    // --------------------------------------------------------

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


    // --------------------------------------------------------
    // LOGIN
    // --------------------------------------------------------

    setSubmitting(true);

    try {

      const response =
        await login(
          cleanEmail,
          password
        );


      const loggedInUser =
        response?.user;


      if (!loggedInUser) {

        throw new Error(
          "Login succeeded but user info was not returned."
        );

      }


      // ------------------------------------------------------
      // ADMIN VALIDATION
      // ------------------------------------------------------

      if (
        loginType === "admin" &&
        loggedInUser.role !== "admin"
      ) {

        setLocalError(
          "This account is not an admin account."
        );

        return;

      }


      // ------------------------------------------------------
      // CUSTOMER VALIDATION
      // ------------------------------------------------------

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
      // REMEMBER EMAIL
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

      navigate(
        loggedInUser.role === "admin"
          ? "/admin"
          : "/orders",
        {
          replace: true,
        }
      );

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
  // DERIVED STATE
  // ==========================================================

  const errorMsg =
    localError ||
    authError ||
    "";


  const busy =
    submitting ||
    authLoading;


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <main className="login-page">

      {/* ======================================================
          BRAND / BUSINESS PANEL
          ====================================================== */}

      <section className="login-brand-panel">

        {/* Decorative elements */}

        <div
          className="login-decoration login-decoration-one"
          aria-hidden="true"
        />

        <div
          className="login-decoration login-decoration-two"
          aria-hidden="true"
        />

        <div
          className="login-decoration login-decoration-three"
          aria-hidden="true"
        />


        <div className="login-brand-inner">

          {/* Brand */}

          <Link
            to="/"
            className="login-brand"
            aria-label="Shanti Enterprises home"
          >

            <span className="login-brand-logo">
              SE
            </span>

            <span className="login-brand-name">
              Shanti Enterprises
            </span>

          </Link>


          {/* Hero */}

          <div className="login-brand-copy">

            <span className="login-brand-eyebrow">
              BUSINESS ACCOUNT
            </span>

            <h1>
              Your trusted{" "}
              <span>
                business partner.
              </span>
            </h1>

            <p>
              Sign in to access your orders,
              track shipments, request quotes
              and manage your wholesale account.
            </p>

          </div>


          {/* Features */}

          <div className="login-features">

            <SideFeature
              icon={<IconPackage />}
              title="Order Management"
              desc="View, track and manage all your orders in one place."
            />

            <SideFeature
              icon={<IconPrice />}
              title="Wholesale Pricing"
              desc="Volume-based pricing tiers that scale with your business."
            />

            <SideFeature
              icon={<IconShield />}
              title="Secure Checkout"
              desc="Razorpay-powered payments with UPI, cards & net banking."
            />

          </div>


          {/* Trust */}

          <div className="login-trust">

            <div className="login-trust-item">

              <span className="login-trust-check">
                <IconCheck />
              </span>

              <span>
                Encrypted & Secure
              </span>

            </div>

            <span
              className="login-trust-dot"
              aria-hidden="true"
            />

            <span>
              Trusted since 2010
            </span>

          </div>

        </div>

      </section>


      {/* ======================================================
          FORM PANEL
          ====================================================== */}

      <section className="login-form-panel">

        <div className="login-form-container">

          {/* Mobile brand */}

          <Link
            to="/"
            className="login-mobile-brand"
          >

            <span className="login-mobile-logo">
              SE
            </span>

            <span>
              Shanti Enterprises
            </span>

          </Link>


          {/* Login Card */}

          <div className="login-card">

            {/* ==================================================
                LOGIN TYPE TABS
                ================================================== */}

            <div className="login-tabs">

              <button
                type="button"
                className={`login-tab ${
                  loginType === "customer"
                    ? "is-active"
                    : ""
                }`}
                onClick={() =>
                  switchType("customer")
                }
              >

                <span className="login-tab-icon">
                  👤
                </span>

                <span>
                  Customer
                </span>

              </button>


              <button
                type="button"
                className={`login-tab ${
                  loginType === "admin"
                    ? "is-active"
                    : ""
                }`}
                onClick={() =>
                  switchType("admin")
                }
              >

                <span className="login-tab-icon">
                  ⚙️
                </span>

                <span>
                  Admin
                </span>

              </button>

            </div>


            {/* ==================================================
                FORM CONTENT
                ================================================== */}

            <div className="login-card-body">

              <div className="login-heading">

                <span className="login-heading-badge">

                  {loginType === "admin"
                    ? "ADMIN PORTAL"
                    : "CUSTOMER PORTAL"}

                </span>

                <h2>

                  {loginType === "admin"
                    ? "Admin Sign In"
                    : "Welcome back"}

                </h2>

                <p>

                  {loginType === "admin"
                    ? "Sign in to manage your store."
                    : "Sign in to access your account and orders."}

                </p>

              </div>


              {/* =================================================
                  ADMIN NOTE
                  ================================================= */}

              {loginType === "admin" && (

                <div
                  className="login-admin-note"
                  role="note"
                >

                  <span>
                    ⚙️
                  </span>

                  <p>
                    Use your administrator
                    credentials to sign in.
                  </p>

                </div>

              )}


              {/* =================================================
                  ERROR
                  ================================================= */}

              {errorMsg && (

                <div
                  className="login-error"
                  role="alert"
                >

                  <span
                    className="login-error-icon"
                    aria-hidden="true"
                  >
                    !
                  </span>

                  <span>
                    {errorMsg}
                  </span>

                </div>

              )}


              {/* =================================================
                  FORM
                  ================================================= */}

              <form
                onSubmit={handleSubmit}
                noValidate
                className="login-form"
              >

                <Field
                  id="email"
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  placeholder="you@example.com"
                  autoComplete="email"
                  disabled={busy}
                  icon={<IconMail />}
                />


                <Field
                  id="password"
                  label="Password"
                  type={
                    showPwd
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={busy}
                  icon={<IconLock />}
                  extra={

                    <button
                      type="button"
                      className="login-password-toggle"
                      onClick={() =>
                        setShowPwd(
                          (current) =>
                            !current
                        )
                      }
                      aria-label={
                        showPwd
                          ? "Hide password"
                          : "Show password"
                      }
                      aria-pressed={showPwd}
                      disabled={busy}
                    >

                      {showPwd ? (
                        <IconEyeOff />
                      ) : (
                        <IconEye />
                      )}

                    </button>

                  }
                />


                {/* Remember */}

                <label className="login-remember">

                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) =>
                      setRememberMe(
                        event.target.checked
                      )
                    }
                    disabled={busy}
                  />

                  <span className="login-checkbox">
                    <IconCheck />
                  </span>

                  <span>
                    Remember my email
                  </span>

                </label>


                {/* Submit */}

                <button
                  type="submit"
                  className={`login-submit ${
                    busy
                      ? "is-loading"
                      : ""
                  }`}
                  disabled={busy}
                >

                  {busy ? (

                    <>

                      <span className="login-spinner" />

                      <span>
                        Signing in...
                      </span>

                    </>

                  ) : (

                    <>

                      <span>

                        {loginType === "admin"
                          ? "Sign In as Admin"
                          : "Sign In"}

                      </span>

                      <IconArrow />

                    </>

                  )}

                </button>

              </form>


              {/* =================================================
                  REGISTER
                  ================================================= */}

              {loginType === "customer" && (

                <>

                  <div className="login-divider">

                    <span />

                    <strong>
                      OR
                    </strong>

                    <span />

                  </div>


                  <Link
                    to="/register"
                    className="login-register"
                  >

                    <span>
                      Create new account
                    </span>

                    <IconArrow />

                  </Link>

                </>

              )}

            </div>


            {/* ==================================================
                CARD FOOTER
                ================================================== */}

            <div className="login-card-footer">

              <Link
                to="/"
                className="login-back-home"
              >

                <span>
                  ←
                </span>

                <span>
                  Back to Home
                </span>

              </Link>


              <span className="login-secure">

                <span className="login-secure-icon">
                  🔒
                </span>

                <span>
                  Secure Connection
                </span>

              </span>

            </div>

          </div>


          {/* Bottom message */}

          <p className="login-bottom-text">

            © {new Date().getFullYear()}{" "}
            Shanti Enterprises.
            All rights reserved.

          </p>

        </div>

      </section>

    </main>
  );
}


export default LoginPage;