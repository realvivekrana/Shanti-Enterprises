  import { useState, useEffect } from "react";
  import { useNavigate, useSearchParams } from "react-router-dom";
  import API from "../../api/axios";
import { getQuotationById } from "../../api/quotationApi";
import { createOrderFromQuotation } from "../../api/orderApi";
  import { useCart } from "../../context/CartContext";

  // ============================================================
  // SHANTI ENTERPRISES
  // CHECKOUT PAGE
  // Customer Portal
  // Razorpay Payment Integration
  // ============================================================

  const CheckoutPage = () => {
    const { cartItems, clearCart } = useCart();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const quotationId = searchParams.get("quotationId");
    const isWholesaleOrder = Boolean(quotationId);

    // ============================================================
    // USER
    // ============================================================

    const userInfo = localStorage.getItem("userInfo");

    const isLoggedIn = Boolean(userInfo);

    let user = null;

    try {
      user = userInfo
        ? JSON.parse(userInfo)
        : null;
    } catch (error) {
      console.error(
        "Failed to parse userInfo:",
        error
      );

      user = null;
    }

    // ============================================================
    // ADDRESS
    // ============================================================

    const [address, setAddress] = useState({
      name: user?.name || "",
      phone: user?.phone || "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
    });

    // ============================================================
    // PAYMENT
    // ============================================================

    const [paymentMethod, setPaymentMethod] =
      useState("COD");

    // ============================================================
    // PRICING
    // ============================================================

    const [pricing, setPricing] = useState({});

    const [loadingPricing, setLoadingPricing] =
      useState(true);

    // ============================================================
    // GENERAL STATE
    // ============================================================

    const [loading, setLoading] =
      useState(false);

    const [error, setError] =
      useState("");

    const [successMessage, setSuccessMessage] =
      useState("");

    // ============================================================
    // WHOLESALE QUOTATION
    // ============================================================

    const [quotation, setQuotation] = useState(null);
    const [loadingQuotation, setLoadingQuotation] = useState(
      isWholesaleOrder
    );

    // ============================================================
    // LOAD ACCEPTED QUOTATION
    // ============================================================

    useEffect(() => {
      let cancelled = false;

      const loadQuotation = async () => {
        if (!quotationId) {
          setQuotation(null);
          setLoadingQuotation(false);
          return;
        }

        try {
          setLoadingQuotation(true);
          setError("");

          const response = await getQuotationById(quotationId);
          const receivedQuotation =
            response?.quotation ||
            response?.data?.quotation ||
            response?.data ||
            null;

          if (!receivedQuotation) {
            throw new Error("Quotation could not be found.");
          }

          if (receivedQuotation.status !== "accepted") {
            throw new Error(
              "Only an accepted quotation can be converted into an order."
            );
          }

          if (
            receivedQuotation.validUntil &&
            new Date() > new Date(receivedQuotation.validUntil)
          ) {
            throw new Error("This quotation has expired.");
          }

          if (
            !Array.isArray(receivedQuotation.items) ||
            receivedQuotation.items.length === 0
          ) {
            throw new Error("Quotation does not contain any items.");
          }

          if (!cancelled) {
            setQuotation(receivedQuotation);
          }
        } catch (err) {
          console.error("Wholesale quotation load error:", err);

          if (!cancelled) {
            setQuotation(null);
            setError(
              err?.response?.data?.message ||
                err?.message ||
                "Unable to load quotation."
            );
          }
        } finally {
          if (!cancelled) {
            setLoadingQuotation(false);
          }
        }
      };

      loadQuotation();

      return () => {
        cancelled = true;
      };
    }, [quotationId]);

    // ============================================================
    // FETCH WHOLESALE PRICES
    // ============================================================

    useEffect(() => {
      let cancelled = false;

      const calculatePrices = async () => {
        if (
          !isWholesaleOrder &&
          (!cartItems || cartItems.length === 0)
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

          for (const item of cartItems) {
            const productId =
              item?._id ||
              item?.product?._id ||
              item?.product;

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
                        Number(
                          item.quantity || 1
                        ),
                    },
                  }
                );

              const data =
                response?.data ?? response;

              const priceData =
                data?.data ||
                data?.pricing ||
                data;

              results[productId] =
                priceData;
            } catch (priceError) {
              console.error(
                "Wholesale price error:",
                productId,
                priceError
              );

              // Fallback to normal product price
              results[productId] = {
                unitPrice:
                  Number(
                    item?.price || 0
                  ),

                subtotal:
                  Number(
                    item?.price || 0
                  ) *
                  Number(
                    item?.quantity || 1
                  ),
              };
            }
          }

          if (!cancelled) {
            setPricing(results);
          }
        } catch (err) {
          console.error(
            "Calculate wholesale prices error:",
            err
          );

          if (!cancelled) {
            setError(
              err?.response?.data?.message ||
                err?.message ||
                "Failed to calculate wholesale prices"
            );
          }
        } finally {
          if (!cancelled) {
            setLoadingPricing(false);
          }
        }
      };

      calculatePrices();

      return () => {
        cancelled = true;
      };
    }, [cartItems]);

    // ============================================================
    // ADDRESS CHANGE
    // ============================================================

    const handleChange = (e) => {
      const {
        name,
        value,
      } = e.target;

      setAddress((previous) => ({
        ...previous,
        [name]: value,
      }));
    };

    // ============================================================
    // GET PRODUCT ID
    // ============================================================

    const getProductId = (item) => {
      return (
        item?._id ||
        item?.product?._id ||
        item?.product ||
        ""
      );
    };

    // ============================================================
    // CHECKOUT ITEMS
    // ============================================================

    const checkoutItems = isWholesaleOrder
      ? (quotation?.items || []).map((item) => ({
          _id: item?.product?._id || item?.product || item?.productId,
          product: item?.product,
          name: item?.productName || item?.product?.name || "Product",
          image:
            item?.product?.images?.[0] ||
            item?.product?.image ||
            item?.image ||
            "https://via.placeholder.com/100",
          quantity: Number(item?.quantity || 1),
          price: Number(item?.unitPrice || 0),
          unit: item?.unit || "piece",
          quotationItem: true,
        }))
      : cartItems || [];

    // ============================================================
    // ITEMS PRICE
    // ============================================================

    const itemsPrice = (
      checkoutItems || []
    ).reduce((sum, item) => {
      const productId =
        getProductId(item);

      const itemPricing =
        pricing[productId];

      const quantity =
        Number(
          item?.quantity || 1
        );

      const subtotal =
        Number(
          itemPricing?.subtotal ??
            itemPricing?.total ??
            Number(
              item?.price || 0
            ) * quantity
        );

      return sum + subtotal;
    }, 0);

    // ============================================================
    // SHIPPING
    //
    // NOTE:
    // Current backend createOrder calculates totalAmount
    // from cart subtotal and does NOT add shippingPrice.
    //
    // Therefore Razorpay amount currently remains itemsPrice.
    // ============================================================

    const shippingPrice = 0;

    // ============================================================
    // TOTAL
    // ============================================================

    const totalPrice =
      itemsPrice + shippingPrice;

    // ============================================================
    // VALIDATE ADDRESS
    // ============================================================

    const validateAddress = () => {
      if (!address.name.trim()) {
        return "Name is required.";
      }

      if (!address.phone.trim()) {
        return "Phone is required.";
      }

      if (!address.addressLine1.trim()) {
        return "Address is required.";
      }

      if (!address.city.trim()) {
        return "City is required.";
      }

      if (!address.state.trim()) {
        return "State is required.";
      }

      if (!address.postalCode.trim()) {
        return "Postal code is required.";
      }

      if (!address.country.trim()) {
        return "Country is required.";
      }

      return null;
    };

    // ============================================================
    // CREATE DATABASE ORDER
    //
    // IMPORTANT:
    //
    // Backend expects these fields directly:
    //
    // name
    // phone
    // addressLine1
    // addressLine2
    // city
    // state
    // postalCode
    // country
    //
    // NOT:
    //
    // shippingAddress: {}
    // orderItems: []
    //
    // Backend creates order items from the logged-in user's cart.
    // ============================================================

    const createOrderInDB = async () => {
      // ========================================================
      // WHOLESALE QUOTATION ORDER
      // ========================================================

      if (isWholesaleOrder) {
        if (!quotationId) {
          throw new Error("Quotation ID is missing.");
        }

        if (!quotation) {
          throw new Error("Quotation is still loading. Please try again.");
        }

        const response = await createOrderFromQuotation({
          quotationId,
          shippingAddress: {
            name: address.name.trim(),
            phone: address.phone.trim(),
            addressLine1: address.addressLine1.trim(),
            addressLine2: address.addressLine2.trim(),
            city: address.city.trim(),
            state: address.state.trim(),
            postalCode: address.postalCode.trim(),
            country: address.country.trim(),
          },
          paymentMethod:
            paymentMethod === "Razorpay" ? "razorpay" : "cod",
        });

        const responseData = response?.data ?? response;
        const createdOrder =
          responseData?.order ||
          responseData?.data?.order ||
          responseData?.data ||
          responseData;

        const orderId = createdOrder?._id || createdOrder?.id;

        if (!orderId) {
          throw new Error(
            "Order was created but Order ID was not returned by the server."
          );
        }

        return {
          order: createdOrder,
          orderId: String(orderId),
        };
      }

      console.log("");
      console.log(
        "========================================"
      );

      console.log(
        "CREATING DATABASE ORDER"
      );

      console.log(
        "========================================"
      );

      const payload = {
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
      };

      console.log(
        "Order Payload:",
        payload
      );

      const response =
        await API.post(
          "/orders",
          payload
        );

      const responseData =
        response?.data ?? response;

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
          "Order ID missing:",
          responseData
        );

        throw new Error(
          "Order was created but Order ID was not returned by the server."
        );
      }

      console.log(
        "DATABASE ORDER ID:",
        orderId
      );

      return {
        order:
          createdOrder,

        orderId:
          String(orderId),
      };
    };

    // ============================================================
    // CREATE RAZORPAY ORDER
    //
    // POST /api/payments/create-order
    //
    // Body:
    //
    // {
    //   orderId: "MongoDB Order ID"
    // }
    //
    // ============================================================

    const createRazorpayOrder =
      async (orderId) => {
        if (!orderId) {
          throw new Error(
            "Order ID is missing. Cannot create payment order."
          );
        }

        console.log("");
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
          response?.data ?? response;

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
          paymentData?.razorpayOrder?.id ||
          responseData?.razorpayOrder?.id;

        const amount =
          paymentData?.amountInPaise ??
          responseData?.amountInPaise;

        const currency =
          paymentData?.currency ||
          responseData?.currency ||
          "INR";

        const keyId =
          paymentData?.keyId ||
          responseData?.keyId ||
          import.meta.env
            .VITE_RAZORPAY_KEY_ID;

        if (!razorpayOrderId) {
          console.error(
            "Razorpay Order ID missing:",
            responseData
          );

          throw new Error(
            "Razorpay order ID was not returned by the server."
          );
        }

        if (
          amount === undefined ||
          amount === null
        ) {
          throw new Error(
            "Razorpay amount was not returned by the server."
          );
        }

        if (!keyId) {
          throw new Error(
            "Razorpay Key ID is missing."
          );
        }

        return {
          id:
            razorpayOrderId,

          amount:
            Number(amount),

          currency,

          keyId,
        };
      };

    // ============================================================
    // VERIFY RAZORPAY PAYMENT
    //
    // POST /api/payments/verify
    // ============================================================

    const verifyRazorpayPayment =
      async (
        paymentResponse
      ) => {
        console.log("");
        console.log(
          "========================================"
        );

        console.log(
          "VERIFYING RAZORPAY PAYMENT"
        );

        console.log(
          "========================================"
        );

        console.log(
          "Payment Response:",
          paymentResponse
        );

        const razorpayOrderId =
          paymentResponse?.razorpay_order_id;

        const razorpayPaymentId =
          paymentResponse?.razorpay_payment_id;

        const razorpaySignature =
          paymentResponse?.razorpay_signature;

        if (!razorpayOrderId) {
          throw new Error(
            "Razorpay Order ID is missing."
          );
        }

        if (!razorpayPaymentId) {
          throw new Error(
            "Razorpay Payment ID is missing."
          );
        }

        if (!razorpaySignature) {
          throw new Error(
            "Razorpay payment signature is missing."
          );
        }

        const response =
          await API.post(
            "/payments/verify",
            {
              razorpayOrderId:
                razorpayOrderId,

              razorpayPaymentId:
                razorpayPaymentId,

              razorpaySignature:
                razorpaySignature,
            }
          );

        const responseData =
          response?.data ?? response;

        console.log(
          "PAYMENT VERIFY RESPONSE:",
          responseData
        );

        if (
          responseData?.success === false
        ) {
          throw new Error(
            responseData?.message ||
              "Payment verification failed."
          );
        }

        return responseData;
      };

    // ============================================================
    // OPEN RAZORPAY CHECKOUT
    // ============================================================

    const openRazorpayCheckout =
      async (databaseOrderId) => {
        // ========================================================
        // CHECK SDK
        // ========================================================

        if (!window.Razorpay) {
          throw new Error(
            "Razorpay SDK is not loaded. Please add Razorpay Checkout script to index.html."
          );
        }

        // ========================================================
        // CREATE RAZORPAY ORDER
        // ========================================================

        const razorpayOrder =
          await createRazorpayOrder(
            databaseOrderId
          );

        console.log(
          "Opening Razorpay Checkout:",
          razorpayOrder
        );

        // ========================================================
        // RAZORPAY OPTIONS
        // ========================================================

        const options = {
          key:
            razorpayOrder.keyId,

          amount:
            razorpayOrder.amount,

          currency:
            razorpayOrder.currency,

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
              String(databaseOrderId),
          },

          theme: {
            color:
              "#0d9488",
          },

          // ======================================================
          // PAYMENT SUCCESS
          // ======================================================

          handler:
            async (
              paymentResponse
            ) => {
              try {
                setLoading(true);
                setError("");

                console.log(
                  "Razorpay Success:",
                  paymentResponse
                );

                // ==================================================
                // VERIFY PAYMENT
                // ==================================================

                await verifyRazorpayPayment(
                  paymentResponse
                );

                // ==================================================
                // PAYMENT VERIFIED
                // ==================================================

                clearCart();

                setSuccessMessage(
                  "Payment successful. Your order has been confirmed."
                );

                // ==================================================
                // GO TO ORDER SUCCESS PAGE
                // ==================================================

                navigate(
                  `/order-success/${databaseOrderId}`
                );
              } catch (err) {
                console.error(
                  "Payment verification error:",
                  err
                );

                setError(
                  err?.response?.data?.message ||
                    err?.message ||
                    "Payment verification failed."
                );

                setLoading(false);
              }
            },

          // ======================================================
          // MODAL DISMISS
          // ======================================================

          modal: {
            ondismiss: () => {
              console.log(
                "Razorpay Checkout closed."
              );

              setLoading(false);

              setError(
                "Payment was cancelled."
              );
            },
          },
        };

        // ========================================================
        // CREATE RAZORPAY INSTANCE
        // ========================================================

        const razorpay =
          new window.Razorpay(
            options
          );

        // ========================================================
        // PAYMENT FAILED EVENT
        // ========================================================

        razorpay.on(
          "payment.failed",
          (response) => {
            console.error(
              "Razorpay payment failed:",
              response
            );

            setLoading(false);

            setError(
              response?.error
                ?.description ||
                "Payment failed. Please try again."
            );
          }
        );

        // ========================================================
        // OPEN CHECKOUT
        // ========================================================

        razorpay.open();
      };

    // ============================================================
    // PLACE ORDER
    // ============================================================

    const handlePlaceOrder =
      async (e) => {
        e.preventDefault();

        setError("");
        setSuccessMessage("");

        // ========================================================
        // LOGIN CHECK
        // ========================================================

        if (!isLoggedIn) {
          setError(
            "Please login to place an order."
          );

          return;
        }

        // ========================================================
        // CART CHECK
        // ========================================================

        if (
          !cartItems ||
          cartItems.length === 0
        ) {
          setError(
            "Your cart is empty."
          );

          return;
        }

        // ========================================================
        // ADDRESS CHECK
        // ========================================================

        const addressError =
          validateAddress();

        if (addressError) {
          setError(
            addressError
          );

          return;
        }

        // ========================================================
        // QUOTATION LOADING
        // ========================================================

        if (isWholesaleOrder && loadingQuotation) {
          setError("Please wait while the quotation is loaded.");
          return;
        }

        if (isWholesaleOrder && !quotation) {
          setError("Unable to load the accepted quotation.");
          return;
        }

        // ========================================================
        // PRICE LOADING
        // ========================================================

        if (!isWholesaleOrder && loadingPricing) {
          setError(
            "Please wait while prices are calculated."
          );

          return;
        }

        // ========================================================
        // PRICE CHECK
        // ========================================================

        if (itemsPrice <= 0) {
          setError(
            "Unable to calculate the order amount."
          );

          return;
        }

        // ========================================================
        // START
        // ========================================================

        setLoading(true);

        try {
          // ======================================================
          // STEP 1
          // CREATE DATABASE ORDER
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
            // ====================================================
            // STEP 2
            // CREATE RAZORPAY ORDER
            // ====================================================

            await openRazorpayCheckout(
              orderId
            );

            return;
          }

          throw new Error(
            "Invalid payment method selected."
          );
        } catch (err) {
          console.error(
            "PLACE ORDER ERROR:",
            err
          );

          const backendMessage =
            err?.response?.data
              ?.message;

          setError(
            backendMessage ||
              err?.message ||
              "Failed to place order."
          );

          setLoading(false);
        }
      };

    // ============================================================
    // EMPTY CART
    // ============================================================

    if (
      !cartItems ||
      cartItems.length === 0
    ) {
      return (
        <div className="max-w-3xl mx-auto px-4 py-20">
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-sm">
            <div className="text-5xl mb-4">
              🛒
            </div>

            <h1 className="text-2xl font-bold text-slate-800">
              Your cart is empty
            </h1>

            <p className="text-slate-500 mt-2">
              Add some products before
              proceeding to checkout.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/products"
                )
              }
              className="mt-6 px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      );
    }

    // ============================================================
    // INPUT CLASS
    // ============================================================

    const inputClass =
      "w-full border border-slate-300 rounded-lg px-4 py-3 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent";

    // ============================================================
    // UI
    // ============================================================

    return (
      <section className="min-h-screen bg-slate-50 py-10">
        <div className="max-w-6xl mx-auto px-4">

          {/* ======================================================
              HEADER
          ====================================================== */}

          <div className="mb-8">
            <p className="text-sm text-teal-600 font-semibold uppercase tracking-wide">
              Shanti Enterprises
            </p>

            <h1 className="text-3xl font-bold text-slate-900 mt-1">
              Checkout
            </h1>

            <p className="text-slate-500 mt-2">
              {isWholesaleOrder
                ? "Complete your shipping details and place your wholesale order."
                : "Complete your shipping details and place your order."}
            </p>
          </div>

          {/* ======================================================
              ERROR
          ====================================================== */}

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm font-medium text-red-700">
                {error}
              </p>
            </div>
          )}

          {/* ======================================================
              SUCCESS
          ====================================================== */}

          {successMessage && (
            <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
              <p className="text-sm font-medium text-green-700">
                {successMessage}
              </p>
            </div>
          )}

          {/* ======================================================
              MAIN GRID
          ====================================================== */}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ====================================================
                CHECKOUT FORM
            ==================================================== */}

            <div className="lg:col-span-2">
              <form
                onSubmit={
                  handlePlaceOrder
                }
                className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8"
              >

                {/* ==================================================
                    SHIPPING ADDRESS
                ================================================== */}

                <div className="mb-8">
                  <h2 className="text-xl font-bold text-slate-800">
                    Shipping Address
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Enter the address where you
                    want the order delivered.
                  </p>
                </div>

                {/* NAME */}

                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={
                      address.name
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter full name"
                    className={
                      inputClass
                    }
                    required
                  />
                </div>

                {/* PHONE */}

                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={
                      address.phone
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter phone number"
                    className={
                      inputClass
                    }
                    required
                  />
                </div>

                {/* ADDRESS LINE 1 */}

                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Address
                  </label>

                  <input
                    type="text"
                    name="addressLine1"
                    value={
                      address.addressLine1
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="House / Building / Street"
                    className={
                      inputClass
                    }
                    required
                  />
                </div>

                {/* ADDRESS LINE 2 */}

                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Address Line 2
                    <span className="text-slate-400 font-normal">
                      {" "}
                      (Optional)
                    </span>
                  </label>

                  <input
                    type="text"
                    name="addressLine2"
                    value={
                      address.addressLine2
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Landmark / Area"
                    className={
                      inputClass
                    }
                  />
                </div>

                {/* CITY + STATE */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      City
                    </label>

                    <input
                      type="text"
                      name="city"
                      value={
                        address.city
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="City"
                      className={
                        inputClass
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      State
                    </label>

                    <input
                      type="text"
                      name="state"
                      value={
                        address.state
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="State"
                      className={
                        inputClass
                      }
                      required
                    />
                  </div>

                </div>

                {/* POSTAL + COUNTRY */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Postal Code
                    </label>

                    <input
                      type="text"
                      name="postalCode"
                      value={
                        address.postalCode
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="411014"
                      className={
                        inputClass
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Country
                    </label>

                    <input
                      type="text"
                      name="country"
                      value={
                        address.country
                      }
                      onChange={
                        handleChange
                      }
                      className={
                        inputClass
                      }
                      required
                    />
                  </div>

                </div>

                {/* ==================================================
                    PAYMENT METHOD
                ================================================== */}

                <div className="border-t border-slate-200 pt-8">

                  <h2 className="text-xl font-bold text-slate-800">
                    Payment Method
                  </h2>

                  <p className="text-sm text-slate-500 mt-1 mb-5">
                    Select how you want to pay.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* COD */}

                    <label
                      className={`cursor-pointer rounded-xl border p-4 transition ${
                        paymentMethod ===
                        "COD"
                          ? "border-teal-500 bg-teal-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-start gap-3">

                        <input
                          type="radio"
                          name="paymentMethod"
                          value="COD"
                          checked={
                            paymentMethod ===
                            "COD"
                          }
                          onChange={(e) =>
                            setPaymentMethod(
                              e.target.value
                            )
                          }
                          className="mt-1"
                        />

                        <div>
                          <p className="font-semibold text-slate-800">
                            Cash on Delivery
                          </p>

                          <p className="text-sm text-slate-500 mt-1">
                            Pay when your order
                            is delivered.
                          </p>
                        </div>

                      </div>
                    </label>

                    {/* RAZORPAY */}

                    <label
                      className={`cursor-pointer rounded-xl border p-4 transition ${
                        paymentMethod ===
                        "Razorpay"
                          ? "border-teal-500 bg-teal-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-start gap-3">

                        <input
                          type="radio"
                          name="paymentMethod"
                          value="Razorpay"
                          checked={
                            paymentMethod ===
                            "Razorpay"
                          }
                          onChange={(e) =>
                            setPaymentMethod(
                              e.target.value
                            )
                          }
                          className="mt-1"
                        />

                        <div>
                          <p className="font-semibold text-slate-800">
                            Online Payment
                          </p>

                          <p className="text-sm text-slate-500 mt-1">
                            Pay securely using
                            Razorpay.
                          </p>
                        </div>

                      </div>
                    </label>

                  </div>
                </div>

                {/* ==================================================
                    PLACE ORDER
                ================================================== */}

                <button
                  type="submit"
                  disabled={
                    loading ||
                    loadingPricing
                  }
                  className="w-full mt-8 bg-teal-600 text-white py-3.5 rounded-xl hover:bg-teal-700 transition font-semibold disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                  {loading
                    ? "Processing..."
                    : loadingPricing
                    ? "Calculating Prices..."
                    : paymentMethod ===
                      "Razorpay"
                    ? "Proceed to Payment"
                    : isWholesaleOrder
                    ? "Place Wholesale Order"
                    : "Place Order"}
                </button>

              </form>
            </div>

            {/* ====================================================
                ORDER SUMMARY
            ==================================================== */}

            <aside className="lg:col-span-1">
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sticky top-6">

                <h2 className="text-xl font-bold text-slate-800 mb-5">
                  Order Summary
                </h2>

                {isWholesaleOrder && quotation && (
                  <div className="mb-5 rounded-xl border border-teal-200 bg-teal-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
                      Wholesale Quotation
                    </p>
                    <p className="text-sm font-semibold text-slate-800 mt-1">
                      {quotation.quotationNumber || quotation._id}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Accepted quotation pricing will be used for this order.
                    </p>
                  </div>
                )}

                {/* ITEMS */}

                <div className="space-y-4">

                  {checkoutItems.map(
                    (
                      item,
                      index
                    ) => {
                      const productId =
                        getProductId(
                          item
                        );

                      const itemPricing = isWholesaleOrder
                        ? {
                            unitPrice: Number(item?.price || 0),
                            subtotal:
                              Number(item?.price || 0) *
                              Number(item?.quantity || 1),
                          }
                        : pricing[productId];

                      const quantity =
                        Number(
                          item?.quantity ||
                            1
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
                        item?.image ||
                        item?.product
                          ?.image ||
                        "https://via.placeholder.com/100";

                      const name =
                        item?.name ||
                        item?.product
                          ?.name ||
                        "Product";

                      return (
                        <div
                          key={
                            productId ||
                            index
                          }
                          className="flex gap-3 border-b border-slate-100 pb-4"
                        >

                          <img
                            src={image}
                            alt={name}
                            className="w-16 h-16 rounded-lg object-cover bg-slate-100"
                          />

                          <div className="flex-1 min-w-0">

                            <p className="font-medium text-sm text-slate-800 line-clamp-2">
                              {name}
                            </p>

                            <p className="text-xs text-slate-500 mt-1">
                              Qty:{" "}
                              {quantity}
                            </p>

                            <p className="text-xs text-slate-500">
                              ₹
                              {unitPrice.toLocaleString(
                                "en-IN"
                              )}{" "}
                              / unit
                            </p>

                          </div>

                          <div className="text-sm font-semibold text-slate-800 whitespace-nowrap">
                            ₹
                            {subtotal.toLocaleString(
                              "en-IN"
                            )}
                          </div>

                        </div>
                      );
                    }
                  )}

                </div>

                {/* ==================================================
                    PRICE BREAKDOWN
                ================================================== */}

                <div className="border-t border-slate-200 mt-5 pt-5 space-y-3">

                  <div className="flex justify-between text-sm text-slate-600">
                    <span>
                      Products
                    </span>

                    <span>
                      ₹
                      {itemsPrice.toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm text-slate-600">
                    <span>
                      Shipping
                    </span>

                    <span>
                      ₹
                      {shippingPrice.toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </div>

                  <div className="border-t border-slate-200 pt-4 flex justify-between">

                    <span className="text-lg font-bold text-slate-800">
                      Total
                    </span>

                    <span className="text-lg font-bold text-teal-700">
                      ₹
                      {totalPrice.toLocaleString(
                        "en-IN"
                      )}
                    </span>

                  </div>

                </div>

                {/* ==================================================
                    PAYMENT INFO
                ================================================== */}

                <div className="mt-6 rounded-xl bg-slate-50 p-4">

                  <p className="text-xs text-slate-500 uppercase tracking-wide">
                    Payment
                  </p>

                  <p className="text-sm font-semibold text-slate-800 mt-1">
                    {paymentMethod ===
                    "Razorpay"
                      ? "Online Payment"
                      : "Cash on Delivery"}
                  </p>

                </div>

              </div>
            </aside>

          </div>
        </div>
      </section>
    );
  };

  export default CheckoutPage;