
// ============================================================
// SHANTI ENTERPRISES
// Order Success Page
// Frontend Phase 6 - UI/UX
// ============================================================

import {
  Link,
  useParams,
} from "react-router-dom";

// ============================================================
// ORDER SUCCESS PAGE
// ============================================================

function OrderSuccessPage() {
  const {
    orderId,
  } = useParams();

  return (
    <section className="order-success-page">

      <div className="order-success-container">

        {/* ==================================================
            SUCCESS CARD
            ================================================== */}

        <div className="order-success-card">

          {/* SUCCESS ICON */}

          <div
            className="order-success-icon"
            aria-hidden="true"
          >
            ✓
          </div>

          {/* EYEBROW */}

          <span className="order-success-eyebrow">
            ORDER CONFIRMED
          </span>

          {/* TITLE */}

          <h1>
            Order Placed Successfully!
          </h1>

          {/* MESSAGE */}

          <p className="order-success-message">
            Thank you for shopping with
            Shanti Enterprises. Your order
            has been created successfully.
          </p>

          {/* ==================================================
              ORDER ID
              ================================================== */}

          {orderId && (
            <div className="order-success-order-id">

              <span>
                ORDER ID
              </span>

              <strong title={orderId}>
                {orderId}
              </strong>

            </div>
          )}

          {/* ==================================================
              PAYMENT STATUS
              ================================================== */}

          <div className="order-success-status">

            <div
              className="order-success-status-icon"
              aria-hidden="true"
            >
              ✓
            </div>

            <div>

              <strong>
                Payment Successful
              </strong>

              <p>
                Your order is now being
                processed.
              </p>

            </div>

          </div>

          {/* ==================================================
              ACTIONS
              ================================================== */}

          <div className="order-success-actions">

            {/* TRACK ORDER */}

            {orderId && (
              <Link
                to={`/orders/${orderId}`}
                className="order-success-primary-button"
              >
                Track Order

                <span aria-hidden="true">
                  →
                </span>
              </Link>
            )}

            {/* MY ORDERS */}

            <Link
              to="/orders"
              className="order-success-secondary-button"
            >
              My Orders
            </Link>

            {/* CONTINUE SHOPPING */}

            <Link
              to="/products"
              className="order-success-shopping-link"
            >
              Continue Shopping
            </Link>

          </div>

        </div>

        {/* ==================================================
            HELP / INFORMATION CARDS
            ================================================== */}

        <div className="order-success-info">

          {/* ORDER PROCESSING */}

          <div className="order-success-info-item">

            <span aria-hidden="true">
              📦
            </span>

            <div>

              <strong>
                Order Processing
              </strong>

              <p>
                We will start processing
                your order shortly.
              </p>

            </div>

          </div>

          {/* TRACK ORDER */}

          <div className="order-success-info-item">

            <span aria-hidden="true">
              🚚
            </span>

            <div>

              <strong>
                Track Your Order
              </strong>

              <p>
                You can check your order
                status from My Orders.
              </p>

            </div>

          </div>

          {/* SECURE TRANSACTION */}

          <div className="order-success-info-item">

            <span aria-hidden="true">
              🔒
            </span>

            <div>

              <strong>
                Secure Transaction
              </strong>

              <p>
                Your payment was processed
                securely.
              </p>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

// ============================================================
// EXPORT
// ============================================================

export default OrderSuccessPage;