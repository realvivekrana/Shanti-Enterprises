// ============================================================
// SHANTI ENTERPRISES
// Order Summary Page
// Frontend Phase 6 - UI/UX
// ============================================================

import {
  useEffect,
  useState,
} from "react";

import {
  useSearchParams,
} from "react-router-dom";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useCart,
} from "../../context/CartContext";

import {
  useAddress,
} from "../../context/AddressContext";

import {
  createOrder,
  createOrderFromQuotation,
} from "../../api/orderApi";

import {
  getQuotationById,
} from "../../api/quotationApi";

// ============================================================
// ORDER SUMMARY PAGE
// ============================================================

function OrderSummaryPage() {
  const navigate =
    useNavigate();

  const [searchParams] =
    useSearchParams();

  const quotationId =
    searchParams.get("quotationId");

  const isQuotationOrder =
    Boolean(quotationId);

  const [quotation, setQuotation] =
    useState(null);

  const [quotationLoading, setQuotationLoading] =
    useState(isQuotationOrder);

  const {
    cartItems,
    totalItems,
    subtotal,
  } = useCart();

  const {
    selectedAddress,
  } = useAddress();

  useEffect(() => {
    if (!isQuotationOrder) {
      setQuotationLoading(false);
      return;
    }

    let cancelled = false;

    const loadQuotation = async () => {
      try {
        setQuotationLoading(true);
        const response =
          await getQuotationById(quotationId);

        const receivedQuotation =
          response?.quotation ||
          response?.data?.quotation ||
          response?.data ||
          response;

        if (!receivedQuotation) {
          throw new Error(
            "Quotation data was not found."
          );
        }

        if (!cancelled) {
          setQuotation(
            receivedQuotation
          );
        }
      } catch (err) {
        console.error(
          "Load quotation for order summary error:",
          err
        );

        if (!cancelled) {
          setError(
            err?.response?.data?.message ||
            err?.message ||
            "Unable to load quotation."
          );
        }
      } finally {
        if (!cancelled) {
          setQuotationLoading(false);
        }
      }
    };

    loadQuotation();

    return () => {
      cancelled = true;
    };
  }, [quotationId, isQuotationOrder]);

  const quotationItems =
    Array.isArray(quotation?.items)
      ? quotation.items
      : [];

  const displayItems = isQuotationOrder
    ? quotationItems.map((item) => ({
        productId:
          item.product?._id ||
          item.product ||
          item.productId,
        name:
          item.productName ||
          item.product?.name ||
          "Product",
        image:
          item.product?.images?.[0] ||
          item.product?.image ||
          "",
        quantity:
          Number(item.quantity) || 0,
        price:
          Number(item.unitPrice) || 0,
        unit:
          item.unit ||
          item.product?.unit ||
          "piece",
      }))
    : cartItems;

  const displayTotalItems = isQuotationOrder
    ? quotationItems.reduce(
        (total, item) =>
          total + Number(item.quantity || 0),
        0
      )
    : totalItems;

  const displaySubtotal = isQuotationOrder
    ? Number(
        quotation?.totalAmount ??
        quotation?.subtotal ??
        quotationItems.reduce(
          (total, item) =>
            total +
            Number(item.quantity || 0) *
              Number(item.unitPrice || 0),
          0
        )
      )
    : Number(subtotal);

  const [
    paymentMethod,
    setPaymentMethod,
  ] = useState("razorpay");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  // ==========================================================
  // QUOTATION LOADING
  // ==========================================================

  if (
    isQuotationOrder &&
    quotationLoading
  ) {
    return (
      <section className="order-summary-page">
        <div className="order-summary-container">
          <div className="order-summary-empty">
            <div className="order-summary-empty-icon">
              🧾
            </div>
            <span className="order-summary-eyebrow">
              ORDER SUMMARY
            </span>
            <h1>
              Loading quotation...
            </h1>
            <p>
              Please wait while we prepare your quotation order.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // ==========================================================
  // EMPTY CART
  // ==========================================================

  if (
    !isQuotationOrder &&
    cartItems.length === 0
  ) {
    return (
      <section className="order-summary-page">

        <div className="order-summary-container">

          <div className="order-summary-empty">

            <div className="order-summary-empty-icon">
              🛒
            </div>

            <span className="order-summary-eyebrow">
              ORDER SUMMARY
            </span>

            <h1>
              Your cart is empty
            </h1>

            <p>
              Add products to your cart
              before reviewing your order.
            </p>

            <Link
              to="/products"
              className="order-summary-primary-button"
            >
              Continue Shopping
            </Link>

          </div>

        </div>

      </section>
    );
  }

  // ==========================================================
  // NO ADDRESS
  // ==========================================================

  if (
    !selectedAddress
  ) {
    return (
      <section className="order-summary-page">

        <div className="order-summary-container">

          <div className="order-summary-empty">

            <div className="order-summary-empty-icon">
              📍
            </div>

            <span className="order-summary-eyebrow">
              ORDER SUMMARY
            </span>

            <h1>
              Delivery address required
            </h1>

            <p>
              Please select a delivery
              address before continuing.
            </p>

            <Link
              to="/checkout/address"
              className="order-summary-primary-button"
            >
              Select Address
            </Link>

          </div>

        </div>

      </section>
    );
  }

  // ==========================================================
  // PLACE ORDER
  // ==========================================================

  const handlePlaceOrder =
    async () => {
      try {
        setLoading(true);
        setError("");

        // ------------------------------------------------------
        // NORMAL CART ORDER ITEMS
        // ------------------------------------------------------

        const orderItems =
          cartItems.map(
            (item) => ({
              product:
                item.productId,

              productId:
                item.productId,

              name:
                item.name,

              image:
                item.image || "",

              quantity:
                Number(
                  item.quantity
                ),

              price:
                Number(
                  item.price
                ),

              subtotal:
                Number(
                  item.price
                ) *
                Number(
                  item.quantity
                ),

              unit:
                item.unit ||
                "piece",
            })
          );

        // ------------------------------------------------------
        // VALIDATE CART ONLY FOR NORMAL ORDERS
        // ------------------------------------------------------

        if (
          !isQuotationOrder &&
          orderItems.length === 0
        ) {
          throw new Error(
            "Your cart is empty."
          );
        }

        if (!isQuotationOrder) {
          const invalidItem =
            orderItems.find(
              (item) =>
                !item.product ||
                item.quantity <= 0 ||
                item.price < 0
            );

          if (invalidItem) {
            throw new Error(
              "One or more cart items are invalid."
            );
          }
        }

        // ------------------------------------------------------
        // SHIPPING ADDRESS
        // ------------------------------------------------------

        const shippingAddress = {
          name:
            selectedAddress.name?.trim(),

          phone:
            selectedAddress.phone?.trim(),

          addressLine1:
            selectedAddress.address?.trim(),

          addressLine2:
            selectedAddress.addressLine2 ||
            "",

          city:
            selectedAddress.city?.trim(),

          state:
            selectedAddress.state?.trim(),

          postalCode:
            selectedAddress.pincode?.trim(),

          country:
            "India",
        };

        // ------------------------------------------------------
        // VALIDATE ADDRESS
        // ------------------------------------------------------

        if (
          !shippingAddress.name ||
          !shippingAddress.phone ||
          !shippingAddress.addressLine1 ||
          !shippingAddress.city ||
          !shippingAddress.state ||
          !shippingAddress.postalCode
        ) {
          throw new Error(
            "Please complete your delivery address."
          );
        }

        // ------------------------------------------------------
        // CREATE ORDER
        // ------------------------------------------------------

        const response =
          isQuotationOrder
            ? await createOrderFromQuotation({
                quotationId,
                shippingAddress,
                paymentMethod,
              })
            : await createOrder({
                items:
                  orderItems,

                shippingAddress,

                subtotal:
                  Number(subtotal),

                totalAmount:
                  Number(subtotal),

                paymentMethod:
                  paymentMethod,
              });

        // ------------------------------------------------------
        // GET CREATED ORDER
        // ------------------------------------------------------

        const createdOrder =
          response?.order ||
          response?.data?.order ||
          response?.data ||
          response;

        const orderId =
          createdOrder?._id ||
          createdOrder?.id ||
          response?.orderId ||
          response?.data?.orderId;

        if (!orderId) {
          throw new Error(
            "Order ID was not returned by the server."
          );
        }

        // ------------------------------------------------------
        // COD
        // ------------------------------------------------------

        if (
          paymentMethod ===
          "cod"
        ) {
          navigate(
            `/order-success/${orderId}`,
            {
              replace: true,
              state: {
                paymentMethod:
                  "cod",
              },
            }
          );

          return;
        }

        // ------------------------------------------------------
        // RAZORPAY
        // ------------------------------------------------------

        navigate(
          `/payment/${orderId}`
        );
      } catch (err) {
        console.error(
          "Create order error:",
          err
        );

        setError(
          err.response?.data
            ?.message ||
          err.message ||
          "Unable to create order."
        );
      } finally {
        setLoading(false);
      }
    };

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <section className="order-summary-page">

      <div className="order-summary-container">

        {/* ==================================================
            HEADER
            ================================================== */}

        <div className="order-summary-header">

          <div>

            <span className="order-summary-eyebrow">
              REVIEW YOUR ORDER
            </span>

            <h1>
              Order Summary
            </h1>

            <p>
              Check your products and delivery
              details before placing your order.
            </p>

          </div>

          <div className="order-summary-items-count">

            <strong>
              {displayTotalItems}
            </strong>

            <span>
              {displayTotalItems === 1
                ? "Item"
                : "Items"}
            </span>

          </div>

        </div>

        {/* ==================================================
            CHECKOUT STEPS
            ================================================== */}

        <div className="order-summary-steps">

          <div className="order-summary-step completed">

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

          <div className="order-summary-step-line" />

          <div className="order-summary-step active">

            <span>
              2
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

          <div className="order-summary-step-line" />

          <div className="order-summary-step">

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
            ERROR
            ================================================== */}

        {error && (
          <div
            className="order-summary-error"
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

        {/* ==================================================
            MAIN LAYOUT
            ================================================== */}

        <div className="order-summary-layout">

          {/* ==================================================
              LEFT
              ================================================== */}

          <div className="order-summary-main">

            {/* ==================================================
                ADDRESS
                ================================================== */}

            <div className="order-summary-card">

              <div className="order-summary-card-header">

                <div>

                  <span>
                    DELIVERY DETAILS
                  </span>

                  <h2>
                    Delivery Address
                  </h2>

                </div>

                <Link
                  to="/checkout/address"
                  className="order-summary-edit-link"
                >
                  Change
                </Link>

              </div>

              <div className="order-summary-address">

                <div className="order-summary-address-icon">
                  📍
                </div>

                <div>

                  <strong>
                    {selectedAddress.name}
                  </strong>

                  <p>
                    {selectedAddress.phone}
                  </p>

                  <p>
                    {selectedAddress.address}
                  </p>

                  <p>
                    {selectedAddress.city},{" "}
                    {selectedAddress.state}{" "}
                    -{" "}
                    {selectedAddress.pincode}
                  </p>

                </div>

              </div>

            </div>

            {/* ==================================================
                PRODUCTS
                ================================================== */}

            <div className="order-summary-card">

              <div className="order-summary-card-header">

                <div>

                  <span>
                    ORDER ITEMS
                  </span>

                  <h2>
                    Products
                  </h2>

                </div>

                <span className="order-summary-product-count">
                  {displayItems.length}{" "}
                  product
                  {displayItems.length !== 1
                    ? "s"
                    : ""}
                </span>

              </div>

              <div className="order-summary-products">

                {displayItems.map(
                  (item) => {

                    const price =
                      Number(
                        item.price
                      ) || 0;

                    const quantity =
                      Number(
                        item.quantity
                      ) || 0;

                    const itemTotal =
                      price *
                      quantity;

                    return (
                      <article
                        className="order-summary-product"
                        key={
                          item.productId
                        }
                      >

                        <Link
                          to={`/products/${item.productId}`}
                          className="order-summary-product-image"
                        >

                          {item.image ? (
                            <img
                              src={
                                item.image
                              }
                              alt={
                                item.name
                              }
                            />
                          ) : (
                            <span>
                              SE
                            </span>
                          )}

                        </Link>

                        <div className="order-summary-product-info">

                          <Link
                            to={`/products/${item.productId}`}
                            className="order-summary-product-name"
                          >
                            {item.name}
                          </Link>

                          <span>
                            ₹
                            {price.toLocaleString(
                              "en-IN"
                            )}{" "}
                            / unit
                          </span>

                          <span>
                            Quantity:{" "}
                            {quantity}
                          </span>

                        </div>

                        <strong className="order-summary-product-total">
                          ₹
                          {itemTotal.toLocaleString(
                            "en-IN"
                          )}
                        </strong>

                      </article>
                    );
                  }
                )}

              </div>

            </div>

            {/* ==================================================
                BACK
                ================================================== */}

            <Link
              to={isQuotationOrder ? `/checkout?quotationId=${quotationId}` : "/checkout"}
              className="order-summary-back-link"
            >
              ← Back to Checkout
            </Link>

          </div>

          {/* ==================================================
              RIGHT SUMMARY
              ================================================== */}

          <aside className="order-summary-total-card">

            <div className="order-summary-total-header">

              <span>
                ORDER TOTAL
              </span>

              <h2>
                Payment Summary
              </h2>

            </div>

            <div className="order-summary-total-row">

              <span>
                Total Items
              </span>

              <strong>
                {displayTotalItems}
              </strong>

            </div>

            <div className="order-summary-total-row">

              <span>
                Subtotal
              </span>

              <strong>
                ₹
                {displaySubtotal.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

            <div className="order-summary-total-divider" />

            <div className="order-summary-grand-total">

              <span>
                Total Amount
              </span>

              <strong>
                ₹
                {displaySubtotal.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

            {/* ==================================================
                PAYMENT METHOD
                ================================================== */}

            <div className="order-summary-payment-section">

              <span className="order-summary-payment-title">
                PAYMENT METHOD
              </span>

              {/* RAZORPAY */}

              <label
                className={`order-summary-payment-option ${
                  paymentMethod ===
                  "razorpay"
                    ? "selected"
                    : ""
                }`}
              >

                <input
                  type="radio"
                  name="paymentMethod"
                  value="razorpay"
                  checked={
                    paymentMethod ===
                    "razorpay"
                  }
                  onChange={() =>
                    setPaymentMethod(
                      "razorpay"
                    )
                  }
                />

                <span className="order-summary-payment-radio">
                  {paymentMethod ===
                    "razorpay" &&
                    "✓"}
                </span>

                <span className="order-summary-payment-option-content">

                  <strong>
                    Razorpay
                  </strong>

                  <small>
                    Pay securely online
                  </small>

                </span>

                <span className="order-summary-payment-badge">
                  ONLINE
                </span>

              </label>

              {/* COD */}

              <label
                className={`order-summary-payment-option ${
                  paymentMethod ===
                  "cod"
                    ? "selected"
                    : ""
                }`}
              >

                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={
                    paymentMethod ===
                    "cod"
                  }
                  onChange={() =>
                    setPaymentMethod(
                      "cod"
                    )
                  }
                />

                <span className="order-summary-payment-radio">
                  {paymentMethod ===
                    "cod" &&
                    "✓"}
                </span>

                <span className="order-summary-payment-option-content">

                  <strong>
                    Cash on Delivery
                  </strong>

                  <small>
                    Pay when your order arrives
                  </small>

                </span>

                <span className="order-summary-cod-badge">
                  COD
                </span>

              </label>

            </div>

            {/* ==================================================
                ACTION
                ================================================== */}

            <button
              type="button"
              className="order-summary-payment-button"
              disabled={
                loading
              }
              onClick={
                handlePlaceOrder
              }
            >

              {loading
                ? "Placing Order..."
                : paymentMethod ===
                    "cod"
                  ? "Place COD Order"
                  : "Continue to Payment"}

              {!loading && (
                <span>
                  →
                </span>
              )}

            </button>

            <p className="order-summary-note">

              {paymentMethod ===
              "cod"
                ? "You will pay when the order is delivered."
                : "You will be redirected to Razorpay for secure payment."}

            </p>

          </aside>

        </div>

      </div>

    </section>
  );
}

export default OrderSummaryPage;