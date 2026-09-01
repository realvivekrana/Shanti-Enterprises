// ============================================================
// SHANTI ENTERPRISES — OrdersPage (Premium)
// ============================================================

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getMyOrders } from "../../api/orderApi";
import Loading    from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";

// ── helpers ───────────────────────────────────────────────────
const fmt = (n) =>
  `₹${Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const fmtDate = (v) => {
  if (!v) return "—";
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const fmtLabel = (s) =>
  String(s || "").replace(/[-_]/g, " ").replace(/\b\w/g, c => c.toUpperCase());

const statusStyle = (s) => {
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

const payStyle = (s) => {
  const v = String(s || "").toLowerCase();
  if (v === "paid")    return { bg: "#F0FDF4", color: "#15803D", border: "#A7F3D0" };
  if (v === "failed")  return { bg: "#FEF2F2", color: "#DC2626", border: "#FECACA" };
  return { bg: "#FFFBEB", color: "#B45309", border: "#FDE68A" };
};

const extractOrders = (r) =>
  Array.isArray(r?.orders) ? r.orders
  : Array.isArray(r?.data?.orders) ? r.data.orders
  : Array.isArray(r?.data) ? r.data
  : Array.isArray(r) ? r : [];

// ─────────────────────────────────────────────────────────────
function OrdersPage() {
  const [orders,    setOrders]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [refreshing,setRefreshing]= useState(false);
  const [error,     setError]     = useState("");
  const [search,    setSearch]    = useState("");
  const [filter,    setFilter]    = useState("all");
  const [sort,      setSort]      = useState("newest");

  const loadOrders = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true); else setLoading(true);
      setError("");
      const r = await getMyOrders({ page: 1, limit: 100 });
      setOrders(extractOrders(r));
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Unable to load your orders.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { loadOrders(); }, []);

  // counts per status
  const counts = useMemo(() => {
    const c = { all: orders.length, pending: 0, confirmed: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0 };
    orders.forEach(o => {
      const s = String(o?.orderStatus || o?.status || "pending").toLowerCase().replace(/\s/g,"_");
      if (c[s] !== undefined) c[s]++;
    });
    return c;
  }, [orders]);

  // filtered + sorted
  const visible = useMemo(() => {
    let list = [...orders];
    if (filter !== "all") {
      list = list.filter(o => {
        const s = String(o?.orderStatus || o?.status || "pending").toLowerCase().replace(/\s/g,"_");
        return s === filter;
      });
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(o =>
        String(o?.orderNumber || "").toLowerCase().includes(q) ||
        String(o?._id || "").toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      const da = new Date(a?.createdAt || 0).getTime();
      const db = new Date(b?.createdAt || 0).getTime();
      return sort === "oldest" ? da - db : db - da;
    });
    return list;
  }, [orders, filter, search, sort]);

  const STATUS_TABS = [
    { key: "all",        label: "All"         },
    { key: "pending",    label: "Pending"      },
    { key: "confirmed",  label: "Confirmed"    },
    { key: "processing", label: "Processing"   },
    { key: "shipped",    label: "Shipped"      },
    { key: "delivered",  label: "Delivered"    },
    { key: "cancelled",  label: "Cancelled"    },
  ];

  if (loading) return (
    <div style={{ padding: "64px 20px", width: "min(100%-40px,1240px)", margin: "0 auto" }}>
      <Loading message="Loading your orders…" />
    </div>
  );

  return (
    <div style={{ background: "var(--se-bg)", minHeight: "calc(100vh - 68px)" }}>

      {/* BANNER */}
      <div style={{ background: "linear-gradient(135deg, var(--se-navy) 0%, #1E3A5F 100%)", padding: "40px 0 36px" }}>
        <div style={{ width: "min(100% - 40px, 1240px)", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--se-teal-light)", letterSpacing: ".1em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Customer Account</span>
            <h1 style={{ color: "#fff", fontSize: "clamp(1.5rem,2.5vw,2rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 6 }}>My Orders</h1>
            <p style={{ color: "#94A3B8", fontSize: 14 }}>{orders.length} total order{orders.length !== 1 ? "s" : ""}</p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button type="button" onClick={() => loadOrders(true)} disabled={refreshing}
              style={{ height: 40, padding: "0 16px", background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.15)", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", boxShadow: "none", transform: "none" }}>
              {refreshing ? "Refreshing…" : "↻ Refresh"}
            </button>
            <Link to="/products" style={{ height: 40, padding: "0 18px", background: "var(--se-teal)", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 6, boxShadow: "0 4px 12px rgba(13,148,136,.4)" }}>
              Continue Shopping →
            </Link>
          </div>
        </div>
      </div>

      <div style={{ width: "min(100% - 40px, 1240px)", margin: "0 auto", padding: "28px 0 72px" }}>

        {error && <div style={{ marginBottom: 20 }}><ErrorMessage message={error} onRetry={() => loadOrders()} /></div>}

        {/* STATUS TABS */}
        <div style={{ background: "#fff", border: "1px solid var(--se-border)", borderRadius: 14, padding: "4px 8px", display: "flex", gap: 2, flexWrap: "wrap", marginBottom: 20, boxShadow: "var(--shadow-xs)" }}>
          {STATUS_TABS.map(t => (
            <button key={t.key} type="button" onClick={() => setFilter(t.key)}
              style={{ height: 38, padding: "0 14px", borderRadius: 10, border: "none", background: filter === t.key ? "var(--se-navy)" : "transparent", color: filter === t.key ? "#fff" : "var(--se-text-3)", fontWeight: filter === t.key ? 700 : 500, fontSize: 13, cursor: "pointer", boxShadow: "none", transform: "none", transition: "all .18s", display: "flex", alignItems: "center", gap: 7 }}>
              {t.label}
              {counts[t.key] > 0 && (
                <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 6px", borderRadius: 999, background: filter === t.key ? "rgba(255,255,255,.2)" : "var(--se-border-soft)", color: filter === t.key ? "#fff" : "var(--se-text-3)" }}>
                  {counts[t.key]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* TOOLBAR */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--se-text-4)", fontSize: 15, pointerEvents: "none" }}>⌕</span>
            <input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by order number…" style={{ paddingLeft: 36, height: 42, fontSize: 14 }} />
          </div>
          <select value={sort} onChange={e => setSort(e.target.value)} style={{ height: 42, fontSize: 14, width: "auto", minWidth: 160 }}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {/* EMPTY ORDERS */}
        {orders.length === 0 && (
          <div style={{ padding: "64px 32px", textAlign: "center", background: "#fff", border: "2px dashed var(--se-border)", borderRadius: 20 }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>📦</div>
            <h3 style={{ marginBottom: 8 }}>No orders yet</h3>
            <p style={{ marginBottom: 24 }}>Your completed orders will appear here.</p>
            <Link to="/products" className="btn-primary" style={{ display: "inline-flex" }}>Start Shopping →</Link>
          </div>
        )}

        {/* NO SEARCH RESULTS */}
        {orders.length > 0 && visible.length === 0 && (
          <div style={{ padding: "48px 32px", textAlign: "center", background: "#fff", border: "1px solid var(--se-border)", borderRadius: 16 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <h3 style={{ marginBottom: 8 }}>No matching orders</h3>
            <p style={{ marginBottom: 20 }}>Try a different search term or status filter.</p>
            <button type="button" className="btn-secondary" onClick={() => { setSearch(""); setFilter("all"); }}>Clear Filters</button>
          </div>
        )}

        {/* ORDERS LIST */}
        {visible.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {visible.map((order, i) => {
              const oid    = order?._id || order?.id;
              const num    = order?.orderNumber || oid;
              const status = order?.orderStatus || order?.status || "pending";
              const payS   = order?.paymentStatus || "pending";
              const total  = Number(order?.totalAmount ?? order?.total ?? 0);
              const itemC  = Array.isArray(order?.items) ? order.items.length : 0;
              const ss     = statusStyle(status);
              const ps     = payStyle(payS);
              return (
                <div key={oid || i} style={{ background: "#fff", border: "1px solid var(--se-border)", borderRadius: 14, padding: "20px 24px", boxShadow: "var(--shadow-xs)", transition: "box-shadow .2s" }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = "var(--shadow-md)"}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = "var(--shadow-xs)"}>

                  {/* TOP ROW */}
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 14 }}>
                    <div>
                      <p style={{ fontSize: 11, fontWeight: 700, color: "var(--se-text-4)", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 4 }}>Order</p>
                      <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "var(--se-navy)" }}>#{num}</h3>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 700, background: ss.bg, color: ss.color, border: `1px solid ${ss.border}` }}>
                        {fmtLabel(status)}
                      </span>
                      <span style={{ padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 700, background: ps.bg, color: ps.color, border: `1px solid ${ps.border}` }}>
                        {fmtLabel(payS)}
                      </span>
                    </div>
                  </div>

                  {/* META ROW */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px,1fr))", gap: 12, marginBottom: 16, padding: "14px 16px", background: "var(--se-surface-2)", borderRadius: 10 }}>
                    {[
                      { label: "Date",   value: fmtDate(order?.createdAt) },
                      { label: "Items",  value: `${itemC} item${itemC !== 1 ? "s" : ""}` },
                      { label: "Total",  value: fmt(total) },
                      { label: "Method", value: fmtLabel(order?.paymentMethod || "—") },
                    ].map(m => (
                      <div key={m.label}>
                        <p style={{ fontSize: 11, fontWeight: 700, color: "var(--se-text-4)", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 3 }}>{m.label}</p>
                        <p style={{ fontSize: 14, fontWeight: 700, color: "var(--se-text-2)" }}>{m.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* ACTIONS */}
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                    {oid && (
                      <Link to={`/orders/${oid}`} className="btn-primary" style={{ height: 38, padding: "0 18px", fontSize: 13 }}>
                        View Order →
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrdersPage;
