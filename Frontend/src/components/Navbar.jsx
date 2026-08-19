import {
  Link,
  useNavigate,
} from 'react-router-dom';

import {
  useCart,
} from '../context/CartContext';

import NotificationBell from './NotificationBell';


const categoryLinks = [

  {
    label: 'Home',
    category: '',
  },

  {
    label: 'Courier Bag',
    category: 'Courier Bags',
  },

  {
    label: 'Boxes & Tapes',
    category: 'Boxes,Tapes',
  },

  {
    label: 'Labels & Stickers',
    category: 'Labels',
  },

  {
    label: 'Paper Shredded',
    category: 'Paper Shredded',
  },

];


const Navbar = () => {

  const {
    cartCount,
  } = useCart();


  const navigate =
    useNavigate();


  // ==================================================
  // USER
  // ==================================================

  const userInfo =
    localStorage.getItem(
      'userInfo'
    );


  let user = null;


  if (userInfo) {

    try {

      user =
        JSON.parse(
          userInfo
        );

    } catch (error) {

      console.error(
        'Invalid userInfo:',
        error
      );

      localStorage.removeItem(
        'userInfo'
      );

    }

  }


  // ==================================================
  // LOGOUT
  // ==================================================

  const handleLogout = () => {

    localStorage.removeItem(
      'userInfo'
    );


    navigate('/');


    window.location.reload();

  };


  // ==================================================
  // CATEGORY
  // ==================================================

  const goToCategory = (
    category
  ) => {

    navigate(

      category
        ? `/?category=${category}`
        : '/'

    );

  };


  return (

    <nav
      className="
        bg-white
        border-b
        border-slate-200
        sticky
        top-0
        z-50
      "
    >


      {/* ==================================================
          MAIN NAVBAR
      ================================================== */}

      <div
        className="
          max-w-7xl
          mx-auto
          px-4
          py-4
          flex
          items-center
          justify-between
        "
      >


        {/* ==================================================
            LOGO
        ================================================== */}

        <Link
          to="/"
          className="
            flex
            items-center
            gap-2
          "
        >

          <div
            className="
              w-9
              h-9
              bg-teal-600
              rounded-lg
              flex
              items-center
              justify-center
              text-white
              font-bold
              text-lg
            "
          >

            S

          </div>


          <span
            className="
              text-lg
              font-bold
              text-slate-800
            "
          >

            Shanti Enterprises

          </span>

        </Link>


        {/* ==================================================
            RIGHT SIDE
        ================================================== */}

        <div
          className="
            flex
            items-center
            gap-5
          "
        >


          {/* ==================================================
              USER
          ================================================== */}

          {user ? (

            <div
              className="
                flex
                items-center
                gap-3
                text-sm
              "
            >

              <span
                className="
                  text-slate-500
                  hidden
                  sm:inline
                "
              >

                Hi, {user.name}

              </span>


              <button

                onClick={
                  handleLogout
                }

                className="
                  text-slate-600
                  hover:text-teal-600
                  font-medium
                  transition-colors
                "
              >

                Logout

              </button>

            </div>

          ) : (

            <Link

              to="/login"

              className="
                text-sm
                font-medium
                text-slate-600
                hover:text-teal-600
                transition-colors
              "
            >

              Login

            </Link>

          )}


          {/* ==================================================
              BULK ORDER
          ================================================== */}

          <Link

            to="/bulk-order-upload"

            className="
              hidden
              sm:flex
              items-center
              gap-2
              px-3
              py-2
              rounded-lg
              bg-teal-50
              text-teal-700
              hover:bg-teal-100
              font-medium
              transition-colors
            "

            title="Bulk Order Upload"

          >

            📊

            <span>
              Bulk Order
            </span>

          </Link>


          {/* ==================================================
              NOTIFICATIONS
          ================================================== */}

          {user && (

            <NotificationBell />

          )}


          {/* ==================================================
              CART
          ================================================== */}

          <Link

            to="/cart"

            className="
              relative
              flex
              items-center
              justify-center
              w-10
              h-10
              rounded-lg
              hover:bg-slate-100
              transition-colors
            "

            title="Shopping Cart"

          >

            <svg

              className="
                w-5
                h-5
                text-slate-700
              "

              fill="none"

              viewBox="0 0 24 24"

              stroke="currentColor"

              strokeWidth={1.8}

            >

              <path

                strokeLinecap="round"

                strokeLinejoin="round"

                d="
                  M2.25 3h1.386
                  c.51 0 .955.343 1.087.835
                  l.383 1.437
                  M7.5 14.25
                  a3 3 0 00-3 3h15.75
                  m-12.75-3h11.218
                  c1.121-2.3
                  1.947-4.804
                  2.415-7.454
                  a1.125 1.125 0 00-1.11-1.296H5.25
                  M7.5 14.25L5.106 5.272
                  M6 20.25
                  a.75.75 0 11-1.5 0
                  .75.75 0 011.5 0zm12.75 0
                  a.75.75 0 11-1.5 0
                  .75.75 0 01-1.5 0z
                "

              />

            </svg>


            {cartCount > 0 && (

              <span
                className="
                  absolute
                  -top-1
                  -right-1
                  bg-teal-600
                  text-white
                  text-xs
                  font-semibold
                  rounded-full
                  w-5
                  h-5
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

      </div>


      {/* ==================================================
          CATEGORY / USER MENU BAR
      ================================================== */}

      <div
        className="
          border-t
          border-slate-100
        "
      >

        <div
          className="
            max-w-7xl
            mx-auto
            px-4
            flex
            items-center
            gap-8
            text-sm
            font-medium
            text-slate-600
            overflow-x-auto
          "
        >


          {/* ==================================================
              CATEGORY LINKS
          ================================================== */}

          {categoryLinks.map(

            ({
              label,
              category,
            }) => (

              <button

                key={label}

                onClick={() =>
                  goToCategory(
                    category
                  )
                }

                className="
                  py-3
                  whitespace-nowrap
                  hover:text-teal-600
                  transition-colors
                "
              >

                {label}

              </button>

            )

          )}


          {/* ==================================================
              BULK ORDER MOBILE
          ================================================== */}

          <Link

            to="/bulk-order-upload"

            className="
              sm:hidden
              py-3
              whitespace-nowrap
              hover:text-teal-600
              transition-colors
            "
          >

            📊 Bulk Order

          </Link>


          {/* ==================================================
              MY ORDERS
          ================================================== */}

          {user && (

            <Link

              to="/orders"

              className="
                py-3
                whitespace-nowrap
                hover:text-teal-600
                transition-colors
              "
            >

              📦 My Orders

            </Link>

          )}


          {/* ==================================================
              WISHLIST
          ================================================== */}

          {user && (

            <Link

              to="/wishlist"

              className="
                py-3
                whitespace-nowrap
                hover:text-teal-600
                transition-colors
              "
            >

              ❤️ Wishlist

            </Link>

          )}


          {/* ==================================================
              ADMIN
          ================================================== */}

          {user?.role === 'admin' && (

            <Link

              to="/admin/dashboard"

              className="
                py-3
                whitespace-nowrap
                font-semibold
                text-teal-600
                hover:text-teal-700
                transition-colors
              "
            >

              👨‍💼 Admin

            </Link>

          )}


          {/* ==================================================
              MORE
          ================================================== */}

          <button

            onClick={() =>
              goToCategory('')
            }

            className="
              py-3
              whitespace-nowrap
              hover:text-teal-600
              transition-colors
            "
          >

            More

          </button>

        </div>

      </div>

    </nav>

  );

};


export default Navbar;