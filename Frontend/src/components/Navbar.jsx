import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

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

  const user =
    userInfo
      ? JSON.parse(userInfo)
      : null;


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

    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">

      {/* ==================================================
          MAIN NAVBAR
      ================================================== */}

      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

        {/* ==================================================
            LOGO
        ================================================== */}

        <Link
          to="/"
          className="flex items-center gap-2"
        >

          <div className="w-9 h-9 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
            S
          </div>

          <span className="text-lg font-bold text-slate-800">
            Shanti Enterprises
          </span>

        </Link>


        {/* ==================================================
            RIGHT SIDE
        ================================================== */}

        <div className="flex items-center gap-5">

          {/* ==================================================
              USER
          ================================================== */}

          {user ? (

            <div className="flex items-center gap-3 text-sm">

              <span className="text-slate-500 hidden sm:inline">

                Hi, {user.name}

              </span>


              <button
                onClick={
                  handleLogout
                }
                className="text-slate-600 hover:text-teal-600 font-medium transition-colors"
              >
                Logout
              </button>

            </div>

          ) : (

            <Link
              to="/login"
              className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors"
            >
              Login
            </Link>

          )}


          {/* ==================================================
              CART
          ================================================== */}

          <Link
            to="/cart"
            className="relative flex items-center justify-center w-10 h-10 rounded-lg hover:bg-slate-100 transition-colors"
            title="Shopping Cart"
          >

            <svg
              className="w-5 h-5 text-slate-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.947-4.804 2.415-7.454a1.125 1.125 0 00-1.11-1.296H5.25M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 01-1.5 0z"
              />

            </svg>


            {cartCount > 0 && (

              <span className="absolute -top-1 -right-1 bg-teal-600 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">

                {cartCount}

              </span>

            )}

          </Link>

        </div>

      </div>


      {/* ==================================================
          CATEGORY / USER MENU BAR
      ================================================== */}

      <div className="border-t border-slate-100">

        <div className="max-w-7xl mx-auto px-4 flex items-center gap-8 text-sm font-medium text-slate-600 overflow-x-auto">


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
                className="py-3 whitespace-nowrap hover:text-teal-600 transition-colors"
              >
                {label}
              </button>

            )
          )}


          {/* ==================================================
              MY ORDERS
          ================================================== */}

          {user && (

            <Link
              to="/orders"
              className="py-3 whitespace-nowrap hover:text-teal-600 transition-colors"
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
              className="py-3 whitespace-nowrap hover:text-teal-600 transition-colors"
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
              className="py-3 whitespace-nowrap font-semibold text-teal-600 hover:text-teal-700 transition-colors"
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
            className="py-3 whitespace-nowrap hover:text-teal-600 transition-colors"
          >
            More
          </button>

        </div>

      </div>

    </nav>

  );
};


export default Navbar;