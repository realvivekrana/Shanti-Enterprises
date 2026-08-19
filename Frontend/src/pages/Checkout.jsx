import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const {
    cartItems,
    clearCart,
  } = useCart();

  const navigate = useNavigate();

  // ==============================
  // ADDRESS
  // ==============================

  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
  });

  // ==============================
  // PAYMENT METHOD
  // ==============================

  const [paymentMethod, setPaymentMethod] =
    useState('COD');

  const [pricing, setPricing] =
    useState({});

  const [loadingPricing, setLoadingPricing] =
    useState(true);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  // ==============================
  // USER
  // ==============================

  const userInfo =
    localStorage.getItem('userInfo');

  const isLoggedIn =
    !!userInfo;

  const user =
    userInfo
      ? JSON.parse(userInfo)
      : null;

  // ==============================
  // FETCH WHOLESALE PRICES
  // ==============================

  useEffect(() => {
    const calculatePrices = async () => {
      if (cartItems.length === 0) {
        setLoadingPricing(false);
        return;
      }

      setLoadingPricing(true);
      setError('');

      try {
        const results = {};

        for (const item of cartItems) {
          const { data } =
            await API.get(
              `/products/${item._id}/wholesale-price`,
              {
                params: {
                  quantity: item.quantity,
                },
              }
            );

          results[item._id] = data;
        }

        setPricing(results);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            'Failed to calculate wholesale prices'
        );
      } finally {
        setLoadingPricing(false);
      }
    };

    calculatePrices();
  }, [cartItems]);

  // ==============================
  // ADDRESS CHANGE
  // ==============================

  const handleChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  // ==============================
  // PRICES
  // ==============================

  const itemsPrice =
    cartItems.reduce(
      (sum, item) => {
        const itemPricing =
          pricing[item._id];

        if (!itemPricing) {
          return sum;
        }

        return (
          sum +
          Number(
            itemPricing.subtotal || 0
          )
        );
      },
      0
    );

  const shippingPrice = 50;

  const totalPrice =
    itemsPrice +
    shippingPrice;

  // ==============================
  // BACKEND PAYMENT METHOD
  // ==============================
  //
  // UI:
  // UPI
  // Card
  // Net Banking
  // COD
  // Credit Terms
  //
  // Backend currently uses:
  // Razorpay
  // COD
  //
  // Therefore online methods are
  // converted to Razorpay before
  // sending the order.
  // ==============================

  const getBackendPaymentMethod = () => {
    if (
      paymentMethod === 'UPI' ||
      paymentMethod === 'Card' ||
      paymentMethod === 'Net Banking'
    ) {
      return 'Razorpay';
    }

    return paymentMethod;
  };

  // ==============================
  // CREATE ORDER IN DATABASE
  // ==============================

  const createOrderInDB =
    async (paymentResult = null) => {

      const orderItems =
        cartItems.map((item) => ({
          product:
            item._id,

          name:
            item.name,

          quantity:
            item.quantity,

          // Backend calculates actual
          // wholesale price.
          price:
            pricing[item._id]
              ?.unitPrice ||
            item.price,
        }));

      const backendPaymentMethod =
        getBackendPaymentMethod();

      const { data } =
        await API.post(
          '/orders',
          {
            orderItems,

            shippingAddress:
              address,

            paymentMethod:
              backendPaymentMethod,

            itemsPrice,

            shippingPrice,

            totalPrice,
          }
        );

      // ==============================
      // ORDER RESPONSE
      // ==============================

      const createdOrder =
        data?.order || data;

      if (!createdOrder?._id) {
        throw new Error(
          'Order was created but order ID was not returned.'
        );
      }

      // ==============================
      // MARK ORDER AS PAID
      // ==============================

      if (paymentResult) {
        await API.put(
          `/orders/${createdOrder._id}/pay`,
          paymentResult
        );
      }

      // ==============================
      // CLEAR CART
      // ==============================

      clearCart();

      // ==============================
      // SUCCESS PAGE
      // ==============================

      navigate(
        `/order-success/${createdOrder._id}`
      );
    };

  // ==============================
  // RAZORPAY PAYMENT
  // ==============================

  const handleRazorpayPayment =
    async () => {

      try {
        const { data } =
          await API.post(
            '/payment/create-order',
            {
              amount:
                totalPrice,
            }
          );

        const options = {
          key:
            'rzp_test_TQ87uv6EO8OzPI',

          amount:
            data.amount,

          currency:
            'INR',

          name:
            'Shanti Enterprises',

          description:
            'Wholesale Order Payment',

          order_id:
            data.id,

          handler:
            async (response) => {

              try {
                // ==============================
                // VERIFY PAYMENT
                // ==============================

                await API.post(
                  '/payment/verify',
                  response
                );

                // ==============================
                // CREATE ORDER
                // ==============================

                await createOrderInDB({
                  id:
                    response.razorpay_payment_id,

                  status:
                    'success',

                  updateTime:
                    new Date().toISOString(),
                });

              } catch (err) {
                setError(
                  err.response?.data?.message ||
                    err.message ||
                    'Payment verification failed'
                );
              } finally {
                setLoading(false);
              }
            },

          prefill: {
            name:
              user?.name || '',

            email:
              user?.email || '',

            contact:
              address.phone,
          },

          theme: {
            color:
              '#0d9488',
          },

          modal: {
            ondismiss:
              () =>
                setLoading(false),
          },
        };

        // ==============================
        // CHECK RAZORPAY
        // ==============================

        if (!window.Razorpay) {
          throw new Error(
            'Razorpay SDK is not loaded.'
          );
        }

        const razorpayInstance =
          new window.Razorpay(
            options
          );

        razorpayInstance.open();

      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            'Failed to initiate payment'
        );

        setLoading(false);
      }
    };

  // ==============================
  // PLACE ORDER
  // ==============================

  const handlePlaceOrder =
    async (e) => {

      e.preventDefault();

      setError('');

      // ==============================
      // LOGIN
      // ==============================

      if (!isLoggedIn) {
        setError(
          'Please login to place an order.'
        );

        return;
      }

      // ==============================
      // PRICING
      // ==============================

      if (loadingPricing) {
        setError(
          'Please wait while wholesale prices are calculated.'
        );

        return;
      }

      // ==============================
      // CHECK PRICES
      // ==============================

      if (
        Object.keys(pricing).length !==
        cartItems.length
      ) {
        setError(
          'Unable to calculate all product prices.'
        );

        return;
      }

      // ==============================
      // CREDIT TERMS
      // ==============================
      //
      // IMPORTANT:
      // Credit Terms needs backend
      // support in Order model.
      //
      // Until backend enum supports it,
      // don't send the order.
      // ==============================

      if (
        paymentMethod === 'Credit Terms'
      ) {
        setError(
          'Credit Terms payment is not enabled in the backend yet.'
        );

        return;
      }

      // ==============================
      // LOADING
      // ==============================

      setLoading(true);

      try {

        // ==============================
        // ONLINE PAYMENT
        // ==============================

        if (
          paymentMethod === 'Razorpay' ||
          paymentMethod === 'UPI' ||
          paymentMethod === 'Card' ||
          paymentMethod === 'Net Banking'
        ) {

          await handleRazorpayPayment();

        } else {

          // ==============================
          // COD
          // ==============================

          await createOrderInDB();

          setLoading(false);
        }

      } catch (err) {

        setError(
          err.response?.data?.message ||
            err.message ||
            'Failed to place order'
        );

        setLoading(false);
      }
    };

  // ==============================
  // EMPTY CART
  // ==============================

  if (
    cartItems.length === 0
  ) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-500 text-lg">
          Your cart is empty.
        </p>
      </div>
    );
  }

  // ==============================
  // INPUT CLASS
  // ==============================

  const inputClass =
    'w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent';

  // ==============================
  // PAYMENT OPTION
  // ==============================

  const paymentOptions = [
    {
      value: 'UPI',
      title: 'UPI',
      description: 'Pay using UPI apps',
    },
    {
      value: 'Card',
      title: 'Card',
      description: 'Credit or Debit Card',
    },
    {
      value: 'Net Banking',
      title: 'Net Banking',
      description: 'Pay using your bank account',
    },
    {
      value: 'COD',
      title: 'COD',
      description: 'Cash on Delivery',
    },
    {
      value: 'Credit Terms',
      title: 'Credit Terms',
      description: 'Pay according to approved credit terms',
    },
  ];

  // ==============================
  // UI
  // ==============================

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">

      {/* ==============================
          HEADER
      ============================== */}

      <div className="mb-8">

        <p className="text-sm font-semibold text-teal-600">
          SHANTI ENTERPRISES
        </p>

        <h1 className="text-3xl font-bold text-slate-900 mt-1">
          Checkout
        </h1>

        <p className="text-slate-500 mt-2">
          Complete your wholesale order in three simple steps.
        </p>

      </div>

      {/* ==============================
          CHECKOUT STEPS
      ============================== */}

      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-8">

        <div className="grid grid-cols-3 gap-3">

          {/* STEP 1 */}

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold">
              ✓
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Step 1
              </p>

              <p className="font-semibold text-slate-800">
                Address
              </p>
            </div>

          </div>

          {/* STEP 2 */}

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold">
              ✓
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Step 2
              </p>

              <p className="font-semibold text-slate-800">
                Shipping
              </p>
            </div>

          </div>

          {/* STEP 3 */}

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold">
              3
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Step 3
              </p>

              <p className="font-semibold text-slate-800">
                Payment
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* ==============================
          ERROR
      ============================== */}

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* ==============================
            CHECKOUT FORM
        ============================== */}

        <form
          onSubmit={handlePlaceOrder}
          className="space-y-5"
        >

          {/* ==============================
              ADDRESS
          ============================== */}

          <div className="bg-white border border-slate-200 rounded-xl p-6">

            <h2 className="text-xl font-bold text-slate-900">
              Delivery Address
            </h2>

            <p className="text-sm text-slate-500 mt-1 mb-5">
              Enter the address where you want the wholesale order delivered.
            </p>

            {/* STREET */}

            <input
              type="text"
              name="street"
              placeholder="Street Address"
              required
              value={address.street}
              onChange={handleChange}
              className={inputClass}
            />

            {/* CITY + STATE */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">

              <input
                type="text"
                name="city"
                placeholder="City"
                required
                value={address.city}
                onChange={handleChange}
                className={inputClass}
              />

              <input
                type="text"
                name="state"
                placeholder="State"
                required
                value={address.state}
                onChange={handleChange}
                className={inputClass}
              />

            </div>

            {/* PINCODE + PHONE */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">

              <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                required
                value={address.pincode}
                onChange={handleChange}
                className={inputClass}
              />

              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                required
                value={address.phone}
                onChange={handleChange}
                className={inputClass}
              />

            </div>

          </div>

          {/* ==============================
              PAYMENT METHOD
          ============================== */}

          <div className="bg-white border border-slate-200 rounded-xl p-6">

            <h2 className="text-xl font-bold text-slate-900">
              Payment Method
            </h2>

            <p className="text-sm text-slate-500 mt-1 mb-5">
              Select your preferred payment option.
            </p>

            <div className="space-y-3">

              {paymentOptions.map(
                (option) => (

                  <label
                    key={option.value}
                    className={`flex items-start gap-3 border rounded-xl p-4 cursor-pointer transition ${
                      paymentMethod === option.value
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-slate-200 hover:border-teal-300'
                    }`}
                  >

                    <input
                      type="radio"
                      name="paymentMethod"
                      value={option.value}
                      checked={
                        paymentMethod ===
                        option.value
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
                        {option.title}
                      </p>

                      <p className="text-sm text-slate-500 mt-1">
                        {option.description}
                      </p>

                    </div>

                  </label>

                )
              )}

            </div>

            {/* ONLINE PAYMENT INFO */}

            {(
              paymentMethod === 'UPI' ||
              paymentMethod === 'Card' ||
              paymentMethod === 'Net Banking'
            ) && (

              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">

                You will be redirected to Razorpay
                to complete your{' '}
                {paymentMethod} payment.

              </div>

            )}

            {/* CREDIT TERMS INFO */}

            {paymentMethod === 'Credit Terms' && (

              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-700">

                Credit Terms requires backend
                approval and customer credit
                configuration.

              </div>

            )}

          </div>

          {/* ==============================
              PLACE ORDER
          ============================== */}

          <button
            type="submit"
            disabled={
              loading ||
              loadingPricing ||
              paymentMethod === 'Credit Terms'
            }
            className="w-full bg-teal-600 text-white py-3.5 rounded-lg hover:bg-teal-700 transition-colors font-semibold disabled:bg-slate-300 disabled:cursor-not-allowed"
          >

            {loading
              ? 'Processing...'
              : loadingPricing
              ? 'Calculating prices...'
              : paymentMethod === 'Credit Terms'
              ? 'Credit Terms Not Available'
              : 'Place Order'}

          </button>

        </form>

        {/* ==============================
            ORDER SUMMARY
        ============================== */}

        <div className="bg-white border border-slate-200 rounded-xl p-6 h-fit">

          <h2 className="text-xl font-bold text-slate-900 mb-5">
            Wholesale Order Summary
          </h2>

          {/* PRODUCTS */}

          {cartItems.map(
            (item) => {

              const itemPricing =
                pricing[item._id];

              return (

                <div
                  key={item._id}
                  className="py-4 border-b border-slate-100"
                >

                  <div className="flex justify-between gap-4 text-sm">

                    <div>

                      <p className="font-semibold text-slate-800">
                        {item.name}
                      </p>

                      <p className="text-slate-500 mt-1">
                        Quantity: {item.quantity}
                      </p>

                    </div>

                    <span className="font-semibold text-slate-800 whitespace-nowrap">
                      ₹
                      {itemPricing
                        ? Number(
                            itemPricing.subtotal
                          ).toFixed(2)
                        : '—'}
                    </span>

                  </div>

                  {/* UNIT PRICE */}

                  {itemPricing && (

                    <div className="text-xs text-slate-500 mt-2">

                      ₹
                      {Number(
                        itemPricing.unitPrice
                      ).toFixed(2)}

                      {' / unit'}

                    </div>

                  )}

                  {/* WHOLESALE TIER */}

                  {itemPricing?.matchedTier && (

                    <div className="text-xs text-teal-700 mt-1">

                      Wholesale tier:{' '}

                      {
                        itemPricing
                          .matchedTier
                          .minQuantity
                      }

                      {' – '}

                      {
                        itemPricing
                          .matchedTier
                          .maxQuantity ??
                        '+'
                      }

                    </div>

                  )}

                </div>

              );
            }
          )}

          {/* PRODUCTS TOTAL */}

          <div className="border-t border-slate-200 mt-3 pt-4 flex justify-between text-sm text-slate-600">

            <span>
              Products
            </span>

            <span>
              ₹
              {itemsPrice.toFixed(2)}
            </span>

          </div>

          {/* SHIPPING */}

          <div className="flex justify-between text-sm text-slate-600 mt-3">

            <span>
              Shipping
            </span>

            <span>
              ₹
              {shippingPrice.toFixed(2)}
            </span>

          </div>

          {/* TOTAL */}

          <div className="border-t border-slate-200 mt-4 pt-4 flex justify-between font-bold text-xl text-slate-900">

            <span>
              Total
            </span>

            <span className="text-teal-700">
              ₹
              {totalPrice.toFixed(2)}
            </span>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Checkout;