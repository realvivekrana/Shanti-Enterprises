// ============================================================
// SHANTI ENTERPRISES
// Home Page
// Frontend Phase 6 - UI/UX
// ============================================================

import {
  Link,
} from "react-router-dom";

// ============================================================
// HOME PAGE
// ============================================================

function HomePage() {
  return (
    <div className="home-page">

      {/* ====================================================
          HERO SECTION
          ==================================================== */}

      <section className="home-hero">

        <div className="home-container home-hero-grid">

          {/* HERO CONTENT */}

          <div className="home-hero-content">

            <span className="home-hero-badge">
              Trusted Business Partner
            </span>

            <h1>
              Quality Products.
              <br />
              Reliable Business.
            </h1>

            <p>
              Discover quality products from
              Shanti Enterprises with reliable
              service and a smooth shopping
              experience.
            </p>

            <div className="home-hero-actions">

              <Link
                to="/products"
                className="home-primary-button"
              >
                Explore Products
              </Link>

              <Link
                to="/categories"
                className="home-secondary-button"
              >
                Browse Categories
              </Link>

            </div>

          </div>

          {/* HERO VISUAL */}

          <div className="home-hero-visual">

            <div className="home-hero-card">

              <span className="home-hero-card-icon">
                SE
              </span>

              <h2>
                Shanti Enterprises
              </h2>

              <p>
                Quality you can trust,
                service you can rely on.
              </p>

              <div className="home-hero-card-line" />

              <div className="home-hero-mini-grid">

                <div>
                  <strong>
                    Quality
                  </strong>

                  <span>
                    Products
                  </span>
                </div>

                <div>
                  <strong>
                    Reliable
                  </strong>

                  <span>
                    Service
                  </span>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ====================================================
          FEATURES
          ==================================================== */}

      <section className="home-section">

        <div className="home-container">

          <div className="home-section-heading">

            <span>
              WHY CHOOSE US
            </span>

            <h2>
              Built around your business needs
            </h2>

            <p>
              We focus on quality products,
              dependable service and a simple
              purchasing experience.
            </p>

          </div>

          <div className="home-feature-grid">

            <article className="home-feature-card">

              <div className="home-feature-icon">
                ✓
              </div>

              <h3>
                Quality Products
              </h3>

              <p>
                Carefully selected products
                designed to meet your
                requirements.
              </p>

            </article>

            <article className="home-feature-card">

              <div className="home-feature-icon">
                ⚡
              </div>

              <h3>
                Fast Service
              </h3>

              <p>
                Simple ordering and
                responsive service for
                your business.
              </p>

            </article>

            <article className="home-feature-card">

              <div className="home-feature-icon">
                ₹
              </div>

              <h3>
                Competitive Pricing
              </h3>

              <p>
                Value-focused pricing
                for individual and
                business requirements.
              </p>

            </article>

            <article className="home-feature-card">

              <div className="home-feature-icon">
                ★
              </div>

              <h3>
                Trusted Service
              </h3>

              <p>
                A dependable partner
                for your ongoing product
                requirements.
              </p>

            </article>

          </div>

        </div>

      </section>

      {/* ====================================================
          SHOPPING SECTION
          ==================================================== */}

      <section className="home-section home-shopping-section">

        <div className="home-container">

          <div className="home-shopping-grid">

            <div>

              <span className="home-eyebrow">
                SHOP WITH CONFIDENCE
              </span>

              <h2>
                Find what your business needs.
              </h2>

              <p>
                Explore our product collection,
                browse categories and add the
                products you need to your cart.
              </p>

              <Link
                to="/products"
                className="home-primary-button"
              >
                Start Shopping
              </Link>

            </div>

            <div className="home-shopping-box">

              <div className="home-shopping-item">
                <span>
                  01
                </span>

                <div>
                  <strong>
                    Browse
                  </strong>

                  <p>
                    Find products and categories.
                  </p>
                </div>
              </div>

              <div className="home-shopping-item">
                <span>
                  02
                </span>

                <div>
                  <strong>
                    Add to Cart
                  </strong>

                  <p>
                    Select the quantity you need.
                  </p>
                </div>
              </div>

              <div className="home-shopping-item">
                <span>
                  03
                </span>

                <div>
                  <strong>
                    Checkout
                  </strong>

                  <p>
                    Complete your order securely.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ====================================================
          CTA
          ==================================================== */}

      <section className="home-cta-section">

        <div className="home-container">

          <div className="home-cta">

            <div>

              <span className="home-eyebrow">
                READY TO GET STARTED?
              </span>

              <h2>
                Explore our products today.
              </h2>

              <p>
                Find the products you need
                and start your order.
              </p>

            </div>

            <Link
              to="/products"
              className="home-cta-button"
            >
              View Products
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
}

export default HomePage;