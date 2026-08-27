// ============================================================
// SHANTI ENTERPRISES
// Header / Navbar
// Frontend Phase 6 - UI/UX
// ============================================================

import {
  useState,
} from "react";

import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../../context/AuthContext";

// ============================================================
// HEADER
// ============================================================

function Header() {
  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);

  const [
    logoutLoading,
    setLogoutLoading,
  ] = useState(false);

  const navigate =
    useNavigate();

  // ==========================================================
  // AUTH DATA
  // ==========================================================

  const {
    user,
    isAuthenticated,
    isAdmin,
    logout,
  } = useAuth();

  // ==========================================================
  // LOGOUT
  // ==========================================================

  const handleLogout = async () => {
    if (logoutLoading) {
      return;
    }

    try {
      setLogoutLoading(true);

      setMobileMenuOpen(false);

      await logout();

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );

      // Even if API logout fails,
      // AuthContext clears frontend state.
      navigate("/login", {
        replace: true,
      });
    } finally {
      setLogoutLoading(false);
    }
  };

  // ==========================================================
  // NAV LINK CLASS
  // ==========================================================

  const getNavClass = ({
    isActive,
  }) => {
    return `header-nav-link ${
      isActive
        ? "header-nav-link-active"
        : ""
    }`;
  };

  // ==========================================================
  // CLOSE MOBILE MENU
  // ==========================================================

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // ==========================================================
  // DASHBOARD PATH
  // ==========================================================

  const dashboardPath =
    isAdmin
      ? "/admin"
      : "/dashboard";

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <header className="site-header">

      <div className="header-container">

        {/* ==================================================
            LOGO
            ================================================== */}

        <Link
          to="/"
          className="header-logo"
          onClick={
            closeMobileMenu
          }
        >
          <span className="header-logo-mark">
            SE
          </span>

          <span className="header-logo-text">
            Shanti Enterprises
          </span>
        </Link>

        {/* ==================================================
            DESKTOP NAV
            ================================================== */}

        <nav className="header-desktop-nav">

          <NavLink
            to="/"
            className={
              getNavClass
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/categories"
            className={
              getNavClass
            }
          >
            Categories
          </NavLink>

          <NavLink
            to="/products"
            className={
              getNavClass
            }
          >
            Products
          </NavLink>

          <NavLink
            to="/cart"
            className={
              getNavClass
            }
          >
            Cart
          </NavLink>

        </nav>

        {/* ==================================================
            DESKTOP ACTIONS
            ================================================== */}

        <div className="header-actions">

          {isAuthenticated ? (
            <>

              {/* USER NAME */}

              <span className="header-user-name">
                {user?.name ||
                  "Account"}
              </span>

              {/* ADMIN / CUSTOMER DASHBOARD */}

              <Link
                to={dashboardPath}
                className="header-action-button"
              >
                {isAdmin
                  ? "Admin"
                  : "Dashboard"}
              </Link>

              {/* LOGOUT */}

              <button
                type="button"
                className="header-logout-button"
                onClick={
                  handleLogout
                }
                disabled={
                  logoutLoading
                }
              >
                {logoutLoading
                  ? "Logging out..."
                  : "Logout"}
              </button>

            </>
          ) : (
            <Link
              to="/login"
              className="header-login-button"
            >
              Login
            </Link>
          )}

        </div>

        {/* ==================================================
            MOBILE MENU BUTTON
            ================================================== */}

        <button
          type="button"
          className="header-mobile-button"
          aria-label={
            mobileMenuOpen
              ? "Close menu"
              : "Open menu"
          }
          aria-expanded={
            mobileMenuOpen
          }
          onClick={() =>
            setMobileMenuOpen(
              (current) =>
                !current
            )
          }
        >
          <span />
          <span />
          <span />
        </button>

      </div>

      {/* ====================================================
          MOBILE NAVIGATION
          ==================================================== */}

      {mobileMenuOpen && (
        <div className="header-mobile-menu">

          <nav className="header-mobile-nav">

            <NavLink
              to="/"
              className={
                getNavClass
              }
              onClick={
                closeMobileMenu
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/categories"
              className={
                getNavClass
              }
              onClick={
                closeMobileMenu
              }
            >
              Categories
            </NavLink>

            <NavLink
              to="/products"
              className={
                getNavClass
              }
              onClick={
                closeMobileMenu
              }
            >
              Products
            </NavLink>

            <NavLink
              to="/cart"
              className={
                getNavClass
              }
              onClick={
                closeMobileMenu
              }
            >
              Cart
            </NavLink>

            {/* ==================================================
                AUTHENTICATED MOBILE ACTIONS
                ================================================== */}

            {isAuthenticated ? (
              <>

                {/* USER */}

                <div className="header-mobile-user">
                  <span>
                    Signed in as
                  </span>

                  <strong>
                    {user?.name ||
                      "Account"}
                  </strong>
                </div>

                {/* DASHBOARD */}

                <NavLink
                  to={dashboardPath}
                  className={
                    getNavClass
                  }
                  onClick={
                    closeMobileMenu
                  }
                >
                  {isAdmin
                    ? "Admin Dashboard"
                    : "Dashboard"}
                </NavLink>

                {/* PROFILE */}

                {!isAdmin && (
                  <NavLink
                    to="/profile"
                    className={
                      getNavClass
                    }
                    onClick={
                      closeMobileMenu
                    }
                  >
                    Profile
                  </NavLink>
                )}

                {/* LOGOUT */}

                <button
                  type="button"
                  className="header-mobile-logout"
                  onClick={
                    handleLogout
                  }
                  disabled={
                    logoutLoading
                  }
                >
                  {logoutLoading
                    ? "Logging out..."
                    : "Logout"}
                </button>

              </>
            ) : (
              <NavLink
                to="/login"
                className={
                  getNavClass
                }
                onClick={
                  closeMobileMenu
                }
              >
                Login
              </NavLink>
            )}

          </nav>

        </div>
      )}

    </header>
  );
}

export default Header;