// ============================================================
// SHANTI ENTERPRISES — OrderDetailsPage
// Premium Customer Order Details
// ============================================================

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getOrderById } from "../../api/orderApi";
import Loading from "../../components/common/Loading";
import ErrorMessage from "../../components/common/ErrorMessage";
import "./OrderDetailsPage.css";

// ============================================================
// HELPERS
// ============================================================

const fmt = (n) =>
  `₹${Number(n || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const fmtDate = (v, withTime = false) => {
  if (!v) return "—";

  const d = new Date(v);

  if (Number.isNaN(d.getTime())) return "—";

  return d.toLocaleString(
    "en-IN",
    withTime
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

const fmtLabel = (s) =>
  String(s || "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const extractOrder = (r) =>
  r?.order ||
  r?.data?.order ||
  r?.data ||
  r;

const getImg = (img) => {
  if (!img) return "";

  if (typeof img === "string") {
    return img;
  }

  return (
    img.url ||
    img.secure_url ||
    img.src ||
    ""
  );
};

const getStatusTone = (s) => {
  const v = String(s || "").toLowerCase();

  if (
    v.includes("deliver") ||
    v.includes("complete")
  ) {
    return "success";
  }

  if (v.includes("cancel")) {
    return "danger";
  }

  if (
    v.includes("ship") ||
    v.includes("transit")
  ) {
    return "info";
  }

  if (
    v.includes("confirm") ||
    v.includes("process")
  ) {
    return "success";
  }

  return "warning";
};

// ============================================================
// PROGRESS STEPS
// ============================================================

const STEPS = [
  {
    key: "pending",
    label: "Order Placed",
    icon: "📋",
    desc: "Order received and confirmed.",
  },
  {
    key: "processing",
    label: "Processing",
    icon: "⚙",
    desc: "Being prepared for dispatch.",
  },
  {
    key: "shipped",
    label: "Shipped",
    icon: "🚚",
    desc: "Handed to delivery partner.",
  },
  {
    key: "delivered",
    label: "Delivered",
    icon: "✓",
    desc: "Successfully delivered.",
  },
];

const normalizeStep = (s) => {
  const v = String(s || "")
    .toLowerCase()
    .replace(/-/g, "_");

  if (
    ["pending", "placed", "created"].includes(v)
  ) {
    return "pending";
  }

  if (
    [
      "confirmed",
      "processing",
      "processed",
      "packed",
    ].includes(v)
  ) {
    return "processing";
  }

  if (
    [
      "shipped",
      "out_for_delivery",
      "dispatched",
      "in_transit",
    ].includes(v)
  ) {
    return "shipped";
  }

  if (
    ["delivered", "completed"].includes(v)
  ) {
    return "delivered";
  }

  if (
    ["cancelled", "canceled"].includes(v)
  ) {
    return "cancelled";
  }

  return "pending";
};

// ============================================================
// TIMELINE
// ============================================================

function OrderTimeline({
  status,
}) {
  const normalized =
    normalizeStep(status);

  if (normalized === "cancelled") {
    return (
      <div className="order-details-cancelled">
        <div className="order-details-cancelled-icon">
          ×
        </div>

        <div>
          <strong>
            Order Cancelled
          </strong>

          <p>
            This order has been cancelled and
            will not proceed further.
          </p>
        </div>
      </div>
    );
  }

  const stepIdx =
    STEPS.findIndex(
      (step) =>
        step.key === normalized
    );

  const current =
    stepIdx >= 0
      ? stepIdx
      : 0;

  return (
    <div className="order-details-timeline">
      {STEPS.map(
        (step, index) => {
          const done =
            index <= current;

          const active =
            index === current;

          const last =
            index ===
            STEPS.length - 1;

          return (
            <div
              key={step.key}
              className={`order-details-step ${
                done ? "done" : ""
              } ${active ? "active" : ""}`}
            >
              {!last && (
                <span
                  className={`order-details-connector ${
                    index < current
                      ? "complete"
                      : ""
                  }`}
                />
              )}

              <div className="order-details-step-circle">
                {done
                  ? active
                    ? step.icon
                    : "✓"
                  : step.icon}
              </div>

              <div className="order-details-step-copy">
                <strong>
                  {step.label}
                </strong>

                {active ? (
                  <span>
                    Current
                  </span>
                ) : (
                  <small>
                    {step.desc}
                  </small>
                )}
              </div>
            </div>
          );
        }
      )}
    </div>
  );
}

// ============================================================
// INFO CHIP
// ============================================================

function OverviewChip({
  label,
  value,
  tone = "",
}) {
  return (
    <div
      className={`order-details-overview-chip ${tone}`}
    >
      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>
    </div>
  );
}

// ============================================================
// ORDER DETAILS PAGE
// ============================================================

function OrderDetailsPage() {
  const { orderId } =
    useParams();

  const [order, setOrder] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [imgErrors, setImgErrors] =
    useState({});

  // ==========================================================
  // LOAD ORDER
  // ==========================================================

  const loadOrder = async (
    full = true
  ) => {
    if (!orderId) {
      setLoading(false);
      setError(
        "Order ID missing."
      );
      return;
    }

    try {
      if (full) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError("");

      const response =
        await getOrderById(
          orderId
        );

      const foundOrder =
        extractOrder(
          response
        );

      if (
        !foundOrder ||
        typeof foundOrder !==
          "object"
      ) {
        setOrder(null);
        return;
      }

      setOrder(
        foundOrder
      );
    } catch (err) {
      setError(
        err?.response?.data
          ?.message ||
          err?.message ||
          "Unable to load order."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadOrder(true);
  }, [orderId]);

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <section className="order-details-page order-details-loading-page">
        <div className="order-details-loading-card">
          <div className="order-details-loading-mark">
            <span />
          </div>

          <span className="order-details-loading-kicker">
            SHANTI ENTERPRISES
          </span>

          <h1>
            Loading order details
          </h1>

          <p>
            Fetching your order information...
          </p>

          <Loading message="Please wait…" />
        </div>
      </section>
    );
  }

  // ==========================================================
  // ERROR WITHOUT ORDER
  // ==========================================================

  if (
    error &&
    !order
  ) {
    return (
      <section className="order-details-page">
        <div className="order-details-container order-details-error-page">

          <Link
            to="/orders"
            className="order-details-back-link"
          >
            <span>←</span>
            Back to Orders
          </Link>

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
        <div className="order-details-container order-details-error-page">

          <Link
            to="/orders"
            className="order-details-back-link"
          >
            <span>←</span>
            Back to Orders
          </Link>

          <div className="order-details-not-found">
            <div>
              📦
            </div>

            <span>
              ORDER LOOKUP
            </span>

            <h2>
              Order not found
            </h2>

            <p>
              We couldn't find the order you're
              looking for.
            </p>

            <Link to="/orders">
              View My Orders →
            </Link>
          </div>

        </div>
      </section>
    );
  }

  // ==========================================================
  // DERIVED VALUES
  // ==========================================================

  const items =
    Array.isArray(order.items)
      ? order.items
      : [];

  const status =
    order.orderStatus ||
    order.status ||
    "pending";

  const paymentStatus =
    order.paymentStatus ||
    "pending";

  const paymentMethod =
    order.paymentMethod ||
    "—";

  const total = Number(
    order.totalAmount ??
      order.total ??
      0
  );

  const subtotal = Number(
    order.subtotal ??
      order.subTotal ??
      total
  );

  const shipping = Number(
    order.shippingAmount ??
      order.shippingCost ??
      0
  );

  const tax = Number(
    order.taxAmount ??
      order.tax ??
      0
  );

  const discount = Number(
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
    order._id;

  const statusTone =
    getStatusTone(
      status
    );

  const paymentTone =
    getStatusTone(
      paymentStatus
    );

  const totalQty = items.reduce(
    (sum, item) => sum + Number(item?.quantity || 0),
    0
  );

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <section className="order-details-page">

      <div className="order-details-glow order-details-glow-one" />
      <div className="order-details-glow order-details-glow-two" />

      {/* ======================================================
          HERO
          ====================================================== */}

      <div className="order-details-hero">

        <div className="order-details-container">

          <div className="order-details-hero-row">

            <div className="order-details-hero-copy">

              <Link
                to="/orders"
                className="order-details-hero-back"
              >
                <span>←</span>
                My Orders
              </Link>

              <div className="order-details-eyebrow">
                <span />
                ORDER DETAILS
              </div>

              <h1>
                Order #
                {orderNumber}
                <span>
                  .
                </span>
              </h1>

              {order.createdAt && (
                <p>
                  Placed on{" "}
                  {fmtDate(
                    order.createdAt,
                    true
                  )}
                </p>
              )}

            </div>

            <div className="order-details-hero-actions">

              <span
                className={`order-details-status-pill ${statusTone}`}
              >
                <b>
                  {statusTone ===
                  "success"
                    ? "✓"
                    : statusTone ===
                        "danger"
                      ? "×"
                      : "•"}
                </b>

                {fmtLabel(
                  status
                )}
              </span>

              <button
                type="button"
                className="order-details-refresh"
                onClick={() =>
                  loadOrder(false)
                }
                disabled={
                  refreshing
                }
              >
                {refreshing ? (
                  <span className="order-details-refresh-spinner" />
                ) : (
                  <span>
                    ↻
                  </span>
                )}

                {refreshing
                  ? "Refreshing"
                  : "Refresh"}
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* ======================================================
          CONTENT
          ====================================================== */}

      <div className="order-details-container order-details-content">

        {error && (
          <div className="order-details-inline-error">
            <ErrorMessage
              message={error}
              onRetry={() =>
                loadOrder(false)
              }
            />
          </div>
        )}

        {/* ====================================================
            OVERVIEW
            ==================================================== */}

        <div className="order-details-overview">

          <OverviewChip
            label="Order Status"
            value={fmtLabel(status)}
            tone={statusTone}
          />

          <OverviewChip
            label="Payment Status"
            value={fmtLabel(
              paymentStatus
            )}
            tone={paymentTone}
          />

          <OverviewChip
            label="Payment Method"
            value={fmtLabel(
              paymentMethod
            )}
          />

          <OverviewChip
            label="Total Items"
            value={`${totalQty} ${
              totalQty === 1
                ? "item"
                : "items"
            }`}
          />

        </div>

        {/* ====================================================
            PROGRESS
            ==================================================== */}

        <section className="order-details-panel order-details-progress-panel">

          <div className="order-details-panel-heading">

            <div>
              <span>
                ORDER PROGRESS
              </span>

              <h2>
                Track Your Order
              </h2>
            </div>

            <div className="order-details-progress-mark">
              {normalizeStep(
                status
              ) ===
              "delivered"
                ? "✓"
                : "●"}
            </div>

          </div>

          <OrderTimeline
            status={status}
          />

        </section>

        {/* ====================================================
            MAIN
            ==================================================== */}

        <div className="order-details-main-grid">

          {/* ==================================================
              LEFT
              ================================================== */}

          <div className="order-details-left">

            {/* ==================================================
                ITEMS
                ================================================== */}

            <section className="order-details-panel order-details-items-panel">

              <div className="order-details-panel-heading order-details-items-heading">

                <div>
                  <span>
                    ORDER ITEMS
                  </span>

                  <h2>
                    Products
                    <b>
                      {items.length}
                    </b>
                  </h2>
                </div>

                <span className="order-details-items-total">
                  {totalQty} total units
                </span>

              </div>

              {items.length ===
              0 ? (
                <div className="order-details-no-items">
                  <div>
                    📦
                  </div>

                  <p>
                    No items found for this order.
                  </p>
                </div>
              ) : (
                <div className="order-details-item-list">

                  {items.map(
                    (
                      item,
                      index
                    ) => {
                      const itemId =
                        item?._id ||
                        item?.productId ||
                        index;

                      const itemName =
                        item?.name ||
                        item?.productName ||
                        "Product";

                      const itemPrice =
                        Number(
                          item?.price ||
                            0
                        );

                      const quantity =
                        Number(
                          item?.quantity ||
                            0
                        );

                      const itemTotal =
                        Number(
                          item?.total ??
                            item?.subtotal ??
                            itemPrice *
                              quantity
                        );

                      const image =
                        getImg(
                          item?.image ||
                            item?.productImage
                        );

                      return (
                        <div
                          key={
                            itemId
                          }
                          className="order-details-item"
                        >

                          <div className="order-details-item-image">

                            {image &&
                            !imgErrors[
                              itemId
                            ] ? (
                              <img
                                src={
                                  image
                                }
                                alt={
                                  itemName
                                }
                                loading="lazy"
                                onError={() =>
                                  setImgErrors(
                                    (
                                      current
                                    ) => ({
                                      ...current,
                                      [itemId]:
                                        true,
                                    })
                                  )
                                }
                              />
                            ) : (
                              <span>
                                📦
                              </span>
                            )}

                          </div>

                          <div className="order-details-item-info">

                            <h3>
                              {itemName}
                            </h3>

                            <p>
                              {fmt(
                                itemPrice
                              )}{" "}
                              ×{" "}
                              {quantity}{" "}
                              {item?.unit ||
                                "unit"}
                              {quantity !==
                              1
                                ? "s"
                                : ""}
                            </p>

                            {item?.sku && (
                              <span>
                                SKU:{" "}
                                {
                                  item.sku
                                }
                              </span>
                            )}

                          </div>

                          <div className="order-details-item-total">
                            <span>
                              LINE TOTAL
                            </span>

                            <strong>
                              {fmt(
                                itemTotal
                              )}
                            </strong>
                          </div>

                        </div>
                      );
                    }
                  )}

                </div>
              )}

            </section>

            {/* ==================================================
                ADDRESS
                ================================================== */}

            <section className="order-details-panel order-details-address-panel">

              <div className="order-details-panel-heading">

                <div>
                  <span>
                    DELIVERY INFORMATION
                  </span>

                  <h2>
                    Shipping Address
                  </h2>
                </div>

                <div className="order-details-address-icon">
                  📍
                </div>

              </div>

              <div className="order-details-address-content">

                <div className="order-details-address-mark">
                  <span />
                </div>

                <div className="order-details-address-copy">

                  {address.name && (
                    <strong>
                      {
                        address.name
                      }
                    </strong>
                  )}

                  {address.phone && (
                    <p>
                      {
                        address.phone
                      }
                    </p>
                  )}

                  {address.addressLine1 && (
                    <p>
                      {
                        address.addressLine1
                      }
                    </p>
                  )}

                  {address.addressLine2 && (
                    <p>
                      {
                        address.addressLine2
                      }
                    </p>
                  )}

                  {(address.city ||
                    address.state ||
                    address.postalCode) && (
                    <p>
                      {[
                        address.city,
                        address.state,
                        address.postalCode,
                      ]
                        .filter(
                          Boolean
                        )
                        .join(
                          ", "
                        )}
                    </p>
                  )}

                  {address.country && (
                    <p>
                      {
                        address.country
                      }
                    </p>
                  )}

                  {!address.name &&
                    !address.addressLine1 && (
                      <p className="order-details-address-unavailable">
                        Delivery address not available.
                      </p>
                    )}

                </div>

              </div>

            </section>

          </div>

          {/* ==================================================
              RIGHT
              ================================================== */}

          <aside className="order-details-right">

            {/* ==================================================
                SUMMARY
                ================================================== */}

            <section className="order-details-panel order-details-summary-panel">

              <div className="order-details-panel-heading">

                <div>
                  <span>
                    PAYMENT SUMMARY
                  </span>

                  <h2>
                    Order Total
                  </h2>
                </div>

              </div>

              <div className="order-details-summary-rows">

                <div>
                  <span>
                    Items
                  </span>

                  <strong>
                    {fmt(
                      subtotal
                    )}
                  </strong>
                </div>

                {shipping >
                  0 && (
                  <div>
                    <span>
                      Shipping
                    </span>

                    <strong>
                      {fmt(
                        shipping
                      )}
                    </strong>
                  </div>
                )}

                {tax > 0 && (
                  <div>
                    <span>
                      Tax
                    </span>

                    <strong>
                      {fmt(tax)}
                    </strong>
                  </div>
                )}

                {discount >
                  0 && (
                  <div className="discount">
                    <span>
                      Discount
                    </span>

                    <strong>
                      -{" "}
                      {fmt(
                        discount
                      )}
                    </strong>
                  </div>
                )}

              </div>

              <div className="order-details-total-row">

                <span>
                  Total
                </span>

                <strong>
                  {fmt(total)}
                </strong>

              </div>

            </section>

            {/* ==================================================
                PAYMENT
                ================================================== */}

            <section
              className={`order-details-payment-card ${paymentTone}`}
            >

              <div className="order-details-payment-icon">
                {String(
                  paymentStatus
                ).toLowerCase() ===
                "paid"
                  ? "✓"
                  : "₹"}
              </div>

              <div>
                <span>
                  PAYMENT
                </span>

                <strong>
                  {fmtLabel(
                    paymentStatus
                  )}
                </strong>

                <p>
                  {fmtLabel(
                    paymentMethod
                  )}
                </p>
              </div>

            </section>

            {/* ==================================================
                QUICK ACTIONS
                ================================================== */}

            <section className="order-details-actions">

              <Link
                to="/orders"
                className="order-details-secondary-button"
              >
                <span>
                  ←
                </span>
                My Orders
              </Link>

              <Link
                to="/products"
                className="order-details-primary-button"
              >
                Continue Shopping
                <span>
                  →
                </span>
              </Link>

            </section>

          </aside>

        </div>

        {/* ====================================================
            BOTTOM NAV
            ==================================================== */}

        <nav
          className="order-details-footer-nav"
          aria-label="Customer account navigation"
        >
          <Link to="/profile">
            <span>
              Profile
            </span>
            <b>→</b>
          </Link>

          <Link to="/addresses">
            <span>
              Addresses
            </span>
            <b>→</b>
          </Link>

          <Link to="/quotations">
            <span>
              Quotations
            </span>
            <b>→</b>
          </Link>

          <Link to="/rfqs">
            <span>
              RFQs
            </span>
            <b>→</b>
          </Link>
        </nav>

      </div>
    </section>
  );
}

export default OrderDetailsPage;
