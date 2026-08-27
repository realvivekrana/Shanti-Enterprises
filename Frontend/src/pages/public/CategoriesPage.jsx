// ============================================================
// SHANTI ENTERPRISES
// Categories Page
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
  getCategories,
} from "../../api/categoryApi";

import Loading from "../../components/common/Loading";

import ErrorMessage from "../../components/common/ErrorMessage";

import EmptyState from "../../components/common/EmptyState";

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
// GET IMAGE URL
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

      <span>
        {firstLetter}
      </span>

    </div>
  );
};

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
          extractCategories(data);

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
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <section className="app-page categories-page">

        <div className="categories-container">

          <div className="categories-page-header">

            <span className="categories-eyebrow">
              EXPLORE
            </span>

            <h1>
              Categories
            </h1>

            <p>
              Browse our products by
              category.
            </p>

          </div>

          <Loading
            message="Loading categories..."
          />

        </div>

      </section>
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (error) {
    return (
      <section className="app-page categories-page">

        <div className="categories-container">

          <div className="categories-page-header">

            <span className="categories-eyebrow">
              EXPLORE
            </span>

            <h1>
              Categories
            </h1>

            <p>
              Browse our products by
              category.
            </p>

          </div>

          <ErrorMessage
            message={error}
            onRetry={loadCategories}
          />

          <div className="categories-back-action">

            <Link
              to="/products"
              className="categories-secondary-button"
            >
              Browse Products
            </Link>

          </div>

        </div>

      </section>
    );
  }

  // ==========================================================
  // EMPTY
  // ==========================================================

  if (categories.length === 0) {
    return (
      <section className="app-page categories-page">

        <div className="categories-container">

          <div className="categories-page-header">

            <span className="categories-eyebrow">
              EXPLORE
            </span>

            <h1>
              Categories
            </h1>

            <p>
              Browse our products by
              category.
            </p>

          </div>

          <EmptyState
            title="No categories available"
            message="Categories will appear here once they are added."
          />

          <div className="categories-back-action">

            <Link
              to="/products"
              className="categories-primary-button"
            >
              Browse Products
            </Link>

          </div>

        </div>

      </section>
    );
  }

  // ==========================================================
  // CATEGORY PAGE
  // ==========================================================

  return (
    <section className="app-page categories-page">

      <div className="categories-container">

        {/* ==================================================
            HEADER
            ================================================== */}

        <div className="categories-page-header">

          <span className="categories-eyebrow">
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

        {/* ==================================================
            SUMMARY
            ================================================== */}

        <div className="categories-summary">

          <span>
            {categories.length}
          </span>

          <p>
            {categories.length === 1
              ? "category available"
              : "categories available"}
          </p>

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
                category?.slug ||
                name
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

              const image =
                getImageUrl(
                  category?.image
                );

              return (
                <article
                  key={id}
                  className="categories-card"
                >

                  {/* CATEGORY IMAGE */}

                  <Link
                    to={`/products?category=${encodeURIComponent(
                      slug
                    )}`}
                    className="categories-card-image"
                    aria-label={`View ${name} products`}
                  >

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
                        }}
                      />
                    ) : (
                      <CategoryImageFallback
                        name={name}
                      />
                    )}

                  </Link>

                  {/* CATEGORY CONTENT */}

                  <div className="categories-card-content">

                    <span className="categories-card-number">
                      {String(
                        index + 1
                      ).padStart(
                        2,
                        "0"
                      )}
                    </span>

                    <h2>
                      {name}
                    </h2>

                    {category?.description ? (
                      <p>
                        {
                          category.description
                        }
                      </p>
                    ) : (
                      <p>
                        Explore products
                        available in the{" "}
                        {name} category.
                      </p>
                    )}

                    <Link
                      to={`/products?category=${encodeURIComponent(
                        slug
                      )}`}
                      className="categories-card-link"
                    >
                      View Products
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

        {/* ==================================================
            BOTTOM CTA
            ================================================== */}

        <div className="categories-bottom-cta">

          <div>

            <span>
              CAN'T FIND WHAT YOU NEED?
            </span>

            <h2>
              Browse all products
            </h2>

            <p>
              Explore the complete product
              collection and find the right
              products for your requirements.
            </p>

          </div>

          <Link
            to="/products"
            className="categories-primary-button"
          >
            View All Products
          </Link>

        </div>

      </div>

    </section>
  );
}

export default CategoriesPage;