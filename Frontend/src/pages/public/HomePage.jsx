// ============================================================
// SHANTI ENTERPRISES
// Home Page
// Frontend Phase 6 - Complete UI/UX
// ============================================================

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  getProducts,
} from "../../api/productApi";

import {
  getCategories,
} from "../../api/categoryApi";

import "./HomePage.css";

// ============================================================
// HELPERS
// ============================================================

const getImageUrl = (image) => {
  if (!image) {
    return "";
  }

  if (
    typeof image === "string"
  ) {
    return image;
  }

  return (
    image.url ||
    image.secure_url ||
    ""
  );
};

const getCategoryId = (
  category
) => {
  if (!category) {
    return "";
  }

  if (
    typeof category === "string"
  ) {
    return category;
  }

  return (
    category._id ||
    category.id ||
    ""
  );
};

const getCategoryName = (
  category
) => {
  if (!category) {
    return "Uncategorized";
  }

  if (
    typeof category === "string"
  ) {
    return category;
  }

  return (
    category.name ||
    "Uncategorized"
  );
};

// ============================================================
// HOME PAGE
// ============================================================

function HomePage() {
  // ==========================================================
  // STATE
  // ==========================================================

  const [
    products,
    setProducts,
  ] = useState([]);

  const [
    categories,
    setCategories,
  ] = useState([]);

  const [
    loadingProducts,
    setLoadingProducts,
  ] = useState(true);

  const [
    loadingCategories,
    setLoadingCategories,
  ] = useState(true);

  const [
    productError,
    setProductError,
  ] = useState("");

  const [
    categoryError,
    setCategoryError,
  ] = useState("");

  // ==========================================================
  // LOAD PRODUCTS
  // ==========================================================

  useEffect(() => {
    let mounted = true;

    const loadProducts =
      async () => {
        try {
          setLoadingProducts(
            true
          );

          setProductError("");

          const response =
            await getProducts({
              page: 1,
              limit: 8,
            });

          if (!mounted) {
            return;
          }

          if (
            response?.success &&
            Array.isArray(
              response.products
            )
          ) {
            setProducts(
              response.products
            );
          } else {
            setProducts([]);
          }
        } catch (error) {
          console.error(
            "Home products error:",
            error
          );

          if (mounted) {
            setProductError(
              error.response?.data
                ?.message ||
                error.message ||
                "Unable to load products."
            );
          }
        } finally {
          if (mounted) {
            setLoadingProducts(
              false
            );
          }
        }
      };

    loadProducts();

    return () => {
      mounted = false;
    };
  }, []);

  // ==========================================================
  // LOAD CATEGORIES
  // ==========================================================

  useEffect(() => {
    let mounted = true;

    const loadCategories =
      async () => {
        try {
          setLoadingCategories(
            true
          );

          setCategoryError("");

          const response =
            await getCategories();

          if (!mounted) {
            return;
          }

          if (
            response?.success &&
            Array.isArray(
              response.categories
            )
          ) {
            setCategories(
              response.categories
            );
          } else {
            setCategories([]);
          }
        } catch (error) {
          console.error(
            "Home categories error:",
            error
          );

          if (mounted) {
            setCategoryError(
              error.response?.data
                ?.message ||
                error.message ||
                "Unable to load categories."
            );
          }
        } finally {
          if (mounted) {
            setLoadingCategories(
              false
            );
          }
        }
      };

    loadCategories();

    return () => {
      mounted = false;
    };
  }, []);

  // ==========================================================
  // FEATURED PRODUCTS
  // ==========================================================

  const featuredProducts =
    products.slice(0, 8);

  // ==========================================================
  // FEATURED CATEGORIES
  // ==========================================================

  const featuredCategories =
    categories.slice(0, 6);

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <div className="home-page">

      {/* ====================================================
          HERO
          ==================================================== */}

      <section className="home-hero">

        <div className="home-container home-hero-grid">

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
              Discover quality products
              from Shanti Enterprises with
              reliable service and a smooth
              shopping experience.
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

            {/* TRUST POINTS */}

            <div className="home-hero-trust">

              <div className="home-trust-item">
                <span className="home-trust-icon">
                  ✓
                </span>

                <div>
                  <strong>
                    Quality
                  </strong>

                  <span>
                    Products
                  </span>
                </div>
              </div>

              <div className="home-trust-item">
                <span className="home-trust-icon">
                  ⚡
                </span>

                <div>
                  <strong>
                    Reliable
                  </strong>

                  <span>
                    Service
                  </span>
                </div>
              </div>

              <div className="home-trust-item">
                <span className="home-trust-icon">
                  🔒
                </span>

                <div>
                  <strong>
                    Secure
                  </strong>

                  <span>
                    Checkout
                  </span>
                </div>
              </div>

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
                    Business
                  </strong>

                  <span>
                    Solutions
                  </span>
                </div>

                <div>
                  <strong>
                    Trusted
                  </strong>

                  <span>
                    Partner
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

      <section className="home-section home-category-section">

        <div className="home-container">

          <div className="home-section-heading home-section-heading-row">

            <div>

              <span>
                SHOP BY CATEGORY
              </span>

              <h2>
                Explore our categories
              </h2>

              <p>
                Find the products you need
                by browsing our available
                categories.
              </p>

            </div>

            <Link
              to="/categories"
              className="home-text-link"
            >
              View All Categories →
            </Link>

          </div>

          {loadingCategories ? (
            <div className="home-category-grid">

              {[1, 2, 3, 4, 5, 6].map(
                (item) => (
                  <div
                    key={item}
                    className="home-category-card home-skeleton-card"
                  >
                    <div className="home-skeleton-image" />

                    <div className="home-skeleton-content">

                      <div className="home-skeleton-line" />

                      <div className="home-skeleton-small" />

                      <div className="home-skeleton-small home-skeleton-short" />

                    </div>
                  </div>
                )
              )}

            </div>
          ) : categoryError ? (

            <div className="home-message-card">

              <div className="home-message-icon">
                !
              </div>

              <strong>
                Unable to load categories
              </strong>

              <p>
                {categoryError}
              </p>

              <Link
                to="/categories"
                className="home-primary-button"
              >
                Browse Categories
              </Link>

            </div>

          ) : featuredCategories.length === 0 ? (

            <div className="home-message-card">

              <div className="home-message-icon">
                C
              </div>

              <strong>
                Categories coming soon
              </strong>

              <p>
                New categories will appear
                here once they are available.
              </p>

            </div>

          ) : (

            <div className="home-category-grid">

              {featuredCategories.map(
                (category) => {

                  const categoryId =
                    getCategoryId(
                      category
                    );

                  const image =
                    getImageUrl(
                      category.image
                    );

                  return (
                    <Link
                      key={
                        categoryId ||
                        category.name
                      }
                      to={
                        categoryId
                          ? `/products?category=${encodeURIComponent(
                              categoryId
                            )}`
                          : "/products"
                      }
                      className="home-category-card"
                    >

                      <div className="home-category-image">

                        {image ? (

                          <img
                            src={image}
                            alt={
                              category.name ||
                              "Category"
                            }
                            loading="lazy"
                          />

                        ) : (

                          <div className="home-category-placeholder">

                            <span>
                              {(
                                category.name ||
                                "C"
                              )
                                .charAt(0)
                                .toUpperCase()}
                            </span>

                          </div>

                        )}

                      </div>

                      <div className="home-category-content">

                        <h3>
                          {category.name}
                        </h3>

                        {category.description && (
                          <p>
                            {
                              category.description
                            }
                          </p>
                        )}

                        <span className="home-category-link">
                          Explore
                          <span>
                            →
                          </span>
                        </span>

                      </div>

                    </Link>
                  );
                }
              )}

            </div>

          )}

        </div>

      </section>

      {/* ====================================================
          FEATURED PRODUCTS
          ==================================================== */}

      <section className="home-section home-products-section">

        <div className="home-container">

          <div className="home-section-heading home-section-heading-row">

            <div>

              <span>
                FEATURED PRODUCTS
              </span>

              <h2>
                Popular products
              </h2>

              <p>
                Explore products currently
                available from Shanti Enterprises.
              </p>

            </div>

            <Link
              to="/products"
              className="home-text-link"
            >
              View All Products →
            </Link>

          </div>

          {loadingProducts ? (

            <div className="home-product-grid">

              {[1, 2, 3, 4, 5, 6, 7, 8].map(
                (item) => (
                  <div
                    key={item}
                    className="home-product-card home-product-skeleton"
                  >

                    <div className="home-skeleton-product-image" />

                    <div className="home-product-skeleton-body">

                      <div className="home-skeleton-small home-skeleton-category" />

                      <div className="home-skeleton-line" />

                      <div className="home-skeleton-line home-skeleton-medium" />

                      <div className="home-skeleton-price" />

                      <div className="home-skeleton-button" />

                    </div>

                  </div>
                )
              )}

            </div>

          ) : productError ? (

            <div className="home-message-card">

              <div className="home-message-icon">
                !
              </div>

              <strong>
                Unable to load products
              </strong>

              <p>
                {productError}
              </p>

              <Link
                to="/products"
                className="home-primary-button"
              >
                View Products
              </Link>

            </div>

          ) : featuredProducts.length === 0 ? (

            <div className="home-message-card">

              <div className="home-message-icon">
                P
              </div>

              <strong>
                Products coming soon
              </strong>

              <p>
                There are no active products
                available right now.
              </p>

              <Link
                to="/products"
                className="home-primary-button"
              >
                Browse Products
              </Link>

            </div>

          ) : (

            <div className="home-product-grid">

              {featuredProducts.map(
                (product) => {

                  const productId =
                    product._id ||
                    product.id;

                  const image =
                    getImageUrl(
                      product.image
                    );

                  const categoryName =
                    getCategoryName(
                      product.category
                    );

                  return (
                    <article
                      key={productId}
                      className="home-product-card"
                    >

                      {/* PRODUCT IMAGE */}

                      <Link
                        to={`/products/${productId}`}
                        className="home-product-image"
                      >

                        {image ? (

                          <img
                            src={image}
                            alt={
                              product.name
                            }
                            loading="lazy"
                          />

                        ) : (

                          <div className="home-product-image-placeholder">
                            <span>
                              SE
                            </span>
                          </div>

                        )}

                      </Link>

                      {/* PRODUCT CONTENT */}

                      <div className="home-product-content">

                        <span className="home-product-category">
                          {categoryName}
                        </span>

                        <Link
                          to={`/products/${productId}`}
                          className="home-product-title-link"
                        >
                          <h3>
                            {product.name}
                          </h3>
                        </Link>

                        {product.description && (
                          <p>
                            {
                              product.description
                            }
                          </p>
                        )}

                        <div className="home-product-meta">

                          <div className="home-product-price">

                            <strong>
                              ₹
                              {Number(
                                product.price ||
                                0
                              ).toLocaleString(
                                "en-IN",
                                {
                                  minimumFractionDigits: 2,
                                }
                              )}
                            </strong>

                            <span>
                              /
                              {" "}
                              {product.unit ||
                                "piece"}
                            </span>

                          </div>

                          <span className="home-product-moq">
                            MOQ:{" "}
                            {product.moq ||
                              1}
                          </span>

                        </div>

                        <Link
                          to={`/products/${productId}`}
                          className="home-product-button"
                        >
                          View Product
                          <span>
                            →
                          </span>
                        </Link>

                      </div>

                    </article>
                  );
                }
              )}

            </div>

          )}

        </div>

      </section>

      {/* ====================================================
          WHY CHOOSE US
          ==================================================== */}

      <section className="home-section home-features-section">

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
          HOW IT WORKS
          ==================================================== */}

      <section className="home-section home-shopping-section">

        <div className="home-container">

          <div className="home-shopping-grid">

            <div>

              <span className="home-eyebrow">
                SIMPLE SHOPPING
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
                    Find products and
                    categories.
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
                    Select the quantity
                    you need.
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
                    Complete your order
                    securely.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ====================================================
          BUSINESS / WHOLESALE
          ==================================================== */}

      <section className="home-business-section">

        <div className="home-container">

          <div className="home-business-card">

            <div className="home-business-content">

              <span className="home-eyebrow">
                BUSINESS ORDERS
              </span>

              <h2>
                Need products in larger
                quantities?
              </h2>

              <p>
                Explore wholesale-friendly
                products and quantity-based
                purchasing options for your
                business requirements.
              </p>

            </div>

            <div className="home-business-actions">

              <Link
                to="/products"
                className="home-primary-button"
              >
                Explore Products
              </Link>

              <Link
                to="/rfq"
                className="home-secondary-button"
              >
                Request a Quote
              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* ====================================================
          FINAL CTA
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
