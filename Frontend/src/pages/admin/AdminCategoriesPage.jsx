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

import "./AdminCategoriesPage.css";

// ============================================================
// ADMIN CATEGORIES PAGE
// ============================================================

function AdminCategoriesPage() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  // ==========================================================
  // LOAD CATEGORIES
  // ==========================================================

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCategories();

      let categoryData = [];

      if (Array.isArray(response)) {
        categoryData = response;
      } else if (Array.isArray(response?.categories)) {
        categoryData = response.categories;
      } else if (Array.isArray(response?.data)) {
        categoryData = response.data;
      } else if (Array.isArray(response?.data?.categories)) {
        categoryData = response.data.categories;
      }

      setCategories(categoryData);
    } catch (err) {
      console.error("Categories error:", err);

      setError(
        err.response?.data?.message ||
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

  const filteredCategories = categories.filter((category) => {
    const name = category.name || category.title || "";

    return name
      .toLowerCase()
      .includes(search.trim().toLowerCase());
  });

  // ==========================================================
  // DELETE
  // ==========================================================

  const handleDelete = async (categoryId) => {
    if (!categoryId) {
      setError("Category ID is missing.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(categoryId);
      setError("");

      await deleteCategory(categoryId);

      setCategories((current) =>
        current.filter(
          (category) =>
            (category._id || category.id) !== categoryId
        )
      );
    } catch (err) {
      console.error("Delete category error:", err);

      setError(
        err.response?.data?.message ||
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
    return <Loading message="Loading categories..." />;
  }

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <section className="admin-categories-page">
      <div className="admin-categories-container">
        {/* HEADER */}
        <header className="admin-categories-header">
          <div className="admin-categories-heading">
            <Link
              to="/admin"
              className="admin-categories-back"
            >
              <span aria-hidden="true">←</span>
              Admin Dashboard
            </Link>

            <span className="admin-categories-eyebrow">
              CATEGORY MANAGEMENT
            </span>

            <h1>Categories</h1>

            <p>
              Organize and manage your product categories
              from one place.
            </p>
          </div>

          <div className="admin-categories-header-actions">
            <button
              type="button"
              className="admin-categories-refresh"
              onClick={loadCategories}
              disabled={loading}
            >
              <span aria-hidden="true">↻</span>
              Refresh
            </button>

            <button
              type="button"
              className="admin-categories-add"
              onClick={() =>
                navigate("/admin/categories/new")
              }
            >
              <span aria-hidden="true">+</span>
              Add Category
            </button>
          </div>
        </header>

        {/* ERROR */}
        {error && (
          <div className="admin-categories-error">
            <ErrorMessage
              message={error}
              onRetry={loadCategories}
            />
          </div>
        )}

        {/* TOOLBAR */}
        <div className="admin-categories-toolbar">
          <div className="admin-categories-search">
            <label htmlFor="categorySearch">
              Search Categories
            </label>

            <div className="admin-categories-search-box">
              <span
                className="admin-categories-search-icon"
                aria-hidden="true"
              >
                ⌕
              </span>

              <input
                id="categorySearch"
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search category..."
              />

              {search && (
                <button
                  type="button"
                  className="admin-categories-clear"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          <div className="admin-categories-count-pill">
            <span>Visible</span>
            <strong>{filteredCategories.length}</strong>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="admin-categories-summary">
          <div className="admin-categories-summary-main">
            <span className="admin-categories-summary-icon">
              ◈
            </span>

            <div>
              <strong>{filteredCategories.length}</strong>
              <span>Showing categories</span>
            </div>
          </div>

          <span className="admin-categories-total">
            Total categories:
            <strong>{categories.length}</strong>
          </span>
        </div>

        {/* CATEGORY LIST */}
        {filteredCategories.length === 0 ? (
          <div className="admin-categories-empty">
            <EmptyState
              title="No categories found"
              message={
                search
                  ? "No categories match your search."
                  : "Create your first product category to get started."
              }
            />

            {!search && (
              <button
                type="button"
                className="admin-categories-empty-action"
                onClick={() =>
                  navigate("/admin/categories/new")
                }
              >
                + Create Category
              </button>
            )}
          </div>
        ) : (
          <div className="admin-categories-grid">
            {filteredCategories.map((category, index) => {
              const categoryId =
                category._id || category.id;

              const name =
                category.name ||
                category.title ||
                "Category";

              const description =
                category.description || "";

              const isDeleting =
                deletingId === categoryId;

              return (
                <article
                  key={categoryId}
                  className="admin-category-card"
                  style={{
                    "--category-index": index,
                  }}
                >
                  <div className="admin-category-card-top">
                    <div className="admin-category-icon">
                      <span aria-hidden="true">🗂️</span>
                    </div>

                    <span className="admin-category-number">
                      #{String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="admin-category-content">
                    <span className="admin-category-label">
                      PRODUCT CATEGORY
                    </span>

                    <h2>{name}</h2>

                    {description ? (
                      <p>{description}</p>
                    ) : (
                      <p className="admin-category-no-description">
                        No description available.
                      </p>
                    )}
                  </div>

                  <div className="admin-category-actions">
                    <button
                      type="button"
                      className="admin-category-edit"
                      onClick={() =>
                        navigate(
                          `/admin/categories/${categoryId}/edit`
                        )
                      }
                      disabled={isDeleting}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="admin-category-delete"
                      onClick={() =>
                        handleDelete(categoryId)
                      }
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default AdminCategoriesPage;
