import {
  useEffect,
  useState,
} from 'react';

import {
  Link,
} from 'react-router-dom';

import API from '../../api/axios';

// ======================================================
// STAT CARD
// ======================================================

const StatCard = ({
  title,
  value,
  description,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">

      <p className="text-sm text-slate-500">
        {title}
      </p>

      <h2 className="text-2xl font-bold text-slate-900 mt-2">
        {value}
      </h2>

      {description && (
        <p className="text-xs text-slate-500 mt-2">
          {description}
        </p>
      )}

    </div>
  );
};

// ======================================================
// FORMAT CURRENCY
// ======================================================

const formatCurrency = (value) => {
  return `₹${Number(
    value || 0
  ).toLocaleString('en-IN')}`;
};

// ======================================================
// ADMIN DASHBOARD
// ======================================================

const AdminDashboard = () => {

  const [
    dashboard,
    setDashboard,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState('');

  // ====================================================
  // LOAD DASHBOARD
  // ====================================================

  useEffect(() => {

    const fetchDashboard =
      async () => {

        try {

          setLoading(true);
          setError('');

          // IMPORTANT:
          // Backend dashboard endpoint
          // is /dashboard/summary

          const response =
            await API.get(
              '/dashboard/summary'
            );

          /*
           * Your axios interceptor
           * may already return response.data.data.
           *
           * Therefore handle both formats.
           */

          const data =
            response?.data?.data ||
            response?.data ||
            {};

          setDashboard(data);

        } catch (err) {

          console.error(
            'Dashboard Error:',
            err
          );

          setError(
            err?.response?.data
              ?.message ||
            err?.message ||
            'Failed to load dashboard'
          );

        } finally {

          setLoading(false);

        }

      };

    fetchDashboard();

  }, []);

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {

    return (

      <div className="min-h-screen bg-slate-50">

        <div className="max-w-7xl mx-auto px-4 py-10">

          <div className="bg-white border border-slate-200 rounded-xl p-8">

            <p className="text-slate-500">
              Loading admin dashboard...
            </p>

          </div>

        </div>

      </div>

    );

  }

  // ====================================================
  // ERROR
  // ====================================================

  if (error) {

    return (

      <div className="min-h-screen bg-slate-50">

        <div className="max-w-7xl mx-auto px-4 py-10">

          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6">

            <h2 className="text-lg font-bold">
              Dashboard Error
            </h2>

            <p className="mt-2 text-sm">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
              className="mt-4 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
            >
              Try Again
            </button>

          </div>

        </div>

      </div>

    );

  }

  // ====================================================
  // SAFE DASHBOARD DATA
  // ====================================================

  const data =
    dashboard || {};

  const totalRevenue =
    data.totalRevenue ??
    data.revenue ??
    0;

  const totalOrders =
    data.totalOrders ??
    data.orders ??
    0;

  const pendingOrders =
    data.pendingOrders ??
    0;

  const totalUsers =
    data.totalUsers ??
    data.customers ??
    0;

  const totalProducts =
    data.totalProducts ??
    data.products ??
    0;

  const lowStockCount =
    data.lowStockCount ??
    data.lowStock ??
    0;

  const pendingRFQs =
    data.pendingRFQs ??
    data.pendingRfqCount ??
    0;

  const outstandingPayments =
    data.outstandingPayments ??
    data.outstandingDue ??
    0;

  const totalRefunds =
    data.totalRefunds ??
    0;

  const todaySales =
    data.todaySales ??
    0;

  const todayOrders =
    data.todayOrders ??
    0;

  const recentOrders =
    Array.isArray(
      data.recentOrders
    )
      ? data.recentOrders
      : [];

  const lowStockProducts =
    Array.isArray(
      data.lowStockProducts
    )
      ? data.lowStockProducts
      : [];

  // ====================================================
  // RENDER
  // ====================================================

  return (

    <div className="min-h-screen bg-slate-50">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="bg-white border-b border-slate-200">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="h-16 flex items-center justify-between">

            <div>

              <p className="text-xs text-teal-600 font-semibold uppercase tracking-wide">
                Admin Panel
              </p>

              <h1 className="font-bold text-slate-900">
                Dashboard
              </h1>

            </div>

            <div className="flex items-center gap-3">

              <span className="hidden sm:block text-sm text-slate-500">
                Administrator
              </span>

              <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                A
              </div>

            </div>

          </div>

        </div>

      </header>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* =================================================
            PAGE TITLE
        ================================================= */}

        <div className="mb-8">

          <p className="text-sm font-semibold uppercase tracking-wide text-teal-600">
            Overview
          </p>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Admin Dashboard
          </h2>

          <p className="text-slate-500 mt-1">
            Monitor your wholesale business performance.
          </p>

        </div>

        {/* =================================================
            STATS
        ================================================= */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

          <StatCard
            title="Total Revenue"
            value={formatCurrency(
              totalRevenue
            )}
            description="Paid orders"
          />

          <StatCard
            title="Total Orders"
            value={totalOrders}
            description="All orders"
          />

          <StatCard
            title="Customers"
            value={totalUsers}
            description="Registered customers"
          />

          <StatCard
            title="Products"
            value={totalProducts}
            description="Total products"
          />

        </div>

        {/* =================================================
            SECOND STATS
        ================================================= */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">

          <StatCard
            title="Pending Orders"
            value={pendingOrders}
            description="Need attention"
          />

          <StatCard
            title="Pending RFQs"
            value={pendingRFQs}
            description="Quotation requests"
          />

          <StatCard
            title="Low Stock"
            value={lowStockCount}
            description="Needs restocking"
          />

          <StatCard
            title="Today's Sales"
            value={formatCurrency(
              todaySales
            )}
            description={`${todayOrders} orders today`}
          />

        </div>

        {/* =================================================
            FINANCIAL SUMMARY
        ================================================= */}

        <div className="mt-8">

          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Financial Overview
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {/* Outstanding */}

            <div className="bg-white border border-slate-200 rounded-xl p-5">

              <p className="text-sm text-slate-500">
                Outstanding Payments
              </p>

              <p className="text-2xl font-bold text-red-600 mt-2">
                {formatCurrency(
                  outstandingPayments
                )}
              </p>

            </div>

            {/* Refunds */}

            <div className="bg-white border border-slate-200 rounded-xl p-5">

              <p className="text-sm text-slate-500">
                Total Refunds
              </p>

              <p className="text-2xl font-bold text-orange-600 mt-2">
                {formatCurrency(
                  totalRefunds
                )}
              </p>

            </div>

            {/* Today's Sales */}

            <div className="bg-white border border-slate-200 rounded-xl p-5">

              <p className="text-sm text-slate-500">
                Today's Sales
              </p>

              <p className="text-2xl font-bold text-teal-600 mt-2">
                {formatCurrency(
                  todaySales
                )}
              </p>

            </div>

          </div>

        </div>

        {/* =================================================
            QUICK ACTIONS
        ================================================= */}

        <div className="mt-8">

          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            <Link
              to="/admin/products"
              className="bg-white border border-slate-200 rounded-xl p-5 hover:border-teal-400 hover:shadow-sm transition"
            >

              <p className="font-semibold text-slate-900">
                Products
              </p>

              <p className="text-sm text-slate-500 mt-1">
                Add / edit products
              </p>

            </Link>

            <Link
              to="/admin/orders"
              className="bg-white border border-slate-200 rounded-xl p-5 hover:border-teal-400 hover:shadow-sm transition"
            >

              <p className="font-semibold text-slate-900">
                Orders
              </p>

              <p className="text-sm text-slate-500 mt-1">
                Manage orders
              </p>

            </Link>

            <Link
              to="/admin/customers"
              className="bg-white border border-slate-200 rounded-xl p-5 hover:border-teal-400 hover:shadow-sm transition"
            >

              <p className="font-semibold text-slate-900">
                Customers
              </p>

              <p className="text-sm text-slate-500 mt-1">
                Manage customers
              </p>

            </Link>

            <Link
              to="/admin/rfqs"
              className="bg-white border border-slate-200 rounded-xl p-5 hover:border-teal-400 hover:shadow-sm transition"
            >

              <p className="font-semibold text-slate-900">
                RFQs
              </p>

              <p className="text-sm text-slate-500 mt-1">
                Review quotation requests
              </p>

            </Link>

          </div>

        </div>

        {/* =================================================
            LOW STOCK
        ================================================= */}

        <div className="bg-white border border-slate-200 rounded-xl mt-8 overflow-hidden">

          <div className="p-5 border-b border-slate-200 flex items-center justify-between">

            <div>

              <h2 className="text-lg font-bold text-slate-900">
                Low Stock Products
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Products that need restocking
              </p>

            </div>

            <span className="text-sm font-semibold text-red-600">
              {lowStockCount}
            </span>

          </div>

          {lowStockProducts.length === 0 ? (

            <div className="p-6 text-slate-500 text-sm">
              No low-stock products.
            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                <thead className="bg-slate-50">

                  <tr>

                    <th className="text-left px-5 py-3">
                      Product
                    </th>

                    <th className="text-left px-5 py-3">
                      SKU
                    </th>

                    <th className="text-left px-5 py-3">
                      Stock
                    </th>

                    <th className="text-left px-5 py-3">
                      Threshold
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {lowStockProducts.map(
                    (product) => (

                      <tr
                        key={
                          product._id ||
                          product.id
                        }
                        className="border-t border-slate-100"
                      >

                        <td className="px-5 py-3 font-medium text-slate-800">
                          {product.name ||
                            'Product'}
                        </td>

                        <td className="px-5 py-3 text-slate-500">
                          {product.sku ||
                            '-'}
                        </td>

                        <td className="px-5 py-3 font-semibold text-red-600">
                          {product.stock ??
                            product.quantity ??
                            0}
                        </td>

                        <td className="px-5 py-3 text-slate-500">
                          {product.lowStockThreshold ??
                            product.threshold ??
                            0}
                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

        {/* =================================================
            RECENT ORDERS
        ================================================= */}

        <div className="bg-white border border-slate-200 rounded-xl mt-8 overflow-hidden">

          <div className="p-5 border-b border-slate-200">

            <h2 className="text-lg font-bold text-slate-900">
              Recent Orders
            </h2>

          </div>

          {recentOrders.length === 0 ? (

            <div className="p-6 text-slate-500 text-sm">
              No recent orders available.
            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                <thead className="bg-slate-50">

                  <tr>

                    <th className="text-left px-5 py-3">
                      Customer
                    </th>

                    <th className="text-left px-5 py-3">
                      Amount
                    </th>

                    <th className="text-left px-5 py-3">
                      Status
                    </th>

                    <th className="text-left px-5 py-3">
                      Payment
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {recentOrders.map(
                    (order) => (

                      <tr
                        key={
                          order._id ||
                          order.id
                        }
                        className="border-t border-slate-100"
                      >

                        <td className="px-5 py-3">

                          <p className="font-medium text-slate-800">

                            {order.user?.name ||
                              order.customer?.name ||
                              'Customer'}

                          </p>

                          <p className="text-xs text-slate-500">

                            {order.user?.email ||
                              order.customer?.email ||
                              ''}

                          </p>

                        </td>

                        <td className="px-5 py-3 font-semibold">

                          {formatCurrency(
                            order.totalAmount ??
                            order.total ??
                            order.grandTotal ??
                            0
                          )}

                        </td>

                        <td className="px-5 py-3">

                          <span className="inline-flex px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">

                            {order.status ||
                              'Pending'}

                          </span>

                        </td>

                        <td className="px-5 py-3 text-slate-600">

                          {order.paymentMethod ||
                            order.payment?.method ||
                            '-'}

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </main>

    </div>

  );
};

export default AdminDashboard;