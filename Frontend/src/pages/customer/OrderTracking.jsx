// ============================================================
// SHANTI ENTERPRISES
// Order Tracking Component
// Frontend Phase 6 - Complete Customer Tracking
// ============================================================

import {
  Link,
} from "react-router-dom";

// ============================================================
// TRACKING STEPS
// ============================================================

const TRACKING_STEPS = [
  {
    key: "pending",
    title: "Order Placed",
    description:
      "Your order has been received successfully.",
  },

  {
    key: "processing",
    title: "Processing",
    description:
      "Your order is being prepared for dispatch.",
  },

  {
    key: "shipped",
    title: "Shipped",
    description:
      "Your order has been handed over for delivery.",
  },

  {
    key: "delivered",
    title: "Delivered",
    description:
      "Your order has been delivered successfully.",
  },
];

// ============================================================
// NORMALIZE STATUS
// ============================================================

const normalizeStatus = (
  status
) => {
  const value =
    String(
      status || "pending"
    )
      .trim()
      .toLowerCase()
      .replace(
        /-/g,
        "_"
      );

  if (
    value === "pending" ||
    value === "placed" ||
    value === "order_placed" ||
    value === "order placed" ||
    value === "created"
  ) {
    return "pending";
  }

  if (
    value === "confirmed" ||
    value === "processing" ||
    value === "processed" ||
    value === "packed" ||
    value === "ready_to_ship"
  ) {
    return "processing";
  }

  if (
    value === "shipped" ||
    value === "out_for_delivery" ||
    value === "out for delivery" ||
    value === "dispatched" ||
    value === "in_transit"
  ) {
    return "shipped";
  }

  if (
    value === "delivered" ||
    value === "completed"
  ) {
    return "delivered";
  }

  if (
    value === "cancelled" ||
    value === "canceled"
  ) {
    return "cancelled";
  }

  return "pending";
};

// ============================================================
// STATUS LABEL
// ============================================================

const getStatusLabel = (
  status
) => {
  const normalized =
    normalizeStatus(
      status
    );

  if (
    normalized ===
    "processing"
  ) {
    return "Processing";
  }

  if (
    normalized ===
    "shipped"
  ) {
    return "Shipped";
  }

  if (
    normalized ===
    "delivered"
  ) {
    return "Delivered";
  }

  if (
    normalized ===
    "cancelled"
  ) {
    return "Cancelled";
  }

  return "Order Placed";
};

// ============================================================
// DATE FORMATTER
// ============================================================

