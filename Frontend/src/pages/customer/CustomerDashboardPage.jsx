// ============================================================
// SHANTI ENTERPRISES — CustomerDashboardPage (Premium)
// ============================================================

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { getMyOrders } from "../../api/orderApi";
import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";

// ── helpers ───────────────────────────────────────────────────
const fmt = (n) =>
  `₹${Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

const fmtDate = (v) => {
  if (!v) return "—";
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const extractOrders = (r) =>
  Array.isArray(r?.orders) ? r.orders
  : Array.isArray(r?.data?.orders) ? r.data.orders
  : Array.isArray(r?.data) ? r.data
  : Array.isArray(r) ? r : [];

const statusStyle = (s) => {
  const v = String(s || "").toLowerCase();
  if (v.includes("deliver") || v.includes("complete"))
    return { bg: "var(--se-success-bg)", color: "var(--se-success)", border: "#A7F3D0" };
  if (v.includes("cancel") || v.includes("reject"))
    return { bg: "var(--se-danger-bg)",  color: "var(--se-danger)",  border: "#FECACA" };
  if (v.includes("ship"))
    return { bg: "var(--se-info-bg)",    color: "var(--se-info)",    border: "#BFDBFE" };
  if (v.includes("confirm") || v.includes("process"))
    return { bg: "#F0FDF4",              color: "#166534",           border: "#BBF7D0" };
  return { bg: "var(--se-warning-bg)",  color: "var(--se-warning)", border: "#FDE68A" };
};

const fmtStatus = (s) =>
  String(s || "Pending").replace(/[-_]/g, " ").replace(/\b\w/g, c => c.toUpperCase());

// ── stat card ────────────────────────────────────────────────
function StatCard({ icon, label, value, accent = "var(--se-teal)" }) {
  return (
    <div style={{ background: "#fff", border: "1px solid var(--se-border)", borderRadius: 14, padding: "20px 20px 16px", boxShadow: "var(--shadow-sm)", borderLeft: `4px solid ${accent}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: `${accent}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
          {icon}
        </div>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--se-text-3)" }}>{label}</p>
      </div>
      <p style={{ fontSize: "1.8rem", fontWeight: 900, color: "var(--se-navy)", letterSpacing: "-0.04em", lineHeight: 1 }}>{value}</p>
    </div>
  );
}

// ── quick action ─────────────────────────────────────────────
function QuickAction({ to, icon, label, desc }) {
  return (
    <Link to={to} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 10, border: "1px solid var(--se-border)", background: "#fff", transition: "all .2s", textDecoration: "none" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--se-teal-light)"; e.currentTarget.style.background = "var(--se-teal-soft)"; e.currentTarget.style.transform = "translateX(2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--se-border)"; e.currentTarget.style.background = "#fff"; e.currentTarget.style.transform = ""; }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--se-teal-soft)", border: "1px solid var(--se-teal-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: "var(--se-text)" }}>{label}</p>
        <p style={{ fontSize: 12, color: "var(--se-text-3)" }}>{desc}</p>
      </div>
      <span style={{ color: "var(--se-text-4)", fontSize: 16 }}>→</span>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────
function CustomerDashboardPage() {
  const { user }                    = useAuth();
  const { totalItems = 0, subtotal = 0 } = useCart();

  const [orders,    setOrders]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [refreshing,setRefreshing]= useState(false);
  const [error,     setError]     = useState("");

  const loadOrders = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true); else setLoading(true);
      setError("");
      const r = await getMyOrders();
      setOrders(extractOrders(r));
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Unable to load dashboard data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { loadOrders(); }, []);

  const name    = user?.name?.trim()  || "Customer";
  const email   = user?.email         || "—";
  const phone   = user?.phone         || "—";
  const initial = name.charAt(0).toUpperCase();

  const recent = useMemo(() => orders.slice(0, 5), [orders]);

  const delivered = useMemo(() =>
    orders.filter(o => { const s = String(o?.orderStatus || o?.status || "").toLowerCase(); return s.includes("deliver") || s.includes("complete"); }).length,
  [orders]);

  const active = useMemo(() =>
    orders.filter(o => { const s = String(o?.orderStatus || o?.status || "pending").toLowerCase(); return !s.includes("deliver") && !s.includes("complete") && !s.includes("cancel"); }).length,
  [orders]);

  if (loading) return <div style={{ padding: "64px 20px" }}><Loading message="Loading dashboard…" /></div>;

  return (
    <div style={{ background: "var(--se-bg)", minHeight: "calc(100vh - 68px)" }}>

      {/* ── BANNER ──────────────────────────────────────── */}
      <div style={{ background: "linear-gradient(135deg, var(--se-navy) 0%, var(--se-navy-soft) 100%)", padding: "40px 0 36px" }}>
        <div style={{ width: "min(100% - 40px, 1240px)", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ width: 60, height: 60, background: "var(--se-teal)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800, color: "#fff", flexShrink: 0, boxShadow: "0 4px 16px rgba(13,148,136,.4)" }}>
              {initial}
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: "var(--se-teal-light)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 4 }}>Customer Dashboard</p>
              <h1 style={{ color: "#fff", fontSize: "clamp(1.4rem,2.5vw,1.9rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 4 }}>Welcome back, {name}!</h1>
              <p style={{ color: "#94A3B8", fontSize: 14 }}>{email}</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button type="button" onClick={() => loadOrders(true)} disabled={refreshing}
              style={{ height: 40, padding: "0 18px", background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.15)", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", boxShadow: "none", transform: "none" }}>
              {refreshing ? "Refreshing…" : "↻ Refresh"}
            </button>
            <Link to="/products" style={{ height: 40, padding: "0 20px", background: "var(--se-teal)", border: "none", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 6, boxShadow: "0 4px 14px rgba(13,148,136,.4)" }}>
              Browse Products →
            </Link>
          </div>
        </div>
      </div>

      <div style={{ width: "min(100% - 40px, 1240px)", margin: "0 auto", padding: "32px 0 72px" }}>

        {error && <ErrorMessage message={error} onRetry={() => loadOrders()} />}

        {/* ── STATS ───────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 16, marginBottom: 32 }}>
          <StatCard icon="📦" label="Total Orders"  value={orders.length}    accent="var(--se-teal)"    />
          <StatCard icon="⏳" label="Active Orders"  value={active}           accent="var(--se-warning)" />
          <StatCard icon="✅" label="Delivered"      value={delivered}        accent="var(--se-success)" />
          <StatCard icon="🛒" label="Cart Items"     value={totalItems}       accent="var(--se-info)"    />
          <StatCard icon="₹"  label="Cart Value"     value={fmt(subtotal)}    accent="#7C3AED"           />
        </div>

        {/* ── MAIN GRID ───────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, alignItems: "start" }}>

          {/* LEFT */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

            {/* Quick Actions */}
            <div style={{ background: "#fff", border: "1px solid var(--se-border)", borderRadius: 16, padding: "22px 24px", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "var(--se-text-4)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 4 }}>Shortcuts</p>
                  <h2 style={{ fontSize: "1.1rem", fontWeight: 800 }}>Quick Actions</h2>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <QuickAction to="/products"  icon="🛍️" label="Browse Products"  desc="Explore our catalogue"      />
                <QuickAction to="/categories"icon="🗂️" label="Categories"       desc="Shop by category"           />
                <QuickAction to="/cart"      icon="🛒" label="My Cart"          desc={`${totalItems} item${totalItems!==1?"s":""}`} />
                <QuickAction to="/orders"    icon="📦" label="My Orders"        desc="Track your orders"           />
                <QuickAction to="/rfqs"      icon="📋" label="My RFQs"          desc="Wholesale requests"          />
                <QuickAction to="/addresses" icon="📍" label="Addresses"        desc="Manage delivery addresses"   />
              </div>
            </div>

            {/* Recent Orders */}
            <div style={{ background: "#fff", border: "1px solid var(--se-border)", borderRadius: 16, padding: "22px 24px", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "var(--se-text-4)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 4 }}>Order History</p>
                  <h2 style={{ fontSize: "1.1rem", fontWeight: 800 }}>Recent Orders</h2>
                </div>
                {orders.length > 0 && <Link to="/orders" style={{ fontSize: 13, fontWeight: 700, color: "var(--se-teal)" }}>View All →</Link>}
              </div>

              {recent.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px" }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
                  <h3 style={{ marginBottom: 8, fontSize: "1rem" }}>No orders yet</h3>
                  <p style={{ marginBottom: 20, fontSize: 14 }}>Place your first order to see it here.</p>
                  <Link to="/products" className="btn-primary" style={{ display: "inline-flex" }}>Start Shopping →</Link>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {recent.map((order, i) => {
                    const oid    = order?._id || order?.id;
                    const status = order?.orderStatus || order?.status || "Pending";
                    const total  = Number(order?.totalAmount ?? order?.total ?? 0);
                    const st     = statusStyle(status);
                    return (
                      <div key={oid || i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderBottom: i < recent.length - 1 ? "1px solid var(--se-border-soft)" : "none" }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--se-surface-2)", border: "1px solid var(--se-border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>📦</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 14, fontWeight: 700, color: "var(--se-text)", marginBottom: 2 }}>
                            #{order?.orderNumber || oid}
                          </p>
                          <p style={{ fontSize: 12, color: "var(--se-text-3)" }}>
                            {fmtDate(order?.createdAt)} · {fmt(total)}
                          </p>
                        </div>
                        <span style={{ padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700, background: st.bg, color: st.color, border: `1px solid ${st.border}`, whiteSpace: "nowrap" }}>
                          {fmtStatus(status)}
                        </span>
                        {oid && (
                          <Link to={`/orders/${oid}`} style={{ fontSize: 12, fontWeight: 700, color: "var(--se-teal)", whiteSpace: "nowrap" }}>View →</Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* CTA banner */}
            <div style={{ background: "linear-gradient(135deg, var(--se-navy) 0%, #1E3A5F 100%)", borderRadius: 16, padding: "28px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: "var(--se-teal-light)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 6 }}>Keep Shopping</p>
                <h3 style={{ color: "#fff", fontSize: "1.2rem", fontWeight: 800, marginBottom: 6 }}>Find the products you need.</h3>
                <p style={{ color: "#94A3B8", fontSize: 14 }}>Browse hundreds of quality products ready to order.</p>
              </div>
              <Link to="/products" style={{ height: 46, padding: "0 24px", background: "var(--se-teal)", borderRadius: 10, color: "#fff", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", gap: 8, flexShrink: 0, boxShadow: "0 4px 16px rgba(13,148,136,.4)" }}>
                Explore Products →
              </Link>
            </div>

          </div>

          {/* RIGHT SIDEBAR */}
          <aside style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Profile card */}
            <div style={{ background: "#fff", border: "1px solid var(--se-border)", borderRadius: 16, padding: "22px 24px", boxShadow: "var(--shadow-sm)", textAlign: "center" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--se-teal)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 800, margin: "0 auto 14px", boxShadow: "0 4px 16px rgba(13,148,136,.3)" }}>
                {initial}
              </div>
              <h3 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: 4 }}>{name}</h3>
              <p style={{ fontSize: 13, color: "var(--se-text-3)", marginBottom: 2 }}>{email}</p>
              {phone !== "—" && <p style={{ fontSize: 13, color: "var(--se-text-3)", marginBottom: 16 }}>{phone}</p>}
              <Link to="/profile" className="btn-secondary" style={{ width: "100%", justifyContent: "center", fontSize: 13 }}>
                Edit Profile →
              </Link>
            </div>

            {/* Account links */}
            <div style={{ background: "#fff", border: "1px solid var(--se-border)", borderRadius: 16, padding: "20px 20px", boxShadow: "var(--shadow-sm)" }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "var(--se-text-4)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 14 }}>Account</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {[
                  { to: "/orders",       icon: "📦", label: "My Orders"        },
                  { to: "/addresses",    icon: "📍", label: "Saved Addresses"  },
                  { to: "/quotations",   icon: "🧾", label: "My Quotations"    },
                  { to: "/rfqs",         icon: "📋", label: "My RFQs"          },
                  { to: "/wishlist",     icon: "❤️", label: "Wishlist"          },
                  { to: "/notifications",icon: "🔔", label: "Notifications"    },
                  { to: "/returns",      icon: "↩️", label: "Returns"           },
                  { to: "/invoices",     icon: "🧾", label: "Invoices"         },
                ].map(l => (
                  <Link key={l.to} to={l.to} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8, fontSize: 13, fontWeight: 500, color: "var(--se-text-2)", transition: "all .2s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "var(--se-teal-soft)"; e.currentTarget.style.color = "var(--se-teal-hover)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = ""; e.currentTarget.style.color = "var(--se-text-2)"; }}>
                    <span style={{ fontSize: 16 }}>{l.icon}</span>
                    {l.label}
                    <span style={{ marginLeft: "auto", color: "var(--se-text-4)", fontSize: 12 }}>→</span>
                  </Link>
                ))}
              </div>
            </div>

          </aside>

        </div>
      </div>

      <style>{`@media(max-width:900px){div[style*="grid-template-columns: 1fr 320px"]{grid-template-columns:1fr!important} div[style*="grid-template-columns: repeat(5,1fr)"]{grid-template-columns:repeat(2,1fr)!important}}`}</style>
    </div>
  );
}

export default CustomerDashboardPage;
