// ============================================================
// SHANTI ENTERPRISES
// Footer
// Mobile First • Premium Responsive UI
// ============================================================

import {
  Link,
} from "react-router-dom";

import {
  ArrowUpRight,
  Building2,
  ChevronRight,
  Mail,
  MapPin,
  Package,
  Phone,
  ShieldCheck,
  ShoppingBag,
  UserRound,
} from "lucide-react";

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
            BRAND / INTRO
            ================================================== */}

        <div className="footer-brand">

          <Link
            to="/"
            className="footer-logo"
          >

            <span className="footer-logo-mark">
              SE
            </span>

            <span className="footer-logo-content">

              <strong>
                Shanti Enterprises
              </strong>

              <small>
                Business Solutions
              </small>

            </span>

          </Link>

          <p className="footer-description">
            Your trusted destination for
            quality products and reliable
            business solutions.
          </p>

          <div className="footer-trust-badge">

            <ShieldCheck
              size={17}
              strokeWidth={2}
            />

            <span>
              Reliable B2B Business Partner
            </span>

          </div>

        </div>

        {/* ==================================================
            QUICK LINKS
            ================================================== */}

        <div className="footer-column">

          <h3>
            Quick Links
          </h3>

          <Link to="/">

            <span>
              Home
            </span>

            <ChevronRight
              size={15}
            />

          </Link>

          <Link to="/categories">

            <span>
              Categories
            </span>

            <ChevronRight
              size={15}
            />

          </Link>

          <Link to="/products">

            <span>
              Products
            </span>

            <ChevronRight
              size={15}
            />

          </Link>

          <Link to="/cart">

            <span>
              Cart
            </span>

            <ChevronRight
              size={15}
            />

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
            <>
              <Link to="/login">

                <span>
                  Login
                </span>

                <ChevronRight
                  size={15}
                />

              </Link>

              <Link to="/register">

                <span>
                  Create Account
                </span>

                <ChevronRight
                  size={15}
                />

              </Link>
            </>
          )}

          {isAuthenticated && (
            <>
              {isAdmin ? (
                <Link to="/admin">

                  <span>
                    Admin Dashboard
                  </span>

                  <ChevronRight
                    size={15}
                  />

                </Link>
              ) : (
                <>
                  <Link to="/dashboard">

                    <span>
                      Dashboard
                    </span>

                    <ChevronRight
                      size={15}
                    />

                  </Link>

                  <Link to="/orders">

                    <span>
                      My Orders
                    </span>

                    <ChevronRight
                      size={15}
                    />

                  </Link>

                  <Link to="/profile">

                    <span>
                      Profile
                    </span>

                    <ChevronRight
                      size={15}
                    />

                  </Link>
                </>
              )}
            </>
          )}

        </div>

        {/* ==================================================
            SUPPORT
            ================================================== */}

        <div className="footer-column footer-support-column">

          <h3>
            Support
          </h3>

          <a
            href="mailto:support@shantienterprises.com"
            className="footer-contact-link"
          >

            <span className="footer-contact-icon">
              <Mail
                size={16}
              />
            </span>

            <span>
              support@shantienterprises.com
            </span>

            <ArrowUpRight
              size={14}
            />

          </a>

          <a
            href="tel:+919999999999"
            className="footer-contact-link"
          >

            <span className="footer-contact-icon">
              <Phone
                size={16}
              />
            </span>

            <span>
              +91 99999 99999
            </span>

            <ArrowUpRight
              size={14}
            />

          </a>

          <div className="footer-location">

            <span className="footer-contact-icon">
              <MapPin
                size={16}
              />
            </span>

            <span>
              Pune, Maharashtra,
              India
            </span>

          </div>

        </div>

      </div>

      {/* ====================================================
          BUSINESS STRIP
          ==================================================== */}

      <div className="footer-business-strip">

        <div className="footer-business-container">

          <div className="footer-business-item">

            <div className="footer-business-icon">
              <ShoppingBag
                size={18}
              />
            </div>

            <div>

              <strong>
                Quality Products
              </strong>

              <span>
                Reliable product selection
              </span>

            </div>

          </div>

          <div className="footer-business-item">

            <div className="footer-business-icon">
              <Package
                size={18}
              />
            </div>

            <div>

              <strong>
                Business Orders
              </strong>

              <span>
                Built for B2B requirements
              </span>

            </div>

          </div>

          <div className="footer-business-item">

            <div className="footer-business-icon">
              <Building2
                size={18}
              />
            </div>

            <div>

              <strong>
                Business Support
              </strong>

              <span>
                Dedicated customer assistance
              </span>

            </div>

          </div>

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

            <span>
              •
            </span>

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