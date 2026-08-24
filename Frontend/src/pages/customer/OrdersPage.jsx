// ============================================================
// SHANTI ENTERPRISES
// Customer Order History
// Frontend Phase 4 - Customer
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
// ORDER STATUS
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

// ============================================================
// PAYMENT STATUS
// ============================================================

const getPaymentStatus = (
  order
) => {
  return (
    order.paymentStatus ||
    "Pending"
  );
};

// ============================================================
// ORDER TOTAL
// ============================================================

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

  const loadOrders = async () => {
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
        Array.isArray(orderList)
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

      // ------------------------------------------------------
      // SEARCH
      // ------------------------------------------------------

      const searchValue =
        search
          .trim()
          .toLowerCase();

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

      // ------------------------------------------------------
      // STATUS
      // ------------------------------------------------------

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

      // ------------------------------------------------------
      // SORT
      // ------------------------------------------------------

      result.sort(
        (a, b) => {
          const dateA =
            new Date(
              a.createdAt || 0
            ).getTime();

          const dateB =
            new Date(
              b.createdAt || 0
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
        all: orders.length,

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
      <section className="app-page">

        <ErrorMessage
          message={error}
          onRetry={loadOrders}
        />

      </section>
    );
  }

  // ==========================================================
  // EMPTY
  // ==========================================================

  if (orders.length === 0) {
    return (
      <section className="app-page">

        <Link to="/dashboard">
          ← Dashboard
        </Link>

        <h1>
          Order History
        </h1>

        <EmptyState
          title="No orders yet"
          message="You have not placed any orders yet."
        />

        <Link to="/products">
          Start Shopping
        </Link>

      </section>
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

        <Link to="/dashboard">
          ← Dashboard
        </Link>

        <h1>
          Order History
        </h1>

        <p>
          View and manage all your
          previous orders.
        </p>

      </div>

      {/* ====================================================
          ORDER COUNTS
          ==================================================== */}

      <div>

        <div>
          <strong>
            {statusCounts.all}
          </strong>

          <span>
            Total
          </span>
        </div>

        <div>
          <strong>
            {statusCounts.pending}
          </strong>

          <span>
            Pending
          </span>
        </div>

        <div>
          <strong>
            {statusCounts.processing}
          </strong>

          <span>
            Processing
          </span>
        </div>

        <div>
          <strong>
            {statusCounts.shipped}
          </strong>

          <span>
            Shipped
          </span>
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

      {/* ====================================================
          FILTERS
          ==================================================== */}

      <div>

        {/* SEARCH */}

        <div>

          <label htmlFor="orderSearch">
            Search Order
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
            placeholder="Search by order ID"
          />

        </div>

        {/* STATUS */}

        <div>

          <label htmlFor="statusFilter">
            Status
          </label>

          <select
            id="statusFilter"
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

        <div>

          <label htmlFor="sortOrder">
            Sort
          </label>

          <select
            id="sortOrder"
            value={
              sortOrder
            }
            onChange={(event) =>
              setSortOrder(
                event.target.value
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

      {/* ====================================================
          RESULTS
          ==================================================== */}

      <p>
        Showing{" "}
        {filteredOrders.length}{" "}
        of{" "}
        {orders.length} orders
      </p>

      {/* ====================================================
          NO FILTER RESULTS
          ==================================================== */}

      {filteredOrders.length ===
      0 ? (
        <EmptyState
          title="No matching orders"
          message="Try changing your search or filter."
        />
      ) : (
        <div>

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

              return (
                <article
                  key={orderId}
                >

                  {/* ORDER HEADER */}

                  <div>

                    <h2>
                      Order #
                      {orderId}
                    </h2>

                    {order.createdAt && (
                      <p>
                        Ordered on{" "}
                        {new Date(
                          order.createdAt
                        ).toLocaleDateString(
                          "en-IN"
                        )}
                      </p>
                    )}

                  </div>

                  {/* STATUS */}

                  <div>

                    <p>
                      Order Status
                    </p>

                    <strong>
                      {status}
                    </strong>

                  </div>

                  {/* PAYMENT */}

                  <div>

                    <p>
                      Payment
                    </p>

                    <strong>
                      {paymentStatus}
                    </strong>

                  </div>

                  {/* ITEMS */}

                  <div>

                    <p>
                      Items
                    </p>

                    <strong>
                      {items.length}
                    </strong>

                  </div>

                  {/* TOTAL */}

                  <div>

                    <p>
                      Total
                    </p>

                    <strong>
                      ₹
                      {total.toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                  </div>

                  {/* ACTION */}

                  <div>

                    <Link
                      to={`/orders/${orderId}`}
                    >
                      View Details
                    </Link>

                  </div>

                </article>
              );
            }
          )}

        </div>
      )}

    </section>
  );
}

export default OrdersPage;