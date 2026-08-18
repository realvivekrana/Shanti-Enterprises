import {
  useEffect,
  useState,
} from 'react';

import {
  Link,
  useNavigate,
} from 'react-router-dom';

import API from '../api/axios';

import {
  useCart,
} from '../context/CartContext';


// ======================================================
// ORDERS PAGE
// ======================================================

const Orders = () => {

  const navigate = useNavigate();

  const {
    addReorderItems,
  } = useCart();


  // ====================================================
  // STATE
  // ====================================================

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [reorderingId, setReorderingId] =
    useState(null);

  const [error, setError] =
    useState('');

  const [reorderMessage, setReorderMessage] =
    useState('');

  const [reorderError, setReorderError] =
    useState('');


  // ====================================================
  // FETCH ORDERS
  // ====================================================

  const fetchOrders = async () => {

    try {

      setLoading(true);

      setError('');

      const response =
        await API.get(
          '/orders/myorders'
        );

      setOrders(
        response.data || []
      );

    } catch (error) {

      console.error(
        'Orders fetch error:',
        error
      );

      setError(
        error.response?.data?.message ||
        'Failed to load orders.'
      );

    } finally {

      setLoading(false);

    }
  };


  // ====================================================
  // LOAD ORDERS
  // ====================================================

  useEffect(() => {

    fetchOrders();

  }, []);


  // ====================================================
  // REORDER
  // ====================================================

  const handleReorder = async (
    orderId
  ) => {

    try {

      setReorderingId(orderId);

      setReorderMessage('');

      setReorderError('');


      // ----------------------------------------------
      // CALL BACKEND
      // ----------------------------------------------

      const response =
        await API.post(
          `/orders/${orderId}/reorder`
        );


      const data =
        response.data || {};


      const reorderItems =
        data.reorderItems || [];


      const unavailableItems =
        data.unavailableItems || [];


      // ----------------------------------------------
      // CHECK ITEMS
      // ----------------------------------------------

      if (
        reorderItems.length === 0
      ) {

        setReorderError(
          'None of the products from this order are currently available for reorder.'
        );

        return;
      }


      // ----------------------------------------------
      // ADD TO CART
      // ----------------------------------------------

      const result =
        addReorderItems(
          reorderItems
        );


      // ----------------------------------------------
      // CART RESULT
      // ----------------------------------------------

      if (
        !result?.success
      ) {

        setReorderError(
          'Products could not be added to cart.'
        );

        return;
      }


      // ----------------------------------------------
      // SUCCESS MESSAGE
      // ----------------------------------------------

      if (
        unavailableItems.length > 0
      ) {

        setReorderMessage(
          `${reorderItems.length} product(s) added to cart. ${unavailableItems.length} product(s) could not be reordered because of stock/MOQ/availability.`
        );

      } else {

        setReorderMessage(
          `${reorderItems.length} product(s) added to cart successfully.`
        );

      }


      // ----------------------------------------------
      // GO TO CART
      // ----------------------------------------------

      setTimeout(() => {

        navigate('/cart');

      }, 800);


    } catch (error) {

      console.error(
        'Reorder error:',
        error
      );


      setReorderError(
        error.response?.data?.message ||
        'Failed to reorder this order.'
      );

    } finally {

      setReorderingId(null);

    }
  };


  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {

    return (

      <div className="min-h-[60vh] flex items-center justify-center px-4">

        <div className="text-center">

          <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-slate-500">
            Loading your orders...
          </p>

        </div>

      </div>
    );
  }


  // ====================================================
  // ERROR
  // ====================================================

  if (
    error &&
    orders.length === 0
  ) {

    return (

      <div className="min-h-[60vh] flex items-center justify-center px-4">

        <div className="text-center">

          <div className="text-5xl mb-4">
            ⚠️
          </div>

          <h1 className="text-2xl font-bold text-slate-800">
            Unable to load orders
          </h1>

          <p className="text-red-500 mt-2">
            {error}
          </p>

          <button
            onClick={fetchOrders}
            className="mt-6 bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-700 transition"
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }


  // ====================================================
  // EMPTY ORDERS
  // ====================================================

  if (
    orders.length === 0
  ) {

    return (

      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">

        <div className="text-6xl mb-4">
          📦
        </div>

        <h1 className="text-2xl font-bold text-slate-800">
          My Orders
        </h1>

        <p className="text-slate-500 mt-2 text-center">
          You haven't placed any orders yet.
        </p>

        <Link
          to="/"
          className="mt-6 bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-700 transition"
        >
          Browse Products
        </Link>

      </div>
    );
  }


  // ====================================================
  // ORDERS
  // ====================================================

  return (

    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* ================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

        <div>

          <h1 className="text-3xl font-bold text-slate-800">
            My Orders
          </h1>

          <p className="text-slate-500 mt-1">
            View your previous orders and reorder products.
          </p>

        </div>

        <Link
          to="/"
          className="text-teal-600 font-medium hover:text-teal-700"
        >
          Continue Shopping
        </Link>

      </div>


      {/* ================================================
          REORDER SUCCESS
      ================================================= */}

      {reorderMessage && (

        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {reorderMessage}
        </div>

      )}


      {/* ================================================
          REORDER ERROR
      ================================================= */}

      {reorderError && (

        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {reorderError}
        </div>

      )}


      {/* ================================================
          ORDER LIST
      ================================================= */}

      <div className="space-y-6">

        {orders.map(
          (order) => (

            <div
              key={order._id}
              className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden"
            >

              {/* ==========================================
                  ORDER HEADER
              =========================================== */}

              <div className="p-5 border-b border-slate-200">

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                  <div>

                    <p className="text-sm text-slate-500">
                      Order ID
                    </p>

                    <p className="font-semibold text-slate-800 break-all">
                      #{order._id}
                    </p>

                  </div>


                  <div>

                    <p className="text-sm text-slate-500">
                      Order Date
                    </p>

                    <p className="font-medium text-slate-800">

                      {order.createdAt
                        ? new Date(
                            order.createdAt
                          ).toLocaleDateString(
                            'en-IN',
                            {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            }
                          )
                        : 'N/A'}

                    </p>

                  </div>


                  <div>

                    <p className="text-sm text-slate-500">
                      Status
                    </p>

                    <span className="inline-flex mt-1 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-sm font-medium">

                      {order.orderStatus ||
                        'Placed'}

                    </span>

                  </div>


                  <div>

                    <p className="text-sm text-slate-500">
                      Total
                    </p>

                    <p className="font-bold text-slate-800">

                      ₹
                      {Number(
                        order.totalPrice || 0
                      ).toLocaleString(
                        'en-IN'
                      )}

                    </p>

                  </div>

                </div>

              </div>


              {/* ==========================================
                  ORDER ITEMS
              =========================================== */}

              <div className="p-5">

                <h2 className="font-semibold text-slate-800 mb-4">
                  Products
                </h2>


                <div className="space-y-4">

                  {(
                    order.orderItems ||
                    []
                  ).map(
                    (
                      item,
                      index
                    ) => (

                      <div
                        key={
                          item.product ||
                          index
                        }
                        className="flex items-center justify-between gap-4 py-3 border-b border-slate-100 last:border-b-0"
                      >

                        <div className="flex items-center gap-3 min-w-0">

                          <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                            📦
                          </div>

                          <div className="min-w-0">

                            <p className="font-medium text-slate-800 truncate">
                              {item.name ||
                                'Product'}
                            </p>

                            <p className="text-sm text-slate-500">
                              Quantity: {
                                item.quantity
                              }
                            </p>

                          </div>

                        </div>


                        <div className="text-right flex-shrink-0">

                          <p className="font-medium text-slate-800">

                            ₹
                            {Number(
                              item.price || 0
                            ).toLocaleString(
                              'en-IN'
                            )}

                          </p>

                          <p className="text-xs text-slate-500">
                            per piece
                          </p>

                        </div>

                      </div>

                    )
                  )}

                </div>


                {/* ========================================
                    ACTIONS
                ========================================= */}

                <div className="mt-6 flex flex-col sm:flex-row gap-3">

                  <Link
                    to={`/order-success/${order._id}`}
                    className="flex-1 text-center border border-slate-300 text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-50 transition"
                  >
                    View Order
                  </Link>


                  <button
                    onClick={() =>
                      handleReorder(
                        order._id
                      )
                    }
                    disabled={
                      reorderingId ===
                      order._id
                    }
                    className="flex-1 bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >

                    {reorderingId ===
                    order._id
                      ? 'Preparing Reorder...'
                      : '🔁 Reorder All'}

                  </button>

                </div>

              </div>

            </div>

          )
        )}

      </div>

    </div>
  );
};


export default Orders;