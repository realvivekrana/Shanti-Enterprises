// ============================================================
// SHANTI ENTERPRISES
// Header
// ============================================================

import {
  Link,
} from "react-router-dom";

import {
  useAuth,
} from "../../context/AuthContext";

import {
  useCart,
} from "../../context/CartContext";

function Header() {
  const {
    user,
    isAuthenticated,
    logout,
  } = useAuth();

  const {
    totalItems,
  } = useCart();

  return (
    <header className="app-header">

      <div className="app-header-inner">

        <Link
          to="/"
          className="app-logo"
        >
          Shanti Enterprises
        </Link>

        <nav className="app-nav">

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
            Cart ({totalItems})
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/dashboard">
                Dashboard
              </Link>

              <Link to="/profile">
                Profile
              </Link>

              <Link to="/addresses">
                Addresses
              </Link>

              <Link to="/orders">
                My Orders
              </Link>

              <span>
                Welcome,{" "}
                {user?.name}
              </span>

              {user?.role ===
                "admin" && (
                <Link to="/admin/test">
                  Admin
                </Link>
              )}

              <button
                type="button"
                onClick={logout}
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login">
              Login
            </Link>
          )}

        </nav>

      </div>

    </header>
  );
}

export default Header;