const formatDate = (
  value
) => {
  if (!value) {
    return "";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
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
// ORDER TRACKING
// ============================================================

function OrderTracking({
  order,
}) {
  if (!order) {
    return null;
  }

  // ==========================================================
  // STATUS
  // ==========================================================

  const status =
    normalizeStatus(
      order.status ||
        order.orderStatus
    );

  // ==========================================================
  // CANCELLED
  // ==========================================================

  if (
    status ===
    "cancelled"
  ) {
    return (
      <section className="order-tracking">

        <div className="order-tracking-header">

          <div>

            <span className="order-tracking-eyebrow">
              ORDER PROGRESS
            </span>

            <h2>
              Order Tracking
            </h2>

          </div>

          <span className="order-tracking-cancelled-badge">
            Cancelled
          </span>

        </div>

        <div className="order-tracking-cancelled-card">

          <div className="order-tracking-cancelled-icon">
            ×
          </div>

          <div>

            <h3>
              Order Cancelled
            </h3>

            <p>
              This order has been
              cancelled and will not
              continue through the
              delivery process.
            </p>

            {order.updatedAt && (
              <small>
                Last updated:{" "}
                {formatDate(
                  order.updatedAt
                )}
              </small>
            )}

          </div>

        </div>

        <div className="order-tracking-cancelled-actions">

          <Link
            to="/orders"
            className="order-tracking-secondary-button"
          >
            ← My Orders
          </Link>

          <Link
            to="/products"
            className="order-tracking-primary-button"
          >
            Continue Shopping
          </Link>

        </div>

      </section>
    );
  }

  // ==========================================================
  // CURRENT STEP
  // ==========================================================

  const currentIndex =
    TRACKING_STEPS.findIndex(
      (step) =>
        step.key ===
        status
    );

  const safeCurrentIndex =
    currentIndex >= 0
      ? currentIndex
      : 0;

  // ==========================================================
  // PAYMENT STATUS
  // ==========================================================

  const paymentStatus =
    String(
      order.paymentStatus ||
        ""
    )
      .trim()
      .toLowerCase();

  const paymentSuccessful =
    paymentStatus ===
      "paid" ||
    paymentStatus ===
      "completed" ||
    paymentStatus ===
      "success" ||
    paymentStatus ===
      "successful";

  // ==========================================================
  // SHIPPING INFO
  // ==========================================================

  const shipment =
    order.shipment ||
    order.shipping ||
    {};

  const trackingNumber =
    shipment.trackingNumber ||
    shipment.trackingId ||
    order.trackingNumber ||
    order.trackingId ||
    "";

  const courier =
    shipment.courier ||
    shipment.carrier ||
    order.courier ||
    order.carrier ||
    "";

  const estimatedDelivery =
    shipment.estimatedDelivery ||
    order.estimatedDelivery ||
    order.expectedDelivery ||
    "";

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <section className="order-tracking">

      {/* ==================================================
          HEADER
          ================================================== */}

      <div className="order-tracking-header">

        <div>

          <span className="order-tracking-eyebrow">
            ORDER PROGRESS
          </span>

          <h2>
            Order Tracking
          </h2>

        </div>

        <span className="order-tracking-current-badge">

          {getStatusLabel(
            status
          )}

        </span>

      </div>

      {/* ==================================================
          TIMELINE
          ================================================== */}

      <div className="order-tracking-timeline">

        {TRACKING_STEPS.map(
          (
            step,
            index
          ) => {

            const completed =
              index <=
              safeCurrentIndex;

            const active =
              index ===
              safeCurrentIndex;

            const upcoming =
              index >
              safeCurrentIndex;

            return (
              <div
                className={`order-tracking-step ${
                  completed
                    ? "order-tracking-step-completed"
                    : ""
                } ${
                  active
                    ? "order-tracking-step-active"
                    : ""
                } ${
                  upcoming
                    ? "order-tracking-step-upcoming"
                    : ""
                }`}
                key={
                  step.key
                }
              >

                {/* STEP ICON */}

                <div className="order-tracking-step-marker">

                  <span>

                    {completed
                      ? "✓"
                      : index + 1}

                  </span>

                </div>

                {/* STEP CONTENT */}

                <div className="order-tracking-step-content">

                  <div className="order-tracking-step-heading">

                    <h3>
                      {step.title}
                    </h3>

                    {active && (
                      <span className="order-tracking-current-label">
                        Current
                      </span>
                    )}

                    {completed &&
                      !active && (
                        <span className="order-tracking-completed-label">
                          Completed
                        </span>
                      )}

                  </div>

                  <p>
                    {step.description}
                  </p>

                </div>

                {/* CONNECTOR */}

                {index <
                  TRACKING_STEPS.length -
                    1 && (
                  <div className="order-tracking-connector" />
                )}

              </div>
            );
          }
        )}

      </div>

      {/* ==================================================
          CURRENT STATUS MESSAGE
          ================================================== */}

      <div className="order-tracking-status-card">

        <div className="order-tracking-status-icon">
          {status ===
          "delivered"
            ? "✓"
            : status ===
                "shipped"
              ? "🚚"
              : status ===
                  "processing"
                ? "📦"
                : "✓"}
        </div>

        <div>

          <span>
            Current Status
          </span>

          <strong>
            {getStatusLabel(
              status
            )}
          </strong>

          <p>

            {status ===
              "delivered" &&
              "Your order has been delivered successfully."}

            {status ===
              "shipped" &&
              "Your order is currently on its way to you."}

            {status ===
              "processing" &&
              "Your order is being prepared for dispatch."}

            {status ===
              "pending" &&
              "Your order has been received and is awaiting processing."}

          </p>

        </div>

      </div>

      {/* ==================================================
          SHIPPING INFORMATION
          ================================================== */}

      {(trackingNumber ||
        courier ||
        estimatedDelivery) && (
        <div className="order-tracking-shipping-card">

          <div className="order-tracking-shipping-header">

            <span>
              DELIVERY INFORMATION
            </span>

            <h3>
              Shipment Details
            </h3>

          </div>

          <div className="order-tracking-shipping-grid">

            {trackingNumber && (
              <div>

                <span>
                  Tracking Number
                </span>

                <strong>
                  {trackingNumber}
                </strong>

              </div>
            )}

            {courier && (
              <div>

                <span>
                  Courier
                </span>

                <strong>
                  {courier}
                </strong>

              </div>
            )}

            {estimatedDelivery && (
              <div>

                <span>
                  Expected Delivery
                </span>

                <strong>
                  {formatDate(
                    estimatedDelivery
                  )}
                </strong>

              </div>
            )}

          </div>

        </div>
      )}

      {/* ==================================================
          PAYMENT INFORMATION
          ================================================== */}

      {order.paymentStatus && (
        <div className="order-tracking-payment-card">

          <div className="order-tracking-payment-icon">

            {paymentSuccessful
              ? "✓"
              : "₹"}

          </div>

          <div>

            <span>
              PAYMENT
            </span>

            <strong>
              {paymentSuccessful
                ? "Payment Successful"
                : String(
                    order.paymentStatus
                  )
                    .replace(
                      /[-_]/g,
                      " "
                    )
                    .replace(
                      /\b\w/g,
                      (
                        letter
                      ) =>
                        letter.toUpperCase()
                    )}
            </strong>

            {order.paymentMethod && (
              <p>
                Method:{" "}
                {String(
                  order.paymentMethod
                )
                  .replace(
                    /[-_]/g,
                    " "
                  )
                  .replace(
                    /\b\w/g,
                    (
                      letter
                    ) =>
                      letter.toUpperCase()
                  )}
              </p>
            )}

          </div>

        </div>
      )}

      {/* ==================================================
          ACTIONS
          ================================================== */}

      <div className="order-tracking-actions">

        <Link
          to="/orders"
          className="order-tracking-secondary-button"
        >
          ← My Orders
        </Link>

        <Link
          to="/products"
          className="order-tracking-primary-button"
        >
          Continue Shopping
        </Link>

      </div>

    </section>
  );
}

export default OrderTracking;