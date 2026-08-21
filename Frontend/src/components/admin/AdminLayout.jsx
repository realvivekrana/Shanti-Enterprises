import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import {
  FaBars,
  FaBoxOpen,
  FaChartLine,
  FaClipboardList,
  FaCog,
  FaCube,
  FaFileInvoiceDollar,
  FaHome,
  FaPercent,
  FaReceipt,
  FaSignOutAlt,
  FaTruck,
  FaUndo,
  FaUsers,
  FaWarehouse,
  FaTimes,
  FaUserTie,
  FaQuestionCircle,
} from 'react-icons/fa';

import { useState } from 'react';

import { useAuth } from '../../context/AuthContext';


// ======================================================
// ADMIN NAVIGATION
// ======================================================

const navigation = [
  {
    label: 'Dashboard',
    path: '/admin/dashboard',
    icon: FaHome,
  },

  {
    label: 'Orders',
    path: '/admin/orders',
    icon: FaClipboardList,
  },

  {
    label: 'Products',
    path: '/admin/products',
    icon: FaBoxOpen,
  },

  {
    label: 'Inventory',
    path: '/admin/inventory',
    icon: FaWarehouse,
  },

  {
    label: 'Customers',
    path: '/admin/customers',
    icon: FaUsers,
  },

  {
    label: 'Suppliers',
    path: '/admin/suppliers',
    icon: FaUserTie,
  },

  {
    label: 'Shipments',
    path: '/admin/shipments',
    icon: FaTruck,
  },

  {
    label: 'Quotations',
    path: '/admin/quotations',
    icon: FaFileInvoiceDollar,
  },

  {
    label: 'Invoices',
    path: '/admin/invoices',
    icon: FaReceipt,
  },

  {
    label: 'Returns & Refunds',
    path: '/admin/returns',
    icon: FaUndo,
  },

  {
    label: 'Coupons',
    path: '/admin/coupons',
    icon: FaPercent,
  },

  {
    label: 'RFQs',
    path: '/admin/rfqs',
    icon: FaQuestionCircle,
  },

  {
    label: 'Reports',
    path: '/admin/reports',
    icon: FaChartLine,
  },

  {
    label: 'Settings',
    path: '/admin/settings',
    icon: FaCog,
  },
];


// ======================================================
// ADMIN LAYOUT
// ======================================================

