// ============================================================
// SHANTI ENTERPRISES
// Footer
// Frontend Phase 6 - UI/UX
// ============================================================

import {
  Link,
} from "react-router-dom";

import {
  useAuth,
} from "../../context/AuthContext";

// ============================================================
// FOOTER
// ============================================================

function Footer() {
  const currentYear =
    new Date().getFullYear();

  const {
    isAuthenticated,
    isAdmin,
  } = useAuth();

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <footer className="site-footer">

      <div className="footer-container">

        {/* ==================================================
            BRAND
            ================================================== */}

        <div className="footer-brand">

          <Link
            to="/"
            className="footer-logo"
          >
            <span className="footer-logo-mark">
              SE
            </span>

            <span>
              Shanti Enterprises
            </span>
          </Link>

          <p className="footer-description">
            Your trusted destination for
            quality products and reliable
            business solutions.
          </p>

        </div>

        {/* ==================================================
            QUICK LINKS
            ================================================== */}

        <div className="footer-column">

          <h3>
            Quick Links
          </h3>

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

        </div>

        {/* ==================================================
            ACCOUNT
            ================================================== */}

        <div className="footer-column">

          <h3>
            Account
          </h3>

          {!isAuthenticated && (
            <Link to="/login">
              Login
            </Link>
          )}

          {isAuthenticated && (
            <>
              {isAdmin ? (
                <Link to="/admin">
                  Admin Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/dashboard">
                    Dashboard
                  </Link>

                  <Link to="/orders">
                    My Orders
                  </Link>

                  <Link to="/profile">
                    Profile
                  </Link>
                </>
              )}
            </>
          )}

          {!isAuthenticated && (
            <Link to="/register">
              Create Account
            </Link>
          )}

        </div>

        {/* ==================================================
            SUPPORT
            ================================================== */}

        <div className="footer-column">

          <h3>
            Support
          </h3>

          <a
            href="mailto:support@shantienterprises.com"
          >
            Email Support
          </a>

          <a
            href="tel:+919999999999"
          >
            Contact Us
          </a>

          <p>
            Pune, Maharashtra,
            India
          </p>

        </div>

      </div>

      {/* ====================================================
          BOTTOM
          ==================================================== */}

      <div className="footer-bottom">

        <div className="footer-bottom-container">

          <p>
            © {currentYear}{" "}
            Shanti Enterprises.
            All rights reserved.
          </p>

          <div className="footer-bottom-links">

            <Link to="/">
              Privacy
            </Link>

            <Link to="/">
              Terms
            </Link>

          </div>

        </div>

      </div>

    </footer>
  );
}

export default Footer;