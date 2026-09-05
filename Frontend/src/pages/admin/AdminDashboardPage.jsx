// ============================================================
// SHANTI ENTERPRISES — AdminDashboardPage (Premium)
// ============================================================

import { useEffect, useState } from "react";
import { Link }                from "react-router-dom";
import { getAdminDashboardStats } from "../../api/adminDashboardApi";
import Loading      from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";
import "./AdminDashboardPage.css";

// ─── helpers ─────────────────────────────────────────────────
const getNum = (...vals) => {
  for (const v of vals) {
    if (v !== undefined && v !== null && v !== "") {
      const n = Number(v);
      if (!Number.isNaN(n)) return n;
    }
  }
  return 0;
};
const fmtNum = (v) => Number(v || 0).toLocaleString("en-IN");
const fmtCur = (v) =>
  `₹${Number(v || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

// ─── StatCard ─────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color, to }) {
  return (
    <div className="adm-stat" style={{ "--adm-stat-color": color }}>
      <div className="adm-stat-bar" />
      <div className="adm-stat-top">
        <div className="adm-stat-icon">{icon}</div>
        <span className="adm-stat-label">{label}</span>
      </div>
      <div className="adm-stat-value">{value}</div>
      <div className="adm-stat-sub">{sub}</div>
      {to && <Link to={to} className="adm-stat-link">Manage →</Link>}
    </div>
  );
}

// ─── NavItem ─────────────────────────────────────────────────
function NavItem({ to, icon, label, desc }) {
  return (
    <Link to={to} className="adm-nav-item">
      <div className="adm-nav-icon">{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p className="adm-nav-label">{label}</p>
        <p className="adm-nav-desc">{desc}</p>
      </div>
      <span className="adm-nav-arrow">›</span>
    </Link>
  );
}

// ─── QuickAction ─────────────────────────────────────────────
function QuickAction({ to, icon, label, color }) {
  return (
    <Link to={to} className="adm-quick" style={{ "--adm-quick-color": color }}>
      <div className="adm-quick-icon">{icon}</div>
      <span className="adm-quick-label">{label}</span>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────
function AdminDashboardPage() {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [spinning,setSpinning]= useState(false);

  const loadDashboard = async (isRefresh = false) => {
    try {
      if (isRefresh) setSpinning(true); else setLoading(true);
      setError("");
      const r = await getAdminDashboardStats();
      setStats(r?.stats || r?.data?.stats || r?.data || r);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Unable to load admin dashboard.");
    } finally {
      setLoading(false);
      setSpinning(false);
    }
  };

  useEffect(() => { loadDashboard(); }, []);

  if (loading) return (
    <div className="adm" style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"60vh" }}>
      <Loading message="Loading admin dashboard…" />
    </div>
  );

  const totalUsers      = getNum(stats?.totalUsers,      stats?.users,      stats?.userCount);
  const totalProducts   = getNum(stats?.totalProducts,   stats?.products,   stats?.productCount);
  const totalOrders     = getNum(stats?.totalOrders,     stats?.orders,     stats?.orderCount);
  const totalCategories = getNum(stats?.totalCategories, stats?.categories, stats?.categoryCount);
  const totalRevenue    = getNum(stats?.totalRevenue,    stats?.revenue,    stats?.sales);
  const pendingOrders   = getNum(stats?.pendingOrders);
  const deliveredOrders = getNum(stats?.deliveredOrders);
  const cancelledOrders = getNum(stats?.cancelledOrders);

  return (
    <div className="adm">

      {/* ── HERO ────────────────────────────────────────── */}
      <section className="adm-hero">
        <div className="adm-hero-inner">
          <div className="adm-hero-left">
            <div className="adm-hero-badge">⚙️</div>
            <div>
              <span className="adm-hero-eyebrow">Administration Panel</span>
              <h1 className="adm-hero-title">Admin Dashboard</h1>
              <p className="adm-hero-sub">Manage your Shanti Enterprises store from one place.</p>
            </div>
          </div>

          <div className="adm-hero-actions">
            <button
              type="button"
              className="adm-btn-ghost"
              onClick={() => loadDashboard(true)}
              disabled={spinning}
            >
              <span
                style={{
                  display: "inline-block",
                  animation: spinning ? "adm-spin .8s linear infinite" : "none",
                  fontSize: 15,
                }}
              >
                ↻
              </span>
              {spinning ? "Refreshing…" : "Refresh"}
            </button>
            <Link to="/admin/products/new" className="adm-btn-teal">
              <span>＋</span> Add Product
            </Link>
          </div>
        </div>
      </section>

      {/* ── BODY ────────────────────────────────────────── */}
      <div className="adm-body">

        {error && <div className="adm-error"><ErrorMessage message={error} onRetry={loadDashboard} /></div>}

        {/* ── STATS ROW ───────────────────────────────── */}
        <div className="adm-stats">
          <StatCard icon="👥" label="Users"      value={fmtNum(totalUsers)}      sub="Registered customers"   color="#2563EB" to="/admin/users"      />
          <StatCard icon="📦" label="Products"   value={fmtNum(totalProducts)}   sub="In catalogue"           color="#7C3AED" to="/admin/products"   />
          <StatCard icon="🛒" label="Orders"     value={fmtNum(totalOrders)}     sub="Total orders"           color="#0891B2" to="/admin/orders"     />
          <StatCard icon="🗂️" label="Categories" value={fmtNum(totalCategories)} sub="Product categories"     color="#D97706" to="/admin/categories" />
          <StatCard icon="💰" label="Revenue"    value={fmtCur(totalRevenue)}    sub="Total store revenue"    color="#059669"                        />
        </div>

        {/* ── ORDER OVERVIEW + QUICK ACTIONS ──────────── */}
        <div className="adm-row">

          {/* order overview */}
          <div className="adm-panel">
            <div className="adm-panel-head">
              <div>
                <span className="adm-panel-eyebrow">Order Management</span>
                <h2 className="adm-panel-title">Order Overview</h2>
              </div>
              <Link to="/admin/orders" className="adm-panel-link">View All →</Link>
            </div>

            <div className="adm-order-status-grid">
              <div className="adm-order-status-card" style={{ background:"#FFFBEB", borderColor:"#FDE68A", color:"#B45309" }}>
                <span className="adm-order-status-emoji">⏳</span>
                <span className="adm-order-status-num">{pendingOrders}</span>
                <span className="adm-order-status-label">Pending</span>
              </div>
              <div className="adm-order-status-card" style={{ background:"#ECFDF5", borderColor:"#A7F3D0", color:"#059669" }}>
                <span className="adm-order-status-emoji">✅</span>
                <span className="adm-order-status-num">{deliveredOrders}</span>
                <span className="adm-order-status-label">Delivered</span>
              </div>
              <div className="adm-order-status-card" style={{ background:"#FEF2F2", borderColor:"#FECACA", color:"#DC2626" }}>
                <span className="adm-order-status-emoji">❌</span>
                <span className="adm-order-status-num">{cancelledOrders}</span>
                <span className="adm-order-status-label">Cancelled</span>
              </div>
            </div>
          </div>

          {/* quick actions */}
          <div className="adm-panel">
            <div className="adm-panel-head">
              <div>
                <span className="adm-panel-eyebrow">Shortcuts</span>
                <h2 className="adm-panel-title">Quick Actions</h2>
              </div>
            </div>
            <div className="adm-quick-grid">
              <QuickAction to="/admin/products/new"   icon="📦" label="Add Product"   color="#7C3AED" />
              <QuickAction to="/admin/categories/new" icon="🗂️" label="Add Category"  color="#D97706" />
              <QuickAction to="/admin/orders"         icon="🛒" label="Orders"         color="#0891B2" />
              <QuickAction to="/admin/users"          icon="👥" label="Users"          color="#2563EB" />
            </div>
          </div>

        </div>

        {/* ── STORE MANAGEMENT ────────────────────────── */}
        <div className="adm-panel">
          <div className="adm-panel-head">
            <div>
              <span className="adm-panel-eyebrow">Store Management</span>
              <h2 className="adm-panel-title">All Sections</h2>
            </div>
          </div>
          <div className="adm-nav-grid">
            <NavItem to="/admin/products"   icon="📦" label="Products"    desc="Add, edit and manage products"          />
            <NavItem to="/admin/categories" icon="🗂️" label="Categories"  desc="Organise product categories"            />
            <NavItem to="/admin/orders"     icon="🛒" label="Orders"      desc="Review and manage customer orders"      />
            <NavItem to="/admin/users"      icon="👥" label="Users"       desc="Manage registered customers"            />
            <NavItem to="/admin/rfqs"       icon="📋" label="RFQs"        desc="Handle wholesale quote requests"        />
            <NavItem to="/admin/quotations" icon="🧾" label="Quotations"  desc="Manage sent quotations"                 />
            <NavItem to="/admin/inventory"  icon="🏷️" label="Inventory"   desc="Monitor and adjust stock levels"        />
            <NavItem to="/admin/shipments"  icon="🚚" label="Shipments"   desc="Track and update shipment status"       />
            <NavItem to="/admin/reports"    icon="📊" label="Reports"     desc="Revenue and analytics reports"          />
            <NavItem to="/admin/analytics"  icon="📈" label="Analytics"   desc="Sales trends and performance data"      />
          </div>
        </div>

      </div>

      <style>{`@keyframes adm-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default AdminDashboardPage;
