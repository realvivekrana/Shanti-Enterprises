// ============================================================
// SHANTI ENTERPRISES
// Customer Dashboard
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
  useAuth,
} from "../../context/AuthContext";

import {
  useCart,
} from "../../context/CartContext";

import {
  getMyOrders,
} from "../../api/orderApi";

import Loading from "../../components/common/Loading";

import ErrorMessage from "../../components/common/ErrorMessage";

// ============================================================
// CUSTOMER DASHBOARD
// ============================================================

function CustomerDashboardPage() {
  const {
    user,
  } = useAuth();

  const {
    totalItems,
    subtotal,
  } = useCart();

  const [
    orders,
    setOrders,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  // ==========================================================
  // LOAD ORDERS
  // ==========================================================

  const loadOrders =
    async () => {
      try {
        setLoading(true);

        setError("");

        const response =
          await getMyOrders();

        const orderList =
          response?.orders ||
          response?.data?.orders ||
          response?.data ||
          [];

        setOrders(
          Array.isArray(
            orderList
          )
            ? orderList
            : []
        );
      } catch (err) {
        console.error(
          "Dashboard orders error:",
          err
        );

        setError(
          err.response?.data
            ?.message ||
            err.message ||
            "Unable to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    loadOrders();
  }, []);

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <Loading
        message="Loading dashboard..."
      />
    );
  }

  // ==========================================================
  // USER DATA
  // ==========================================================

  const customerName =
    user?.name ||
    "Customer";

  const customerEmail =
    user?.email ||
    "No email available";

  const customerPhone =
    user?.phone ||
    "No phone available";

  // ==========================================================
  // RECENT ORDERS
  // ==========================================================

  const recentOrders =
    orders.slice(
      0,
      5
    );

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <section className="customer-dashboard-page">

      <div className="customer-dashboard-container">

        {/* ==================================================
            WELCOME HEADER
            ================================================== */}

        <div className="customer-dashboard-header">

          <div>

            <span className="customer-dashboard-eyebrow">
              CUSTOMER DASHBOARD
            </span>

            <h1>
              Welcome back,{" "}
              {customerName}
            </h1>

            <p>
              Manage your account, orders
              and shopping from one place.
            </p>

          </div>

          <Link
            to="/products"
            className="customer-dashboard-shop-button"
          >
            Browse Products
            <span>
              →
            </span>
          </Link>

        </div>

        {/* ==================================================
            ERROR
            ================================================== */}

        {error && (
          <div className="customer-dashboard-error">

            <ErrorMessage
              message={error}
              onRetry={loadOrders}
            />

          </div>
        )}

        {/* ==================================================
            STATS
            ================================================== */}

        <div className="customer-dashboard-stats">

          <div className="customer-dashboard-stat-card">

            <div className="customer-dashboard-stat-icon">
              📦
            </div>

            <div>

              <strong>
                {orders.length}
              </strong>

              <span>
                Total Orders
              </span>

            </div>

          </div>

          <div className="customer-dashboard-stat-card">

            <div className="customer-dashboard-stat-icon">
              🛒
            </div>

            <div>

              <strong>
                {totalItems}
              </strong>

              <span>
                Cart Items
              </span>

            </div>

          </div>

          <div className="customer-dashboard-stat-card">

            <div className="customer-dashboard-stat-icon">
              ₹
            </div>

            <div>

              <strong>
                ₹
                {subtotal.toLocaleString(
                  "en-IN"
                )}
              </strong>

              <span>
                Cart Value
              </span>

            </div>

          </div>

        </div>

        {/* ==================================================
            MAIN GRID
            ================================================== */}

        <div className="customer-dashboard-grid">

          {/* ==================================================
              LEFT
              ================================================== */}

          <div className="customer-dashboard-main">

            {/* ==================================================
                QUICK ACTIONS
                ================================================== */}

            <div className="customer-dashboard-card">

              <div className="customer-dashboard-card-header">

                <div>

                  <span>
                    SHORTCUTS
                  </span>

                  <h2>
                    Quick Actions
                  </h2>

                </div>

              </div>

              <div className="customer-dashboard-actions">

                <Link
                  to="/products"
                  className="customer-dashboard-action"
                >

                  <span>
                    🛍️
                  </span>

                  <div>

                    <strong>
                      Browse Products
                    </strong>

                    <small>
                      Explore our products
                    </small>

                  </div>

                  <b>
                    →
                  </b>

                </Link>

                <Link
                  to="/cart"
                  className="customer-dashboard-action"
                >

                  <span>
                    🛒
                  </span>

                  <div>

                    <strong>
                      View Cart
                    </strong>

                    <small>
                      Review your cart
                    </small>

                  </div>

                  <b>
                    →
                  </b>

                </Link>

                <Link
                  to="/orders"
                  className="customer-dashboard-action"
                >

                  <span>
                    📦
                  </span>

                  <div>

                    <strong>
                      My Orders
                    </strong>

                    <small>
                      Track your orders
                    </small>

                  </div>

                  <b>
                    →
                  </b>

                </Link>

                <Link
                  to="/profile"
                  className="customer-dashboard-action"
                >

                  <span>
                    👤
                  </span>

                  <div>

                    <strong>
                      My Profile
                    </strong>

                    <small>
                      Manage your profile
                    </small>

                  </div>

                  <b>
                    →
                  </b>

                </Link>

                <Link
                  to="/addresses"
                  className="customer-dashboard-action"
                >

                  <span>
                    📍
                  </span>

                  <div>

                    <strong>
                      Saved Addresses
                    </strong>

                    <small>
                      Manage delivery addresses
                    </small>

                  </div>

                  <b>
                    →
                  </b>

                </Link>

              </div>

            </div>

            {/* ==================================================
                RECENT ORDERS
                ================================================== */}

            <div className="customer-dashboard-card">

              <div className="customer-dashboard-card-header">

                <div>

                  <span>
                    ORDER HISTORY
                  </span>

                  <h2>
                    Recent Orders
                  </h2>

                </div>

                {orders.length > 0 && (
                  <Link
                    to="/orders"
                    className="customer-dashboard-view-all"
                  >
                    View All
                  </Link>
                )}

              </div>

              {recentOrders.length === 0 ? (
                <div className="customer-dashboard-empty">

                  <div className="customer-dashboard-empty-icon">
                    📦
                  </div>

                  <h3>
                    No orders yet
                  </h3>

                  <p>
                    You have not placed any
                    orders yet.
                  </p>

                  <Link
                    to="/products"
                    className="customer-dashboard-small-button"
                  >
                    Start Shopping
                  </Link>

                </div>
              ) : (
                <div className="customer-dashboard-orders">

                  {recentOrders.map(
                    (order) => {

                      const orderId =
                        order._id ||
                        order.id;

                      const status =
                        order.status ||
                        order.orderStatus ||
                        "Pending";

                      const total =
                        Number(
                          order.totalAmount ??
                            order.total ??
                            order.grandTotal ??
                            0
                        );

                      const normalizedStatus =
                        String(
                          status
                        ).toLowerCase();

                      let statusClass =
                        "pending";

                      if (
                        normalizedStatus.includes(
                          "deliver"
                        )
                      ) {
                        statusClass =
                          "success";
                      } else if (
                        normalizedStatus.includes(
                          "cancel"
                        )
                      ) {
                        statusClass =
                          "danger";
                      } else if (
                        normalizedStatus.includes(
                          "process"
                        ) ||
                        normalizedStatus.includes(
                          "ship"
                        )
                      ) {
                        statusClass =
                          "info";
                      }

                      return (
                        <article
                          className="customer-dashboard-order"
                          key={
                            orderId
                          }
                        >

                          <div className="customer-dashboard-order-icon">
                            📦
                          </div>

                          <div className="customer-dashboard-order-info">

                            <strong>
                              Order #
                              {orderId}
                            </strong>

                            <span>
                              Total: ₹
                              {total.toLocaleString(
                                "en-IN"
                              )}
                            </span>

                          </div>

                          <span
                            className={`customer-dashboard-order-status ${statusClass}`}
                          >
                            {status}
                          </span>

                          <Link
                            to={`/orders/${orderId}`}
                            className="customer-dashboard-order-link"
                          >
                            View
                          </Link>

                        </article>
                      );
                    }
                  )}

                </div>
              )}

            </div>

          </div>

          {/* ==================================================
              RIGHT SIDEBAR
              ================================================== */}

          <aside className="customer-dashboard-sidebar">

            {/* ACCOUNT */}

            <div className="customer-dashboard-card">

              <div className="customer-dashboard-card-header">

                <div>

                  <span>
                    ACCOUNT
                  </span>

                  <h2>
                    My Profile
                  </h2>

                </div>

              </div>

              <div className="customer-dashboard-profile">

                <div className="customer-dashboard-avatar">
                  {customerName
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <strong>
                  {customerName}
                </strong>

                <p>
                  {customerEmail}
                </p>

              </div>

              <div className="customer-dashboard-account-details">

                <div>

                  <span>
                    Email
                  </span>

                  <strong>
                    {customerEmail}
                  </strong>

                </div>

                <div>

                  <span>
                    Phone
                  </span>

                  <strong>
                    {customerPhone}
                  </strong>

                </div>

              </div>

              <Link
                to="/profile"
                className="customer-dashboard-profile-button"
              >
                Manage Profile
              </Link>

            </div>

            {/* SHOPPING CARD */}

            <div className="customer-dashboard-shopping-card">

              <div className="customer-dashboard-shopping-icon">
                🛒
              </div>

              <span>
                READY TO SHOP?
              </span>

              <h3>
                Discover something
                new.
              </h3>

              <p>
                Browse our products and
                find what you need.
              </p>

              <Link
                to="/products"
                className="customer-dashboard-shopping-button"
              >
                Shop Now
                <span>
                  →
                </span>
              </Link>

            </div>

          </aside>

        </div>

      </div>

    </section>
  );
}

export default CustomerDashboardPage;