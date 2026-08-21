import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  FaBars,
  FaBox,
  FaBoxes,
  FaChartLine,
  FaChevronRight,
  FaClipboardList,
  FaClock,
  FaCubes,
  FaExclamationTriangle,
  FaFileInvoiceDollar,
  FaHome,
  FaMoneyBillWave,
  FaPercent,
  FaRedo,
  FaSearch,
  FaShippingFast,
  FaSignOutAlt,
  FaStore,
  FaTimes,
  FaTruck,
  FaUserFriends,
  FaUsers,
} from 'react-icons/fa';

import { toast } from 'react-toastify';

import { useAuth } from '../../context/AuthContext';

import API from '../../utils/axios';


// ======================================================
// FORMAT CURRENCY
// ======================================================

const formatCurrency = (value) => {
  return `₹${Number(value || 0).toLocaleString('en-IN', {
    maximumFractionDigits: 2,
  })}`;
};


// ======================================================
// FORMAT DATE
// ======================================================

const formatDate = (value) => {
  if (!value) {
    return '—';
  }

  try {
    return new Date(value).toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }
    );
  } catch {
    return '—';
  }
};


// ======================================================
// FORMAT DATE TIME
// ======================================================

const formatDateTime = (value) => {
  if (!value) {
    return '—';
  }

  try {
    return new Date(value).toLocaleString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }
    );
  } catch {
    return '—';
  }
};


// ======================================================
// GET CUSTOMER NAME
// ======================================================

const getCustomerName = (order) => {
  return (
    order?.user?.name ||
    order?.user?.businessName ||
    order?.customer?.name ||
    order?.customerName ||
    'Guest Customer'
  );
};


// ======================================================
// GET ORDER TOTAL
// ======================================================

const getOrderTotal = (order) => {
  return Number(
    order?.totalPrice ||
    order?.totalAmount ||
    order?.amount ||
    0
  );
};


// ======================================================
// GET ORDER STATUS
// ======================================================

const getOrderStatus = (order) => {
  return (
    order?.orderStatus ||
    order?.status ||
    'Pending'
  );
};


// ======================================================
// STATUS STYLE
// ======================================================

const getStatusClasses = (status) => {
  const normalized =
    String(status || '')
      .toLowerCase();

  if (
    normalized === 'delivered' ||
    normalized === 'completed' ||
    normalized === 'paid'
  ) {
    return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20';
  }

  if (
    normalized === 'cancelled' ||
    normalized === 'canceled' ||
    normalized === 'failed'
  ) {
    return 'bg-red-50 text-red-700 ring-red-600/20';
  }

  if (
    normalized === 'shipped'
  ) {
    return 'bg-blue-50 text-blue-700 ring-blue-600/20';
  }

  if (
    normalized === 'processing' ||
    normalized === 'packed'
  ) {
    return 'bg-amber-50 text-amber-700 ring-amber-600/20';
  }

  return 'bg-slate-100 text-slate-700 ring-slate-600/20';
};


// ======================================================
// STAT CARD
// ======================================================

const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  iconClass,
}) => {
  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
        transition
        duration-200
        hover:-translate-y-0.5
        hover:shadow-md
      "
    >
      <div className="flex items-start justify-between gap-4">

        <div className="min-w-0">

          <p
            className="
              text-sm
              font-medium
              text-slate-500
            "
          >
            {title}
          </p>

          <p
            className="
              mt-2
              truncate
              text-2xl
              font-bold
              tracking-tight
              text-slate-900
              sm:text-3xl
            "
          >
            {value}
          </p>

          {subtitle && (
            <p
              className="
                mt-2
                text-xs
                text-slate-500
              "
            >
              {subtitle}
            </p>
          )}

        </div>


        <div
          className={`
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-xl
            ${iconClass}
          `}
        >
          {icon}
        </div>

      </div>
    </div>
  );
};


// ======================================================
// SECTION HEADER
// ======================================================

const SectionHeader = ({
  title,
  subtitle,
  action,
}) => {
  return (
    <div
      className="
        mb-5
        flex
        flex-col
        gap-3
        sm:flex-row
        sm:items-center
        sm:justify-between
      "
    >

      <div>

        <h2
          className="
            text-lg
            font-bold
            text-slate-900
            sm:text-xl
          "
        >
          {title}
        </h2>

        {subtitle && (
          <p
            className="
              mt-1
              text-sm
              text-slate-500
            "
          >
            {subtitle}
          </p>
        )}

      </div>

      {action}

    </div>
  );
};


// ======================================================
// EMPTY STATE
// ======================================================

const EmptyState = ({
  icon,
  title,
  description,
}) => {
  return (
    <div
      className="
        flex
        min-h-[180px]
        flex-col
        items-center
        justify-center
        rounded-xl
        border
        border-dashed
        border-slate-200
        px-5
        text-center
      "
    >

      <div
        className="
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-full
          bg-slate-100
          text-slate-400
        "
      >
        {icon}
      </div>

      <h3
        className="
          mt-4
          text-sm
          font-semibold
          text-slate-800
        "
      >
        {title}
      </h3>

      <p
        className="
          mt-1
          max-w-sm
          text-xs
          leading-5
          text-slate-500
        "
      >
        {description}
      </p>

    </div>
  );
};


