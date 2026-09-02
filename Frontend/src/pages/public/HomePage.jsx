// ============================================================
// SHANTI ENTERPRISES
// Home Page
// Mobile First • Premium Responsive UI
// ============================================================

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  ArrowRight,
  Building2,
  Check,
  ChevronRight,
  CreditCard,
  LockKeyhole,
  Package,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Zap,
} from "lucide-react";

import {
  getProducts,
} from "../../api/productApi";

import {
  getCategories,
} from "../../api/categoryApi";

// IMPORTANT:
// ProductCard is inside components/customer
import ProductCard from "../../components/customer/ProductCard";

import "./HomePage.css";


// ============================================================
// IMAGE HELPER
// ============================================================

const getImg = (img) => {

  if (!img) {
    return "";
  }

  if (typeof img === "string") {
    return img;
  }

  return (
    img.url ||
    img.secure_url ||
    ""
  );
};


// ============================================================
// CATEGORY ID HELPER
// ============================================================

const getCatId = (cat) => {

  if (!cat) {
    return "";
  }

  if (typeof cat === "string") {
    return cat;
  }

  return (
    cat._id ||
    cat.id ||
    ""
  );
};


// ============================================================
// SKELETON
// ============================================================

function Skeleton({
  className = "",
}) {

  return (
    <div
      className={`home-skeleton ${className}`}
      aria-hidden="true"
    />
  );
}


// ============================================================
// HERO STAT
// ============================================================

function HeroStat({
  value,
  label,
}) {

  return (
    <div className="home-hero-stat">

      <strong>
        {value}
      </strong>

      <span>
        {label}
      </span>

    </div>
  );
}


// ============================================================
// FEATURE CARD
// ============================================================

function FeatureCard({
  icon,
  title,
  desc,
}) {

  return (
    <article className="home-feature-card">

      <div className="home-feature-icon">
        {icon}
      </div>

      <h3>
        {title}
      </h3>

      <p>
        {desc}
      </p>

    </article>
  );
}


// ============================================================
// STEP
// ============================================================

function Step({
  num,
  title,
  desc,
}) {

  return (
    <div className="home-shopping-item">

      <div className="home-shopping-item-icon">

        <span>
          {num}
        </span>

      </div>

      <div className="home-shopping-item-content">

        <h4>
          {title}
        </h4>

        <p>
          {desc}
        </p>

      </div>

    </div>
  );
}


// ============================================================
// TRUST ITEM
// ============================================================

function TrustItem({
  icon,
  text,
}) {

  return (
    <div className="home-trust-item">

      <span className="home-trust-icon">
        {icon}
      </span>

      <span>
        {text}
      </span>

    </div>
  );
}


// ============================================================
// SECTION HEADER
// ============================================================

function SectionHeader({
  eyebrow,
  title,
  description,
  linkText = "View All",
  linkTo = "/products",
}) {

  return (
    <div className="home-section-header">

      <div className="home-section-heading">

        <span className="home-eyebrow">
          {eyebrow}
        </span>

        <h2>
          {title}
        </h2>

        <p>
          {description}
        </p>

      </div>

      <Link
        to={linkTo}
        className="home-section-link"
      >

        <span>
          {linkText}
        </span>

        <ArrowRight
          size={16}
        />

      </Link>

    </div>
  );
}


// ============================================================
// HOME PAGE
// ============================================================

