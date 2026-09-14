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

function StatCard({ label, value, sub, accent = "blue" }) {
  return (
    <div className={`reports-stat-card accent-${accent}`}>
      <p className="reports-stat-label">{label}</p>
      <p className="reports-stat-value">{value}</p>
      {sub && <p className="reports-stat-sub">{sub}</p>}
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
        <div className="reports-tabs">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`reports-tab-btn${activeTab === key ? " active" : ""}`}
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
            <div className="reports-stat-grid">
              <StatCard
                label="TOTAL CUSTOMERS"
                value={overview?.customers?.total ?? "—"}
                sub={`Active: ${overview?.customers?.active ?? 0} · Inactive: ${overview?.customers?.inactive ?? 0}`}
                accent="blue"
              />
              <StatCard
                label="TOTAL PRODUCTS"
                value={overview?.products?.total ?? "—"}
                sub={`Low stock: ${overview?.products?.lowStockProducts ?? 0}`}
                accent="violet"
              />
              <StatCard
                label="TOTAL ORDERS"
                value={overview?.orders?.total ?? "—"}
                sub={`Avg value: ${formatCurrency(overview?.orders?.averageOrderValue)}`}
                accent="cyan"
              />
              <StatCard
                label="TOTAL REVENUE"
                value={formatCurrency(overview?.orders?.totalRevenue)}
                accent="green"
              />
            </div>
          </div>
        )}

        {/* ====================================================
            TAB: ORDERS
            ==================================================== */}
        {activeTab === "orders" && (
          <div>
            <h2 className="reports-section-title">Orders by Status</h2>

            {orderStatus.length === 0 ? (
              <p className="reports-empty">No order data available.</p>
            ) : (
              <div className="reports-table-wrap">
                <table className="reports-table">
                  <thead>
                    <tr>
                      {["Status", "Orders", "Revenue"].map((h) => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orderStatus.map((row, idx) => (
                      <tr key={idx}>
                        <td className="cell-strong">{fmtLabel(row?._id || "Unknown")}</td>
                        <td>{row?.count ?? 0}</td>
                        <td className="cell-revenue">{formatCurrency(row?.revenue)}</td>
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
            <div className="reports-sales-header">
              <h2 className="reports-section-title reports-section-title--inline">
                Monthly Sales
              </h2>

              <select
                className="reports-year-select"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
              >
                {[currentYear - 1, currentYear, currentYear + 1].map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            {monthlySales.length === 0 ? (
              <p className="reports-empty">No sales data for {year}.</p>
            ) : (
              <div>
                {/* BAR CHART */}
                <div className="reports-bar-chart">
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
                        className="reports-bar-column"
                        title={`${month}: ${formatCurrency(revenue)}`}
                      >
                        <div
                          className={`reports-bar${revenue > 0 ? " has-value" : ""}`}
                          style={{ height: `${barHeight}px` }}
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="reports-bar-labels">
                  {MONTHS.map((m) => (
                    <div key={m} className="reports-bar-label">{m}</div>
                  ))}
                </div>

                {/* TABLE */}
                <div className="reports-table-wrap">
                  <table className="reports-table">
                    <thead>
                      <tr>
                        {["Month", "Orders", "Revenue"].map((h) => (
                          <th key={h}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {monthlySales.map((row, idx) => {
                        const monthName = MONTHS[(row?._id?.month || 1) - 1];
                        return (
                          <tr key={idx}>
                            <td className="cell-strong">{monthName}</td>
                            <td>{row?.orders ?? 0}</td>
                            <td className="cell-revenue">{formatCurrency(row?.revenue)}</td>
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
            <h2 className="reports-section-title">Top Products by Quantity Sold</h2>

            {topProducts.length === 0 ? (
              <p className="reports-empty">No product sales data available.</p>
            ) : (
              <div className="reports-table-wrap">
                <table className="reports-table">
                  <thead>
                    <tr>
                      {["#", "Product ID", "Qty Sold", "Revenue"].map((h) => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map((row, idx) => (
                      <tr key={idx}>
                        <td className="cell-rank">{idx + 1}</td>
                        <td className="cell-mono">{row?._id || "—"}</td>
                        <td className="cell-strong">{row?.quantitySold ?? 0}</td>
                        <td className="cell-revenue">{formatCurrency(row?.revenue)}</td>
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
            <h2 className="reports-section-title">
              Low Stock Products
              {lowStock.length > 0 && (
                <span className="reports-count-badge">{lowStock.length}</span>
              )}
            </h2>

            {lowStock.length === 0 ? (
              <div className="reports-allgood">
                <div className="reports-allgood-icon">✅</div>
                <h3>All products are well-stocked!</h3>
              </div>
            ) : (
              <div className="reports-table-wrap">
                <table className="reports-table reports-table--danger">
                  <thead>
                    <tr>
                      {["Product", "SKU", "Stock", "Threshold", "Price", "Status"].map((h) => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {lowStock.map((p) => {
                      const pId = p?._id || p?.id;
                      const stock = p?.stock ?? 0;
                      const threshold = p?.lowStockThreshold ?? 10;
                      const outOfStock = stock === 0;

                      return (
                        <tr key={pId}>
                          <td className="cell-strong">{p?.name || "—"}</td>
                          <td className="cell-mono cell-muted">{p?.sku || "—"}</td>
                          <td>
                            <span className={`reports-stock-value${outOfStock ? " out" : " low"}`}>
                              {stock}
                            </span>
                          </td>
                          <td className="cell-muted">{threshold}</td>
                          <td className="cell-strong">{formatCurrency(p?.price)}</td>
                          <td>
                            <span className={`reports-status-badge${outOfStock ? " out" : " low"}`}>
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