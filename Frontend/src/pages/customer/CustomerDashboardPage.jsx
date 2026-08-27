// ============================================================
// SHANTI ENTERPRISES
// Customer Dashboard
// Frontend Phase 6 - Complete Customer UI/UX
// ============================================================

import {
  useEffect,
  useMemo,
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
// STATUS NORMALIZER
// ============================================================

const getStatusClass = (
  status
) => {
  const value = String(
    status || "Pending"
  )
    .trim()
    .toLowerCase();

  if (
    value.includes("deliver") ||
    value.includes("complete")
  ) {
    return "success";
  }

  if (
    value.includes("cancel") ||
    value.includes("reject")
  ) {
    return "danger";
  }

  if (
    value.includes("ship") ||
    value.includes("process") ||
    value.includes("confirm")
  ) {
    return "info";
  }

  return "pending";
};

// ============================================================
// EXTRACT ORDERS
// ============================================================

const extractOrders = (
  response
) => {
  if (
    Array.isArray(
      response?.orders
    )
  ) {
    return response.orders;
  }

  if (
    Array.isArray(
      response?.data?.orders
    )
  ) {
    return response.data.orders;
  }

  if (
    Array.isArray(
      response?.data
    )
  ) {
    return response.data;
  }

  if (
    Array.isArray(response)
  ) {
    return response;
  }

  return [];
};

// ============================================================
// CUSTOMER DASHBOARD
// ============================================================

function CustomerDashboardPage() {
  const {
    user,
  } = useAuth();

  const {
    totalItems = 0,
    subtotal = 0,
  } = useCart();

  // ==========================================================
  // STATE
  // ==========================================================

  const [
    orders,
    setOrders,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  // ==========================================================
  // LOAD ORDERS
  // ==========================================================

  const loadOrders = async (
    isRefresh = false
  ) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response =
        await getMyOrders();

      const orderList =
        extractOrders(
          response
        );

      setOrders(
        orderList
      );
    } catch (err) {
      console.error(
        "Dashboard orders error:",
        err
      );

      setError(
        err?.response?.data
          ?.message ||
          err?.message ||
          "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    loadOrders();
  }, []);

  // ==========================================================
  // USER DATA
  // ==========================================================

  const customerName =
    user?.name?.trim() ||
    "Customer";

  const customerEmail =
    user?.email ||
    "No email available";

  const customerPhone =
    user?.phone ||
    "No phone available";

  const customerInitial =
    customerName
      .charAt(0)
      .toUpperCase();

  // ==========================================================
  // RECENT ORDERS
  // ==========================================================

  const recentOrders =
    useMemo(
      () =>
        orders.slice(
          0,
          5
        ),
      [orders]
    );

  // ==========================================================
  // ORDER STATS
  // ==========================================================

  const deliveredOrders =
    useMemo(
      () =>
        orders.filter(
          (order) => {
            const status =
              String(
                order?.status ||
                  order?.orderStatus ||
                  ""
              ).toLowerCase();

            return (
              status.includes(
                "deliver"
              ) ||
              status.includes(
                "complete"
              )
            );
          }
        ).length,
      [orders]
    );

  const pendingOrders =
    useMemo(
      () =>
        orders.filter(
          (order) => {
            const status =
              String(
                order?.status ||
                  order?.orderStatus ||
                  "pending"
              ).toLowerCase();

            return (
              !status.includes(
                "deliver"
              ) &&
              !status.includes(
                "complete"
              ) &&
              !status.includes(
                "cancel"
              )
            );
          }
        ).length,
      [orders]
    );

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
  // PAGE
  // ==========================================================

  return (
    <section className="customer-dashboard-page">

      <div className="customer-dashboard-container">

        {/* ==================================================
            HEADER
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
              Manage your account,
              orders and shopping
              from one place.
            </p>

          </div>

          <div className="customer-dashboard-header-actions">

            <button
              type="button"
              className="customer-dashboard-refresh-button"
              onClick={() =>
                loadOrders(true)
              }
              disabled={
                refreshing
              }
            >
              {refreshing
                ? "Refreshing..."
                : "↻ Refresh"}
            </button>

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

        </div>

        {/* ==================================================
            ERROR
            ================================================== */}

        {error && (
          <div className="customer-dashboard-error">

            <ErrorMessage
              message={error}
              onRetry={() =>
                loadOrders()
              }
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
              ⏳
            </div>

            <div>

              <strong>
                {pendingOrders}
              </strong>

              <span>
                Active Orders
              </span>

            </div>

          </div>

          <div className="customer-dashboard-stat-card">

            <div className="customer-dashboard-stat-icon">
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
                {Number(
                  subtotal || 0
                ).toLocaleString(
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
              MAIN CONTENT
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
                  to="/categories"
                  className="customer-dashboard-action"
                >
                  <span>
                    🗂️
                  </span>

                  <div>
                    <strong>
                      Browse Categories
                    </strong>

                    <small>
                      Find products by category
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

                {orders.length >
                  0 && (
                  <Link
                    to="/orders"
                    className="customer-dashboard-view-all"
                  >
                    View All
                  </Link>
                )}

              </div>

              {recentOrders.length ===
              0 ? (
                <div className="customer-dashboard-empty">

                  <div className="customer-dashboard-empty-icon">
                    📦
                  </div>

                  <h3>
                    No orders yet
                  </h3>

                  <p>
                    You have not placed
                    any orders yet.
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
                    (
                      order,
                      index
                    ) => {

                      const orderId =
                        order?._id ||
                        order?.id ||
                        index;

                      const status =
                        order?.status ||
                        order?.orderStatus ||
                        "Pending";

                      const total =
                        Number(
                          order?.totalAmount ??
                            order?.total ??
                            order?.grandTotal ??
                            0
                        );

                      const statusClass =
                        getStatusClass(
                          status
                        );

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

                            {order?.createdAt && (
                              <small>
                                {new Date(
                                  order.createdAt
                                ).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )}
                              </small>
                            )}

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

                          {orderId && (
                            <Link
                              to={`/orders/${orderId}`}
                              className="customer-dashboard-order-link"
                            >
                              View
                            </Link>
                          )}

                        </article>
                      );
                    }
                  )}

                </div>
              )}

            </div>

            {/* ==================================================
                SHOPPING CTA
                ================================================== */}

            <div className="customer-dashboard-large-cta">

              <div>

                <span>
                  KEEP SHOPPING
                </span>

                <h2>
                  Find the products
                  you need.
                </h2>

                <p>
                  Explore our latest
                  products and add
                  what you need to
                  your cart.
                </p>

              </div>

              <Link
                to="/products"
                className="customer-dashboard-large-cta-button"
              >
                Explore Products
                <span>
                  →
                </span>
              </Link>

            </div>

          </div>

          {/* ==================================================
              SIDEBAR
              ================================================== */}

          <aside className="customer-dashboard-sidebar">

            {/* ==================================================
                PROFILE
                ================================================== */}

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
                  {customerInitial}
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

            {/* ==================================================
                ADDRESS
                ================================================== */}

            <div className="customer-dashboard-card customer-dashboard-address-card">

              <div className="customer-dashboard-card-header">

                <div>

                  <span>
                    DELIVERY
                  </span>

                  <h2>
                    Addresses
                  </h2>

                </div>

              </div>

              <div className="customer-dashboard-sidebar-icon">
                📍
              </div>

              <p>
                Manage your saved
                delivery addresses
                for faster checkout.
              </p>

              <Link
                to="/addresses"
                className="customer-dashboard-profile-button"
              >
                Manage Addresses
              </Link>

            </div>

            {/* ==================================================
                SHOPPING CARD
                ================================================== */}

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
                Browse our products
                and find what you need.
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