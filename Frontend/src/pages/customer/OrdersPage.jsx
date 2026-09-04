// ============================================================
// SHANTI ENTERPRISES — Orders Page
// Premium Customer Orders UI
// ============================================================

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getMyOrders } from "../../api/orderApi";
import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";
import "./OrdersPage.css";

// ============================================================
// HELPERS
// ============================================================

const fmt = (n) =>
  `₹${Number(n || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const fmtDate = (v) => {
  if (!v) return "—";

  const d = new Date(v);

  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
};

const fmtLabel = (s) =>
  String(s || "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const getStatusKey = (s) =>
  String(s || "pending")
    .toLowerCase()
    .replace(/\s/g, "_");

const statusMeta = (s) => {
  const v = getStatusKey(s);

  if (v.includes("deliver") || v.includes("complete")) {
    return {
      tone: "success",
      icon: "✓",
    };
  }

  if (v.includes("cancel")) {
    return {
      tone: "danger",
      icon: "×",
    };
  }

  if (v.includes("ship") || v.includes("transit")) {
    return {
      tone: "info",
      icon: "→",
    };
  }

  if (v.includes("confirm") || v.includes("process")) {
    return {
      tone: "success",
      icon: "•",
    };
  }

  return {
    tone: "warning",
    icon: "•",
  };
};

const paymentMeta = (s) => {
  const v = String(s || "pending").toLowerCase();

  if (v === "paid") {
    return {
      tone: "success",
      icon: "✓",
    };
  }

  if (v === "failed") {
    return {
      tone: "danger",
      icon: "×",
    };
  }

  return {
    tone: "warning",
    icon: "•",
  };
};

const extractOrders = (r) =>
  Array.isArray(r?.orders)
    ? r.orders
    : Array.isArray(r?.data?.orders)
      ? r.data.orders
      : Array.isArray(r?.data)
        ? r.data
        : Array.isArray(r)
          ? r
          : [];

// ============================================================
// STATUS TABS
// ============================================================

const STATUS_TABS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

// ============================================================
// ORDERS PAGE
// ============================================================

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("newest");

  // ==========================================================
  // LOAD ORDERS
  // ==========================================================

  const loadOrders = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await getMyOrders({
        page: 1,
        limit: 100,
      });

      setOrders(extractOrders(response));
    } catch (err) {
      console.error("Orders loading error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load your orders."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // ==========================================================
  // STATUS COUNTS
  // ==========================================================

  const counts = useMemo(() => {
    const result = {
      all: orders.length,
      pending: 0,
      confirmed: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };

    orders.forEach((order) => {
      const status = getStatusKey(
        order?.orderStatus || order?.status || "pending"
      );

      if (result[status] !== undefined) {
        result[status] += 1;
      }
    });

    return result;
  }, [orders]);

  // ==========================================================
  // FILTER + SEARCH + SORT
  // ==========================================================

  const visible = useMemo(() => {
    let list = [...orders];

    if (filter !== "all") {
      list = list.filter((order) => {
        const status = getStatusKey(
          order?.orderStatus || order?.status || "pending"
        );

        return status === filter;
      });
    }

    if (search.trim()) {
      const query = search.trim().toLowerCase();

      list = list.filter((order) => {
        return (
          String(order?.orderNumber || "")
            .toLowerCase()
            .includes(query) ||
          String(order?._id || "")
            .toLowerCase()
            .includes(query)
        );
      });
    }

    list.sort((a, b) => {
      const dateA = new Date(
        a?.createdAt || 0
      ).getTime();

      const dateB = new Date(
        b?.createdAt || 0
      ).getTime();

      return sort === "oldest"
        ? dateA - dateB
        : dateB - dateA;
    });

    return list;
  }, [orders, filter, search, sort]);

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <section className="orders-page orders-loading-page">
        <div className="orders-loading-shell">
          <div className="orders-loading-orb" />

          <span className="orders-loading-kicker">
            SHANTI ENTERPRISES
          </span>

          <h1>Loading your orders</h1>

          <p>
            Fetching your latest order history...
          </p>

          <Loading message="Please wait…" />
        </div>
      </section>
    );
  }

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <section className="orders-page">

      <div className="orders-page-glow orders-page-glow-one" />
      <div className="orders-page-glow orders-page-glow-two" />

      <div className="orders-container">

        {/* ==================================================
            HERO
            ================================================== */}

        <header className="orders-hero">

          <div className="orders-hero-copy">

            <Link
              to="/dashboard"
              className="orders-back-link"
            >
              <span className="orders-back-icon">
                ←
              </span>
              Dashboard
            </Link>

            <div className="orders-eyebrow">
              <span />
              CUSTOMER ACCOUNT
            </div>

            <h1>
              My Orders
              <span className="orders-title-accent">
                .
              </span>
            </h1>

            <p>
              Track your purchases, review order details,
              and keep your business ordering history organized.
            </p>

          </div>

          <div className="orders-hero-actions">

            <div className="orders-total-card">
              <span>Total Orders</span>
              <strong>{orders.length}</strong>
            </div>

            <button
              type="button"
              className="orders-refresh-button"
              onClick={() => loadOrders(true)}
              disabled={refreshing}
            >
              {refreshing ? (
                <>
                  <span className="orders-button-spinner" />
                  Refreshing...
                </>
              ) : (
                <>
                  <span className="orders-refresh-icon">
                    ↻
                  </span>
                  Refresh
                </>
              )}
            </button>

            <Link
              to="/products"
              className="orders-shop-button"
            >
              Continue Shopping
              <span>→</span>
            </Link>

          </div>

        </header>

        {/* ==================================================
            ERROR
            ================================================== */}

        {error && (
          <div className="orders-error-wrap">
            <ErrorMessage
              message={error}
              onRetry={() => loadOrders()}
            />
          </div>
        )}

        {/* ==================================================
            STATUS FILTER
            ================================================== */}

        <div className="orders-filter-card">

          <div className="orders-filter-heading">
            <span>ORDER STATUS</span>
            <small>
              {visible.length} shown
            </small>
          </div>

          <div className="orders-status-tabs">
            {STATUS_TABS.map((tab) => {
              const active =
                filter === tab.key;

              return (
                <button
                  key={tab.key}
                  type="button"
                  className={`orders-status-tab ${
                    active ? "active" : ""
                  }`}
                  onClick={() =>
                    setFilter(tab.key)
                  }
                >
                  <span>
                    {tab.label}
                  </span>

                  {counts[tab.key] > 0 && (
                    <b>
                      {counts[tab.key]}
                    </b>
                  )}
                </button>
              );
            })}
          </div>

        </div>

        {/* ==================================================
            TOOLBAR
            ================================================== */}

        <div className="orders-toolbar">

          <div className="orders-search">

            <span className="orders-search-icon">
              ⌕
            </span>

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search by order number..."
              aria-label="Search orders"
            />

            {search && (
              <button
                type="button"
                className="orders-clear-search"
                onClick={() =>
                  setSearch("")
                }
                aria-label="Clear search"
              >
                ×
              </button>
            )}

          </div>

          <label className="orders-sort">
            <span>Sort by</span>

            <select
              value={sort}
              onChange={(event) =>
                setSort(event.target.value)
              }
              aria-label="Sort orders"
            >
              <option value="newest">
                Newest First
              </option>
              <option value="oldest">
                Oldest First
              </option>
            </select>
          </label>

        </div>

        {/* ==================================================
            EMPTY ORDERS
            ================================================== */}

        {orders.length === 0 && (
          <div className="orders-empty">

            <div className="orders-empty-icon">
              <span>▣</span>
            </div>

            <span className="orders-empty-kicker">
              YOUR ORDER HISTORY
            </span>

            <h2>
              No orders yet
            </h2>

            <p>
              Your completed purchases will appear here.
              Start exploring our products and place your first order.
            </p>

            <Link
              to="/products"
              className="orders-empty-button"
            >
              Start Shopping
              <span>→</span>
            </Link>

          </div>
        )}

        {/* ==================================================
            NO MATCHING RESULTS
            ================================================== */}

        {orders.length > 0 &&
          visible.length === 0 && (
            <div className="orders-no-results">

              <div className="orders-no-results-icon">
                ⌕
              </div>

              <h2>
                No matching orders
              </h2>

              <p>
                Try another order number or change the
                status filter.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setFilter("all");
                }}
              >
                Clear Filters
              </button>

            </div>
          )}

        {/* ==================================================
            ORDERS LIST
            ================================================== */}

        {visible.length > 0 && (
          <div className="orders-list">

            {visible.map((order, index) => {

              const orderId =
                order?._id ||
                order?.id;

              const orderNumber =
                order?.orderNumber ||
                orderId ||
                `Order ${index + 1}`;

              const status =
                order?.orderStatus ||
                order?.status ||
                "pending";

              const paymentStatus =
                order?.paymentStatus ||
                "pending";

              const total = Number(
                order?.totalAmount ??
                  order?.total ??
                  0
              );

              const items = Array.isArray(
                order?.items
              )
                ? order.items
                : [];

              const itemCount =
                items.length;

              const statusInfo =
                statusMeta(status);

              const paymentInfo =
                paymentMeta(paymentStatus);

              return (
                <article
                  key={
                    orderId ||
                    `${orderNumber}-${index}`
                  }
                  className="order-card"
                >

                  {/* TOP */}

                  <div className="order-card-top">

                    <div className="order-number-block">

                      <span className="order-card-kicker">
                        ORDER
                      </span>

                      <h2>
                        #{orderNumber}
                      </h2>

                      <span className="order-date">
                        Placed on{" "}
                        {fmtDate(
                          order?.createdAt
                        )}
                      </span>

                    </div>

                    <div className="order-statuses">

                      <span
                        className={`order-status-pill ${statusInfo.tone}`}
                      >
                        <b>
                          {statusInfo.icon}
                        </b>
                        {fmtLabel(status)}
                      </span>

                      <span
                        className={`order-status-pill ${paymentInfo.tone}`}
                      >
                        <b>
                          {paymentInfo.icon}
                        </b>
                        {fmtLabel(
                          paymentStatus
                        )}
                      </span>

                    </div>

                  </div>

                  {/* SUMMARY */}

                  <div className="order-summary-grid">

                    <div className="order-summary-item">
                      <span>
                        ORDER DATE
                      </span>

                      <strong>
                        {fmtDate(
                          order?.createdAt
                        )}
                      </strong>
                    </div>

                    <div className="order-summary-item">
                      <span>
                        ITEMS
                      </span>

                      <strong>
                        {itemCount}{" "}
                        {itemCount === 1
                          ? "item"
                          : "items"}
                      </strong>
                    </div>

                    <div className="order-summary-item order-total-item">
                      <span>
                        ORDER TOTAL
                      </span>

                      <strong>
                        {fmt(total)}
                      </strong>
                    </div>

                    <div className="order-summary-item">
                      <span>
                        PAYMENT
                      </span>

                      <strong>
                        {fmtLabel(
                          order?.paymentMethod ||
                            "—"
                        )}
                      </strong>
                    </div>

                  </div>

                  {/* ITEM PREVIEW */}

                  {items.length > 0 && (
                    <div className="order-items-preview">

                      <div className="order-items-heading">
                        <span>
                          ITEMS IN THIS ORDER
                        </span>

                        {items.length > 3 && (
                          <small>
                            +{items.length - 3} more
                          </small>
                        )}
                      </div>

                      <div className="order-item-chips">

                        {items
                          .slice(0, 3)
                          .map((item, itemIndex) => {

                            const itemName =
                              item?.product?.name ||
                              item?.name ||
                              `Item ${itemIndex + 1}`;

                            const quantity =
                              Number(
                                item?.quantity || 0
                              );

                            return (
                              <div
                                key={
                                  item?._id ||
                                  item?.product?._id ||
                                  itemIndex
                                }
                                className="order-item-chip"
                              >
                                <span className="order-item-chip-icon">
                                  ◇
                                </span>

                                <div>
                                  <strong>
                                    {itemName}
                                  </strong>

                                  <span>
                                    Qty: {quantity}
                                  </span>
                                </div>
                              </div>
                            );
                          })}

                      </div>
                    </div>
                  )}

                  {/* BOTTOM */}

                  <div className="order-card-bottom">

                    <div className="order-business-note">
                      <span>✓</span>

                      <p>
                        Business-ready order tracking
                      </p>
                    </div>

                    {orderId && (
                      <Link
                        to={`/orders/${orderId}`}
                        className="order-view-button"
                      >
                        View Order
                        <span>→</span>
                      </Link>
                    )}

                  </div>

                </article>
              );
            })}

          </div>
        )}

        {/* ==================================================
            FOOTER NAV
            ================================================== */}

        <nav
          className="orders-footer-nav"
          aria-label="Customer account navigation"
        >
          <Link to="/profile">
            <span>Profile</span>
            <span>→</span>
          </Link>

          <Link to="/addresses">
            <span>Addresses</span>
            <span>→</span>
          </Link>

          <Link to="/quotations">
            <span>Quotations</span>
            <span>→</span>
          </Link>

          <Link to="/rfqs">
            <span>RFQs</span>
            <span>→</span>
          </Link>
        </nav>

      </div>
    </section>
  );
}

export default OrdersPage;
