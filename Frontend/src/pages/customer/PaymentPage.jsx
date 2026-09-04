// ============================================================
// SHANTI ENTERPRISES — PaymentPage (Premium)
// ============================================================

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./PaymentPage.css";
import { createPaymentOrder, verifyPayment } from "../../api/paymentApi";
import { useCart } from "../../context/CartContext";

// ── load Razorpay SDK ─────────────────────────────────────────
const loadRazorpay = () =>
  new Promise(resolve => {
    if (document.getElementById("razorpay-script")) { resolve(true); return; }
    const s  = document.createElement("script");
    s.id     = "razorpay-script";
    s.src    = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

// ── step progress ─────────────────────────────────────────────
function StepBar() {
  const steps = [
    { n: 1, label: "Address",  done: true  },
    { n: 2, label: "Summary",  done: true  },
    { n: 3, label: "Payment",  done: false },
  ];
  return (
    <div style={{ background: "#fff", border: "1px solid var(--se-border)", borderRadius: 14, padding: "18px 28px", marginBottom: 28, boxShadow: "var(--shadow-sm)", display: "flex", alignItems: "center", gap: 0 }}>
      {steps.map((s, i) => {
        const active = s.n === 3;
        return (
          <div key={s.n} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? "1 1 0" : "0 0 auto" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 80 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: s.done ? "var(--se-teal)" : active ? "var(--se-navy)" : "#fff", border: `2px solid ${s.done || active ? "transparent" : "var(--se-border)"}`, display: "flex", alignItems: "center", justifyContent: "center", color: s.done || active ? "#fff" : "var(--se-text-4)", fontWeight: 800, fontSize: 14, boxShadow: active ? "0 0 0 4px rgba(13,148,136,.15)" : "none" }}>
                {s.done ? "✓" : s.n}
              </div>
              <p style={{ fontSize: 12, fontWeight: active ? 700 : 500, color: active ? "var(--se-navy)" : s.done ? "var(--se-teal)" : "var(--se-text-4)", marginTop: 6, textAlign: "center" }}>{s.label}</p>
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: 2, background: s.done ? "var(--se-teal)" : "var(--se-border)", margin: "0 8px", marginBottom: 22 }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── payment feature row ───────────────────────────────────────
function Feature({ icon, title, sub }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "var(--se-surface-2)", borderRadius: 10, border: "1px solid var(--se-border-soft)" }}>
      <div style={{ width: 38, height: 38, borderRadius: 10, background: "var(--se-teal-soft)", border: "1px solid var(--se-teal-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: 13, fontWeight: 700, color: "var(--se-text)", marginBottom: 2 }}>{title}</p>
        <p style={{ fontSize: 12, color: "var(--se-text-3)" }}>{sub}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
function PaymentPage() {
  const { orderId } = useParams();
  const navigate    = useNavigate();
  const { clearCart } = useCart();

  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState("");
  const [paymentStarted,setPaymentStarted]= useState(false);
  const [success,       setSuccess]       = useState(false);

  useEffect(() => {
    if (!orderId) setError("Order ID is missing. Please go back and try again.");
  }, [orderId]);

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError("");

      // 1. load SDK
      const loaded = await loadRazorpay();
      if (!loaded) throw new Error("Razorpay checkout could not be loaded. Please refresh and try again.");

      // 2. create payment order
      const response     = await createPaymentOrder(orderId);
      const paymentOrder =
        response?.payment ||
        response?.data?.payment ||
        response?.data ||
        response;

      const razorpayOrderId = paymentOrder?.razorpayOrderId || paymentOrder?.id || paymentOrder?.orderId;
      const amount          = paymentOrder?.amountInPaise ?? paymentOrder?.amount;
      const currency        = paymentOrder?.currency || "INR";
      const keyId           = paymentOrder?.keyId || response?.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID;

      if (!razorpayOrderId) throw new Error("Razorpay order ID was not returned. Please try again.");
      if (!keyId)           throw new Error("Razorpay public key is not configured.");
      if (amount === undefined || amount === null || Number(amount) <= 0) throw new Error("Payment amount is missing. Please try again.");

      setPaymentStarted(true);

      if (!window.Razorpay) throw new Error("Razorpay is not available. Please refresh and try again.");

      const rzp = new window.Razorpay({
        key:         keyId,
        amount:      Number(amount),
        currency,
        name:        "Shanti Enterprises",
        description: "Order Payment",
        order_id:    razorpayOrderId,
        theme: { color: "#0D9488" },

        handler: async (paymentResponse) => {
          try {
            setLoading(true);
            setError("");

            const verification = await verifyPayment({
              orderId,
              razorpay_order_id:  paymentResponse.razorpay_order_id,
              razorpay_payment_id:paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
            });

            if (verification?.success === false)
              throw new Error(verification.message || "Payment verification failed.");

            clearCart();
            setSuccess(true);
            navigate(`/order-success/${orderId}`, { replace: true });
          } catch (err) {
            setError(err?.response?.data?.message || err.message || "Payment verification failed.");
            setPaymentStarted(false);
          } finally {
            setLoading(false);
          }
        },

        modal: {
          ondismiss: () => {
            setLoading(false);
            setPaymentStarted(false);
          },
        },
      });

      rzp.on("payment.failed", (e) => {
        setError(e?.error?.description || "Payment failed. Please try again.");
        setLoading(false);
        setPaymentStarted(false);
      });

      rzp.open();

    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Unable to start payment.");
      setLoading(false);
      setPaymentStarted(false);
    }
  };

  return (
    <div style={{ background: "var(--se-bg)", minHeight: "calc(100vh - 68px)" }}>

      {/* ── BANNER ──────────────────────────────────────── */}
      <div style={{ background: "linear-gradient(135deg, var(--se-navy) 0%, #1E3A5F 100%)", padding: "36px 0 30px", position: "relative", overflow: "hidden" }}>
        {/* decorative */}
        <div style={{ position: "absolute", width: 280, height: 280, top: -80, right: -60, borderRadius: "50%", border: "1px solid rgba(13,148,136,.15)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 180, height: 180, bottom: -60, left: "35%", borderRadius: "50%", background: "rgba(13,148,136,.07)", pointerEvents: "none" }} />

        <div style={{ width: "min(100% - 40px, 960px)", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
            <div style={{ width: 40, height: 40, background: "var(--se-teal)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🔒</div>
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--se-teal-light)", letterSpacing: ".1em", textTransform: "uppercase" }}>Secure Checkout · Step 3 of 3</span>
          </div>
          <h1 style={{ color: "#fff", fontSize: "clamp(1.4rem,2.5vw,1.9rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 6 }}>Complete Payment</h1>
          <p style={{ color: "#94A3B8", fontSize: 14 }}>Your order is ready — complete your payment securely via Razorpay.</p>
        </div>
      </div>

      {/* ── CONTENT ─────────────────────────────────────── */}
      <div style={{ width: "min(100% - 40px, 960px)", margin: "0 auto", padding: "28px 0 72px" }}>

        {/* Step bar */}
        <StepBar />

        {/* Error */}
        {error && (
          <div className="alert-error" role="alert" style={{ marginBottom: 24, display: "flex", alignItems: "flex-start", gap: 10 }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>⚠</span>
            <div>
              <p style={{ fontWeight: 700, marginBottom: 3 }}>Payment issue</p>
              <p style={{ fontSize: 13 }}>{error}</p>
            </div>
          </div>
        )}

        {/* Main grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "start" }}>

          {/* ── LEFT: payment card ──────────────────────── */}
          <div style={{ background: "#fff", border: "1px solid var(--se-border)", borderRadius: 20, padding: "48px 40px", boxShadow: "var(--shadow-md)", textAlign: "center", position: "relative", overflow: "hidden" }}>
            {/* decorative blobs */}
            <div style={{ position: "absolute", width: 220, height: 220, top: -80, right: -70, borderRadius: "50%", background: "radial-gradient(circle, rgba(13,148,136,.07), transparent 70%)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", width: 180, height: 180, bottom: -70, left: -60, borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,.05), transparent 70%)", pointerEvents: "none" }} />

            {/* Icon */}
            <div style={{ position: "relative", zIndex: 1, width: 80, height: 80, borderRadius: 22, background: "linear-gradient(135deg, var(--se-teal-soft), #EFF6FF)", border: "1px solid var(--se-teal-light)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", boxShadow: "0 12px 28px rgba(13,148,136,.15)", fontSize: 36 }}>
              💳
            </div>

            {/* Label */}
            <p style={{ position: "relative", zIndex: 1, fontSize: 11, fontWeight: 700, color: "var(--se-teal-hover)", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 10 }}>RAZORPAY · SECURE PAYMENT</p>

            {/* Heading */}
            <h2 style={{ position: "relative", zIndex: 1, fontSize: "clamp(1.5rem,2.5vw,2rem)", fontWeight: 800, color: "var(--se-navy)", letterSpacing: "-0.04em", lineHeight: 1.2, marginBottom: 14 }}>
              Pay Securely Online
            </h2>

            {/* Desc */}
            <p style={{ position: "relative", zIndex: 1, fontSize: 15, color: "var(--se-text-3)", lineHeight: 1.7, maxWidth: 500, margin: "0 auto 32px" }}>
              You will be redirected to Razorpay's secure payment window to complete your transaction using UPI, Cards, Net Banking or Wallets.
            </p>

            {/* Features */}
            <div style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 32, textAlign: "left" }}>
              <Feature icon="🛡️" title="256-bit Encryption"   sub="Bank-grade security"    />
              <Feature icon="💳" title="Multiple Methods"     sub="UPI, cards, wallets"    />
              <Feature icon="⚡" title="Instant Confirmation" sub="Order confirmed in seconds" />
              <Feature icon="🔒" title="PCI DSS Compliant"   sub="Razorpay certified"     />
            </div>

            {/* Pay button */}
            <div style={{ position: "relative", zIndex: 1 }}>
              <button
                type="button"
                onClick={handlePayment}
                disabled={loading || !orderId}
                style={{
                  width: "100%",
                  maxWidth: 420,
                  height: 56,
                  background: success
                    ? "var(--se-success)"
                    : loading
                    ? "var(--se-text-4)"
                    : "var(--se-teal)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 14,
                  fontSize: 16,
                  fontWeight: 800,
                  cursor: loading || !orderId ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                  margin: "0 auto",
                  boxShadow: loading ? "none" : "0 8px 24px rgba(13,148,136,.4)",
                  transition: "all .22s",
                  transform: "none",
                  letterSpacing: "-0.01em",
                }}
              >
                {loading ? (
                  <>
                    <span style={{ width: 20, height: 20, border: "2px solid rgba(255,255,255,.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .8s linear infinite", display: "inline-block", flexShrink: 0 }} />
                    Processing…
                  </>
                ) : paymentStarted ? (
                  <>⏳ Payment in Progress…</>
                ) : (
                  <>💳 Pay with Razorpay</>
                )}
              </button>

              {/* Security note */}
              <p style={{ fontSize: 12, color: "var(--se-text-4)", marginTop: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <span style={{ color: "#22C55E" }}>🔒</span> Secure payment powered by Razorpay
              </p>
            </div>
          </div>

          {/* ── RIGHT: order info ───────────────────────── */}
          <aside style={{ display: "flex", flexDirection: "column", gap: 16, position: "sticky", top: 88 }}>

            {/* Order info card */}
            <div style={{ background: "#fff", border: "1px solid var(--se-border)", borderRadius: 16, overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
              {/* coloured top border */}
              <div style={{ height: 4, background: "linear-gradient(90deg, var(--se-teal), #2563EB, #7C3AED)" }} />
              <div style={{ padding: "20px 22px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                  <div style={{ width: 36, height: 36, background: "var(--se-teal-soft)", border: "1px solid var(--se-teal-light)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🧾</div>
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "var(--se-text-4)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 2 }}>Order Details</p>
                    <h3 style={{ fontSize: "1rem", fontWeight: 800 }}>Payment Information</h3>
                  </div>
                </div>

                {/* Order ID */}
                <div style={{ marginBottom: 14 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "var(--se-text-4)", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 4 }}>Order ID</p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "var(--se-text)", wordBreak: "break-all", fontFamily: "monospace" }}>{orderId || "—"}</p>
                </div>

                <div style={{ height: 1, background: "var(--se-border)", marginBottom: 14 }} />

                {/* Ready status */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "var(--se-success-bg)", border: "1px solid #A7F3D0", borderRadius: 10, marginBottom: 14 }}>
                  <div style={{ width: 34, height: 34, background: "rgba(5,150,105,.15)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>✅</div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "var(--se-success)", marginBottom: 2 }}>Ready for Payment</p>
                    <p style={{ fontSize: 12, color: "#065F46" }}>Order created &amp; awaiting payment.</p>
                  </div>
                </div>

                {/* Payment method */}
                <div style={{ padding: "12px 14px", background: "var(--se-surface-2)", border: "1px solid var(--se-border)", borderRadius: 10 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: "var(--se-text-4)", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 8 }}>Payment Method</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "var(--se-text)" }}>Razorpay</p>
                    <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: "var(--se-teal-soft)", color: "var(--se-teal-hover)", border: "1px solid var(--se-teal-light)" }}>ONLINE</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Warning note */}
            <div style={{ padding: "14px 16px", background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 12, display: "flex", alignItems: "flex-start", gap: 10 }}>
              <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>⚠️</span>
              <p style={{ fontSize: 12, color: "#92400E", lineHeight: 1.6 }}>
                Do not refresh or close this page while your payment is being processed.
              </p>
            </div>

            {/* Supported methods */}
            <div style={{ padding: "14px 16px", background: "#fff", border: "1px solid var(--se-border)", borderRadius: 12, boxShadow: "var(--shadow-xs)" }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "var(--se-text-4)", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 10 }}>Accepted Methods</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["UPI", "Debit Card", "Credit Card", "Net Banking", "Wallets"].map(m => (
                  <span key={m} style={{ padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: "var(--se-surface-2)", color: "var(--se-text-3)", border: "1px solid var(--se-border)" }}>{m}</span>
                ))}
              </div>
            </div>

            {/* Back link */}
            <Link to="/checkout/summary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "12px 0", fontSize: 13, fontWeight: 600, color: "var(--se-text-3)", border: "1px solid var(--se-border)", borderRadius: 10, background: "#fff", transition: "all .2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--se-border)"; e.currentTarget.style.color = "var(--se-text)"; e.currentTarget.style.background = "var(--se-surface-2)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--se-border)"; e.currentTarget.style.color = "var(--se-text-3)"; e.currentTarget.style.background = "#fff"; }}>
              ← Back to Order Summary
            </Link>
          </aside>

        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 820px) {
          div[style*="grid-template-columns: 1fr 340px"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

export default PaymentPage;
