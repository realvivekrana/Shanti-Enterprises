// ============================================================
// SHANTI ENTERPRISES
// Order Tracking Component
// Frontend Phase 4 - Customer
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
      "Your order is being prepared.",
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
  const value = String(
    status || "pending"
  )
    .trim()
    .toLowerCase();

  if (
    value === "placed" ||
    value === "order placed" ||
    value === "created"
  ) {
    return "pending";
  }

  if (
    value === "confirmed" ||
    value === "processing"
  ) {
    return "processing";
  }

  if (
    value === "shipped" ||
    value === "out_for_delivery" ||
    value === "out for delivery"
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
// ORDER TRACKING
// ============================================================

function OrderTracking({
  order,
}) {
  if (!order) {
    return null;
  }

  const status = normalizeStatus(
    order.status ||
      order.orderStatus
  );

  // ==========================================================
  // CANCELLED
  // ==========================================================

  if (status === "cancelled") {
    return (
      <section>

        <h2>
          Order Tracking
        </h2>

        <div>

          <h3>
            Order Cancelled
          </h3>

          <p>
            This order has been
            cancelled.
          </p>

        </div>

      </section>
    );
  }

  const currentIndex =
    TRACKING_STEPS.findIndex(
      (step) =>
        step.key === status
    );

  return (
    <section>

      <h2>
        Order Tracking
      </h2>

      <div>

        {TRACKING_STEPS.map(
          (step, index) => {

            const completed =
              index <=
              currentIndex;

            const active =
              index ===
              currentIndex;

            return (
              <div
                key={step.key}
              >

                <div>

                  <span>
                    {completed
                      ? "✓"
                      : index + 1}
                  </span>

                </div>

                <div>

                  <h3>
                    {step.title}
                  </h3>

                  <p>
                    {step.description}
                  </p>

                  {active && (
                    <strong>
                      Current Status
                    </strong>
                  )}

                </div>

              </div>
            );
          }
        )}

      </div>

    </section>
  );
}

export default OrderTracking;