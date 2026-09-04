// ============================================================
// SHANTI ENTERPRISES
// Admin Reports Page
// Frontend - Admin Reports & Analytics
// ============================================================

import {
  useEffect,
  useState,
} from "react";

import "./AdminReportsPage.css";

import {
  getAdminOverviewReport,
  getOrderStatusReport,
  getMonthlySalesReport,
  getTopProductsReport,
  getLowStockReport,
} from "../../api/reportApi";

import Loading from "../../components/common/Loading";

import ErrorMessage from "../../components/common/ErrorMessage";

// ============================================================
// HELPERS
// ============================================================

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const fmtLabel = (s) =>
  String(s || "").replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

// ============================================================
// STAT CARD
// ============================================================

function StatCard({ label, value, sub, color = "#2563eb" }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        padding: "20px 24px",
        borderLeft: `4px solid ${color}`,
      }}
    >
      <p style={{ margin: "0 0 6px", fontSize: "12px", fontWeight: 700, color: "#6b7280", letterSpacing: "0.06em" }}>
        {label}
      </p>
      <p style={{ margin: 0, fontSize: "24px", fontWeight: 800, color: "#111827" }}>{value}</p>
      {sub && (
        <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#6b7280" }}>{sub}</p>
      )}
    </div>
  );
}

// ============================================================
// ADMIN REPORTS PAGE
// ============================================================