// ======================================================
// LOADING BLOCK
// ======================================================

const LoadingBlock = () => {
  return (
    <div
      className="
        animate-pulse
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-6
      "
    >
      <div className="h-4 w-32 rounded bg-slate-200" />

      <div className="mt-4 h-8 w-24 rounded bg-slate-200" />

      <div className="mt-3 h-3 w-44 rounded bg-slate-200" />
    </div>
  );
};


// ======================================================
// ADMIN DASHBOARD
// ======================================================

function AdminDashboard() {

  const {
    admin,
    logout,
  } = useAuth();


  // ====================================================
  // STATE
  // ====================================================

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


  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false);


  const [
    search,
    setSearch,
  ] = useState('');


  // ====================================================
  // FETCH DASHBOARD
  // ====================================================

  const fetchDashboard =
    async () => {

      try {

        setLoading(true);

        setError('');


        const response =
          await API.get(
            '/admin-dashboard'
          );


        const responseData =
          response?.data;


        const data =
          responseData?.data ||
          responseData;


        setDashboard(
          data
        );

      } catch (requestError) {

        console.error(
          'Admin dashboard fetch error:',
          requestError
        );


        const message =
          requestError?.response?.data?.message ||
          'Unable to load admin dashboard';


        setError(
          message
        );


        toast.error(
          message
        );

      } finally {

        setLoading(false);

      }

    };


  // ====================================================
  // INITIAL LOAD
  // ====================================================

  useEffect(() => {

    fetchDashboard();

  }, []);


  // ====================================================
  // DATA
  // ====================================================

  const summary =
    dashboard?.summary || {};


  const orders =
    dashboard?.orders || {};


  const recentOrders =
    Array.isArray(
      dashboard?.recentOrders
    )
      ? dashboard.recentOrders
      : [];


  const topProducts =
    Array.isArray(
      dashboard?.topProducts
    )
      ? dashboard.topProducts
      : [];


  const lowStockProducts =
    Array.isArray(
      dashboard?.lowStockProducts
    )
      ? dashboard.lowStockProducts
      : [];


  const recentCustomers =
    Array.isArray(
      dashboard?.recentCustomers
    )
      ? dashboard.recentCustomers
      : [];


  // ====================================================
  // FILTER ORDERS
  // ====================================================

  const filteredOrders =
    useMemo(() => {

      if (!search.trim()) {
        return recentOrders;
      }


      const query =
        search
          .trim()
          .toLowerCase();


      return recentOrders.filter(
        (order) => {

          const orderId =
            String(
              order?._id || ''
            ).toLowerCase();


          const customer =
            getCustomerName(
              order
            ).toLowerCase();


          const status =
            getOrderStatus(
              order
            ).toLowerCase();


          return (
            orderId.includes(query) ||
            customer.includes(query) ||
            status.includes(query)
          );

        }
      );

    }, [
      recentOrders,
      search,
    ]);


  // ====================================================
  // LOGOUT
  // ====================================================

  const handleLogout = () => {

    setSidebarOpen(false);

    logout();

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
        "
      >

        <div
          className="
            mx-auto
            max-w-[1600px]
            p-4
            sm:p-6
            lg:p-8
          "
        >

          <div
            className="
              mb-7
              animate-pulse
            "
          >

            <div
              className="
                h-8
                w-64
                rounded
                bg-slate-200
              "
            />

            <div
              className="
                mt-3
                h-4
                w-96
                max-w-full
                rounded
                bg-slate-200
              "
            />

          </div>


          <div
            className="
              grid
              gap-4
              sm:grid-cols-2
              xl:grid-cols-4
            "
          >

            <LoadingBlock />
            <LoadingBlock />
            <LoadingBlock />
            <LoadingBlock />

          </div>

        </div>

      </div>
    );

  }


  // ====================================================
  // ERROR
  // ====================================================

  if (
    error &&
    !dashboard
  ) {

    return (
      <div
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-slate-50
          px-4
        "
      >

        <div
          className="
            w-full
            max-w-md
            rounded-2xl
            border
            border-red-100
            bg-white
            p-7
            text-center
            shadow-sm
          "
        >

          <div
            className="
              mx-auto
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-full
              bg-red-50
              text-red-600
            "
          >
            <FaExclamationTriangle />
          </div>


          <h1
            className="
              mt-5
              text-xl
              font-bold
              text-slate-900
            "
          >
            Dashboard couldn't load
          </h1>


          <p
            className="
              mt-2
              text-sm
              leading-6
              text-slate-500
            "
          >
            {error}
          </p>


          <button
            type="button"
            onClick={fetchDashboard}
            className="
              mt-6
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-teal-600
              px-5
              py-2.5
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-teal-700
            "
          >
            <FaRedo />
            Try Again
          </button>

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
        text-slate-900
      "
    >

      {/* ==================================================
          MOBILE OVERLAY
      =================================================== */}

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() =>
            setSidebarOpen(false)
          }
          className="
            fixed
            inset-0
            z-40
            bg-slate-950/40
            lg:hidden
          "
        />
      )}


      {/* ==================================================
          SIDEBAR
      =================================================== */}

      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          flex
          w-72
          flex-col
          border-r
          border-slate-800
          bg-slate-950
          text-white
          shadow-2xl
          transition-transform
          duration-300
          lg:translate-x-0
          ${
            sidebarOpen
              ? 'translate-x-0'
              : '-translate-x-full'
          }
        `}
      >

        {/* Brand */}

        <div
          className="
            flex
            h-20
            items-center
            justify-between
            border-b
            border-slate-800
            px-6
          "
        >

          <div>

            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-teal-500
                  text-white
                "
              >
                <FaStore />
              </div>


              <div>

                <p
                  className="
                    text-sm
                    font-bold
                  "
                >
                  Shanti Enterprises
                </p>

                <p
                  className="
                    mt-0.5
                    text-[11px]
                    text-slate-400
                  "
                >
                  Admin Panel
                </p>

              </div>

            </div>

          </div>


          <button
            type="button"
            onClick={() =>
              setSidebarOpen(false)
            }
            className="
              rounded-lg
              p-2
              text-slate-400
              hover:bg-slate-800
              hover:text-white
              lg:hidden
            "
          >
            <FaTimes />
          </button>

        </div>


        {/* Admin */}

        <div
          className="
            border-b
            border-slate-800
            p-5
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
              rounded-xl
              bg-slate-900
              p-3
            "
          >

            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-teal-500/15
                font-bold
                text-teal-400
              "
            >
              {(
                admin?.username ||
                admin?.name ||
                'A'
              )
                .charAt(0)
                .toUpperCase()}
            </div>


            <div className="min-w-0">

              <p
                className="
                  truncate
                  text-sm
                  font-semibold
                "
              >
                {admin?.username ||
                  admin?.name ||
                  'Administrator'}
              </p>

              <p
                className="
                  mt-0.5
                  text-xs
                  text-slate-400
                "
              >
                Administrator
              </p>

            </div>

          </div>

        </div>


        {/* Navigation */}

        <nav
          className="
            flex-1
            overflow-y-auto
            px-4
            py-5
          "
        >

          <p
            className="
              px-3
              text-[10px]
              font-bold
              uppercase
              tracking-[0.18em]
              text-slate-500
            "
          >
            Overview
          </p>


          <button
            type="button"
            className="
              mt-3
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              bg-teal-500
              px-4
              py-3
              text-sm
              font-semibold
              text-white
              shadow-lg
              shadow-teal-950/20
            "
          >
            <FaHome />
            Dashboard
          </button>


          <p
            className="
              mt-7
              px-3
              text-[10px]
              font-bold
              uppercase
              tracking-[0.18em]
              text-slate-500
            "
          >
            Store Management
          </p>


          <div className="mt-3 space-y-1">

            <button
              type="button"
              onClick={() =>
                toast.info(
                  'Products section will be connected next.'
                )
              }
              className="
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                px-4
                py-3
                text-sm
                text-slate-300
                transition
                hover:bg-slate-900
                hover:text-white
              "
            >
              <FaBox />
              Products
            </button>


            <Link
              to="/admin/orders"
              onClick={() => setSidebarOpen(false)}
              className="
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                px-4
                py-3
                text-sm
                text-slate-300
                transition
                hover:bg-slate-900
                hover:text-white
              "
            >
              <FaClipboardList />
              Orders
            </Link>


            <button
              type="button"
              onClick={() =>
                toast.info(
                  'Customers section will be connected next.'
                )
              }
              className="
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                px-4
                py-3
                text-sm
                text-slate-300
                transition
                hover:bg-slate-900
                hover:text-white
              "
            >
              <FaUsers />
              Customers
            </button>


            <button
              type="button"
              onClick={() =>
                toast.info(
                  'Inventory section will be connected next.'
                )
              }
              className="
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                px-4
                py-3
                text-sm
                text-slate-300
                transition
                hover:bg-slate-900
                hover:text-white
              "
            >
              <FaBoxes />
              Inventory
            </button>


            <button
              type="button"
              onClick={() =>
                toast.info(
                  'Suppliers section will be connected next.'
                )
              }
              className="
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                px-4
                py-3
                text-sm
                text-slate-300
                transition
                hover:bg-slate-900
                hover:text-white
              "
            >
              <FaUserFriends />
              Suppliers
            </button>

          </div>


          <p
            className="
              mt-7
              px-3
              text-[10px]
              font-bold
              uppercase
              tracking-[0.18em]
              text-slate-500
            "
          >
            Sales & Fulfillment
          </p>


          <div className="mt-3 space-y-1">

            <button
              type="button"
              onClick={() =>
                toast.info(
                  'Quotations / RFQ section will be connected next.'
                )
              }
              className="
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                px-4
                py-3
                text-sm
                text-slate-300
                transition
                hover:bg-slate-900
                hover:text-white
              "
            >
              <FaFileInvoiceDollar />
              Quotations / RFQ
            </button>


            <button
              type="button"
              onClick={() =>
                toast.info(
                  'Invoices section will be connected next.'
                )
              }
              className="
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                px-4
                py-3
                text-sm
                text-slate-300
                transition
                hover:bg-slate-900
                hover:text-white
              "
            >
              <FaFileInvoiceDollar />
              Invoices
            </button>


            <button
              type="button"
              onClick={() =>
                toast.info(
                  'Shipments section will be connected next.'
                )
              }
              className="
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                px-4
                py-3
                text-sm
                text-slate-300
                transition
                hover:bg-slate-900
                hover:text-white
              "
            >
              <FaShippingFast />
              Shipments
            </button>


            <button
              type="button"
              onClick={() =>
                toast.info(
                  'Returns section will be connected next.'
                )
              }
              className="
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                px-4
                py-3
                text-sm
                text-slate-300
                transition
                hover:bg-slate-900
                hover:text-white
              "
            >
              <FaTruck />
              Returns
            </button>

          </div>


          <p
            className="
              mt-7
              px-3
              text-[10px]
              font-bold
              uppercase
              tracking-[0.18em]
              text-slate-500
            "
          >
            Marketing
          </p>


          <button
            type="button"
            onClick={() =>
              toast.info(
                'Coupons section will be connected next.'
              )
            }
            className="
              mt-3
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-4
              py-3
              text-sm
              text-slate-300
              transition
              hover:bg-slate-900
              hover:text-white
            "
          >
            <FaPercent />
            Coupons
          </button>

        </nav>


        {/* Logout */}

        <div
          className="
            border-t
            border-slate-800
            p-4
          "
        >

          <button
            type="button"
            onClick={handleLogout}
            className="
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-4
              py-3
              text-sm
              font-semibold
              text-red-400
              transition
              hover:bg-red-500/10
              hover:text-red-300
            "
          >
            <FaSignOutAlt />
            Logout
          </button>

        </div>

      </aside>


      {/* ==================================================
          MAIN
      =================================================== */}

      <main
        className="
          min-h-screen
          lg:pl-72
        "
      >

        {/* Header */}

        <header
          className="
            sticky
            top-0
            z-30
            border-b
            border-slate-200
            bg-white/95
            backdrop-blur
          "
        >

          <div
            className="
              flex
              min-h-20
              items-center
              justify-between
              gap-4
              px-4
              sm:px-6
              lg:px-8
            "
          >

            <div
              className="
                flex
                min-w-0
                items-center
                gap-3
              "
            >

              <button
                type="button"
                onClick={() =>
                  setSidebarOpen(true)
                }
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  text-slate-600
                  lg:hidden
                "
              >
                <FaBars />
              </button>


              <div className="min-w-0">

                <p
                  className="
                    hidden
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-teal-600
                    sm:block
                  "
                >
                  Admin Panel
                </p>

                <h1
                  className="
                    truncate
                    text-lg
                    font-bold
                    text-slate-900
                    sm:text-xl
                  "
                >
                  Dashboard
                </h1>

              </div>

            </div>


            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              <div
                className="
                  hidden
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  px-3
                  py-2
                  md:flex
                "
              >

                <span
                  className="
                    h-2
                    w-2
                    rounded-full
                    bg-emerald-500
                  "
                />

                <span
                  className="
                    text-xs
                    font-medium
                    text-slate-600
                  "
                >
                  System Online
                </span>

              </div>


              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  bg-teal-100
                  text-sm
                  font-bold
                  text-teal-700
                "
              >
                {(
                  admin?.username ||
                  admin?.name ||
                  'A'
                )
                  .charAt(0)
                  .toUpperCase()}
              </div>

            </div>

          </div>

        </header>


        {/* Content */}

        <div
          className="
            mx-auto
            max-w-[1600px]
            p-4
            sm:p-6
            lg:p-8
          "
        >

          {/* ==================================================
              WELCOME
          =================================================== */}

          <div
            className="
              mb-7
              flex
              flex-col
              gap-4
              lg:flex-row
              lg:items-end
              lg:justify-between
            "
          >

            <div>

              <p
                className="
                  text-sm
                  font-semibold
                  text-teal-600
                "
              >
                Welcome back,
                {' '}
                {admin?.username ||
                  admin?.name ||
                  'Admin'}
              </p>


              <h2
                className="
                  mt-1
                  text-2xl
                  font-extrabold
                  tracking-tight
                  text-slate-900
                  sm:text-3xl
                "
              >
                Store Overview
              </h2>


              <p
                className="
                  mt-2
                  max-w-2xl
                  text-sm
                  leading-6
                  text-slate-500
                "
              >
                Monitor your store's real-time
                sales, orders, customers and
                inventory from one place.
              </p>

            </div>


            <button
              type="button"
              onClick={fetchDashboard}
              className="
                inline-flex
                w-fit
                items-center
                gap-2
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                py-2.5
                text-sm
                font-semibold
                text-slate-700
                shadow-sm
                transition
                hover:bg-slate-50
              "
            >
              <FaRedo />
              Refresh
            </button>

          </div>


          {/* ==================================================
              ERROR BANNER
          =================================================== */}

          {error && dashboard && (
            <div
              className="
                mb-6
                flex
                items-start
                gap-3
                rounded-xl
                border
                border-amber-200
                bg-amber-50
                p-4
                text-amber-800
              "
            >

              <FaExclamationTriangle
                className="
                  mt-0.5
                  shrink-0
                "
              />

              <div>

                <p
                  className="
                    text-sm
                    font-semibold
                  "
                >
                  Dashboard data warning
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                  "
                >
                  {error}
                </p>

              </div>

            </div>
          )}


          {/* ==================================================
              KPI CARDS
          =================================================== */}

          <div
            className="
              grid
              gap-4
              sm:grid-cols-2
              xl:grid-cols-4
            "
          >

            <StatCard
              title="Total Sales"
              value={formatCurrency(
                summary.totalSales
              )}
              subtitle="All non-cancelled orders"
              icon={<FaMoneyBillWave />}
              iconClass="
                bg-emerald-50
                text-emerald-600
              "
            />


            <StatCard
              title="Total Orders"
              value={
                Number(
                  summary.totalOrders || 0
                ).toLocaleString('en-IN')
              }
              subtitle="Orders in your store"
              icon={<FaClipboardList />}
              iconClass="
                bg-blue-50
                text-blue-600
              "
            />


            <StatCard
              title="Customers"
              value={
                Number(
                  summary.totalCustomers || 0
                ).toLocaleString('en-IN')
              }
              subtitle="Registered non-admin users"
              icon={<FaUsers />}
              iconClass="
                bg-violet-50
                text-violet-600
              "
            />


            <StatCard
              title="Products"
              value={
                Number(
                  summary.totalProducts || 0
                ).toLocaleString('en-IN')
              }
              subtitle="Products in catalogue"
              icon={<FaBox />}
              iconClass="
                bg-orange-50
                text-orange-600
              "
            />

          </div>


          {/* ==================================================
              ORDER STATUS
          =================================================== */}

          <div
            className="
              mt-6
              grid
              gap-4
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-6
            "
          >

            <div
              className="
                rounded-xl
                border
                border-slate-200
                bg-white
                p-4
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <div
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-lg
                    bg-amber-50
                    text-amber-600
                  "
                >
                  <FaClock />
                </div>

                <div>

                  <p
                    className="
                      text-xs
                      text-slate-500
                    "
                  >
                    Pending
                  </p>

                  <p
                    className="
                      text-lg
                      font-bold
                      text-slate-900
                    "
                  >
                    {orders.pending || 0}
                  </p>

                </div>

              </div>

            </div>


            <div
              className="
                rounded-xl
                border
                border-slate-200
                bg-white
                p-4
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <div
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-lg
                    bg-blue-50
                    text-blue-600
                  "
                >
                  <FaChartLine />
                </div>

                <div>

                  <p
                    className="
                      text-xs
                      text-slate-500
                    "
                  >
                    Processing
                  </p>

                  <p
                    className="
                      text-lg
                      font-bold
                      text-slate-900
                    "
                  >
                    {orders.processing || 0}
                  </p>

                </div>

              </div>

            </div>


            <div
              className="
                rounded-xl
                border
                border-slate-200
                bg-white
                p-4
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <div
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-lg
                    bg-violet-50
                    text-violet-600
                  "
                >
                  <FaCubes />
                </div>

                <div>

                  <p
                    className="
                      text-xs
                      text-slate-500
                    "
                  >
                    Packed
                  </p>

                  <p
                    className="
                      text-lg
                      font-bold
                      text-slate-900
                    "
                  >
                    {orders.packed || 0}
                  </p>

                </div>

              </div>

            </div>


            <div
              className="
                rounded-xl
                border
                border-slate-200
                bg-white
                p-4
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <div
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-lg
                    bg-sky-50
                    text-sky-600
                  "
                >
                  <FaShippingFast />
                </div>

                <div>

                  <p
                    className="
                      text-xs
                      text-slate-500
                    "
                  >
                    Shipped
                  </p>

                  <p
                    className="
                      text-lg
                      font-bold
                      text-slate-900
                    "
                  >
                    {orders.shipped || 0}
                  </p>

                </div>

              </div>

            </div>


            <div
              className="
                rounded-xl
                border
                border-slate-200
                bg-white
                p-4
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <div
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-lg
                    bg-emerald-50
                    text-emerald-600
                  "
                >
                  <FaTruck />
                </div>

                <div>

                  <p
                    className="
                      text-xs
                      text-slate-500
                    "
                  >
                    Delivered
                  </p>

                  <p
                    className="
                      text-lg
                      font-bold
                      text-slate-900
                    "
                  >
                    {orders.delivered || 0}
                  </p>

                </div>

              </div>

            </div>


            <div
              className="
                rounded-xl
                border
                border-slate-200
                bg-white
                p-4
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <div
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-lg
                    bg-red-50
                    text-red-600
                  "
                >
                  <FaExclamationTriangle />
                </div>

                <div>

                  <p
                    className="
                      text-xs
                      text-slate-500
                    "
                  >
                    Cancelled
                  </p>

                  <p
                    className="
                      text-lg
                      font-bold
                      text-slate-900
                    "
                  >
                    {orders.cancelled || 0}
                  </p>

                </div>

              </div>

            </div>

          </div>


          {/* ==================================================
              SECONDARY KPI
          =================================================== */}

          <div
            className="
              mt-6
              grid
              gap-4
              md:grid-cols-3
            "
          >

            <div
              className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-slate-100
                    text-slate-600
                  "
                >
                  <FaCubes />
                </div>

                <div>

                  <p
                    className="
                      text-xs
                      text-slate-500
                    "
                  >
                    Items Sold
                  </p>

                  <p
                    className="
                      mt-1
                      text-xl
                      font-bold
                      text-slate-900
                    "
                  >
                    {Number(
                      summary.totalItemsSold || 0
                    ).toLocaleString('en-IN')}
                  </p>

                </div>

              </div>

            </div>


            <div
              className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-teal-50
                    text-teal-600
                  "
                >
                  <FaMoneyBillWave />
                </div>

                <div>

                  <p
                    className="
                      text-xs
                      text-slate-500
                    "
                  >
                    Average Order Value
                  </p>

                  <p
                    className="
                      mt-1
                      text-xl
                      font-bold
                      text-slate-900
                    "
                  >
                    {formatCurrency(
                      summary.averageOrderValue
                    )}
                  </p>

                </div>

              </div>

            </div>


            <div
              className="
                rounded-2xl
                border
                border-red-100
                bg-red-50/50
                p-5
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-red-100
                    text-red-600
                  "
                >
                  <FaExclamationTriangle />
                </div>

                <div>

                  <p
                    className="
                      text-xs
                      text-red-600
                    "
                  >
                    Out of Stock
                  </p>

                  <p
                    className="
                      mt-1
                      text-xl
                      font-bold
                      text-red-700
                    "
                  >
                    {Number(
                      summary.outOfStockProducts || 0
                    ).toLocaleString('en-IN')}
                  </p>

                </div>

              </div>

            </div>

          </div>


          {/* ==================================================
              RECENT ORDERS + TOP PRODUCTS
          =================================================== */}

          <div
            className="
              mt-8
              grid
              gap-6
              xl:grid-cols-[1.55fr_1fr]
            "
          >

            {/* Recent Orders */}

            <section
              className="
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                shadow-sm
              "
            >

              <div
                className="
                  border-b
                  border-slate-200
                  p-5
                "
              >

                <SectionHeader
                  title="Recent Orders"
                  subtitle="Latest orders from your customers"
                  action={
                    <div
                      className="
                        flex
                        items-center
                        gap-2
                      "
                    >
                      <div
                        className="
                          hidden
                          items-center
                          gap-2
                          rounded-lg
                          bg-slate-50
                          px-3
                          py-2
                          text-xs
                          text-slate-500
                          sm:flex
                        "
                      >
                        <FaClipboardList />
                        {recentOrders.length}
                        {' '}
                        recent
                      </div>

                      <Link
                        to="/admin/orders"
                        className="
                          inline-flex
                          items-center
                          gap-2
                          rounded-lg
                          bg-teal-50
                          px-3
                          py-2
                          text-xs
                          font-semibold
                          text-teal-700
                          transition
                          hover:bg-teal-100
                        "
                      >
                        View All
                        <FaChevronRight className="text-[10px]" />
                      </Link>
                    </div>
                  }
                />

                <div
                  className="
                    relative
                    max-w-sm
                  "
                >

                  <FaSearch
                    className="
                      absolute
                      left-3
                      top-1/2
                      -translate-y-1/2
                      text-xs
                      text-slate-400
                    "
                  />

                  <input
                    type="search"
                    value={search}
                    onChange={(event) =>
                      setSearch(
                        event.target.value
                      )
                    }
                    placeholder="
                      Search order, customer or status
                    "
                    className="
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      bg-slate-50
                      py-2.5
                      pl-9
                      pr-3
                      text-sm
                      outline-none
                      transition
                      focus:border-teal-500
                      focus:bg-white
                      focus:ring-2
                      focus:ring-teal-500/10
                    "
                  />

                </div>

              </div>


              {filteredOrders.length === 0 ? (

                <div className="p-5">

                  <EmptyState
                    icon={<FaClipboardList />}
                    title="No orders found"
                    description="
                      There are no orders matching
                      the current search.
                    "
                  />

                </div>

              ) : (

                <div className="overflow-x-auto">

                  <table
                    className="
                      w-full
                      min-w-[720px]
                      text-left
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

                        <th
                          className="
                            px-5
                            py-3
                            text-[11px]
                            font-bold
                            uppercase
                            tracking-wider
                            text-slate-500
                          "
                        >
                          Order
                        </th>

                        <th
                          className="
                            px-5
                            py-3
                            text-[11px]
                            font-bold
                            uppercase
                            tracking-wider
                            text-slate-500
                          "
                        >
                          Customer
                        </th>

                        <th
                          className="
                            px-5
                            py-3
                            text-[11px]
                            font-bold
                            uppercase
                            tracking-wider
                            text-slate-500
                          "
                        >
                          Amount
                        </th>

                        <th
                          className="
                            px-5
                            py-3
                            text-[11px]
                            font-bold
                            uppercase
                            tracking-wider
                            text-slate-500
                          "
                        >
                          Status
                        </th>

                        <th
                          className="
                            px-5
                            py-3
                            text-[11px]
                            font-bold
                            uppercase
                            tracking-wider
                            text-slate-500
                          "
                        >
                          Date
                        </th>

                      </tr>

                    </thead>


                    <tbody>

                      {filteredOrders.map(
                        (order) => {

                          const status =
                            getOrderStatus(
                              order
                            );


                          return (
                            <tr
                              key={
                                order?._id ||
                                order?.id
                              }
                              className="
                                border-b
                                border-slate-100
                                last:border-0
                                hover:bg-slate-50
                              "
                            >

                              <td
                                className="
                                  px-5
                                  py-4
                                "
                              >

                                <p
                                  className="
                                    max-w-[150px]
                                    truncate
                                    text-xs
                                    font-semibold
                                    text-slate-900
                                  "
                                >
                                  #
                                  {String(
                                    order?._id ||
                                    ''
                                  ).slice(-8)}
                                </p>

                              </td>


                              <td
                                className="
                                  px-5
                                  py-4
                                "
                              >

                                <p
                                  className="
                                    max-w-[180px]
                                    truncate
                                    text-sm
                                    font-semibold
                                    text-slate-800
                                  "
                                >
                                  {getCustomerName(
                                    order
                                  )}
                                </p>

                                <p
                                  className="
                                    mt-0.5
                                    max-w-[180px]
                                    truncate
                                    text-xs
                                    text-slate-400
                                  "
                                >
                                  {order?.user?.email ||
                                    order?.email ||
                                    '—'}
                                </p>

                              </td>


                              <td
                                className="
                                  whitespace-nowrap
                                  px-5
                                  py-4
                                  text-sm
                                  font-bold
                                  text-slate-900
                                "
                              >
                                {formatCurrency(
                                  getOrderTotal(
                                    order
                                  )
                                )}
                              </td>


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
                                    px-2.5
                                    py-1
                                    text-[11px]
                                    font-semibold
                                    ring-1
                                    ring-inset
                                    ${getStatusClasses(
                                      status
                                    )}
                                  `}
                                >
                                  {status}
                                </span>

                              </td>


                              <td
                                className="
                                  whitespace-nowrap
                                  px-5
                                  py-4
                                  text-xs
                                  text-slate-500
                                "
                              >
                                {formatDate(
                                  order?.createdAt
                                )}
                              </td>

                            </tr>
                          );

                        }
                      )}

                    </tbody>

                  </table>

                </div>

              )}

            </section>


            {/* Top Products */}

            <section
              className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
              "
            >

              <SectionHeader
                title="Top Products"
                subtitle="Best performing products"
              />


              {topProducts.length === 0 ? (

                <EmptyState
                  icon={<FaBox />}
                  title="No product sales yet"
                  description="
                    Product performance will appear
                    here after orders are placed.
                  "
                />

              ) : (

                <div className="space-y-2">

                  {topProducts.map(
                    (product, index) => {

                      const revenue =
                        Number(
                          product?.revenue ||
                          0
                        );

                      const quantity =
                        Number(
                          product?.quantity ||
                          0
                        );


                      return (
                        <div
                          key={
                            product?._id ||
                            `${product?.name}-${index}`
                          }
                          className="
                            flex
                            items-center
                            gap-3
                            rounded-xl
                            p-3
                            transition
                            hover:bg-slate-50
                          "
                        >

                          <div
                            className="
                              flex
                              h-9
                              w-9
                              shrink-0
                              items-center
                              justify-center
                              rounded-lg
                              bg-slate-100
                              text-xs
                              font-bold
                              text-slate-600
                            "
                          >
                            {index + 1}
                          </div>


                          <div
                            className="
                              min-w-0
                              flex-1
                            "
                          >

                            <p
                              className="
                                truncate
                                text-sm
                                font-semibold
                                text-slate-800
                              "
                            >
                              {product?.name ||
                                'Product'}
                            </p>

                            <p
                              className="
                                mt-0.5
                                text-xs
                                text-slate-500
                              "
                            >
                              {quantity}
                              {' '}
                              units sold
                            </p>

                          </div>


                          <div
                            className="
                              shrink-0
                              text-right
                            "
                          >

                            <p
                              className="
                                text-sm
                                font-bold
                                text-slate-900
                              "
                            >
                              {formatCurrency(
                                revenue
                              )}
                            </p>

                            <p
                              className="
                                mt-0.5
                                text-[11px]
                                text-slate-400
                              "
                            >
                              Revenue
                            </p>

                          </div>

                        </div>
                      );

                    }
                  )}

                </div>

              )}

            </section>

          </div>


          {/* ==================================================
              LOW STOCK + RECENT CUSTOMERS
          =================================================== */}

          <div
            className="
              mt-6
              grid
              gap-6
              xl:grid-cols-[1.2fr_1fr]
            "
          >

            {/* Low Stock */}

            <section
              className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
              "
            >

              <SectionHeader
                title="Low Stock Products"
                subtitle="
                  Products that need inventory attention
                "
                action={
                  <span
                    className="
                      rounded-full
                      bg-red-50
                      px-3
                      py-1
                      text-xs
                      font-semibold
                      text-red-600
                    "
                  >
                    {lowStockProducts.length}
                    {' '}
                    alerts
                  </span>
                }
              />


              {lowStockProducts.length === 0 ? (

                <EmptyState
                  icon={<FaBoxes />}
                  title="Inventory looks healthy"
                  description="
                    No products currently match
                    the low-stock threshold.
                  "
                />

              ) : (

                <div
                  className="
                    overflow-x-auto
                  "
                >

                  <table
                    className="
                      w-full
                      min-w-[560px]
                    "
                  >

                    <thead>

                      <tr
                        className="
                          border-b
                          border-slate-200
                        "
                      >

                        <th
                          className="
                            px-3
                            py-3
                            text-left
                            text-[11px]
                            font-bold
                            uppercase
                            tracking-wider
                            text-slate-500
                          "
                        >
                          Product
                        </th>

                        <th
                          className="
                            px-3
                            py-3
                            text-left
                            text-[11px]
                            font-bold
                            uppercase
                            tracking-wider
                            text-slate-500
                          "
                        >
                          Stock
                        </th>

                        <th
                          className="
                            px-3
                            py-3
                            text-left
                            text-[11px]
                            font-bold
                            uppercase
                            tracking-wider
                            text-slate-500
                          "
                        >
                          MOQ
                        </th>

                      </tr>

                    </thead>


                    <tbody>

                      {lowStockProducts.map(
                        (product) => {

                          const stock =
                            Number(
                              product?.stock ||
                              0
                            );

                          const moq =
                            Number(
                              product?.moq ||
                              1
                            );


                          return (
                            <tr
                              key={
                                product?._id
                              }
                              className="
                                border-b
                                border-slate-100
                                last:border-0
                              "
                            >

                              <td
                                className="
                                  px-3
                                  py-4
                                "
                              >

                                <div
                                  className="
                                    flex
                                    items-center
                                    gap-3
                                  "
                                >

                                  <div
                                    className="
                                      flex
                                      h-9
                                      w-9
                                      shrink-0
                                      items-center
                                      justify-center
                                      rounded-lg
                                      bg-orange-50
                                      text-orange-600
                                    "
                                  >
                                    <FaBox />
                                  </div>


                                  <div
                                    className="
                                      min-w-0
                                    "
                                  >

                                    <p
                                      className="
                                        max-w-[250px]
                                        truncate
                                        text-sm
                                        font-semibold
                                        text-slate-800
                                      "
                                    >
                                      {product?.name ||
                                        'Product'}
                                    </p>

                                    {product?.sku && (
                                      <p
                                        className="
                                          mt-0.5
                                          text-xs
                                          text-slate-400
                                        "
                                      >
                                        SKU:
                                        {' '}
                                        {product.sku}
                                      </p>
                                    )}

                                  </div>

                                </div>

                              </td>


                              <td
                                className="
                                  px-3
                                  py-4
                                "
                              >

                                <span
                                  className={`
                                    inline-flex
                                    rounded-full
                                    px-2.5
                                    py-1
                                    text-xs
                                    font-semibold
                                    ${
                                      stock <= 0
                                        ? 'bg-red-50 text-red-700'
                                        : 'bg-amber-50 text-amber-700'
                                    }
                                  `}
                                >
                                  {stock}
                                </span>

                              </td>


                              <td
                                className="
                                  px-3
                                  py-4
                                  text-sm
                                  font-medium
                                  text-slate-600
                                "
                              >
                                {moq}
                              </td>

                            </tr>
                          );

                        }
                      )}

                    </tbody>

                  </table>

                </div>

              )}

            </section>


            {/* Recent Customers */}

            <section
              className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
              "
            >

              <SectionHeader
                title="Recent Customers"
                subtitle="Latest registered customers"
              />


              {recentCustomers.length === 0 ? (

                <EmptyState
                  icon={<FaUserFriends />}
                  title="No customers yet"
                  description="
                    New customers will appear
                    here after registration.
                  "
                />

              ) : (

                <div className="space-y-1">

                  {recentCustomers.map(
                    (customer) => {

                      const name =
                        customer?.name ||
                        customer?.businessName ||
                        'Customer';


                      return (
                        <div
                          key={
                            customer?._id
                          }
                          className="
                            flex
                            items-center
                            gap-3
                            rounded-xl
                            p-3
                            transition
                            hover:bg-slate-50
                          "
                        >

                          <div
                            className="
                              flex
                              h-10
                              w-10
                              shrink-0
                              items-center
                              justify-center
                              rounded-full
                              bg-teal-50
                              text-sm
                              font-bold
                              text-teal-700
                            "
                          >
                            {name
                              .charAt(0)
                              .toUpperCase()}
                          </div>


                          <div
                            className="
                              min-w-0
                              flex-1
                            "
                          >

                            <p
                              className="
                                truncate
                                text-sm
                                font-semibold
                                text-slate-800
                              "
                            >
                              {name}
                            </p>

                            <p
                              className="
                                mt-0.5
                                truncate
                                text-xs
                                text-slate-500
                              "
                            >
                              {customer?.email ||
                                'No email'}
                            </p>

                          </div>


                          <div
                            className="
                              hidden
                              shrink-0
                              text-right
                              sm:block
                            "
                          >

                            <p
                              className="
                                text-[11px]
                                text-slate-400
                              "
                            >
                              Joined
                            </p>

                            <p
                              className="
                                mt-0.5
                                text-xs
                                font-medium
                                text-slate-600
                              "
                            >
                              {formatDate(
                                customer?.createdAt
                              )}
                            </p>

                          </div>

                        </div>
                      );

                    }
                  )}

                </div>

              )}

            </section>

          </div>


          {/* ==================================================
              FOOTER INFO
          =================================================== */}

          <div
            className="
              mt-8
              flex
              flex-col
              gap-2
              border-t
              border-slate-200
              pt-5
              text-xs
              text-slate-400
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            <p>
              Shanti Enterprises Admin Panel
            </p>

            <p>
              Data is loaded from the backend.
            </p>

          </div>

        </div>

      </main>

    </div>
  );
}


export default AdminDashboard;