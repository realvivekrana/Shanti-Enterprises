// ============================================================
// SHANTI ENTERPRISES — Customer Dashboard
// Premium responsive customer overview
// ============================================================

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Bell,
  Box,
  CheckCircle2,
  ClipboardList,
  FileText,
  Heart,
  MapPin,
  Package,
  RefreshCw,
  ShoppingBag,
  ShoppingCart,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { getMyOrders } from "../../api/orderApi";
import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";

import "./CustomerDashboardPage.css";

// ============================================================
// HELPERS
// ============================================================

const fmt = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;

const fmtDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const extractOrders = (response) =>
  Array.isArray(response?.orders)
    ? response.orders
    : Array.isArray(response?.data?.orders)
      ? response.data.orders
      : Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
          ? response
          : [];

const getOrderStatus = (order) =>
  order?.orderStatus || order?.status || "Pending";

const normalizeStatus = (status) =>
  String(status || "pending").toLowerCase();

const isDelivered = (status) => {
  const value = normalizeStatus(status);
  return value.includes("deliver") || value.includes("complete");
};

const isCancelled = (status) => {
  const value = normalizeStatus(status);
  return value.includes("cancel") || value.includes("reject");
};

const getStatusTone = (status) => {
  const value = normalizeStatus(status);

  if (isDelivered(value)) return "success";
  if (isCancelled(value)) return "danger";
  if (value.includes("ship")) return "info";
  if (value.includes("confirm") || value.includes("process")) {
    return "progress";
  }

  return "warning";
};

const formatStatus = (status) =>
  String(status || "Pending")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

// ============================================================
// STAT CARD
// ============================================================

