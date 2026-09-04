import { useEffect, useMemo, useState } from "react";
import "./AdminAnalyticsPage.css";

import { getAdminDashboardStats } from "../../api/adminDashboardApi";
import {
  getOrderStatusReport,
  getMonthlySalesReport,
  getTopProductsReport,
} from "../../api/reportApi";

import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

const getNumber = (...values) => {
  for (const value of values) {
    if (value !== undefined && value !== null && value !== "") {
      const number = Number(value);
      if (!Number.isNaN(number)) return number;
    }
  }
  return 0;
};

const getArray = (...values) => {
  for (const value of values) {
    if (Array.isArray(value)) return value;
  }
  return [];
};

const labelize = (value) =>
  String(value || "Unknown")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

function AdminAnalyticsPage() {
  const currentYear = new Date().getFullYear();

  const [dashboard, setDashboard] = useState(null);
  const [orderStatus, setOrderStatus] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [year, setYear] = useState(currentYear);
  const [period, setPeriod] = useState(12);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadAnalytics = async ({ silent = false } = {}) => {
    try {
      silent ? setRefreshing(true) : setLoading(true);
      setError("");

      const [dashboardResponse, orderResponse, salesResponse, productsResponse] =
        await Promise.all([
          getAdminDashboardStats(),
          getOrderStatusReport(),
          getMonthlySalesReport(year),
          getTopProductsReport(10),
        ]);

      const dashboardData =
        dashboardResponse?.stats ||
        dashboardResponse?.data?.stats ||
        dashboardResponse?.data ||
        dashboardResponse ||
        {};

      setDashboard(dashboardData);
      setOrderStatus(
        orderResponse?.report ||
          orderResponse?.data?.report ||
          orderResponse?.data ||
          orderResponse ||
          []
      );
      setMonthlySales(
        salesResponse?.report ||
          salesResponse?.data?.report ||
          salesResponse?.data ||
          salesResponse ||
          []
      );
      setTopProducts(
        productsResponse?.report ||
          productsResponse?.data?.report ||
          productsResponse?.data ||
          productsResponse ||
          []
      );
    } catch (err) {
      console.error("Admin analytics error:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load analytics."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [year]);

  const metrics = useMemo(() => {
    const totalUsers = getNumber(
      dashboard?.totalUsers,
      dashboard?.users,
      dashboard?.userCount
    );
    const totalProducts = getNumber(
      dashboard?.totalProducts,
      dashboard?.products,
      dashboard?.productCount
    );
    const totalOrders = getNumber(
      dashboard?.totalOrders,
      dashboard?.orders,
      dashboard?.orderCount
    );
    const totalRevenue = getNumber(
      dashboard?.totalRevenue,
      dashboard?.revenue,
      dashboard?.sales
    );
    const pendingOrders = getNumber(dashboard?.pendingOrders);
    const deliveredOrders = getNumber(dashboard?.deliveredOrders);
    const cancelledOrders = getNumber(dashboard?.cancelledOrders);

    return {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      pendingOrders,
      deliveredOrders,
      cancelledOrders,
    };
  }, [dashboard]);

  const normalizedSales = useMemo(() => {
    const source = getArray(monthlySales);

    return source
      .map((item) => {
        const nested = item?._id || {};
        const month =
          Number(item?.month ?? nested?.month ?? item?.monthNumber ?? 0);
        const itemYear = Number(item?.year ?? nested?.year ?? year);

        return {
          year: itemYear,
          month,
          label:
            item?.label ||
            item?.monthName ||
            (month >= 1 && month <= 12 ? MONTHS[month - 1] : "—"),
          sales: getNumber(item?.sales, item?.revenue, item?.totalSales),
          orders: getNumber(item?.orders, item?.orderCount),
        };
      })
      .filter((item) => item.year === Number(year) || !item.year)
      .sort((a, b) => a.month - b.month)
      .slice(-period);
  }, [monthlySales, period, year]);

  const totalPeriodSales = useMemo(
    () => normalizedSales.reduce((sum, item) => sum + item.sales, 0),
    [normalizedSales]
  );

  const totalPeriodOrders = useMemo(
    () => normalizedSales.reduce((sum, item) => sum + item.orders, 0),
    [normalizedSales]
  );

  const averageOrderValue =
    totalPeriodOrders > 0 ? totalPeriodSales / totalPeriodOrders : 0;

  const maxSales = Math.max(
    ...normalizedSales.map((item) => item.sales),
    1
  );

  const normalizedStatuses = useMemo(
    () =>
      getArray(orderStatus).map((item) => ({
        status: item?.status || item?._id || item?.orderStatus || "unknown",
        count: getNumber(item?.count, item?.orders, item?.total),
      })),
    [orderStatus]
  );

  const maxStatusCount = Math.max(
    ...normalizedStatuses.map((item) => item.count),
    1
  );

  const normalizedProducts = useMemo(
    () =>
      getArray(topProducts)
        .map((item) => ({
          name:
            item?.name ||
            item?.productName ||
            item?.product?.name ||
            "Product",
          sold: getNumber(
            item?.totalSold,
            item?.quantity,
            item?.unitsSold,
            item?.sold
          ),
          revenue: getNumber(
            item?.revenue,
            item?.sales,
            item?.totalRevenue
          ),
        }))
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 5),
    [topProducts]
  );

  if (loading) {
    return (
      <section className="app-page admin-analytics-page">
        <div className="admin-analytics-container">
          <Loading message="Loading analytics..." />
        </div>
      </section>
    );
  }

  if (error && !dashboard) {
    return (
      <section className="app-page admin-analytics-page">
        <div className="admin-analytics-container">
          <ErrorMessage message={error} onRetry={() => loadAnalytics()} />
        </div>
      </section>
    );
  }

  return (
    <section className="app-page admin-analytics-page">
      <div className="admin-analytics-container">
        <header className="admin-analytics-header">
          <div>
            <span className="admin-analytics-eyebrow">ADMINISTRATION</span>
            <h1>Analytics</h1>
            <p>
              Track sales performance, order trends and business growth from
              one place.
            </p>
          </div>

          <div className="admin-analytics-actions">
            <label className="admin-analytics-select-wrap">
              <span>Year</span>
              <select value={year} onChange={(event) => setYear(Number(event.target.value))}>
                {Array.from({ length: 5 }, (_, index) => currentYear - index).map(
                  (itemYear) => (
                    <option key={itemYear} value={itemYear}>
                      {itemYear}
                    </option>
                  )
                )}
              </select>
            </label>

            <button
              type="button"
              className="admin-analytics-refresh"
              onClick={() => loadAnalytics({ silent: true })}
              disabled={refreshing}
            >
              {refreshing ? "Refreshing..." : "↻ Refresh"}
            </button>
          </div>
        </header>

        {error && (
          <div className="admin-analytics-alert">
            <ErrorMessage message={error} onRetry={() => loadAnalytics()} />
          </div>
        )}

        <section className="admin-analytics-kpis">
          <article className="admin-analytics-kpi kpi-revenue">
            <span className="kpi-icon">₹</span>
            <div>
              <span>Total Revenue</span>
              <strong>{formatCurrency(metrics.totalRevenue)}</strong>
              <small>All recorded sales</small>
            </div>
          </article>

          <article className="admin-analytics-kpi kpi-orders">
            <span className="kpi-icon">↗</span>
            <div>
              <span>Total Orders</span>
              <strong>{metrics.totalOrders.toLocaleString("en-IN")}</strong>
              <small>{metrics.deliveredOrders} delivered</small>
            </div>
          </article>

          <article className="admin-analytics-kpi kpi-users">
            <span className="kpi-icon">◉</span>
            <div>
              <span>Total Customers</span>
              <strong>{metrics.totalUsers.toLocaleString("en-IN")}</strong>
              <small>Registered users</small>
            </div>
          </article>

          <article className="admin-analytics-kpi kpi-products">
            <span className="kpi-icon">◆</span>
            <div>
              <span>Products</span>
              <strong>{metrics.totalProducts.toLocaleString("en-IN")}</strong>
              <small>{metrics.pendingOrders} pending orders</small>
            </div>
          </article>
        </section>

        <section className="admin-analytics-grid">
          <article className="admin-analytics-card analytics-chart-card">
            <div className="analytics-card-header">
              <div>
                <span className="analytics-card-eyebrow">SALES PERFORMANCE</span>
                <h2>Monthly Sales</h2>
              </div>

              <div className="analytics-period-tabs">
                {[6, 12].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={period === value ? "active" : ""}
                    onClick={() => setPeriod(value)}
                  >
                    {value}M
                  </button>
                ))}
              </div>
            </div>

            <div className="analytics-period-summary">
              <div>
                <span>Period Sales</span>
                <strong>{formatCurrency(totalPeriodSales)}</strong>
              </div>
              <div>
                <span>Orders</span>
                <strong>{totalPeriodOrders.toLocaleString("en-IN")}</strong>
              </div>
              <div>
                <span>Avg. Order</span>
                <strong>{formatCurrency(averageOrderValue)}</strong>
              </div>
            </div>

            <div className="analytics-bars" aria-label="Monthly sales chart">
              {normalizedSales.length === 0 ? (
                <div className="analytics-empty">No sales data available for this period.</div>
              ) : (
                normalizedSales.map((item) => (
                  <div className="analytics-bar-column" key={`${item.year}-${item.month}-${item.label}`}>
                    <div className="analytics-bar-value">
                      {formatCurrency(item.sales)}
                    </div>
                    <div className="analytics-bar-track">
                      <div
                        className="analytics-bar"
                        style={{ height: `${Math.max((item.sales / maxSales) * 100, 4)}%` }}
                        title={`${item.label}: ${formatCurrency(item.sales)}`}
                      />
                    </div>
                    <span>{item.label}</span>
                  </div>
                ))
              )}
            </div>
          </article>

          <article className="admin-analytics-card status-card">
            <div className="analytics-card-header">
              <div>
                <span className="analytics-card-eyebrow">ORDER HEALTH</span>
                <h2>Order Status</h2>
              </div>
              <span className="analytics-header-badge">{metrics.totalOrders} total</span>
            </div>

            <div className="analytics-status-list">
              {normalizedStatuses.length === 0 ? (
                <div className="analytics-empty">No order status data available.</div>
              ) : (
                normalizedStatuses.map((item) => (
                  <div className="analytics-status-row" key={item.status}>
                    <div className="analytics-status-topline">
                      <span>{labelize(item.status)}</span>
                      <strong>{item.count}</strong>
                    </div>
                    <div className="analytics-status-track">
                      <div
                        className={`analytics-status-fill status-${String(item.status).toLowerCase().replace(/[^a-z]/g, "-")}`}
                        style={{ width: `${Math.max((item.count / maxStatusCount) * 100, 3)}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </article>
        </section>

        <section className="admin-analytics-grid analytics-lower-grid">
          <article className="admin-analytics-card">
            <div className="analytics-card-header">
              <div>
                <span className="analytics-card-eyebrow">PRODUCT PERFORMANCE</span>
                <h2>Top Products</h2>
              </div>
              <span className="analytics-header-badge">Top 5</span>
            </div>

            <div className="analytics-products-list">
              {normalizedProducts.length === 0 ? (
                <div className="analytics-empty">No product sales data available.</div>
              ) : (
                normalizedProducts.map((item, index) => (
                  <div className="analytics-product-row" key={`${item.name}-${index}`}>
                    <span className="analytics-product-rank">{index + 1}</span>
                    <div className="analytics-product-main">
                      <strong>{item.name}</strong>
                      <span>{item.sold} units sold</span>
                    </div>
                    <strong className="analytics-product-revenue">
                      {formatCurrency(item.revenue)}
                    </strong>
                  </div>
                ))
              )}
            </div>
          </article>

          <article className="admin-analytics-card health-card">
            <div className="analytics-card-header">
              <div>
                <span className="analytics-card-eyebrow">BUSINESS HEALTH</span>
                <h2>Key Indicators</h2>
              </div>
            </div>

            <div className="analytics-health-list">
              <div className="analytics-health-item">
                <span className="health-icon">✓</span>
                <div>
                  <strong>Delivered Orders</strong>
                  <small>Successfully completed</small>
                </div>
                <b>{metrics.deliveredOrders}</b>
              </div>

              <div className="analytics-health-item">
                <span className="health-icon pending">◷</span>
                <div>
                  <strong>Pending Orders</strong>
                  <small>Need attention</small>
                </div>
                <b>{metrics.pendingOrders}</b>
              </div>

              <div className="analytics-health-item">
                <span className="health-icon cancelled">×</span>
                <div>
                  <strong>Cancelled Orders</strong>
                  <small>Cancelled or rejected</small>
                </div>
                <b>{metrics.cancelledOrders}</b>
              </div>
            </div>
          </article>
        </section>
      </div>
    </section>
  );
}

export default AdminAnalyticsPage;
