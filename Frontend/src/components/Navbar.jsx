import { useState } from 'react';
import {
  Link,
  useNavigate,
} from 'react-router-dom';

import { useCart } from '../context/CartContext';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const navigate = useNavigate();

  const { cartCount } = useCart();

  // ======================================================
  // STATES
  // ======================================================

  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);

  const [
    categoryOpen,
    setCategoryOpen,
  ] = useState(false);

  const [
    accountOpen,
    setAccountOpen,
  ] = useState(false);

  const [
    search,
    setSearch,
  ] = useState('');

  // ======================================================
  // USER
  // ======================================================

  const userInfo =
    localStorage.getItem('userInfo');

  let user = null;

  if (userInfo) {
    try {
      user = JSON.parse(userInfo);
    } catch (error) {
      console.error(
        'Invalid user information:',
        error
      );
      localStorage.removeItem('userInfo');
    }
  }

  // ======================================================
  // SEARCH
  // ======================================================

  const handleSearch = (e) => {
    e.preventDefault();

    const value = search.trim();

    if (!value) {
      navigate('/products');
      return;
    }

    navigate(
      `/products?search=${encodeURIComponent(
        value
      )}`
    );

    setSearch('');
    setMobileMenuOpen(false);
  };

  // ======================================================
  // CLOSE MOBILE MENU
  // ======================================================

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setCategoryOpen(false);
    setAccountOpen(false);
  };

  // ======================================================
  // LOGOUT
  // ======================================================

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');

    closeMobileMenu();

    navigate('/login');

    window.location.reload();
  };

  // ======================================================
  // ACCOUNT CLICK
  // ======================================================

  const handleAccountClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/dashboard');
    }

    setAccountOpen(false);
  };

  // ======================================================
  // MOBILE LINKS
  // ======================================================

  const mobileLinks = [
    {
      label: 'Products',
      path: '/products',
    },
    {
      label: 'Categories',
      path: '/categories',
    },
    {
      label: 'Bulk Orders',
      path: '/bulk-order-upload',
    },
    {
      label: 'My Orders',
      path: '/orders',
      auth: true,
    },
    {
      label: 'RFQ',
      path: '/create-rfq',
      auth: true,
    },
    {
      label: 'Wishlist',
      path: '/wishlist',
      auth: true,
    },
    {
      label: 'About',
      path: '/about',
    },
    {
      label: 'Contact',
      path: '/contact',
    },
  ];

  // ======================================================
  // CATEGORIES
  // ======================================================

  const categories = [
    {
      name: 'Courier Bags',
      value: 'Courier Bags',
    },
    {
      name: 'Boxes & Tapes',
      value: 'Boxes,Tapes',
    },
    {
      name: 'Labels & Stickers',
      value: 'Labels',
    },
    {
      name: 'Paper Shredded',
      value: 'Paper Shredded',
    },
  ];

  // ======================================================
  // RETURN
  // ======================================================

  return (
    <>
      {/* ==================================================
          NAVBAR
      ================================================== */}

      <header
        className="
          sticky
          top-0
          z-50
          bg-white
          border-b
          border-slate-200
          shadow-sm
        "
      >

        <div
          className="
            max-w-7xl
            mx-auto
            px-4
            sm:px-6
            lg:px-8
          "
        >

          {/* ==================================================
              MAIN ROW
          ================================================== */}

          <div
            className="
              h-16
              flex
              items-center
              justify-between
            "
          >

            {/* ==================================================
                LEFT
            ================================================== */}

            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              {/* MOBILE MENU */}

              <button
                type="button"
                onClick={() =>
                  setMobileMenuOpen(
                    !mobileMenuOpen
                  )
                }
                className="
                  lg:hidden
                  w-10
                  h-10
                  flex
                  items-center
                  justify-center
                  rounded-lg
                  text-slate-700
                  hover:bg-slate-100
                "
                aria-label="Menu"
              >

                {mobileMenuOpen ? (
                  <span className="text-2xl">
                    ×
                  </span>
                ) : (
                  <span className="text-2xl">
                    ☰
                  </span>
                )}

              </button>

              {/* LOGO */}

              <Link
                to="/"
                onClick={closeMobileMenu}
                className="
                  flex
                  items-center
                  gap-2
                  shrink-0
                "
              >

                <div
                  className="
                    w-9
                    h-9
                    sm:w-10
                    sm:h-10
                    rounded-lg
                    bg-teal-600
                    text-white
                    flex
                    items-center
                    justify-center
                    font-bold
                    text-lg
                  "
                >
                  S
                </div>

                <div className="hidden sm:block">

                  <div
                    className="
                      text-sm
                      sm:text-base
                      font-bold
                      text-slate-800
                    "
                  >
                    Shanti Enterprises
                  </div>

                  <div
                    className="
                      text-[10px]
                      text-slate-500
                    "
                  >
                    Wholesale Solutions
                  </div>

                </div>

              </Link>

            </div>

            {/* ==================================================
                DESKTOP NAVIGATION
            ================================================== */}

            <nav
              className="
                hidden
                lg:flex
                items-center
                gap-7
                ml-8
              "
            >

              {/* CATEGORIES */}

              <div className="relative">

                <button
                  type="button"
                  onClick={() =>
                    setCategoryOpen(
                      !categoryOpen
                    )
                  }
                  className="
                    flex
                    items-center
                    gap-1
                    text-sm
                    font-semibold
                    text-slate-700
                    hover:text-teal-600
                  "
                >
                  Categories
                  <span>▼</span>
                </button>

                {categoryOpen && (

                  <div
                    className="
                      absolute
                      left-0
                      top-full
                      mt-3
                      w-56
                      rounded-xl
                      bg-white
                      border
                      border-slate-200
                      shadow-xl
                      p-2
                    "
                  >

                    <Link
                      to="/categories"
                      onClick={() =>
                        setCategoryOpen(false)
                      }
                      className="
                        block
                        px-3
                        py-2.5
                        rounded-lg
                        text-sm
                        font-semibold
                        text-slate-700
                        hover:bg-teal-50
                      "
                    >
                      All Categories
                    </Link>

                    {categories.map(
                      (category) => (

                        <button
                          key={
                            category.name
                          }
                          type="button"
                          onClick={() => {

                            navigate(
                              `/products?category=${encodeURIComponent(
                                category.value
                              )}`
                            );

                            setCategoryOpen(
                              false
                            );

                          }}
                          className="
                            w-full
                            text-left
                            px-3
                            py-2.5
                            rounded-lg
                            text-sm
                            text-slate-600
                            hover:bg-slate-50
                          "
                        >
                          {category.name}
                        </button>

                      )
                    )}

                  </div>

                )}

              </div>

              {/* PRODUCTS */}

              <Link
                to="/products"
                className="
                  text-sm
                  font-semibold
                  text-slate-700
                  hover:text-teal-600
                "
              >
                Products
              </Link>

              {/* BULK ORDERS */}

              <Link
                to="/bulk-order-upload"
                className="
                  text-sm
                  font-semibold
                  text-slate-700
                  hover:text-teal-600
                "
              >
                Bulk Orders
              </Link>

              {/* RFQ */}

              <Link
                to="/create-rfq"
                className="
                  text-sm
                  font-semibold
                  text-slate-700
                  hover:text-teal-600
                "
              >
                RFQ
              </Link>

            </nav>

            {/* ==================================================
                DESKTOP SEARCH
            ================================================== */}

            <form
              onSubmit={handleSearch}
              className="
                hidden
                md:flex
                flex-1
                max-w-md
                mx-6
              "
            >

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search products..."
                className="
                  w-full
                  h-10
                  px-4
                  rounded-lg
                  border
                  border-slate-200
                  bg-slate-50
                  text-sm
                  outline-none
                  focus:border-teal-500
                  focus:ring-2
                  focus:ring-teal-100
                "
              />

            </form>

            {/* ==================================================
                RIGHT SIDE
            ================================================== */}

            <div
              className="
                flex
                items-center
                gap-1
                sm:gap-2
                shrink-0
              "
            >

              {/* WISHLIST */}

              {user && (

                <Link
                  to="/wishlist"
                  className="
                    hidden
                    sm:flex
                    w-10
                    h-10
                    items-center
                    justify-center
                    rounded-lg
                    text-slate-700
                    hover:bg-slate-100
                    hover:text-red-500
                  "
                  title="Wishlist"
                >
                  ❤️
                </Link>

              )}

              {/* NOTIFICATION */}

              {user && (

                <div className="hidden sm:block">
                  <NotificationBell />
                </div>

              )}

              {/* CART */}

              <Link
                to="/cart"
                className="
                  relative
                  w-10
                  h-10
                  flex
                  items-center
                  justify-center
                  rounded-lg
                  text-slate-700
                  hover:bg-slate-100
                "
                title="Cart"
              >

                🛒

                {cartCount > 0 && (

                  <span
                    className="
                      absolute
                      -top-0.5
                      -right-0.5
                      min-w-5
                      h-5
                      px-1
                      rounded-full
                      bg-teal-600
                      text-white
                      text-[10px]
                      font-bold
                      flex
                      items-center
                      justify-center
                    "
                  >
                    {cartCount}
                  </span>

                )}

              </Link>

              {/* ==================================================
                  ACCOUNT
              ================================================== */}

              <div className="relative">

                <button
                  type="button"
                  onClick={() =>
                    setAccountOpen(
                      !accountOpen
                    )
                  }
                  className="
                    flex
                    items-center
                    gap-2
                    px-2
                    sm:px-3
                    py-2
                    rounded-lg
                    hover:bg-slate-100
                  "
                >

                  <div
                    className="
                      w-8
                      h-8
                      rounded-full
                      bg-slate-100
                      flex
                      items-center
                      justify-center
                    "
                  >
                    👤
                  </div>

                  <div
                    className="
                      hidden
                      lg:block
                      text-left
                    "
                  >

                    <p
                      className="
                        text-[10px]
                        text-slate-400
                      "
                    >
                      Account
                    </p>

                    <p
                      className="
                        text-xs
                        font-semibold
                        text-slate-700
                        max-w-24
                        truncate
                      "
                    >
                      {user
                        ? user.name ||
                          'Account'
                        : 'Login'}
                    </p>

                  </div>

                </button>

                {/* ACCOUNT DROPDOWN */}

                {accountOpen && (

                  <div
                    className="
                      absolute
                      right-0
                      top-full
                      mt-2
                      w-56
                      bg-white
                      border
                      border-slate-200
                      rounded-xl
                      shadow-xl
                      p-2
                    "
                  >

                    {!user ? (

                      <>
                        <Link
                          to="/login"
                          onClick={() =>
                            setAccountOpen(
                              false
                            )
                          }
                          className="
                            block
                            px-4
                            py-3
                            rounded-lg
                            text-sm
                            font-semibold
                            text-slate-700
                            hover:bg-teal-50
                          "
                        >
                          🔐 Login
                        </Link>

                        <Link
                          to="/register"
                          onClick={() =>
                            setAccountOpen(
                              false
                            )
                          }
                          className="
                            block
                            px-4
                            py-3
                            rounded-lg
                            text-sm
                            font-semibold
                            text-slate-700
                            hover:bg-slate-50
                          "
                        >
                          📝 Register
                        </Link>
                      </>

                    ) : (

                      <>

                        {/* USER */}

                        <div
                          className="
                            px-4
                            py-3
                            border-b
                            border-slate-100
                            mb-1
                          "
                        >

                          <p
                            className="
                              text-sm
                              font-bold
                              text-slate-800
                            "
                          >
                            {user.name ||
                              'User'}
                          </p>

                          <p
                            className="
                              text-xs
                              text-slate-500
                              mt-1
                            "
                          >
                            {user.role ===
                            'admin'
                              ? 'Administrator'
                              : 'Customer'}
                          </p>

                        </div>

                        {/* ADMIN DASHBOARD */}

                        {user.role ===
                          'admin' && (

                          <button
                            type="button"
                            onClick={() => {

                              navigate(
                                '/admin/dashboard'
                              );

                              setAccountOpen(
                                false
                              );

                            }}
                            className="
                              w-full
                              text-left
                              px-4
                              py-3
                              rounded-lg
                              text-sm
                              font-semibold
                              text-teal-700
                              hover:bg-teal-50
                            "
                          >
                            📊 Admin Dashboard
                          </button>

                        )}

                        {/* CUSTOMER DASHBOARD */}

                        {user.role !==
                          'admin' && (

                          <button
                            type="button"
                            onClick={() => {

                              navigate(
                                '/dashboard'
                              );

                              setAccountOpen(
                                false
                              );

                            }}
                            className="
                              w-full
                              text-left
                              px-4
                              py-3
                              rounded-lg
                              text-sm
                              font-semibold
                              text-slate-700
                              hover:bg-slate-50
                            "
                          >
                            👤 My Dashboard
                          </button>

                        )}

                        {/* LOGOUT */}

                        <button
                          type="button"
                          onClick={
                            handleLogout
                          }
                          className="
                            w-full
                            text-left
                            px-4
                            py-3
                            rounded-lg
                            text-sm
                            font-semibold
                            text-red-600
                            hover:bg-red-50
                          "
                        >
                          🚪 Logout
                        </button>

                      </>

                    )}

                  </div>

                )}

              </div>

            </div>

          </div>

          {/* ==================================================
              MOBILE SEARCH
          ================================================== */}

          <form
            onSubmit={handleSearch}
            className="
              md:hidden
              pb-3
            "
          >

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search products..."
              className="
                w-full
                h-11
                px-4
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                text-sm
                outline-none
                focus:border-teal-500
              "
            />

          </form>

        </div>

      </header>

      {/* ======================================================
          MOBILE BACKDROP
      ====================================================== */}

      {mobileMenuOpen && (

        <div
          className="
            fixed
            inset-0
            z-[55]
            bg-black/30
            lg:hidden
          "
          onClick={
            closeMobileMenu
          }
        />

      )}

      {/* ======================================================
          MOBILE MENU
      ====================================================== */}

      <aside
        className={`
          fixed
          top-0
          left-0
          z-[60]
          h-full
          w-[85%]
          max-w-sm
          bg-white
          shadow-2xl
          transition-transform
          duration-300
          lg:hidden
          ${
            mobileMenuOpen
              ? 'translate-x-0'
              : '-translate-x-full'
          }
        `}
      >

        {/* HEADER */}

        <div
          className="
            h-16
            px-4
            border-b
            border-slate-200
            flex
            items-center
            justify-between
          "
        >

          <Link
            to="/"
            onClick={
              closeMobileMenu
            }
            className="
              font-bold
              text-slate-800
            "
          >
            Shanti Enterprises
          </Link>

          <button
            type="button"
            onClick={
              closeMobileMenu
            }
            className="
              w-9
              h-9
              rounded-lg
              flex
              items-center
              justify-center
              text-slate-600
              hover:bg-slate-100
            "
          >
            ✕
          </button>

        </div>

        {/* CONTENT */}

        <div
          className="
            h-[calc(100%-4rem)]
            overflow-y-auto
            p-4
          "
        >

          {/* ==================================================
              USER / LOGIN
          ================================================== */}

          {user ? (

            <div
              className="
                mb-4
                p-4
                rounded-xl
                bg-teal-50
                border
                border-teal-100
              "
            >

              <div className="flex items-center gap-3">

                <div
                  className="
                    w-11
                    h-11
                    rounded-full
                    bg-teal-600
                    text-white
                    flex
                    items-center
                    justify-center
                    font-bold
                  "
                >
                  {user.name
                    ? user.name
                        .charAt(0)
                        .toUpperCase()
                    : 'U'}
                </div>

                <div>

                  <p
                    className="
                      text-sm
                      font-bold
                      text-slate-800
                    "
                  >
                    {user.name ||
                      'Account'}
                  </p>

                  <p
                    className="
                      text-xs
                      text-teal-600
                      mt-0.5
                    "
                  >
                    {user.role ===
                    'admin'
                      ? 'Administrator'
                      : 'Customer'}
                  </p>

                </div>

              </div>

              {/* ADMIN DASHBOARD */}

              {user.role ===
                'admin' && (

                <button
                  type="button"
                  onClick={() => {

                    navigate(
                      '/admin/dashboard'
                    );

                    closeMobileMenu();

                  }}
                  className="
                    w-full
                    mt-4
                    py-3
                    rounded-lg
                    bg-teal-600
                    text-white
                    font-semibold
                    text-sm
                  "
                >
                  📊 Admin Dashboard
                </button>

              )}

              {/* CUSTOMER DASHBOARD */}

              {user.role !==
                'admin' && (

                <button
                  type="button"
                  onClick={() => {

                    navigate(
                      '/dashboard'
                    );

                    closeMobileMenu();

                  }}
                  className="
                    w-full
                    mt-4
                    py-3
                    rounded-lg
                    bg-teal-600
                    text-white
                    font-semibold
                    text-sm
                  "
                >
                  👤 My Dashboard
                </button>

              )}

            </div>

          ) : (

            <Link
              to="/login"
              onClick={
                closeMobileMenu
              }
              className="
                mb-4
                block
                text-center
                py-3
                rounded-xl
                bg-teal-600
                text-white
                font-semibold
              "
            >
              🔐 Login
            </Link>

          )}

          {/* ==================================================
              MENU LINKS
          ================================================== */}

          <div className="space-y-1">

            {mobileLinks.map(
              (item) => {

                if (
                  item.auth &&
                  !user
                ) {
                  return null;
                }

                return (

                  <Link
                    key={
                      item.label
                    }
                    to={
                      item.path
                    }
                    onClick={
                      closeMobileMenu
                    }
                    className="
                      flex
                      items-center
                      justify-between
                      px-4
                      py-3.5
                      rounded-xl
                      text-sm
                      font-medium
                      text-slate-700
                      hover:bg-teal-50
                      hover:text-teal-700
                    "
                  >

                    <span>
                      {item.label}
                    </span>

                    <span>
                      →
                    </span>

                  </Link>

                );

              }
            )}

            {/* CART */}

            <Link
              to="/cart"
              onClick={
                closeMobileMenu
              }
              className="
                flex
                items-center
                justify-between
                px-4
                py-3.5
                rounded-xl
                text-sm
                font-medium
                text-slate-700
                hover:bg-teal-50
              "
            >

              <span>
                Cart
              </span>

              {cartCount > 0 && (

                <span
                  className="
                    min-w-6
                    h-6
                    px-1.5
                    rounded-full
                    bg-teal-600
                    text-white
                    text-xs
                    font-bold
                    flex
                    items-center
                    justify-center
                  "
                >
                  {cartCount}
                </span>

              )}

            </Link>

          </div>

          {/* ==================================================
              DIVIDER
          ================================================== */}

          <div
            className="
              my-5
              border-t
              border-slate-200
            "
          />

          {/* ==================================================
              AUTH
          ================================================== */}

          {!user ? (

            <div className="space-y-2">

              <Link
                to="/login"
                onClick={
                  closeMobileMenu
                }
                className="
                  block
                  w-full
                  text-center
                  py-3
                  rounded-xl
                  border
                  border-slate-200
                  text-slate-700
                  font-semibold
                "
              >
                Login
              </Link>

              <Link
                to="/register"
                onClick={
                  closeMobileMenu
                }
                className="
                  block
                  w-full
                  text-center
                  py-3
                  rounded-xl
                  bg-slate-900
                  text-white
                  font-semibold
                "
              >
                Register
              </Link>

            </div>

          ) : (

            <button
              type="button"
              onClick={
                handleLogout
              }
              className="
                w-full
                py-3
                rounded-xl
                border
                border-red-200
                text-red-600
                font-semibold
                hover:bg-red-50
              "
            >
              🚪 Logout
            </button>

          )}

        </div>

      </aside>
    </>
  );
};

export default Navbar;