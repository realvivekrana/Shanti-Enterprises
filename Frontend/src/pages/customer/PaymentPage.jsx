// ============================================================
// SHANTI ENTERPRISES
// Payment Page
// Frontend Phase 6 - UI/UX
// ============================================================

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  createPaymentOrder,
  verifyPayment,
} from "../../api/paymentApi";

// ============================================================
// RAZORPAY SCRIPT
// ============================================================

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (
      document.getElementById(
        "razorpay-checkout-script"
      )
    ) {
      resolve(true);
      return;
    }

    const script =
      document.createElement(
        "script"
      );

    script.id =
      "razorpay-checkout-script";

    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => {
      resolve(true);
    };

    script.onerror = () => {
      resolve(false);
    };

    document.body.appendChild(
      script
    );
  });
};

// ============================================================
// PAYMENT PAGE
// ============================================================

function PaymentPage() {
  const {
    orderId,
  } = useParams();

  const navigate =
    useNavigate();

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    paymentStarted,
    setPaymentStarted,
  ] = useState(false);

  // ==========================================================
  // CHECK ORDER ID
  // ==========================================================

  useEffect(() => {
    if (!orderId) {
      setError(
        "Order ID is missing."
      );
    }
  }, [orderId]);

  // ==========================================================
  // START PAYMENT
  // ==========================================================

  const handlePayment =
    async () => {
      try {
        setLoading(true);
        setError("");

        // ----------------------------------------------------
        // LOAD RAZORPAY SCRIPT
        // ----------------------------------------------------

        const scriptLoaded =
          await loadRazorpayScript();

        if (!scriptLoaded) {
          throw new Error(
            "Razorpay checkout could not be loaded."
          );
        }

        // ----------------------------------------------------
        // CREATE RAZORPAY ORDER
        // ----------------------------------------------------

        const response =
          await createPaymentOrder(
            orderId
          );

        // ----------------------------------------------------
        // BACKEND RESPONSE
        // Backend returns:
        //
        // {
        //   success: true,
        //   payment: {
        //     razorpayOrderId,
        //     amount,
        //     currency,
        //     keyId
        //   }
        // }
        // ----------------------------------------------------

        const paymentOrder =
          response?.payment ||
          response?.data?.payment ||
          response?.order ||
          response?.paymentOrder ||
          response?.data?.order ||
          response?.data?.paymentOrder ||
          response?.data ||
          response;

        // ----------------------------------------------------
        // RAZORPAY ORDER ID
        // ----------------------------------------------------

        const razorpayOrderId =
          paymentOrder?.razorpayOrderId ||
          paymentOrder?.id ||
          paymentOrder?.orderId;

        // ----------------------------------------------------
        // AMOUNT
        // ----------------------------------------------------

        const amount =
          paymentOrder?.amount;

        // ----------------------------------------------------
        // CURRENCY
        // ----------------------------------------------------

        const currency =
          paymentOrder?.currency ||
          "INR";

        // ----------------------------------------------------
        // RAZORPAY KEY
        // ----------------------------------------------------

        const keyId =
          paymentOrder?.keyId ||
          response?.keyId ||
          response?.data?.keyId ||
          import.meta.env
            .VITE_RAZORPAY_KEY_ID;

        // ----------------------------------------------------
        // VALIDATION
        // ----------------------------------------------------

        if (!razorpayOrderId) {
          throw new Error(
            "Razorpay order ID was not returned by the server."
          );
        }

        if (!keyId) {
          throw new Error(
            "Razorpay public key is not configured."
          );
        }

        if (
          amount === undefined ||
          amount === null ||
          Number(amount) <= 0
        ) {
          throw new Error(
            "Payment amount was not returned by the server."
          );
        }

        // ----------------------------------------------------
        // PAYMENT STARTED
        // ----------------------------------------------------

        setPaymentStarted(
          true
        );

        // ----------------------------------------------------
        // RAZORPAY OPTIONS
        // ----------------------------------------------------

        const options = {
          key: keyId,

          amount: Number(
            amount
          ),

          currency,

          name:
            "Shanti Enterprises",

          description:
            "Shanti Enterprises Order",

          order_id:
            razorpayOrderId,

          handler:
            async function (
              paymentResponse
            ) {
              try {
                setLoading(true);
                setError("");

                // ------------------------------------------------
                // VERIFY PAYMENT
                // ------------------------------------------------

                const verification =
                  await verifyPayment({
                    orderId,

                    razorpay_order_id:
                      paymentResponse
                        .razorpay_order_id,

                    razorpay_payment_id:
                      paymentResponse
                        .razorpay_payment_id,

                    razorpay_signature:
                      paymentResponse
                        .razorpay_signature,
                  });

                if (
                  verification?.success ===
                  false
                ) {
                  throw new Error(
                    verification.message ||
                      "Payment verification failed."
                  );
                }

                // ------------------------------------------------
                // PAYMENT SUCCESS
                // ------------------------------------------------

                navigate(
                  `/order-success/${orderId}`,
                  {
                    replace: true,
                  }
                );
              } catch (err) {
                console.error(
                  "Payment verification error:",
                  err
                );

                setError(
                  err.response?.data
                    ?.message ||
                    err.message ||
                    "Payment verification failed."
                );
              } finally {
                setLoading(false);
              }
            },

          modal: {
            ondismiss:
              function () {
                setLoading(false);

                setPaymentStarted(
                  false
                );
              },
          },

          theme: {
            color: "#111827",
          },
        };

        // ----------------------------------------------------
        // RAZORPAY CHECK
        // ----------------------------------------------------

        if (
          !window.Razorpay
        ) {
          throw new Error(
            "Razorpay is not available."
          );
        }

        // ----------------------------------------------------
        // OPEN RAZORPAY
        // ----------------------------------------------------

        const razorpay =
          new window.Razorpay(
            options
          );

        // ----------------------------------------------------
        // PAYMENT FAILED
        // ----------------------------------------------------

        razorpay.on(
          "payment.failed",
          function (
            paymentError
          ) {
            console.error(
              "Razorpay payment failed:",
              paymentError
            );

            setError(
              paymentError?.error
                ?.description ||
                "Payment failed. Please try again."
            );

            setLoading(false);

            setPaymentStarted(
              false
            );
          }
        );

        razorpay.open();
      } catch (err) {
        console.error(
          "Payment initialization error:",
          err
        );

        setError(
          err.response?.data
            ?.message ||
            err.message ||
            "Unable to start payment."
        );

        setLoading(false);

        setPaymentStarted(
          false
        );
      }
    };

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <section className="payment-page">

      <div className="payment-container">

        {/* ==================================================
            HEADER
            ================================================== */}

        <div className="payment-header">

          <div>

            <span className="payment-eyebrow">
              SECURE CHECKOUT
            </span>

            <h1>
              Complete Payment
            </h1>

            <p>
              Complete your payment securely
              using Razorpay.
            </p>

          </div>

        </div>

        {/* ==================================================
            CHECKOUT STEPS
            ================================================== */}

        <div className="payment-steps">

          <div className="payment-step completed">

            <span>
              ✓
            </span>

            <div>

              <strong>
                Delivery
              </strong>

              <small>
                Address
              </small>

            </div>

          </div>

          <div className="payment-step-line" />

          <div className="payment-step completed">

            <span>
              ✓
            </span>

            <div>

              <strong>
                Summary
              </strong>

              <small>
                Review order
              </small>

            </div>

          </div>

          <div className="payment-step-line" />

          <div className="payment-step active">

            <span>
              3
            </span>

            <div>

              <strong>
                Payment
              </strong>

              <small>
                Complete order
              </small>

            </div>

          </div>

        </div>

        {/* ==================================================
            PAYMENT CONTENT
            ================================================== */}

        <div className="payment-layout">

          <div className="payment-main-card">

            <div className="payment-icon">
              ₹
            </div>

            <span className="payment-card-eyebrow">
              RAZORPAY
            </span>

            <h2>
              Pay securely online
            </h2>

            <p className="payment-description">
              You will be redirected to the
              Razorpay secure payment window
              to complete your transaction.
            </p>

            {/* ERROR */}

            {error && (
              <div
                className="payment-error"
                role="alert"
              >

                <span>
                  !
                </span>

                <p>
                  {error}
                </p>

              </div>
            )}

            {/* PAYMENT BUTTON */}

            <button
              type="button"
              className="payment-button"
              disabled={
                loading ||
                !orderId
              }
              onClick={
                handlePayment
              }
            >

              {loading
                ? "Processing..."
                : paymentStarted
                  ? "Payment Started"
                  : "Pay with Razorpay"}

              {!loading &&
                !paymentStarted && (
                  <span>
                    →
                  </span>
                )}

            </button>

            <div className="payment-security">

              <span>
                🔒
              </span>

              <p>
                Secure payment powered by
                Razorpay.
              </p>

            </div>

          </div>

          {/* ==================================================
              ORDER INFORMATION
              ================================================== */}

          <aside className="payment-order-card">

            <div className="payment-order-header">

              <span>
                ORDER DETAILS
              </span>

              <h2>
                Payment Information
              </h2>

            </div>

            <div className="payment-order-row">

              <span>
                Order ID
              </span>

              <strong>
                {orderId ||
                  "Unavailable"}
              </strong>

            </div>

            <div className="payment-order-divider" />

            <div className="payment-status-box">

              <div className="payment-status-icon">
                ✓
              </div>

              <div>

                <strong>
                  Ready for Payment
                </strong>

                <p>
                  Your order has been created
                  and is waiting for payment.
                </p>

              </div>

            </div>

            <div className="payment-method-box">

              <div>

                <span>
                  PAYMENT METHOD
                </span>

                <strong>
                  Razorpay
                </strong>

              </div>

              <span className="payment-online-badge">
                ONLINE
              </span>

            </div>

            <p className="payment-order-note">
              Do not refresh or close the page
              while payment is being processed.
            </p>

          </aside>

        </div>

        {/* ==================================================
            BACK
            ================================================== */}

        <div className="payment-back-wrapper">

          <Link
            to="/checkout/summary"
            className="payment-back-link"
          >
            ← Back to Order Summary
          </Link>

        </div>

      </div>

    </section>
  );
}

export default PaymentPage;