function StatCard({ icon, label, value, tone }) {
  return (
    <div className={`customer-dashboard-stat-card ${tone || ""}`}>
      <div className="customer-dashboard-stat-icon">
        {icon}
      </div>

      <div className="customer-dashboard-stat-content">
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

// ============================================================
// QUICK ACTION
// ============================================================

function QuickAction({ to, icon, label, desc }) {
  return (
    <Link to={to} className="customer-dashboard-action">
      <span className="customer-dashboard-action-icon">
        {icon}
      </span>

      <span className="customer-dashboard-action-copy">
        <strong>{label}</strong>
        <small>{desc}</small>
      </span>

      <ArrowRight
        className="customer-dashboard-action-arrow"
        size={16}
        aria-hidden="true"
      />
    </Link>
  );
}

// ============================================================
// CUSTOMER DASHBOARD
// ============================================================

function CustomerDashboardPage() {
  const { user } = useAuth();
  const {
    totalItems = 0,
    subtotal = 0,
  } = useCart();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadOrders = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await getMyOrders();
      setOrders(extractOrders(response));
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const name = user?.name?.trim() || "Customer";
  const email = user?.email || "—";
  const phone = user?.phone || "—";
  const initial = name.charAt(0).toUpperCase();

  const recentOrders = useMemo(
    () => orders.slice(0, 5),
    [orders]
  );

  const deliveredCount = useMemo(
    () =>
      orders.filter((order) =>
        isDelivered(getOrderStatus(order))
      ).length,
    [orders]
  );

  const activeCount = useMemo(
    () =>
      orders.filter((order) => {
        const status = getOrderStatus(order);

        return (
          !isDelivered(status) &&
          !isCancelled(status)
        );
      }).length,
    [orders]
  );

  if (loading) {
    return (
      <main className="customer-dashboard-loading">
        <Loading message="Loading dashboard…" />
      </main>
    );
  }

  return (
    <main className="customer-dashboard-page">
      {/* ======================================================
          HERO
          ====================================================== */}

      <section className="customer-dashboard-hero">
        <div className="customer-dashboard-container">
          <div className="customer-dashboard-hero-inner">
            <div className="customer-dashboard-identity">
              <div
                className="customer-dashboard-avatar customer-dashboard-avatar-hero"
                aria-hidden="true"
              >
                {initial}
              </div>

              <div className="customer-dashboard-identity-copy">
                <span className="customer-dashboard-eyebrow">
                  Customer Dashboard
                </span>

                <h1>
                  Welcome back,{" "}
                  <span>{name}</span>
                </h1>

                <p>
                  Manage your orders, account and
                  business shopping activity from one place.
                </p>
              </div>
            </div>

            <div className="customer-dashboard-hero-actions">
              <button
                type="button"
                className="customer-dashboard-refresh-button"
                onClick={() => loadOrders(true)}
                disabled={refreshing}
              >
                <RefreshCw
                  size={16}
                  className={
                    refreshing
                      ? "customer-dashboard-spin"
                      : ""
                  }
                  aria-hidden="true"
                />

                {refreshing ? "Refreshing…" : "Refresh"}
              </button>

              <Link
                to="/products"
                className="customer-dashboard-primary-button"
              >
                <ShoppingBag
                  size={16}
                  aria-hidden="true"
                />
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="customer-dashboard-container customer-dashboard-content">
        {/* ====================================================
            ERROR
            ==================================================== */}

        {error && (
          <div className="customer-dashboard-error">
            <ErrorMessage
              message={error}
              onRetry={() => loadOrders()}
            />
          </div>
        )}

        {/* ====================================================
            STATS
            ==================================================== */}

        <section
          className="customer-dashboard-stats"
          aria-label="Account summary"
        >
          <StatCard
            icon={<Package size={19} />}
            label="Total Orders"
            value={orders.length}
            tone="teal"
          />

          <StatCard
            icon={<Box size={19} />}
            label="Active Orders"
            value={activeCount}
            tone="amber"
          />

          <StatCard
            icon={<CheckCircle2 size={19} />}
            label="Delivered"
            value={deliveredCount}
            tone="green"
          />

          <StatCard
            icon={<ShoppingCart size={19} />}
            label="Cart Items"
            value={totalItems}
            tone="blue"
          />

          <StatCard
            icon="₹"
            label="Cart Value"
            value={fmt(subtotal)}
            tone="violet"
          />
        </section>

        {/* ====================================================
            MAIN GRID
            ==================================================== */}

        <div className="customer-dashboard-grid">
          {/* ==================================================
              LEFT COLUMN
              ================================================== */}

          <div className="customer-dashboard-main">
            {/* QUICK ACTIONS */}

            <section className="customer-dashboard-card">
              <div className="customer-dashboard-card-header">
                <div>
                  <span>Shortcuts</span>
                  <h2>Quick Actions</h2>
                </div>

                <ShoppingBag
                  size={19}
                  className="customer-dashboard-header-icon"
                  aria-hidden="true"
                />
              </div>

              <div className="customer-dashboard-actions">
                <QuickAction
                  to="/products"
                  icon={<ShoppingBag size={18} />}
                  label="Browse Products"
                  desc="Explore our catalogue"
                />

                <QuickAction
                  to="/categories"
                  icon={<ClipboardList size={18} />}
                  label="Categories"
                  desc="Shop by category"
                />

                <QuickAction
                  to="/cart"
                  icon={<ShoppingCart size={18} />}
                  label="My Cart"
                  desc={`${totalItems} item${
                    totalItems !== 1 ? "s" : ""
                  }`}
                />

                <QuickAction
                  to="/orders"
                  icon={<Package size={18} />}
                  label="My Orders"
                  desc="Track your orders"
                />

                <QuickAction
                  to="/rfqs"
                  icon={<FileText size={18} />}
                  label="My RFQs"
                  desc="Wholesale requests"
                />

                <QuickAction
                  to="/addresses"
                  icon={<MapPin size={18} />}
                  label="Addresses"
                  desc="Manage delivery addresses"
                />
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
                  <Link
                    to="/orders"
                    className="customer-dashboard-view-all"
                  >
                    View All
                    <ArrowRight
                      size={14}
                      aria-hidden="true"
                    />
                  </Link>
                )}
              </div>

              {recentOrders.length === 0 ? (
                <div className="customer-dashboard-empty">
                  <div className="customer-dashboard-empty-icon">
                    <Package size={24} />
                  </div>

                  <h3>No orders yet</h3>

                  <p>
                    Place your first order to see it
                    appear here.
                  </p>

                  <Link
                    to="/products"
                    className="customer-dashboard-small-button"
                  >
                    Start Shopping
                    <ArrowRight
                      size={15}
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              ) : (
                <div className="customer-dashboard-orders">
                  {recentOrders.map((order, index) => {
                    const orderId =
                      order?._id || order?.id;

                    const status =
                      getOrderStatus(order);

                    const total = Number(
                      order?.totalAmount ??
                        order?.total ??
                        0
                    );

                    const tone =
                      getStatusTone(status);

                    return (
                      <div
                        key={orderId || index}
                        className="customer-dashboard-order"
                      >
                        <div className="customer-dashboard-order-icon">
                          <Package
                            size={17}
                            aria-hidden="true"
                          />
                        </div>

                        <div className="customer-dashboard-order-info">
                          <strong>
                            #
                            {order?.orderNumber ||
                              orderId ||
                              "Order"}
                          </strong>

                          <span>
                            {fmtDate(order?.createdAt)}
                            <i>•</i>
                            {fmt(total)}
                          </span>
                        </div>

                        <span
                          className={`customer-dashboard-order-status ${tone}`}
                        >
                          {formatStatus(status)}
                        </span>

                        {orderId && (
                          <Link
                            to={`/orders/${orderId}`}
                            className="customer-dashboard-order-link"
                          >
                            View
                            <ArrowRight
                              size={13}
                              aria-hidden="true"
                            />
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* SHOPPING CTA */}

            <section className="customer-dashboard-cta">
              <div className="customer-dashboard-cta-glow" />

              <div className="customer-dashboard-cta-content">
                <span>Keep Shopping</span>

                <h2>
                  Find the products your
                  business needs.
                </h2>

                <p>
                  Browse quality products and place
                  your next business order with ease.
                </p>
              </div>

              <Link
                to="/products"
                className="customer-dashboard-cta-button"
              >
                Explore Products
                <ArrowRight
                  size={16}
                  aria-hidden="true"
                />
              </Link>
            </section>
          </div>

          {/* ==================================================
              RIGHT SIDEBAR
              ================================================== */}

          <aside className="customer-dashboard-sidebar">
            {/* PROFILE */}

            <section className="customer-dashboard-card customer-dashboard-profile-card">
              <div className="customer-dashboard-profile">
                <div
                  className="customer-dashboard-avatar"
                  aria-hidden="true"
                >
                  {initial}
                </div>

                <h3>{name}</h3>

                <p>{email}</p>

                {phone !== "—" && (
                  <p>{phone}</p>
                )}
              </div>

              <Link
                to="/profile"
                className="customer-dashboard-profile-button"
              >
                <UserRound
                  size={15}
                  aria-hidden="true"
                />
                Edit Profile
                <ArrowRight
                  size={14}
                  aria-hidden="true"
                />
              </Link>
            </section>

            {/* ACCOUNT */}

            <section className="customer-dashboard-card customer-dashboard-account-card">
              <div className="customer-dashboard-card-header">
                <div>
                  <span>Account</span>
                  <h2>Manage</h2>
                </div>

                <UserRound
                  size={18}
                  className="customer-dashboard-header-icon"
                  aria-hidden="true"
                />
              </div>

              <nav className="customer-dashboard-account-links">
                {[
                  {
                    to: "/orders",
                    icon: <Package size={16} />,
                    label: "My Orders",
                  },
                  {
                    to: "/addresses",
                    icon: <MapPin size={16} />,
                    label: "Saved Addresses",
                  },
                  {
                    to: "/quotations",
                    icon: <FileText size={16} />,
                    label: "My Quotations",
                  },
                  {
                    to: "/rfqs",
                    icon: <ClipboardList size={16} />,
                    label: "My RFQs",
                  },
                  {
                    to: "/wishlist",
                    icon: <Heart size={16} />,
                    label: "Wishlist",
                  },
                  {
                    to: "/notifications",
                    icon: <Bell size={16} />,
                    label: "Notifications",
                  },
                  {
                    to: "/returns",
                    icon: <RefreshCw size={16} />,
                    label: "Returns",
                  },
                  {
                    to: "/invoices",
                    icon: <FileText size={16} />,
                    label: "Invoices",
                  },
                ].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="customer-dashboard-account-link"
                  >
                    <span className="customer-dashboard-account-link-icon">
                      {item.icon}
                    </span>

                    <span>{item.label}</span>

                    <ArrowRight
                      size={14}
                      aria-hidden="true"
                    />
                  </Link>
                ))}
              </nav>
            </section>

            {/* MINI SHOPPING CARD */}

            <section className="customer-dashboard-shopping-card">
              <div className="customer-dashboard-shopping-icon">
                <ShoppingCart
                  size={21}
                  aria-hidden="true"
                />
              </div>

              <span>Your Cart</span>

              <h3>
                {totalItems > 0
                  ? `${totalItems} item${
                      totalItems !== 1 ? "s" : ""
                    } ready`
                  : "Your cart is waiting"}
              </h3>

              <p>
                {totalItems > 0
                  ? `${fmt(
                      subtotal
                    )} current cart value.`
                  : "Add products to build your next order."}
              </p>

              <Link
                to="/cart"
                className="customer-dashboard-shopping-button"
              >
                {totalItems > 0
                  ? "Review Cart"
                  : "Start Shopping"}

                <ArrowRight
                  size={15}
                  aria-hidden="true"
                />
              </Link>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default CustomerDashboardPage;
