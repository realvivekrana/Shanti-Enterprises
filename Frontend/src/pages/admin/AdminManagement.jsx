import {
  useEffect,
  useState,
} from 'react';

import {
  Link,
} from 'react-router-dom';

import API from '../../api/axios';


// ======================================================
// ADMIN MANAGEMENT
// ======================================================

const AdminManagement = () => {

  // ====================================================
  // ACTIVE SECTION
  // ====================================================

  const [
    activeSection,
    setActiveSection,
  ] = useState('orders');


  // ====================================================
  // DATA
  // ====================================================

  const [
    orders,
    setOrders,
  ] = useState([]);

  const [
    customers,
    setCustomers,
  ] = useState([]);

  const [
    products,
    setProducts,
  ] = useState([]);

  const [
    rfqs,
    setRfqs,
  ] = useState([]);

  const [
    returns,
    setReturns,
  ] = useState([]);

  const [
    lowStock,
    setLowStock,
  ] = useState([]);


  // ====================================================
  // UI STATE
  // ====================================================

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState('');

  const [
    success,
    setSuccess,
  ] = useState('');


  // ====================================================
  // LOAD DATA
  // ====================================================

  useEffect(() => {

    loadSection();

  }, [activeSection]);


  // ====================================================
  // LOAD CURRENT SECTION
  // ====================================================

  const loadSection = async () => {

    setLoading(true);
    setError('');
    setSuccess('');

    try {

      // ==================================================
      // ORDERS
      // ==================================================

      if (activeSection === 'orders') {

        const response =
          await API.get('/orders');

        const data =
          response.data;

        setOrders(
          data?.orders ||
          data ||
          []
        );

      }


      // ==================================================
      // CUSTOMERS
      // ==================================================

      if (activeSection === 'customers') {

        const response =
          await API.get('/users');

        const data =
          response.data;

        setCustomers(
          data?.users ||
          data ||
          []
        );

      }


      // ==================================================
      // PRODUCTS
      // ==================================================

      if (activeSection === 'products') {

        const response =
          await API.get('/products');

        const data =
          response.data;

        setProducts(
          data?.products ||
          data ||
          []
        );

      }


      // ==================================================
      // RFQS
      // ==================================================

      if (activeSection === 'rfqs') {

        const response =
          await API.get('/rfqs');

        const data =
          response.data;

        setRfqs(
          data?.rfqs ||
          data ||
          []
        );

      }


      // ==================================================
      // RETURNS
      // ==================================================

      if (activeSection === 'returns') {

        const response =
          await API.get('/returns');

        const data =
          response.data;

        setReturns(
          data?.returns ||
          data ||
          []
        );

      }


      // ==================================================
      // INVENTORY
      // ==================================================

      if (activeSection === 'inventory') {

        const response =
          await API.get(
            '/inventory/low-stock'
          );

        const data =
          response.data;

        setLowStock(
          data?.products ||
          data ||
          []
        );

      }

    } catch (err) {

      console.error(
        'Admin Management Error:',
        err
      );

      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to load data'
      );

    } finally {

      setLoading(false);

    }

  };


  // ====================================================
  // UPDATE ORDER STATUS
  // ====================================================

  const updateOrderStatus = async (
    orderId,
    status
  ) => {

    try {

      setError('');
      setSuccess('');

      await API.put(
        `/orders/${orderId}/status`,
        {
          status,
        }
      );

      setSuccess(
        'Order status updated successfully.'
      );

      await loadSection();

    } catch (err) {

      setError(
        err.response?.data?.message ||
        'Failed to update order status.'
      );

    }

  };


  // ====================================================
  // UPDATE USER STATUS
  // ====================================================

  const updateCustomerStatus = async (
    userId,
    status
  ) => {

    try {

      setError('');
      setSuccess('');

      await API.patch(
        `/users/${userId}/status`,
        {
          status,
        }
      );

      setSuccess(
        'Customer status updated successfully.'
      );

      await loadSection();

    } catch (err) {

      setError(
        err.response?.data?.message ||
        'Failed to update customer status.'
      );

    }

  };


  // ====================================================
  // QUOTE RFQ
  // ====================================================

  const quoteRFQ = async (
    rfqId
  ) => {

    const quotedPrice =
      window.prompt(
        'Enter supplier quoted price per piece:'
      );

    if (!quotedPrice) {
      return;
    }

    const numericPrice =
      Number(quotedPrice);

    if (
      !Number.isFinite(
        numericPrice
      ) ||
      numericPrice <= 0
    ) {

      setError(
        'Please enter a valid quotation price.'
      );

      return;

    }

    try {

      setError('');
      setSuccess('');

      await API.put(
        `/rfqs/${rfqId}/quote`,
        {
          quotedPrice:
            numericPrice,
        }
      );

      setSuccess(
        'Quotation sent successfully.'
      );

      await loadSection();

    } catch (err) {

      setError(
        err.response?.data?.message ||
        'Failed to send quotation.'
      );

    }

  };


  // ====================================================
  // FORMAT CURRENCY
  // ====================================================

  const currency = (
    value
  ) => {

    return `₹${Number(
      value || 0
    ).toLocaleString('en-IN')}`;

  };


  // ====================================================
  // FORMAT DATE
  // ====================================================

  const formatDate = (
    value
  ) => {

    if (!value) {
      return '—';
    }

    return new Date(
      value
    ).toLocaleDateString(
      'en-IN'
    );

  };


  // ====================================================
  // SIDEBAR
  // ====================================================

  const sections = [

    {
      key: 'orders',
      label: 'Orders',
      icon: '📦',
    },

    {
      key: 'customers',
      label: 'Customers',
      icon: '👥',
    },

    {
      key: 'products',
      label: 'Products',
      icon: '🛍️',
    },

    {
      key: 'rfqs',
      label: 'RFQs',
      icon: '📝',
    },

    {
      key: 'returns',
      label: 'Returns',
      icon: '🔄',
    },

    {
      key: 'inventory',
      label: 'Inventory',
      icon: '📊',
    },

  ];


  // ====================================================
  // RENDER
  // ====================================================

  return (

    <div className="min-h-screen bg-slate-50">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="bg-slate-900 text-white">

        <div className="max-w-7xl mx-auto px-4 py-5">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div>

              <p className="text-xs uppercase tracking-wider text-teal-300 font-semibold">
                Admin Panel
              </p>

              <h1 className="text-2xl font-bold">
                Store Management
              </h1>

            </div>

            <Link
              to="/admin/dashboard"
              className="inline-flex items-center justify-center bg-teal-500 hover:bg-teal-400 px-4 py-2 rounded-lg font-medium"
            >
              ← Dashboard
            </Link>

          </div>

        </div>

      </div>


      {/* ==================================================
          MAIN
      ================================================== */}

      <div className="max-w-7xl mx-auto px-4 py-6">

        <div className="grid lg:grid-cols-[230px_1fr] gap-6">

          {/* ==================================================
              SIDEBAR
          ================================================== */}

          <aside className="bg-white border border-slate-200 rounded-xl p-3 h-fit">

            <p className="text-xs font-semibold text-slate-400 uppercase px-3 py-2">
              Manage Store
            </p>

            <div className="space-y-1">

              {sections.map(
                (section) => (

                  <button
                    key={section.key}
                    type="button"
                    onClick={() =>
                      setActiveSection(
                        section.key
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
                      text-left
                      transition
                      ${
                        activeSection ===
                        section.key
                          ? 'bg-teal-50 text-teal-700 font-semibold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }
                    `}
                  >

                    <span>
                      {section.icon}
                    </span>

                    <span>
                      {section.label}
                    </span>

                  </button>

                )
              )}

            </div>

          </aside>


          {/* ==================================================
              CONTENT
          ================================================== */}

          <section>

            {/* ==================================================
                ALERTS
            ================================================== */}

            {error && (

              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">

                {error}

              </div>

            )}


            {success && (

              <div className="mb-4 bg-green-50 border border-green-200 text-green-700 rounded-xl p-4">

                {success}

              </div>

            )}


            {/* ==================================================
                LOADING
            ================================================== */}

            {loading ? (

              <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">

                <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto" />

                <p className="mt-4 text-slate-500">
                  Loading...
                </p>

              </div>

            ) : (

              <>

                {/* ==================================================
                    ORDERS
                ================================================== */}

                {activeSection ===
                  'orders' && (

                  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">

                    <div className="p-5 border-b border-slate-200">

                      <h2 className="text-xl font-bold text-slate-900">
                        Orders
                      </h2>

                      <p className="text-sm text-slate-500 mt-1">
                        Customer orders from MongoDB
                      </p>

                    </div>

                    <div className="overflow-x-auto">

                      <table className="w-full text-sm">

                        <thead className="bg-slate-50">

                          <tr>

                            <th className="text-left px-5 py-3">
                              Order
                            </th>

                            <th className="text-left px-5 py-3">
                              Customer
                            </th>

                            <th className="text-left px-5 py-3">
                              Amount
                            </th>

                            <th className="text-left px-5 py-3">
                              Payment
                            </th>

                            <th className="text-left px-5 py-3">
                              Status
                            </th>

                            <th className="text-left px-5 py-3">
                              Date
                            </th>

                          </tr>

                        </thead>

                        <tbody>

                          {orders.length === 0 ? (

                            <tr>

                              <td
                                colSpan="6"
                                className="px-5 py-10 text-center text-slate-500"
                              >
                                No orders found.
                              </td>

                            </tr>

                          ) : (

                            orders.map(
                              (order) => (

                                <tr
                                  key={
                                    order._id
                                  }
                                  className="border-t border-slate-100"
                                >

                                  <td className="px-5 py-4 font-medium">

                                    #
                                    {String(
                                      order._id
                                    ).slice(
                                      -8
                                    )}

                                  </td>

                                  <td className="px-5 py-4">

                                    {order.user?.name ||
                                      order.user?.email ||
                                      'Customer'}

                                  </td>

                                  <td className="px-5 py-4 font-semibold">

                                    {currency(
                                      order.totalPrice
                                    )}

                                  </td>

                                  <td className="px-5 py-4">

                                    {order.paymentMethod ||
                                      '—'}

                                  </td>

                                  <td className="px-5 py-4">

                                    <select
                                      value={
                                        order.orderStatus ||
                                        'Placed'
                                      }
                                      onChange={(
                                        e
                                      ) =>
                                        updateOrderStatus(
                                          order._id,
                                          e.target.value
                                        )
                                      }
                                      className="border border-slate-300 rounded-lg px-2 py-1.5 text-xs"
                                    >

                                      <option value="Placed">
                                        Placed
                                      </option>

                                      <option value="Confirmed">
                                        Confirmed
                                      </option>

                                      <option value="Processing">
                                        Processing
                                      </option>

                                      <option value="Packed">
                                        Packed
                                      </option>

                                      <option value="Shipped">
                                        Shipped
                                      </option>

                                      <option value="Out for Delivery">
                                        Out for Delivery
                                      </option>

                                      <option value="Delivered">
                                        Delivered
                                      </option>

                                      <option value="Cancelled">
                                        Cancelled
                                      </option>

                                    </select>

                                  </td>

                                  <td className="px-5 py-4 text-slate-500">

                                    {formatDate(
                                      order.createdAt
                                    )}

                                  </td>

                                </tr>

                              )
                            )

                          )}

                        </tbody>

                      </table>

                    </div>

                  </div>

                )}


                {/* ==================================================
                    CUSTOMERS
                ================================================== */}

                {activeSection ===
                  'customers' && (

                  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">

                    <div className="p-5 border-b border-slate-200">

                      <h2 className="text-xl font-bold">
                        Customers
                      </h2>

                      <p className="text-sm text-slate-500 mt-1">
                        Manage registered customer accounts
                      </p>

                    </div>

                    <div className="overflow-x-auto">

                      <table className="w-full text-sm">

                        <thead className="bg-slate-50">

                          <tr>

                            <th className="text-left px-5 py-3">
                              Name
                            </th>

                            <th className="text-left px-5 py-3">
                              Email
                            </th>

                            <th className="text-left px-5 py-3">
                              Business
                            </th>

                            <th className="text-left px-5 py-3">
                              Role
                            </th>

                            <th className="text-left px-5 py-3">
                              Status
                            </th>

                          </tr>

                        </thead>

                        <tbody>

                          {customers.map(
                            (customer) => (

                              <tr
                                key={
                                  customer._id
                                }
                                className="border-t border-slate-100"
                              >

                                <td className="px-5 py-4 font-medium">
                                  {customer.name}
                                </td>

                                <td className="px-5 py-4">
                                  {customer.email}
                                </td>

                                <td className="px-5 py-4">
                                  {customer.businessName ||
                                    '—'}
                                </td>

                                <td className="px-5 py-4">
                                  {customer.role}
                                </td>

                                <td className="px-5 py-4">

                                  <select
                                    value={
                                      customer.status ||
                                      'active'
                                    }
                                    onChange={(
                                      e
                                    ) =>
                                      updateCustomerStatus(
                                        customer._id,
                                        e.target.value
                                      )
                                    }
                                    className="border border-slate-300 rounded-lg px-2 py-1.5 text-xs"
                                  >

                                    <option value="active">
                                      Active
                                    </option>

                                    <option value="inactive">
                                      Inactive
                                    </option>

                                    <option value="suspended">
                                      Suspended
                                    </option>

                                    <option value="pending">
                                      Pending
                                    </option>

                                  </select>

                                </td>

                              </tr>

                            )
                          )}

                        </tbody>

                      </table>

                    </div>

                  </div>

                )}


                {/* ==================================================
                    PRODUCTS
                ================================================== */}

                {activeSection ===
                  'products' && (

                  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">

                    <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                      <div>

                        <h2 className="text-xl font-bold">
                          Products
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                          Product catalog
                        </p>

                      </div>

                      <Link
                        to="/admin/products/new"
                        className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
                      >
                        + Add Product
                      </Link>

                    </div>

                    <div className="overflow-x-auto">

                      <table className="w-full text-sm">

                        <thead className="bg-slate-50">

                          <tr>

                            <th className="text-left px-5 py-3">
                              Product
                            </th>

                            <th className="text-left px-5 py-3">
                              Category
                            </th>

                            <th className="text-left px-5 py-3">
                              Price
                            </th>

                            <th className="text-left px-5 py-3">
                              Stock
                            </th>

                            <th className="text-left px-5 py-3">
                              Action
                            </th>

                          </tr>

                        </thead>

                        <tbody>

                          {products.map(
                            (product) => (

                              <tr
                                key={
                                  product._id
                                }
                                className="border-t border-slate-100"
                              >

                                <td className="px-5 py-4 font-medium">
                                  {product.name}
                                </td>

                                <td className="px-5 py-4">
                                  {product.category ||
                                    '—'}
                                </td>

                                <td className="px-5 py-4 font-semibold">
                                  {currency(
                                    product.price
                                  )}
                                </td>

                                <td className="px-5 py-4">
                                  {product.stock ?? 0}
                                </td>

                                <td className="px-5 py-4">

                                  <Link
                                    to={`/admin/products/${product._id}/edit`}
                                    className="text-teal-700 font-medium hover:underline"
                                  >
                                    Edit
                                  </Link>

                                </td>

                              </tr>

                            )
                          )}

                        </tbody>

                      </table>

                    </div>

                  </div>

                )}


                {/* ==================================================
                    RFQS
                ================================================== */}

                {activeSection ===
                  'rfqs' && (

                  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">

                    <div className="p-5 border-b border-slate-200">

                      <h2 className="text-xl font-bold">
                        RFQs
                      </h2>

                      <p className="text-sm text-slate-500 mt-1">
                        Customer quotation requests
                      </p>

                    </div>

                    <div className="overflow-x-auto">

                      <table className="w-full text-sm">

                        <thead className="bg-slate-50">

                          <tr>

                            <th className="text-left px-5 py-3">
                              Customer
                            </th>

                            <th className="text-left px-5 py-3">
                              Product
                            </th>

                            <th className="text-left px-5 py-3">
                              Quantity
                            </th>

                            <th className="text-left px-5 py-3">
                              Target Price
                            </th>

                            <th className="text-left px-5 py-3">
                              Status
                            </th>

                            <th className="text-left px-5 py-3">
                              Action
                            </th>

                          </tr>

                        </thead>

                        <tbody>

                          {rfqs.length === 0 ? (

                            <tr>

                              <td
                                colSpan="6"
                                className="px-5 py-10 text-center text-slate-500"
                              >
                                No RFQs found.
                              </td>

                            </tr>

                          ) : (

                            rfqs.map(
                              (rfq) => (

                                <tr
                                  key={
                                    rfq._id
                                  }
                                  className="border-t border-slate-100"
                                >

                                  <td className="px-5 py-4">
                                    {rfq.user?.name ||
                                      rfq.user?.email ||
                                      'Customer'}
                                  </td>

                                  <td className="px-5 py-4">
                                    {rfq.product?.name ||
                                      rfq.productName ||
                                      '—'}
                                  </td>

                                  <td className="px-5 py-4">
                                    {rfq.quantity ||
                                      '—'}
                                  </td>

                                  <td className="px-5 py-4">
                                    {currency(
                                      rfq.targetPrice
                                    )}
                                  </td>

                                  <td className="px-5 py-4">
                                    {rfq.status ||
                                      'Pending'}
                                  </td>

                                  <td className="px-5 py-4">

                                    <button
                                      type="button"
                                      onClick={() =>
                                        quoteRFQ(
                                          rfq._id
                                        )
                                      }
                                      className="bg-teal-600 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-teal-700"
                                    >
                                      Send Quote
                                    </button>

                                  </td>

                                </tr>

                              )
                            )

                          )}

                        </tbody>

                      </table>

                    </div>

                  </div>

                )}


                {/* ==================================================
                    RETURNS
                ================================================== */}

                {activeSection ===
                  'returns' && (

                  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">

                    <div className="p-5 border-b border-slate-200">

                      <h2 className="text-xl font-bold">
                        Returns & Refunds
                      </h2>

                      <p className="text-sm text-slate-500 mt-1">
                        Customer return requests
                      </p>

                    </div>

                    <div className="overflow-x-auto">

                      <table className="w-full text-sm">

                        <thead className="bg-slate-50">

                          <tr>

                            <th className="text-left px-5 py-3">
                              Order
                            </th>

                            <th className="text-left px-5 py-3">
                              Customer
                            </th>

                            <th className="text-left px-5 py-3">
                              Reason
                            </th>

                            <th className="text-left px-5 py-3">
                              Status
                            </th>

                            <th className="text-left px-5 py-3">
                              Date
                            </th>

                          </tr>

                        </thead>

                        <tbody>

                          {returns.length === 0 ? (

                            <tr>

                              <td
                                colSpan="5"
                                className="px-5 py-10 text-center text-slate-500"
                              >
                                No return requests found.
                              </td>

                            </tr>

                          ) : (

                            returns.map(
                              (item) => (

                                <tr
                                  key={
                                    item._id
                                  }
                                  className="border-t border-slate-100"
                                >

                                  <td className="px-5 py-4 font-medium">
                                    {item.order?._id
                                      ? String(
                                          item.order._id
                                        ).slice(
                                          -8
                                        )
                                      : '—'}
                                  </td>

                                  <td className="px-5 py-4">
                                    {item.user?.name ||
                                      item.user?.email ||
                                      'Customer'}
                                  </td>

                                  <td className="px-5 py-4">
                                    {item.reason ||
                                      '—'}
                                  </td>

                                  <td className="px-5 py-4">
                                    {item.status ||
                                      '—'}
                                  </td>

                                  <td className="px-5 py-4">
                                    {formatDate(
                                      item.createdAt
                                    )}
                                  </td>

                                </tr>

                              )
                            )

                          )}

                        </tbody>

                      </table>

                    </div>

                  </div>

                )}


                {/* ==================================================
                    INVENTORY
                ================================================== */}

                {activeSection ===
                  'inventory' && (

                  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">

                    <div className="p-5 border-b border-slate-200">

                      <h2 className="text-xl font-bold">
                        Low Stock Inventory
                      </h2>

                      <p className="text-sm text-slate-500 mt-1">
                        Products that need restocking
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
                              SKU
                            </th>

                            <th className="text-left px-5 py-3">
                              Stock
                            </th>

                            <th className="text-left px-5 py-3">
                              Action
                            </th>

                          </tr>

                        </thead>

                        <tbody>

                          {lowStock.length === 0 ? (

                            <tr>

                              <td
                                colSpan="4"
                                className="px-5 py-10 text-center text-slate-500"
                              >
                                No low-stock products.
                              </td>

                            </tr>

                          ) : (

                            lowStock.map(
                              (product) => (

                                <tr
                                  key={
                                    product._id
                                  }
                                  className="border-t border-slate-100"
                                >

                                  <td className="px-5 py-4 font-medium">
                                    {product.name}
                                  </td>

                                  <td className="px-5 py-4">
                                    {product.sku ||
                                      '—'}
                                  </td>

                                  <td className="px-5 py-4 text-red-600 font-semibold">
                                    {product.stock ??
                                      0}
                                  </td>

                                  <td className="px-5 py-4">

                                    <Link
                                      to={`/admin/products/${product._id}/edit`}
                                      className="text-teal-700 font-medium hover:underline"
                                    >
                                      Manage
                                    </Link>

                                  </td>

                                </tr>

                              )
                            )

                          )}

                        </tbody>

                      </table>

                    </div>

                  </div>

                )}

              </>

            )}

          </section>

        </div>

      </div>

    </div>

  );

};

export default AdminManagement;