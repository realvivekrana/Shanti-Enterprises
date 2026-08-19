import {
  useEffect,
  useState,
} from 'react';

import API from '../../api/axios';


// ======================================================
// HELPERS
// ======================================================

const formatCurrency = (value) => {

  return `₹${Number(
    value || 0
  ).toLocaleString('en-IN', {
    maximumFractionDigits: 2,
  })}`;

};


const formatNumber = (value) => {

  return Number(
    value || 0
  ).toLocaleString('en-IN');

};


const getMonthName = (
  month
) => {

  const date =
    new Date(
      2000,
      month - 1,
      1
    );

  return date.toLocaleString(
    'en-IN',
    {
      month: 'short',
    }
  );

};


// ======================================================
// STAT CARD
// ======================================================

const StatCard = ({
  title,
  value,
  subtitle,
}) => {

  return (

    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">

      <p className="text-sm text-slate-500">

        {title}

      </p>


      <h3 className="text-2xl font-bold text-slate-800 mt-2">

        {value}

      </h3>


      {subtitle && (

        <p className="text-xs text-slate-500 mt-2">

          {subtitle}

        </p>

      )}

    </div>

  );

};


// ======================================================
// REPORTS ANALYTICS
// ======================================================

const ReportsAnalytics = () => {

  // ====================================================
  // STATE
  // ====================================================

  const [
    report,
    setReport,
  ] = useState(null);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState('');


  const [
    months,
    setMonths,
  ] = useState(12);


  // ====================================================
  // FETCH REPORT
  // ====================================================

  const fetchReport =
    async () => {

      try {

        setLoading(true);

        setError('');


        const response =
          await API.get(
            `/dashboard/reports?months=${months}`
          );


        const data =
          response.data;


        // ==============================================
        // API RESPONSE SUPPORT
        // ==============================================

        setReport(

          data?.data ||
          data

        );

      } catch (err) {

        console.error(
          'Reports API error:',
          err
        );


        setError(

          err.response?.data?.message ||

          'Failed to load reports.'

        );

      } finally {

        setLoading(false);

      }

    };


  // ====================================================
  // INITIAL LOAD
  // ====================================================

  useEffect(() => {

    fetchReport();

  }, [months]);


  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {

    return (

      <div className="max-w-7xl mx-auto px-4 py-10">

        <div className="flex items-center justify-center min-h-[400px]">

          <div className="text-center">

            <div className="w-10 h-10 border-4 border-slate-200 border-t-teal-600 rounded-full animate-spin mx-auto" />

            <p className="mt-4 text-slate-500">

              Loading reports...

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

      <div className="max-w-7xl mx-auto px-4 py-10">

        <div className="bg-red-50 border border-red-200 rounded-xl p-6">

          <h2 className="text-lg font-semibold text-red-700">

            Unable to load reports

          </h2>


          <p className="text-sm text-red-600 mt-2">

            {error}

          </p>


          <button
            onClick={fetchReport}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >

            Try Again

          </button>

        </div>

      </div>

    );

  }


  if (!report) {

    return null;

  }


  // ====================================================
  // DATA
  // ====================================================

  const monthlySales =
    report.monthlySales || [];


  const topProducts =
    report.topProducts || [];


  const topCustomers =
    report.topCustomers || [];


  const categorySales =
    report.categorySales || [];


  const returnedProducts =
    report.returnedProducts || [];


  const pendingPayments =
    report.pendingPayments || {};


  const profit =
    report.profit || {};


  const mostOrderedCategory =
    report.mostOrderedCategory;


  // ====================================================
  // MAX MONTHLY SALE
  // ====================================================

  const maxMonthlySale =
    Math.max(

      ...monthlySales.map(

        (item) =>
          Number(
            item.sales || 0
          )

      ),

      1

    );


  // ====================================================
  // RENDER
  // ====================================================

  return (

    <div className="bg-slate-50 min-h-screen">

      <div className="max-w-7xl mx-auto px-4 py-8">


        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">


          <div>

            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">

              Reports & Analytics

            </h1>


            <p className="text-slate-500 mt-1">

              Business performance and sales insights

            </p>

          </div>


          {/* ==================================================
              PERIOD
          ================================================== */}

          <select
            value={months}
            onChange={(e) =>
              setMonths(
                Number(
                  e.target.value
                )
              )
            }
            className="px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500"
          >

            <option value={1}>
              Last 1 Month
            </option>

            <option value={3}>
              Last 3 Months
            </option>

            <option value={6}>
              Last 6 Months
            </option>

            <option value={12}>
              Last 12 Months
            </option>

            <option value={24}>
              Last 24 Months
            </option>

          </select>

        </div>


        {/* ==================================================
            MAIN STATS
        ================================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">


          <StatCard
            title="Total Sales"
            value={formatCurrency(
              report.totalSales
            )}
            subtitle={`Last ${months} months`}
          />


          <StatCard
            title="Total Orders"
            value={formatNumber(
              report.totalOrders
            )}
            subtitle={`Last ${months} months`}
          />


          <StatCard
            title="Average Order Value"
            value={formatCurrency(
              report.averageOrderValue
            )}
            subtitle="Average paid order"
          />


          <StatCard
            title="Gross Profit"
            value={formatCurrency(
              profit.grossProfit
            )}
            subtitle={`${Number(
              profit.profitMargin || 0
            ).toFixed(2)}% margin`}
          />

        </div>


        {/* ==================================================
            MONTHLY SALES
        ================================================== */}

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-8">


          <div className="flex items-center justify-between mb-6">

            <div>

              <h2 className="text-lg font-semibold text-slate-800">

                Monthly Sales

              </h2>


              <p className="text-sm text-slate-500 mt-1">

                Sales performance by month

              </p>

            </div>

          </div>


          {monthlySales.length === 0 ? (

            <div className="py-16 text-center text-slate-400">

              No sales data available.

            </div>

          ) : (

            <div className="space-y-5">

              {monthlySales.map(
                (item) => {

                  const sale =
                    Number(
                      item.sales || 0
                    );


                  const percentage =
                    (
                      sale /
                      maxMonthlySale
                    ) * 100;


                  return (

                    <div
                      key={`${item._id.year}-${item._id.month}`}
                    >

                      <div className="flex items-center justify-between mb-2">

                        <span className="text-sm font-medium text-slate-700">

                          {getMonthName(
                            item._id.month
                          )}{' '}

                          {item._id.year}

                        </span>


                        <div className="text-right">

                          <span className="text-sm font-semibold text-slate-800">

                            {formatCurrency(
                              sale
                            )}

                          </span>


                          <span className="text-xs text-slate-400 ml-2">

                            {item.orders} orders

                          </span>

                        </div>

                      </div>


                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">

                        <div
                          className="h-full bg-teal-600 rounded-full transition-all"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />

                      </div>

                    </div>

                  );

                }
              )}

            </div>

          )}

        </div>


        {/* ==================================================
            TOP PRODUCTS + TOP CUSTOMERS
        ================================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">


          {/* ==================================================
              TOP PRODUCTS
          ================================================== */}

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">


            <div className="p-6 border-b border-slate-100">

              <h2 className="text-lg font-semibold text-slate-800">

                Top Products

              </h2>


              <p className="text-sm text-slate-500 mt-1">

                Most ordered products

              </p>

            </div>


            {topProducts.length === 0 ? (

              <div className="p-8 text-center text-slate-400">

                No product data available.

              </div>

            ) : (

              <div className="divide-y divide-slate-100">

                {topProducts.map(
                  (product, index) => (

                    <div
                      key={
                        product._id ||
                        index
                      }
                      className="p-4 flex items-center justify-between gap-4"
                    >

                      <div className="flex items-center gap-3 min-w-0">

                        <div className="w-8 h-8 bg-teal-50 text-teal-700 rounded-lg flex items-center justify-center font-semibold text-sm shrink-0">

                          {index + 1}

                        </div>


                        <div className="min-w-0">

                          <p className="font-medium text-slate-800 truncate">

                            {product.name ||
                              'Unknown Product'}

                          </p>


                          <p className="text-xs text-slate-500">

                            {formatNumber(
                              product.quantity
                            )}{' '}

                            units sold

                          </p>

                        </div>

                      </div>


                      <div className="text-right shrink-0">

                        <p className="font-semibold text-slate-800">

                          {formatCurrency(
                            product.revenue
                          )}

                        </p>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </div>


          {/* ==================================================
              TOP CUSTOMERS
          ================================================== */}

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">


            <div className="p-6 border-b border-slate-100">

              <h2 className="text-lg font-semibold text-slate-800">

                Top Customers

              </h2>


              <p className="text-sm text-slate-500 mt-1">

                Highest spending customers

              </p>

            </div>


            {topCustomers.length === 0 ? (

              <div className="p-8 text-center text-slate-400">

                No customer data available.

              </div>

            ) : (

              <div className="divide-y divide-slate-100">

                {topCustomers.map(
                  (customer, index) => (

                    <div
                      key={
                        customer._id ||
                        index
                      }
                      className="p-4 flex items-center justify-between gap-4"
                    >

                      <div className="flex items-center gap-3 min-w-0">

                        <div className="w-8 h-8 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center font-semibold text-sm shrink-0">

                          {index + 1}

                        </div>


                        <div className="min-w-0">

                          <p className="font-medium text-slate-800 truncate">

                            {customer.businessName ||
                              customer.name ||
                              'Customer'}

                          </p>


                          <p className="text-xs text-slate-500 truncate">

                            {customer.email ||
                              'No email'}

                          </p>


                          <p className="text-xs text-slate-400 mt-1">

                            {customer.orders}{' '}

                            orders

                          </p>

                        </div>

                      </div>


                      <div className="text-right shrink-0">

                        <p className="font-semibold text-slate-800">

                          {formatCurrency(
                            customer.totalSpent
                          )}

                        </p>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </div>

        </div>


        {/* ==================================================
            CATEGORY + PAYMENT + PROFIT
        ================================================== */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">


          {/* ==================================================
              MOST ORDERED CATEGORY
          ================================================== */}

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">


            <p className="text-sm text-slate-500">

              Most Ordered Category

            </p>


            {mostOrderedCategory ? (

              <>

                <h3 className="text-2xl font-bold text-slate-800 mt-3">

                  {mostOrderedCategory._id}

                </h3>


                <p className="text-sm text-slate-500 mt-2">

                  {formatNumber(
                    mostOrderedCategory.quantity
                  )}{' '}

                  units ordered

                </p>


                <p className="text-sm font-medium text-teal-700 mt-3">

                  {formatCurrency(
                    mostOrderedCategory.revenue
                  )}{' '}

                  revenue

                </p>

              </>

            ) : (

              <p className="text-slate-400 mt-4">

                No category data available.

              </p>

            )}

          </div>


          {/* ==================================================
              PENDING PAYMENTS
          ================================================== */}

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">


            <p className="text-sm text-slate-500">

              Pending Payments

            </p>


            <h3 className="text-2xl font-bold text-slate-800 mt-3">

              {formatCurrency(
                pendingPayments.amount
              )}

            </h3>


            <p className="text-sm text-slate-500 mt-2">

              {formatNumber(
                pendingPayments.count
              )}{' '}

              unpaid orders

            </p>

          </div>


          {/* ==================================================
              PROFIT / MARGIN
          ================================================== */}

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">


            <p className="text-sm text-slate-500">

              Profit / Margin

            </p>


            <h3 className="text-2xl font-bold text-slate-800 mt-3">

              {formatCurrency(
                profit.grossProfit
              )}

            </h3>


            <div className="mt-3 flex items-center justify-between text-sm">

              <span className="text-slate-500">

                Margin

              </span>


              <span className="font-semibold text-teal-700">

                {Number(
                  profit.profitMargin || 0
                ).toFixed(2)}%

              </span>

            </div>


            <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden">

              <div
                className="h-full bg-teal-600 rounded-full"
                style={{
                  width: `${Math.min(
                    Math.max(
                      Number(
                        profit.profitMargin || 0
                      ),
                      0
                    ),
                    100
                  )}%`,
                }}
              />

            </div>

          </div>

        </div>


        {/* ==================================================
            RETURNED PRODUCTS
        ================================================== */}

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-8">


          <div className="p-6 border-b border-slate-100">

            <h2 className="text-lg font-semibold text-slate-800">

              Returned Products

            </h2>


            <p className="text-sm text-slate-500 mt-1">

              Products with the highest return quantity

            </p>

          </div>


          {returnedProducts.length === 0 ? (

            <div className="p-8 text-center text-slate-400">

              No returned products found.

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                <thead className="bg-slate-50">

                  <tr>

                    <th className="text-left px-6 py-3 font-semibold text-slate-600">

                      Product

                    </th>


                    <th className="text-right px-6 py-3 font-semibold text-slate-600">

                      Returned Qty

                    </th>


                    <th className="text-right px-6 py-3 font-semibold text-slate-600">

                      Refund Value

                    </th>

                  </tr>

                </thead>


                <tbody>

                  {returnedProducts.map(
                    (product, index) => (

                      <tr
                        key={
                          product._id ||
                          index
                        }
                        className="border-t border-slate-100"
                      >

                        <td className="px-6 py-4 font-medium text-slate-800">

                          {product.name ||
                            'Unknown Product'}

                        </td>


                        <td className="px-6 py-4 text-right text-slate-600">

                          {formatNumber(
                            product.quantity
                          )}

                        </td>


                        <td className="px-6 py-4 text-right font-medium text-slate-800">

                          {formatCurrency(
                            product.refundValue
                          )}

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>


        {/* ==================================================
            CATEGORY BREAKDOWN
        ================================================== */}

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">


          <div className="p-6 border-b border-slate-100">

            <h2 className="text-lg font-semibold text-slate-800">

              Category Performance

            </h2>


            <p className="text-sm text-slate-500 mt-1">

              Ordered quantity and revenue by category

            </p>

          </div>


          {categorySales.length === 0 ? (

            <div className="p-8 text-center text-slate-400">

              No category data available.

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                <thead className="bg-slate-50">

                  <tr>

                    <th className="text-left px-6 py-3 font-semibold text-slate-600">

                      Category

                    </th>


                    <th className="text-right px-6 py-3 font-semibold text-slate-600">

                      Quantity

                    </th>


                    <th className="text-right px-6 py-3 font-semibold text-slate-600">

                      Revenue

                    </th>

                  </tr>

                </thead>


                <tbody>

                  {categorySales.map(
                    (category, index) => (

                      <tr
                        key={
                          category._id ||
                          index
                        }
                        className="border-t border-slate-100"
                      >

                        <td className="px-6 py-4 font-medium text-slate-800">

                          {category._id ||
                            'Unknown'}

                        </td>


                        <td className="px-6 py-4 text-right text-slate-600">

                          {formatNumber(
                            category.quantity
                          )}

                        </td>


                        <td className="px-6 py-4 text-right font-semibold text-slate-800">

                          {formatCurrency(
                            category.revenue
                          )}

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </div>

  );

};


export default ReportsAnalytics;