// ============================================================
// SHANTI ENTERPRISES — RegisterPage (Premium)
// ============================================================

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// ── icons ────────────────────────────────────────────────────
const IconUser  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="3.5"/><path d="M5 20c.8-3.5 3.2-5.5 7-5.5s6.2 2 7 5.5"/></svg>;
const IconMail  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>;
const IconPhone = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 12a19.79 19.79 0 0 1-3-8.57A2 2 0 0 1 3 3.05h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 10.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 18z"/></svg>;
const IconLock  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>;
const IconEye   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z"/><circle cx="12" cy="12" r="2.5"/></svg>;
const IconEyeOff = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.2 5.4A9.8 9.8 0 0 1 12 5c6 0 9.5 7 9.5 7a17 17 0 0 1-3.1 3.7"/><path d="M6.2 6.2C3.8 8.1 2.5 12 2.5 12S6 19 12 19c1.5 0 2.8-.3 4-.9"/></svg>;

// ── input field ───────────────────────────────────────────────
function Field({ id, label, type="text", value, onChange, placeholder, autoComplete, disabled, icon, hint, extra }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label htmlFor={id} style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--se-text-2)", marginBottom: 6 }}>
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
      {hint && <p style={{ fontSize: 12, color: "var(--se-text-4)", marginTop: 5 }}>{hint}</p>}
    </div>
  );
}

// ── password strength ────────────────────────────────────────
function StrengthBar({ password }) {
  const score = !password ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : /[A-Z]/.test(password) && /[0-9]/.test(password) ? 4 : 3;
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "#EF4444", "#F59E0B", "#3B82F6", "#10B981"];
  return password ? (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
        {[1,2,3,4].map(i => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 3, background: i <= score ? colors[score] : "var(--se-border)", transition: "background .3s" }} />
        ))}
      </div>
      <p style={{ fontSize: 11, color: colors[score], fontWeight: 600 }}>{labels[score]}</p>
    </div>
  ) : null;
}

