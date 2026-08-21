import { useState } from 'react';

import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import {
  FaBox,
  FaBoxes,
  FaClipboardList,
  FaFileInvoiceDollar,
  FaHome,
  FaPercent,
  FaShippingFast,
  FaSignOutAlt,
  FaStore,
  FaTimes,
  FaTruck,
  FaUserFriends,
  FaUsers,
  FaBars,
} from 'react-icons/fa';

import { toast } from 'react-toastify';

import { useAuth } from '../../context/AuthContext';


// ======================================================
// NAV ITEM
// ======================================================

const navItemClasses = ({ isActive }) => `
  flex
  w-full
  items-center
  gap-3
  rounded-xl
  px-4
  py-3
  text-sm
  transition
  duration-200
  ${
    isActive
      ? 'bg-teal-500 font-semibold text-white shadow-lg shadow-teal-950/20'
      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
  }
`;


// ======================================================
// ADMIN LAYOUT
// ======================================================

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const {
    admin,
    logout,
  } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();


  // ====================================================
  // LOGOUT
  // ====================================================

  const handleLogout = () => {
    logout();

    toast.success(
      'Admin logged out successfully.'
    );

    navigate('/admin/login', {
      replace: true,
    });
  };


  // ====================================================
  // CLOSE SIDEBAR ON NAVIGATION
  // ====================================================

  const closeSidebar = () => {
    setSidebarOpen(false);
  };


  // ====================================================
  // CURRENT PAGE
  // ====================================================

  const getPageTitle = () => {
    const path = location.pathname;

    if (
      path === '/admin/dashboard'
    ) {
      return 'Dashboard';
    }

    if (
      path.startsWith('/admin/orders')
    ) {
      return 'Orders';
    }

    if (
      path.startsWith('/admin/products')
    ) {
      return 'Products';
    }

    if (
      path.startsWith('/admin/shipping')
    ) {
      return 'Shipping';
    }

    return 'Admin Panel';
  };


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
      ================================================== */}

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close admin sidebar"
          onClick={closeSidebar}
          className="
            fixed
            inset-0
            z-40
            bg-slate-950/50
            lg:hidden
          "
        />
      )}


      {/* ==================================================
          SIDEBAR
      ================================================== */}

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

        {/* ==================================================
            BRAND
        ================================================== */}

        <div
          className="
            flex
            h-20
            shrink-0
            items-center
            justify-between
            border-b
            border-slate-800
            px-6
          "
        >

          <NavLink
            to="/admin/dashboard"
            onClick={closeSidebar}
            className="
              flex
              min-w-0
              items-center
              gap-3
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
                rounded-xl
                bg-teal-500
                text-white
              "
            >
              <FaStore />
            </div>

            <div className="min-w-0">

              <p
                className="
                  truncate
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

          </NavLink>


          <button
            type="button"
            onClick={closeSidebar}
            aria-label="Close sidebar"
            className="
              rounded-lg
              p-2
              text-slate-400
              transition
              hover:bg-slate-800
              hover:text-white
              lg:hidden
            "
          >
            <FaTimes />
          </button>

        </div>


        {/* ==================================================
            ADMIN PROFILE
        ================================================== */}

        <div
          className="
            shrink-0
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


        {/* ==================================================
            NAVIGATION
        ================================================== */}

        <nav
          className="
            flex-1
            overflow-y-auto
            px-4
            py-5
          "
        >

          {/* Overview */}

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


          <NavLink
            to="/admin/dashboard"
            onClick={closeSidebar}
            className={navItemClasses}
          >
            <FaHome />
            Dashboard
          </NavLink>


          {/* Store Management */}

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

            <NavLink
              to="/admin/products"
              onClick={closeSidebar}
              className={navItemClasses}
            >
              <FaBox />
              Products
            </NavLink>


            <NavLink
              to="/admin/orders"
              onClick={closeSidebar}
              className={navItemClasses}
            >
              <FaClipboardList />
              Orders
            </NavLink>


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


          {/* Sales & Fulfillment */}

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


            <NavLink
              to="/admin/shipping"
              onClick={closeSidebar}
              className={navItemClasses}
            >
              <FaShippingFast />
              Shipping
            </NavLink>


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


          {/* Marketing */}

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


        {/* ==================================================
            LOGOUT
        ================================================== */}

        <div
          className="
            shrink-0
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
          MAIN AREA
      ================================================== */}

      <main
        className="
          min-h-screen
          lg:pl-72
        "
      >

        {/* ==================================================
            ADMIN TOP BAR
        ================================================== */}

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
                aria-label="Open admin sidebar"
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
                  text-slate-700
                  shadow-sm
                  transition
                  hover:bg-slate-50
                  lg:hidden
                "
              >
                <FaBars />
              </button>


              <div className="min-w-0">

                <p
                  className="
                    truncate
                    text-lg
                    font-bold
                    text-slate-900
                  "
                >
                  {getPageTitle()}
                </p>

                <p
                  className="
                    mt-0.5
                    hidden
                    text-xs
                    text-slate-500
                    sm:block
                  "
                >
                  Shanti Enterprises Admin Panel
                </p>

              </div>

            </div>


            <div
              className="
                hidden
                items-center
                gap-3
                sm:flex
              "
            >

              <div
                className="
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  px-4
                  py-2
                  text-right
                "
              >

                <p
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-wider
                    text-slate-400
                  "
                >
                  Signed in as
                </p>

                <p
                  className="
                    mt-0.5
                    max-w-44
                    truncate
                    text-sm
                    font-semibold
                    text-slate-700
                  "
                >
                  {admin?.username ||
                    admin?.name ||
                    'Administrator'}
                </p>

              </div>

            </div>

          </div>

        </header>


        {/* ==================================================
            NESTED ADMIN PAGE
        ================================================== */}

        <section
          className="
            min-h-[calc(100vh-80px)]
            p-4
            sm:p-6
            lg:p-8
          "
        >
          <Outlet />
        </section>

      </main>

    </div>
  );
};


export default AdminLayout;