function AdminReportsPage() {
  const currentYear = new Date().getFullYear();

  const [overview, setOverview]       = useState(null);
  const [orderStatus, setOrderStatus] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [lowStock, setLowStock]       = useState([]);
  const [year, setYear]               = useState(currentYear);

  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  // ==========================================================
  // LOAD ALL REPORTS
  // ==========================================================

  const loadAll = async (selectedYear = year) => {
    try {
      setLoading(true);
      setError("");

      const [ov, os, ms, tp, ls] = await Promise.all([
        getAdminOverviewReport(),
        getOrderStatusReport(),
        getMonthlySalesReport(selectedYear),
        getTopProductsReport(10),
        getLowStockReport(),
      ]);

      setOverview(ov?.report || ov);
      setOrderStatus(os?.report || []);
      setMonthlySales(ms?.report || []);
      setTopProducts(tp?.report || []);
      setLowStock(ls?.products || []);
    } catch (err) {
      setError(err.message || "Unable to load reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(year); }, [year]);

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <section className="app-page admin-reports-page">
        <div className="page-container admin-reports-container">
          <Loading message="Loading reports..." />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="app-page admin-reports-page">
        <div className="page-container admin-reports-container">
          <ErrorMessage message={error} onRetry={() => loadAll(year)} />
        </div>
      </section>
    );
  }

  const TABS = [
    { key: "overview",  label: "Overview" },
    { key: "orders",    label: "Orders" },
    { key: "sales",     label: "Monthly Sales" },
    { key: "products",  label: "Top Products" },
    { key: "lowstock",  label: "Low Stock" },
  ];

  // monthly sales bar chart max
  const maxRevenue = Math.max(
    ...monthlySales.map((m) => m?.revenue || 0),
    1
  );

  return (
    <section className="app-page admin-reports-page">
      <div className="page-container admin-reports-container">

        {/* HEADER */}
        <div className="page-header">
          <div>
            <span className="page-eyebrow">ADMIN</span>
            <h1>Reports</h1>
            <p>Business overview and analytics</p>
          </div>

          <button
            type="button"
            className="btn-secondary"
            onClick={() => loadAll(year)}
          >
            ↻ Refresh
          </button>
        </div>

        {/* TABS */}
        <div
          style={{
            display: "flex",
            gap: "4px",
            marginBottom: "28px",
            borderBottom: "1px solid #e5e7eb",
            flexWrap: "wrap",
          }}
        >
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              style={{
                padding: "10px 18px",
                fontSize: "14px",
                fontWeight: activeTab === key ? 700 : 500,
                color: activeTab === key ? "#2563eb" : "#6b7280",
                background: "none",
                border: "none",
                borderBottom: activeTab === key ? "3px solid #2563eb" : "3px solid transparent",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ====================================================
            TAB: OVERVIEW
            ==================================================== */}
        {activeTab === "overview" && overview && (
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "16px",
                marginBottom: "24px",
              }}
            >
              <StatCard
                label="TOTAL CUSTOMERS"
                value={overview?.customers?.total ?? "—"}
                sub={`Active: ${overview?.customers?.active ?? 0} · Inactive: ${overview?.customers?.inactive ?? 0}`}
                color="#2563eb"
              />
              <StatCard
                label="TOTAL PRODUCTS"
                value={overview?.products?.total ?? "—"}
                sub={`Low stock: ${overview?.products?.lowStockProducts ?? 0}`}
                color="#7c3aed"
              />
              <StatCard
                label="TOTAL ORDERS"
                value={overview?.orders?.total ?? "—"}
                sub={`Avg value: ${formatCurrency(overview?.orders?.averageOrderValue)}`}
                color="#0891b2"
              />
              <StatCard
                label="TOTAL REVENUE"
                value={formatCurrency(overview?.orders?.totalRevenue)}
                color="#059669"
              />
            </div>
          </div>
        )}

        {/* ====================================================
            TAB: ORDERS
            ==================================================== */}
        {activeTab === "orders" && (
          <div>
            <h2 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 700 }}>
              Orders by Status
            </h2>

            {orderStatus.length === 0 ? (
              <p style={{ color: "#6b7280" }}>No order data available.</p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "14px",
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    overflow: "hidden",
                  }}
                >
                  <thead>
                    <tr style={{ background: "#f9fafb" }}>
                      {["Status", "Orders", "Revenue"].map((h) => (
                        <th
                          key={h}
                          style={{
                            padding: "12px 20px",
                            fontSize: "12px",
                            fontWeight: 700,
                            color: "#6b7280",
                            letterSpacing: "0.06em",
                            borderBottom: "1px solid #e5e7eb",
                            textAlign: "left",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orderStatus.map((row, idx) => (
                      <tr key={idx} style={{ borderBottom: "1px solid #f3f4f6" }}>
                        <td style={{ padding: "12px 20px", fontWeight: 600 }}>
                          {fmtLabel(row?._id || "Unknown")}
                        </td>
                        <td style={{ padding: "12px 20px" }}>{row?.count ?? 0}</td>
                        <td style={{ padding: "12px 20px", fontWeight: 600, color: "#059669" }}>
                          {formatCurrency(row?.revenue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ====================================================
            TAB: MONTHLY SALES
            ==================================================== */}
        {activeTab === "sales" && (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginBottom: "24px",
                flexWrap: "wrap",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 700 }}>
                Monthly Sales
              </h2>

              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                style={{
                  padding: "8px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
              >
                {[currentYear - 1, currentYear, currentYear + 1].map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            {monthlySales.length === 0 ? (
              <p style={{ color: "#6b7280" }}>No sales data for {year}.</p>
            ) : (
              <div>
                {/* BAR CHART */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: "8px",
                    height: "160px",
                    marginBottom: "8px",
                    padding: "0 4px",
                  }}
                >
                  {MONTHS.map((month, idx) => {
                    const monthNum = idx + 1;
                    const row = monthlySales.find(
                      (m) => m?._id?.month === monthNum
                    );
                    const revenue = row?.revenue || 0;
                    const barHeight = Math.round((revenue / maxRevenue) * 140);

                    return (
                      <div
                        key={month}
                        style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}
                        title={`${month}: ${formatCurrency(revenue)}`}
                      >
                        <div
                          style={{
                            width: "100%",
                            height: `${barHeight}px`,
                            background: revenue > 0 ? "#2563eb" : "#e5e7eb",
                            borderRadius: "4px 4px 0 0",
                            minHeight: "4px",
                          }}
                        />
                      </div>
                    );
                  })}
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    padding: "0 4px",
                    marginBottom: "20px",
                  }}
                >
                  {MONTHS.map((m) => (
                    <div
                      key={m}
                      style={{
                        flex: 1,
                        textAlign: "center",
                        fontSize: "10px",
                        color: "#9ca3af",
                      }}
                    >
                      {m}
                    </div>
                  ))}
                </div>

                {/* TABLE */}
                <div style={{ overflowX: "auto" }}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      fontSize: "14px",
                      background: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "12px",
                      overflow: "hidden",
                    }}
                  >
                    <thead>
                      <tr style={{ background: "#f9fafb" }}>
                        {["Month", "Orders", "Revenue"].map((h) => (
                          <th
                            key={h}
                            style={{
                              padding: "12px 20px",
                              fontSize: "12px",
                              fontWeight: 700,
                              color: "#6b7280",
                              letterSpacing: "0.06em",
                              borderBottom: "1px solid #e5e7eb",
                              textAlign: "left",
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {monthlySales.map((row, idx) => {
                        const monthName = MONTHS[(row?._id?.month || 1) - 1];
                        return (
                          <tr key={idx} style={{ borderBottom: "1px solid #f3f4f6" }}>
                            <td style={{ padding: "12px 20px", fontWeight: 600 }}>{monthName}</td>
                            <td style={{ padding: "12px 20px" }}>{row?.orders ?? 0}</td>
                            <td style={{ padding: "12px 20px", fontWeight: 600, color: "#059669" }}>
                              {formatCurrency(row?.revenue)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ====================================================
            TAB: TOP PRODUCTS
            ==================================================== */}
        {activeTab === "products" && (
          <div>
            <h2 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 700 }}>
              Top Products by Quantity Sold
            </h2>

            {topProducts.length === 0 ? (
              <p style={{ color: "#6b7280" }}>No product sales data available.</p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "14px",
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    overflow: "hidden",
                  }}
                >
                  <thead>
                    <tr style={{ background: "#f9fafb" }}>
                      {["#", "Product ID", "Qty Sold", "Revenue"].map((h) => (
                        <th
                          key={h}
                          style={{
                            padding: "12px 20px",
                            fontSize: "12px",
                            fontWeight: 700,
                            color: "#6b7280",
                            letterSpacing: "0.06em",
                            borderBottom: "1px solid #e5e7eb",
                            textAlign: "left",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map((row, idx) => (
                      <tr key={idx} style={{ borderBottom: "1px solid #f3f4f6" }}>
                        <td style={{ padding: "12px 20px", color: "#6b7280", fontWeight: 700 }}>
                          {idx + 1}
                        </td>
                        <td style={{ padding: "12px 20px", fontFamily: "monospace", fontSize: "13px" }}>
                          {row?._id || "—"}
                        </td>
                        <td style={{ padding: "12px 20px", fontWeight: 700 }}>
                          {row?.quantitySold ?? 0}
                        </td>
                        <td style={{ padding: "12px 20px", fontWeight: 600, color: "#059669" }}>
                          {formatCurrency(row?.revenue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ====================================================
            TAB: LOW STOCK
            ==================================================== */}
        {activeTab === "lowstock" && (
          <div>
            <h2 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 700 }}>
              Low Stock Products
              {lowStock.length > 0 && (
                <span
                  style={{
                    marginLeft: "10px",
                    background: "#fef2f2",
                    color: "#dc2626",
                    border: "1px solid #fecaca",
                    borderRadius: "999px",
                    padding: "2px 10px",
                    fontSize: "13px",
                    fontWeight: 700,
                  }}
                >
                  {lowStock.length}
                </span>
              )}
            </h2>

            {lowStock.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px",
                  background: "#f0fdf4",
                  borderRadius: "12px",
                  color: "#15803d",
                }}
              >
                <div style={{ fontSize: "40px", marginBottom: "12px" }}>✅</div>
                <h3 style={{ margin: 0, fontWeight: 700 }}>All products are well-stocked!</h3>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "14px",
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    overflow: "hidden",
                  }}
                >
                  <thead>
                    <tr style={{ background: "#fef2f2" }}>
                      {["Product", "SKU", "Stock", "Threshold", "Price", "Status"].map(
                        (h) => (
                          <th
                            key={h}
                            style={{
                              padding: "12px 16px",
                              fontSize: "12px",
                              fontWeight: 700,
                              color: "#dc2626",
                              letterSpacing: "0.06em",
                              borderBottom: "1px solid #fecaca",
                              textAlign: "left",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {lowStock.map((p) => {
                      const pId = p?._id || p?.id;
                      const stock = p?.stock ?? 0;
                      const threshold = p?.lowStockThreshold ?? 10;
                      const outOfStock = stock === 0;

                      return (
                        <tr key={pId} style={{ borderBottom: "1px solid #f3f4f6" }}>
                          <td style={{ padding: "12px 16px", fontWeight: 600 }}>
                            {p?.name || "—"}
                          </td>
                          <td style={{ padding: "12px 16px", fontFamily: "monospace", color: "#6b7280" }}>
                            {p?.sku || "—"}
                          </td>
                          <td style={{ padding: "12px 16px" }}>
                            <span
                              style={{
                                fontWeight: 800,
                                fontSize: "16px",
                                color: outOfStock ? "#dc2626" : "#d97706",
                              }}
                            >
                              {stock}
                            </span>
                          </td>
                          <td style={{ padding: "12px 16px", color: "#6b7280" }}>{threshold}</td>
                          <td style={{ padding: "12px 16px", fontWeight: 600 }}>
                            {formatCurrency(p?.price)}
                          </td>
                          <td style={{ padding: "12px 16px" }}>
                            <span
                              style={{
                                background: outOfStock ? "#fef2f2" : "#fefce8",
                                color: outOfStock ? "#dc2626" : "#a16207",
                                border: `1px solid ${outOfStock ? "#fecaca" : "#fef08a"}`,
                                borderRadius: "999px",
                                padding: "3px 10px",
                                fontSize: "12px",
                                fontWeight: 600,
                              }}
                            >
                              {outOfStock ? "Out of Stock" : "Low"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
}

export default AdminReportsPage;
