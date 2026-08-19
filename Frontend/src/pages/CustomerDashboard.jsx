import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const CustomerDashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [rfqs, setRfqs] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState(true);

  // =====================================================
  // USER
  // =====================================================

  useEffect(() => {
    const userInfo =
      localStorage.getItem('userInfo');

    if (userInfo) {
      try {
        setUser(JSON.parse(userInfo));
      } catch {
        setUser(null);
      }
    }
  }, []);

  // =====================================================
  // LOAD DASHBOARD DATA
  // =====================================================

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);

        const results =
          await Promise.allSettled([
            API.get('/orders/myorders'),
            API.get('/rfq/my'),
            API.get('/quotations/my'),
            API.get('/notifications'),
          ]);

        // -----------------------------------------------
        // ORDERS
        // -----------------------------------------------

        if (
          results[0].status === 'fulfilled'
        ) {
          const data =
            results[0].value.data;

          setOrders(
            data?.orders ||
              data ||
              []
          );
        }

        // -----------------------------------------------
        // RFQs
        // -----------------------------------------------

        if (
          results[1].status === 'fulfilled'
        ) {
          const data =
            results[1].value.data;

          setRfqs(
            data?.rfqs ||
              data ||
              []
          );
        }

        // -----------------------------------------------
        // QUOTATIONS
        // -----------------------------------------------

        if (
          results[2].status === 'fulfilled'
        ) {
          const data =
            results[2].value.data;

          setQuotations(
            data?.quotations ||
              data ||
              []
          );
        }

        // -----------------------------------------------
        // NOTIFICATIONS
        // -----------------------------------------------

        if (
          results[3].status === 'fulfilled'
        ) {
          const data =
            results[3].value.data;

          setNotifications(
            data?.notifications ||
              data ||
              []
          );
        }

      } catch (error) {
        console.error(
          'Dashboard error:',
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  // =====================================================
  // USER DISPLAY
  // =====================================================

  const userName =
    user?.name ||
    user?.username ||
    'Customer';

  const businessName =
    user?.businessName ||
    user?.companyName ||
    'Business Account';

  // =====================================================
  // DASHBOARD MENU
  // =====================================================

  const menuItems = [
    {
      title: 'Dashboard',
      icon: '🏠',
      path: '/dashboard',
    },
    {
      title: 'Orders',
      icon: '📦',
      path: '/orders',
    },
    {
      title: 'RFQs',
      icon: '📝',
      path: '/my-rfqs',
    },
    {
      title: 'Quotations',
      icon: '💰',
      path: '/my-quotations',
    },
    {
      title: 'Wishlist',
      icon: '❤️',
      path: '/wishlist',
    },
    {
      title: 'Returns',
      icon: '🔄',
      path: '/orders',
    },
    {
      title: 'Invoices',
      icon: '🧾',
      path: '/orders',
    },
    {
      title: 'Addresses',
      icon: '📍',
      path: '/profile/addresses',
    },
    {
      title: 'Notifications',
      icon: '🔔',
      path: '/notifications',
    },
    {
      title: 'Settings',
      icon: '⚙️',
      path: '/profile/settings',
    },
  ];

  // =====================================================
  // STATS
  // =====================================================

  const stats = [
    {
      title: 'Orders',
      value: orders.length,
      icon: '📦',
      path: '/orders',
    },
    {
      title: 'RFQs',
      value: rfqs.length,
      icon: '📝',
      path: '/my-rfqs',
    },
    {
      title: 'Quotations',
      value: quotations.length,
      icon: '💰',
      path: '/my-quotations',
    },
    {
      title: 'Notifications',
      value: notifications.length,
      icon: '🔔',
      path: '/notifications',
    },
  ];

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return '—';
    }

    return new Date(
      date
    ).toLocaleDateString(
      'en-IN',
      {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }
    );
  };

  // =====================================================
  // RECENT ORDERS
  // =====================================================

  const recentOrders =
    orders.slice(0, 5);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">

        <div className="text-center">

          <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-slate-500">
            Loading dashboard...
          </p>

        </div>

      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =================================================
          MOBILE HEADER
      ================================================= */}

      <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-5">

        <p className="text-xs font-semibold uppercase tracking-wide text-teal-600">
          My Account
        </p>

        <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
          👤 {userName}
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          {businessName}
        </p>

      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-6">

          {/* =================================================
              DESKTOP SIDEBAR
          ================================================= */}

          <aside className="hidden lg:block">

            <div className="bg-white border border-slate-200 rounded-2xl p-4 sticky top-24">

              {/* PROFILE */}

              <div className="px-3 py-4 border-b border-slate-100">

                <div className="w-14 h-14 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-2xl font-bold">
                  {userName
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <h2 className="font-bold text-slate-900 mt-3">
                  {userName}
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  {businessName}
                </p>

              </div>

              {/* MENU */}

              <nav className="mt-4 space-y-1">

                {menuItems.map(
                  (item) => (

                    <button
                      key={item.title}
                      type="button"
                      onClick={() =>
                        navigate(
                          item.path
                        )
                      }
                      className={`
                        w-full
                        flex
                        items-center
                        gap-3
                        px-3
                        py-2.5
                        rounded-lg
                        text-sm
                        font-medium
                        text-left
                        transition
                        ${
                          item.title ===
                          'Dashboard'
                            ? 'bg-teal-50 text-teal-700'
                            : 'text-slate-600 hover:bg-slate-50'
                        }
                      `}
                    >

                      <span>
                        {item.icon}
                      </span>

                      <span>
                        {item.title}
                      </span>

                    </button>

                  )
                )}

              </nav>

            </div>

          </aside>

          {/* =================================================
              MAIN CONTENT
          ================================================= */}

          <main>

            {/* =================================================
                DESKTOP TITLE
            ================================================= */}

            <div className="hidden lg:block mb-6">

              <p className="text-sm font-semibold text-teal-600 uppercase tracking-wide">
                My Account
              </p>

              <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
                Dashboard
              </h1>

              <p className="text-slate-500 mt-1">
                Manage your wholesale business account.
              </p>

            </div>

            {/* =================================================
                MOBILE MENU
            ================================================= */}

            <div className="lg:hidden bg-white border border-slate-200 rounded-2xl p-4 mb-6">

              <h2 className="font-bold text-slate-900 mb-3">
                Account Menu
              </h2>

              <div className="grid grid-cols-2 gap-2">

                {menuItems
                  .filter(
                    (item) =>
                      item.title !==
                      'Dashboard'
                  )
                  .map(
                    (item) => (

                      <button
                        key={
                          item.title
                        }
                        type="button"
                        onClick={() =>
                          navigate(
                            item.path
                          )
                        }
                        className="flex items-center gap-2 px-3 py-3 rounded-xl bg-slate-50 hover:bg-teal-50 text-left text-sm font-medium text-slate-700"
                      >

                        <span>
                          {item.icon}
                        </span>

                        <span>
                          {item.title}
                        </span>

                      </button>

                    )
                  )}

              </div>

            </div>

            {/* =================================================
                WELCOME CARD
            ================================================= */}

            <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-7 text-white mb-6">

              <p className="text-teal-100 text-sm">
                Welcome back
              </p>

              <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">
                {userName} 👋
              </h2>

              <p className="text-teal-100 mt-2">
                {businessName}
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    '/products'
                  )
                }
                className="mt-5 px-5 py-2.5 bg-white text-teal-700 rounded-lg font-semibold hover:bg-teal-50 transition"
              >
                Continue Shopping
              </button>

            </div>

            {/* =================================================
                STATS
            ================================================= */}

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

              {stats.map(
                (stat) => (

                  <button
                    key={stat.title}
                    type="button"
                    onClick={() =>
                      navigate(
                        stat.path
                      )
                    }
                    className="bg-white border border-slate-200 rounded-2xl p-5 text-left hover:border-teal-300 hover:shadow-sm transition"
                  >

                    <div className="flex items-center justify-between">

                      <span className="text-2xl">
                        {stat.icon}
                      </span>

                      <span className="text-2xl font-extrabold text-slate-900">
                        {stat.value}
                      </span>

                    </div>

                    <p className="text-sm text-slate-500 mt-3">
                      {stat.title}
                    </p>

                  </button>

                )
              )}

            </div>

            {/* =================================================
                QUICK ACTIONS
            ================================================= */}

            <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 mb-6">

              <div className="flex items-center justify-between mb-5">

                <div>

                  <h2 className="text-xl font-bold text-slate-900">
                    Quick Actions
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Quickly access important account features.
                  </p>

                </div>

              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

                <button
                  type="button"
                  onClick={() =>
                    navigate('/orders')
                  }
                  className="p-4 rounded-xl bg-slate-50 hover:bg-teal-50 transition text-left"
                >

                  <div className="text-2xl">
                    📦
                  </div>

                  <p className="font-semibold text-slate-800 mt-2">
                    My Orders
                  </p>

                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate('/my-rfqs')
                  }
                  className="p-4 rounded-xl bg-slate-50 hover:bg-teal-50 transition text-left"
                >

                  <div className="text-2xl">
                    📝
                  </div>

                  <p className="font-semibold text-slate-800 mt-2">
                    My RFQs
                  </p>

                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      '/my-quotations'
                    )
                  }
                  className="p-4 rounded-xl bg-slate-50 hover:bg-teal-50 transition text-left"
                >

                  <div className="text-2xl">
                    💰
                  </div>

                  <p className="font-semibold text-slate-800 mt-2">
                    Quotations
                  </p>

                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      '/wishlist'
                    )
                  }
                  className="p-4 rounded-xl bg-slate-50 hover:bg-teal-50 transition text-left"
                >

                  <div className="text-2xl">
                    ❤️
                  </div>

                  <p className="font-semibold text-slate-800 mt-2">
                    Wishlist
                  </p>

                </button>

              </div>

            </div>

            {/* =================================================
                RECENT ORDERS
            ================================================= */}

            <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">

              <div className="flex items-center justify-between gap-3 mb-5">

                <div>

                  <h2 className="text-xl font-bold text-slate-900">
                    Recent Orders
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Your latest wholesale orders.
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    navigate('/orders')
                  }
                  className="text-sm font-semibold text-teal-600 hover:text-teal-700"
                >
                  View All
                </button>

              </div>

              {recentOrders.length === 0 ? (

                <div className="py-10 text-center">

                  <div className="text-4xl">
                    📦
                  </div>

                  <p className="font-semibold text-slate-800 mt-3">
                    No orders yet
                  </p>

                  <p className="text-sm text-slate-500 mt-1">
                    Your recent orders will appear here.
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        '/products'
                      )
                    }
                    className="mt-4 px-5 py-2.5 bg-teal-600 text-white rounded-lg font-semibold"
                  >
                    Start Shopping
                  </button>

                </div>

              ) : (

                <div className="space-y-3">

                  {recentOrders.map(
                    (order, index) => (

                      <div
                        key={
                          order._id ||
                          index
                        }
                        className="border border-slate-100 rounded-xl p-4"
                      >

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                          <div>

                            <p className="font-semibold text-slate-900">
                              Order #
                              {String(
                                order._id ||
                                ''
                              ).slice(
                                -8
                              )}
                            </p>

                            <p className="text-sm text-slate-500 mt-1">
                              {formatDate(
                                order.createdAt
                              )}
                            </p>

                          </div>

                          <div className="flex items-center gap-3">

                            <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold">
                              {order.status ||
                                order.orderStatus ||
                                'Order Placed'}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/order-tracking/${order._id}`
                                )
                              }
                              className="text-sm font-semibold text-teal-600"
                            >
                              Track
                            </button>

                          </div>

                        </div>

                      </div>

                    )
                  )}

                </div>

              )}

            </div>

          </main>

        </div>

      </div>

    </div>
  );
};

export default CustomerDashboard;