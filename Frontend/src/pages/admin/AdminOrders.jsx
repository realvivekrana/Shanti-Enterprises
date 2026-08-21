import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Link,
} from 'react-router-dom';


// ======================================================
// API URL
// ======================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000';


// ======================================================
// STATUS OPTIONS
// ======================================================

const STATUS_OPTIONS = [
  'Pending',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
];


// ======================================================
// ADMIN ORDERS
// ======================================================

const AdminOrders = () => {

  // ====================================================
  // STATE
  // ====================================================

  const [
    orders,
    setOrders,
  ] = useState([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState('');


  const [
    search,
    setSearch,
  ] = useState('');


  const [
    statusFilter,
    setStatusFilter,
  ] = useState('');


  const [
    paymentFilter,
    setPaymentFilter,
  ] = useState('');


  const [
    updatingOrder,
    setUpdatingOrder,
  ] = useState('');


  const [
    openOrder,
    setOpenOrder,
  ] = useState(null);


  // ====================================================
  // GET TOKEN
  // ====================================================

  const getToken = () => {

    const adminToken =
      localStorage.getItem(
        'adminToken'
      );


    if (adminToken) {
      return adminToken;
    }


    const token =
      localStorage.getItem(
        'token'
      );


    if (token) {
      return token;
    }


    const userInfo =
      localStorage.getItem(
        'userInfo'
      );


    if (!userInfo) {
      return '';
    }


    try {

      const parsedUser =
        JSON.parse(
          userInfo
        );


      return (
        parsedUser.token ||
        parsedUser.accessToken ||
        ''
      );

    } catch {

      return '';

    }

  };


  // ====================================================
  // API HEADERS
  // ====================================================

  const getHeaders = () => {

    const token =
      getToken();


    return {

      'Content-Type':
        'application/json',

      ...(token
        ? {
            Authorization:
              `Bearer ${token}`,
          }
        : {}),

    };

  };


  // ====================================================
  // EXTRACT API DATA
  // ====================================================

  const extractOrders = (
    responseData
  ) => {

    if (
      Array.isArray(
        responseData
      )
    ) {

      return responseData;

    }


    if (
      Array.isArray(
        responseData?.data
      )
    ) {

      return responseData.data;

    }


    if (
      Array.isArray(
        responseData?.orders
      )
    ) {

      return responseData.orders;

    }


    if (
      Array.isArray(
        responseData?.data?.orders
      )
    ) {

      return responseData.data.orders;

    }


    return [];

  };


  // ====================================================
  // FETCH ALL ORDERS
  // ====================================================

  const fetchOrders =
    async () => {

      try {

        setLoading(true);

        setError('');


        const response =
          await fetch(
            `${API_URL}/api/orders`,
            {
              method:
                'GET',

              headers:
                getHeaders(),
            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data?.message ||
              data?.error ||
              'Failed to load orders'
          );

        }


        const orderData =
          extractOrders(
            data
          );


        setOrders(
          orderData
        );

      } catch (err) {

        console.error(
          'Admin orders fetch error:',
          err
        );


        setError(
          err.message ||
            'Unable to load orders'
        );

      } finally {

        setLoading(false);

      }

    };


  // ====================================================
  // INITIAL LOAD
  // ====================================================

  useEffect(() => {

    fetchOrders();

  }, []);


  // ====================================================
  // GET CUSTOMER
  // ====================================================

  const getCustomer =
    (order) => {

      if (
        order?.user &&
        typeof order.user ===
          'object'
      ) {

        return order.user;

      }


      return {};

    };


  // ====================================================
  // GET CUSTOMER NAME
  // ====================================================

  const getCustomerName =
    (order) => {

      const customer =
        getCustomer(
          order
        );


      return (
        customer.name ||
        order.customerName ||
        order.shippingAddress?.name ||
        'Customer'
      );

    };


  // ====================================================
  // GET CUSTOMER EMAIL
  // ====================================================

  const getCustomerEmail =
    (order) => {

      const customer =
        getCustomer(
          order
        );


      return (
        customer.email ||
        order.email ||
        order.shippingAddress?.email ||
        '—'
      );

    };


  // ====================================================
  // GET BUSINESS NAME
  // ====================================================

  const getBusinessName =
    (order) => {

      const customer =
        getCustomer(
          order
        );


      return (
        customer.businessName ||
        order.businessName ||
        ''
      );

    };


  // ====================================================
  // GET ORDER STATUS
  // ====================================================

  const getOrderStatus =
    (order) => {

      return (
        order.orderStatus ||
        order.status ||
        'Pending'
      );

    };


  // ====================================================
  // GET PAYMENT STATUS
  // ====================================================

  const getPaymentStatus =
    (order) => {

      if (
        order.isPaid === true
      ) {

        return 'Paid';

      }


      return 'Unpaid';

    };


  // ====================================================
  // FORMAT PRICE
  // ====================================================

  const formatPrice =
    (value) => {

      return Number(
        value || 0
      ).toLocaleString(
        'en-IN',
        {
          minimumFractionDigits:
            2,

          maximumFractionDigits:
            2,
        }
      );

    };


  // ====================================================
  // FORMAT DATE
  // ====================================================

  const formatDate =
    (value) => {

      if (!value) {
        return '—';
      }


      const date =
        new Date(
          value
        );


      if (
        Number.isNaN(
          date.getTime()
        )
      ) {

        return '—';

      }


      return date.toLocaleDateString(
        'en-IN',
        {
          day:
            '2-digit',

          month:
            'short',

          year:
            'numeric',
        }
      );

    };


  // ====================================================
  // FORMAT DATE + TIME
  // ====================================================

  const formatDateTime =
    (value) => {

      if (!value) {
        return '—';
      }


      const date =
        new Date(
          value
        );


      if (
        Number.isNaN(
          date.getTime()
        )
      ) {

        return '—';

      }


      return date.toLocaleString(
        'en-IN',
        {
          day:
            '2-digit',

          month:
            'short',

          year:
            'numeric',

          hour:
            '2-digit',

          minute:
            '2-digit',
        }
      );

    };


  // ====================================================
  // SHORT ORDER ID
  // ====================================================

  const getShortOrderId =
    (order) => {

      const id =
        order?._id ||
        order?.id ||
        '';


      if (!id) {
        return '—';
      }


      return String(
        id
      ).slice(
        -8
      ).toUpperCase();

    };


  // ====================================================
  // ORDER ITEMS COUNT
  // ====================================================

  const getItemsCount =
    (order) => {

      if (
        !Array.isArray(
          order?.orderItems
        )
      ) {

        return 0;

      }


      return order.orderItems.reduce(
        (
          total,
          item
        ) =>
          total +
          Number(
            item.quantity || 0
          ),
        0
      );

    };


  // ====================================================
  // FILTER ORDERS
  // ====================================================

  const filteredOrders =
    useMemo(() => {

      let result =
        [...orders];


      // ----------------------------------------------
      // SEARCH
      // ----------------------------------------------

      if (
        search.trim()
      ) {

        const value =
          search
            .trim()
            .toLowerCase();


        result =
          result.filter(
            (order) => {

              const orderId =
                String(
                  order._id ||
                    order.id ||
                    ''
                ).toLowerCase();


              const customerName =
                getCustomerName(
                  order
                ).toLowerCase();


              const email =
                getCustomerEmail(
                  order
                ).toLowerCase();


              const business =
                getBusinessName(
                  order
                ).toLowerCase();


              return (

                orderId.includes(
                  value
                ) ||

                customerName.includes(
                  value
                ) ||

                email.includes(
                  value
                ) ||

                business.includes(
                  value
                )

              );

            }
          );

      }


      // ----------------------------------------------
      // STATUS
      // ----------------------------------------------

      if (
        statusFilter
      ) {

        result =
          result.filter(
            (order) =>
              getOrderStatus(
                order
              ).toLowerCase() ===
              statusFilter.toLowerCase()
          );

      }


      // ----------------------------------------------
      // PAYMENT
      // ----------------------------------------------

      if (
        paymentFilter
      ) {

        result =
          result.filter(
            (order) =>
              getPaymentStatus(
                order
              ).toLowerCase() ===
              paymentFilter.toLowerCase()
          );

      }


      return result;

    }, [
      orders,
      search,
      statusFilter,
      paymentFilter,
    ]);


  // ====================================================
  // ORDER STATS
  // ====================================================

  const totalOrders =
    orders.length;


  const pendingOrders =
    orders.filter(
      (order) =>
        getOrderStatus(
          order
        ).toLowerCase() ===
        'pending'
    ).length;


  const processingOrders =
    orders.filter(
      (order) =>
        getOrderStatus(
          order
        ).toLowerCase() ===
        'processing'
    ).length;


  const shippedOrders =
    orders.filter(
      (order) =>
        getOrderStatus(
          order
        ).toLowerCase() ===
        'shipped'
    ).length;


  const deliveredOrders =
    orders.filter(
      (order) =>
        getOrderStatus(
          order
        ).toLowerCase() ===
        'delivered'
    ).length;


  // ====================================================
  // TOTAL REVENUE
  // ====================================================

  const totalRevenue =
    orders.reduce(
      (
        total,
        order
      ) =>
        total +
        Number(
          order.totalPrice || 0
        ),
      0
    );


  // ====================================================
  // UPDATE ORDER STATUS
  // ====================================================

  const handleStatusChange =
    async (
      order,
      newStatus
    ) => {

      const orderId =
        order?._id ||
        order?.id;


      if (!orderId) {

        alert(
          'Order ID not found.'
        );

        return;

      }


      const currentStatus =
        getOrderStatus(
          order
        );


      if (
        currentStatus ===
        newStatus
      ) {

        return;

      }


      try {

        setUpdatingOrder(
          String(
            orderId
          )
        );


        setError('');


        const response =
          await fetch(
            `${API_URL}/api/orders/${orderId}/status`,
            {
              method:
                'PUT',

              headers:
                getHeaders(),

              body:
                JSON.stringify({
                  orderStatus:
                    newStatus,
                }),
            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data?.message ||
              data?.error ||
              'Failed to update order status'
          );

        }


        const updatedOrder =
          data?.data ||
          data?.order ||
          data?.data?.order ||
          null;


        setOrders(
          (
            previousOrders
          ) =>
            previousOrders.map(
              (item) => {

                const itemId =
                  item?._id ||
                  item?.id;


                if (
                  String(
                    itemId
                  ) !==
                  String(
                    orderId
                  )
                ) {

                  return item;

                }


                if (
                  updatedOrder
                ) {

                  return updatedOrder;

                }


                return {

                  ...item,

                  orderStatus:
                    newStatus,

                };

              }
            )
        );


      } catch (err) {

        console.error(
          'Update order status error:',
          err
        );


        setError(
          err.message ||
            'Failed to update order status'
        );

      } finally {

        setUpdatingOrder('');

      }

    };


  // ====================================================
  // OPEN ORDER
  // ====================================================

  const handleOpenOrder =
    (order) => {

      setOpenOrder(
        order
      );

    };


  // ====================================================
  // CLOSE ORDER
  // ====================================================

  const handleCloseOrder =
    () => {

      setOpenOrder(
        null
      );

    };


  // ====================================================
  // CLEAR FILTERS
  // ====================================================

  const handleClearFilters =
    () => {

      setSearch('');

      setStatusFilter('');

      setPaymentFilter('');

    };


  // ====================================================
  // STATUS STYLE
  // ====================================================

  const getStatusClass =
    (status) => {

      const normalized =
        String(
          status ||
            ''
        ).toLowerCase();


      if (
        normalized ===
        'delivered'
      ) {

        return 'bg-emerald-50 text-emerald-700 border-emerald-200';

      }


      if (
        normalized ===
        'shipped'
      ) {

        return 'bg-blue-50 text-blue-700 border-blue-200';

      }


      if (
        normalized ===
        'processing'
      ) {

        return 'bg-violet-50 text-violet-700 border-violet-200';

      }


      if (
        normalized ===
        'cancelled' ||
        normalized ===
        'canceled'
      ) {

        return 'bg-red-50 text-red-700 border-red-200';

      }


      return 'bg-amber-50 text-amber-700 border-amber-200';

    };


  // ====================================================
  // PAYMENT STYLE
  // ====================================================

  const getPaymentClass =
    (status) => {

      if (
        String(
          status
        ).toLowerCase() ===
        'paid'
      ) {

        return 'bg-emerald-50 text-emerald-700 border-emerald-200';

      }


      return 'bg-red-50 text-red-700 border-red-200';

    };


  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {

    return (

      <div
        className="
          min-h-screen
          bg-slate-50
          p-6
        "
      >

        <div
          className="
            mx-auto
            max-w-7xl
          "
        >

          <div
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-12
              text-center
            "
          >

            <div
              className="
                mx-auto
                h-10
                w-10
                animate-spin
                rounded-full
                border-4
                border-slate-200
                border-t-teal-600
              "
            />


            <p
              className="
                mt-4
                text-sm
                text-slate-500
              "
            >
              Loading orders...
            </p>

          </div>

        </div>

      </div>

    );

  }


  // ====================================================
  // RENDER
  // ====================================================

  return (

    <div
      className="
        min-h-screen
        bg-slate-50
      "
    >

      {/* ==================================================
          HEADER
      =================================================== */}

      <header
        className="
          border-b
          border-slate-200
          bg-white
        "
      >

        <div
          className="
            mx-auto
            max-w-7xl
            px-4
            py-6
            sm:px-6
          "
        >

          <div>

            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.15em]
                text-teal-600
              "
            >
              Admin Panel
            </p>


            <h1
              className="
                mt-1
                text-3xl
                font-extrabold
                text-slate-900
              "
            >
              Orders
            </h1>


            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              Manage customer orders, payments and fulfilment.
            </p>

          </div>

        </div>

      </header>


      {/* ==================================================
          MAIN
      =================================================== */}

      <main
        className="
          mx-auto
          max-w-7xl
          px-4
          py-6
          sm:px-6
        "
      >

        {/* ==================================================
            ERROR
        =================================================== */}

        {error && (

          <div
            className="
              mb-6
              rounded-xl
              border
              border-red-200
              bg-red-50
              px-4
              py-3
              text-sm
              text-red-700
            "
          >

            <div
              className="
                flex
                flex-col
                gap-3
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >

              <span>
                {error}
              </span>


              <button
                type="button"
                onClick={
                  fetchOrders
                }
                className="
                  rounded-lg
                  bg-red-600
                  px-4
                  py-2
                  text-xs
                  font-bold
                  text-white
                  hover:bg-red-700
                "
              >
                Retry
              </button>

            </div>

          </div>

        )}


        {/* ==================================================
            STATS
        =================================================== */}

        <div
          className="
            mb-6
            grid
            grid-cols-2
            gap-4
            md:grid-cols-3
            xl:grid-cols-6
          "
        >

          <StatCard
            label="Total Orders"
            value={
              totalOrders
            }
            valueClass="text-slate-900"
          />


          <StatCard
            label="Pending"
            value={
              pendingOrders
            }
            valueClass="text-amber-600"
          />


          <StatCard
            label="Processing"
            value={
              processingOrders
            }
            valueClass="text-violet-600"
          />


          <StatCard
            label="Shipped"
            value={
              shippedOrders
            }
            valueClass="text-blue-600"
          />


          <StatCard
            label="Delivered"
            value={
              deliveredOrders
            }
            valueClass="text-emerald-600"
          />


          <StatCard
            label="Revenue"
            value={
              `₹${formatPrice(
                totalRevenue
              )}`
            }
            valueClass="text-teal-600"
          />

        </div>


        {/* ==================================================
            FILTERS
        =================================================== */}

        <section
          className="
            mb-6
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-4
          "
        >

          <div
            className="
              grid
              grid-cols-1
              gap-3
              md:grid-cols-2
              lg:grid-cols-4
            "
          >

            {/* SEARCH */}

            <div
              className="
                lg:col-span-2
              "
            >

              <label
                className="
                  mb-1.5
                  block
                  text-xs
                  font-bold
                  text-slate-600
                "
              >
                Search Orders
              </label>


              <div
                className="
                  relative
                "
              >

                <span
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                >
                  🔍
                </span>


                <input
                  type="text"
                  value={
                    search
                  }
                  onChange={(
                    event
                  ) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search order ID, customer, email..."
                  className="
                    h-11
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    pl-10
                    pr-4
                    text-sm
                    outline-none
                    focus:border-teal-500
                    focus:ring-4
                    focus:ring-teal-50
                  "
                />

              </div>

            </div>


            {/* STATUS */}

            <div>

              <label
                className="
                  mb-1.5
                  block
                  text-xs
                  font-bold
                  text-slate-600
                "
              >
                Order Status
              </label>


              <select
                value={
                  statusFilter
                }
                onChange={(
                  event
                ) =>
                  setStatusFilter(
                    event.target.value
                  )
                }
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  px-3
                  text-sm
                  outline-none
                  focus:border-teal-500
                "
              >

                <option value="">
                  All Statuses
                </option>


                {STATUS_OPTIONS.map(
                  (status) => (

                    <option
                      key={
                        status
                      }
                      value={
                        status
                      }
                    >
                      {status}
                    </option>

                  )
                )}

              </select>

            </div>


            {/* PAYMENT */}

            <div>

              <label
                className="
                  mb-1.5
                  block
                  text-xs
                  font-bold
                  text-slate-600
                "
              >
                Payment
              </label>


              <select
                value={
                  paymentFilter
                }
                onChange={(
                  event
                ) =>
                  setPaymentFilter(
                    event.target.value
                  )
                }
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  px-3
                  text-sm
                  outline-none
                  focus:border-teal-500
                "
              >

                <option value="">
                  All Payments
                </option>


                <option value="Paid">
                  Paid
                </option>


                <option value="Unpaid">
                  Unpaid
                </option>

              </select>

            </div>

          </div>


          <div
            className="
              mt-4
              flex
              flex-col
              gap-3
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            <p
              className="
                text-sm
                text-slate-500
              "
            >

              Showing{' '}

              <span
                className="
                  font-bold
                  text-slate-800
                "
              >
                {
                  filteredOrders.length
                }
              </span>

              {' '}of{' '}

              <span
                className="
                  font-bold
                  text-slate-800
                "
              >
                {
                  orders.length
                }
              </span>

              {' '}orders

            </p>


            <button
              type="button"
              onClick={
                handleClearFilters
              }
              className="
                text-left
                text-sm
                font-semibold
                text-teal-600
                hover:text-teal-700
                sm:text-right
              "
            >
              Clear Filters
            </button>

          </div>

        </section>


        {/* ==================================================
            EMPTY
        =================================================== */}

        {filteredOrders.length ===
          0 && (

          <div
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-12
              text-center
            "
          >

            <div
              className="
                text-5xl
              "
            >
              🧾
            </div>


            <h2
              className="
                mt-4
                text-xl
                font-bold
                text-slate-900
              "
            >
              No orders found
            </h2>


            <p
              className="
                mt-2
                text-sm
                text-slate-500
              "
            >
              No orders match your current filters.
            </p>


            <button
              type="button"
              onClick={
                handleClearFilters
              }
              className="
                mt-5
                rounded-xl
                bg-teal-600
                px-5
                py-2.5
                text-sm
                font-bold
                text-white
                hover:bg-teal-700
              "
            >
              Clear Filters
            </button>

          </div>

        )}


        {/* ==================================================
            DESKTOP TABLE
        =================================================== */}

        {filteredOrders.length >
          0 && (

          <div
            className="
              hidden
              overflow-hidden
              rounded-2xl
              border
              border-slate-200
              bg-white
              lg:block
            "
          >

            <div
              className="
                overflow-x-auto
              "
            >

              <table
                className="
                  w-full
                "
              >

                <thead>

                  <tr
                    className="
                      border-b
                      border-slate-200
                      bg-slate-50
                    "
                  >

                    <TableHeader>
                      Order
                    </TableHeader>


                    <TableHeader>
                      Customer
                    </TableHeader>


                    <TableHeader>
                      Date
                    </TableHeader>


                    <TableHeader>
                      Amount
                    </TableHeader>


                    <TableHeader>
                      Payment
                    </TableHeader>


                    <TableHeader>
                      Status
                    </TableHeader>


                    <TableHeader
                      align="right"
                    >
                      Action
                    </TableHeader>

                  </tr>

                </thead>


                <tbody
                  className="
                    divide-y
                    divide-slate-100
                  "
                >

                  {filteredOrders.map(
                    (order) => {

                      const orderId =
                        order._id ||
                        order.id;


                      const status =
                        getOrderStatus(
                          order
                        );


                      const paymentStatus =
                        getPaymentStatus(
                          order
                        );


                      const isUpdating =
                        updatingOrder ===
                        String(
                          orderId
                        );


                      return (

                        <tr
                          key={
                            orderId
                          }
                          className="
                            transition
                            hover:bg-slate-50
                          "
                        >

                          {/* ORDER */}

                          <td
                            className="
                              px-5
                              py-4
                            "
                          >

                            <p
                              className="
                                font-bold
                                text-slate-900
                              "
                            >
                              #
                              {
                                getShortOrderId(
                                  order
                                )
                              }
                            </p>


                            <p
                              className="
                                mt-1
                                text-xs
                                text-slate-500
                              "
                            >
                              {
                                getItemsCount(
                                  order
                                )
                              }{' '}
                              item(s)
                            </p>

                          </td>


                          {/* CUSTOMER */}

                          <td
                            className="
                              px-5
                              py-4
                            "
                          >

                            <p
                              className="
                                max-w-[200px]
                                truncate
                                font-semibold
                                text-slate-800
                              "
                            >
                              {
                                getCustomerName(
                                  order
                                )
                              }
                            </p>


                            <p
                              className="
                                mt-1
                                max-w-[220px]
                                truncate
                                text-xs
                                text-slate-500
                              "
                            >
                              {
                                getCustomerEmail(
                                  order
                                )
                              }
                            </p>


                            {getBusinessName(
                              order
                            ) && (

                              <p
                                className="
                                  mt-1
                                  max-w-[220px]
                                  truncate
                                  text-xs
                                  font-semibold
                                  text-teal-600
                                "
                              >
                                {
                                  getBusinessName(
                                    order
                                  )
                                }
                              </p>

                            )}

                          </td>


                          {/* DATE */}

                          <td
                            className="
                              whitespace-nowrap
                              px-5
                              py-4
                              text-sm
                              text-slate-600
                            "
                          >
                            {
                              formatDate(
                                order.createdAt
                              )
                            }
                          </td>


                          {/* AMOUNT */}

                          <td
                            className="
                              whitespace-nowrap
                              px-5
                              py-4
                            "
                          >

                            <p
                              className="
                                font-bold
                                text-slate-900
                              "
                            >
                              ₹
                              {formatPrice(
                                order.totalPrice
                              )}
                            </p>


                            <p
                              className="
                                mt-1
                                text-xs
                                text-slate-400
                              "
                            >
                              {
                                order.paymentMethod ||
                                '—'
                              }
                            </p>

                          </td>


                          {/* PAYMENT */}

                          <td
                            className="
                              px-5
                              py-4
                            "
                          >

                            <span
                              className={`
                                inline-flex
                                rounded-full
                                border
                                px-2.5
                                py-1
                                text-xs
                                font-bold
                                ${getPaymentClass(
                                  paymentStatus
                                )}
                              `}
                            >
                              {
                                paymentStatus
                              }
                            </span>

                          </td>


                          {/* STATUS */}

                          <td
                            className="
                              px-5
                              py-4
                            "
                          >

                            <select
                              value={
                                status
                              }
                              disabled={
                                isUpdating
                              }
                              onChange={(
                                event
                              ) =>
                                handleStatusChange(
                                  order,
                                  event.target.value
                                )
                              }
                              className={`
                                rounded-lg
                                border
                                px-2.5
                                py-2
                                text-xs
                                font-bold
                                outline-none
                                disabled:cursor-wait
                                disabled:opacity-60
                                ${getStatusClass(
                                  status
                                )}
                              `}
                            >

                              {STATUS_OPTIONS.map(
                                (
                                  statusOption
                                ) => (

                                  <option
                                    key={
                                      statusOption
                                    }
                                    value={
                                      statusOption
                                    }
                                  >
                                    {
                                      statusOption
                                    }
                                  </option>

                                )
                              )}

                            </select>

                          </td>


                          {/* ACTION */}

                          <td
                            className="
                              px-5
                              py-4
                            "
                          >

                            <div
                              className="
                                flex
                                justify-end
                              "
                            >

                              <button
                                type="button"
                                onClick={() =>
                                  handleOpenOrder(
                                    order
                                  )
                                }
                                className="
                                  rounded-lg
                                  border
                                  border-slate-200
                                  bg-white
                                  px-3
                                  py-2
                                  text-xs
                                  font-bold
                                  text-slate-700
                                  hover:border-teal-300
                                  hover:text-teal-700
                                "
                              >
                                View Details
                              </button>

                            </div>

                          </td>

                        </tr>

                      );

                    }
                  )}

                </tbody>

              </table>

            </div>

          </div>

        )}


        {/* ==================================================
            MOBILE ORDERS
        =================================================== */}

        {filteredOrders.length >
          0 && (

          <div
            className="
              space-y-4
              lg:hidden
            "
          >

            {filteredOrders.map(
              (order) => {

                const orderId =
                  order._id ||
                  order.id;


                const status =
                  getOrderStatus(
                    order
                  );


                const paymentStatus =
                  getPaymentStatus(
                    order
                  );


                const isUpdating =
                  updatingOrder ===
                  String(
                    orderId
                  );


                return (

                  <div
                    key={
                      orderId
                    }
                    className="
                      rounded-2xl
                      border
                      border-slate-200
                      bg-white
                      p-4
                    "
                  >

                    {/* HEADER */}

                    <div
                      className="
                        flex
                        items-start
                        justify-between
                        gap-3
                      "
                    >

                      <div>

                        <p
                          className="
                            font-bold
                            text-slate-900
                          "
                        >
                          #
                          {
                            getShortOrderId(
                              order
                            )
                          }
                        </p>


                        <p
                          className="
                            mt-1
                            text-xs
                            text-slate-500
                          "
                        >
                          {
                            formatDate(
                              order.createdAt
                            )
                          }
                        </p>

                      </div>


                      <span
                        className={`
                          rounded-full
                          border
                          px-2.5
                          py-1
                          text-xs
                          font-bold
                          ${getPaymentClass(
                            paymentStatus
                          )}
                        `}
                      >
                        {
                          paymentStatus
                        }
                      </span>

                    </div>


                    {/* CUSTOMER */}

                    <div
                      className="
                        mt-4
                        rounded-xl
                        bg-slate-50
                        p-3
                      "
                    >

                      <p
                        className="
                          font-bold
                          text-slate-900
                        "
                      >
                        {
                          getCustomerName(
                            order
                          )
                        }
                      </p>


                      <p
                        className="
                          mt-1
                          text-xs
                          text-slate-500
                        "
                      >
                        {
                          getCustomerEmail(
                            order
                          )
                        }
                      </p>


                      {getBusinessName(
                        order
                      ) && (

                        <p
                          className="
                            mt-1
                            text-xs
                            font-semibold
                            text-teal-600
                          "
                        >
                          {
                            getBusinessName(
                              order
                            )
                          }
                        </p>

                      )}

                    </div>


                    {/* DETAILS */}

                    <div
                      className="
                        mt-4
                        grid
                        grid-cols-3
                        gap-3
                      "
                    >

                      <MiniInfo
                        label="Items"
                        value={
                          getItemsCount(
                            order
                          )
                        }
                      />


                      <MiniInfo
                        label="Amount"
                        value={
                          `₹${formatPrice(
                            order.totalPrice
                          )}`
                        }
                      />


                      <MiniInfo
                        label="Payment"
                        value={
                          order.paymentMethod ||
                          '—'
                        }
                      />

                    </div>


                    {/* STATUS */}

                    <div
                      className="
                        mt-4
                      "
                    >

                      <label
                        className="
                          mb-1.5
                          block
                          text-xs
                          font-bold
                          text-slate-500
                        "
                      >
                        Order Status
                      </label>


                      <select
                        value={
                          status
                        }
                        disabled={
                          isUpdating
                        }
                        onChange={(
                          event
                        ) =>
                          handleStatusChange(
                            order,
                            event.target.value
                          )
                        }
                        className={`
                          h-11
                          w-full
                          rounded-xl
                          border
                          px-3
                          text-sm
                          font-bold
                          outline-none
                          ${getStatusClass(
                            status
                          )}
                        `}
                      >

                        {STATUS_OPTIONS.map(
                          (
                            statusOption
                          ) => (

                            <option
                              key={
                                statusOption
                              }
                              value={
                                statusOption
                              }
                            >
                              {
                                statusOption
                              }
                            </option>

                          )
                        )}

                      </select>

                    </div>


                    {/* VIEW */}

                    <button
                      type="button"
                      onClick={() =>
                        handleOpenOrder(
                          order
                        )
                      }
                      className="
                        mt-4
                        w-full
                        rounded-xl
                        bg-teal-600
                        px-4
                        py-3
                        text-sm
                        font-bold
                        text-white
                        hover:bg-teal-700
                      "
                    >
                      View Order Details
                    </button>

                  </div>

                );

              }
            )}

          </div>

        )}

      </main>


      {/* ==================================================
          ORDER DETAILS MODAL
      =================================================== */}

      {openOrder && (

        <OrderDetailsModal
          order={
            openOrder
          }
          onClose={
            handleCloseOrder
          }
          formatPrice={
            formatPrice
          }
          formatDateTime={
            formatDateTime
          }
          getCustomerName={
            getCustomerName
          }
          getCustomerEmail={
            getCustomerEmail
          }
          getBusinessName={
            getBusinessName
          }
          getPaymentStatus={
            getPaymentStatus
          }
          getPaymentClass={
            getPaymentClass
          }
          getStatusClass={
            getStatusClass
          }
          getOrderStatus={
            getOrderStatus
          }
        />

      )}

    </div>

  );

};


// ======================================================
// STAT CARD
// ======================================================

const StatCard = ({
  label,
  value,
  valueClass,
}) => {

  return (

    <div
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-5
      "
    >

      <p
        className="
          text-xs
          font-semibold
          uppercase
          tracking-wide
          text-slate-500
        "
      >
        {label}
      </p>


      <p
        className={`
          mt-2
          text-2xl
          font-extrabold
          ${valueClass}
        `}
      >
        {value}
      </p>

    </div>

  );

};


// ======================================================
// TABLE HEADER
// ======================================================

const TableHeader = ({
  children,
  align = 'left',
}) => {

  return (

    <th
      className={`
        px-5
        py-4
        text-xs
        font-bold
        uppercase
        tracking-wide
        text-slate-500
        ${
          align === 'right'
            ? 'text-right'
            : 'text-left'
        }
      `}
    >
      {children}
    </th>

  );

};


// ======================================================
// MINI INFO
// ======================================================

const MiniInfo = ({
  label,
  value,
}) => {

  return (

    <div
      className="
        rounded-xl
        bg-slate-50
        p-3
      "
    >

      <p
        className="
          text-[10px]
          font-semibold
          uppercase
          tracking-wide
          text-slate-400
        "
      >
        {label}
      </p>


      <p
        className="
          mt-1
          truncate
          text-sm
          font-bold
          text-slate-900
        "
      >
        {value}
      </p>

    </div>

  );

};


// ======================================================
// ORDER DETAILS MODAL
// ======================================================

const OrderDetailsModal = ({
  order,
  onClose,
  formatPrice,
  formatDateTime,
  getCustomerName,
  getCustomerEmail,
  getBusinessName,
  getPaymentStatus,
  getPaymentClass,
  getStatusClass,
  getOrderStatus,
}) => {

  const shippingAddress =
    order.shippingAddress ||
    {};


  const orderItems =
    Array.isArray(
      order.orderItems
    )
      ? order.orderItems
      : [];


  const paymentStatus =
    getPaymentStatus(
      order
    );


  const orderStatus =
    getOrderStatus(
      order
    );


  return (

    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-slate-950/50
        p-4
      "
      onMouseDown={(
        event
      ) => {

        if (
          event.target ===
          event.currentTarget
        ) {

          onClose();

        }

      }}
    >

      <div
        className="
          max-h-[90vh]
          w-full
          max-w-4xl
          overflow-hidden
          rounded-2xl
          bg-white
          shadow-2xl
        "
      >

        {/* HEADER */}

        <div
          className="
            flex
            items-start
            justify-between
            gap-4
            border-b
            border-slate-200
            px-5
            py-4
          "
        >

          <div>

            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-wide
                text-teal-600
              "
            >
              Order Details
            </p>


            <h2
              className="
                mt-1
                text-xl
                font-extrabold
                text-slate-900
              "
            >
              #
              {
                String(
                  order._id ||
                    order.id ||
                    ''
                ).slice(
                  -8
                ).toUpperCase()
              }
            </h2>


            <p
              className="
                mt-1
                text-xs
                text-slate-500
              "
            >
              {
                formatDateTime(
                  order.createdAt
                )
              }
            </p>

          </div>


          <button
            type="button"
            onClick={
              onClose
            }
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              bg-slate-100
              text-slate-600
              hover:bg-slate-200
            "
          >
            ✕
          </button>

        </div>


        {/* CONTENT */}

        <div
          className="
            max-h-[calc(90vh-80px)]
            overflow-y-auto
            p-5
          "
        >

          {/* STATUS */}

          <div
            className="
              grid
              grid-cols-1
              gap-4
              md:grid-cols-3
            "
          >

            <div
              className="
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                p-4
              "
            >

              <p
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-wide
                  text-slate-400
                "
              >
                Order Status
              </p>


              <span
                className={`
                  mt-2
                  inline-flex
                  rounded-full
                  border
                  px-3
                  py-1.5
                  text-xs
                  font-bold
                  ${getStatusClass(
                    orderStatus
                  )}
                `}
              >
                {
                  orderStatus
                }
              </span>

            </div>


            <div
              className="
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                p-4
              "
            >

              <p
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-wide
                  text-slate-400
                "
              >
                Payment
              </p>


              <span
                className={`
                  mt-2
                  inline-flex
                  rounded-full
                  border
                  px-3
                  py-1.5
                  text-xs
                  font-bold
                  ${getPaymentClass(
                    paymentStatus
                  )}
                `}
              >
                {
                  paymentStatus
                }
              </span>

            </div>


            <div
              className="
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                p-4
              "
            >

              <p
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-wide
                  text-slate-400
                "
              >
                Total
              </p>


              <p
                className="
                  mt-2
                  text-xl
                  font-extrabold
                  text-slate-900
                "
              >
                ₹
                {formatPrice(
                  order.totalPrice
                )}
              </p>

            </div>

          </div>


          {/* CUSTOMER + SHIPPING */}

          <div
            className="
              mt-5
              grid
              grid-cols-1
              gap-4
              md:grid-cols-2
            "
          >

            {/* CUSTOMER */}

            <div
              className="
                rounded-xl
                border
                border-slate-200
                p-4
              "
            >

              <h3
                className="
                  font-bold
                  text-slate-900
                "
              >
                Customer
              </h3>


              <div
                className="
                  mt-3
                  space-y-2
                  text-sm
                "
              >

                <p>
                  <span
                    className="
                      font-semibold
                      text-slate-500
                    "
                  >
                    Name:
                  </span>{' '}

                  {
                    getCustomerName(
                      order
                    )
                  }
                </p>


                <p
                  className="
                    break-all
                  "
                >
                  <span
                    className="
                      font-semibold
                      text-slate-500
                    "
                  >
                    Email:
                  </span>{' '}

                  {
                    getCustomerEmail(
                      order
                    )
                  }
                </p>


                {getBusinessName(
                  order
                ) && (

                  <p>

                    <span
                      className="
                        font-semibold
                        text-slate-500
                      "
                    >
                      Business:
                    </span>{' '}

                    {
                      getBusinessName(
                        order
                      )
                    }

                  </p>

                )}

              </div>

            </div>


            {/* SHIPPING */}

            <div
              className="
                rounded-xl
                border
                border-slate-200
                p-4
              "
            >

              <h3
                className="
                  font-bold
                  text-slate-900
                "
              >
                Shipping Address
              </h3>


              <div
                className="
                  mt-3
                  space-y-1
                  text-sm
                  text-slate-600
                "
              >

                {shippingAddress.name && (

                  <p>
                    {
                      shippingAddress.name
                    }
                  </p>

                )}


                {shippingAddress.address && (

                  <p>
                    {
                      shippingAddress.address
                    }
                  </p>

                )}


                {shippingAddress.city && (

                  <p>
                    {
                      shippingAddress.city
                    }
                    {shippingAddress.state
                      ? `, ${shippingAddress.state}`
                      : ''}
                  </p>

                )}


                {shippingAddress.pincode && (

                  <p>
                    PIN:{' '}
                    {
                      shippingAddress.pincode
                    }
                  </p>

                )}


                {shippingAddress.phone && (

                  <p>
                    Phone:{' '}
                    {
                      shippingAddress.phone
                    }
                  </p>

                )}

              </div>

            </div>

          </div>


          {/* ITEMS */}

          <div
            className="
              mt-5
              rounded-xl
              border
              border-slate-200
            "
          >

            <div
              className="
                border-b
                border-slate-200
                px-4
                py-3
              "
            >

              <h3
                className="
                  font-bold
                  text-slate-900
                "
              >
                Order Items
              </h3>

            </div>


            <div
              className="
                divide-y
                divide-slate-100
              "
            >

              {orderItems.length ===
                0 && (

                <p
                  className="
                    p-5
                    text-sm
                    text-slate-500
                  "
                >
                  No order items available.
                </p>

              )}


              {orderItems.map(
                (
                  item,
                  index
                ) => {

                  const quantity =
                    Number(
                      item.quantity ||
                        0
                    );


                  const price =
                    Number(
                      item.price ||
                        0
                    );


                  const itemTotal =
                    quantity *
                    price;


                  return (

                    <div
                      key={
                        item._id ||
                        item.product ||
                        index
                      }
                      className="
                        flex
                        flex-col
                        gap-3
                        px-4
                        py-4
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                      "
                    >

                      <div
                        className="
                          min-w-0
                        "
                      >

                        <p
                          className="
                            font-semibold
                            text-slate-900
                          "
                        >
                          {
                            item.name ||
                            'Product'
                          }
                        </p>


                        <p
                          className="
                            mt-1
                            text-xs
                            text-slate-500
                          "
                        >
                          Qty:{' '}
                          {
                            quantity
                          }
                          {' × '}
                          ₹
                          {formatPrice(
                            price
                          )}
                        </p>

                      </div>


                      <p
                        className="
                          font-bold
                          text-slate-900
                        "
                      >
                        ₹
                        {formatPrice(
                          itemTotal
                        )}
                      </p>

                    </div>

                  );

                }
              )}

            </div>

          </div>


          {/* SUMMARY */}

          <div
            className="
              mt-5
              flex
              justify-end
            "
          >

            <div
              className="
                w-full
                max-w-sm
                rounded-xl
                bg-slate-50
                p-4
              "
            >

              <SummaryRow
                label="Items Price"
                value={
                  `₹${formatPrice(
                    order.itemsPrice
                  )}`
                }
              />


              <SummaryRow
                label="Shipping"
                value={
                  `₹${formatPrice(
                    order.shippingPrice
                  )}`
                }
              />


              <div
                className="
                  my-3
                  border-t
                  border-slate-200
                "
              />


              <SummaryRow
                label="Total"
                value={
                  `₹${formatPrice(
                    order.totalPrice
                  )}`
                }
                bold
              />

            </div>

          </div>

        </div>

      </div>

    </div>

  );

};


// ======================================================
// SUMMARY ROW
// ======================================================

const SummaryRow = ({
  label,
  value,
  bold = false,
}) => {

  return (

    <div
      className="
        flex
        items-center
        justify-between
        gap-4
        py-1.5
      "
    >

      <span
        className={
          bold
            ? 'font-bold text-slate-900'
            : 'text-sm text-slate-500'
        }
      >
        {label}
      </span>


      <span
        className={
          bold
            ? 'text-lg font-extrabold text-slate-900'
            : 'text-sm font-semibold text-slate-700'
        }
      >
        {value}
      </span>

    </div>

  );

};


export default AdminOrders;