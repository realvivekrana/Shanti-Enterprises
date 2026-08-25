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

// ============================================================
// HEADER
// ============================================================

function Header() {
  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);

  const navigate =
    useNavigate();

  // ==========================================================
  // AUTH DATA
  // ==========================================================

  const token =
    localStorage.getItem(
      "token"
    ) ||
    localStorage.getItem(
      "accessToken"
    );

  let currentUser = null;

  try {
    const storedUser =
      localStorage.getItem(
        "user"
      );

    if (storedUser) {
      currentUser =
        JSON.parse(
          storedUser
        );
    }
  } catch (error) {
    console.error(
      "Unable to read user:",
      error
    );
  }

  const isLoggedIn =
    Boolean(token);

  const role =
    currentUser?.role ||
    currentUser?.userRole ||
    "";

  const isAdmin =
    role.toLowerCase() ===
    "admin";

  // ==========================================================
  // LOGOUT
  // ==========================================================

  const handleLogout = () => {
    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "accessToken"
    );

    localStorage.removeItem(
      "user"
    );

    setMobileMenuOpen(
      false
    );

    navigate("/login");
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
    setMobileMenuOpen(
      false
    );
  };

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

          {isLoggedIn ? (
            <>
              {isAdmin ? (
                <Link
                  to="/admin"
                  className="header-action-button"
                >
                  Admin
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  className="header-action-button"
                >
                  Dashboard
                </Link>
              )}

              <button
                type="button"
                className="header-logout-button"
                onClick={
                  handleLogout
                }
              >
                Logout
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

            {isLoggedIn ? (
              <>
                <NavLink
                  to={
                    isAdmin
                      ? "/admin"
                      : "/dashboard"
                  }
                  className={
                    getNavClass
                  }
                  onClick={
                    closeMobileMenu
                  }
                >
                  {isAdmin
                    ? "Admin"
                    : "Dashboard"}
                </NavLink>

                <button
                  type="button"
                  className="header-mobile-logout"
                  onClick={
                    handleLogout
                  }
                >
                  Logout
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