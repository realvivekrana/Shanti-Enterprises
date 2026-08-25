// ============================================================
// SHANTI ENTERPRISES
// Admin Orders Page
// Frontend Phase 6 - UI/UX
// ============================================================

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  getAdminOrders,
  updateOrderStatus,
} from "../../api/adminOrderApi";

import Loading from "../../components/common/Loading";

import ErrorMessage from "../../components/common/ErrorMessage";

import EmptyState from "../../components/common/EmptyState";

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
// ADMIN ORDERS PAGE
// ============================================================

function AdminOrdersPage() {
  const navigate =
    useNavigate();

  const [
    orders,
    setOrders,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    updatingId,
    setUpdatingId,
  ] = useState(null);

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

  // ==========================================================
  // LOAD ORDERS
  // ==========================================================

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getAdminOrders({
          limit: 100,
        });

      let orderData = [];

      if (
        Array.isArray(response)
      ) {
        orderData =
          response;
      } else if (
        Array.isArray(
          response?.orders
        )
      ) {
        orderData =
          response.orders;
      } else if (
        Array.isArray(
          response?.data
        )
      ) {
        orderData =
          response.data;
      } else if (
        Array.isArray(
          response?.data?.orders
        )
      ) {
        orderData =
          response.data.orders;
      }

      setOrders(
        orderData
      );
    } catch (err) {
      console.error(
        "Admin orders error:",
        err
      );

      setError(
        err.response?.data
          ?.message ||
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
  // ORDER ID
  // ==========================================================

  const getOrderId = (
    order
  ) => {
    return (
      order._id ||
      order.id ||
      order.orderId
    );
  };

  // ==========================================================
  // STATUS
  // ==========================================================

  const getStatus = (
    order
  ) => {
    return (
      order.status ||
      order.orderStatus ||
      "pending"
    )
      .toString()
      .toLowerCase();
  };

  // ==========================================================
  // CUSTOMER NAME
  // ==========================================================

  const getCustomerName = (
    order
  ) => {
    if (
      typeof order.user ===
      "object"
    ) {
      return (
        order.user.name ||
        order.user.fullName ||
        order.user.email ||
        "Customer"
      );
    }

    if (
      typeof order.customer ===
      "object"
    ) {
      return (
        order.customer.name ||
        order.customer.fullName ||
        order.customer.email ||
        "Customer"
      );
    }

    return (
      order.customerName ||
      order.userName ||
      order.email ||
      "Customer"
    );
  };

  // ==========================================================
  // TOTAL
  // ==========================================================

  const getTotal = (
    order
  ) => {
    return Number(
      order.totalAmount ??
      order.totalPrice ??
      order.grandTotal ??
      order.total ??
      0
    );
  };

  // ==========================================================
  // DATE
  // ==========================================================

  const getDate = (
    order
  ) => {
    const value =
      order.createdAt ||
      order.created_at ||
      order.date;

    if (!value) {
      return "N/A";
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "N/A";
    }

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================================
  // STATUS LABEL
  // ==========================================================

  const getStatusLabel = (
    status
  ) => {
    return status
      .charAt(0)
      .toUpperCase() +
      status.slice(1);
  };

  // ==========================================================
  // FILTER ORDERS
  // ==========================================================

  const filteredOrders =
    orders.filter(
      (order) => {
        const orderId =
          getOrderId(
            order
          ) || "";

        const customerName =
          getCustomerName(
            order
          );

        const searchText =
          search
            .trim()
            .toLowerCase();

        const searchMatch =
          !searchText ||
          orderId
            .toString()
            .toLowerCase()
            .includes(
              searchText
            ) ||
          customerName
            .toString()
            .toLowerCase()
            .includes(
              searchText
            );

        const status =
          getStatus(
            order
          );

        const statusMatch =
          statusFilter ===
            "all" ||
          status ===
            statusFilter;

        return (
          searchMatch &&
          statusMatch
        );
      }
    );

  // ==========================================================
  // UPDATE STATUS
  // ==========================================================

  const handleStatusChange =
    async (
      orderId,
      newStatus
    ) => {
      if (!orderId) {
        setError(
          "Order ID is missing."
        );

        return;
      }

      try {
        setUpdatingId(
          orderId
        );

        setError("");

        await updateOrderStatus(
          orderId,
          newStatus
        );

        setOrders(
          (currentOrders) =>
            currentOrders.map(
              (order) => {
                const currentId =
                  getOrderId(
                    order
                  );

                if (
                  currentId !==
                  orderId
                ) {
                  return order;
                }

                return {
                  ...order,
                  status:
                    newStatus,
                };
              }
            )
        );
      } catch (err) {
        console.error(
          "Update order status error:",
          err
        );

        setError(
          err.response?.data
            ?.message ||
          err.message ||
          "Unable to update order status."
        );
      } finally {
        setUpdatingId(
          null
        );
      }
    };

  // ==========================================================
  // SUMMARY COUNTS
  // ==========================================================

  const pendingCount =
    orders.filter(
      (order) =>
        getStatus(order) ===
        "pending"
    ).length;

  const processingCount =
    orders.filter(
      (order) =>
        getStatus(order) ===
          "processing" ||
        getStatus(order) ===
          "confirmed"
    ).length;

  const shippedCount =
    orders.filter(
      (order) =>
        getStatus(order) ===
        "shipped"
    ).length;

  const deliveredCount =
    orders.filter(
      (order) =>
        getStatus(order) ===
        "delivered"
    ).length;

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <Loading
        message="Loading orders..."
      />
    );
  }

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <section className="admin-orders-page">

      <div className="admin-orders-container">

        {/* ==================================================
            HEADER
            ================================================== */}

        <div className="admin-orders-header">

          <div>

            <Link
              to="/admin"
              className="admin-orders-back"
            >
              ← Admin Dashboard
            </Link>

            <span className="admin-orders-eyebrow">
              ORDER MANAGEMENT
            </span>

            <h1>
              Orders
            </h1>

            <p>
              Review customer orders and
              manage their delivery status.
            </p>

          </div>

          <button
            type="button"
            className="admin-orders-refresh"
            onClick={
              loadOrders
            }
          >
            ↻ Refresh
          </button>

        </div>

        {/* ==================================================
            ERROR
            ================================================== */}

        {error && (
          <div className="admin-orders-error">

            <ErrorMessage
              message={error}
              onRetry={
                loadOrders
              }
            />

          </div>
        )}

        {/* ==================================================
            ORDER SUMMARY
            ================================================== */}

        <div className="admin-orders-stats">

          <div className="admin-order-stat-card">

            <span>
              TOTAL ORDERS
            </span>

            <strong>
              {orders.length}
            </strong>

          </div>

          <div className="admin-order-stat-card">

            <span>
              PENDING
            </span>

            <strong>
              {pendingCount}
            </strong>

          </div>

          <div className="admin-order-stat-card">

            <span>
              PROCESSING
            </span>

            <strong>
              {processingCount}
            </strong>

          </div>

          <div className="admin-order-stat-card">

            <span>
              SHIPPED
            </span>

            <strong>
              {shippedCount}
            </strong>

          </div>

          <div className="admin-order-stat-card">

            <span>
              DELIVERED
            </span>

            <strong>
              {deliveredCount}
            </strong>

          </div>

        </div>

        {/* ==================================================
            FILTERS
            ================================================== */}

        <div className="admin-orders-toolbar">

          <div className="admin-orders-search">

            <label htmlFor="orderSearch">
              Search Orders
            </label>

            <div className="admin-orders-search-box">

              <span>
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
                placeholder="Order ID or customer name..."
              />

              {search && (
                <button
                  type="button"
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

          <div className="admin-orders-status-filter">

            <label htmlFor="orderStatus">
              Order Status
            </label>

            <select
              id="orderStatus"
              value={
                statusFilter
              }
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
                    {getStatusLabel(
                      status
                    )}
                  </option>
                )
              )}

            </select>

          </div>

        </div>

        {/* ==================================================
            RESULT COUNT
            ================================================== */}

        <div className="admin-orders-result-count">

          <strong>
            {filteredOrders.length}
          </strong>

          <span>
            orders shown
          </span>

          <span className="admin-orders-total-count">
            Total: {orders.length}
          </span>

        </div>

        {/* ==================================================
            ORDERS LIST
            ================================================== */}

        {filteredOrders.length ===
        0 ? (
          <div className="admin-orders-empty">

            <EmptyState
              title="No orders found"
              message="No orders match the current search or status filter."
            />

          </div>
        ) : (
          <div className="admin-orders-list">

            {filteredOrders.map(
              (order) => {

                const orderId =
                  getOrderId(
                    order
                  );

                const status =
                  getStatus(
                    order
                  );

                const customerName =
                  getCustomerName(
                    order
                  );

                const total =
                  getTotal(
                    order
                  );

                const date =
                  getDate(
                    order
                  );

                const isUpdating =
                  updatingId ===
                  orderId;

                return (
                  <article
                    key={
                      orderId
                    }
                    className="admin-order-card"
                  >

                    {/* ==================================================
                        ORDER MAIN
                        ================================================== */}

                    <div className="admin-order-main">

                      <div className="admin-order-heading">

                        <div>

                          <span className="admin-order-label">
                            ORDER
                          </span>

                          <h2>
                            #
                            {orderId}
                          </h2>

                        </div>

                        <span
                          className={`admin-order-status ${status}`}
                        >
                          {getStatusLabel(
                            status
                          )}
                        </span>

                      </div>

                      <div className="admin-order-details">

                        <div>
                          <span>
                            CUSTOMER
                          </span>

                          <strong>
                            {customerName}
                          </strong>
                        </div>

                        <div>
                          <span>
                            DATE
                          </span>

                          <strong>
                            {date}
                          </strong>
                        </div>

                        <div>
                          <span>
                            TOTAL
                          </span>

                          <strong>
                            ₹
                            {total.toLocaleString(
                              "en-IN"
                            )}
                          </strong>
                        </div>

                      </div>

                    </div>

                    {/* ==================================================
                        STATUS UPDATE
                        ================================================== */}

                    <div className="admin-order-update">

                      <label
                        htmlFor={`status-${orderId}`}
                      >
                        Update Status
                      </label>

                      <select
                        id={`status-${orderId}`}
                        value={
                          status
                        }
                        disabled={
                          isUpdating
                        }
                        onChange={(
                          event
                        ) =>
                          handleStatusChange(
                            orderId,
                            event
                              .target
                              .value
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
                              {getStatusLabel(
                                orderStatus
                              )}
                            </option>
                          )
                        )}

                      </select>

                      {isUpdating && (
                        <span className="admin-order-updating">
                          Updating...
                        </span>
                      )}

                    </div>

                    {/* ==================================================
                        VIEW
                        ================================================== */}

                    <button
                      type="button"
                      className="admin-order-view"
                      onClick={() =>
                        navigate(
                          `/admin/orders/${orderId}`
                        )
                      }
                    >
                      View Order →
                    </button>

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

export default AdminOrdersPage;