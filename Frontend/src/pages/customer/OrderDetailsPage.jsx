// ============================================================
// SHANTI ENTERPRISES — OrderDetailsPage (Premium)
// ============================================================

import { useEffect, useMemo, useState } from "react";
import { Link, useParams }              from "react-router-dom";
import { getOrderById }                 from "../../api/orderApi";
import Loading     from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";

// ── helpers ───────────────────────────────────────────────────
const fmt = (n) =>
  `₹${Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const fmtDate = (v, withTime = false) => {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-IN", withTime
    ? { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }
    : { day: "2-digit", month: "short", year: "numeric" }
  );
};

const fmtLabel = (s) =>
  String(s || "").replace(/[-_]/g, " ").replace(/\b\w/g, c => c.toUpperCase());

const extractOrder = (r) =>
  r?.order || r?.data?.order || r?.data || r;

const getImg = (img) => {
  if (!img) return "";
  if (typeof img === "string") return img;
  return img.url || img.secure_url || img.src || "";
};

const statusBadge = (s) => {
  const v = String(s || "").toLowerCase();
  if (v.includes("deliver") || v.includes("complete"))
    return { bg: "#F0FDF4", color: "#15803D", border: "#A7F3D0" };
  if (v.includes("cancel"))
    return { bg: "#FEF2F2", color: "#DC2626", border: "#FECACA" };
  if (v.includes("ship") || v.includes("transit"))
    return { bg: "#EFF6FF", color: "#1D4ED8", border: "#BFDBFE" };
  if (v.includes("confirm") || v.includes("process"))
    return { bg: "#F0FDF4", color: "#166534", border: "#BBF7D0" };
  return { bg: "#FFFBEB", color: "#B45309", border: "#FDE68A" };
};

// ── order progress steps ──────────────────────────────────────
const STEPS = [
  { key: "pending",    label: "Order Placed",  icon: "📋", desc: "Order received and confirmed." },
  { key: "processing", label: "Processing",    icon: "⚙️", desc: "Being prepared for dispatch."   },
  { key: "shipped",    label: "Shipped",       icon: "🚚", desc: "Handed to delivery partner."    },
  { key: "delivered",  label: "Delivered",     icon: "✅", desc: "Successfully delivered."        },
];

const normalizeStep = (s) => {
  const v = String(s || "").toLowerCase().replace(/-/g, "_");
  if (["pending", "placed", "created"].includes(v))                      return "pending";
  if (["confirmed", "processing", "processed", "packed"].includes(v))   return "processing";
  if (["shipped", "out_for_delivery", "dispatched", "in_transit"].includes(v)) return "shipped";
  if (["delivered", "completed"].includes(v))                            return "delivered";
  if (["cancelled", "canceled"].includes(v))                            return "cancelled";
  return "pending";
};

// ── timeline component ────────────────────────────────────────
function OrderTimeline({ status }) {
  const normalized = normalizeStep(status);
  const cancelled  = normalized === "cancelled";
  const stepIdx    = STEPS.findIndex(s => s.key === normalized);
  const current    = stepIdx >= 0 ? stepIdx : 0;

  if (cancelled) {
    return (
      <div style={{ padding: "20px 24px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 12, display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 44, height: 44, background: "#DC2626", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: "#fff", flexShrink: 0 }}>❌</div>
        <div>
          <p style={{ fontWeight: 700, color: "#DC2626", marginBottom: 4 }}>Order Cancelled</p>
          <p style={{ fontSize: 13, color: "#B91C1C" }}>This order has been cancelled and will not proceed further.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 0 }}>
      {STEPS.map((step, i) => {
        const done    = i <= current;
        const active  = i === current;
        const isLast  = i === STEPS.length - 1;
        return (
          <div key={step.key} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
            {/* connector line */}
            {!isLast && (
              <div style={{ position: "absolute", top: 22, left: "50%", width: "100%", height: 3, background: i < current ? "var(--se-teal)" : "var(--se-border)", zIndex: 0, transition: "background .3s" }} />
            )}
            {/* circle */}
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: done ? "var(--se-teal)" : "#fff", border: `3px solid ${done ? "var(--se-teal)" : "var(--se-border)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: active ? 20 : 16, position: "relative", zIndex: 1, boxShadow: active ? "0 0 0 4px rgba(13,148,136,.2)" : "none", transition: "all .3s", color: done ? "#fff" : "var(--se-text-4)" }}>
              {done ? (active ? step.icon : "✓") : step.icon}
            </div>
            {/* label */}
            <div style={{ textAlign: "center", marginTop: 10, padding: "0 4px" }}>
              <p style={{ fontSize: 12, fontWeight: active ? 800 : 600, color: done ? "var(--se-navy)" : "var(--se-text-4)", marginBottom: 3 }}>{step.label}</p>
              {active && <p style={{ fontSize: 11, color: "var(--se-teal-hover)" }}>Current</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
function OrderDetailsPage() {
  const { orderId }     = useParams();
  const [order,    setOrder]     = useState(null);
  const [loading,  setLoading]   = useState(true);
  const [refreshing,setRefreshing]=useState(false);
  const [error,    setError]     = useState("");
  const [imgErrors,setImgErrors] = useState({});

  const loadOrder = async (full = true) => {
    if (!orderId) { setLoading(false); setError("Order ID missing."); return; }
    try {
      if (full) setLoading(true); else setRefreshing(true);
      setError("");
      const r = await getOrderById(orderId);
      const o = extractOrder(r);
      if (!o || typeof o !== "object") { setOrder(null); return; }
      setOrder(o);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Unable to load order.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { loadOrder(true); }, [orderId]);

  if (loading) return (
    <div style={{ padding: "64px 20px", width: "min(100%-40px,1240px)", margin: "0 auto" }}>
      <Loading message="Loading order details…" />
    </div>
  );

  if (error && !order) return (
    <div style={{ width: "min(100%-40px,1240px)", margin: "0 auto", padding: "40px 0" }}>
      <Link to="/orders" style={{ fontSize: 13, fontWeight: 600, color: "var(--se-text-3)", display: "inline-block", marginBottom: 20 }}>← Back to Orders</Link>
      <ErrorMessage message={error} onRetry={() => loadOrder(true)} />
    </div>
  );

  if (!order) return (
    <div style={{ width: "min(100%-40px,1240px)", margin: "0 auto", padding: "40px 0" }}>
      <Link to="/orders" style={{ fontSize: 13, fontWeight: 600, color: "var(--se-text-3)", display: "inline-block", marginBottom: 20 }}>← Back to Orders</Link>
      <div className="empty-state"><div style={{fontSize:48,marginBottom:12}}>📦</div><h2>Order not found</h2></div>
    </div>
  );

  // derive values
  const items   = Array.isArray(order.items) ? order.items : [];
  const status  = order.orderStatus || order.status || "pending";
  const payS    = order.paymentStatus || "pending";
  const payM    = order.paymentMethod || "—";
  const total   = Number(order.totalAmount ?? order.total ?? 0);
  const sub     = Number(order.subtotal ?? order.subTotal ?? total);
  const ship    = Number(order.shippingAmount ?? order.shippingCost ?? 0);
  const tax     = Number(order.taxAmount ?? order.tax ?? 0);
  const disc    = Number(order.discountAmount ?? order.discount ?? 0);
  const addr    = order.shippingAddress || order.deliveryAddress || {};
  const num     = order.orderNumber || order.orderNo || order._id;
  const ss      = statusBadge(status);
  const ps      = statusBadge(payS);

  const totalQty = useMemo(() => items.reduce((s, i) => s + Number(i.quantity || 0), 0), [items]);

  return (
    <div style={{ background: "var(--se-bg)", minHeight: "calc(100vh - 68px)" }}>

      {/* BANNER */}
      <div style={{ background: "linear-gradient(135deg, var(--se-navy) 0%, #1E3A5F 100%)", padding: "36px 0 30px" }}>
        <div style={{ width: "min(100% - 40px, 1240px)", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: "var(--se-teal-light)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 8 }}>Order Details</p>
              <h1 style={{ color: "#fff", fontSize: "clamp(1.3rem,2vw,1.8rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 6 }}>
                Order #{num}
              </h1>
              {order.createdAt && (
                <p style={{ color: "#94A3B8", fontSize: 13 }}>Placed on {fmtDate(order.createdAt, true)}</p>
              )}
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ padding: "6px 14px", borderRadius: 999, fontSize: 13, fontWeight: 700, background: ss.bg, color: ss.color, border: `1px solid ${ss.border}` }}>
                {fmtLabel(status)}
              </span>
              <button type="button" onClick={() => loadOrder(false)} disabled={refreshing}
                style={{ height: 38, padding: "0 14px", background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.15)", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", boxShadow: "none", transform: "none" }}>
                {refreshing ? "…" : "↻"}
              </button>
              <Link to="/orders" style={{ height: 38, padding: "0 16px", background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.2)", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center" }}>
                ← Orders
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div style={{ width: "min(100% - 40px, 1240px)", margin: "0 auto", padding: "28px 0 72px" }}>

        {error && <div style={{ marginBottom: 20 }}><ErrorMessage message={error} onRetry={() => loadOrder(false)} /></div>}

        {/* OVERVIEW CHIPS */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
          {[
            { label: "Order Status",   value: fmtLabel(status),  style: ss },
            { label: "Payment Status", value: fmtLabel(payS),    style: ps },
            { label: "Payment Method", value: fmtLabel(payM),    style: null },
            { label: "Total Items",    value: `${totalQty} items`, style: null },
          ].map(m => (
            <div key={m.label} style={{ padding: "10px 16px", background: "#fff", border: `1px solid ${m.style?.border || "var(--se-border)"}`, borderRadius: 10, minWidth: 120 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "var(--se-text-4)", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 4 }}>{m.label}</p>
              <p style={{ fontSize: 14, fontWeight: 700, color: m.style?.color || "var(--se-text)" }}>{m.value}</p>
            </div>
          ))}
        </div>

        {/* ORDER TIMELINE */}
        <div style={{ background: "#fff", border: "1px solid var(--se-border)", borderRadius: 16, padding: "24px 28px", marginBottom: 24, boxShadow: "var(--shadow-sm)" }}>
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "var(--se-text-4)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 4 }}>Order Progress</p>
            <h2 style={{ fontSize: "1.05rem", fontWeight: 800 }}>Track Your Order</h2>
          </div>
          <OrderTimeline status={status} />
        </div>

        {/* MAIN GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, alignItems: "start" }}>

          {/* LEFT: items */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

            <div style={{ background: "#fff", border: "1px solid var(--se-border)", borderRadius: 16, overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--se-border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--se-surface-2)" }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "var(--se-text-4)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 2 }}>Order Items</p>
                  <h2 style={{ fontSize: "1rem", fontWeight: 800 }}>Products ({items.length})</h2>
                </div>
              </div>

              {items.length === 0 ? (
                <div style={{ padding: "40px 24px", textAlign: "center", color: "var(--se-text-4)" }}>
                  <div style={{ fontSize: 40, marginBottom: 8 }}>📦</div>
                  <p>No items found for this order.</p>
                </div>
              ) : (
                <div>
                  {items.map((item, i) => {
                    const iid    = item._id || item.productId || i;
                    const iname  = item.name || item.productName || "Product";
                    const iprice = Number(item.price || 0);
                    const qty    = Number(item.quantity || 0);
                    const itotal = Number(item.total ?? item.subtotal ?? iprice * qty);
                    const img    = getImg(item.image || item.productImage);
                    return (
                      <div key={iid} style={{ display: "grid", gridTemplateColumns: "72px 1fr auto", gap: 16, padding: "16px 24px", borderBottom: i < items.length - 1 ? "1px solid var(--se-border-soft)" : "none", alignItems: "center" }}>
                        {/* image */}
                        <div style={{ width: 72, height: 72, borderRadius: 10, background: "var(--se-surface-2)", border: "1px solid var(--se-border)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          {img && !imgErrors[iid]
                            ? <img src={img} alt={iname} onError={() => setImgErrors(p=>({...p,[iid]:true}))} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 4 }} loading="lazy" />
                            : <span style={{ fontSize: 24 }}>📦</span>
                          }
                        </div>
                        {/* info */}
                        <div>
                          <p style={{ fontSize: 15, fontWeight: 700, color: "var(--se-text)", marginBottom: 4 }}>{iname}</p>
                          <p style={{ fontSize: 13, color: "var(--se-text-3)" }}>
                            {fmt(iprice)} × {qty} {item.unit ? item.unit : "unit"}{qty !== 1 ? "s" : ""}
                          </p>
                          {item.sku && <p style={{ fontSize: 12, color: "var(--se-text-4)", fontFamily: "monospace" }}>SKU: {item.sku}</p>}
                        </div>
                        {/* total */}
                        <div style={{ textAlign: "right" }}>
                          <p style={{ fontSize: 16, fontWeight: 800, color: "var(--se-navy)" }}>{fmt(itotal)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Delivery address */}
            <div style={{ background: "#fff", border: "1px solid var(--se-border)", borderRadius: 16, padding: "22px 24px", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "var(--se-text-4)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 4 }}>Delivery Information</p>
                <h2 style={{ fontSize: "1rem", fontWeight: 800 }}>Shipping Address</h2>
              </div>
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ width: 44, height: 44, background: "var(--se-teal-soft)", border: "1px solid var(--se-teal-light)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>📍</div>
                <div style={{ fontSize: 14, lineHeight: 1.8, color: "var(--se-text-2)" }}>
                  {addr.name     && <p style={{ fontWeight: 700, color: "var(--se-text)" }}>{addr.name}</p>}
                  {addr.phone    && <p>{addr.phone}</p>}
                  {addr.addressLine1 && <p>{addr.addressLine1}</p>}
                  {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                  {(addr.city || addr.state || addr.postalCode) && (
                    <p>{[addr.city, addr.state, addr.postalCode].filter(Boolean).join(", ")}</p>
                  )}
                  {addr.country  && <p>{addr.country}</p>}
                  {!addr.name && !addr.addressLine1 && (
                    <p style={{ color: "var(--se-text-4)" }}>Delivery address not available.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: summary */}
          <aside style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Order Summary */}
            <div style={{ background: "#fff", border: "1px solid var(--se-border)", borderRadius: 16, padding: "22px 22px", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ marginBottom: 18 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "var(--se-text-4)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 4 }}>Payment Summary</p>
                <h2 style={{ fontSize: "1rem", fontWeight: 800 }}>Order Total</h2>
              </div>

              {[
                { label: "Items", value: fmt(sub) },
                ship > 0 && { label: "Shipping", value: fmt(ship) },
                tax  > 0 && { label: "Tax",      value: fmt(tax)  },
                disc > 0 && { label: "Discount",  value: `- ${fmt(disc)}`, color: "var(--se-success)" },
              ].filter(Boolean).map(row => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "var(--se-text-3)", marginBottom: 10 }}>
                  <span>{row.label}</span>
                  <span style={{ fontWeight: 600, color: row.color || "var(--se-text-2)" }}>{row.value}</span>
                </div>
              ))}

              <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 0 0", borderTop: "2px solid var(--se-border)", marginTop: 6 }}>
                <span style={{ fontSize: "1rem", fontWeight: 800, color: "var(--se-navy)" }}>Total</span>
                <span style={{ fontSize: "1.3rem", fontWeight: 900, color: "var(--se-teal-hover)" }}>{fmt(total)}</span>
              </div>
            </div>

            {/* Payment status card */}
            <div style={{ padding: "18px 20px", background: ps.bg, border: `1px solid ${ps.border}`, borderRadius: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 24 }}>{payS === "paid" ? "✅" : "💳"}</span>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: ps.color, letterSpacing: ".07em", textTransform: "uppercase", marginBottom: 3 }}>Payment</p>
                  <p style={{ fontSize: 14, fontWeight: 800, color: ps.color }}>{fmtLabel(payS)}</p>
                  <p style={{ fontSize: 12, color: ps.color }}>{fmtLabel(payM)}</p>
                </div>
              </div>
            </div>

            {/* actions */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Link to="/orders"   className="btn-secondary"  style={{ justifyContent: "center", width: "100%", fontSize: 13 }}>← My Orders</Link>
              <Link to="/products" className="btn-primary"    style={{ justifyContent: "center", width: "100%", fontSize: 13 }}>Continue Shopping →</Link>
            </div>
          </aside>

        </div>
      </div>

      <style>{`@media(max-width:860px){div[style*="grid-template-columns: 1fr 320px"]{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}

export default OrderDetailsPage;
