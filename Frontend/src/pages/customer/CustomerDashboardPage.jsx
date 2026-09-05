// ============================================================
// SHANTI ENTERPRISES — CustomerDashboardPage (Premium v2)
// ============================================================

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell, Box, CheckCircle2, ClipboardList,
  FileText, Heart, MapPin, Package,
  RefreshCw, ShoppingBag, ShoppingCart, UserRound,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { getMyOrders } from "../../api/orderApi";
import Loading    from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";

import "./CustomerDashboardPage.css";

// ─── helpers ─────────────────────────────────────────────────
const fmt = (v) =>
  `₹${Number(v || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

const fmtDate = (v) => {
  if (!v) return "—";
  const d = new Date(v);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const extractOrders = (r) =>
  Array.isArray(r?.orders) ? r.orders
  : Array.isArray(r?.data?.orders) ? r.data.orders
  : Array.isArray(r?.data) ? r.data
  : Array.isArray(r) ? r : [];

const getOrderStatus  = (o) => o?.orderStatus || o?.status || "Pending";
const normalizeStatus = (s) => String(s || "pending").toLowerCase();
const isDelivered     = (s) => { const v = normalizeStatus(s); return v.includes("deliver") || v.includes("complete"); };
const isCancelled     = (s) => { const v = normalizeStatus(s); return v.includes("cancel") || v.includes("reject"); };

const getStatusTone = (s) => {
  const v = normalizeStatus(s);
  if (isDelivered(v)) return "success";
  if (isCancelled(v)) return "danger";
  if (v.includes("ship"))    return "info";
  if (v.includes("confirm") || v.includes("process")) return "progress";
  return "warning";
};

const fmtStatus = (s) =>
  String(s || "Pending").replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

// ─── StatCard ─────────────────────────────────────────────────
function StatCard({ icon, label, value, tone }) {
  return (
    <div className={`customer-dashboard-stat-card ${tone || ""}`}>
      <div className="customer-dashboard-stat-icon">{icon}</div>
      <div className="customer-dashboard-stat-content">
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

// ─── QuickAction ─────────────────────────────────────────────
function QuickAction({ to, icon, label, desc }) {
  return (
    <Link to={to} className="customer-dashboard-action">
      <span className="customer-dashboard-action-icon">{icon}</span>
      <span className="customer-dashboard-action-copy">
        <strong>{label}</strong>
        <small>{desc}</small>
      </span>
      <span className="customer-dashboard-action-arrow" style={{ color: "var(--cd-muted-2)", fontSize: 16 }}>›</span>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────
function CustomerDashboardPage() {
  const { user }                        = useAuth();
  const { totalItems = 0, subtotal = 0} = useCart();

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

  const name    = user?.name?.trim() || "Customer";
  const email   = user?.email || "—";
  const phone   = user?.phone || "—";
  const initial = name.charAt(0).toUpperCase();

  const recentOrders   = useMemo(() => orders.slice(0, 5), [orders]);
  const deliveredCount = useMemo(() => orders.filter((o) => isDelivered(getOrderStatus(o))).length, [orders]);
  const activeCount    = useMemo(() => orders.filter((o) => { const s = getOrderStatus(o); return !isDelivered(s) && !isCancelled(s); }).length, [orders]);

  if (loading) return (
    <main className="customer-dashboard-loading">
      <Loading message="Loading dashboard…" />
    </main>
  );

  return (
    <main className="customer-dashboard-page">

      {/* ──────────────── HERO ──────────────── */}
      <section className="customer-dashboard-hero">
        <div className="customer-dashboard-container">
          <div className="customer-dashboard-hero-inner">

            <div className="customer-dashboard-identity">
              <div className="customer-dashboard-avatar customer-dashboard-avatar-hero" aria-hidden="true">
                {initial}
              </div>
              <div className="customer-dashboard-identity-copy">
                <span className="customer-dashboard-eyebrow">Customer Dashboard</span>
                <h1>
                  Welcome back,{" "}
                  <span>{name}</span>
                </h1>
                <p>Manage your orders, account and business shopping activity from one place.</p>
              </div>
            </div>

            <div className="customer-dashboard-hero-actions">
              <button
                type="button"
                className="customer-dashboard-refresh-button"
                onClick={() => loadOrders(true)}
                disabled={refreshing}
              >
                <RefreshCw size={15} className={refreshing ? "customer-dashboard-spin" : ""} aria-hidden="true" />
                {refreshing ? "Refreshing…" : "Refresh"}
              </button>

              <Link to="/products" className="customer-dashboard-primary-button">
                <ShoppingBag size={15} aria-hidden="true" />
                Browse Products
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ──────────────── CONTENT ──────────────── */}
      <div className="customer-dashboard-container customer-dashboard-content">

        {error && (
          <div className="customer-dashboard-error">
            <ErrorMessage message={error} onRetry={() => loadOrders()} />
          </div>
        )}

        {/* STATS */}
        <section className="customer-dashboard-stats" aria-label="Account summary">
          <StatCard icon={<Package   size={19} />} label="Total Orders"  value={orders.length}   tone="teal"   />
          <StatCard icon={<Box       size={19} />} label="Active Orders" value={activeCount}      tone="amber"  />
          <StatCard icon={<CheckCircle2 size={19}/>}label="Delivered"    value={deliveredCount}   tone="green"  />
          <StatCard icon={<ShoppingCart size={19}/>}label="Cart Items"   value={totalItems}       tone="blue"   />
          <StatCard icon="₹"                        label="Cart Value"   value={fmt(subtotal)}    tone="violet" />
        </section>

        {/* MAIN GRID */}
        <div className="customer-dashboard-grid">

          {/* ──── LEFT ──── */}
          <div className="customer-dashboard-main">

            {/* QUICK ACTIONS */}
            <section className="customer-dashboard-card">
              <div className="customer-dashboard-card-header">
                <div>
                  <span>Shortcuts</span>
                  <h2>Quick Actions</h2>
                </div>
                <ShoppingBag size={18} className="customer-dashboard-header-icon" aria-hidden="true" />
              </div>
              <div className="customer-dashboard-actions">
                <QuickAction to="/products"  icon={<ShoppingBag   size={17}/>} label="Browse Products"  desc="Explore our catalogue"                  />
                <QuickAction to="/categories"icon={<ClipboardList size={17}/>} label="Categories"       desc="Shop by category"                       />
                <QuickAction to="/cart"      icon={<ShoppingCart  size={17}/>} label="My Cart"          desc={`${totalItems} item${totalItems!==1?"s":""}`}/>
                <QuickAction to="/orders"    icon={<Package       size={17}/>} label="My Orders"        desc="Track your orders"                      />
                <QuickAction to="/rfqs"      icon={<FileText      size={17}/>} label="My RFQs"          desc="Wholesale requests"                     />
                <QuickAction to="/addresses" icon={<MapPin        size={17}/>} label="Addresses"        desc="Manage delivery addresses"              />
              </div>
            </section>

            {/* RECENT ORDERS */}
            <section className="customer-dashboard-card">
              <div className="customer-dashboard-card-header">
                <div>
                  <span>Order History</span>
                  <h2>Recent Orders</h2>
                </div>
                {orders.length > 0 && (
                  <Link to="/orders" className="customer-dashboard-view-all">
                    View All <span style={{ fontSize: 15 }}>›</span>
                  </Link>
                )}
              </div>

              {recentOrders.length === 0 ? (
                <div className="customer-dashboard-empty">
                  <div className="customer-dashboard-empty-icon">
                    <Package size={22} />
                  </div>
                  <h3>No orders yet</h3>
                  <p>Place your first order to see it here.</p>
                  <Link to="/products" className="customer-dashboard-small-button">
                    Start Shopping <span>›</span>
                  </Link>
                </div>
              ) : (
                <div className="customer-dashboard-orders">
                  {recentOrders.map((order, i) => {
                    const oid    = order?._id || order?.id;
                    const status = getOrderStatus(order);
                    const total  = Number(order?.totalAmount ?? order?.total ?? 0);
                    const tone   = getStatusTone(status);
                    return (
                      <div key={oid || i} className="customer-dashboard-order">
                        <div className="customer-dashboard-order-icon">
                          <Package size={16} aria-hidden="true" />
                        </div>
                        <div className="customer-dashboard-order-info">
                          <strong>#{order?.orderNumber || oid || "Order"}</strong>
                          <span>{fmtDate(order?.createdAt)}<i> • </i>{fmt(total)}</span>
                        </div>
                        <span className={`customer-dashboard-order-status ${tone}`}>
                          {fmtStatus(status)}
                        </span>
                        {oid && (
                          <Link to={`/orders/${oid}`} className="customer-dashboard-order-link">
                            View <span>›</span>
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* CTA BANNER */}
            <section className="customer-dashboard-cta">
              <div className="customer-dashboard-cta-glow" />
              <div className="customer-dashboard-cta-content">
                <span>Keep Shopping</span>
                <h2>Find the products your business needs.</h2>
                <p>Browse quality products and place your next business order with ease.</p>
              </div>
              <Link to="/products" className="customer-dashboard-cta-button">
                Explore Products <span style={{ fontSize: 16 }}>›</span>
              </Link>
            </section>

          </div>

          {/* ──── RIGHT SIDEBAR ──── */}
          <aside className="customer-dashboard-sidebar">

            {/* PROFILE */}
            <section className="customer-dashboard-card customer-dashboard-profile-card">
              <div className="customer-dashboard-profile">
                <div className="customer-dashboard-avatar" aria-hidden="true">{initial}</div>
                <h3>{name}</h3>
                <p>{email}</p>
                {phone !== "—" && <p>{phone}</p>}
              </div>
              <Link to="/profile" className="customer-dashboard-profile-button">
                <UserRound size={14} aria-hidden="true" />
                Edit Profile
                <span style={{ marginLeft: "auto", fontSize: 16 }}>›</span>
              </Link>
            </section>

            {/* ACCOUNT LINKS */}
            <section className="customer-dashboard-card customer-dashboard-account-card">
              <div className="customer-dashboard-card-header">
                <div>
                  <span>Account</span>
                  <h2>Manage</h2>
                </div>
                <UserRound size={17} className="customer-dashboard-header-icon" aria-hidden="true" />
              </div>
              <nav className="customer-dashboard-account-links">
                {[
                  { to:"/orders",        icon:<Package       size={15}/>, label:"My Orders"       },
                  { to:"/addresses",     icon:<MapPin        size={15}/>, label:"Saved Addresses" },
                  { to:"/quotations",    icon:<FileText      size={15}/>, label:"My Quotations"   },
                  { to:"/rfqs",          icon:<ClipboardList size={15}/>, label:"My RFQs"         },
                  { to:"/wishlist",      icon:<Heart         size={15}/>, label:"Wishlist"         },
                  { to:"/notifications", icon:<Bell          size={15}/>, label:"Notifications"   },
                  { to:"/returns",       icon:<RefreshCw     size={15}/>, label:"Returns"          },
                  { to:"/invoices",      icon:<FileText      size={15}/>, label:"Invoices"         },
                ].map((item) => (
                  <Link key={item.to} to={item.to} className="customer-dashboard-account-link">
                    <span className="customer-dashboard-account-link-icon">{item.icon}</span>
                    <span>{item.label}</span>
                    <span style={{ marginLeft:"auto", fontSize:15, color:"var(--cd-muted-2)" }}>›</span>
                  </Link>
                ))}
              </nav>
            </section>

            {/* CART CARD */}
            <section className="customer-dashboard-shopping-card">
              <div className="customer-dashboard-shopping-icon">
                <ShoppingCart size={20} aria-hidden="true" />
              </div>
              <span>Your Cart</span>
              <h3>{totalItems > 0 ? `${totalItems} item${totalItems!==1?"s":""} ready` : "Your cart is waiting"}</h3>
              <p>{totalItems > 0 ? `${fmt(subtotal)} current cart value.` : "Add products to build your next order."}</p>
              <Link to="/cart" className="customer-dashboard-shopping-button">
                {totalItems > 0 ? "Review Cart" : "Start Shopping"}
                <span style={{ fontSize: 16 }}>›</span>
              </Link>
            </section>

          </aside>
        </div>
      </div>
    </main>
  );
}

export default CustomerDashboardPage;
