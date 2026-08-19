import { useState } from 'react';
import {
  Link,
  useNavigate,
} from 'react-router-dom';

import { useCart } from '../context/CartContext';

import NotificationBell from './NotificationBell';


// ======================================================
// NAVBAR
// ======================================================

const Navbar = () => {

  const navigate = useNavigate();

  const {
    cartCount,
  } = useCart();


  // ====================================================
  // STATES
  // ====================================================

  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);


  const [
    categoryOpen,
    setCategoryOpen,
  ] = useState(false);


  const [
    search,
    setSearch,
  ] = useState('');


  // ====================================================
  // USER
  // ====================================================

  const userInfo =
    localStorage.getItem('userInfo');


  let user = null;


  if (userInfo) {

    try {

      user =
        JSON.parse(
          userInfo
        );

    } catch (error) {

      console.error(
        'Invalid user information:',
        error
      );

    }

  }


  // ====================================================
  // SEARCH
  // ====================================================

  const handleSearch = (e) => {

    e.preventDefault();


    const value =
      search.trim();


    if (!value) {

      navigate('/products');

      return;

    }


    navigate(
      `/products?search=${encodeURIComponent(value)}`
    );


    setSearch('');

    setMobileMenuOpen(false);

  };


  // ====================================================
  // CLOSE MOBILE MENU
  // ====================================================

  const closeMobileMenu = () => {

    setMobileMenuOpen(false);

    setCategoryOpen(false);

  };


  // ====================================================
  // LOGOUT
  // ====================================================

  const handleLogout = () => {

    localStorage.removeItem(
      'userInfo'
    );


    localStorage.removeItem(
      'token'
    );


    closeMobileMenu();


    navigate('/login');

    window.location.reload();

  };


  // ====================================================
  // MOBILE MENU ITEMS
  // ====================================================

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


  // ====================================================
  // CATEGORY ITEMS
  // ====================================================

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
              MAIN NAVBAR ROW
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

              {/* MOBILE MENU BUTTON */}

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
                  transition
                "
                aria-label="Menu"
              >

                {mobileMenuOpen ? (

                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />

                  </svg>

                ) : (

                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />

                  </svg>

                )}

              </button>


              {/* LOGO */}

              <Link
                to="/"
                onClick={
                  closeMobileMenu
                }
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
                    sm:text-xl
                  "
                >

                  S

                </div>


                <div
                  className="
                    hidden
                    sm:block
                  "
                >

                  <div
                    className="
                      text-sm
                      sm:text-base
                      font-bold
                      text-slate-800
                      leading-tight
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

              <div
                className="
                  relative
                "
              >

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
                    transition
                  "
                >

                  Categories

                  <svg
                    className="
                      w-4
                      h-4
                    "
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />

                  </svg>

                </button>


                {/* CATEGORY DROPDOWN */}

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
                        setCategoryOpen(
                          false
                        )
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
                        hover:text-teal-700
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
                            hover:text-teal-600
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
                  transition
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
                  transition
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
                  transition
                "
              >

                RFQ

              </Link>

            </nav>


            {/* ==================================================
                DESKTOP SEARCH
            ================================================== */}

            <form
              onSubmit={
                handleSearch
              }
              className="
                hidden
                md:flex
                lg:flex
                flex-1
                max-w-md
                mx-6
              "
            >

              <div
                className="
                  relative
                  w-full
                "
              >

                <svg
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    w-5
                    h-5
                    text-slate-400
                  "
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="
                      m21 21-4.35-4.35
                      m0 0A7.5 7.5 0 1 0
                      6.05 6.05a7.5 7.5 0 0 0
                      10.6 10.6Z
                    "
                  />

                </svg>


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
                    pl-10
                    pr-4
                    rounded-lg
                    border
                    border-slate-200
                    bg-slate-50
                    text-sm
                    text-slate-700
                    outline-none
                    placeholder:text-slate-400
                    focus:border-teal-500
                    focus:ring-2
                    focus:ring-teal-100
                    transition
                  "
                />

              </div>

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
                    transition
                  "
                  title="Wishlist"
                >

                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="
                        M20.84 4.61
                        a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06
                        a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84
                        a5.5 5.5 0 0 0 0-7.78Z
                      "
                    />

                  </svg>

                </Link>

              )}


              {/* NOTIFICATION */}

              {user && (

                <div
                  className="
                    hidden
                    sm:block
                  "
                >

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
                  transition
                "
                title="Cart"
              >

                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="
                      M2.25 3h1.386
                      c.51 0 .955.343 1.087.835
                      l.383 1.437
                      M7.5 14.25
                      a3 3 0 0 0-3 3h15.75
                      m-12.75-3h11.218
                      c1.121-2.3
                      1.947-4.804
                      2.415-7.454
                      a1.125 1.125 0 0 0-1.11-1.296H5.25
                      M7.5 14.25L5.106 5.272
                    "
                  />

                </svg>


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


              {/* ACCOUNT */}

              <Link
                to={
                  user
                    ? '/profile'
                    : '/login'
                }
                className="
                  hidden
                  sm:flex
                  items-center
                  gap-2
                  px-2
                  sm:px-3
                  py-2
                  rounded-lg
                  hover:bg-slate-100
                  transition
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
                    text-slate-600
                  "
                >

                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="
                        M15.75 6a3.75 3.75 0 1 1-7.5 0
                        3.75 3.75 0 0 1 7.5 0ZM4.5 20.25
                        a7.5 7.5 0 0 1 15 0
                      "
                    />

                  </svg>

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
                      ? user.name || 'Account'
                      : 'Login'}

                  </p>

                </div>

              </Link>

            </div>

          </div>


          {/* ==================================================
              MOBILE SEARCH
          ================================================== */}

          <form
            onSubmit={
              handleSearch
            }
            className="
              md:hidden
              pb-3
            "
          >

            <div
              className="
                relative
              "
            >

              <svg
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  w-5
                  h-5
                  text-slate-400
                "
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="
                    m21 21-4.35-4.35
                    m0 0A7.5 7.5 0 1 0
                    6.05 6.05a7.5 7.5 0 0 0
                    10.6 10.6Z
                  "
                />

              </svg>


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
                  pl-10
                  pr-4
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  text-sm
                  outline-none
                  placeholder:text-slate-400
                  focus:border-teal-500
                  focus:ring-2
                  focus:ring-teal-100
                "
              />

            </div>

          </form>

        </div>

      </header>


      {/* ======================================================
          MOBILE MENU BACKDROP
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

        {/* MOBILE MENU HEADER */}

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

            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />

            </svg>

          </button>

        </div>


        {/* MOBILE MENU CONTENT */}

        <div
          className="
            h-[calc(100%-4rem)]
            overflow-y-auto
            p-4
          "
        >

          {/* USER */}

          {user ? (

            <Link
              to="/profile"
              onClick={
                closeMobileMenu
              }
              className="
                mb-4
                flex
                items-center
                gap-3
                p-4
                rounded-xl
                bg-teal-50
                border
                border-teal-100
              "
            >

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

                  View Profile

                </p>

              </div>

            </Link>

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

              Login

            </Link>

          )}


          {/* MENU LINKS */}

          <div
            className="
              space-y-1
            "
          >

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
                      transition
                    "
                  >

                    <span>
                      {item.label}
                    </span>

                    <span
                      className="
                        text-slate-400
                      "
                    >
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
                hover:text-teal-700
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


          {/* DIVIDER */}

          <div
            className="
              my-5
              border-t
              border-slate-200
            "
          />


          {/* MOBILE AUTH */}

          {!user ? (

            <div
              className="
                space-y-2
              "
            >

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
                  hover:bg-slate-50
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
                  hover:bg-slate-800
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

              Logout

            </button>

          )}

        </div>

      </aside>

    </>

  );

};


export default Navbar;