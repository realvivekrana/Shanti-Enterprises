// ============================================================
// SHANTI ENTERPRISES
// Customer Order History
// Frontend Phase 6 - UI/UX
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
  getMyOrders,
} from "../../api/orderApi";

import Loading from "../../components/common/Loading";

import ErrorMessage from "../../components/common/ErrorMessage";

import EmptyState from "../../components/common/EmptyState";

// ============================================================
// HELPERS
// ============================================================

const getOrderStatus = (
  order
) => {
  return (
    order.status ||
    order.orderStatus ||
    "Pending"
  );
};

const getPaymentStatus = (
  order
) => {
  return (
    order.paymentStatus ||
    "Pending"
  );
};

const getOrderTotal = (
  order
) => {
  return Number(
    order.totalAmount ??
      order.total ??
      order.grandTotal ??
      0
  );
};

const getStatusClass = (
  status
) => {
  const value =
    String(
      status
    ).toLowerCase();

  if (
    value.includes("deliver")
  ) {
    return "success";
  }

  if (
    value.includes("cancel")
  ) {
    return "danger";
  }

  if (
    value.includes("process") ||
    value.includes("ship")
  ) {
    return "info";
  }

  return "pending";
};

// ============================================================
// ORDER HISTORY
// ============================================================

function OrdersPage() {
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

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("all");

  const [
    sortOrder,
    setSortOrder,
  ] = useState("newest");

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
          "Order history error:",
          err
        );

        setError(
          err.response?.data
            ?.message ||
            err.message ||
            "Unable to load order history."
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
  // FILTER + SORT
  // ==========================================================

  const filteredOrders =
    useMemo(() => {
      let result = [
        ...orders,
      ];

      const searchValue =
        search
          .trim()
          .toLowerCase();

      // SEARCH

      if (searchValue) {
        result =
          result.filter(
            (order) => {
              const orderId =
                String(
                  order._id ||
                    order.id ||
                    ""
                ).toLowerCase();

              return orderId.includes(
                searchValue
              );
            }
          );
      }

      // STATUS

      if (
        statusFilter !==
        "all"
      ) {
        result =
          result.filter(
            (order) =>
              getOrderStatus(
                order
              ).toLowerCase() ===
              statusFilter.toLowerCase()
          );
      }

      // SORT

      result.sort(
        (a, b) => {
          const dateA =
            new Date(
              a.createdAt ||
                0
            ).getTime();

          const dateB =
            new Date(
              b.createdAt ||
                0
            ).getTime();

          if (
            sortOrder ===
            "oldest"
          ) {
            return (
              dateA - dateB
            );
          }

          return (
            dateB - dateA
          );
        }
      );

      return result;
    }, [
      orders,
      search,
      statusFilter,
      sortOrder,
    ]);

  // ==========================================================
  // STATUS COUNTS
  // ==========================================================

  const statusCounts =
    useMemo(() => {
      return {
        all:
          orders.length,

        pending:
          orders.filter(
            (order) =>
              getOrderStatus(
                order
              ).toLowerCase() ===
              "pending"
          ).length,

        processing:
          orders.filter(
            (order) =>
              getOrderStatus(
                order
              ).toLowerCase() ===
              "processing"
          ).length,

        shipped:
          orders.filter(
            (order) =>
              getOrderStatus(
                order
              ).toLowerCase() ===
              "shipped"
          ).length,

        delivered:
          orders.filter(
            (order) =>
              getOrderStatus(
                order
              ).toLowerCase() ===
              "delivered"
          ).length,

        cancelled:
          orders.filter(
            (order) =>
              getOrderStatus(
                order
              ).toLowerCase() ===
              "cancelled"
          ).length,
      };
    }, [orders]);

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <Loading
        message="Loading order history..."
      />
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (error) {
    return (
      <section className="orders-page">

        <div className="orders-container">

          <Link
            to="/dashboard"
            className="orders-back-link"
          >
            ← Dashboard
          </Link>

          <h1>
            Order History
          </h1>

          <ErrorMessage
            message={error}
            onRetry={loadOrders}
          />

        </div>

      </section>
    );
  }

  // ==========================================================
  // EMPTY
  // ==========================================================

  if (orders.length === 0) {
    return (
      <section className="orders-page">

        <div className="orders-container">

          <Link
            to="/dashboard"
            className="orders-back-link"
          >
            ← Dashboard
          </Link>

          <div className="orders-title">

            <span>
              ORDER HISTORY
            </span>

            <h1>
              My Orders
            </h1>

            <p>
              View and manage all your
              previous orders.
            </p>

          </div>

          <div className="orders-empty-card">

            <div className="orders-empty-icon">
              📦
            </div>

            <EmptyState
              title="No orders yet"
              message="You have not placed any orders yet."
            />

            <Link
              to="/products"
              className="orders-primary-button"
            >
              Start Shopping
              <span>
                →
              </span>
            </Link>

          </div>

        </div>

      </section>
    );
  }

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <section className="orders-page">

      <div className="orders-container">

        {/* ==================================================
            HEADER
            ================================================== */}

        <div className="orders-header">

          <div>

            <Link
              to="/dashboard"
              className="orders-back-link"
            >
              ← Dashboard
            </Link>

            <span className="orders-eyebrow">
              ORDER HISTORY
            </span>

            <h1>
              My Orders
            </h1>

            <p>
              View and manage all your
              previous orders.
            </p>

          </div>

          <Link
            to="/products"
            className="orders-shop-button"
          >
            Continue Shopping
            <span>
              →
            </span>
          </Link>

        </div>

        {/* ==================================================
            STATUS SUMMARY
            ================================================== */}

        <div className="orders-stats">

          <div className="orders-stat-card">

            <div className="orders-stat-icon">
              📦
            </div>

            <div>

              <strong>
                {statusCounts.all}
              </strong>

              <span>
                Total Orders
              </span>

            </div>

          </div>

          <div className="orders-stat-card">

            <div className="orders-stat-icon">
              ⏳
            </div>

            <div>

              <strong>
                {statusCounts.pending}
              </strong>

              <span>
                Pending
              </span>

            </div>

          </div>

          <div className="orders-stat-card">

            <div className="orders-stat-icon">
              ⚙️
            </div>

            <div>

              <strong>
                {statusCounts.processing}
              </strong>

              <span>
                Processing
              </span>

            </div>

          </div>

          <div className="orders-stat-card">

            <div className="orders-stat-icon">
              🚚
            </div>

            <div>

              <strong>
                {statusCounts.shipped}
              </strong>

              <span>
                Shipped
              </span>

            </div>

          </div>

          <div className="orders-stat-card">

            <div className="orders-stat-icon">
              ✓
            </div>

            <div>

              <strong>
                {statusCounts.delivered}
              </strong>

              <span>
                Delivered
              </span>

            </div>

          </div>

        </div>

        {/* ==================================================
            FILTERS
            ================================================== */}

        <div className="orders-filter-card">

          <div className="orders-filter-header">

            <div>

              <span>
                FIND YOUR ORDER
              </span>

              <h2>
                Search & Filters
              </h2>

            </div>

            <span className="orders-result-count">
              Showing{" "}
              {filteredOrders.length}{" "}
              of{" "}
              {orders.length}
            </span>

          </div>

          <div className="orders-filters">

            {/* SEARCH */}

            <div className="orders-filter-group orders-search-group">

              <label htmlFor="orderSearch">
                Search Order
              </label>

              <div className="orders-search-box">

                <span>
                  🔍
                </span>

                <input
                  id="orderSearch"
                  type="text"
                  value={
                    search
                  }
                  onChange={(
                    event
                  ) =>
                    setSearch(
                      event.target
                        .value
                    )
                  }
                  placeholder="Search by order ID"
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

            </div>

            {/* STATUS */}

            <div className="orders-filter-group">

              <label htmlFor="statusFilter">
                Status
              </label>

              <select
                id="statusFilter"
                value={
                  statusFilter
                }
                onChange={(
                  event
                ) =>
                  setStatusFilter(
                    event.target
                      .value
                  )
                }
              >

                <option value="all">
                  All Orders
                </option>

                <option value="pending">
                  Pending
                </option>

                <option value="processing">
                  Processing
                </option>

                <option value="shipped">
                  Shipped
                </option>

                <option value="delivered">
                  Delivered
                </option>

                <option value="cancelled">
                  Cancelled
                </option>

              </select>

            </div>

            {/* SORT */}

            <div className="orders-filter-group">

              <label htmlFor="sortOrder">
                Sort
              </label>

              <select
                id="sortOrder"
                value={
                  sortOrder
                }
                onChange={(
                  event
                ) =>
                  setSortOrder(
                    event.target
                      .value
                  )
                }
              >

                <option value="newest">
                  Newest First
                </option>

                <option value="oldest">
                  Oldest First
                </option>

              </select>

            </div>

          </div>

        </div>

        {/* ==================================================
            NO FILTER RESULTS
            ================================================== */}

        {filteredOrders.length ===
        0 ? (
          <div className="orders-no-results">

            <div className="orders-no-results-icon">
              🔍
            </div>

            <h3>
              No matching orders
            </h3>

            <p>
              Try changing your search
              or filter.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatusFilter(
                  "all"
                );
              }}
            >
              Clear Filters
            </button>

          </div>
        ) : (

          /* ==================================================
             ORDER LIST
             ================================================== */

          <div className="orders-list">

            {filteredOrders.map(
              (order) => {

                const orderId =
                  order._id ||
                  order.id;

                const status =
                  getOrderStatus(
                    order
                  );

                const paymentStatus =
                  getPaymentStatus(
                    order
                  );

                const total =
                  getOrderTotal(
                    order
                  );

                const items =
                  Array.isArray(
                    order.items
                  )
                    ? order.items
                    : [];

                const statusClass =
                  getStatusClass(
                    status
                  );

                return (
                  <article
                    className="order-card"
                    key={
                      orderId
                    }
                  >

                    {/* ORDER TOP */}

                    <div className="order-card-top">

                      <div className="order-card-id">

                        <div className="order-card-icon">
                          📦
                        </div>

                        <div>

                          <span>
                            ORDER
                          </span>

                          <h2>
                            #{orderId}
                          </h2>

                          {order.createdAt && (
                            <p>
                              Ordered on{" "}
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
                            </p>
                          )}

                        </div>

                      </div>

                      <span
                        className={`order-status-badge ${statusClass}`}
                      >
                        {status}
                      </span>

                    </div>

                    {/* ORDER DETAILS */}

                    <div className="order-card-details">

                      <div>

                        <span>
                          PAYMENT
                        </span>

                        <strong>
                          {paymentStatus}
                        </strong>

                      </div>

                      <div>

                        <span>
                          ITEMS
                        </span>

                        <strong>
                          {items.length}
                        </strong>

                      </div>

                      <div>

                        <span>
                          TOTAL
                        </span>

                        <strong className="order-total">
                          ₹
                          {total.toLocaleString(
                            "en-IN"
                          )}
                        </strong>

                      </div>

                    </div>

                    {/* ORDER FOOTER */}

                    <div className="order-card-footer">

                      <span>
                        {items.length ===
                        1
                          ? "1 product"
                          : `${items.length} products`}
                      </span>

                      <Link
                        to={`/orders/${orderId}`}
                        className="order-view-button"
                      >
                        View Details
                        <span>
                          →
                        </span>
                      </Link>

                    </div>

                  </article>
                );
              }
            )}

          </div>
        )}

      </div>

    </section>
  );
}

export default OrdersPage;