// ============================================================
// SHANTI ENTERPRISES
// Header / Navbar
// Mobile First • Premium Responsive UI
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
  ChevronDown,
  Grid2X2,
  Home,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Package,
  ShoppingCart,
  User,
  X,
} from "lucide-react";

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
          aria-label="Shanti Enterprises Home"
        >

          <span className="header-logo-mark">
            SE
          </span>

          <span className="header-logo-content">

            <span className="header-logo-text">
              Shanti Enterprises
            </span>

            <span className="header-logo-subtitle">
              Business Solutions
            </span>

          </span>

        </Link>

        {/* ==================================================
            DESKTOP NAVIGATION
            ================================================== */}

        <nav
          className="header-desktop-nav"
          aria-label="Main navigation"
        >

          <NavLink
            to="/"
            className={
              getNavClass
            }
          >
            <Home
              size={17}
              strokeWidth={2}
            />

            <span>
              Home
            </span>
          </NavLink>

          <NavLink
            to="/categories"
            className={
              getNavClass
            }
          >
            <Grid2X2
              size={17}
              strokeWidth={2}
            />

            <span>
              Categories
            </span>
          </NavLink>

          <NavLink
            to="/products"
            className={
              getNavClass
            }
          >
            <Package
              size={17}
              strokeWidth={2}
            />

            <span>
              Products
            </span>
          </NavLink>

          <NavLink
            to="/cart"
            className={
              getNavClass
            }
          >
            <ShoppingCart
              size={17}
              strokeWidth={2}
            />

            <span>
              Cart
            </span>
          </NavLink>

        </nav>

        {/* ==================================================
            DESKTOP ACTIONS
            ================================================== */}

        <div className="header-actions">

          {isAuthenticated ? (
            <>

              {/* USER */}

              <div className="header-user">

                <div className="header-user-avatar">
                  <User
                    size={17}
                    strokeWidth={2}
                  />
                </div>

                <div className="header-user-info">

                  <span>
                    Welcome
                  </span>

                  <strong>
                    {user?.name ||
                      "Account"}
                  </strong>

                </div>

                <ChevronDown
                  size={15}
                  className="header-user-chevron"
                />

              </div>

              {/* DASHBOARD */}

              <Link
                to={dashboardPath}
                className="header-dashboard-button"
              >

                <LayoutDashboard
                  size={17}
                  strokeWidth={2}
                />

                <span>
                  {isAdmin
                    ? "Admin"
                    : "Dashboard"}
                </span>

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

                <LogOut
                  size={17}
                  strokeWidth={2}
                />

                <span>
                  {logoutLoading
                    ? "Logging out..."
                    : "Logout"}
                </span>

              </button>

            </>
          ) : (
            <Link
              to="/login"
              className="header-login-button"
            >

              <LogIn
                size={17}
                strokeWidth={2}
              />

              <span>
                Login
              </span>

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

          {mobileMenuOpen ? (
            <X
              size={24}
              strokeWidth={2}
            />
          ) : (
            <Menu
              size={24}
              strokeWidth={2}
            />
          )}

        </button>

      </div>

      {/* ====================================================
          MOBILE NAVIGATION
          ==================================================== */}

      {mobileMenuOpen && (
        <div className="header-mobile-menu">

          <div className="header-mobile-menu-inner">

            {/* ==================================================
                MOBILE USER HEADER
                ================================================== */}

            {isAuthenticated && (
              <div className="header-mobile-user-card">

                <div className="header-mobile-user-avatar">
                  <User
                    size={20}
                  />
                </div>

                <div>

                  <span>
                    Signed in as
                  </span>

                  <strong>
                    {user?.name ||
                      "Account"}
                  </strong>

                </div>

              </div>
            )}

            {/* ==================================================
                MOBILE NAV
                ================================================== */}

            <nav
              className="header-mobile-nav"
              aria-label="Mobile navigation"
            >

              <NavLink
                to="/"
                className={
                  getNavClass
                }
                onClick={
                  closeMobileMenu
                }
              >

                <span className="header-mobile-nav-icon">
                  <Home
                    size={18}
                  />
                </span>

                <span>
                  Home
                </span>

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

                <span className="header-mobile-nav-icon">
                  <Grid2X2
                    size={18}
                  />
                </span>

                <span>
                  Categories
                </span>

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

                <span className="header-mobile-nav-icon">
                  <Package
                    size={18}
                  />
                </span>

                <span>
                  Products
                </span>

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

                <span className="header-mobile-nav-icon">
                  <ShoppingCart
                    size={18}
                  />
                </span>

                <span>
                  Cart
                </span>

              </NavLink>

              {/* ==================================================
                  AUTHENTICATED LINKS
                  ================================================== */}

              {isAuthenticated ? (
                <>

                  <NavLink
                    to={dashboardPath}
                    className={
                      getNavClass
                    }
                    onClick={
                      closeMobileMenu
                    }
                  >

                    <span className="header-mobile-nav-icon">
                      <LayoutDashboard
                        size={18}
                      />
                    </span>

                    <span>
                      {isAdmin
                        ? "Admin Dashboard"
                        : "Dashboard"}
                    </span>

                  </NavLink>

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

                      <span className="header-mobile-nav-icon">
                        <User
                          size={18}
                        />
                      </span>

                      <span>
                        Profile
                      </span>

                    </NavLink>
                  )}

                  {/* MOBILE LOGOUT */}

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

                    <span className="header-mobile-nav-icon">
                      <LogOut
                        size={18}
                      />
                    </span>

                    <span>
                      {logoutLoading
                        ? "Logging out..."
                        : "Logout"}
                    </span>

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

                  <span className="header-mobile-nav-icon">
                    <LogIn
                      size={18}
                    />
                  </span>

                  <span>
                    Login
                  </span>

                </NavLink>
              )}

            </nav>

            {/* ==================================================
                MOBILE BUSINESS INFO
                ================================================== */}

            <div className="header-mobile-footer">

              <div className="header-mobile-footer-icon">
                <Package
                  size={17}
                />
              </div>

              <div>

                <strong>
                  Shanti Enterprises
                </strong>

                <span>
                  Reliable B2B Business Solutions
                </span>

              </div>

            </div>

          </div>

        </div>
      )}

    </header>
  );
}

export default Header;