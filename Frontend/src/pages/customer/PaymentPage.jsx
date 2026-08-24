// ============================================================
// SHANTI ENTERPRISES
// Payment Page
// Frontend Phase 3 - Checkout
// ============================================================

import {
  useEffect,
  useState,
} from "react";

import {
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

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError("");

      const scriptLoaded =
        await loadRazorpayScript();

      if (!scriptLoaded) {
        throw new Error(
          "Razorpay checkout could not be loaded."
        );
      }

      // ------------------------------------------------------
      // CREATE RAZORPAY ORDER
      // ------------------------------------------------------

      const response =
        await createPaymentOrder(
          orderId
        );

      const paymentOrder =
        response?.order ||
        response?.paymentOrder ||
        response?.data?.order ||
        response?.data?.paymentOrder ||
        response?.data ||
        response;

      const razorpayOrderId =
        paymentOrder?.id ||
        paymentOrder?.orderId;

      const amount =
        paymentOrder?.amount;

      const currency =
        paymentOrder?.currency ||
        "INR";

      const keyId =
        response?.keyId ||
        response?.data?.keyId ||
        import.meta.env
          .VITE_RAZORPAY_KEY_ID;

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

      if (!amount) {
        throw new Error(
          "Payment amount was not returned by the server."
        );
      }

      setPaymentStarted(
        true
      );

      // ------------------------------------------------------
      // RAZORPAY OPTIONS
      // ------------------------------------------------------

      const options = {
        key: keyId,

        amount,

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

              const verification =
                await verifyPayment({
                  orderId,

                  razorpay_order_id:
                    paymentResponse.razorpay_order_id,

                  razorpay_payment_id:
                    paymentResponse.razorpay_payment_id,

                  razorpay_signature:
                    paymentResponse.razorpay_signature,
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

      const razorpay =
        new window.Razorpay(
          options
        );

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
    <section className="app-page">

      <h1>
        Payment
      </h1>

      <p>
        Complete payment securely
        using Razorpay.
      </p>

      {error && (
        <div>
          <p>
            {error}
          </p>
        </div>
      )}

      <button
        type="button"
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
      </button>

      <p>
        Order ID: {orderId}
      </p>

    </section>
  );
}

export default PaymentPage;