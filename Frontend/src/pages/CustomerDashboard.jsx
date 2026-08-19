import {
  useEffect,
  useState,
} from 'react';

import {
  Link,
  useNavigate,
} from 'react-router-dom';

import API from '../api/axios';

const CustomerDashboard = () => {
  const navigate = useNavigate();

  // =====================================================
  // USER
  // =====================================================

  const [user, setUser] =
    useState(null);

  // =====================================================
  // DASHBOARD DATA
  // =====================================================

  const [orders, setOrders] =
    useState([]);

  const [rfqs, setRfqs] =
    useState([]);

  const [quotations, setQuotations] =
    useState([]);

  const [notifications, setNotifications] =
    useState([]);

  // =====================================================
  // LOADING
  // =====================================================

  const [loading, setLoading] =
    useState(true);

  // =====================================================
  // ERROR
  // =====================================================

  const [error, setError] =
    useState('');

  // =====================================================
  // GET CURRENT USER
  // =====================================================

  useEffect(() => {
    const userInfo =
      localStorage.getItem(
        'userInfo'
      );

    // ===============================================
    // USER NOT LOGGED IN
    // ===============================================

    if (!userInfo) {
      navigate('/login', {
        replace: true,
      });

      return;
    }

    // ===============================================
    // PARSE USER
    // ===============================================

    try {
      const parsedUser =
        JSON.parse(userInfo);

      /*
       * Standard format:
       *
       * {
       *   _id,
       *   name,
       *   email,
       *   role,
       *   token
       * }
       *
       * Old format support:
       *
       * {
       *   user: {...},
       *   token: "..."
       * }
       */

      const currentUser =
        parsedUser?.user ||
        parsedUser;

      // =============================================
      // USER VALIDATION
      // =============================================

      if (!currentUser) {
        throw new Error(
          'Invalid user information'
        );
      }

      // =============================================
      // ADMIN SHOULD NOT ACCESS CUSTOMER DASHBOARD
      // =============================================

      if (
        currentUser.role === 'admin'
      ) {
        navigate(
          '/admin/dashboard',
          {
            replace: true,
          }
        );

        return;
      }

      // =============================================
      // CUSTOMER
      // =============================================

      setUser(currentUser);

    } catch (err) {
      console.error(
        'User information error:',
        err
      );

      localStorage.removeItem(
        'userInfo'
      );

      localStorage.removeItem(
        'token'
      );

      localStorage.removeItem(
        'adminToken'
      );

      navigate('/login', {
        replace: true,
      });
    }
  }, [navigate]);

  // =====================================================
  // FETCH DASHBOARD DATA
  // =====================================================

  useEffect(() => {
    if (!user) {
      return;
    }

    const fetchDashboardData =
      async () => {
        try {
          setLoading(true);
          setError('');

          // ===========================================
          // API REQUESTS
          // ===========================================

          const [
            ordersResponse,
            rfqsResponse,
            quotationsResponse,
            notificationsResponse,
          ] = await Promise.allSettled([
            API.get(
              '/orders/myorders'
            ),

            API.get(
              '/rfqs/my'
            ),

            API.get(
              '/quotations/my'
            ),

            API.get(
              '/notifications'
            ),
          ]);

          // ===========================================
          // ORDERS
          // ===========================================

          if (
            ordersResponse.status ===
            'fulfilled'
          ) {
            const data =
              ordersResponse.value?.data;

            const orderData =
              Array.isArray(data)
                ? data
                : Array.isArray(
                    data?.data
                  )
                ? data.data
                : Array.isArray(
                    data?.orders
                  )
                ? data.orders
                : Array.isArray(
                    data?.data?.orders
                  )
                ? data.data.orders
                : [];

            setOrders(
              orderData
            );
          } else {
            console.error(
              'Orders API error:',
              ordersResponse.reason
            );

            setOrders([]);
          }

          // ===========================================
          // RFQS
          // ===========================================

          if (
            rfqsResponse.status ===
            'fulfilled'
          ) {
            const data =
              rfqsResponse.value?.data;

            const rfqData =
              Array.isArray(data)
                ? data
                : Array.isArray(
                    data?.data
                  )
                ? data.data
                : Array.isArray(
                    data?.rfqs
                  )
                ? data.rfqs
                : Array.isArray(
                    data?.data?.rfqs
                  )
                ? data.data.rfqs
                : [];

            setRfqs(
              rfqData
            );
          } else {
            console.error(
              'RFQ API error:',
              rfqsResponse.reason
            );

            setRfqs([]);
          }

          // ===========================================
          // QUOTATIONS
          // ===========================================

          if (
            quotationsResponse.status ===
            'fulfilled'
          ) {
            const data =
              quotationsResponse.value?.data;

            const quotationData =
              Array.isArray(data)
                ? data
                : Array.isArray(
                    data?.data
                  )
                ? data.data
                : Array.isArray(
                    data?.quotations
                  )
                ? data.quotations
                : Array.isArray(
                    data?.data?.quotations
                  )
                ? data.data.quotations
                : [];

            setQuotations(
              quotationData
            );
          } else {
            console.error(
              'Quotation API error:',
              quotationsResponse.reason
            );

            setQuotations([]);
          }

          // ===========================================
          // NOTIFICATIONS
          // ===========================================

          if (
            notificationsResponse.status ===
            'fulfilled'
          ) {
            const data =
              notificationsResponse.value?.data;

            const notificationData =
              Array.isArray(data)
                ? data
                : Array.isArray(
                    data?.data
                  )
                ? data.data
                : Array.isArray(
                    data?.notifications
                  )
                ? data.notifications
                : Array.isArray(
                    data?.data?.notifications
                  )
                ? data.data.notifications
                : [];

            setNotifications(
              notificationData
            );
          } else {
            console.error(
              'Notification API error:',
              notificationsResponse.reason
            );

            setNotifications([]);
          }

        } catch (err) {

          console.error(
            'Dashboard error:',
            err
          );

          setError(
            err.response?.data?.message ||
            err.message ||
            'Unable to load dashboard data.'
          );

        } finally {
          setLoading(false);
        }
      };

    fetchDashboardData();

  }, [user]);

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem(
      'userInfo'
    );

    localStorage.removeItem(
      'token'
    );

    localStorage.removeItem(
      'adminToken'
    );

    navigate('/login', {
      replace: true,
    });
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return '-';
    }

    try {
      return new Date(
        date
      ).toLocaleDateString(
        'en-IN',
        {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }
      );
    } catch {
      return '-';
    }
  };

  // =====================================================
  // FORMAT CURRENCY
  // =====================================================

  const formatCurrency = (amount) => {
    const value =
      Number(amount);

    if (
      !Number.isFinite(value)
    ) {
      return '₹0';
    }

    return value.toLocaleString(
      'en-IN',
      {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2,
      }
    );
  };

  // =====================================================
  // ORDER STATUS
  // =====================================================

  const getOrderStatus = (order) => {
    return (
      order?.status ||
      order?.orderStatus ||
      'Pending'
    );
  };

  // =====================================================
  // RFQ STATUS
  // =====================================================

  const getRfqStatus = (rfq) => {
    return (
      rfq?.status ||
      'Pending'
    );
  };

  // =====================================================
  // QUOTATION STATUS
  // =====================================================

  const getQuotationStatus = (
    quotation
  ) => {
    return (
      quotation?.status ||
      'Pending'
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">

        <div className="text-center">

          <div className="w-10 h-10 border-4 border-slate-200 border-t-teal-600 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-sm text-slate-500">
            Loading dashboard...
          </p>

        </div>

      </div>
    );
  }

  // =====================================================
  // USER NOT AVAILABLE
  // =====================================================

  if (!user) {
    return null;
  }

  // =====================================================
  // COUNTS
  // =====================================================

  const totalOrders =
    orders.length;

  const totalRfqs =
    rfqs.length;

  const totalQuotations =
    quotations.length;

  const unreadNotifications =
    notifications.filter(
      (notification) =>
        !notification?.read &&
        !notification?.isRead
    ).length;

  // =====================================================
  // RECENT ORDERS
  // =====================================================

  const recentOrders =
    orders.slice(0, 5);

  // =====================================================
  // RECENT RFQS
  // =====================================================

  const recentRfqs =
    rfqs.slice(0, 5);

  // =====================================================
  // RECENT QUOTATIONS
  // =====================================================

  const recentQuotations =
    quotations.slice(0, 5);

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =================================================
          HEADER
      ================================================= */}

      <section className="bg-white border-b border-slate-200">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div>

              <p className="text-sm text-slate-500">
                Customer Dashboard
              </p>

              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                Welcome, {user?.name || 'Customer'}
              </h1>

              <p className="text-sm text-slate-500 mt-1">
                {user?.email || ''}
              </p>

            </div>

            <div className="flex items-center gap-3">

              <Link
                to="/products"
                className="px-4 py-2.5 rounded-lg bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition"
              >
                Browse Products
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-100 transition"
              >
                Logout
              </button>

            </div>

          </div>

        </div>

      </section>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">

            {error}

          </div>

        )}

        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* ORDERS */}

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

            <p className="text-sm text-slate-500">
              Total Orders
            </p>

            <p className="text-3xl font-bold text-slate-900 mt-2">
              {totalOrders}
            </p>

            <Link
              to="/orders"
              className="inline-block text-sm font-semibold text-teal-600 mt-3 hover:underline"
            >
              View Orders →
            </Link>

          </div>

          {/* RFQS */}

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

            <p className="text-sm text-slate-500">
              RFQ Requests
            </p>

            <p className="text-3xl font-bold text-slate-900 mt-2">
              {totalRfqs}
            </p>

            <Link
              to="/rfq"
              className="inline-block text-sm font-semibold text-teal-600 mt-3 hover:underline"
            >
              Request Quote →
            </Link>

          </div>

          {/* QUOTATIONS */}

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

            <p className="text-sm text-slate-500">
              Quotations
            </p>

            <p className="text-3xl font-bold text-slate-900 mt-2">
              {totalQuotations}
            </p>

            <Link
              to="/quotations"
              className="inline-block text-sm font-semibold text-teal-600 mt-3 hover:underline"
            >
              View Quotations →
            </Link>

          </div>

          {/* NOTIFICATIONS */}

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

            <p className="text-sm text-slate-500">
              Notifications
            </p>

            <p className="text-3xl font-bold text-slate-900 mt-2">
              {unreadNotifications}
            </p>

            <Link
              to="/notifications"
              className="inline-block text-sm font-semibold text-teal-600 mt-3 hover:underline"
            >
              View Notifications →
            </Link>

          </div>

        </div>

        {/* =================================================
            QUICK ACTIONS
        ================================================= */}

        <section className="mt-8">

          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            <Link
              to="/products"
              className="bg-white border border-slate-200 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition"
            >

              <p className="font-bold text-slate-900">
                Browse Products
              </p>

              <p className="text-sm text-slate-500 mt-1">
                Explore wholesale products
              </p>

            </Link>

            <Link
              to="/rfq"
              className="bg-white border border-slate-200 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition"
            >

              <p className="font-bold text-slate-900">
                Request Quotation
              </p>

              <p className="text-sm text-slate-500 mt-1">
                Ask for a custom wholesale price
              </p>

            </Link>

            <Link
              to="/cart"
              className="bg-white border border-slate-200 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition"
            >

              <p className="font-bold text-slate-900">
                Shopping Cart
              </p>

              <p className="text-sm text-slate-500 mt-1">
                Review your selected products
              </p>

            </Link>

            <Link
              to="/profile"
              className="bg-white border border-slate-200 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition"
            >

              <p className="font-bold text-slate-900">
                My Profile
              </p>

              <p className="text-sm text-slate-500 mt-1">
                Manage your account
              </p>

            </Link>

          </div>

        </section>

        {/* =================================================
            RECENT ORDERS
        ================================================= */}

        <section className="mt-8">

          <div className="flex items-center justify-between mb-4">

            <h2 className="text-xl font-bold text-slate-900">
              Recent Orders
            </h2>

            <Link
              to="/orders"
              className="text-sm font-semibold text-teal-600 hover:underline"
            >
              View All
            </Link>

          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">

            {recentOrders.length === 0 ? (

              <div className="p-8 text-center">

                <p className="text-slate-500">
                  No orders found.
                </p>

                <Link
                  to="/products"
                  className="inline-block mt-3 text-sm font-semibold text-teal-600 hover:underline"
                >
                  Start Shopping →
                </Link>

              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="w-full text-sm">

                  <thead className="bg-slate-50 border-b border-slate-200">

                    <tr>

                      <th className="text-left px-5 py-3 font-semibold text-slate-600">
                        Order
                      </th>

                      <th className="text-left px-5 py-3 font-semibold text-slate-600">
                        Date
                      </th>

                      <th className="text-left px-5 py-3 font-semibold text-slate-600">
                        Amount
                      </th>

                      <th className="text-left px-5 py-3 font-semibold text-slate-600">
                        Status
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {recentOrders.map(
                      (order, index) => {

                        const orderId =
                          order?._id ||
                          order?.id ||
                          index;

                        const amount =
                          order?.totalPrice ??
                          order?.totalAmount ??
                          order?.total ??
                          0;

                        const status =
                          getOrderStatus(
                            order
                          );

                        return (
                          <tr
                            key={orderId}
                            className="border-b border-slate-100 last:border-b-0"
                          >

                            <td className="px-5 py-4 font-semibold text-slate-900">
                              #
                              {String(
                                orderId
                              ).slice(-8)}
                            </td>

                            <td className="px-5 py-4 text-slate-600">
                              {formatDate(
                                order?.createdAt ||
                                order?.orderDate
                              )}
                            </td>

                            <td className="px-5 py-4 text-slate-900 font-semibold">
                              {formatCurrency(
                                amount
                              )}
                            </td>

                            <td className="px-5 py-4">

                              <span className="inline-flex px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                                {status}
                              </span>

                            </td>

                          </tr>
                        );
                      }
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        </section>

        {/* =================================================
            RFQ + QUOTATIONS
        ================================================= */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

          {/* RFQS */}

          <section>

            <div className="flex items-center justify-between mb-4">

              <h2 className="text-xl font-bold text-slate-900">
                Recent RFQs
              </h2>

              <Link
                to="/rfq"
                className="text-sm font-semibold text-teal-600 hover:underline"
              >
                View All
              </Link>

            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">

              {recentRfqs.length === 0 ? (

                <div className="p-6 text-center text-sm text-slate-500">
                  No quotation requests yet.
                </div>

              ) : (

                <div className="divide-y divide-slate-100">

                  {recentRfqs.map(
                    (rfq, index) => {

                      const rfqId =
                        rfq?._id ||
                        rfq?.id ||
                        index;

                      const productName =
                        rfq?.product?.name ||
                        rfq?.productName ||
                        rfq?.product ||
                        'Product';

                      return (
                        <div
                          key={rfqId}
                          className="p-5"
                        >

                          <div className="flex items-start justify-between gap-4">

                            <div>

                              <p className="font-semibold text-slate-900">
                                {productName}
                              </p>

                              <p className="text-xs text-slate-500 mt-1">
                                Quantity:{' '}
                                {rfq?.quantity ??
                                  '-'}
                              </p>

                              <p className="text-xs text-slate-500 mt-1">
                                {formatDate(
                                  rfq?.createdAt
                                )}
                              </p>

                            </div>

                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                              {getRfqStatus(
                                rfq
                              )}
                            </span>

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>

              )}

            </div>

          </section>

          {/* QUOTATIONS */}

          <section>

            <div className="flex items-center justify-between mb-4">

              <h2 className="text-xl font-bold text-slate-900">
                Recent Quotations
              </h2>

              <Link
                to="/quotations"
                className="text-sm font-semibold text-teal-600 hover:underline"
              >
                View All
              </Link>

            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">

              {recentQuotations.length === 0 ? (

                <div className="p-6 text-center text-sm text-slate-500">
                  No quotations available.
                </div>

              ) : (

                <div className="divide-y divide-slate-100">

                  {recentQuotations.map(
                    (
                      quotation,
                      index
                    ) => {

                      const quotationId =
                        quotation?._id ||
                        quotation?.id ||
                        index;

                      const productName =
                        quotation?.product?.name ||
                        quotation?.productName ||
                        'Product';

                      const price =
                        quotation?.totalPrice ??
                        quotation?.quotedPrice ??
                        quotation?.price ??
                        0;

                      return (
                        <div
                          key={
                            quotationId
                          }
                          className="p-5"
                        >

                          <div className="flex items-start justify-between gap-4">

                            <div>

                              <p className="font-semibold text-slate-900">
                                {productName}
                              </p>

                              <p className="text-sm text-slate-700 mt-1 font-semibold">
                                {formatCurrency(
                                  price
                                )}
                              </p>

                              <p className="text-xs text-slate-500 mt-1">
                                {formatDate(
                                  quotation?.createdAt
                                )}
                              </p>

                            </div>

                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                              {getQuotationStatus(
                                quotation
                              )}
                            </span>

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>

              )}

            </div>

          </section>

        </div>

        {/* =================================================
            PROFILE INFORMATION
        ================================================= */}

        <section className="mt-8">

          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Account Information
          </h2>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

              <div>

                <p className="text-xs text-slate-500 uppercase tracking-wide">
                  Name
                </p>

                <p className="font-semibold text-slate-900 mt-1">
                  {user?.name || '-'}
                </p>

              </div>

              <div>

                <p className="text-xs text-slate-500 uppercase tracking-wide">
                  Email
                </p>

                <p className="font-semibold text-slate-900 mt-1 break-all">
                  {user?.email || '-'}
                </p>

              </div>

              <div>

                <p className="text-xs text-slate-500 uppercase tracking-wide">
                  Account Type
                </p>

                <p className="font-semibold text-slate-900 mt-1 capitalize">
                  {user?.role ||
                    'Customer'}
                </p>

              </div>

              {user?.businessName && (

                <div>

                  <p className="text-xs text-slate-500 uppercase tracking-wide">
                    Business
                  </p>

                  <p className="font-semibold text-slate-900 mt-1">
                    {user.businessName}
                  </p>

                </div>

              )}

              {user?.phone && (

                <div>

                  <p className="text-xs text-slate-500 uppercase tracking-wide">
                    Phone
                  </p>

                  <p className="font-semibold text-slate-900 mt-1">
                    {user.phone}
                  </p>

                </div>

              )}

            </div>

          </div>

        </section>

      </main>

    </div>
  );
};

export default CustomerDashboard;