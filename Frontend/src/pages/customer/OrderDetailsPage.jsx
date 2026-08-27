// ============================================================
// SHANTI ENTERPRISES
// Order Details Page
// Frontend Phase 6 - Complete Customer Order Details
// ============================================================

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  getOrderById,
} from "../../api/orderApi";

import Loading from "../../components/common/Loading";

import ErrorMessage from "../../components/common/ErrorMessage";

import EmptyState from "../../components/common/EmptyState";

import OrderTracking from "../../components/customer/OrderTracking";

// ============================================================
// EXTRACT ORDER
// ============================================================

const extractOrder = (
  response
) => {
  if (
    response?.order
  ) {
    return response.order;
  }

  if (
    response?.data?.order
  ) {
    return response.data.order;
  }

  if (
    response?.data
  ) {
    return response.data;
  }

  return response;
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
// FORMAT DATE
// ============================================================

const formatDate = (
  value,
  includeTime = false
) => {
  if (!value) {
    return "Unavailable";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "Unavailable";
  }

  return date.toLocaleString(
    "en-IN",
    includeTime
      ? {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      : {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
  );
};

// ============================================================
// STATUS LABEL
// ============================================================

const getStatusLabel = (
  value
) => {
  if (!value) {
    return "Pending";
  }

  return String(value)
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
  value
) => {
  const status =
    String(
      value || "pending"
    ).toLowerCase();

  return `order-details-status order-details-status-${status}`;
};

// ============================================================
// IMAGE URL
// ============================================================

const getImageUrl = (
  image
) => {
  if (!image) {
    return "";
  }

  if (
    typeof image ===
    "string"
  ) {
    return image;
  }

  return (
    image.url ||
    image.secure_url ||
    image.src ||
    ""
  );
};

// ============================================================
// ORDER DETAILS PAGE
// ============================================================

function OrderDetailsPage() {
  const {
    orderId,
  } = useParams();

  const [
    order,
    setOrder,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    imageErrors,
    setImageErrors,
  ] = useState({});

  // ==========================================================
  // LOAD ORDER
  // ==========================================================

  const loadOrder = async (
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

      const response =
        await getOrderById(
          orderId
        );

      const orderData =
        extractOrder(
          response
        );

      if (
        !orderData ||
        typeof orderData !==
          "object"
      ) {
        setOrder(null);
        return;
      }

      setOrder(
        orderData
      );
    } catch (err) {
      console.error(
        "Order details error:",
        err
      );

      setError(
        err.response?.data
          ?.message ||
          err.message ||
          "Unable to load order."
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
    if (orderId) {
      loadOrder(true);
    } else {
      setLoading(false);
      setError(
        "Order ID is missing."
      );
    }
  }, [orderId]);

  // ==========================================================
  // IMAGE ERROR
  // ==========================================================

  const handleImageError = (
    itemId
  ) => {
    setImageErrors(
      (current) => ({
        ...current,
        [itemId]: true,
      })
    );
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (
    loading &&
    !order
  ) {
    return (
      <section className="order-details-page">

        <div className="order-details-container">

          <Loading
            message="Loading order details..."
          />

        </div>

      </section>
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (
    error &&
    !order
  ) {
    return (
      <section className="order-details-page">

        <div className="order-details-container">

          <div className="order-details-back-row">

            <Link
              to="/orders"
              className="order-details-back-link"
            >
              ← Back to My Orders
            </Link>

          </div>

          <ErrorMessage
            message={error}
            onRetry={() =>
              loadOrder(true)
            }
          />

        </div>

      </section>
    );
  }

  // ==========================================================
  // NOT FOUND
  // ==========================================================

  if (!order) {
    return (
      <section className="order-details-page">

        <div className="order-details-container">

          <div className="order-details-back-row">

            <Link
              to="/orders"
              className="order-details-back-link"
            >
              ← Back to My Orders
            </Link>

          </div>

          <EmptyState
            title="Order not found"
            message="The requested order could not be found."
          />

          <div className="order-details-empty-action">

            <Link
              to="/products"
              className="order-details-primary-button"
            >
              Continue Shopping
            </Link>

          </div>

        </div>

      </section>
    );
  }

  // ==========================================================
  // ORDER DATA
  // ==========================================================

  const items =
    Array.isArray(
      order.items
    )
      ? order.items
      : [];

  const status =
    order.status ||
    order.orderStatus ||
    "pending";

  const paymentStatus =
    order.paymentStatus ||
    "pending";

  const paymentMethod =
    order.paymentMethod ||
    order.paymentType ||
    "Not specified";

  const total =
    Number(
      order.totalAmount ??
        order.total ??
        order.grandTotal ??
        order.amount ??
        0
    );

  const subtotal =
    Number(
      order.subtotal ??
        order.subTotal ??
        total
    );

  const shippingAmount =
    Number(
      order.shippingAmount ??
        order.shippingCost ??
        order.deliveryCharge ??
        0
    );

  const taxAmount =
    Number(
      order.taxAmount ??
        order.tax ??
        0
    );

  const discountAmount =
    Number(
      order.discountAmount ??
        order.discount ??
        0
    );

  const address =
    order.shippingAddress ||
    order.deliveryAddress ||
    {};

  const orderNumber =
    order.orderNumber ||
    order.orderNo ||
    order._id ||
    order.id;

  // ==========================================================
  // TOTAL QUANTITY
  // ==========================================================

  const totalQuantity =
    useMemo(() => {
      return items.reduce(
        (
          totalCount,
          item
        ) =>
          totalCount +
          Number(
            item.quantity ||
              0
          ),
        0
      );
    }, [items]);

  // ==========================================================
  // ADDRESS VALUES
  // ==========================================================

  const addressName =
    address.name ||
    address.fullName ||
    "";

  const addressPhone =
    address.phone ||
    address.mobile ||
    "";

  const addressLine1 =
    address.addressLine1 ||
    address.address ||
    address.street ||
    "";

  const addressLine2 =
    address.addressLine2 ||
    address.landmark ||
    "";

  const addressCity =
    address.city ||
    "";

  const addressState =
    address.state ||
    "";

  const addressPostalCode =
    address.postalCode ||
    address.pincode ||
    address.zipCode ||
    "";

  const addressCountry =
    address.country ||
    "India";

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <section className="order-details-page">

      <div className="order-details-container">

        {/* ==================================================
            BACK
            ================================================== */}

        <div className="order-details-back-row">

          <Link
            to="/orders"
            className="order-details-back-link"
          >
            ← Back to My Orders
          </Link>

          <button
            type="button"
            className="order-details-refresh-button"
            onClick={() =>
              loadOrder(false)
            }
            disabled={
              refreshing
            }
          >
            {refreshing
              ? "Refreshing..."
              : "↻ Refresh"}
          </button>

        </div>

        {/* ==================================================
            ERROR WHILE REFRESHING
            ================================================== */}

        {error && (
          <div className="order-details-inline-error">

            <strong>
              Unable to refresh order
            </strong>

            <p>
              {error}
            </p>

          </div>
        )}

        {/* ==================================================
            HEADER
            ================================================== */}

        <div className="order-details-header">

          <div>

            <span className="order-details-eyebrow">
              ORDER DETAILS
            </span>

            <h1>
              Order #{orderNumber}
            </h1>

            {order.createdAt && (
              <p>
                Placed on{" "}
                <strong>
                  {formatDate(
                    order.createdAt,
                    true
                  )}
                </strong>
              </p>
            )}

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

        {/* ==================================================
            ORDER OVERVIEW
            ================================================== */}

        <div className="order-details-overview">

          <div className="order-details-overview-item">

            <span>
              Order Status
            </span>

            <strong>
              {getStatusLabel(
                status
              )}
            </strong>

          </div>

          <div className="order-details-overview-item">

            <span>
              Payment Status
            </span>

            <strong>
              {getStatusLabel(
                paymentStatus
              )}
            </strong>

          </div>

          <div className="order-details-overview-item">

            <span>
              Payment Method
            </span>

            <strong>
              {getStatusLabel(
                paymentMethod
              )}
            </strong>

          </div>

          <div className="order-details-overview-item">

            <span>
              Total Items
            </span>

            <strong>
              {totalQuantity}
            </strong>

          </div>

        </div>

        {/* ==================================================
            TRACKING
            ================================================== */}

        <div className="order-details-section">

          <div className="order-details-section-heading">

            <span>
              ORDER PROGRESS
            </span>

            <h2>
              Track Your Order
            </h2>

          </div>

          <OrderTracking
            order={order}
          />

        </div>

        {/* ==================================================
            MAIN GRID
            ================================================== */}

        <div className="order-details-main-grid">

          {/* ==================================================
              PRODUCTS
              ================================================== */}

          <div className="order-details-products-section">

            <div className="order-details-section-heading">

              <span>
                ORDER ITEMS
              </span>

              <h2>
                Products
              </h2>

            </div>

            {items.length ===
            0 ? (
              <div className="order-details-no-items">

                <p>
                  No product items were found
                  for this order.
                </p>

              </div>
            ) : (
              <div className="order-details-items">

                {items.map(
                  (
                    item,
                    index
                  ) => {
                    const itemId =
                      item._id ||
                      item.productId ||
                      index;

                    const itemName =
                      item.name ||
                      item.productName ||
                      "Product";

                    const itemPrice =
                      Number(
                        item.price ||
                          0
                      );

                    const quantity =
                      Number(
                        item.quantity ||
                          0
                      );

                    const itemTotal =
                      Number(
                        item.total ??
                          item.subtotal ??
                          itemPrice *
                            quantity
                      );

                    const image =
                      getImageUrl(
                        item.image ||
                          item.productImage
                      );

                    const imageFailed =
                      imageErrors[
                        itemId
                      ];

                    return (
                      <article
                        className="order-details-item"
                        key={
                          itemId
                        }
                      >

                        {/* IMAGE */}

                        <div className="order-details-item-image">

                          {image &&
                          !imageFailed ? (
                            <img
                              src={
                                image
                              }
                              alt={
                                itemName
                              }
                              loading="lazy"
                              onError={() =>
                                handleImageError(
                                  itemId
                                )
                              }
                            />
                          ) : (
                            <div className="order-details-item-no-image">

                              <span>
                                SE
                              </span>

                              <small>
                                No Image
                              </small>

                            </div>
                          )}

                        </div>

                        {/* INFO */}

                        <div className="order-details-item-info">

                          <h3>
                            {itemName}
                          </h3>

                          {item.sku && (
                            <p>
                              SKU:{" "}
                              <strong>
                                {
                                  item.sku
                                }
                              </strong>
                            </p>
                          )}

                          {item.brand && (
                            <p>
                              Brand:{" "}
                              <strong>
                                {
                                  typeof item.brand ===
                                  "object"
                                    ? item.brand?.name
                                    : item.brand
                                }
                              </strong>
                            </p>
                          )}

                          <p>
                            Price:{" "}
                            <strong>
                              {formatCurrency(
                                itemPrice
                              )}
                            </strong>
                          </p>

                        </div>

                        {/* QUANTITY */}

                        <div className="order-details-item-quantity">

                          <span>
                            Quantity
                          </span>

                          <strong>
                            {quantity}
                          </strong>

                        </div>

                        {/* TOTAL */}

                        <div className="order-details-item-total">

                          <span>
                            Total
                          </span>

                          <strong>
                            {formatCurrency(
                              itemTotal
                            )}
                          </strong>

                        </div>

                      </article>
                    );
                  }
                )}

              </div>
            )}

          </div>

          {/* ==================================================
              SUMMARY
              ================================================== */}

          <aside className="order-details-summary">

            <div className="order-details-section-heading">

              <span>
                PAYMENT SUMMARY
              </span>

              <h2>
                Order Summary
              </h2>

            </div>

            <div className="order-details-summary-row">

              <span>
                Items
              </span>

              <strong>
                {totalQuantity}
              </strong>

            </div>

            <div className="order-details-summary-row">

              <span>
                Subtotal
              </span>

              <strong>
                {formatCurrency(
                  subtotal
                )}
              </strong>

            </div>

            {shippingAmount >
              0 && (
              <div className="order-details-summary-row">

                <span>
                  Shipping
                </span>

                <strong>
                  {formatCurrency(
                    shippingAmount
                  )}
                </strong>

              </div>
            )}

            {taxAmount >
              0 && (
              <div className="order-details-summary-row">

                <span>
                  Tax
                </span>

                <strong>
                  {formatCurrency(
                    taxAmount
                  )}
                </strong>

              </div>
            )}

            {discountAmount >
              0 && (
              <div className="order-details-summary-row">

                <span>
                  Discount
                </span>

                <strong>
                  -{" "}
                  {formatCurrency(
                    discountAmount
                  )}
                </strong>

              </div>
            )}

            <div className="order-details-summary-divider" />

            <div className="order-details-summary-total">

              <span>
                Order Total
              </span>

              <strong>
                {formatCurrency(
                  total
                )}
              </strong>

            </div>

            <div className="order-details-payment-box">

              <span>
                Payment
              </span>

              <strong>
                {getStatusLabel(
                  paymentStatus
                )}
              </strong>

              <small>
                {getStatusLabel(
                  paymentMethod
                )}
              </small>

            </div>

          </aside>

        </div>

        {/* ==================================================
            DELIVERY ADDRESS
            ================================================== */}

        <div className="order-details-address-section">

          <div className="order-details-section-heading">

            <span>
              DELIVERY INFORMATION
            </span>

            <h2>
              Delivery Address
            </h2>

          </div>

          <div className="order-details-address-card">

            <div className="order-details-address-icon">
              📍
            </div>

            <div>

              {addressName && (
                <h3>
                  {addressName}
                </h3>
              )}

              {addressPhone && (
                <p>
                  Phone:{" "}
                  {addressPhone}
                </p>
              )}

              {addressLine1 && (
                <p>
                  {addressLine1}
                </p>
              )}

              {addressLine2 && (
                <p>
                  {addressLine2}
                </p>
              )}

              {(addressCity ||
                addressState ||
                addressPostalCode) && (
                <p>

                  {addressCity}

                  {addressCity &&
                    addressState &&
                    ", "}

                  {addressState}

                  {(addressCity ||
                    addressState) &&
                    addressPostalCode &&
                    " - "}

                  {addressPostalCode}

                </p>
              )}

              {addressCountry && (
                <p>
                  {addressCountry}
                </p>
              )}

              {!addressName &&
                !addressPhone &&
                !addressLine1 &&
                !addressLine2 &&
                !addressCity &&
                !addressState &&
                !addressPostalCode && (
                  <p>
                    Delivery address
                    information is
                    unavailable.
                  </p>
                )}

            </div>

          </div>

        </div>

        {/* ==================================================
            ACTIONS
            ================================================== */}

        <div className="order-details-actions">

          <Link
            to="/orders"
            className="order-details-secondary-button"
          >
            ← My Orders
          </Link>

          <Link
            to="/products"
            className="order-details-primary-button"
          >
            Continue Shopping
          </Link>

        </div>

      </div>

    </section>
  );
}

export default OrderDetailsPage;