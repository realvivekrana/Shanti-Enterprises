// ============================================================
// SHANTI ENTERPRISES — CHECKOUT PAGE
// Premium B2B Checkout
// Existing API / pricing / payment flow preserved
// ============================================================

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { useCart } from "../../context/CartContext";
import "./CheckoutPage.css";

// ============================================================
// HELPERS
// ============================================================

const formatPrice = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const getProductImage = (item) => {
  const image =
    item?.image ||
    item?.product?.image ||
    "";

  if (typeof image === "string") {
    return image;
  }

  return (
    image?.url ||
    image?.secure_url ||
    image?.src ||
    ""
  );
};

const getProductName = (item) =>
  item?.name ||
  item?.product?.name ||
  "Product";

const getProductIdFromItem = (item) =>
  item?._id ||
  item?.product?._id ||
  item?.product ||
  "";

const getQuantity = (item) =>
  Number(item?.quantity || 1);

// ============================================================
// CHECKOUT PAGE
// ============================================================

const CheckoutPage = () => {
  const {
    cartItems,
    clearCart,
  } = useCart();

  const navigate =
    useNavigate();

  // ==========================================================
  // USER
  // ==========================================================

  const userInfo =
    localStorage.getItem(
      "userInfo"
    );

  const isLoggedIn =
    Boolean(userInfo);

  let user = null;

  try {
    user = userInfo
      ? JSON.parse(userInfo)
      : null;
  } catch (parseError) {
    console.error(
      "Failed to parse userInfo:",
      parseError
    );
    user = null;
  }

  // ==========================================================
  // ADDRESS
  // ==========================================================

  const [address, setAddress] =
    useState({
      name:
        user?.name || "",
      phone:
        user?.phone || "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
    });

  // ==========================================================
  // PAYMENT
  // ==========================================================

  const [paymentMethod, setPaymentMethod] =
    useState("COD");

  // ==========================================================
  // PRICING
  // ==========================================================

  const [pricing, setPricing] =
    useState({});

  const [loadingPricing, setLoadingPricing] =
    useState(true);

  // ==========================================================
  // GENERAL STATE
  // ==========================================================

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  // ==========================================================
  // FETCH WHOLESALE PRICES
  // ==========================================================

  useEffect(() => {
    let cancelled = false;

    const calculatePrices =
      async () => {
        if (
          !cartItems ||
          cartItems.length === 0
        ) {
          if (!cancelled) {
            setPricing({});
            setLoadingPricing(false);
          }

          return;
        }

        setLoadingPricing(true);
        setError("");

        try {
          const results = {};

          for (
            const item of cartItems
          ) {
            const productId =
              getProductIdFromItem(
                item
              );

            if (!productId) {
              continue;
            }

            try {
              const response =
                await API.get(
                  `/products/${productId}/wholesale-price`,
                  {
                    params: {
                      quantity:
                        getQuantity(
                          item
                        ),
                    },
                  }
                );

              const data =
                response?.data ??
                response;

              const priceData =
                data?.data ||
                data?.pricing ||
                data;

              results[
                productId
              ] = priceData;
            } catch (
              priceError
            ) {
              console.error(
                "Wholesale price error:",
                productId,
                priceError
              );

              // Fallback to cart/product price
              results[
                productId
              ] = {
                unitPrice:
                  Number(
                    item?.price ||
                      item?.product
                        ?.price ||
                      0
                  ),
                subtotal:
                  Number(
                    item?.price ||
                      item?.product
                        ?.price ||
                      0
                  ) *
                  getQuantity(
                    item
                  ),
              };
            }
          }

          if (!cancelled) {
            setPricing(
              results
            );
          }
        } catch (priceError) {
          console.error(
            "Calculate wholesale prices error:",
            priceError
          );

          if (!cancelled) {
            setError(
              priceError?.response
                ?.data?.message ||
                priceError?.message ||
                "Failed to calculate wholesale prices."
            );
          }
        } finally {
          if (!cancelled) {
            setLoadingPricing(
              false
            );
          }
        }
      };

    calculatePrices();

    return () => {
      cancelled = true;
    };
  }, [cartItems]);

  // ==========================================================
  // ADDRESS CHANGE
  // ==========================================================

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setAddress(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );

    if (error) {
      setError("");
    }
  };

  // ==========================================================
  // PRODUCT ID
  // ==========================================================

  const getProductId = (
    item
  ) =>
    getProductIdFromItem(
      item
    );

  // ==========================================================
  // PRICING
  // ==========================================================

  const itemsPrice = (
    cartItems || []
  ).reduce(
    (sum, item) => {
      const productId =
        getProductId(item);

      const itemPricing =
        pricing[
          productId
        ];

      const quantity =
        getQuantity(item);

      const subtotal =
        Number(
          itemPricing?.subtotal ??
            itemPricing?.total ??
            Number(
              item?.price ||
                item?.product
                  ?.price ||
                0
            ) * quantity
        );

      return sum + subtotal;
    },
    0
  );

  // ==========================================================
  // SHIPPING
  // ==========================================================

  const shippingPrice = 50;

  // ==========================================================
  // TOTAL
  // ==========================================================

  const totalPrice =
    itemsPrice +
    shippingPrice;

  // ==========================================================
  // TOTAL QUANTITY
  // ==========================================================

  const totalQuantity = (
    cartItems || []
  ).reduce(
    (sum, item) =>
      sum + getQuantity(item),
    0
  );

  // ==========================================================
  // ADDRESS VALIDATION
  // ==========================================================

  const validateAddress =
    () => {
      if (
        !address.name.trim()
      ) {
        return "Name is required.";
      }

      if (
        !address.phone.trim()
      ) {
        return "Phone is required.";
      }

      if (
        !address.addressLine1.trim()
      ) {
        return "Address is required.";
      }

      if (
        !address.city.trim()
      ) {
        return "City is required.";
      }

      if (
        !address.state.trim()
      ) {
        return "State is required.";
      }

      if (
        !address.postalCode.trim()
      ) {
        return "Postal code is required.";
      }

      if (
        !address.country.trim()
      ) {
        return "Country is required.";
      }

      return null;
    };

  // ==========================================================
  // CREATE DATABASE ORDER
  //
  // IMPORTANT:
  // Database order is created BEFORE Razorpay order.
  // ==========================================================

  const createOrderInDB =
    async () => {
      const orderItems =
        cartItems.map(
          (item) => {
            const productId =
              getProductId(item);

            const itemPricing =
              pricing[
                productId
              ];

            return {
              product:
                productId,

              name:
                getProductName(
                  item
                ),

              image:
                getProductImage(
                  item
                ),

              quantity:
                getQuantity(
                  item
                ),

              price:
                Number(
                  itemPricing?.unitPrice ??
                    item?.price ??
                    item?.product
                      ?.price ??
                    0
                ),

              unit:
                item?.unit ||
                item?.product
                  ?.unit ||
                "piece",
            };
          }
        );

      console.log(
        "========================================"
      );

      console.log(
        "CREATING ORDER FROM CHECKOUT"
      );

      console.log(
        "Order Items:",
        orderItems
      );

      console.log(
        "Shipping Address:",
        address
      );

      console.log(
        "Payment Method:",
        paymentMethod
      );

      console.log(
        "Items Price:",
        itemsPrice
      );

      console.log(
        "Shipping:",
        shippingPrice
      );

      console.log(
        "Total:",
        totalPrice
      );

      console.log(
        "========================================"
      );

      const response =
        await API.post(
          "/orders",
          {
            orderItems,

            shippingAddress: {
              name:
                address.name.trim(),

              phone:
                address.phone.trim(),

              addressLine1:
                address.addressLine1.trim(),

              addressLine2:
                address.addressLine2.trim(),

              city:
                address.city.trim(),

              state:
                address.state.trim(),

              postalCode:
                address.postalCode.trim(),

              country:
                address.country.trim(),
            },

            paymentMethod,

            // Sent for compatibility.
            // Backend recalculates actual wholesale pricing.
            itemsPrice,

            shippingPrice,

            totalPrice,
          }
        );

      const responseData =
        response?.data ??
        response;

      console.log(
        "CREATE ORDER RESPONSE:",
        responseData
      );

      const createdOrder =
        responseData?.order ||
        responseData?.data?.order ||
        responseData?.data ||
        responseData;

      const orderId =
        createdOrder?._id ||
        createdOrder?.id;

      if (!orderId) {
        console.error(
          "Order response did not contain ID:",
          responseData
        );

        throw new Error(
          "Order was created but Order ID was not returned by the server."
        );
      }

      return {
        order:
          createdOrder,

        orderId:
          String(orderId),
      };
    };

  // ==========================================================
  // CREATE RAZORPAY ORDER
  // ==========================================================

  const createRazorpayOrder =
    async (orderId) => {
      if (!orderId) {
        throw new Error(
          "Order ID is missing. Cannot create payment order."
        );
      }

      console.log(
        "========================================"
      );

      console.log(
        "CREATING RAZORPAY ORDER"
      );

      console.log(
        "Database Order ID:",
        orderId
      );

      console.log(
        "========================================"
      );

      const response =
        await API.post(
          "/payments/create-order",
          {
            orderId:
              String(orderId),
          }
        );

      const responseData =
        response?.data ??
        response;

      console.log(
        "RAZORPAY ORDER RESPONSE:",
        responseData
      );

      const paymentData =
        responseData?.payment ||
        responseData?.data?.payment ||
        responseData?.data ||
        responseData;

      const razorpayOrderId =
        paymentData?.razorpayOrderId ||
        paymentData?.razorpayOrder
          ?.id ||
        responseData
          ?.razorpayOrder
          ?.id;

      const amount =
        paymentData?.amountInPaise ??
        paymentData?.amount ??
        responseData?.amountInPaise ??
        responseData?.amount;

      const currency =
        paymentData?.currency ||
        responseData?.currency ||
        "INR";

      const keyId =
        paymentData?.keyId ||
        responseData?.keyId ||
        import.meta.env
          ?.VITE_RAZORPAY_KEY_ID ||
        "rzp_test_TQ87uv6EO8OzPI";

      if (!razorpayOrderId) {
        console.error(
          "Razorpay response missing ID:",
          responseData
        );

        throw new Error(
          "Razorpay order ID was not returned by the server."
        );
      }

      if (!amount) {
        throw new Error(
          "Razorpay amount was not returned by the server."
        );
      }

      return {
        id:
          razorpayOrderId,

        amount,

        currency,

        keyId,
      };
    };

  // ==========================================================
  // VERIFY RAZORPAY PAYMENT
  // ==========================================================

  const verifyRazorpayPayment =
    async (
      paymentResponse
    ) => {
      console.log(
        "========================================"
      );

      console.log(
        "VERIFYING RAZORPAY PAYMENT"
      );

      console.log(
        paymentResponse
      );

      console.log(
        "========================================"
      );

      const response =
        await API.post(
          "/payments/verify",
          {
            razorpayOrderId:
              paymentResponse
                ?.razorpay_order_id,

            razorpayPaymentId:
              paymentResponse
                ?.razorpay_payment_id,

            razorpaySignature:
              paymentResponse
                ?.razorpay_signature,
          }
        );

      const responseData =
        response?.data ??
        response;

      console.log(
        "PAYMENT VERIFY RESPONSE:",
        responseData
      );

      if (
        responseData?.success ===
        false
      ) {
        throw new Error(
          responseData?.message ||
            "Payment verification failed."
        );
      }

      return responseData;
    };

  // ==========================================================
  // OPEN RAZORPAY CHECKOUT
  // ==========================================================

  const openRazorpayCheckout =
    async (
      databaseOrderId
    ) => {
      if (
        !window.Razorpay
      ) {
        throw new Error(
          "Razorpay SDK is not loaded. Please check index.html."
        );
      }

      const razorpayOrder =
        await createRazorpayOrder(
          databaseOrderId
        );

      console.log(
        "Opening Razorpay:",
        razorpayOrder
      );

      const razorpayKey =
        razorpayOrder.keyId ||
        import.meta.env
          ?.VITE_RAZORPAY_KEY_ID ||
        "rzp_test_TQ87uv6EO8OzPI";

      const options = {
        key:
          razorpayKey,

        amount:
          razorpayOrder.amount,

        currency:
          razorpayOrder.currency ||
          "INR",

        name:
          "Shanti Enterprises",

        description:
          "Wholesale Order Payment",

        order_id:
          razorpayOrder.id,

        prefill: {
          name:
            address.name ||
            user?.name ||
            "",

          email:
            user?.email ||
            "",

          contact:
            address.phone ||
            user?.phone ||
            "",
        },

        notes: {
          databaseOrderId:
            String(
              databaseOrderId
            ),
        },

        theme: {
          color:
            "#0d9488",
        },

        handler:
          async (
            paymentResponse
          ) => {
            try {
              setLoading(
                true
              );

              setError("");

              await verifyRazorpayPayment(
                paymentResponse
              );

              clearCart();

              setSuccessMessage(
                "Payment successful. Your order has been confirmed."
              );

              navigate(
                `/order-success/${databaseOrderId}`
              );
            } catch (
              paymentError
            ) {
              console.error(
                "Payment verification error:",
                paymentError
              );

              setError(
                paymentError
                  ?.response
                  ?.data
                  ?.message ||
                  paymentError?.message ||
                  "Payment verification failed."
              );
            } finally {
              setLoading(
                false
              );
            }
          },

        modal: {
          ondismiss:
            () => {
              setLoading(
                false
              );

              setError(
                "Payment was cancelled."
              );
            },
        },
      };

      const razorpay =
        new window.Razorpay(
          options
        );

      razorpay.on(
        "payment.failed",
        (response) => {
          console.error(
            "Razorpay payment failed:",
            response
          );

          setLoading(
            false
          );

          setError(
            response?.error
              ?.description ||
              "Payment failed. Please try again."
          );
        }
      );

      razorpay.open();
    };

  // ==========================================================
  // PLACE ORDER
  // ==========================================================

  const handlePlaceOrder =
    async (event) => {
      event.preventDefault();

      setError("");
      setSuccessMessage("");

      // --------------------------------------------------------
      // LOGIN
      // --------------------------------------------------------

      if (!isLoggedIn) {
        setError(
          "Please login to place an order."
        );

        return;
      }

      // --------------------------------------------------------
      // EMPTY CART
      // --------------------------------------------------------

      if (
        !cartItems ||
        cartItems.length === 0
      ) {
        setError(
          "Your cart is empty."
        );

        return;
      }

      // --------------------------------------------------------
      // ADDRESS
      // --------------------------------------------------------

      const addressError =
        validateAddress();

      if (addressError) {
        setError(
          addressError
        );

        return;
      }

      // --------------------------------------------------------
      // PRICING
      // --------------------------------------------------------

      if (
        loadingPricing
      ) {
        setError(
          "Please wait while wholesale prices are calculated."
        );

        return;
      }

      // --------------------------------------------------------
      // PRICE
      // --------------------------------------------------------

      if (
        itemsPrice <= 0
      ) {
        setError(
          "Unable to calculate the order amount."
        );

        return;
      }

      // --------------------------------------------------------
      // PROCESSING
      // --------------------------------------------------------

      setLoading(true);

      try {
        // ======================================================
        // STEP 1
        // Create database order first.
        // ======================================================

        const {
          order,
          orderId,
        } =
          await createOrderInDB();

        console.log(
          "DATABASE ORDER CREATED:",
          order
        );

        console.log(
          "DATABASE ORDER ID:",
          orderId
        );

        // ======================================================
        // COD
        // ======================================================

        if (
          paymentMethod ===
          "COD"
        ) {
          clearCart();

          navigate(
            `/order-success/${orderId}`
          );

          return;
        }

        // ======================================================
        // RAZORPAY
        // ======================================================

        if (
          paymentMethod ===
          "Razorpay"
        ) {
          await openRazorpayCheckout(
            orderId
          );

          return;
        }

        throw new Error(
          "Invalid payment method selected."
        );
      } catch (
        placeOrderError
      ) {
        console.error(
          "PLACE ORDER ERROR:",
          placeOrderError
        );

        const backendMessage =
          placeOrderError
            ?.response
            ?.data
            ?.message;

        setError(
          backendMessage ||
            placeOrderError?.message ||
            "Failed to place order."
        );

        setLoading(false);
      }
    };

  // ==========================================================
  // EMPTY CART UI
  // ==========================================================

  if (
    !cartItems ||
    cartItems.length === 0
  ) {
    return (
      <section className="checkout-page checkout-empty-page">
        <div className="checkout-container">

          <div className="checkout-empty-card">

            <div className="checkout-empty-icon">
              🛒
            </div>

            <span className="checkout-eyebrow">
              SHANTI ENTERPRISES
            </span>

            <h1>
              Your cart is empty
            </h1>

            <p>
              Add some products before
              proceeding to checkout.
            </p>

            <button
              type="button"
              className="checkout-primary-button"
              onClick={() =>
                navigate(
                  "/products"
                )
              }
            >
              Continue Shopping
              <span>→</span>
            </button>

          </div>

        </div>
      </section>
    );
  }

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <section className="checkout-page">

      <div className="checkout-background-glow checkout-background-glow-one" />
      <div className="checkout-background-glow checkout-background-glow-two" />

      <div className="checkout-container">

        {/* ====================================================
            HEADER
            ==================================================== */}

        <header className="checkout-page-header">

          <div className="checkout-header-copy">

            <button
              type="button"
              className="checkout-back-link"
              onClick={() =>
                navigate(
                  "/cart"
                )
              }
            >
              <span>←</span>
              Back to Cart
            </button>

            <span className="checkout-eyebrow">
              SHANTI ENTERPRISES
            </span>

            <h1>
              Complete your order
              <span>.</span>
            </h1>

            <p>
              Review your details, choose a
              payment method, and place your
              wholesale order securely.
            </p>

          </div>

          <div className="checkout-header-badge">
            <span className="checkout-header-badge-icon">
              🔒
            </span>

            <div>
              <strong>
                Secure Checkout
              </strong>

              <small>
                Protected order flow
              </small>
            </div>
          </div>

        </header>

        {/* ====================================================
            STEPS
            ==================================================== */}

        <div className="checkout-steps">

          <div className="checkout-step completed">
            <span className="checkout-step-number">
              ✓
            </span>

            <div>
              <strong>
                Cart
              </strong>

              <small>
                Products selected
              </small>
            </div>
          </div>

          <span className="checkout-step-line active" />

          <div className="checkout-step active">
            <span className="checkout-step-number">
              2
            </span>

            <div>
              <strong>
                Checkout
              </strong>

              <small>
                Delivery & payment
              </small>
            </div>
          </div>

          <span className="checkout-step-line" />

          <div className="checkout-step">
            <span className="checkout-step-number">
              3
            </span>

            <div>
              <strong>
                Confirmation
              </strong>

              <small>
                Order complete
              </small>
            </div>
          </div>

        </div>

        {/* ====================================================
            ALERTS
            ==================================================== */}

        {error && (
          <div className="checkout-alert checkout-alert-error">
            <div className="checkout-alert-icon">
              !
            </div>

            <div>
              <strong>
                Checkout needs your attention
              </strong>

              <p>
                {error}
              </p>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="checkout-alert checkout-alert-success">
            <div className="checkout-alert-icon">
              ✓
            </div>

            <div>
              <strong>
                Order updated
              </strong>

              <p>
                {successMessage}
              </p>
            </div>
          </div>
        )}

        {/* ====================================================
            MAIN LAYOUT
            ==================================================== */}

        <div className="checkout-layout">

          {/* ==================================================
              LEFT — FORM
              ================================================== */}

          <div className="checkout-main-column">

            <form
              onSubmit={
                handlePlaceOrder
              }
              className="checkout-form-card"
            >

              {/* ==================================================
                  SHIPPING
                  ================================================== */}

              <div className="checkout-section-header">

                <div className="checkout-section-icon checkout-icon-cyan">
                  📍
                </div>

                <div>
                  <span>
                    STEP 01
                  </span>

                  <h2>
                    Shipping Address
                  </h2>

                  <p>
                    Where should we deliver your
                    order?
                  </p>
                </div>

              </div>

              <div className="checkout-form-grid">

                {/* FULL NAME */}

                <div className="checkout-field checkout-field-full">

                  <label htmlFor="checkout-name">
                    Full Name
                    <b>*</b>
                  </label>

                  <input
                    id="checkout-name"
                    type="text"
                    name="name"
                    value={
                      address.name
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter full name"
                    autoComplete="name"
                    required
                  />

                </div>

                {/* PHONE */}

                <div className="checkout-field">

                  <label htmlFor="checkout-phone">
                    Phone Number
                    <b>*</b>
                  </label>

                  <input
                    id="checkout-phone"
                    type="tel"
                    name="phone"
                    value={
                      address.phone
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter phone number"
                    autoComplete="tel"
                    required
                  />

                </div>

                {/* ADDRESS LINE 1 */}

                <div className="checkout-field checkout-field-full">

                  <label htmlFor="checkout-address">
                    Address
                    <b>*</b>
                  </label>

                  <input
                    id="checkout-address"
                    type="text"
                    name="addressLine1"
                    value={
                      address.addressLine1
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="House / Building / Street"
                    autoComplete="street-address"
                    required
                  />

                </div>

                {/* ADDRESS LINE 2 */}

                <div className="checkout-field checkout-field-full">

                  <label htmlFor="checkout-address-two">
                    Address Line 2
                    <span>
                      Optional
                    </span>
                  </label>

                  <input
                    id="checkout-address-two"
                    type="text"
                    name="addressLine2"
                    value={
                      address.addressLine2
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Landmark / Area"
                    autoComplete="address-line2"
                  />

                </div>

                {/* CITY */}

                <div className="checkout-field">

                  <label htmlFor="checkout-city">
                    City
                    <b>*</b>
                  </label>

                  <input
                    id="checkout-city"
                    type="text"
                    name="city"
                    value={
                      address.city
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="City"
                    autoComplete="address-level2"
                    required
                  />

                </div>

                {/* STATE */}

                <div className="checkout-field">

                  <label htmlFor="checkout-state">
                    State
                    <b>*</b>
                  </label>

                  <input
                    id="checkout-state"
                    type="text"
                    name="state"
                    value={
                      address.state
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="State"
                    autoComplete="address-level1"
                    required
                  />

                </div>

                {/* POSTAL */}

                <div className="checkout-field">

                  <label htmlFor="checkout-postal">
                    Postal Code
                    <b>*</b>
                  </label>

                  <input
                    id="checkout-postal"
                    type="text"
                    name="postalCode"
                    value={
                      address.postalCode
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="411014"
                    autoComplete="postal-code"
                    required
                  />

                </div>

                {/* COUNTRY */}

                <div className="checkout-field">

                  <label htmlFor="checkout-country">
                    Country
                    <b>*</b>
                  </label>

                  <input
                    id="checkout-country"
                    type="text"
                    name="country"
                    value={
                      address.country
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="India"
                    autoComplete="country-name"
                    required
                  />

                </div>

              </div>

              {/* ==================================================
                  PAYMENT
                  ================================================== */}

              <div className="checkout-divider" />

              <div className="checkout-section-header">

                <div className="checkout-section-icon checkout-icon-violet">
                  ₹
                </div>

                <div>
                  <span>
                    STEP 02
                  </span>

                  <h2>
                    Payment Method
                  </h2>

                  <p>
                    Choose how you want to pay.
                  </p>
                </div>

              </div>

              <div className="checkout-payment-grid">

                {/* COD */}

                <label
                  className={`checkout-payment-option ${
                    paymentMethod ===
                    "COD"
                      ? "selected"
                      : ""
                  }`}
                >

                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={
                      paymentMethod ===
                      "COD"
                    }
                    onChange={(event) =>
                      setPaymentMethod(
                        event.target
                          .value
                      )
                    }
                  />

                  <span className="checkout-radio" />

                  <span className="checkout-payment-symbol">
                    💵
                  </span>

                  <span className="checkout-payment-copy">

                    <strong>
                      Cash on Delivery
                    </strong>

                    <small>
                      Pay when your order is
                      delivered.
                    </small>

                  </span>

                  <span className="checkout-payment-check">
                    ✓
                  </span>

                </label>

                {/* RAZORPAY */}

                <label
                  className={`checkout-payment-option ${
                    paymentMethod ===
                    "Razorpay"
                      ? "selected"
                      : ""
                  }`}
                >

                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Razorpay"
                    checked={
                      paymentMethod ===
                      "Razorpay"
                    }
                    onChange={(event) =>
                      setPaymentMethod(
                        event.target
                          .value
                      )
                    }
                  />

                  <span className="checkout-radio" />

                  <span className="checkout-payment-symbol">
                    ⚡
                  </span>

                  <span className="checkout-payment-copy">

                    <strong>
                      Online Payment
                    </strong>

                    <small>
                      Pay securely using
                      Razorpay.
                    </small>

                  </span>

                  <span className="checkout-payment-check">
                    ✓
                  </span>

                </label>

              </div>

              {/* ==================================================
                  SECURITY NOTE
                  ================================================== */}

              <div className="checkout-security-note">

                <span>
                  🔐
                </span>

                <div>
                  <strong>
                    Your payment is protected
                  </strong>

                  <p>
                    Online payments are processed
                    securely through Razorpay.
                  </p>
                </div>

              </div>

              {/* ==================================================
                  SUBMIT
                  ================================================== */}

              <div className="checkout-form-actions">

                <button
                  type="button"
                  className="checkout-back-button"
                  onClick={() =>
                    navigate(
                      "/cart"
                    )
                  }
                  disabled={
                    loading
                  }
                >
                  <span>
                    ←
                  </span>

                  Back to Cart
                </button>

                <button
                  type="submit"
                  className="checkout-submit-button"
                  disabled={
                    loading ||
                    loadingPricing
                  }
                >

                  {loading ? (
                    <>
                      <span className="checkout-button-spinner" />
                      Processing...
                    </>
                  ) : loadingPricing ? (
                    <>
                      <span className="checkout-button-spinner" />
                      Calculating Prices...
                    </>
                  ) : paymentMethod ===
                    "Razorpay" ? (
                    <>
                      Proceed to Payment
                      <span>
                        →
                      </span>
                    </>
                  ) : (
                    <>
                      Place Order
                      <span>
                        →
                      </span>
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

          {/* ==================================================
              RIGHT — SUMMARY
              ================================================== */}

          <aside className="checkout-summary-column">

            <div className="checkout-summary-card">

              {/* SUMMARY HEADER */}

              <div className="checkout-summary-header">

                <div>
                  <span>
                    ORDER SUMMARY
                  </span>

                  <h2>
                    Your Order
                  </h2>
                </div>

                <div className="checkout-summary-count">
                  {cartItems.length}
                </div>

              </div>

              {/* PRICE CALCULATION STATE */}

              {loadingPricing && (
                <div className="checkout-pricing-status">
                  <span className="checkout-button-spinner" />

                  <div>
                    <strong>
                      Calculating wholesale prices
                    </strong>

                    <small>
                      Checking quantity-based pricing...
                    </small>
                  </div>
                </div>
              )}

              {/* ITEMS */}

              <div className="checkout-summary-items">

                {cartItems.map(
                  (
                    item,
                    index
                  ) => {
                    const productId =
                      getProductId(
                        item
                      );

                    const itemPricing =
                      pricing[
                        productId
                      ];

                    const quantity =
                      getQuantity(
                        item
                      );

                    const unitPrice =
                      Number(
                        itemPricing?.unitPrice ??
                          item?.price ??
                          item?.product
                            ?.price ??
                          0
                      );

                    const subtotal =
                      Number(
                        itemPricing?.subtotal ??
                          unitPrice *
                            quantity
                      );

                    const image =
                      getProductImage(
                        item
                      );

                    const name =
                      getProductName(
                        item
                      );

                    return (
                      <div
                        key={
                          productId ||
                          item?._id ||
                          index
                        }
                        className="checkout-summary-item"
                      >

                        <div className="checkout-summary-image">

                          {image ? (
                            <img
                              src={
                                image
                              }
                              alt={
                                name
                              }
                              loading="lazy"
                            />
                          ) : (
                            <span>
                              📦
                            </span>
                          )}

                          <b>
                            {quantity}
                          </b>

                        </div>

                        <div className="checkout-summary-item-info">

                          <strong>
                            {name}
                          </strong>

                          <span>
                            Qty:{" "}
                            {quantity}
                          </span>

                          <small>
                            {formatPrice(
                              unitPrice
                            )}{" "}
                            / unit
                          </small>

                        </div>

                        <strong className="checkout-summary-item-total">
                          {formatPrice(
                            subtotal
                          )}
                        </strong>

                      </div>
                    );
                  }
                )}

              </div>

              {/* PRICE BREAKDOWN */}

              <div className="checkout-price-breakdown">

                <div>
                  <span>
                    Products
                  </span>

                  <strong>
                    {formatPrice(
                      itemsPrice
                    )}
                  </strong>
                </div>

                <div>
                  <span>
                    Shipping
                  </span>

                  <strong>
                    {formatPrice(
                      shippingPrice
                    )}
                  </strong>
                </div>

              </div>

              {/* TOTAL */}

              <div className="checkout-grand-total">

                <div>
                  <span>
                    Total
                  </span>

                  <small>
                    {totalQuantity}{" "}
                    {totalQuantity ===
                    1
                      ? "unit"
                      : "units"}
                  </small>
                </div>

                <strong>
                  {formatPrice(
                    totalPrice
                  )}
                </strong>

              </div>

              {/* PAYMENT METHOD */}

              <div className="checkout-summary-payment">

                <span className="checkout-summary-payment-icon">
                  {paymentMethod ===
                  "Razorpay"
                    ? "⚡"
                    : "💵"}
                </span>

                <div>
                  <small>
                    PAYMENT METHOD
                  </small>

                  <strong>
                    {paymentMethod ===
                    "Razorpay"
                      ? "Online Payment"
                      : "Cash on Delivery"}
                  </strong>
                </div>

              </div>

              {/* DELIVERY */}

              <div className="checkout-delivery-note">

                <span>
                  🚚
                </span>

                <div>
                  <strong>
                    Delivery available
                  </strong>

                  <p>
                    Shipping is calculated as
                    a fixed ₹50 at checkout.
                  </p>
                </div>

              </div>

              {/* TRUST */}

              <div className="checkout-trust-row">

                <span>
                  ✓ Secure
                </span>

                <span>
                  ✓ Verified
                </span>

                <span>
                  ✓ B2B Ready
                </span>

              </div>

            </div>

          </aside>

        </div>

        {/* ====================================================
            FOOTER NAV
            ==================================================== */}

        <nav
          className="checkout-footer-nav"
          aria-label="Checkout navigation"
        >

          <button
            type="button"
            onClick={() =>
              navigate(
                "/products"
              )
            }
          >
            <span>
              Continue Shopping
            </span>
            <b>→</b>
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/orders"
              )
            }
          >
            <span>
              My Orders
            </span>
            <b>→</b>
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/profile"
              )
            }
          >
            <span>
              My Profile
            </span>
            <b>→</b>
          </button>

        </nav>

      </div>
    </section>
  );
};

export default CheckoutPage;
