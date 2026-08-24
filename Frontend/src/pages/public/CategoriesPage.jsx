// ============================================================
// SHANTI ENTERPRISES
// Categories Page
// Frontend Phase 2 - Shopping
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
// NORMALIZE CATEGORIES
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

  const loadCategories = async () => {
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
      <Loading
        message="Loading categories..."
      />
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={loadCategories}
      />
    );
  }

  // ==========================================================
  // EMPTY
  // ==========================================================

  if (categories.length === 0) {
    return (
      <EmptyState
        title="No categories available"
        message="Categories will appear here once they are added."
      />
    );
  }

  // ==========================================================
  // CATEGORY PAGE
  // ==========================================================

  return (
    <section>
      <h1>
        Categories
      </h1>

      <p>
        Browse products by category.
      </p>

      <div>
        {categories.map(
          (category, index) => {
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
                .replace(
                  /\s+/g,
                  "-"
                );

            return (
              <article
                key={id}
              >
                <h2>
                  {name}
                </h2>

                {category?.description && (
                  <p>
                    {
                      category.description
                    }
                  </p>
                )}

                <Link
                  to={`/products?category=${encodeURIComponent(
                    slug
                  )}`}
                >
                  View Products
                </Link>
              </article>
            );
          }
        )}
      </div>
    </section>
  );
}

export default CategoriesPage;