// ============================================================
// SHANTI ENTERPRISES
// Categories Page
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
  Boxes,
  ChevronRight,
  Grid2X2,
  PackageOpen,
  RefreshCw,
  Sparkles,
} from "lucide-react";

import {
  getCategories,
} from "../../api/categoryApi";

import Loading from "../../components/common/Loading";

import ErrorMessage from "../../components/common/ErrorMessage";

import EmptyState from "../../components/common/EmptyState";

import "./CategoriesPage.css";

// ============================================================
// HELPERS
// ============================================================

const extractCategories = (
  responseData
) => {
  if (Array.isArray(responseData)) {
    return responseData;
  }

  if (
    Array.isArray(
      responseData?.categories
    )
  ) {
    return responseData.categories;
  }

  if (
    Array.isArray(
      responseData?.data
    )
  ) {
    return responseData.data;
  }

  if (
    Array.isArray(
      responseData?.data?.categories
    )
  ) {
    return responseData.data.categories;
  }

  return [];
};

// ============================================================
// IMAGE URL
// ============================================================

const getImageUrl = (
  image
) => {
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

// ============================================================
// CATEGORY IMAGE FALLBACK
// ============================================================

const CategoryImageFallback = ({
  name,
}) => {
  const firstLetter =
    name
      ?.charAt(0)
      ?.toUpperCase() ||
    "C";

  return (
    <div className="categories-image-fallback">
      <PackageOpen
        size={42}
        strokeWidth={1.5}
      />

      <span>
        {firstLetter}
      </span>
    </div>
  );
};

// ============================================================
// CATEGORY SLUG
// ============================================================

const createCategorySlug = (
  category,
  name
) => {
  if (category?.slug) {
    return category.slug;
  }

  return name
    .toLowerCase()
    .trim()
    .replace(
      /[^a-z0-9\s-]/g,
      ""
    )
    .replace(
      /\s+/g,
      "-"
    );
};

// ============================================================
// CATEGORY SKELETON
// ============================================================

function CategorySkeleton() {
  return (
    <article className="categories-skeleton-card">

      <div className="categories-skeleton-image" />

      <div className="categories-skeleton-content">

        <div className="categories-skeleton-top">
          <div className="categories-skeleton-number" />
          <div className="categories-skeleton-type" />
        </div>

        <div className="categories-skeleton-title" />

        <div className="categories-skeleton-line" />

        <div className="categories-skeleton-line categories-skeleton-line-short" />

        <div className="categories-skeleton-button" />

      </div>

    </article>
  );
}

// ============================================================
// CATEGORIES PAGE
// ============================================================

function CategoriesPage() {
  const [
    categories,
    setCategories,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  // ==========================================================
  // LOAD CATEGORIES
  // ==========================================================

  const loadCategories =
    async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getCategories();

        const categoryData =
          extractCategories(
            data
          );

        setCategories(
          categoryData
        );
      } catch (err) {
        console.error(
          "Categories fetch error:",
          err
        );

        setError(
          err.response?.data
            ?.message ||
          err.message ||
          "Unable to load categories."
        );
      } finally {
        setLoading(false);
      }
    };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    loadCategories();
  }, []);

  // ==========================================================
  // LOADING STATE
  // ==========================================================

  if (loading) {
    return (
      <section className="app-page categories-page">

        <div className="categories-container">

          <header className="categories-page-header">

            <div className="categories-heading-content">

              <span className="categories-eyebrow">
                <Sparkles size={13} />
                EXPLORE OUR STORE
              </span>

              <h1>
                Product Categories
              </h1>

              <p>
                Discover products by category
                and find exactly what your
                business needs.
              </p>

            </div>

          </header>

          <div className="categories-loading-grid">

            {Array.from({
              length: 6,
            }).map((_, index) => (
              <CategorySkeleton
                key={index}
              />
            ))}

          </div>

        </div>

      </section>
    );
  }

  // ==========================================================
  // ERROR STATE
  // ==========================================================

  if (error) {
    return (
      <section className="app-page categories-page">

        <div className="categories-container">

          <header className="categories-page-header">

            <div className="categories-heading-content">

              <span className="categories-eyebrow">
                <Sparkles size={13} />
                EXPLORE OUR STORE
              </span>

              <h1>
                Product Categories
              </h1>

              <p>
                Discover products by category
                and find exactly what your
                business needs.
              </p>

            </div>

          </header>

          <div className="categories-state-wrapper">

            <ErrorMessage
              message={error}
              onRetry={loadCategories}
            />

            <div className="categories-state-actions">

              <button
                type="button"
                className="categories-retry-button"
                onClick={loadCategories}
              >
                <RefreshCw
                  size={16}
                />

                Try Again
              </button>

              <Link
                to="/products"
                className="categories-secondary-button"
              >
                Browse Products

                <ArrowRight
                  size={16}
                />
              </Link>

            </div>

          </div>

        </div>

      </section>
    );
  }

  // ==========================================================
  // EMPTY STATE
  // ==========================================================

  if (categories.length === 0) {
    return (
      <section className="app-page categories-page">

        <div className="categories-container">

          <header className="categories-page-header">

            <div className="categories-heading-content">

              <span className="categories-eyebrow">
                <Sparkles size={13} />
                EXPLORE OUR STORE
              </span>

              <h1>
                Product Categories
              </h1>

              <p>
                Discover products by category
                and find exactly what your
                business needs.
              </p>

            </div>

          </header>

          <div className="categories-empty-wrapper">

            <EmptyState
              title="No categories available"
              message="Categories will appear here once they are added."
            />

            <Link
              to="/products"
              className="categories-primary-button"
            >
              Browse Products

              <ArrowRight
                size={16}
              />

            </Link>

          </div>

        </div>

      </section>
    );
  }

  // ==========================================================
  // MAIN PAGE
  // ==========================================================

  return (
    <section className="app-page categories-page">

      <div className="categories-container">

        {/* ==================================================
            PAGE HEADER
            ================================================== */}

        <header className="categories-page-header">

          <div className="categories-heading-content">

            <span className="categories-eyebrow">
              <Sparkles size={13} />
              EXPLORE OUR STORE
            </span>

            <h1>
              Product Categories
            </h1>

            <p>
              Discover products by category
              and find exactly what your
              business needs.
            </p>

          </div>

          <Link
            to="/products"
            className="categories-header-button"
          >
            <span>
              View All Products
            </span>

            <ArrowRight
              size={17}
            />

          </Link>

        </header>

        {/* ==================================================
            SUMMARY BAR
            ================================================== */}

        <div className="categories-summary-bar">

          <div className="categories-summary-left">

            <div className="categories-summary-icon">
              <Grid2X2
                size={20}
              />
            </div>

            <div>

              <strong>
                {categories.length}
              </strong>

              <span>
                {categories.length === 1
                  ? "category available"
                  : "categories available"}
              </span>

            </div>

          </div>

          <span className="categories-summary-text">
            Browse a category to explore
            available products.
          </span>

        </div>

        {/* ==================================================
            CATEGORY GRID
            ================================================== */}

        <div className="categories-grid">

          {categories.map(
            (
              category,
              index
            ) => {

              const id =
                category?._id ||
                category?.id ||
                category?.slug ||
                index;

              const name =
                category?.name ||
                category?.title ||
                category?.categoryName ||
                "Category";

              const slug =
                createCategorySlug(
                  category,
                  name
                );

              const image =
                getImageUrl(
                  category?.image
                );

              const categoryUrl =
                `/products?category=${encodeURIComponent(
                  slug
                )}`;

              return (
                <article
                  key={id}
                  className="categories-card"
                >

                  {/* ==========================================
                      CATEGORY IMAGE
                      ========================================== */}

                  <Link
                    to={categoryUrl}
                    className="categories-card-image"
                    aria-label={`View ${name} products`}
                  >

                    <div className="categories-card-image-overlay" />

                    {image ? (
                      <img
                        src={image}
                        alt={`${name} category`}
                        loading="lazy"
                        onError={(
                          event
                        ) => {
                          event.currentTarget.style.display =
                            "none";

                          const fallback =
                            event.currentTarget
                              .parentElement
                              ?.querySelector(
                                ".categories-image-fallback"
                              );

                          if (fallback) {
                            fallback.style.display =
                              "flex";
                          }
                        }}
                      />
                    ) : null}

                    <CategoryImageFallback
                      name={name}
                    />

                    <span className="categories-image-label">

                      <span>
                        Explore Category
                      </span>

                      <ArrowRight
                        size={15}
                      />

                    </span>

                  </Link>

                  {/* ==========================================
                      CATEGORY CONTENT
                      ========================================== */}

                  <div className="categories-card-content">

                    <div className="categories-card-top">

                      <span className="categories-card-number">
                        {String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <span className="categories-card-type">
                        CATEGORY
                      </span>

                    </div>

                    <h2>
                      {name}
                    </h2>

                    <p>
                      {category?.description ||
                        `Explore products available in the ${name} category.`}
                    </p>

                    <Link
                      to={categoryUrl}
                      className="categories-card-link"
                    >

                      <span>
                        View Products
                      </span>

                      <span className="categories-card-link-arrow">
                        <ArrowRight
                          size={15}
                        />
                      </span>

                    </Link>

                  </div>

                </article>
              );
            }
          )}

        </div>

        {/* ==================================================
            BOTTOM CTA
            ================================================== */}

        <section className="categories-bottom-cta">

          <div className="categories-bottom-icon">
            <Boxes
              size={25}
            />
          </div>

          <div className="categories-bottom-content">

            <span>
              CAN'T FIND WHAT YOU NEED?
            </span>

            <h2>
              Explore the complete collection
            </h2>

            <p>
              Browse all available products
              and find the right solution for
              your requirements.
            </p>

          </div>

          <Link
            to="/products"
            className="categories-primary-button"
          >
            <span>
              View All Products
            </span>

            <ArrowRight
              size={16}
            />

          </Link>

        </section>

      </div>

    </section>
  );
}

export default CategoriesPage;