function HomePage() {

  const [
    products,
    setProducts,
  ] = useState([]);

  const [
    categories,
    setCategories,
  ] = useState([]);

  const [
    loadingP,
    setLoadingP,
  ] = useState(true);

  const [
    loadingC,
    setLoadingC,
  ] = useState(true);


  // ==========================================================
  // PRODUCTS
  // ==========================================================

  useEffect(() => {

    let mounted = true;

    getProducts({
      page: 1,
      limit: 8,
    })
      .then((response) => {

        if (!mounted) {
          return;
        }

        setProducts(
          response?.products || []
        );

      })
      .catch(() => {

        if (!mounted) {
          return;
        }

        setProducts([]);

      })
      .finally(() => {

        if (!mounted) {
          return;
        }

        setLoadingP(false);

      });

    return () => {
      mounted = false;
    };

  }, []);


  // ==========================================================
  // CATEGORIES
  // ==========================================================

  useEffect(() => {

    let mounted = true;

    getCategories()
      .then((response) => {

        if (!mounted) {
          return;
        }

        setCategories(
          response?.categories || []
        );

      })
      .catch(() => {

        if (!mounted) {
          return;
        }

        setCategories([]);

      })
      .finally(() => {

        if (!mounted) {
          return;
        }

        setLoadingC(false);

      });

    return () => {
      mounted = false;
    };

  }, []);


  // ==========================================================
  // LIMIT HOME DATA
  // ==========================================================

  const cats =
    categories.slice(
      0,
      6
    );

  const prods =
    products.slice(
      0,
      8
    );


  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <div className="home-page">


      {/* ====================================================
          HERO
          ==================================================== */}

      <section className="home-hero">

        <div className="home-container">

          <div className="home-hero-grid">


            {/* ==================================================
                HERO CONTENT
                ================================================== */}

            <div className="home-hero-content">

              <span className="home-hero-badge">

                <ShieldCheck
                  size={15}
                />

                <span>
                  Trusted B2B Partner since 2010
                </span>

              </span>


              <h1>

                Quality Products.

                <br />

                <span>
                  Reliable Business.
                </span>

              </h1>


              <p>
                Shanti Enterprises delivers
                premium industrial &amp; wholesale
                products with transparent pricing,
                bulk ordering, and fast fulfilment —
                everything your business needs in
                one place.
              </p>


              {/* ==================================================
                  HERO ACTIONS
                  ================================================== */}

              <div className="home-hero-actions">

                <Link
                  to="/products"
                  className="home-primary-button"
                >

                  <span>
                    Explore Products
                  </span>

                  <ArrowRight
                    size={17}
                  />

                </Link>


                <Link
                  to="/categories"
                  className="home-secondary-button"
                >
                  Browse Categories
                </Link>

              </div>


              {/* ==================================================
                  TRUST ROW
                  ================================================== */}

              <div className="home-trust-row">

                <TrustItem
                  icon={
                    <Check
                      size={15}
                    />
                  }
                  text="Quality Assured"
                />

                <TrustItem
                  icon={
                    <LockKeyhole
                      size={15}
                    />
                  }
                  text="Secure Checkout"
                />

                <TrustItem
                  icon={
                    <Zap
                      size={15}
                    />
                  }
                  text="Fast Dispatch"
                />

              </div>

            </div>


            {/* ==================================================
                HERO VISUAL
                ================================================== */}

            <div className="home-hero-visual">

              <div className="home-hero-glow" />


              <div className="home-hero-card">

                <div className="home-hero-card-top">

                  <div className="home-hero-card-icon">

                    <Building2
                      size={28}
                    />

                  </div>

                  <span className="home-hero-card-label">
                    BUSINESS SUPPLY
                  </span>

                </div>


                <h2>
                  Shanti Enterprises
                </h2>


                <p>
                  Your one-stop wholesale &
                  industrial supply partner.
                </p>


                <div className="home-hero-card-divider" />


                <div className="home-hero-stats">

                  <HeroStat
                    value="500+"
                    label="Products"
                  />

                  <HeroStat
                    value="1K+"
                    label="Customers"
                  />

                  <HeroStat
                    value="15+"
                    label="Categories"
                  />

                  <HeroStat
                    value="24h"
                    label="Dispatch"
                  />

                </div>


                <div className="home-hero-card-footer">

                  <span>

                    <span className="home-status-dot" />

                    Business orders accepted

                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ====================================================
          CATEGORIES
          ==================================================== */}

      <section className="home-section">

        <div className="home-container">

          <SectionHeader
            eyebrow="Shop by Category"
            title="Explore our range"
            description="Find exactly what your business needs."
            linkText="View All"
            linkTo="/categories"
          />


          {/* ==================================================
              CATEGORY GRID
              ================================================== */}

          <div className="home-category-grid">

            {loadingC ? (

              Array.from({
                length: 6,
              }).map((_, index) => (

                <div
                  key={index}
                  className="home-category-card home-category-skeleton"
                >

                  <Skeleton
                    className="home-category-image-skeleton"
                  />

                  <div className="home-category-content">

                    <Skeleton
                      className="home-category-title-skeleton"
                    />

                    <Skeleton
                      className="home-category-link-skeleton"
                    />

                  </div>

                </div>

              ))

            ) : cats.length === 0 ? (

              <div className="home-empty-state home-category-empty">

                <div className="home-empty-icon">

                  <Package
                    size={28}
                  />

                </div>

                <h3>
                  Categories coming soon
                </h3>

                <p>
                  New categories will appear here
                  once they are added.
                </p>

              </div>

            ) : (

              cats.map((cat) => {

                const id =
                  getCatId(cat);

                const img =
                  getImg(cat.image);

                return (

                  <Link
                    key={
                      id ||
                      cat.name
                    }
                    to={
                      id
                        ? `/products?category=${id}`
                        : "/products"
                    }
                    className="home-category-card"
                  >

                    <div className="home-category-image">

                      {img ? (

                        <img
                          src={img}
                          alt={
                            cat.name ||
                            "Product category"
                          }
                          loading="lazy"
                        />

                      ) : (

                        <div className="home-category-placeholder">

                          <Package
                            size={38}
                          />

                        </div>

                      )}


                      <span className="home-category-overlay">

                        <ArrowRight
                          size={17}
                        />

                      </span>

                    </div>


                    <div className="home-category-content">

                      <h3>
                        {cat.name}
                      </h3>

                      <span>

                        Browse Products

                        <ChevronRight
                          size={14}
                        />

                      </span>

                    </div>

                  </Link>

                );

              })

            )}

          </div>

        </div>

      </section>


      {/* ====================================================
          FEATURED PRODUCTS
          ==================================================== */}

      <section className="home-section home-products-section">

        <div className="home-container">

          <SectionHeader
            eyebrow="Featured Products"
            title="Popular this month"
            description="Top picks from our catalogue — ready to order."
            linkText="View All"
            linkTo="/products"
          />


          {/* ==================================================
              PRODUCTS
              ================================================== */}

          {loadingP ? (

            <div className="home-products-grid">

              {Array.from({
                length: 8,
              }).map((_, index) => (

                <div
                  key={index}
                  className="home-product-skeleton"
                >

                  <Skeleton
                    className="home-product-image-skeleton"
                  />

                  <div className="home-product-skeleton-content">

                    <Skeleton
                      className="home-product-small-skeleton"
                    />

                    <Skeleton
                      className="home-product-title-skeleton"
                    />

                    <Skeleton
                      className="home-product-price-skeleton"
                    />

                    <Skeleton
                      className="home-product-button-skeleton"
                    />

                  </div>

                </div>

              ))}

            </div>

          ) : prods.length === 0 ? (

            <div className="home-empty-state">

              <div className="home-empty-icon">

                <Package
                  size={30}
                />

              </div>

              <h2>
                Products coming soon
              </h2>

              <p>
                New products will appear here
                once they are added.
              </p>

              <Link
                to="/categories"
                className="home-primary-button"
              >

                Explore Categories

                <ArrowRight
                  size={16}
                />

              </Link>

            </div>

          ) : (

            <div className="home-products-grid">

              {prods.map((product) => (

                <ProductCard
                  key={
                    product._id ||
                    product.id
                  }
                  product={product}
                />

              ))}

            </div>

          )}


          {/* ==================================================
              PRODUCTS CTA
              ================================================== */}

          <div className="home-section-footer">

            <Link
              to="/products"
              className="home-primary-button"
            >

              <span>
                See All Products
              </span>

              <ArrowRight
                size={17}
              />

            </Link>

          </div>

        </div>

      </section>


      {/* ====================================================
          WHY CHOOSE US
          ==================================================== */}

      <section className="home-section">

        <div className="home-container">


          <div className="home-section-heading home-centered-heading">

            <span className="home-eyebrow">
              Why Choose Us
            </span>

            <h2>
              Built around your business
            </h2>

            <p>
              We combine product quality with
              a smooth ordering experience
              tailored for B2B.
            </p>

          </div>


          <div className="home-feature-grid">

            <FeatureCard
              icon={
                <ShieldCheck
                  size={25}
                />
              }
              title="Verified Quality"
              desc="Every product is sourced from trusted suppliers and meets strict quality standards."
            />


            <FeatureCard
              icon={
                <Truck
                  size={25}
                />
              }
              title="Fast Dispatch"
              desc="Orders confirmed before noon are dispatched the same business day."
            />


            <FeatureCard
              icon={
                <ShoppingBag
                  size={25}
                />
              }
              title="Wholesale Pricing"
              desc="Volume-based pricing tiers that scale with your order quantity."
            />


            <FeatureCard
              icon={
                <CreditCard
                  size={25}
                />
              }
              title="Secure Payments"
              desc="Razorpay-powered checkout with UPI, cards, net banking & more."
            />

          </div>

        </div>

      </section>


      {/* ====================================================
          HOW IT WORKS
          ==================================================== */}

      <section className="home-section home-shopping-section">

        <div className="home-container">

          <div className="home-shopping-grid">


            {/* ==================================================
                INTRO
                ================================================== */}

            <div className="home-shopping-content">

              <span className="home-eyebrow home-eyebrow-light">
                Simple Ordering
              </span>

              <h2>
                From browse to delivered —
                in 3 steps.
              </h2>

              <p>
                No complicated process. Add what
                you need, confirm your address,
                and pay securely online or on
                delivery.
              </p>

              <Link
                to="/products"
                className="home-cta-button"
              >

                <span>
                  Start Shopping
                </span>

                <ArrowRight
                  size={17}
                />

              </Link>

            </div>


            {/* ==================================================
                STEPS
                ================================================== */}

            <div className="home-shopping-box">

              <Step
                num="01"
                title="Browse & Add"
                desc="Find products by category or search. Add to cart with one click."
              />

              <Step
                num="02"
                title="Set Address"
                desc="Use a saved address or enter a new delivery location."
              />

              <Step
                num="03"
                title="Pay & Confirm"
                desc="Razorpay or Cash on Delivery — your order is confirmed instantly."
              />

            </div>

          </div>

        </div>

      </section>


      {/* ====================================================
          FINAL CTA
          ==================================================== */}

      <section className="home-final-cta">

        <div className="home-container">

          <div className="home-final-cta-content">

            <span className="home-eyebrow home-eyebrow-light">
              Ready to Order?
            </span>

            <h2>
              Start exploring our products today.
            </h2>

            <p>
              Join hundreds of businesses that
              trust Shanti Enterprises for their
              supply needs.
            </p>


            <div className="home-final-cta-actions">

              <Link
                to="/products"
                className="home-cta-button"
              >

                <span>
                  Browse Products
                </span>

                <ArrowRight
                  size={17}
                />

              </Link>


              <Link
                to="/register"
                className="home-final-secondary-button"
              >
                Create Account
              </Link>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}


export default HomePage;