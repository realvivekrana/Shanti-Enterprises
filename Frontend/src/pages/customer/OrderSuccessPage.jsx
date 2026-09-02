// ============================================================
// SHANTI ENTERPRISES — OrderSuccessPage (Premium)
// ============================================================

import { Link, useParams, useLocation } from "react-router-dom";

function OrderSuccessPage() {
  const { orderId }   = useParams();
  const location      = useLocation();
  const isCOD         = location?.state?.paymentMethod === "cod";

  return (
    <div style={{ background: "var(--se-bg)", minHeight: "calc(100vh - 68px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>

      <div style={{ width: "100%", maxWidth: 640 }}>

        {/* ── SUCCESS CARD ─────────────────────────────── */}
        <div style={{ background: "#fff", border: "1px solid var(--se-border)", borderRadius: 24, overflow: "hidden", boxShadow: "var(--shadow-xl)", textAlign: "center" }}>

          {/* Top gradient bar */}
          <div style={{ height: 6, background: "linear-gradient(90deg, var(--se-teal), #2563EB, #7C3AED)" }} />

          <div style={{ padding: "48px 40px 40px" }}>

            {/* Success icon */}
            <div style={{ width: 88, height: 88, borderRadius: "50%", background: "linear-gradient(135deg, var(--se-teal), #2563EB)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", boxShadow: "0 12px 32px rgba(13,148,136,.35), 0 4px 12px rgba(37,99,235,.2)", fontSize: 40, color: "#fff" }}>
              ✓
            </div>

            {/* Eyebrow */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 999, background: "var(--se-success-bg)", border: "1px solid #A7F3D0", color: "var(--se-success)", fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 16 }}>
              <span>●</span> {isCOD ? "Order Confirmed" : "Payment Successful"}
            </div>

            {/* Heading */}
            <h1 style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 900, color: "var(--se-navy)", letterSpacing: "-0.04em", lineHeight: 1.15, marginBottom: 14 }}>
              Order Placed Successfully!
            </h1>

            {/* Message */}
            <p style={{ fontSize: 16, color: "var(--se-text-3)", lineHeight: 1.75, maxWidth: 480, margin: "0 auto 28px" }}>
              {isCOD
                ? "Your COD order has been confirmed. Please keep the exact amount ready for delivery."
                : "Thank you for shopping with Shanti Enterprises. Your payment has been received and your order is being processed."}
            </p>

            {/* Order ID */}
            {orderId && (
              <div style={{ padding: "14px 20px", background: "var(--se-surface-2)", border: "1px solid var(--se-border)", borderRadius: 12, marginBottom: 28, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div style={{ textAlign: "left" }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: "var(--se-text-4)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 4 }}>Order Reference</p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "var(--se-text)", fontFamily: "monospace", wordBreak: "break-all" }}>{orderId}</p>
                </div>
                <span style={{ padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 700, background: "var(--se-success-bg)", color: "var(--se-success)", border: "1px solid #A7F3D0", flexShrink: 0 }}>
                  {isCOD ? "COD" : "PAID ✓"}
                </span>
              </div>
            )}

            {/* Status box */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", background: "var(--se-teal-soft)", border: "1px solid var(--se-teal-light)", borderRadius: 12, textAlign: "left", marginBottom: 32 }}>
              <div style={{ width: 42, height: 42, background: "var(--se-teal)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: "#fff", flexShrink: 0 }}>
                {isCOD ? "💵" : "✅"}
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: "var(--se-teal-hover)", marginBottom: 3 }}>
                  {isCOD ? "Cash on Delivery" : "Payment Confirmed"}
                </p>
                <p style={{ fontSize: 13, color: "var(--se-text-3)" }}>
                  {isCOD ? "Pay the exact amount when your order arrives." : "Your order is now being processed for dispatch."}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {orderId && (
                <Link to={`/orders/${orderId}`}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, height: 52, background: "var(--se-teal)", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, boxShadow: "0 6px 20px rgba(13,148,136,.4)", transition: "all .22s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "var(--se-teal-hover)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "var(--se-teal)"; e.currentTarget.style.transform = ""; }}>
                  📦 Track My Order →
                </Link>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Link to="/orders"
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, height: 46, background: "#fff", color: "var(--se-text-2)", border: "1px solid var(--se-border)", borderRadius: 10, fontSize: 14, fontWeight: 600, transition: "all .2s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "var(--se-surface-2)"; e.currentTarget.style.borderColor = "#CBD5E1"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "var(--se-border)"; }}>
                  🗂️ My Orders
                </Link>
                <Link to="/products"
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, height: 46, background: "#fff", color: "var(--se-text-2)", border: "1px solid var(--se-border)", borderRadius: 10, fontSize: 14, fontWeight: 600, transition: "all .2s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "var(--se-surface-2)"; e.currentTarget.style.borderColor = "#CBD5E1"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "var(--se-border)"; }}>
                  🛍️ Shop More
                </Link>
              </div>
            </div>

            {/* Security note */}
            <p style={{ fontSize: 12, color: "var(--se-text-4)", marginTop: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <span style={{ color: "#22C55E" }}>🔒</span> Your payment was processed securely by Razorpay.
            </p>
          </div>

        </div>

        {/* ── WHAT'S NEXT ──────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginTop: 20 }}>
          {[
            { icon: "⚙️",  step: "01", title: "Processing",    desc: "We start preparing your order immediately." },
            { icon: "🚚",  step: "02", title: "Dispatch",       desc: "Order is shipped to your delivery address."  },
            { icon: "📦",  step: "03", title: "Delivery",       desc: "You'll receive your order at your doorstep." },
          ].map(c => (
            <div key={c.step} style={{ background: "#fff", border: "1px solid var(--se-border)", borderRadius: 14, padding: "18px 16px", boxShadow: "var(--shadow-xs)", textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{c.icon}</div>
              <p style={{ fontSize: 10, fontWeight: 700, color: "var(--se-teal)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 6 }}>STEP {c.step}</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: "var(--se-text)", marginBottom: 4 }}>{c.title}</p>
              <p style={{ fontSize: 12, color: "var(--se-text-3)", lineHeight: 1.55 }}>{c.desc}</p>
            </div>
          ))}
        </div>

      </div>

      <style>{`@media(max-width:580px){div[style*="grid-template-columns: repeat(3,1fr)"]{grid-template-columns:1fr!important} div[style*="grid-template-columns: 1fr 1fr"]{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}

export default OrderSuccessPage;
