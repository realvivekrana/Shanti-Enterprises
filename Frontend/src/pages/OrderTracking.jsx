import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import API from '../api/axios';

const OrderTracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ==========================================
  // ORDER STATUS
  // ==========================================

  const trackingSteps = [
    {
      key: 'Order Placed',
      title: 'Order Placed',
      description: 'Your order has been successfully placed.',
    },
    {
      key: 'Confirmed',
      title: 'Confirmed',
      description: 'Your order has been confirmed by the supplier.',
    },
    {
      key: 'Processing',
      title: 'Processing',
      description: 'Your order is being prepared.',
    },
    {
      key: 'Shipped',
      title: 'Shipped',
      description: 'Your order has been shipped.',
    },
    {
      key: 'Out for Delivery',
      title: 'Out for Delivery',
      description: 'Your order is on the way to you.',
    },
    {
      key: 'Delivered',
      title: 'Delivered',
      description: 'Your order has been delivered successfully.',
    },
  ];

  // ==========================================
  // FETCH ORDER
  // ==========================================

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) {
        setError('Order ID is missing.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        const { data } = await API.get(
          `/orders/${id}`
        );

        setOrder(data?.order || data);
      } catch (err) {
        console.error(
          'Order tracking error:',
          err
        );

        setError(
          err.response?.data?.message ||
            'Unable to load order details.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  // ==========================================
  // STATUS NORMALIZATION
  // ==========================================

  const normalizeStatus = (status) => {
    if (!status) {
      return 'Order Placed';
    }

    const value = String(status)
      .trim()
      .toLowerCase();

    const statusMap = {
      pending: 'Order Placed',
      placed: 'Order Placed',
      'order placed': 'Order Placed',

      confirmed: 'Confirmed',

      processing: 'Processing',

      shipped: 'Shipped',

      'out for delivery': 'Out for Delivery',

      delivered: 'Delivered',

      cancelled: 'Cancelled',
    };

    return (
      statusMap[value] ||
      status
    );
  };

  // ==========================================
  // CURRENT STATUS
  // ==========================================

  const currentStatus = normalizeStatus(
    order?.status
  );

  const currentIndex =
    trackingSteps.findIndex(
      (step) =>
        step.key === currentStatus
    );

  // ==========================================
  // STEP STATE
  // ==========================================

  const getStepState = (index) => {
    if (currentStatus === 'Cancelled') {
      return 'cancelled';
    }

    if (
      currentIndex === -1
    ) {
      return index === 0
        ? 'completed'
        : 'pending';
    }

    if (
      index < currentIndex
    ) {
      return 'completed';
    }

    if (
      index === currentIndex
    ) {
      return 'current';
    }

    return 'pending';
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center">

          <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-slate-500">
            Loading order tracking...
          </p>

        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-16">

        <div className="max-w-xl mx-auto bg-white border border-red-200 rounded-2xl p-8 text-center">

          <div className="w-14 h-14 mx-auto rounded-full bg-red-100 flex items-center justify-center text-red-600 text-2xl">
            !
          </div>

          <h1 className="text-xl font-bold text-slate-900 mt-4">
            Unable to Load Order
          </h1>

          <p className="text-slate-500 mt-2">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate('/orders')
            }
            className="mt-6 px-5 py-2.5 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700"
          >
            Back to My Orders
          </button>

        </div>

      </div>
    );
  }

  // ==========================================
  // NO ORDER
  // ==========================================

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-16">

        <div className="max-w-xl mx-auto text-center">

          <h1 className="text-2xl font-bold text-slate-900">
            Order Not Found
          </h1>

          <p className="text-slate-500 mt-2">
            We could not find this order.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate('/orders')
            }
            className="mt-6 px-5 py-2.5 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700"
          >
            Back to My Orders
          </button>

        </div>

      </div>
    );
  }

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return '—';
    }

    return new Date(date).toLocaleDateString(
      'en-IN',
      {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }
    );
  };

  // ==========================================
  // ORDER ITEMS
  // ==========================================

  const orderItems =
    order.orderItems ||
    order.items ||
    [];

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ==========================================
          HEADER
      ========================================== */}

      <section className="bg-white border-b border-slate-200">

        <div className="max-w-5xl mx-auto px-4 py-8">

          <p className="text-sm font-semibold uppercase tracking-wider text-teal-600">
            Shanti Enterprises
          </p>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1">
            Order Tracking
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            Track the progress of your wholesale order.
          </p>

        </div>

      </section>

      {/* ==========================================
          MAIN
      ========================================== */}

      <main className="max-w-5xl mx-auto px-4 py-8">

        {/* ==========================================
            ORDER SUMMARY
        ========================================== */}

        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 mb-6">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div>

              <p className="text-xs uppercase tracking-wide text-slate-500">
                Order ID
              </p>

              <h2 className="text-lg font-bold text-slate-900 mt-1 break-all">
                #{order._id}
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Placed on {formatDate(order.createdAt)}
              </p>

            </div>

            <div className="text-left sm:text-right">

              <p className="text-xs uppercase tracking-wide text-slate-500">
                Current Status
              </p>

              <span className="inline-flex mt-1 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-sm font-semibold">
                {currentStatus}
              </span>

            </div>

          </div>

        </div>

        {/* ==========================================
            TRACKING TIMELINE
        ========================================== */}

        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-8">

          <div className="flex items-center justify-between mb-8">

            <div>

              <h2 className="text-xl font-bold text-slate-900">
                Order Status
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Follow your order from placement to delivery.
              </p>

            </div>

          </div>

          <div className="relative">

            {trackingSteps.map(
              (step, index) => {

                const state =
                  getStepState(index);

                const isLast =
                  index ===
                  trackingSteps.length - 1;

                return (

                  <div
                    key={step.key}
                    className="relative flex gap-4 sm:gap-5"
                  >

                    {/* ==================================
                        LEFT TIMELINE
                    ================================== */}

                    <div className="relative flex flex-col items-center">

                      {/* CIRCLE */}

                      <div
                        className={`
                          w-10 h-10
                          rounded-full
                          flex
                          items-center
                          justify-center
                          text-sm
                          font-bold
                          z-10
                          border-2
                          transition-all
                          ${
                            state === 'completed'
                              ? 'bg-teal-600 border-teal-600 text-white'
                              : state === 'current'
                              ? 'bg-white border-teal-600 text-teal-600 ring-4 ring-teal-50'
                              : state === 'cancelled'
                              ? 'bg-red-50 border-red-500 text-red-600'
                              : 'bg-white border-slate-300 text-slate-400'
                          }
                        `}
                      >

                        {state === 'completed'
                          ? '✓'
                          : state === 'current'
                          ? index + 1
                          : state === 'cancelled'
                          ? '!'
                          : index + 1}

                      </div>

                      {/* CONNECTOR */}

                      {!isLast && (

                        <div
                          className={`
                            w-0.5
                            h-20
                            sm:h-16
                            ${
                              state === 'completed'
                                ? 'bg-teal-500'
                                : 'bg-slate-200'
                            }
                          `}
                        />

                      )}

                    </div>

                    {/* ==================================
                        CONTENT
                    ================================== */}

                    <div
                      className={`
                        pb-8
                        ${
                          isLast
                            ? 'pb-0'
                            : ''
                        }
                      `}
                    >

                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">

                        <h3
                          className={`
                            font-bold
                            ${
                              state === 'pending'
                                ? 'text-slate-400'
                                : state === 'cancelled'
                                ? 'text-red-600'
                                : 'text-slate-900'
                            }
                          `}
                        >
                          {step.title}
                        </h3>

                        {state === 'current' && (

                          <span className="w-fit px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold">
                            Current
                          </span>

                        )}

                      </div>

                      <p
                        className={`
                          text-sm
                          mt-1
                          ${
                            state === 'pending'
                              ? 'text-slate-400'
                              : 'text-slate-500'
                          }
                        `}
                      >
                        {step.description}
                      </p>

                      {state === 'completed' && (

                        <p className="text-xs text-teal-600 font-medium mt-2">
                          Completed
                        </p>

                      )}

                    </div>

                  </div>

                );
              }
            )}

          </div>

        </div>

        {/* ==========================================
            ORDER ITEMS
        ========================================== */}

        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 mt-6">

          <h2 className="text-xl font-bold text-slate-900 mb-5">
            Order Items
          </h2>

          <div className="space-y-4">

            {orderItems.map(
              (item, index) => (

                <div
                  key={
                    item._id ||
                    item.product ||
                    index
                  }
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 last:border-0 pb-4 last:pb-0"
                >

                  <div>

                    <p className="font-semibold text-slate-800">
                      {item.name ||
                        item.product?.name ||
                        'Product'}
                    </p>

                    <p className="text-sm text-slate-500 mt-1">
                      Quantity:{' '}
                      {item.quantity || 0}
                    </p>

                  </div>

                  <div className="font-semibold text-slate-800">
                    ₹
                    {Number(
                      item.price || 0
                    ).toLocaleString('en-IN')}
                  </div>

                </div>

              )
            )}

          </div>

          {/* TOTAL */}

          <div className="border-t border-slate-200 mt-5 pt-5 flex justify-between">

            <span className="font-semibold text-slate-700">
              Order Total
            </span>

            <span className="text-xl font-bold text-teal-700">
              ₹
              {Number(
                order.totalPrice || 0
              ).toLocaleString('en-IN')}
            </span>

          </div>

        </div>

        {/* ==========================================
            BACK BUTTON
        ========================================== */}

        <div className="mt-6">

          <button
            type="button"
            onClick={() =>
              navigate('/orders')
            }
            className="px-5 py-3 bg-white border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition"
          >
            ← Back to My Orders
          </button>

        </div>

      </main>

    </div>
  );
};

export default OrderTracking;