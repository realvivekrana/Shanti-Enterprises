// ============================================================
// SHANTI ENTERPRISES
// Register Page
// Premium Mobile-First Responsive UI
// ============================================================

import { useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import "./RegisterPage.css";

// ============================================================
// FIELD COMPONENT
// ============================================================

function Field({
  id,
  name,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  disabled,
  icon,
  extra,
  hint,
}) {
  return (
    <div className="register-field">
      <label htmlFor={id} className="register-field-label">
        {label}
      </label>

      <div className="register-input-wrap">
        <span
          className="register-input-icon"
          aria-hidden="true"
        >
          {icon}
        </span>

        <input
          id={id}
          name={name || id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          className={`register-input ${
            extra
              ? "register-input-with-action"
              : ""
          }`}
        />

        {extra}
      </div>

      {hint && (
        <p className="register-field-hint">
          {hint}
        </p>
      )}
    </div>
  );
}

// ============================================================
// PASSWORD STRENGTH
// ============================================================

function StrengthBar({ password }) {
  const score = !password
    ? 0
    : password.length < 6
      ? 1
      : password.length < 10
        ? 2
        : /[A-Z]/.test(password) &&
            /[0-9]/.test(password)
          ? 4
          : 3;

  const labels = [
    "",
    "Weak",
    "Fair",
    "Good",
    "Strong",
  ];

  return password ? (
    <div className="register-strength">
      <div
        className="register-strength-bars"
        aria-label={`Password strength: ${labels[score]}`}
      >
        {[1, 2, 3, 4].map((item) => (
          <span
            key={item}
            className={`register-strength-bar ${
              item <= score
                ? `register-strength-${score}`
                : ""
            }`}
          />
        ))}
      </div>

      <p
        className={`register-strength-label register-strength-label-${score}`}
      >
        {labels[score]}
      </p>
    </div>
  ) : null;
}

// ============================================================
// REGISTER PAGE
// ============================================================

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showCnf, setShowCnf] = useState(false);

  // ==========================================================
  // FORM CHANGE
  // ==========================================================

  const change = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  };

  // ==========================================================
  // VALIDATION
  // ==========================================================

  const validate = () => {
    if (!form.name.trim()) {
      return "Full name is required.";
    }

    if (form.name.trim().length < 2) {
      return "Name must be at least 2 characters.";
    }

    if (!form.email.trim()) {
      return "Email address is required.";
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email
      )
    ) {
      return "Please enter a valid email address.";
    }

    if (
      form.phone &&
      !/^[0-9+\-\s()]{7,20}$/.test(form.phone)
    ) {
      return "Please enter a valid phone number.";
    }

    if (!form.password) {
      return "Password is required.";
    }

    if (form.password.length < 6) {
      return "Password must be at least 6 characters.";
    }

    if (!form.confirmPassword) {
      return "Please confirm your password.";
    }

    if (
      form.password !== form.confirmPassword
    ) {
      return "Passwords do not match.";
    }

    return "";
  };

  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");

      await register({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        password: form.password,
      });

      navigate("/", {
        replace: true,
      });
    } catch (err) {
      setError(
        err.message ||
          "Unable to create your account."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // PASSWORD TOGGLE
  // ==========================================================

  const passwordToggle = (
    visible,
    toggle,
    label
  ) => (
    <button
      type="button"
      className="register-password-toggle"
      onClick={toggle}
      disabled={loading}
      aria-label={
        visible
          ? `Hide ${label}`
          : `Show ${label}`
      }
      title={
        visible
          ? `Hide ${label}`
          : `Show ${label}`
      }
    >
      {visible ? (
        <EyeOff
          size={18}
          aria-hidden="true"
        />
      ) : (
        <Eye
          size={18}
          aria-hidden="true"
        />
      )}
    </button>
  );

  // ==========================================================
  // RETURN
  // ==========================================================

  return (
    <main className="register-page">
      <div className="register-shell">

        {/* ==================================================
            BRAND / BENEFITS PANEL
            ================================================== */}

        <section className="register-brand-panel">
          <div className="register-decoration register-decoration-one" />
          <div className="register-decoration register-decoration-two" />
          <div className="register-decoration register-decoration-three" />

          <div className="register-brand-content">

            {/* BRAND */}
            <Link
              to="/"
              className="register-brand"
              aria-label="Shanti Enterprises home"
            >
              <span className="register-brand-mark">
                SE
              </span>

              <span className="register-brand-name">
                Shanti Enterprises
              </span>
            </Link>

            {/* EYEBROW */}
            <div className="register-brand-eyebrow">
              <Sparkles
                size={14}
                aria-hidden="true"
              />

              BUSINESS SHOPPING
            </div>

            {/* HEADLINE */}
            <h1 className="register-brand-title">
              Start your
              <span>
                business journey.
              </span>
            </h1>

            <p className="register-brand-description">
              Create your Shanti Enterprises
              account and get access to wholesale
              pricing, order tracking, bulk quotes
              and more.
            </p>

            {/* BENEFITS */}
            <div className="register-benefits">
              {[
                {
                  icon: (
                    <CheckCircle2
                      size={19}
                      aria-hidden="true"
                    />
                  ),
                  title:
                    "Wholesale pricing tiers",
                  text:
                    "Get access to business-friendly pricing.",
                },
                {
                  icon: (
                    <CheckCircle2
                      size={19}
                      aria-hidden="true"
                    />
                  ),
                  title:
                    "Real-time order tracking",
                  text:
                    "Keep track of every business order.",
                },
                {
                  icon: (
                    <CheckCircle2
                      size={19}
                      aria-hidden="true"
                    />
                  ),
                  title:
                    "Bulk order quotations",
                  text:
                    "Request quotes for larger requirements.",
                },
                {
                  icon: (
                    <ShieldCheck
                      size={19}
                      aria-hidden="true"
                    />
                  ),
                  title:
                    "Secure checkout",
                  text:
                    "Shop with a secure payment experience.",
                },
              ].map((benefit) => (
                <div
                  className="register-benefit"
                  key={benefit.title}
                >
                  <span className="register-benefit-icon">
                    {benefit.icon}
                  </span>

                  <div>
                    <strong>
                      {benefit.title}
                    </strong>

                    <span>
                      {benefit.text}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* TRUST */}
            <div className="register-brand-trust">
              <span className="register-trust-dot" />

              <span>
                Encrypted &amp; secure
              </span>

              <span className="register-trust-separator">
                •
              </span>

              <span>Free to join</span>
            </div>
          </div>
        </section>

        {/* ==================================================
            FORM PANEL
            ================================================== */}

        <section className="register-form-panel">
          <div className="register-form-wrap">

            <div className="register-card">

              {/* HEADER */}
              <div className="register-card-header">
                <div className="register-mobile-brand">
                  <Link
                    to="/"
                    className="register-mobile-brand-link"
                  >
                    <span className="register-brand-mark">
                      SE
                    </span>

                    <span>
                      Shanti Enterprises
                    </span>
                  </Link>
                </div>

                <span className="register-form-eyebrow">
                  CREATE ACCOUNT
                </span>

                <h2>
                  Create your account
                </h2>

                <p>
                  Join businesses shopping with
                  Shanti Enterprises.
                </p>
              </div>

              {/* FORM */}
              <div className="register-card-body">

                {error && (
                  <div
                    className="register-alert"
                    role="alert"
                  >
                    <span className="register-alert-icon">
                      !
                    </span>

                    <span>{error}</span>
                  </div>
                )}

                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="register-form"
                >

                  {/* NAME */}
                  <Field
                    id="name"
                    name="name"
                    label="Full Name"
                    type="text"
                    value={form.name}
                    onChange={change}
                    placeholder="Your full name"
                    autoComplete="name"
                    disabled={loading}
                    icon={
                      <User
                        size={18}
                        aria-hidden="true"
                      />
                    }
                  />

                  {/* EMAIL */}
                  <Field
                    id="email"
                    name="email"
                    label="Email Address"
                    type="email"
                    value={form.email}
                    onChange={change}
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={loading}
                    icon={
                      <Mail
                        size={18}
                        aria-hidden="true"
                      />
                    }
                  />

                  {/* PHONE */}
                  <Field
                    id="phone"
                    name="phone"
                    label={
                      <>
                        Phone
                        <span className="register-optional">
                          (optional)
                        </span>
                      </>
                    }
                    type="tel"
                    value={form.phone}
                    onChange={change}
                    placeholder="+91 98765 43210"
                    autoComplete="tel"
                    disabled={loading}
                    icon={
                      <Phone
                        size={18}
                        aria-hidden="true"
                      />
                    }
                  />

                  {/* PASSWORD */}
                  <div className="register-field">
                    <label
                      htmlFor="password"
                      className="register-field-label"
                    >
                      Password
                    </label>

                    <div className="register-input-wrap">
                      <span
                        className="register-input-icon"
                        aria-hidden="true"
                      >
                        <LockKeyhole
                          size={18}
                        />
                      </span>

                      <input
                        id="password"
                        name="password"
                        type={
                          showPwd
                            ? "text"
                            : "password"
                        }
                        value={form.password}
                        onChange={change}
                        placeholder="Min 6 characters"
                        autoComplete="new-password"
                        disabled={loading}
                        className="register-input register-input-with-action"
                      />

                      {passwordToggle(
                        showPwd,
                        () =>
                          setShowPwd(
                            (current) =>
                              !current
                          ),
                        "password"
                      )}
                    </div>

                    <StrengthBar
                      password={form.password}
                    />
                  </div>

                  {/* CONFIRM PASSWORD */}
                  <div className="register-field register-confirm-field">
                    <label
                      htmlFor="confirmPassword"
                      className="register-field-label"
                    >
                      Confirm Password
                    </label>

                    <div className="register-input-wrap">
                      <span
                        className="register-input-icon"
                        aria-hidden="true"
                      >
                        <LockKeyhole
                          size={18}
                        />
                      </span>

                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={
                          showCnf
                            ? "text"
                            : "password"
                        }
                        value={
                          form.confirmPassword
                        }
                        onChange={change}
                        placeholder="Repeat your password"
                        autoComplete="new-password"
                        disabled={loading}
                        className="register-input register-input-with-action"
                      />

                      {passwordToggle(
                        showCnf,
                        () =>
                          setShowCnf(
                            (current) =>
                              !current
                          ),
                        "confirm password"
                      )}
                    </div>

                    {form.confirmPassword &&
                      form.password !==
                        form.confirmPassword && (
                        <p className="register-password-status register-password-status-error">
                          Passwords do not match
                        </p>
                      )}

                    {form.confirmPassword &&
                      form.password ===
                        form.confirmPassword &&
                      form.confirmPassword.length >=
                        6 && (
                        <p className="register-password-status register-password-status-success">
                          <Check
                            size={13}
                            aria-hidden="true"
                          />

                          Passwords match
                        </p>
                      )}
                  </div>

                  {/* SUBMIT */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="register-submit-button"
                  >
                    {loading ? (
                      <>
                        <span className="register-spinner" />

                        Creating account...
                      </>
                    ) : (
                      <>
                        Create Account

                        <ArrowRight
                          size={18}
                          aria-hidden="true"
                        />
                      </>
                    )}
                  </button>
                </form>

                {/* LOGIN */}
                <div className="register-login-divider">
                  <span />
                  <strong>
                    ALREADY HAVE AN ACCOUNT?
                  </strong>
                  <span />
                </div>

                <Link
                  to="/login"
                  className="register-login-link"
                >
                  Sign in instead
                  <ArrowRight
                    size={16}
                    aria-hidden="true"
                  />
                </Link>
              </div>

              {/* FOOTER */}
              <div className="register-card-footer">
                <Link
                  to="/"
                  className="register-back-home"
                >
                  ← Back to Home
                </Link>

                <span className="register-safe-message">
                  <ShieldCheck
                    size={14}
                    aria-hidden="true"
                  />

                  Your data is safe
                </span>
              </div>
            </div>

            {/* MOBILE TRUST */}
            <div className="register-mobile-trust">
              <ShieldCheck
                size={15}
                aria-hidden="true"
              />

              <span>
                Secure registration · Your information
                is protected
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default RegisterPage;