// ─────────────────────────────────────────────────────────────
function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm]     = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showCnf, setShowCnf] = useState(false);

  const change = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  };

  const validate = () => {
    if (!form.name.trim())           return "Full name is required.";
    if (form.name.trim().length < 2) return "Name must be at least 2 characters.";
    if (!form.email.trim())          return "Email address is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Please enter a valid email address.";
    if (form.phone && !/^[0-9+\-\s()]{7,20}$/.test(form.phone)) return "Please enter a valid phone number.";
    if (!form.password)              return "Password is required.";
    if (form.password.length < 6)   return "Password must be at least 6 characters.";
    if (!form.confirmPassword)       return "Please confirm your password.";
    if (form.password !== form.confirmPassword) return "Passwords do not match.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return setError(err);
    try {
      setLoading(true);
      setError("");
      await register({ name: form.name.trim(), email: form.email.trim().toLowerCase(), phone: form.phone.trim(), password: form.password });
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to create your account.");
    } finally {
      setLoading(false);
    }
  };

  const eyeBtn = (show, toggle) => (
    <button type="button" onClick={toggle}
      style={{ position: "absolute", right: 12, background: "none", border: "none", color: "var(--se-text-4)", cursor: "pointer", display: "flex", alignItems: "center", padding: 6, borderRadius: 6, boxShadow: "none", transform: "none" }}
      aria-label={show ? "Hide" : "Show"}
    >
      {show ? <IconEyeOff /> : <IconEye />}
    </button>
  );

  return (
    <div style={{ minHeight: "calc(100vh - 68px)", display: "grid", gridTemplateColumns: "1fr 1fr" }}>

      {/* ── LEFT ──────────────────────────────────────────── */}
      <div style={{ background: "linear-gradient(145deg,#0F172A 0%,#1E293B 100%)", padding: "64px 56px", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", width: 320, height: 320, top: -80, right: -60, borderRadius: "50%", border: "1px solid rgba(13,148,136,.15)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 200, height: 200, bottom: -50, left: -50, borderRadius: "50%", background: "rgba(13,148,136,.08)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 400 }}>
          <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 48 }}>
            <span style={{ width: 40, height: 40, background: "var(--se-teal)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#fff", flexShrink: 0 }}>SE</span>
            <span style={{ color: "#fff", fontSize: "1rem", fontWeight: 800, letterSpacing: "-0.02em" }}>Shanti Enterprises</span>
          </Link>

          <h1 style={{ color: "#fff", fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.15, marginBottom: 16 }}>
            Start your<br />
            <span style={{ color: "var(--se-teal)" }}>business journey.</span>
          </h1>
          <p style={{ color: "#94A3B8", fontSize: 15, lineHeight: 1.75, marginBottom: 40 }}>
            Create your Shanti Enterprises account and get access to wholesale pricing, order tracking, and more.
          </p>

          {/* perks */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { icon: "✅", text: "Access wholesale pricing tiers" },
              { icon: "📦", text: "Track all your orders in real time" },
              { icon: "🧾", text: "Request quotes for bulk orders" },
              { icon: "💳", text: "Secure Razorpay checkout" },
            ].map(p => (
              <div key={p.text} style={{ display: "flex", alignItems: "center", gap: 12, color: "#CBD5E1", fontSize: 14 }}>
                <span>{p.icon}</span> {p.text}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 40, display: "flex", alignItems: "center", gap: 8, color: "#64748B", fontSize: 13 }}>
            <span style={{ color: "#22C55E" }}>●</span> Encrypted &amp; Secure · Free to join
          </div>
        </div>
      </div>

      {/* ── RIGHT ─────────────────────────────────────────── */}
      <div style={{ background: "var(--se-bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 40px", overflowY: "auto" }}>
        <div style={{ width: "100%", maxWidth: 460 }}>
          <div style={{ background: "#fff", border: "1px solid var(--se-border)", borderRadius: 20, boxShadow: "0 20px 60px rgba(15,23,42,.1)", overflow: "hidden" }}>

            {/* header */}
            <div style={{ padding: "28px 32px 0" }}>
              <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--se-navy)", marginBottom: 6, letterSpacing: "-0.03em" }}>Create your account</h2>
              <p style={{ fontSize: 14, color: "var(--se-text-3)", marginBottom: 24 }}>Join thousands of businesses on Shanti Enterprises.</p>
            </div>

            <div style={{ padding: "0 32px 28px" }}>
              {error && (
                <div className="alert-error" role="alert" style={{ marginBottom: 20 }}>
                  ⚠ {error}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>

                <div style={{ marginBottom: 18 }}>
                  <label htmlFor="name" style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--se-text-2)", marginBottom: 6 }}>Full Name</label>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <span style={{ position: "absolute", left: 14, color: "var(--se-text-4)", display: "flex", pointerEvents: "none", zIndex: 1 }}><IconUser /></span>
                    <input id="name" name="name" type="text" value={form.name} onChange={change} placeholder="Your full name" autoComplete="name" disabled={loading} style={{ paddingLeft: 44, height: 48, fontSize: 15 }} />
                  </div>
                </div>

                <div style={{ marginBottom: 18 }}>
                  <label htmlFor="email" style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--se-text-2)", marginBottom: 6 }}>Email Address</label>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <span style={{ position: "absolute", left: 14, color: "var(--se-text-4)", display: "flex", pointerEvents: "none", zIndex: 1 }}><IconMail /></span>
                    <input id="email" name="email" type="email" value={form.email} onChange={change} placeholder="you@example.com" autoComplete="email" disabled={loading} style={{ paddingLeft: 44, height: 48, fontSize: 15 }} />
                  </div>
                </div>

                <div style={{ marginBottom: 18 }}>
                  <label htmlFor="phone" style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--se-text-2)", marginBottom: 6 }}>
                    Phone <span style={{ fontWeight: 400, color: "var(--se-text-4)" }}>(optional)</span>
                  </label>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <span style={{ position: "absolute", left: 14, color: "var(--se-text-4)", display: "flex", pointerEvents: "none", zIndex: 1 }}><IconPhone /></span>
                    <input id="phone" name="phone" type="tel" value={form.phone} onChange={change} placeholder="+91 98765 43210" autoComplete="tel" disabled={loading} style={{ paddingLeft: 44, height: 48, fontSize: 15 }} />
                  </div>
                </div>

                <div style={{ marginBottom: 18 }}>
                  <label htmlFor="password" style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--se-text-2)", marginBottom: 6 }}>Password</label>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <span style={{ position: "absolute", left: 14, color: "var(--se-text-4)", display: "flex", pointerEvents: "none", zIndex: 1 }}><IconLock /></span>
                    <input id="password" name="password" type={showPwd ? "text" : "password"} value={form.password} onChange={change} placeholder="Min 6 characters" autoComplete="new-password" disabled={loading} style={{ paddingLeft: 44, paddingRight: 44, height: 48, fontSize: 15 }} />
                    {eyeBtn(showPwd, () => setShowPwd(p => !p))}
                  </div>
                  <StrengthBar password={form.password} />
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label htmlFor="confirmPassword" style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--se-text-2)", marginBottom: 6 }}>Confirm Password</label>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <span style={{ position: "absolute", left: 14, color: "var(--se-text-4)", display: "flex", pointerEvents: "none", zIndex: 1 }}><IconLock /></span>
                    <input id="confirmPassword" name="confirmPassword" type={showCnf ? "text" : "password"} value={form.confirmPassword} onChange={change} placeholder="Repeat your password" autoComplete="new-password" disabled={loading} style={{ paddingLeft: 44, paddingRight: 44, height: 48, fontSize: 15 }} />
                    {eyeBtn(showCnf, () => setShowCnf(p => !p))}
                  </div>
                  {form.confirmPassword && form.password !== form.confirmPassword && (
                    <p style={{ fontSize: 12, color: "var(--se-danger)", marginTop: 5, fontWeight: 600 }}>Passwords do not match</p>
                  )}
                  {form.confirmPassword && form.password === form.confirmPassword && form.confirmPassword.length >= 6 && (
                    <p style={{ fontSize: 12, color: "var(--se-success)", marginTop: 5, fontWeight: 600 }}>✓ Passwords match</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{ width: "100%", height: 52, background: loading ? "var(--se-text-4)" : "var(--se-teal)", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, boxShadow: loading ? "none" : "0 6px 20px rgba(13,148,136,.35)", transition: "all .22s", transform: "none" }}
                >
                  {loading ? (
                    <><span style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .8s linear infinite", display: "inline-block" }} /> Creating account…</>
                  ) : "Create Account →"}
                </button>

              </form>

              <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0 0", color: "var(--se-text-4)", fontSize: 12, fontWeight: 700 }}>
                <div style={{ flex: 1, height: 1, background: "var(--se-border)" }} />
                ALREADY HAVE AN ACCOUNT?
                <div style={{ flex: 1, height: 1, background: "var(--se-border)" }} />
              </div>
              <Link
                to="/login"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 44, borderRadius: 10, border: "1px solid var(--se-border)", color: "var(--se-teal-hover)", fontSize: 14, fontWeight: 700, marginTop: 12, transition: "all .2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--se-teal-light)"; e.currentTarget.style.background = "var(--se-teal-soft)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--se-border)"; e.currentTarget.style.background = ""; }}
              >
                Sign in instead
              </Link>
            </div>

            {/* card footer */}
            <div style={{ padding: "12px 32px", background: "var(--se-surface-2)", borderTop: "1px solid var(--se-border)", display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--se-text-4)" }}>
              <Link to="/" style={{ color: "var(--se-text-3)", fontWeight: 600, fontSize: 12 }}>← Back to Home</Link>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ color: "#22C55E" }}>🔒</span> Your data is safe</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @media(max-width:800px){div[style*="grid-template-columns: 1fr 1fr"]{grid-template-columns:1fr!important} div[style*="background: linear-gradient(145deg"]{display:none!important}}`}</style>
    </div>
  );
}

export default RegisterPage;