const AdminLayout = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const { admin, logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] =
    useState(false);


  // ====================================================
  // LOGOUT
  // ====================================================

  const handleLogout = () => {
    logout();

    navigate(
      '/admin/login',
      {
        replace: true,
      }
    );
  };


  // ====================================================
  // ACTIVE NAVIGATION
  // ====================================================

  const isActive = (path) => {
    if (
      path ===
      '/admin/dashboard'
    ) {
      return (
        location.pathname ===
        '/admin/dashboard'
      );
    }

    return (
      location.pathname === path ||
      location.pathname.startsWith(
        `${path}/`
      )
    );
  };


  return (
    <div
      className="
        min-h-screen
        bg-slate-100
        flex
      "
    >

      {/* ==================================================
          MOBILE OVERLAY
      ================================================== */}

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
            bg-black/40
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
          left-0
          top-0
          bottom-0
          z-50
          flex
          w-72
          flex-col
          bg-slate-950
          text-white
          shadow-2xl
          transition-transform
          duration-300

          ${
            sidebarOpen
              ? 'translate-x-0'
              : '-translate-x-full'
          }

          lg:static
          lg:z-auto
          lg:translate-x-0
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
            px-5
          "
        >

          <button
            type="button"
            onClick={() =>
              navigate(
                '/admin/dashboard'
              )
            }
            className="
              flex
              items-center
              gap-3
              text-left
            "
          >

            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-teal-600
                shadow-lg
                shadow-teal-900/30
              "
            >
              <FaCube
                className="
                  text-xl
                "
              />
            </div>

            <div>

              <p
                className="
                  text-lg
                  font-bold
                  tracking-tight
                "
              >
                Shanti
              </p>

              <p
                className="
                  text-xs
                  font-medium
                  text-slate-400
                "
              >
                ENTERPRISES
              </p>

            </div>

          </button>


          {/* Mobile close */}

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
            aria-label="Close menu"
          >
            <FaTimes />
          </button>

        </div>


        {/* ==================================================
            ADMIN PROFILE
        ================================================== */}

        <div
          className="
            border-b
            border-slate-800
            px-5
            py-5
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
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-teal-600
                font-bold
              "
            >
              {(
                admin?.name ||
                admin?.email ||
                'A'
              )
                .charAt(0)
                .toUpperCase()}
            </div>

            <div
              className="
                min-w-0
              "
            >

              <p
                className="
                  truncate
                  text-sm
                  font-semibold
                  text-white
                "
              >
                {admin?.name ||
                  'Administrator'}
              </p>

              <p
                className="
                  truncate
                  text-xs
                  text-slate-400
                "
              >
                {admin?.email ||
                  'Admin Account'}
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
            px-3
            py-4
          "
        >

          <p
            className="
              mb-3
              px-3
              text-[10px]
              font-bold
              uppercase
              tracking-[0.15em]
              text-slate-500
            "
          >
            Management
          </p>


          <div
            className="
              space-y-1
            "
          >

            {navigation.map(
              ({
                label,
                path,
                icon: Icon,
              }) => {

                const active =
                  isActive(path);

                return (
                  <NavLink
                    key={path}
                    to={path}
                    onClick={() =>
                      setSidebarOpen(
                        false
                      )
                    }
                    className={`
                      group
                      flex
                      items-center
                      gap-3
                      rounded-xl
                      px-3
                      py-2.5
                      text-sm
                      font-medium
                      transition-all

                      ${
                        active
                          ? `
                            bg-teal-600
                            text-white
                            shadow-lg
                            shadow-teal-950/20
                          `
                          : `
                            text-slate-300
                            hover:bg-slate-800
                            hover:text-white
                          `
                      }
                    `}
                  >

                    <Icon
                      className={`
                        shrink-0
                        text-sm
                        ${
                          active
                            ? 'text-white'
                            : 'text-slate-400 group-hover:text-white'
                        }
                      `}
                    />

                    <span>
                      {label}
                    </span>

                  </NavLink>
                );
              }
            )}

          </div>

        </nav>


        {/* ==================================================
            LOGOUT
        ================================================== */}

        <div
          className="
            shrink-0
            border-t
            border-slate-800
            p-3
          "
        >

          <button
            type="button"
            onClick={
              handleLogout
            }
            className="
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-3
              py-3
              text-sm
              font-semibold
              text-slate-300
              transition
              hover:bg-red-500/10
              hover:text-red-400
            "
          >

            <FaSignOutAlt />

            <span>
              Logout
            </span>

          </button>

        </div>

      </aside>


      {/* ==================================================
          MAIN AREA
      ================================================== */}

      <div
        className="
          flex
          min-w-0
          flex-1
          flex-col
        "
      >

        {/* ==================================================
            TOP HEADER
        ================================================== */}

        <header
          className="
            sticky
            top-0
            z-30
            flex
            h-20
            shrink-0
            items-center
            justify-between
            border-b
            border-slate-200
            bg-white/95
            px-4
            shadow-sm
            backdrop-blur
            sm:px-6
            lg:px-8
          "
        >

          {/* Mobile menu */}

          <button
            type="button"
            onClick={() =>
              setSidebarOpen(true)
            }
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              border-slate-200
              text-slate-600
              hover:bg-slate-50
              lg:hidden
            "
            aria-label="Open menu"
          >
            <FaBars />
          </button>


          {/* Page information */}

          <div
            className="
              hidden
              sm:block
            "
          >

            <p
              className="
                text-xs
                font-medium
                uppercase
                tracking-wider
                text-slate-400
              "
            >
              Admin Panel
            </p>

            <h1
              className="
                mt-0.5
                text-lg
                font-bold
                text-slate-900
              "
            >
              Shanti Enterprises
            </h1>

          </div>


          {/* Right side */}

          <div
            className="
              ml-auto
              flex
              items-center
              gap-3
            "
          >

            <div
              className="
                hidden
                text-right
                sm:block
              "
            >

              <p
                className="
                  text-sm
                  font-semibold
                  text-slate-800
                "
              >
                {admin?.name ||
                  'Administrator'}
              </p>

              <p
                className="
                  text-xs
                  text-slate-500
                "
              >
                Administrator
              </p>

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
                font-bold
                text-teal-700
              "
            >
              {(
                admin?.name ||
                admin?.email ||
                'A'
              )
                .charAt(0)
                .toUpperCase()}
            </div>

          </div>

        </header>


        {/* ==================================================
            PAGE CONTENT
        ================================================== */}

        <main
          className="
            min-w-0
            flex-1
            p-4
            sm:p-6
            lg:p-8
          "
        >

          <Outlet />

        </main>

      </div>

    </div>
  );
};


export default AdminLayout;