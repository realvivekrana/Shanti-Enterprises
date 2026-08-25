// ============================================================
// SHANTI ENTERPRISES
// Admin Orders Page
// Frontend Phase 5 - Order Management
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
      "en-IN"
    );
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
    <section className="app-page">

      {/* ====================================================
          HEADER
          ==================================================== */}

      <div>

        <Link to="/admin">
          ← Admin Dashboard
        </Link>

        <h1>
          Order Management
        </h1>

        <p>
          Manage customer orders
          and update their status.
        </p>

      </div>

      {/* ====================================================
          ERROR
          ==================================================== */}

      {error && (
        <ErrorMessage
          message={error}
          onRetry={loadOrders}
        />
      )}

      {/* ====================================================
          ACTIONS
          ==================================================== */}

      <div>

        <button
          type="button"
          onClick={
            loadOrders
          }
        >
          Refresh
        </button>

      </div>

      {/* ====================================================
          SEARCH
          ==================================================== */}

      <div>

        <label htmlFor="orderSearch">
          Search Orders
        </label>

        <input
          id="orderSearch"
          type="text"
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
          placeholder="Order ID or customer name"
        />

      </div>

      {/* ====================================================
          STATUS FILTER
          ==================================================== */}

      <div>

        <label htmlFor="orderStatus">
          Status
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
                {status
                  .charAt(0)
                  .toUpperCase() +
                  status.slice(1)}
              </option>
            )
          )}

        </select>

      </div>

      {/* ====================================================
          COUNT
          ==================================================== */}

      <p>
        Showing{" "}
        {
          filteredOrders.length
        }{" "}
        of{" "}
        {orders.length} orders
      </p>

      {/* ====================================================
          ORDERS
          ==================================================== */}

      {filteredOrders.length ===
      0 ? (
        <EmptyState
          title="No orders found"
          message="No orders match the current search or filter."
        />
      ) : (
        <div>

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
                >

                  {/* ORDER ID */}

                  <h2>
                    Order #
                    {orderId}
                  </h2>

                  {/* CUSTOMER */}

                  <p>
                    Customer:{" "}
                    {customerName}
                  </p>

                  {/* DATE */}

                  <p>
                    Date:{" "}
                    {date}
                  </p>

                  {/* TOTAL */}

                  <p>
                    Total: ₹
                    {total.toLocaleString(
                      "en-IN"
                    )}
                  </p>

                  {/* CURRENT STATUS */}

                  <p>
                    Current Status:{" "}
                    {status}
                  </p>

                  {/* STATUS UPDATE */}

                  <div>

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
                          event.target
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
                            {orderStatus
                              .charAt(
                                0
                              )
                              .toUpperCase() +
                              orderStatus.slice(
                                1
                              )}
                          </option>
                        )
                      )}

                    </select>

                    {isUpdating && (
                      <span>
                        Updating...
                      </span>
                    )}

                  </div>

                  {/* VIEW */}

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/admin/orders/${orderId}`
                      )
                    }
                  >
                    View Order
                  </button>

                </article>
              );
            }
          )}

        </div>
      )}

    </section>
  );
}

export default AdminOrdersPage;