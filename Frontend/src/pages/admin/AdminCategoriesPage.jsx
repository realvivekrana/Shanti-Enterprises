// ============================================================
// SHANTI ENTERPRISES
// Admin Categories Page
// Frontend Phase 6 - UI/UX
// ============================================================

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  getCategories,
  deleteCategory,
} from "../../api/categoryApi";

import Loading from "../../components/common/Loading";

import ErrorMessage from "../../components/common/ErrorMessage";

import EmptyState from "../../components/common/EmptyState";

// ============================================================
// ADMIN CATEGORIES PAGE
// ============================================================

function AdminCategoriesPage() {
  const navigate =
    useNavigate();

  const [
    categories,
    setCategories,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    deletingId,
    setDeletingId,
  ] = useState(null);

  const [
    search,
    setSearch,
  ] = useState("");

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

        const response =
          await getCategories();

        let categoryData = [];

        if (
          Array.isArray(response)
        ) {
          categoryData =
            response;
        } else if (
          Array.isArray(
            response?.categories
          )
        ) {
          categoryData =
            response.categories;
        } else if (
          Array.isArray(
            response?.data
          )
        ) {
          categoryData =
            response.data;
        } else if (
          Array.isArray(
            response?.data?.categories
          )
        ) {
          categoryData =
            response.data.categories;
        }

        setCategories(
          categoryData
        );
      } catch (err) {
        console.error(
          "Categories error:",
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
  // FILTER
  // ==========================================================

  const filteredCategories =
    categories.filter(
      (category) => {
        const name =
          category.name ||
          category.title ||
          "";

        return name
          .toLowerCase()
          .includes(
            search
              .trim()
              .toLowerCase()
          );
      }
    );

  // ==========================================================
  // DELETE
  // ==========================================================

  const handleDelete =
    async (
      categoryId
    ) => {
      if (!categoryId) {
        setError(
          "Category ID is missing."
        );

        return;
      }

      const confirmed =
        window.confirm(
          "Are you sure you want to delete this category?"
        );

      if (!confirmed) {
        return;
      }

      try {
        setDeletingId(
          categoryId
        );

        setError("");

        await deleteCategory(
          categoryId
        );

        setCategories(
          (current) =>
            current.filter(
              (category) =>
                (
                  category._id ||
                  category.id
                ) !== categoryId
            )
        );
      } catch (err) {
        console.error(
          "Delete category error:",
          err
        );

        setError(
          err.response?.data
            ?.message ||
          err.message ||
          "Unable to delete category."
        );
      } finally {
        setDeletingId(null);
      }
    };

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
  // PAGE
  // ==========================================================

  return (
    <section className="admin-categories-page">

      <div className="admin-categories-container">

        {/* ==================================================
            HEADER
            ================================================== */}

        <div className="admin-categories-header">

          <div>

            <Link
              to="/admin"
              className="admin-categories-back"
            >
              ← Admin Dashboard
            </Link>

            <span className="admin-categories-eyebrow">
              CATEGORY MANAGEMENT
            </span>

            <h1>
              Categories
            </h1>

            <p>
              Organize and manage your
              product categories.
            </p>

          </div>

          <div className="admin-categories-header-actions">

            <button
              type="button"
              className="admin-categories-refresh"
              onClick={
                loadCategories
              }
            >
              ↻ Refresh
            </button>

            <button
              type="button"
              className="admin-categories-add"
              onClick={() =>
                navigate(
                  "/admin/categories/new"
                )
              }
            >
              + Add Category
            </button>

          </div>

        </div>

        {/* ==================================================
            ERROR
            ================================================== */}

        {error && (
          <div className="admin-categories-error">

            <ErrorMessage
              message={error}
              onRetry={
                loadCategories
              }
            />

          </div>
        )}

        {/* ==================================================
            TOOLBAR
            ================================================== */}

        <div className="admin-categories-toolbar">

          <div className="admin-categories-search">

            <label htmlFor="categorySearch">
              Search Categories
            </label>

            <div className="admin-categories-search-box">

              <span>
                ⌕
              </span>

              <input
                id="categorySearch"
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search category..."
              />

              {search && (
                <button
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}

            </div>

          </div>

        </div>

        {/* ==================================================
            SUMMARY
            ================================================== */}

        <div className="admin-categories-summary">

          <div>

            <strong>
              {
                filteredCategories.length
              }
            </strong>

            <span>
              Showing categories
            </span>

          </div>

          <span>
            Total categories:{" "}
            <strong>
              {categories.length}
            </strong>
          </span>

        </div>

        {/* ==================================================
            CATEGORY LIST
            ================================================== */}

        {filteredCategories.length ===
        0 ? (
          <div className="admin-categories-empty">

            <EmptyState
              title="No categories found"
              message={
                search
                  ? "No categories match your search."
                  : "Create your first product category to get started."
              }
            />

          </div>
        ) : (
          <div className="admin-categories-grid">

            {filteredCategories.map(
              (category) => {

                const categoryId =
                  category._id ||
                  category.id;

                const name =
                  category.name ||
                  category.title ||
                  "Category";

                const description =
                  category.description ||
                  "";

                const isDeleting =
                  deletingId ===
                  categoryId;

                return (
                  <article
                    key={
                      categoryId
                    }
                    className="admin-category-card"
                  >

                    {/* ICON */}

                    <div className="admin-category-icon">
                      🗂️
                    </div>

                    {/* CONTENT */}

                    <div className="admin-category-content">

                      <span className="admin-category-label">
                        CATEGORY
                      </span>

                      <h2>
                        {name}
                      </h2>

                      {description ? (
                        <p>
                          {description}
                        </p>
                      ) : (
                        <p className="admin-category-no-description">
                          No description available.
                        </p>
                      )}

                    </div>

                    {/* ACTIONS */}

                    <div className="admin-category-actions">

                      <button
                        type="button"
                        className="admin-category-edit"
                        onClick={() =>
                          navigate(
                            `/admin/categories/${categoryId}/edit`
                          )
                        }
                        disabled={
                          isDeleting
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="admin-category-delete"
                        onClick={() =>
                          handleDelete(
                            categoryId
                          )
                        }
                        disabled={
                          isDeleting
                        }
                      >
                        {isDeleting
                          ? "Deleting..."
                          : "Delete"}
                      </button>

                    </div>

                  </article>
                );
              }
            )}

          </div>
        )}

      </div>

    </section>
  );
}

export default AdminCategoriesPage;