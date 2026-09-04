// ============================================================
// SHANTI ENTERPRISES — Order Success Page
// Customer Phase — Premium, Responsive, Light/Dark Mode
// ============================================================

import { Link, useLocation, useParams } from "react-router-dom";

function OrderSuccessPage() {
  const { orderId } = useParams();
  const location = useLocation();

  const isCOD =
    location?.state?.paymentMethod === "cod";

  const steps = [
    {
      step: "01",
      icon: "⚙️",
      title: "Processing",
      description:
        "We start preparing your order immediately.",
    },
    {
      step: "02",
      icon: "🚚",
      title: "Dispatch",
      description:
        "Your order will be shipped to the delivery address.",
    },
    {
      step: "03",
      icon: "📦",
      title: "Delivery",
      description:
        "Your order will arrive at your doorstep.",
    },
  ];

  return (
    <>
      <section className="order-success-page">
        <div className="order-success-container">

          {/* ==================================================
              SUCCESS CARD
              ================================================== */}
          <div className="order-success-card">
            <div className="order-success-gradient-bar" />

            <div className="order-success-content">

              {/* SUCCESS ICON */}
              <div className="order-success-icon-wrap">
                <div className="order-success-icon">
                  ✓
                </div>
              </div>

              {/* EYEBROW */}
              <div className="order-success-eyebrow">
                <span className="order-success-eyebrow-dot">
                  ●
                </span>

                <span>
                  {isCOD
                    ? "Order Confirmed"
                    : "Payment Successful"}
                </span>
              </div>

              {/* HEADING */}
              <h1 className="order-success-title">
                Order Placed Successfully!
              </h1>

              {/* DESCRIPTION */}
              <p className="order-success-description">
                {isCOD
                  ? "Your COD order has been confirmed. Please keep the exact amount ready for delivery."
                  : "Thank you for shopping with Shanti Enterprises. Your payment has been received and your order is being processed."}
              </p>

              {/* ORDER REFERENCE */}
              {orderId && (
                <div className="order-success-reference">
                  <div className="order-success-reference-info">
                    <span className="order-success-reference-label">
                      Order Reference
                    </span>

                    <strong className="order-success-reference-id">
                      {orderId}
                    </strong>
                  </div>

                  <span className="order-success-payment-badge">
                    {isCOD ? "COD" : "PAID ✓"}
                  </span>
                </div>
              )}

              {/* PAYMENT / ORDER STATUS */}
              <div className="order-success-status-box">
                <div className="order-success-status-icon">
                  {isCOD ? "💵" : "✅"}
                </div>

                <div className="order-success-status-content">
                  <strong>
                    {isCOD
                      ? "Cash on Delivery"
                      : "Payment Confirmed"}
                  </strong>

                  <p>
                    {isCOD
                      ? "Pay the exact amount when your order arrives."
                      : "Your order is now being processed for dispatch."}
                  </p>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="order-success-actions">

                {orderId && (
                  <Link
                    to={`/orders/${orderId}`}
                    className="order-success-primary-button"
                  >
                    <span>📦</span>
                    <span>Track My Order</span>
                    <span>→</span>
                  </Link>
                )}

                <div className="order-success-secondary-actions">
                  <Link
                    to="/orders"
                    className="order-success-secondary-button"
                  >
                    <span>🗂️</span>
                    <span>My Orders</span>
                  </Link>

                  <Link
                    to="/products"
                    className="order-success-secondary-button"
                  >
                    <span>🛍️</span>
                    <span>Shop More</span>
                  </Link>
                </div>
              </div>

              {/* SECURITY NOTE */}
              <div className="order-success-security">
                <span>🔒</span>

                <span>
                  {isCOD
                    ? "Your order information is securely protected."
                    : "Your payment was processed securely by Razorpay."}
                </span>
              </div>
            </div>
          </div>

          {/* ==================================================
              WHAT'S NEXT
              ================================================== */}
          <div className="order-success-next">

            <div className="order-success-next-heading">
              <span>WHAT HAPPENS NEXT</span>
              <h2>Your order journey</h2>
              <p>
                We’ll keep your order moving from confirmation
                to delivery.
              </p>
            </div>

            <div className="order-success-steps">
              {steps.map((item) => (
                <div
                  className="order-success-step"
                  key={item.step}
                >
                  <div className="order-success-step-icon">
                    {item.icon}
                  </div>

                  <div className="order-success-step-number">
                    STEP {item.step}
                  </div>

                  <h3>{item.title}</h3>

                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ==================================================
              TRUST STRIP
              ================================================== */}
          <div className="order-success-trust-strip">
            <div className="order-success-trust-item">
              <span>🛡️</span>
              <div>
                <strong>Secure Checkout</strong>
                <small>
                  Your transaction is protected.
                </small>
              </div>
            </div>

            <div className="order-success-trust-divider" />

            <div className="order-success-trust-item">
              <span>📍</span>
              <div>
                <strong>Easy Tracking</strong>
                <small>
                  Follow your order anytime.
                </small>
              </div>
            </div>

            <div className="order-success-trust-divider" />

            <div className="order-success-trust-item">
              <span>🤝</span>
              <div>
                <strong>Business Support</strong>
                <small>
                  We’re here when you need us.
                </small>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================
          PAGE-SCOPED STYLES
          Kept inside this component so no additional CSS file
          is required.
          ====================================================== */}
      <style>{`
        .order-success-page {
          --os-bg: var(--se-bg, #f5f7fb);
          --os-surface: var(--se-surface, #ffffff);
          --os-surface-2: var(--se-surface-2, #f8fafc);
          --os-border: var(--se-border, #e2e8f0);
          --os-text: var(--se-text, #0f172a);
          --os-text-2: var(--se-text-2, #334155);
          --os-text-3: var(--se-text-3, #64748b);
          --os-text-4: var(--se-text-4, #94a3b8);
          --os-primary: var(--se-teal, #0d9488);
          --os-primary-hover: var(--se-teal-hover, #0f766e);
          --os-primary-soft: var(--se-teal-soft, #f0fdfa);
          --os-primary-light: var(--se-teal-light, #99f6e4);
          --os-success: var(--se-success, #059669);
          --os-success-bg: var(--se-success-bg, #ecfdf5);

          min-height: calc(100vh - 68px);
          padding: 48px 20px 64px;
          background:
            radial-gradient(
              circle at 10% 5%,
              rgba(20, 184, 166, 0.08),
              transparent 26%
            ),
            radial-gradient(
              circle at 90% 10%,
              rgba(124, 58, 237, 0.07),
              transparent 25%
            ),
            var(--os-bg);
          color: var(--os-text);
        }

        .order-success-container {
          width: 100%;
          max-width: 940px;
          margin: 0 auto;
        }

        .order-success-card {
          overflow: hidden;
          border: 1px solid var(--os-border);
          border-radius: 28px;
          background: var(--os-surface);
          box-shadow:
            0 24px 70px rgba(15, 23, 42, 0.10),
            0 8px 24px rgba(15, 23, 42, 0.05);
        }

        .order-success-gradient-bar {
          height: 7px;
          background:
            linear-gradient(
              90deg,
              #0d9488 0%,
              #2563eb 48%,
              #7c3aed 100%
            );
        }

        .order-success-content {
          max-width: 700px;
          margin: 0 auto;
          padding: 52px 44px 42px;
          text-align: center;
        }

        .order-success-icon-wrap {
          display: flex;
          justify-content: center;
          margin-bottom: 22px;
        }

        .order-success-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 92px;
          height: 92px;
          border-radius: 50%;
          color: #ffffff;
          font-size: 43px;
          font-weight: 900;
          background:
            linear-gradient(
              135deg,
              #0d9488 0%,
              #2563eb 100%
            );
          box-shadow:
            0 16px 38px rgba(13, 148, 136, 0.30),
            0 8px 20px rgba(37, 99, 235, 0.16);
          animation: orderSuccessPop 0.55s ease-out both;
        }

        @keyframes orderSuccessPop {
          0% {
            opacity: 0;
            transform: scale(0.72);
          }
          70% {
            opacity: 1;
            transform: scale(1.06);
          }
          100% {
            transform: scale(1);
          }
        }

        .order-success-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 16px;
          padding: 7px 14px;
          border: 1px solid #a7f3d0;
          border-radius: 999px;
          color: var(--os-success);
          background: var(--os-success-bg);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.10em;
          line-height: 1;
          text-transform: uppercase;
        }

        .order-success-eyebrow-dot {
          font-size: 9px;
        }

        .order-success-title {
          margin: 0 0 14px;
          color: var(--os-text);
          font-size: clamp(1.8rem, 4vw, 2.55rem);
          font-weight: 900;
          letter-spacing: -0.045em;
          line-height: 1.12;
        }

        .order-success-description {
          max-width: 580px;
          margin: 0 auto 28px;
          color: var(--os-text-3);
          font-size: 15px;
          line-height: 1.75;
        }

        .order-success-reference {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 18px;
          padding: 15px 18px;
          border: 1px solid var(--os-border);
          border-radius: 14px;
          background: var(--os-surface-2);
          text-align: left;
        }

        .order-success-reference-info {
          min-width: 0;
        }

        .order-success-reference-label {
          display: block;
          margin-bottom: 5px;
          color: var(--os-text-4);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .order-success-reference-id {
          display: block;
          overflow-wrap: anywhere;
          color: var(--os-text);
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 13px;
          font-weight: 700;
        }

        .order-success-payment-badge {
          flex-shrink: 0;
          padding: 6px 12px;
          border: 1px solid #a7f3d0;
          border-radius: 999px;
          color: var(--os-success);
          background: var(--os-success-bg);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.05em;
        }

        .order-success-status-box {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 30px;
          padding: 15px 18px;
          border: 1px solid var(--os-primary-light);
          border-radius: 14px;
          background: var(--os-primary-soft);
          text-align: left;
        }

        .order-success-status-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: 44px;
          height: 44px;
          border-radius: 12px;
          color: #ffffff;
          background: var(--os-primary);
          font-size: 20px;
          box-shadow: 0 8px 18px rgba(13, 148, 136, 0.20);
        }

        .order-success-status-content strong {
          display: block;
          margin-bottom: 3px;
          color: var(--os-primary-hover);
          font-size: 14px;
          font-weight: 800;
        }

        .order-success-status-content p {
          margin: 0;
          color: var(--os-text-3);
          font-size: 13px;
          line-height: 1.55;
        }

        .order-success-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .order-success-primary-button,
        .order-success-secondary-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          text-decoration: none;
          transition:
            transform 0.20s ease,
            box-shadow 0.20s ease,
            border-color 0.20s ease,
            background 0.20s ease;
        }

        .order-success-primary-button {
          min-height: 52px;
          padding: 0 18px;
          border-radius: 13px;
          color: #ffffff;
          background: var(--os-primary);
          box-shadow: 0 8px 22px rgba(13, 148, 136, 0.28);
          font-size: 15px;
          font-weight: 800;
        }

        .order-success-primary-button:hover {
          color: #ffffff;
          background: var(--os-primary-hover);
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(13, 148, 136, 0.34);
        }

        .order-success-secondary-actions {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .order-success-secondary-button {
          min-height: 47px;
          padding: 0 14px;
          border: 1px solid var(--os-border);
          border-radius: 11px;
          color: var(--os-text-2);
          background: var(--os-surface);
          font-size: 14px;
          font-weight: 700;
        }

        .order-success-secondary-button:hover {
          color: var(--os-text);
          border-color: var(--os-primary-light);
          background: var(--os-primary-soft);
          transform: translateY(-1px);
        }

        .order-success-security {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          margin-top: 20px;
          color: var(--os-text-4);
          font-size: 11px;
          line-height: 1.5;
        }

        .order-success-security span:first-child {
          font-size: 13px;
        }

        .order-success-next {
          margin-top: 24px;
        }

        .order-success-next-heading {
          margin-bottom: 16px;
          text-align: center;
        }

        .order-success-next-heading > span {
          display: block;
          margin-bottom: 5px;
          color: var(--os-primary);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.12em;
        }

        .order-success-next-heading h2 {
          margin: 0 0 5px;
          color: var(--os-text);
          font-size: 20px;
          font-weight: 850;
          letter-spacing: -0.025em;
        }

        .order-success-next-heading p {
          margin: 0;
          color: var(--os-text-3);
          font-size: 13px;
        }

        .order-success-steps {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        .order-success-step {
          position: relative;
          padding: 22px 18px 20px;
          border: 1px solid var(--os-border);
          border-radius: 16px;
          background: var(--os-surface);
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04);
          text-align: center;
          transition:
            transform 0.20s ease,
            box-shadow 0.20s ease,
            border-color 0.20s ease;
        }

        .order-success-step:hover {
          transform: translateY(-3px);
          border-color: var(--os-primary-light);
          box-shadow: 0 14px 30px rgba(15, 23, 42, 0.08);
        }

        .order-success-step-icon {
          margin-bottom: 11px;
          font-size: 28px;
          line-height: 1;
        }

        .order-success-step-number {
          margin-bottom: 6px;
          color: var(--os-primary);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.10em;
        }

        .order-success-step h3 {
          margin: 0 0 5px;
          color: var(--os-text);
          font-size: 14px;
          font-weight: 800;
        }

        .order-success-step p {
          margin: 0;
          color: var(--os-text-3);
          font-size: 12px;
          line-height: 1.55;
        }

        .order-success-trust-strip {
          display: grid;
          grid-template-columns: 1fr auto 1fr auto 1fr;
          align-items: center;
          gap: 18px;
          margin-top: 18px;
          padding: 18px 20px;
          border: 1px solid var(--os-border);
          border-radius: 16px;
          background: var(--os-surface);
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.035);
        }

        .order-success-trust-item {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          min-width: 0;
        }

        .order-success-trust-item > span {
          font-size: 22px;
        }

        .order-success-trust-item strong,
        .order-success-trust-item small {
          display: block;
        }

        .order-success-trust-item strong {
          margin-bottom: 2px;
          color: var(--os-text-2);
          font-size: 12px;
          font-weight: 800;
        }

        .order-success-trust-item small {
          color: var(--os-text-4);
          font-size: 10px;
          line-height: 1.4;
        }

        .order-success-trust-divider {
          width: 1px;
          height: 34px;
          background: var(--os-border);
        }

        /* Dark mode */
        .dark .order-success-page {
          --os-bg: var(--se-bg, #07111f);
          --os-surface: var(--se-surface, #0f1b2d);
          --os-surface-2: var(--se-surface-2, #111f33);
          --os-border: var(--se-border, #26364b);
          --os-text: var(--se-text, #f8fafc);
          --os-text-2: var(--se-text-2, #dbe5f1);
          --os-text-3: var(--se-text-3, #9cafc4);
          --os-text-4: var(--se-text-4, #71839a);
          --os-primary-soft: rgba(13, 148, 136, 0.10);
          --os-primary-light: rgba(45, 212, 191, 0.30);
          --os-success-bg: rgba(16, 185, 129, 0.10);
        }

        .dark .order-success-card,
        .dark .order-success-step,
        .dark .order-success-trust-strip,
        .dark .order-success-secondary-button {
          box-shadow:
            0 20px 55px rgba(0, 0, 0, 0.20);
        }

        .dark .order-success-secondary-button:hover {
          background: rgba(13, 148, 136, 0.10);
        }

        @media (max-width: 760px) {
          .order-success-page {
            padding: 32px 16px 48px;
          }

          .order-success-content {
            padding: 42px 26px 34px;
          }

          .order-success-steps {
            grid-template-columns: 1fr;
          }

          .order-success-trust-strip {
            grid-template-columns: 1fr;
            gap: 14px;
          }

          .order-success-trust-divider {
            width: 100%;
            height: 1px;
          }

          .order-success-trust-item {
            justify-content: flex-start;
          }
        }

        @media (max-width: 520px) {
          .order-success-page {
            padding: 20px 10px 34px;
          }

          .order-success-card {
            border-radius: 21px;
          }

          .order-success-content {
            padding: 34px 16px 28px;
          }

          .order-success-icon {
            width: 78px;
            height: 78px;
            font-size: 36px;
          }

          .order-success-title {
            font-size: 1.75rem;
          }

          .order-success-description {
            font-size: 14px;
          }

          .order-success-reference {
            align-items: flex-start;
            flex-direction: column;
          }

          .order-success-payment-badge {
            align-self: flex-start;
          }

          .order-success-status-box {
            align-items: flex-start;
          }

          .order-success-secondary-actions {
            grid-template-columns: 1fr;
          }

          .order-success-security {
            align-items: flex-start;
            text-align: left;
          }

          .order-success-step {
            padding: 20px 16px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .order-success-icon {
            animation: none;
          }

          .order-success-primary-button,
          .order-success-secondary-button,
          .order-success-step {
            transition: none;
          }
        }
      `}</style>
    </>
  );
}

export default OrderSuccessPage;
