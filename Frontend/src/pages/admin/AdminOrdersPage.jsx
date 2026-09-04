// ============================================================
// SHANTI ENTERPRISES
// Admin Orders Page
// Premium UI/UX — Business Order Management
// ============================================================

import { useEffect, useMemo, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import {
  getAdminOrders,
  updateOrderStatus,
} from "../../api/adminOrderApi";

import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";

import "./AdminOrdersPage.css";

// ============================================================
// STATUS OPTIONS
// ============================================================

const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

// ============================================================
// HELPERS
// ============================================================

const getOrderId = (order) =>
  order?._id || order?.id || order?.orderId;

const getStatus = (order) =>
  (
    order?.status ||
    order?.orderStatus ||
    "pending"
  )
    .toString()
    .toLowerCase();

const getCustomerName = (order) => {
  if (typeof order?.user === "object" && order.user) {
    return (
      order.user.name ||
      order.user.fullName ||
      order.user.email ||
      "Customer"
    );
  }

  if (
    typeof order?.customer === "object" &&
    order.customer
  ) {
    return (
      order.customer.name ||
      order.customer.fullName ||
      order.customer.email ||
      "Customer"
    );
  }

  return (
    order?.customerName ||
    order?.userName ||
    order?.email ||
    "Customer"
  );
};

const getCustomerEmail = (order) => {
  if (typeof order?.user === "object" && order.user) {
    return order.user.email || "";
  }

  if (
    typeof order?.customer === "object" &&
    order.customer
  ) {
    return order.customer.email || "";
  }

  return order?.email || "";
};

const getTotal = (order) =>
  Number(
    order?.totalAmount ??
      order?.totalPrice ??
      order?.grandTotal ??
      order?.total ??
      0
  );

const getDate = (order) => {
  const value =
    order?.createdAt ||
    order?.created_at ||
    order?.date;

  if (!value) {
    return "N/A";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getItemCount = (order) => {
  const items =
    order?.items ||
    order?.orderItems ||
    order?.products ||
    [];

  if (!Array.isArray(items)) {
    return 0;
  }

  return items.reduce(
    (total, item) =>
      total +
      Number(
        item?.quantity ??
          item?.qty ??
          1
      ),
    0
  );
};

const formatStatus = (status) =>
  status.charAt(0).toUpperCase() +
  status.slice(1);

// ============================================================
// ADMIN ORDERS PAGE
// ============================================================

function AdminOrdersPage() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("all");

  // ==========================================================
  // LOAD ORDERS
  // ==========================================================

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminOrders({
        limit: 100,
      });

      let orderData = [];

      if (Array.isArray(response)) {
        orderData = response;
      } else if (
        Array.isArray(response?.orders)
      ) {
        orderData = response.orders;
      } else if (
        Array.isArray(response?.data)
      ) {
        orderData = response.data;
      } else if (
        Array.isArray(response?.data?.orders)
      ) {
        orderData = response.data.orders;
      }

      setOrders(orderData);
    } catch (err) {
      console.error(
        "Admin orders error:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load orders."
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
  // FILTER
  // ==========================================================

  const filteredOrders = useMemo(() => {
    const searchText = search
      .trim()
      .toLowerCase();

    return orders.filter((order) => {
      const orderId =
        getOrderId(order) || "";

      const customerName =
        getCustomerName(order);

      const customerEmail =
        getCustomerEmail(order);

      const status =
        getStatus(order);

      const searchMatch =
        !searchText ||
        orderId
          .toString()
          .toLowerCase()
          .includes(searchText) ||
        customerName
          .toString()
          .toLowerCase()
          .includes(searchText) ||
        customerEmail
          .toString()
          .toLowerCase()
          .includes(searchText);

      const statusMatch =
        statusFilter === "all" ||
        status === statusFilter;

      return (
        searchMatch &&
        statusMatch
      );
    });
  }, [
    orders,
    search,
    statusFilter,
  ]);

  // ==========================================================
  // SUMMARY COUNTS
  // ==========================================================

  const summary = useMemo(() => {
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
      const status = getStatus(order);

      if (
        Object.prototype.hasOwnProperty.call(
          result,
          status
        )
      ) {
        result[status] += 1;
      }
    });

    return result;
  }, [orders]);

  // ==========================================================
  // UPDATE STATUS
  // ==========================================================

  const handleStatusChange = async (
    orderId,
    newStatus
  ) => {
    if (!orderId) {
      setError("Order ID is missing.");
      return;
    }

    try {
      setUpdatingId(orderId);
      setError("");

      await updateOrderStatus(
        orderId,
        newStatus
      );

      setOrders((currentOrders) =>
        currentOrders.map((order) => {
          const currentId =
            getOrderId(order);

          if (currentId !== orderId) {
            return order;
          }

          return {
            ...order,
            status: newStatus,
          };
        })
      );
    } catch (err) {
      console.error(
        "Update order status error:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to update order status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <Loading message="Loading orders..." />
    );
  }

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <section className="app-page admin-orders-page">
      <div className="admin-orders-container">
        {/* HEADER */}
        <header className="admin-orders-header">
          <div className="admin-orders-heading">
            <Link
              to="/admin"
              className="admin-orders-back"
            >
              <span aria-hidden="true">←</span>
              Admin Dashboard
            </Link>

            <span className="admin-orders-eyebrow">
              ORDER MANAGEMENT
            </span>

            <h1>Orders</h1>

            <p>
              Manage customer orders, monitor
              fulfillment and update order status.
            </p>
          </div>

          <button
            type="button"
            className="admin-orders-refresh"
            onClick={loadOrders}
            disabled={loading}
          >
            <span aria-hidden="true">↻</span>
            Refresh
          </button>
        </header>

        {/* ERROR */}
        {error && (
          <div className="admin-orders-error">
            <ErrorMessage
              message={error}
              onRetry={loadOrders}
            />
          </div>
        )}

        {/* SUMMARY */}
        <section className="admin-orders-summary">
          <button
            type="button"
            className={`admin-orders-summary-card ${
              statusFilter === "all"
                ? "is-active"
                : ""
            }`}
            onClick={() =>
              setStatusFilter("all")
            }
          >
            <span className="admin-orders-summary-icon admin-orders-summary-icon--purple">
              ◈
            </span>
            <span className="admin-orders-summary-copy">
              <strong>{summary.all}</strong>
              <small>Total Orders</small>
            </span>
          </button>

          <button
            type="button"
            className={`admin-orders-summary-card ${
              statusFilter === "pending"
                ? "is-active"
                : ""
            }`}
            onClick={() =>
              setStatusFilter("pending")
            }
          >
            <span className="admin-orders-summary-icon admin-orders-summary-icon--amber">
              ◷
            </span>
            <span className="admin-orders-summary-copy">
              <strong>{summary.pending}</strong>
              <small>Pending</small>
            </span>
          </button>

          <button
            type="button"
            className={`admin-orders-summary-card ${
              statusFilter === "processing"
                ? "is-active"
                : ""
            }`}
            onClick={() =>
              setStatusFilter("processing")
            }
          >
            <span className="admin-orders-summary-icon admin-orders-summary-icon--blue">
              ⚙
            </span>
            <span className="admin-orders-summary-copy">
              <strong>
                {summary.processing}
              </strong>
              <small>Processing</small>
            </span>
          </button>

          <button
            type="button"
            className={`admin-orders-summary-card ${
              statusFilter === "shipped"
                ? "is-active"
                : ""
            }`}
            onClick={() =>
              setStatusFilter("shipped")
            }
          >
            <span className="admin-orders-summary-icon admin-orders-summary-icon--cyan">
              ↗
            </span>
            <span className="admin-orders-summary-copy">
              <strong>{summary.shipped}</strong>
              <small>Shipped</small>
            </span>
          </button>

          <button
            type="button"
            className={`admin-orders-summary-card ${
              statusFilter === "delivered"
                ? "is-active"
                : ""
            }`}
            onClick={() =>
              setStatusFilter("delivered")
            }
          >
            <span className="admin-orders-summary-icon admin-orders-summary-icon--green">
              ✓
            </span>
            <span className="admin-orders-summary-copy">
              <strong>
                {summary.delivered}
              </strong>
              <small>Delivered</small>
            </span>
          </button>

          <button
            type="button"
            className={`admin-orders-summary-card ${
              statusFilter === "cancelled"
                ? "is-active"
                : ""
            }`}
            onClick={() =>
              setStatusFilter("cancelled")
            }
          >
            <span className="admin-orders-summary-icon admin-orders-summary-icon--red">
              ×
            </span>
            <span className="admin-orders-summary-copy">
              <strong>
                {summary.cancelled}
              </strong>
              <small>Cancelled</small>
            </span>
          </button>
        </section>

        {/* TOOLBAR */}
        <section className="admin-orders-toolbar">
          <div className="admin-orders-search">
            <label htmlFor="orderSearch">
              Search Orders
            </label>

            <div className="admin-orders-search-box">
              <span
                className="admin-orders-search-icon"
                aria-hidden="true"
              >
                ⌕
              </span>

              <input
                id="orderSearch"
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Order ID, customer name or email"
              />

              {search && (
                <button
                  type="button"
                  className="admin-orders-clear"
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

          <div className="admin-orders-filter">
            <label htmlFor="orderStatus">
              Status
            </label>

            <select
              id="orderStatus"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
            >
              <option value="all">
                All Orders
              </option>

              {ORDER_STATUSES.map(
                (status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {formatStatus(status)}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="admin-orders-result-count">
            <strong>
              {filteredOrders.length}
            </strong>
            <span>
              of {orders.length} orders
            </span>
          </div>
        </section>

        {/* ORDER LIST */}
        {filteredOrders.length === 0 ? (
          <div className="admin-orders-empty">
            <EmptyState
              title="No orders found"
              message="No orders match the current search or filter."
            />
          </div>
        ) : (
          <section className="admin-orders-list">
            {filteredOrders.map(
              (order, index) => {
                const orderId =
                  getOrderId(order);

                const status =
                  getStatus(order);

                const customerName =
                  getCustomerName(order);

                const customerEmail =
                  getCustomerEmail(order);

                const total =
                  getTotal(order);

                const date =
                  getDate(order);

                const itemCount =
                  getItemCount(order);

                const isUpdating =
                  updatingId === orderId;

                return (
                  <article
                    key={orderId}
                    className="admin-order-card"
                  >
                    <div className="admin-order-index">
                      {String(index + 1).padStart(
                        2,
                        "0"
                      )}
                    </div>

                    <div className="admin-order-main">
                      <div className="admin-order-top">
                        <div>
                          <span className="admin-order-label">
                            ORDER ID
                          </span>

                          <h2>
                            #{orderId || "N/A"}
                          </h2>
                        </div>

                        <span
                          className={`admin-order-status admin-order-status--${status}`}
                        >
                          <span />
                          {formatStatus(status)}
                        </span>
                      </div>

                      <div className="admin-order-details">
                        <div className="admin-order-detail">
                          <span>Customer</span>
                          <strong>
                            {customerName}
                          </strong>
                          {customerEmail && (
                            <small>
                              {customerEmail}
                            </small>
                          )}
                        </div>

                        <div className="admin-order-detail">
                          <span>Order Date</span>
                          <strong>
                            {date}
                          </strong>
                        </div>

                        <div className="admin-order-detail">
                          <span>Items</span>
                          <strong>
                            {itemCount}
                          </strong>
                        </div>

                        <div className="admin-order-detail admin-order-detail--total">
                          <span>Order Total</span>
                          <strong>
                            ₹
                            {total.toLocaleString(
                              "en-IN"
                            )}
                          </strong>
                        </div>
                      </div>

                      <div className="admin-order-actions">
                        <div className="admin-order-status-control">
                          <label
                            htmlFor={`status-${orderId}`}
                          >
                            Update Status
                          </label>

                          <select
                            id={`status-${orderId}`}
                            value={status}
                            disabled={isUpdating}
                            onChange={(
                              event
                            ) =>
                              handleStatusChange(
                                orderId,
                                event.target.value
                              )
                            }
                          >
                            {ORDER_STATUSES.map(
                              (
                                orderStatus
                              ) => (
                                <option
                                  key={
                                    orderStatus
                                  }
                                  value={
                                    orderStatus
                                  }
                                >
                                  {formatStatus(
                                    orderStatus
                                  )}
                                </option>
                              )
                            )}
                          </select>

                          {isUpdating && (
                            <span className="admin-order-updating">
                              <span />
                              Updating...
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          className="admin-order-view"
                          onClick={() =>
                            navigate(
                              `/admin/orders/${orderId}`
                            )
                          }
                        >
                          View Order
                          <span aria-hidden="true">
                            →
                          </span>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              }
            )}
          </section>
        )}
      </div>
    </section>
  );
}

export default AdminOrdersPage;
