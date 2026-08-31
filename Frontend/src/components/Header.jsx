// ============================================================
// SHANTI ENTERPRISES
// Header
// Frontend Phase 2 - Shopping
// Updated - RFQ + Quotation Navigation
// ============================================================

import {
  Link,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";

// ============================================================
// HEADER
// ============================================================

function Header() {
  const {
    user,
    isAuthenticated,
    logout,
  } = useAuth();

  const isAdmin =
    user?.role === "admin";

  return (
    <header className="app-header">

      <div className="app-header-inner">

        {/* ==================================================
            BRAND
            ================================================== */}

        <Link
          to="/"
          className="app-logo"
        >
          Shanti Enterprises
        </Link>

        {/* ==================================================
            NAVIGATION
            ================================================== */}

        <nav className="app-nav">

          {/* PUBLIC */}

          <Link to="/">
            Home
          </Link>

          <Link to="/categories">
            Categories
          </Link>

          <Link to="/products">
            Products
          </Link>

          <Link to="/cart">
            Cart
          </Link>

          {/* ==================================================
              AUTHENTICATED USER
              ================================================== */}

          {isAuthenticated ? (
            <>

              <span>
                Welcome,{" "}
                {user?.name ||
                  user?.email ||
                  "User"}
              </span>

              {/* ==================================================
                  CUSTOMER NAVIGATION
                  ================================================== */}

              {!isAdmin && (
                <>

                  <Link to="/dashboard">
                    Dashboard
                  </Link>

                  <Link to="/orders">
                    Orders
                  </Link>

                  <Link to="/rfqs">
                    RFQs
                  </Link>

                  <Link to="/quotations">
                    Quotations
                  </Link>

                  <Link to="/profile">
                    Profile
                  </Link>

                </>
              )}

              {/* ==================================================
                  ADMIN NAVIGATION
                  ================================================== */}

              {isAdmin && (
                <>

                  <Link to="/admin">
                    Admin Dashboard
                  </Link>

                  <Link to="/admin/products">
                    Products
                  </Link>

                  <Link to="/admin/orders">
                    Orders
                  </Link>

                  <Link to="/admin/rfqs">
                    RFQs
                  </Link>

                  <Link to="/admin/quotations">
                    Quotations
                  </Link>

                  <Link to="/admin/users">
                    Users
                  </Link>

                </>
              )}

              {/* ==================================================
                  LOGOUT
                  ================================================== */}

              <button
                type="button"
                onClick={logout}
              >
                Logout
              </button>

            </>
          ) : (
            /* ==================================================
               GUEST
               ================================================== */

            <Link to="/login">
              Login
            </Link>
          )}

        </nav>

      </div>

    </header>
  );
}

// ============================================================
// EXPORT
// ============================================================

export default Header;