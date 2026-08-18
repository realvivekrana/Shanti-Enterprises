import {
  useEffect,
  useState,
} from 'react';

import {
  Link,
} from 'react-router-dom';

import API from '../../api/axios';

// ==============================
// STAT CARD
// ==============================

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

// ==============================
// FORMAT CURRENCY
// ==============================

const formatCurrency = (
  value
) => {
  return `₹${Number(
    value || 0
  ).toLocaleString('en-IN')}`;
};

// ==============================
// ADMIN DASHBOARD
// ==============================

const AdminDashboard =
  () => {
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

    // ==============================
    // FETCH DASHBOARD
    // ==============================

    useEffect(() => {
      const fetchDashboard =
        async () => {
          try {
            const response =
              await API.get(
                '/dashboard/summary'
              );

            // IMPORTANT:
            // axios.js response interceptor
            // already extracts response.data.data.
            //
            // Therefore:
            // response.data = dashboard object

            setDashboard(
              response.data
            );
          } catch (err) {
            console.error(
              'Dashboard Error:',
              err
            );

            setError(
              err.response?.data
                ?.message ||
                err.message ||
                'Failed to load dashboard'
            );
          } finally {
            setLoading(false);
          }
        };

      fetchDashboard();
    }, []);

    // ==============================
    // LOADING
    // ==============================

    if (loading) {
      return (
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="bg-white border border-slate-200 rounded-xl p-8">
            <p className="text-slate-500">
              Loading admin dashboard...
            </p>
          </div>
        </div>
      );
    }

    // ==============================
    // ERROR
    // ==============================

    if (error) {
      return (
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-5">
            <h2 className="font-bold text-lg">
              Dashboard Error
            </h2>

            <p className="mt-2">
              {error}
            </p>
          </div>
        </div>
      );
    }

    // ==============================
    // NO DATA
    // ==============================

    if (!dashboard) {
      return (
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-xl p-5">
            Dashboard data is not available.
          </div>
        </div>
      );
    }

    // ==============================
    // RENDER
    // ==============================

    return (
      <div className="bg-slate-50 min-h-screen">

        <div className="max-w-7xl mx-auto px-4 py-8">

          {/* ==============================
              HEADER
          ============================== */}

          <div className="mb-8">

            <p className="text-sm text-teal-600 font-semibold">
              ADMIN PANEL
            </p>

            <h1 className="text-3xl font-bold text-slate-900 mt-1">
              Dashboard
            </h1>

            <p className="text-slate-500 mt-2">
              Manage your wholesale business
              from one place.
            </p>

          </div>

          {/* ==============================
              FINANCIAL STATS
          ============================== */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

            <StatCard
              title="Total Revenue"
              value={formatCurrency(
                dashboard.totalRevenue
              )}
              description="Paid orders"
            />

            <StatCard
              title="Today's Sales"
              value={formatCurrency(
                dashboard.todaySales
              )}
              description={`${dashboard.todayOrders || 0} orders today`}
            />

            <StatCard
              title="Outstanding Payments"
              value={formatCurrency(
                dashboard.outstandingPayments
              )}
              description="Customer credit due"
            />

            <StatCard
              title="Total Refunds"
              value={formatCurrency(
                dashboard.totalRefunds
              )}
              description={`${dashboard.refundedReturns || 0} refunded returns`}
            />

          </div>

          {/* ==============================
              BUSINESS STATS
          ============================== */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mt-5">

            <StatCard
              title="Total Orders"
              value={
                dashboard.totalOrders || 0
              }
            />

            <StatCard
              title="Pending Orders"
              value={
                dashboard.pendingOrders || 0
              }
            />

            <StatCard
              title="Customers"
              value={
                dashboard.totalUsers || 0
              }
            />

            <StatCard
              title="Products"
              value={
                dashboard.totalProducts || 0
              }
            />

            <StatCard
              title="Low Stock"
              value={
                dashboard.lowStockCount || 0
              }
              description="Needs attention"
            />

          </div>

          {/* ==============================
              CREDIT SUMMARY
          ============================== */}

          <div className="mt-8">

            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Credit Overview
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

              <div className="bg-white border border-slate-200 rounded-xl p-5">

                <p className="text-sm text-slate-500">
                  Credit Limit
                </p>

                <p className="text-2xl font-bold text-slate-900 mt-2">
                  {formatCurrency(
                    dashboard.totalCreditLimit
                  )}
                </p>

              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5">

                <p className="text-sm text-slate-500">
                  Used Credit
                </p>

                <p className="text-2xl font-bold text-orange-600 mt-2">
                  {formatCurrency(
                    dashboard.totalUsedCredit
                  )}
                </p>

              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5">

                <p className="text-sm text-slate-500">
                  Outstanding Due
                </p>

                <p className="text-2xl font-bold text-red-600 mt-2">
                  {formatCurrency(
                    dashboard.outstandingPayments
                  )}
                </p>

              </div>

            </div>

          </div>

          {/* ==============================
              RETURNS
          ============================== */}

          <div className="mt-8">

            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Returns & Refunds
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

              <div className="bg-white border border-slate-200 rounded-xl p-5">

                <p className="text-sm text-slate-500">
                  Total Returns
                </p>

                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {dashboard.totalReturns || 0}
                </p>

              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5">

                <p className="text-sm text-slate-500">
                  Pending Returns
                </p>

                <p className="text-3xl font-bold text-amber-600 mt-2">
                  {dashboard.pendingReturns || 0}
                </p>

              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5">

                <p className="text-sm text-slate-500">
                  Refunded Returns
                </p>

                <p className="text-3xl font-bold text-emerald-600 mt-2">
                  {dashboard.refundedReturns || 0}
                </p>

              </div>

            </div>

          </div>

          {/* ==============================
              QUICK MANAGEMENT
          ============================== */}

          <div className="mt-8">

            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Quick Management
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

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
                to="/admin/returns"
                className="bg-white border border-slate-200 rounded-xl p-5 hover:border-teal-400 hover:shadow-sm transition"
              >
                <p className="font-semibold text-slate-900">
                  Returns
                </p>

                <p className="text-sm text-slate-500 mt-1">
                  Review returns
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

            </div>

          </div>

          {/* ==============================
              LOW STOCK PRODUCTS
          ============================== */}

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
                {dashboard.lowStockCount || 0}
              </span>

            </div>

            {dashboard.lowStockProducts?.length ===
            0 ? (

              <div className="p-6 text-slate-500">
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

                    {dashboard.lowStockProducts?.map(
                      (product) => (

                        <tr
                          key={
                            product._id
                          }
                          className="border-t border-slate-100"
                        >

                          <td className="px-5 py-3 font-medium text-slate-800">
                            {product.name}
                          </td>

                          <td className="px-5 py-3 text-slate-500">
                            {product.sku}
                          </td>

                          <td className="px-5 py-3 font-semibold text-red-600">
                            {product.stock}
                          </td>

                          <td className="px-5 py-3 text-slate-500">
                            {
                              product.lowStockThreshold
                            }
                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </div>

          {/* ==============================
              TOP PRODUCTS
          ============================== */}

          <div className="bg-white border border-slate-200 rounded-xl mt-8 overflow-hidden">

            <div className="p-5 border-b border-slate-200">

              <h2 className="text-lg font-bold text-slate-900">
                Top Products
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Best selling products
              </p>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                <thead className="bg-slate-50">

                  <tr>

                    <th className="text-left px-5 py-3">
                      Product
                    </th>

                    <th className="text-left px-5 py-3">
                      Quantity Sold
                    </th>

                    <th className="text-left px-5 py-3">
                      Revenue
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {dashboard.topProducts?.map(
                    (product) => (

                      <tr
                        key={
                          product._id
                        }
                        className="border-t border-slate-100"
                      >

                        <td className="px-5 py-3 font-medium text-slate-800">
                          {product.name}
                        </td>

                        <td className="px-5 py-3">
                          {
                            product.totalSold
                          }
                        </td>

                        <td className="px-5 py-3 font-semibold">
                          {formatCurrency(
                            product.revenue
                          )}
                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>

          {/* ==============================
              RECENT ORDERS
          ============================== */}

          <div className="bg-white border border-slate-200 rounded-xl mt-8 overflow-hidden">

            <div className="p-5 border-b border-slate-200">

              <h2 className="text-lg font-bold text-slate-900">
                Recent Orders
              </h2>

            </div>

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

                  {dashboard.recentOrders?.map(
                    (order) => (

                      <tr
                        key={
                          order._id
                        }
                        className="border-t border-slate-100"
                      >

                        <td className="px-5 py-3">

                          <p className="font-medium text-slate-800">
                            {
                              order.user
                                ?.name ||
                              'Customer'
                            }
                          </p>

                          <p className="text-xs text-slate-500">
                            {
                              order.user
                                ?.email ||
                              ''
                            }
                          </p>

                        </td>

                        <td className="px-5 py-3 font-semibold">
                          {formatCurrency(
                            order.totalPrice
                          )}
                        </td>

                        <td className="px-5 py-3">

                          <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                            {
                              order.orderStatus
                            }
                          </span>

                        </td>

                        <td className="px-5 py-3">

                          {order.isPaid ? (

                            <span className="text-emerald-600 font-medium">
                              Paid
                            </span>

                          ) : (

                            <span className="text-amber-600 font-medium">
                              Pending
                            </span>

                          )}

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </div>
    );
  };

export default AdminDashboard;