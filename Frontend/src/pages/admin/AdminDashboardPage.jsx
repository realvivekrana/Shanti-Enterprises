// ============================================================
// SHANTI ENTERPRISES
// Admin Dashboard Page
// Frontend Phase 6 - UI/UX
// ============================================================

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  getAdminDashboardStats,
} from "../../api/adminDashboardApi";

import Loading from "../../components/common/Loading";

import ErrorMessage from "../../components/common/ErrorMessage";

// ============================================================
// ADMIN DASHBOARD
// ============================================================

function AdminDashboardPage() {
  const [
    stats,
    setStats,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  // ==========================================================
  // LOAD DASHBOARD
  // ==========================================================

  const loadDashboard =
    async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getAdminDashboardStats();

        const data =
          response?.stats ||
          response?.data?.stats ||
          response?.data ||
          response;

        setStats(data);
      } catch (err) {
        console.error(
          "Admin dashboard error:",
          err
        );

        setError(
          err.response?.data
            ?.message ||
          err.message ||
          "Unable to load admin dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    loadDashboard();
  }, []);

  // ==========================================================
  // NUMBER HELPER
  // ==========================================================

  const getNumber = (
    ...values
  ) => {
    for (
      const value of values
    ) {
      if (
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        const number =
          Number(value);

        if (
          !Number.isNaN(number)
        ) {
          return number;
        }
      }
    }

    return 0;
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <Loading
        message="Loading admin dashboard..."
      />
    );
  }

  // ==========================================================
  // STATS
  // ==========================================================

  const totalUsers =
    getNumber(
      stats?.totalUsers,
      stats?.users,
      stats?.userCount
    );

  const totalProducts =
    getNumber(
      stats?.totalProducts,
      stats?.products,
      stats?.productCount
    );

  const totalOrders =
    getNumber(
      stats?.totalOrders,
      stats?.orders,
      stats?.orderCount
    );

  const totalCategories =
    getNumber(
      stats?.totalCategories,
      stats?.categories,
      stats?.categoryCount
    );

  const totalRevenue =
    getNumber(
      stats?.totalRevenue,
      stats?.revenue,
      stats?.sales
    );

  const pendingOrders =
    getNumber(
      stats?.pendingOrders
    );

  const deliveredOrders =
    getNumber(
      stats?.deliveredOrders
    );

  const cancelledOrders =
    getNumber(
      stats?.cancelledOrders
    );

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <section className="admin-dashboard-page">

      <div className="admin-dashboard-container">

        {/* ==================================================
            HEADER
            ================================================== */}

        <div className="admin-dashboard-header">

          <div>

            <span className="admin-dashboard-eyebrow">
              ADMINISTRATION
            </span>

            <h1>
              Admin Dashboard
            </h1>

            <p>
              Manage your Shanti Enterprises
              store from one place.
            </p>

          </div>

          <button
            type="button"
            className="admin-refresh-button"
            onClick={
              loadDashboard
            }
            disabled={loading}
          >
            ↻ Refresh
          </button>

        </div>

        {/* ==================================================
            ERROR
            ================================================== */}

        {error && (
          <div className="admin-dashboard-error">

            <ErrorMessage
              message={error}
              onRetry={
                loadDashboard
              }
            />

          </div>
        )}

        {/* ==================================================
            MAIN STATISTICS
            ================================================== */}

        <div className="admin-stats-grid">

          {/* USERS */}

          <article className="admin-stat-card">

            <div className="admin-stat-top">

              <div className="admin-stat-icon">
                👥
              </div>

              <span>
                USERS
              </span>

            </div>

            <strong>
              {totalUsers.toLocaleString(
                "en-IN"
              )}
            </strong>

            <p>
              Registered customers
            </p>

            <Link
              to="/admin/users"
              className="admin-stat-link"
            >
              Manage Users →
            </Link>

          </article>

          {/* PRODUCTS */}

          <article className="admin-stat-card">

            <div className="admin-stat-top">

              <div className="admin-stat-icon">
                📦
              </div>

              <span>
                PRODUCTS
              </span>

            </div>

            <strong>
              {totalProducts.toLocaleString(
                "en-IN"
              )}
            </strong>

            <p>
              Products in catalogue
            </p>

            <Link
              to="/admin/products"
              className="admin-stat-link"
            >
              Manage Products →
            </Link>

          </article>

          {/* ORDERS */}

          <article className="admin-stat-card">

            <div className="admin-stat-top">

              <div className="admin-stat-icon">
                🛒
              </div>

              <span>
                ORDERS
              </span>

            </div>

            <strong>
              {totalOrders.toLocaleString(
                "en-IN"
              )}
            </strong>

            <p>
              Total customer orders
            </p>

            <Link
              to="/admin/orders"
              className="admin-stat-link"
            >
              Manage Orders →
            </Link>

          </article>

          {/* CATEGORIES */}

          <article className="admin-stat-card">

            <div className="admin-stat-top">

              <div className="admin-stat-icon">
                🗂️
              </div>

              <span>
                CATEGORIES
              </span>

            </div>

            <strong>
              {totalCategories.toLocaleString(
                "en-IN"
              )}
            </strong>

            <p>
              Product categories
            </p>

            <Link
              to="/admin/categories"
              className="admin-stat-link"
            >
              Manage Categories →
            </Link>

          </article>

          {/* REVENUE */}

          <article className="admin-stat-card admin-revenue-card">

            <div className="admin-stat-top">

              <div className="admin-stat-icon">
                ₹
              </div>

              <span>
                REVENUE
              </span>

            </div>

            <strong>
              ₹
              {totalRevenue.toLocaleString(
                "en-IN"
              )}
            </strong>

            <p>
              Total store revenue
            </p>

            <span className="admin-stat-muted">
              Based on dashboard data
            </span>

          </article>

        </div>

        {/* ==================================================
            LOWER GRID
            ================================================== */}

        <div className="admin-dashboard-lower">

          {/* ==================================================
              ORDER OVERVIEW
              ================================================== */}

          <section className="admin-panel">

            <div className="admin-panel-header">

              <div>

                <span>
                  ORDER MANAGEMENT
                </span>

                <h2>
                  Order Overview
                </h2>

              </div>

              <Link
                to="/admin/orders"
                className="admin-panel-link"
              >
                View All →
              </Link>

            </div>

            <div className="admin-order-status-grid">

              <div className="admin-order-status">

                <div className="admin-status-icon pending">
                  ⏳
                </div>

                <div>

                  <strong>
                    {pendingOrders}
                  </strong>

                  <span>
                    Pending
                  </span>

                </div>

              </div>

              <div className="admin-order-status">

                <div className="admin-status-icon delivered">
                  ✓
                </div>

                <div>

                  <strong>
                    {deliveredOrders}
                  </strong>

                  <span>
                    Delivered
                  </span>

                </div>

              </div>

              <div className="admin-order-status">

                <div className="admin-status-icon cancelled">
                  ×
                </div>

                <div>

                  <strong>
                    {cancelledOrders}
                  </strong>

                  <span>
                    Cancelled
                  </span>

                </div>

              </div>

            </div>

          </section>

          {/* ==================================================
              QUICK ACTIONS
              ================================================== */}

          <section className="admin-panel">

            <div className="admin-panel-header">

              <div>

                <span>
                  SHORTCUTS
                </span>

                <h2>
                  Quick Actions
                </h2>

              </div>

            </div>

            <div className="admin-quick-actions">

              <Link
                to="/admin/products/new"
                className="admin-action-card"
              >
                <span>
                  ＋
                </span>

                <div>
                  <strong>
                    Add Product
                  </strong>

                  <small>
                    Create a new product
                  </small>
                </div>
              </Link>

              <Link
                to="/admin/categories/new"
                className="admin-action-card"
              >
                <span>
                  ＋
                </span>

                <div>
                  <strong>
                    Add Category
                  </strong>

                  <small>
                    Create product category
                  </small>
                </div>
              </Link>

              <Link
                to="/admin/orders"
                className="admin-action-card"
              >
                <span>
                  🛒
                </span>

                <div>
                  <strong>
                    View Orders
                  </strong>

                  <small>
                    Manage customer orders
                  </small>
                </div>
              </Link>

              <Link
                to="/admin/users"
                className="admin-action-card"
              >
                <span>
                  👤
                </span>

                <div>
                  <strong>
                    View Users
                  </strong>

                  <small>
                    Manage customers
                  </small>
                </div>
              </Link>

            </div>

          </section>

        </div>

        {/* ==================================================
            ADMIN NAVIGATION
            ================================================== */}

        <section className="admin-navigation-panel">

          <div className="admin-panel-header">

            <div>

              <span>
                STORE MANAGEMENT
              </span>

              <h2>
                Administration
              </h2>

            </div>

          </div>

          <div className="admin-navigation-grid">

            <Link
              to="/admin/products"
              className="admin-navigation-item"
            >
              <span>
                📦
              </span>

              <div>
                <strong>
                  Products
                </strong>

                <small>
                  Add, edit and manage products
                </small>
              </div>

              <b>
                →
              </b>
            </Link>

            <Link
              to="/admin/categories"
              className="admin-navigation-item"
            >
              <span>
                🗂️
              </span>

              <div>
                <strong>
                  Categories
                </strong>

                <small>
                  Organize product categories
                </small>
              </div>

              <b>
                →
              </b>
            </Link>

            <Link
              to="/admin/orders"
              className="admin-navigation-item"
            >
              <span>
                🛒
              </span>

              <div>
                <strong>
                  Orders
                </strong>

                <small>
                  Review and manage orders
                </small>
              </div>

              <b>
                →
              </b>
            </Link>

            <Link
              to="/admin/users"
              className="admin-navigation-item"
            >
              <span>
                👥
              </span>

              <div>
                <strong>
                  Users
                </strong>

                <small>
                  Manage registered users
                </small>
              </div>

              <b>
                →
              </b>
            </Link>

          </div>

        </section>

      </div>

    </section>
  );
}

export default AdminDashboardPage;