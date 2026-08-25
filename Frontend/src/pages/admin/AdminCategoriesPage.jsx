// ============================================================
// SHANTI ENTERPRISES
// Admin Categories Page
// Frontend Phase 5 - Category Management
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
            response?.data
              ?.categories
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
    <section className="app-page">

      {/* HEADER */}

      <div>

        <Link to="/admin">
          ← Admin Dashboard
        </Link>

        <h1>
          Category Management
        </h1>

        <p>
          Manage product categories.
        </p>

      </div>

      {/* ERROR */}

      {error && (
        <ErrorMessage
          message={error}
          onRetry={
            loadCategories
          }
        />
      )}

      {/* ACTIONS */}

      <div>

        <button
          type="button"
          onClick={() =>
            navigate(
              "/admin/categories/new"
            )
          }
        >
          + Add Category
        </button>

        <button
          type="button"
          onClick={
            loadCategories
          }
        >
          Refresh
        </button>

      </div>

      {/* SEARCH */}

      <div>

        <label htmlFor="categorySearch">
          Search Categories
        </label>

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

      </div>

      <p>
        Showing{" "}
        {
          filteredCategories.length
        }{" "}
        of{" "}
        {categories.length} categories
      </p>

      {/* CATEGORY LIST */}

      {filteredCategories.length ===
      0 ? (
        <EmptyState
          title="No categories found"
          message="No categories match your search."
        />
      ) : (
        <div>

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
                >

                  <h2>
                    {name}
                  </h2>

                  {description && (
                    <p>
                      {
                        description
                      }
                    </p>
                  )}

                  <div>

                    <button
                      type="button"
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

    </section>
  );
}

export default AdminCategoriesPage;