// ============================================================
// SHANTI ENTERPRISES
// Order Success Page
// Frontend Phase 6 - Premium UI/UX
// ============================================================

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  ArrowRight,
  Check,
  CheckCircle2,
  LockKeyhole,
  PackageCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";

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

        <main className="order-success-card">

          {/* SUCCESS ICON */}

          <div
            className="order-success-icon"
            aria-hidden="true"
          >
            <Check
              size={34}
              strokeWidth={2.7}
            />
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

              <div className="order-success-order-id-label">
                <span>
                  ORDER ID
                </span>

                <small>
                  Your order reference
                </small>
              </div>

              <strong
                title={orderId}
              >
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
              <CheckCircle2
                size={23}
                strokeWidth={2.2}
              />
            </div>

            <div className="order-success-status-content">

              <strong>
                Payment Successful
              </strong>

              <p>
                Your order is now being
                processed.
              </p>

            </div>

            <span className="order-success-paid-badge">
              PAID
            </span>

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

                <span>
                  Track Order
                </span>

                <ArrowRight
                  size={18}
                  strokeWidth={2.3}
                />

              </Link>
            )}

            {/* MY ORDERS */}

            <Link
              to="/orders"
              className="order-success-secondary-button"
            >

              <PackageCheck
                size={18}
                strokeWidth={2}
              />

              <span>
                My Orders
              </span>

            </Link>

            {/* CONTINUE SHOPPING */}

            <Link
              to="/products"
              className="order-success-shopping-link"
            >

              <ShoppingBag
                size={17}
                strokeWidth={2}
              />

              <span>
                Continue Shopping
              </span>

            </Link>

          </div>

          {/* ==================================================
              SECURITY MESSAGE
              ================================================== */}

          <div className="order-success-security">

            <div className="order-success-security-icon">
              <LockKeyhole
                size={15}
              />
            </div>

            <span>
              Your payment was processed securely.
            </span>

          </div>

        </main>

        {/* ==================================================
            ORDER JOURNEY / INFORMATION CARDS
            ================================================== */}

        <div className="order-success-info">

          {/* ==================================================
              ORDER PROCESSING
              ================================================== */}

          <div className="order-success-info-item">

            <div className="order-success-info-icon">
              <PackageCheck
                size={21}
                strokeWidth={2}
              />
            </div>

            <div className="order-success-info-content">

              <span className="order-success-info-step">
                STEP 01
              </span>

              <strong>
                Order Processing
              </strong>

              <p>
                We will start processing
                your order shortly.
              </p>

            </div>

          </div>

          {/* ==================================================
              TRACK ORDER
              ================================================== */}

          <div className="order-success-info-item">

            <div className="order-success-info-icon">
              <Truck
                size={21}
                strokeWidth={2}
              />
            </div>

            <div className="order-success-info-content">

              <span className="order-success-info-step">
                STEP 02
              </span>

              <strong>
                Track Your Order
              </strong>

              <p>
                You can check your order
                status from My Orders.
              </p>

            </div>

          </div>

          {/* ==================================================
              SECURE TRANSACTION
              ================================================== */}

          <div className="order-success-info-item">

            <div className="order-success-info-icon">
              <LockKeyhole
                size={21}
                strokeWidth={2}
              />
            </div>

            <div className="order-success-info-content">

              <span className="order-success-info-step">
                SECURE
              </span>

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

        {/* ==================================================
            BOTTOM SHOPPING LINK
            ================================================== */}

        <div className="order-success-bottom">

          <Link
            to="/products"
            className="order-success-bottom-link"
          >

            <ShoppingBag
              size={17}
            />

            <span>
              Explore More Products
            </span>

            <ArrowRight
              size={16}
            />

          </Link>

        </div>

      </div>

    </section>
  );
}

// ============================================================
// EXPORT
// ============================================================

export default OrderSuccessPage;