// ============================================================
// SHANTI ENTERPRISES
// Orders Page
// Frontend Phase 6 - Complete Customer Orders UI/UX
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
// EXTRACT ORDERS
// ============================================================

const extractOrders = (
  responseData
) => {
  if (
    Array.isArray(
      responseData
    )
  ) {
    return responseData;
  }

  if (
    Array.isArray(
      responseData?.orders
    )
  ) {
    return responseData.orders;
  }

  if (
    Array.isArray(
      responseData?.data
    )
  ) {
    return responseData.data;
  }

  if (
    Array.isArray(
      responseData?.data?.orders
    )
  ) {
    return responseData.data.orders;
  }

  return [];
};

// ============================================================
// GET PAGINATION
// ============================================================

const extractPagination = (
  responseData
) => {
  const pagination =
    responseData?.pagination ||
    responseData?.data?.pagination ||
    {};

  return {
    page:
      Number(
        pagination.page
      ) || 1,

    limit:
      Number(
        pagination.limit
      ) || 10,

    total:
      Number(
        pagination.total
      ) || 0,

    totalPages:
      Number(
        pagination.totalPages
      ) || 1,
  };
};

// ============================================================
// FORMAT DATE
// ============================================================

const formatDate = (
  value
) => {
  if (!value) {
    return "Date unavailable";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "Date unavailable";
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

// ============================================================
// FORMAT CURRENCY
// ============================================================

const formatCurrency = (
  value
) => {
  return `₹${Number(
    value || 0
  ).toLocaleString(
    "en-IN",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}`;
};

// ============================================================
// STATUS LABEL
// ============================================================

const getStatusLabel = (
  status
) => {
  if (!status) {
    return "Pending";
  }

  return String(status)
    .replace(
      /[-_]/g,
      " "
    )
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase()
    );
};

// ============================================================
// STATUS CLASS
// ============================================================

const getStatusClass = (
  status
) => {
  const normalized =
    String(
      status || "pending"
    ).toLowerCase();

  return `orders-status orders-status-${normalized}`;
};

// ============================================================
// PAYMENT STATUS CLASS
// ============================================================

const getPaymentStatusClass = (
  status
) => {
  const normalized =
    String(
      status || "pending"
    ).toLowerCase();

  return `orders-payment-status orders-payment-status-${normalized}`;
};

// ============================================================
// ORDERS PAGE
// ============================================================

function OrdersPage() {

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

  const [
    page,
    setPage,
  ] = useState(1);

  const [
    pagination,
    setPagination,
  ] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  // ==========================================================
  // LOAD ORDERS
  // ==========================================================

  const loadOrders =
    async (
      requestedPage = page,
      showFullLoader = true
    ) => {

      try {

        if (
          showFullLoader
        ) {
          setLoading(true);
        } else {
          setRefreshing(true);
        }

        setError("");

        const params = {
          page:
            requestedPage,
          limit: 10,
        };

        if (
          statusFilter !==
          "all"
        ) {
          params.status =
            statusFilter;
        }

        const response =
          await getMyOrders(
            params
          );

        const orderData =
          extractOrders(
            response
          );

        const pageData =
          extractPagination(
            response
          );

        setOrders(
          orderData
        );

        setPagination(
          pageData
        );

        setPage(
          pageData.page ||
            requestedPage
        );

      } catch (err) {

        console.error(
          "Orders fetch error:",
          err
        );

        setError(
          err.response?.data
            ?.message ||
            err.message ||
            "Unable to load your orders."
        );

      } finally {

        setLoading(false);
        setRefreshing(false);

      }
    };

  // ==========================================================
  // INITIAL / FILTER LOAD
  // ==========================================================

  useEffect(() => {

    setPage(1);

    loadOrders(
      1,
      true
    );

  }, [
    statusFilter,
  ]);

  // ==========================================================
  // REFRESH
  // ==========================================================

  const handleRefresh =
    () => {

      loadOrders(
        page,
        false
      );

    };

  // ==========================================================
  // PAGE CHANGE
  // ==========================================================

  const handlePageChange =
    (
      nextPage
    ) => {

      if (
        nextPage < 1 ||
        nextPage >
          pagination.totalPages ||
        nextPage === page
      ) {
        return;
      }

      loadOrders(
        nextPage,
        true
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

    };

  // ==========================================================
  // SEARCH
  // ==========================================================

  const normalizedSearch =
    search
      .trim()
      .toLowerCase();

  // ==========================================================
  // FILTER + SORT
  // ==========================================================

  const visibleOrders =
    useMemo(() => {

      let result =
        [...orders];

      if (
        normalizedSearch
      ) {

        result =
          result.filter(
            (order) => {

              const orderId =
                String(
                  order?._id ||
                    order?.id ||
                    ""
                ).toLowerCase();

              const orderNumber =
                String(
                  order?.orderNumber ||
                    order?.orderNo ||
                    ""
                ).toLowerCase();

              const status =
                String(
                  order?.status ||
                    ""
                ).toLowerCase();

              return (
                orderId.includes(
                  normalizedSearch
                ) ||
                orderNumber.includes(
                  normalizedSearch
                ) ||
                status.includes(
                  normalizedSearch
                )
              );

            }
          );

      }

      result.sort(
        (
          first,
          second
        ) => {

          const firstDate =
            new Date(
              first?.createdAt ||
                first?.created_at ||
                0
            ).getTime();

          const secondDate =
            new Date(
              second?.createdAt ||
                second?.created_at ||
                0
            ).getTime();

          return sortOrder ===
            "oldest"
            ? firstDate -
                secondDate
            : secondDate -
                firstDate;

        }
      );

      return result;

    }, [
      orders,
      normalizedSearch,
      sortOrder,
    ]);

  // ==========================================================
  // STATUS COUNTS
  // ==========================================================

  const statusCounts =
    useMemo(() => {

      const counts = {
        all: orders.length,
        pending: 0,
        confirmed: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
      };

      orders.forEach(
        (order) => {

          const status =
            String(
              order?.status ||
                "pending"
            ).toLowerCase();

          if (
            Object.prototype.hasOwnProperty.call(
              counts,
              status
            )
          ) {
            counts[
              status
            ] += 1;
          }

        }
      );

      return counts;

    }, [
      orders,
    ]);

  // ==========================================================
  // LOADING
  // ==========================================================

  if (
    loading &&
    orders.length === 0
  ) {

    return (
      <section className="orders-page">

        <div className="orders-container">

          <div className="orders-loading-card">

            <span className="orders-loading-eyebrow">
              CUSTOMER ACCOUNT
            </span>

            <Loading
              message="Loading your orders..."
            />

          </div>

        </div>

      </section>
    );

  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (
    error &&
    orders.length === 0
  ) {

    return (
      <section className="orders-page">

        <div className="orders-container">

          <div className="orders-back-row">

            <Link
              to="/dashboard"
              className="orders-back-link"
            >
              ← Back to Dashboard
            </Link>

          </div>

          <div className="orders-error-card">

            <ErrorMessage
              message={error}
              onRetry={() =>
                loadOrders(
                  page,
                  true
                )
              }
            />

          </div>

        </div>

      </section>
    );

  }

  // ==========================================================
  // EMPTY
  // ==========================================================

  if (
    orders.length === 0
  ) {

    return (
      <section className="orders-page">

        <div className="orders-container">

          <div className="orders-page-header">

            <div>

              <span className="orders-eyebrow">
                CUSTOMER ACCOUNT
              </span>

              <h1>
                My Orders
              </h1>

              <p>
                Track and manage your
                orders from one place.
              </p>

            </div>

          </div>

          <div className="orders-empty-card">

            <div className="orders-empty-icon">
              📦
            </div>

            <EmptyState
              title="No orders yet"
              message="Your completed orders will appear here."
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

        <div className="orders-page-header">

          <div>

            <span className="orders-eyebrow">
              CUSTOMER ACCOUNT
            </span>

            <h1>
              My Orders
            </h1>

            <p>
              Track and manage your
              orders from one place.
            </p>

          </div>

          <div className="orders-header-actions">

            <button
              type="button"
              className="orders-refresh-button"
              onClick={
                handleRefresh
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
              className="orders-primary-button"
            >
              Continue Shopping
              <span>
                →
              </span>
            </Link>

          </div>

        </div>

        {/* ==================================================
            OVERVIEW
            ================================================== */}

        <div className="orders-overview">

          <div className="orders-overview-item">

            <span>
              TOTAL ORDERS
            </span>

            <strong>
              {pagination.total}
            </strong>

          </div>

          <div className="orders-overview-item">

            <span>
              CURRENT PAGE
            </span>

            <strong>
              {page}
            </strong>

          </div>

          <div className="orders-overview-item">

            <span>
              SHOWING
            </span>

            <strong>
              {visibleOrders.length}
            </strong>

          </div>

        </div>

        {/* ==================================================
            STATUS FILTERS
            ================================================== */}

        <div className="orders-status-filters">

          <button
            type="button"
            className={
              statusFilter ===
              "all"
                ? "orders-filter-active"
                : ""
            }
            onClick={() =>
              setStatusFilter(
                "all"
              )
            }
          >
            All

            <span>
              {statusCounts.all}
            </span>

          </button>

          <button
            type="button"
            className={
              statusFilter ===
              "pending"
                ? "orders-filter-active"
                : ""
            }
            onClick={() =>
              setStatusFilter(
                "pending"
              )
            }
          >
            Pending

            <span>
              {statusCounts.pending}
            </span>

          </button>

          <button
            type="button"
            className={
              statusFilter ===
              "confirmed"
                ? "orders-filter-active"
                : ""
            }
            onClick={() =>
              setStatusFilter(
                "confirmed"
              )
            }
          >
            Confirmed

            <span>
              {statusCounts.confirmed}
            </span>

          </button>

          <button
            type="button"
            className={
              statusFilter ===
              "processing"
                ? "orders-filter-active"
                : ""
            }
            onClick={() =>
              setStatusFilter(
                "processing"
              )
            }
          >
            Processing

            <span>
              {statusCounts.processing}
            </span>

          </button>

          <button
            type="button"
            className={
              statusFilter ===
              "shipped"
                ? "orders-filter-active"
                : ""
            }
            onClick={() =>
              setStatusFilter(
                "shipped"
              )
            }
          >
            Shipped

            <span>
              {statusCounts.shipped}
            </span>

          </button>

          <button
            type="button"
            className={
              statusFilter ===
              "delivered"
                ? "orders-filter-active"
                : ""
            }
            onClick={() =>
              setStatusFilter(
                "delivered"
              )
            }
          >
            Delivered

            <span>
              {statusCounts.delivered}
            </span>

          </button>

          <button
            type="button"
            className={
              statusFilter ===
              "cancelled"
                ? "orders-filter-active"
                : ""
            }
            onClick={() =>
              setStatusFilter(
                "cancelled"
              )
            }
          >
            Cancelled

            <span>
              {statusCounts.cancelled}
            </span>

          </button>

        </div>

        {/* ==================================================
            SEARCH + SORT
            ================================================== */}

        <div className="orders-toolbar">

          <div className="orders-search">

            <label
              htmlFor="order-search"
            >
              Search Orders
            </label>

            <div className="orders-search-input">

              <span>
                ⌕
              </span>

              <input
                id="order-search"
                type="search"
                value={
                  search
                }
                onChange={(
                  event
                ) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search by order ID, number or status"
              />

            </div>

          </div>

          <div className="orders-sort">

            <label
              htmlFor="order-sort"
            >
              Sort Orders
            </label>

            <select
              id="order-sort"
              value={
                sortOrder
              }
              onChange={(
                event
              ) =>
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

        {/* ==================================================
            INLINE ERROR
            ================================================== */}

        {error && (
          <div className="orders-inline-error">

            <div>

              <strong>
                Unable to refresh orders
              </strong>

              <p>
                {error}
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                loadOrders(
                  page,
                  false
                )
              }
            >
              Try Again
            </button>

          </div>
        )}

        {/* ==================================================
            SEARCH EMPTY
            ================================================== */}

        {visibleOrders.length ===
          0 && (
          <div className="orders-search-empty">

            <div className="orders-search-empty-icon">
              ⌕
            </div>

            <h2>
              No matching orders
            </h2>

            <p>
              Try a different order ID
              or search term.
            </p>

            <button
              type="button"
              onClick={() =>
                setSearch("")
              }
            >
              Clear Search
            </button>

          </div>
        )}

        {/* ==================================================
            ORDERS LIST
            ================================================== */}

        {visibleOrders.length >
          0 && (
          <div className="orders-list">

            {visibleOrders.map(
              (order) => {

                const orderId =
                  order?._id ||
                  order?.id;

                const orderNumber =
                  order?.orderNumber ||
                  order?.orderNo ||
                  orderId;

                const status =
                  order?.status ||
                  "pending";

                const paymentStatus =
                  order?.paymentStatus ||
                  "";

                const itemCount =
                  Array.isArray(
                    order?.items
                  )
                    ? order.items.length
                    : Number(
                        order?.itemsCount ||
                          order?.totalItems ||
                          0
                      );

                const totalAmount =
                  Number(
                    order?.totalAmount ??
                      order?.total ??
                      order?.grandTotal ??
                      order?.amount ??
                      0
                  );

                return (
                  <article
                    className="orders-card"
                    key={orderId}
                  >

                    {/* ORDER HEADER */}

                    <div className="orders-card-header">

                      <div>

                        <span className="orders-card-label">
                          ORDER
                        </span>

                        <h2>
                          #{orderNumber}
                        </h2>

                      </div>

                      <span
                        className={getStatusClass(
                          status
                        )}
                      >
                        {getStatusLabel(
                          status
                        )}
                      </span>

                    </div>

                    {/* ORDER META */}

                    <div className="orders-card-meta">

                      <div>

                        <span>
                          Order Date
                        </span>

                        <strong>
                          {formatDate(
                            order?.createdAt ||
                              order?.created_at
                          )}
                        </strong>

                      </div>

                      <div>

                        <span>
                          Items
                        </span>

                        <strong>
                          {itemCount}
                        </strong>

                      </div>

                      <div>

                        <span>
                          Total
                        </span>

                        <strong>
                          {formatCurrency(
                            totalAmount
                          )}
                        </strong>

                      </div>

                      {paymentStatus && (
                        <div>

                          <span>
                            Payment
                          </span>

                          <strong
                            className={getPaymentStatusClass(
                              paymentStatus
                            )}
                          >
                            {getStatusLabel(
                              paymentStatus
                            )}
                          </strong>

                        </div>
                      )}

                    </div>

                    {/* ORDER FOOTER */}

                    <div className="orders-card-footer">

                      <div className="orders-card-reference">

                        <span>
                          ORDER REFERENCE
                        </span>

                        <strong
                          title={
                            orderId
                          }
                        >
                          {orderId}
                        </strong>

                      </div>

                      <div className="orders-card-actions">

                        <Link
                          to={
                            orderId
                              ? `/orders/${orderId}`
                              : "/orders"
                          }
                          className="orders-view-button"
                        >
                          View Order

                          <span>
                            →
                          </span>
                        </Link>

                      </div>

                    </div>

                  </article>
                );
              }
            )}

          </div>
        )}

        {/* ==================================================
            PAGINATION
            ================================================== */}

        {pagination.totalPages >
          1 && (
          <div className="orders-pagination">

            <button
              type="button"
              disabled={
                page <= 1 ||
                loading
              }
              onClick={() =>
                handlePageChange(
                  page - 1
                )
              }
            >
              ← Previous
            </button>

            <div className="orders-page-numbers">

              {Array.from(
                {
                  length:
                    pagination.totalPages,
                },
                (
                  _,
                  index
                ) =>
                  index + 1
              )
                .filter(
                  (
                    pageNumber
                  ) => {

                    if (
                      pagination.totalPages <=
                      7
                    ) {
                      return true;
                    }

                    return (
                      pageNumber ===
                        1 ||
                      pageNumber ===
                        pagination.totalPages ||
                      Math.abs(
                        pageNumber -
                          page
                      ) <= 1
                    );

                  }
                )
                .map(
                  (
                    pageNumber
                  ) => (
                    <button
                      key={
                        pageNumber
                      }
                      type="button"
                      className={
                        pageNumber ===
                        page
                          ? "orders-page-number-active"
                          : ""
                      }
                      disabled={
                        loading
                      }
                      onClick={() =>
                        handlePageChange(
                          pageNumber
                        )
                      }
                    >
                      {
                        pageNumber
                      }
                    </button>
                  )
                )}

            </div>

            <button
              type="button"
              disabled={
                page >=
                  pagination.totalPages ||
                loading
              }
              onClick={() =>
                handlePageChange(
                  page + 1
                )
              }
            >
              Next →
            </button>

          </div>
        )}

        {/* ==================================================
            PAGINATION INFO
            ================================================== */}

        {pagination.total >
          0 && (
          <p className="orders-pagination-info">

            Showing page{" "}

            <strong>
              {page}
            </strong>{" "}

            of{" "}

            <strong>
              {pagination.totalPages}
            </strong>

            {" · "}

            Total orders:{" "}

            <strong>
              {pagination.total}
            </strong>

          </p>
        )}

      </div>

    </section>
  );
}

export default OrdersPage;