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

  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
  });

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
  // ADDRESS
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
          Number(itemPricing.subtotal || 0)
        );
      },
      0
    );

  const shippingPrice = 50;

  const totalPrice =
    itemsPrice +
    shippingPrice;

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

          // Frontend price is only sent
          // for compatibility.
          //
          // Backend calculates the
          // actual wholesale price.
          price:
            pricing[item._id]
              ?.unitPrice ||
            item.price,
        }));

      const { data } =
        await API.post(
          '/orders',
          {
            orderItems,

            shippingAddress:
              address,

            paymentMethod,

            itemsPrice,

            shippingPrice,

            totalPrice,
          }
        );

      // ==========================================
      // IMPORTANT
      // ==========================================
      //
      // New backend response:
      //
      // {
      //   order: {...},
      //   inventory: [...]
      // }
      //
      // Keep compatibility if backend
      // returns the old direct order object.
      // ==========================================

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
      // GO TO SUCCESS PAGE
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

                const {
                  data: verifyData,
                } =
                  await API.post(
                    '/payment/verify',
                    response
                  );

                // Axios response interceptor
                // already unwraps ApiResponse.
                //
                // Therefore verifyData may be:
                // true/object instead of:
                // { success: true }

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
        // RAZORPAY CHECK
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
      // CHECK ALL PRICES
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
      // LOADING
      // ==============================

      setLoading(true);

      try {

        if (
          paymentMethod ===
          'Razorpay'
        ) {

          await handleRazorpayPayment();

        } else {

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
  // UI
  // ==============================

  return (

    <div className="max-w-4xl mx-auto px-4 py-10">

      <h1 className="text-2xl font-bold text-slate-800 mb-6">
        Wholesale Checkout
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* ==============================
            CHECKOUT FORM
        ============================== */}

        <form
          onSubmit={handlePlaceOrder}
          className="space-y-4"
        >

          <h2 className="font-semibold text-slate-800 text-sm uppercase tracking-wide">
            Shipping Address
          </h2>

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

          <div className="grid grid-cols-2 gap-4">

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

          <div className="grid grid-cols-2 gap-4">

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

          {/* ==============================
              PAYMENT METHOD
          ============================== */}

          <h2 className="font-semibold text-slate-800 text-sm uppercase tracking-wide pt-4">
            Payment Method
          </h2>

          <div className="flex gap-4">

            {/* COD */}

            <label className="flex items-center gap-2 text-sm text-slate-700">

              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={
                  paymentMethod ===
                  'COD'
                }
                onChange={(e) =>
                  setPaymentMethod(
                    e.target.value
                  )
                }
              />

              Cash on Delivery

            </label>

            {/* RAZORPAY */}

            <label className="flex items-center gap-2 text-sm text-slate-700">

              <input
                type="radio"
                name="paymentMethod"
                value="Razorpay"
                checked={
                  paymentMethod ===
                  'Razorpay'
                }
                onChange={(e) =>
                  setPaymentMethod(
                    e.target.value
                  )
                }
              />

              Online Payment

            </label>

          </div>

          {/* ==============================
              ERROR
          ============================== */}

          {error && (

            <p className="text-red-600 text-sm">
              {error}
            </p>

          )}

          {/* ==============================
              PLACE ORDER
          ============================== */}

          <button
            type="submit"
            disabled={
              loading ||
              loadingPricing
            }
            className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition-colors font-medium disabled:bg-slate-300"
          >

            {loading
              ? 'Processing...'
              : loadingPricing
              ? 'Calculating prices...'
              : 'Place Order'}

          </button>

        </form>

        {/* ==============================
            ORDER SUMMARY
        ============================== */}

        <div className="bg-white border border-slate-200 rounded-xl p-6 h-fit">

          <h2 className="font-semibold text-slate-800 mb-4">
            Wholesale Order Summary
          </h2>

          {cartItems.map(
            (item) => {

              const itemPricing =
                pricing[item._id];

              return (

                <div
                  key={item._id}
                  className="py-3 border-b border-slate-100"
                >

                  <div className="flex justify-between text-sm text-slate-700">

                    <span>

                      {item.name}

                      {' × '}

                      {item.quantity}

                    </span>

                    <span className="font-medium">

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

                    <div className="text-xs text-slate-500 mt-1">

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

          {/* PRODUCTS */}

          <div className="border-t border-slate-200 mt-3 pt-3 flex justify-between text-sm text-slate-600">

            <span>
              Products
            </span>

            <span>
              ₹
              {itemsPrice.toFixed(2)}
            </span>

          </div>

          {/* SHIPPING */}

          <div className="flex justify-between text-sm text-slate-600 mt-2">

            <span>
              Shipping
            </span>

            <span>
              ₹
              {shippingPrice.toFixed(2)}
            </span>

          </div>

          {/* TOTAL */}

          <div className="border-t border-slate-200 mt-3 pt-3 flex justify-between font-bold text-lg text-slate-800">

            <span>
              Total
            </span>

            <span>
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