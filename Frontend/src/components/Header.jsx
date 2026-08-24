// ============================================================
// SHANTI ENTERPRISES
// Header
// Frontend Phase 2 - Shopping
// ============================================================

import {
  Link,
} from "react-router-dom";

import {
  useAuth,
} from "../../context/AuthContext";

// ============================================================
// HEADER
// ============================================================

function Header() {
  const {
    user,
    isAuthenticated,
    logout,
  } = useAuth();

  return (
    <header className="app-header">
      <div className="app-header-inner">

        {/* Brand */}

        <Link
          to="/"
          className="app-logo"
        >
          Shanti Enterprises
        </Link>

        {/* Navigation */}

        <nav className="app-nav">

          <Link to="/">
            Home
          </Link>

          <Link to="/categories">
            Categories
          </Link>

          {isAuthenticated ? (
            <>
              <span>
                Welcome, {user?.name}
              </span>

              {user?.role === "admin" && (
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