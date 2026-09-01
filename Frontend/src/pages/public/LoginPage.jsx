// ============================================================
// SHANTI ENTERPRISES — LoginPage (Premium)
// ============================================================

import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// ─── tiny SVG icons ──────────────────────────────────────────
const IconMail = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
);
const IconLock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>
);
const IconEye = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z"/><circle cx="12" cy="12" r="2.5"/></svg>
);
const IconEyeOff = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.2 5.4A9.8 9.8 0 0 1 12 5c6 0 9.5 7 9.5 7a17 17 0 0 1-3.1 3.7"/><path d="M6.2 6.2C3.8 8.1 2.5 12 2.5 12S6 19 12 19c1.5 0 2.8-.3 4-.9"/></svg>
);

// ─── input field ─────────────────────────────────────────────
function Field({ id, label, type = "text", value, onChange, placeholder, autoComplete, disabled, icon, extra }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label htmlFor={id} style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--se-text-2)", marginBottom: 7 }}>
        {label}
      </label>
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        {icon && (
          <span style={{ position: "absolute", left: 14, color: "var(--se-text-4)", display: "flex", pointerEvents: "none", zIndex: 1 }}>
            {icon}
          </span>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          style={{ paddingLeft: icon ? 44 : 14, paddingRight: extra ? 44 : 14, height: 48, fontSize: 15 }}
        />
        {extra}
      </div>
    </div>
  );
}

