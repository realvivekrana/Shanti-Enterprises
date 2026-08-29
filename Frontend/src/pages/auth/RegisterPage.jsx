// ============================================================
// SHANTI ENTERPRISES
// Register Page
// Frontend Phase 7 - Authentication
// ============================================================

import {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../../context/AuthContext";

// ============================================================
// REGISTER PAGE
// ============================================================

function RegisterPage() {
  const navigate =
    useNavigate();

  const {
    register,
  } = useAuth();

  const [
    form,
    setForm,
  ] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  // ==========================================================
  // HANDLE CHANGE
  // ==========================================================

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setForm(
      (current) => ({
        ...current,
        [name]: value,
      })
    );

    setError("");
  };

  // ==========================================================
  // VALIDATE FORM
  // ==========================================================

  const validateForm = () => {
    const name =
      form.name.trim();

    const email =
      form.email.trim();

    const phone =
      form.phone.trim();

    const password =
      form.password;

    const confirmPassword =
      form.confirmPassword;

    if (!name) {
      return "Please enter your full name.";
    }

    if (name.length < 2) {
      return "Name must contain at least 2 characters.";
    }

    if (!email) {
      return "Please enter your email address.";
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailPattern.test(
        email
      )
    ) {
      return "Please enter a valid email address.";
    }

    if (phone) {
      const phonePattern =
        /^[0-9+\-\s()]{7,20}$/;

      if (
        !phonePattern.test(
          phone
        )
      ) {
        return "Please enter a valid phone number.";
      }
    }

    if (!password) {
      return "Please enter a password.";
    }

    if (password.length < 6) {
      return "Password must contain at least 6 characters.";
    }

    if (!confirmPassword) {
      return "Please confirm your password.";
    }

    if (
      password !==
      confirmPassword
    ) {
      return "Passwords do not match.";
    }

    return "";
  };

  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      const validationError =
        validateForm();

      if (validationError) {
        setError(
          validationError
        );

        return;
      }

      try {
        setLoading(true);
        setError("");

        await register({
          name:
            form.name.trim(),

          email:
            form.email.trim()
              .toLowerCase(),

          phone:
            form.phone.trim(),

          password:
            form.password,
        });

        // ----------------------------------------------------
        // REGISTRATION SUCCESS
        // ----------------------------------------------------

        navigate(
          "/",
          {
            replace: true,
          }
        );
      } catch (err) {
        console.error(
          "Registration error:",
          err
        );

        setError(
          err.message ||
            "Unable to create your account."
        );
      } finally {
        setLoading(false);
      }
    };

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <section className="auth-page">

      <div className="auth-container">

        {/* ==================================================
            LEFT / BRAND AREA
            ================================================== */}

        <div className="auth-brand-panel">

          <div className="auth-brand-content">

            <span className="auth-brand-eyebrow">
              SHANTI ENTERPRISES
            </span>

            <h1>
              Your trusted
              <br />
              business partner.
            </h1>

            <p>
              Create your account and
              start exploring quality
              products from Shanti
              Enterprises.
            </p>

            <div className="auth-brand-features">

              <div className="auth-brand-feature">

                <span>
                  ✓
                </span>

                <div>

                  <strong>
                    Quality Products
                  </strong>

                  <small>
                    Reliable products for
                    your business.
                  </small>

                </div>

              </div>

              <div className="auth-brand-feature">

                <span>
                  ✓
                </span>

                <div>

                  <strong>
                    Easy Ordering
                  </strong>

                  <small>
                    Simple and convenient
                    checkout.
                  </small>

                </div>

              </div>

              <div className="auth-brand-feature">

                <span>
                  ✓
                </span>

                <div>

                  <strong>
                    Secure Shopping
                  </strong>

                  <small>
                    Your account and
                    payments stay protected.
                  </small>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* ==================================================
            REGISTER CARD
            ================================================== */}

        <div className="auth-form-panel">

          <div className="auth-form-card">

            {/* HEADER */}

            <div className="auth-form-header">

              <span className="auth-form-eyebrow">
                CREATE ACCOUNT
              </span>

              <h2>
                Join Shanti Enterprises
              </h2>

              <p>
                Create your customer account
                to start shopping.
              </p>

            </div>

            {/* ERROR */}

            {error && (
              <div
                className="auth-error"
                role="alert"
              >

                <span>
                  !
                </span>

                <p>
                  {error}
                </p>

              </div>
            )}

            {/* FORM */}

            <form
              className="auth-form"
              onSubmit={
                handleSubmit
              }
              noValidate
            >

              {/* NAME */}

              <div className="auth-field">

                <label htmlFor="name">
                  Full Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={
                    form.name
                  }
                  inputMode="text"
                  onChange={
                    handleChange
                  }
                  placeholder="Enter your full name"
                  autoComplete="name"
                  disabled={loading}
                  aria-required="true"
                />

              </div>

              {/* EMAIL */}

              <div className="auth-field">

                <label htmlFor="email">
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={
                    form.email
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter your email"
                  autoComplete="email"
                  disabled={loading}
                  aria-required="true"
                />

              </div>

              {/* PHONE */}

              <div className="auth-field">

                <label htmlFor="phone">
                  Phone Number
                  <span>
                    {" "}
                    (Optional)
                  </span>
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={
                    form.phone
                  }
                  inputMode="tel"
                  onChange={
                    handleChange
                  }
                  placeholder="Enter your phone number"
                  autoComplete="tel"
                  disabled={loading}
                />

              </div>

              {/* PASSWORD */}

              <div className="auth-field">

                <label htmlFor="password">
                  Password
                </label>

                <div className="auth-password-wrapper">

                  <input
                    id="password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      form.password
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Create a password"
                    autoComplete="new-password"
                    disabled={loading}
                    aria-required="true"
                  />

                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() =>
                      setShowPassword(
                        (current) =>
                          !current
                      )
                    }
                    disabled={loading}
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword
                      ? "Hide"
                      : "Show"}
                  </button>

                </div>

                <small>
                  Use at least 6 characters.
                </small>

              </div>

              {/* CONFIRM PASSWORD */}

              <div className="auth-field">

                <label htmlFor="confirmPassword">
                  Confirm Password
                </label>

                <div className="auth-password-wrapper">

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      form.confirmPassword
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    disabled={loading}
                    aria-required="true"
                  />

                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() =>
                      setShowConfirmPassword(
                        (current) =>
                          !current
                      )
                    }
                    disabled={loading}
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showConfirmPassword
                      ? "Hide"
                      : "Show"}
                  </button>

                </div>

              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                className="auth-submit-button"
                disabled={loading}
                aria-busy={loading}
              >

                {loading
                  ? "Creating Account..."
                  : "Create Account"}

                {!loading && (
                  <span>
                    →
                  </span>
                )}

              </button>

            </form>

            {/* LOGIN LINK */}

            <div className="auth-switch">

              <span>
                Already have an account?
              </span>

              <Link to="/login">
                Sign in
              </Link>

            </div>

            {/* SECURITY */}

            <div className="auth-security">

              <span>
                🔒
              </span>

              <p>
                Your account information is
                securely protected.
              </p>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default RegisterPage;