// ─── sidebar feature ─────────────────────────────────────────
function SideFeature({ emoji, title, desc }) {
  return (
    <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(13,148,136,.15)", border: "1px solid rgba(13,148,136,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
        {emoji}
      </div>
      <div>
        <p style={{ color: "#fff", fontSize: 14, fontWeight: 700, marginBottom: 3 }}>{title}</p>
        <p style={{ color: "#94A3B8", fontSize: 13 }}>{desc}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
function LoginPage() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user, loading: authLoading, login, error: authError, clearError } = useAuth();

  const [loginType,    setLoginType]    = useState("customer");
  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [showPwd,      setShowPwd]      = useState(false);
  const [rememberMe,   setRememberMe]   = useState(false);
  const [submitting,   setSubmitting]   = useState(false);
  const [localError,   setLocalError]   = useState("");

  // detect admin URL
  useEffect(() => {
    setLoginType(location.pathname === "/admin/login" ? "admin" : "customer");
  }, [location.pathname]);

  // redirect if already logged in
  useEffect(() => {
    if (!user) return;
    navigate(user.role === "admin" ? "/admin" : "/orders", { replace: true });
  }, [user, navigate]);

  // load remembered email
  useEffect(() => {
    const saved = localStorage.getItem("shantiRememberEmail");
    if (saved) { setEmail(saved); setRememberMe(true); }
  }, []);

  const switchType = (type) => {
    setLoginType(type);
    setLocalError("");
    if (clearError) clearError();
    navigate(type === "admin" ? "/admin/login" : "/login", { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    if (clearError) clearError();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) return setLocalError("Please enter your email address.");
    if (!password)   return setLocalError("Please enter your password.");
    setSubmitting(true);
    try {
      const res  = await login(cleanEmail, password);
      const u    = res?.user;
      if (!u) throw new Error("Login succeeded but user info was not returned.");
      if (loginType === "admin"    && u.role !== "admin") return setLocalError("This account is not an admin account.");
      if (loginType === "customer" && u.role === "admin") return setLocalError("Please use Admin Login for this account.");
      if (rememberMe) localStorage.setItem("shantiRememberEmail", cleanEmail);
      else localStorage.removeItem("shantiRememberEmail");
      navigate(u.role === "admin" ? "/admin" : "/orders", { replace: true });
    } catch (err) {
      setLocalError(err?.message || "Unable to sign in. Please check your credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  const errorMsg = localError || authError || "";
  const busy = submitting || authLoading;

  return (
    <div style={{ minHeight: "calc(100vh - 68px)", display: "grid", gridTemplateColumns: "1fr 1fr" }}>

      {/* ── LEFT PANEL ────────────────────────────────────── */}
      <div style={{
        background: "linear-gradient(145deg, #0F172A 0%, #1E293B 100%)",
        padding: "64px 56px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* decorative circles */}
        <div style={{ position: "absolute", width: 340, height: 340, top: -100, right: -80, borderRadius: "50%", border: "1px solid rgba(13,148,136,.15)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 220, height: 220, bottom: -60, left: -60, borderRadius: "50%", background: "rgba(13,148,136,.07)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 420 }}>
          {/* logo */}
          <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 48 }}>
            <span style={{ width: 40, height: 40, background: "var(--se-teal)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#fff", flexShrink: 0 }}>SE</span>
            <span style={{ color: "#fff", fontSize: "1rem", fontWeight: 800, letterSpacing: "-0.02em" }}>Shanti Enterprises</span>
          </Link>

          {/* headline */}
          <h1 style={{ color: "#fff", fontSize: "clamp(2rem,3.5vw,2.8rem)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1, marginBottom: 16 }}>
            Your trusted<br />
            <span style={{ color: "var(--se-teal)" }}>business partner.</span>
          </h1>
          <p style={{ color: "#94A3B8", fontSize: 16, lineHeight: 1.7, marginBottom: 48 }}>
            Sign in to access your orders, track shipments, request quotes and manage your wholesale account.
          </p>

          {/* features */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <SideFeature emoji="📦" title="Order Management" desc="View, track and manage all your orders in one place." />
            <SideFeature emoji="💰" title="Wholesale Pricing" desc="Volume-based pricing tiers that scale with your business." />
            <SideFeature emoji="🔒" title="Secure Checkout" desc="Razorpay-powered payments with UPI, cards & net banking." />
          </div>

          {/* bottom trust */}
          <div style={{ marginTop: 48, display: "flex", alignItems: "center", gap: 8, color: "#64748B", fontSize: 13 }}>
            <span style={{ color: "#22C55E" }}>●</span> Encrypted &amp; Secure
            <span style={{ margin: "0 8px", color: "#334155" }}>·</span>
            <span>Trusted since 2010</span>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ───────────────────────────────────── */}
      <div style={{
        background: "var(--se-bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 40px",
      }}>
        <div style={{ width: "100%", maxWidth: 460 }}>

          {/* ── CARD ── */}
          <div style={{ background: "#fff", border: "1px solid var(--se-border)", borderRadius: 20, boxShadow: "0 20px 60px rgba(15,23,42,.1), 0 4px 16px rgba(15,23,42,.04)", overflow: "hidden" }}>

            {/* TABS */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid var(--se-border)" }}>
              {[
                { key: "customer", label: "Customer Login", emoji: "👤" },
                { key: "admin",    label: "Admin Login",    emoji: "⚙️" },
              ].map(t => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => switchType(t.key)}
                  style={{
                    height: 54,
                    background: "transparent",
                    border: "none",
                    borderBottom: loginType === t.key ? "3px solid var(--se-teal)" : "3px solid transparent",
                    color: loginType === t.key ? "var(--se-teal-hover)" : "var(--se-text-3)",
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 7,
                    transition: "all .2s",
                    boxShadow: "none",
                    transform: "none",
                  }}
                >
                  <span>{t.emoji}</span> {t.key === "customer" ? "Customer" : "Admin"}
                </button>
              ))}
            </div>

            {/* FORM BODY */}
            <div style={{ padding: "32px 32px 28px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--se-navy)", marginBottom: 6, letterSpacing: "-0.03em" }}>
                {loginType === "admin" ? "Admin Sign In" : "Welcome back"}
              </h2>
              <p style={{ fontSize: 14, color: "var(--se-text-3)", marginBottom: 24 }}>
                {loginType === "admin"
                  ? "Sign in to manage your store."
                  : "Sign in to access your account and orders."}
              </p>

              {/* admin note */}
              {loginType === "admin" && (
                <div style={{ padding: "10px 14px", background: "var(--se-teal-soft)", border: "1px solid var(--se-teal-light)", borderRadius: 8, color: "var(--se-teal-hover)", fontSize: 13, fontWeight: 600, marginBottom: 20 }}>
                  ⚙️ Use your administrator credentials to sign in.
                </div>
              )}

              {/* error */}
              {errorMsg && (
                <div className="alert-error" role="alert" style={{ marginBottom: 20 }}>
                  ⚠ {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>

                <Field
                  id="email"
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  disabled={busy}
                  icon={<IconMail />}
                />

                <Field
                  id="password"
                  label="Password"
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={busy}
                  icon={<IconLock />}
                  extra={
                    <button
                      type="button"
                      onClick={() => setShowPwd(p => !p)}
                      style={{ position: "absolute", right: 12, background: "none", border: "none", color: "var(--se-text-4)", cursor: "pointer", display: "flex", alignItems: "center", padding: 6, borderRadius: 6, boxShadow: "none", transform: "none" }}
                      aria-label={showPwd ? "Hide password" : "Show password"}
                    >
                      {showPwd ? <IconEyeOff /> : <IconEye />}
                    </button>
                  }
                />

                {/* remember me */}
                <label style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24, cursor: "pointer", fontSize: 13, color: "var(--se-text-3)", fontWeight: 500 }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    style={{ width: 16, height: 16, accentColor: "var(--se-teal)", cursor: "pointer" }}
                  />
                  Remember my email
                </label>

                {/* submit */}
                <button
                  type="submit"
                  disabled={busy}
                  style={{
                    width: "100%",
                    height: 52,
                    background: busy ? "var(--se-text-4)" : "var(--se-teal)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 12,
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: busy ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    boxShadow: busy ? "none" : "0 6px 20px rgba(13,148,136,.35)",
                    transition: "all .22s",
                    transform: "none",
                  }}
                >
                  {busy ? (
                    <>
                      <span style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .8s linear infinite", display: "inline-block" }} />
                      Signing in…
                    </>
                  ) : (
                    <>{loginType === "admin" ? "Sign In as Admin" : "Sign In"} →</>
                  )}
                </button>

              </form>

              {/* divider + register */}
              {loginType === "customer" && (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "22px 0", color: "var(--se-text-4)", fontSize: 12, fontWeight: 700 }}>
                    <div style={{ flex: 1, height: 1, background: "var(--se-border)" }} />
                    OR
                    <div style={{ flex: 1, height: 1, background: "var(--se-border)" }} />
                  </div>
                  <Link
                    to="/register"
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      height: 48, borderRadius: 10, border: "1px solid var(--se-border)",
                      background: "#fff", color: "var(--se-teal-hover)", fontSize: 14, fontWeight: 700,
                      transition: "all .2s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--se-teal-light)"; e.currentTarget.style.background = "var(--se-teal-soft)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--se-border)"; e.currentTarget.style.background = "#fff"; }}
                  >
                    Create new account →
                  </Link>
                </>
              )}
            </div>

            {/* card footer */}
            <div style={{ padding: "14px 32px", background: "var(--se-surface-2)", borderTop: "1px solid var(--se-border)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: "var(--se-text-4)" }}>
              <Link to="/" style={{ color: "var(--se-text-3)", fontWeight: 600, fontSize: 12 }}>← Back to Home</Link>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: "#22C55E" }}>🔒</span> Secure Connection
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* spin keyframe */}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

export default LoginPage;
