// ============================================================
// SHANTI ENTERPRISES
// Edit Category Page
// Frontend Phase 5 - Admin
// ============================================================

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getCategoryById,
  updateCategory,
} from "../../api/categoryApi";

import Loading from "../../components/common/Loading";

import ErrorMessage from "../../components/common/ErrorMessage";

// ============================================================
// EDIT CATEGORY PAGE
// ============================================================

function EditCategoryPage() {
  const {
    categoryId,
  } = useParams();

  const navigate =
    useNavigate();

  const [
    form,
    setForm,
  ] = useState({
    name: "",
    description: "",
  });

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  // ==========================================================
  // LOAD CATEGORY
  // ==========================================================

  const loadCategory =
    async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getCategoryById(
            categoryId
          );

        const category =
          response?.category ||
          response?.data?.category ||
          response?.data ||
          response;

        if (!category) {
          throw new Error(
            "Category not found."
          );
        }

        setForm({
          name:
            category.name ||
            category.title ||
            "",

          description:
            category.description ||
            "",
        });
      } catch (err) {
        console.error(
          "Load category error:",
          err
        );

        setError(
          err.response?.data
            ?.message ||
            err.message ||
            "Unable to load category."
        );
      } finally {
        setLoading(false);
      }
    };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    if (categoryId) {
      loadCategory();
    }
  }, [categoryId]);

  // ==========================================================
  // HANDLE CHANGE
  // ==========================================================

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setForm(
      (current) => ({
        ...current,
        [name]: value,
      })
    );

    setError("");
    setSuccess("");
  };

  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError(
        "Category name is required."
      );

      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await updateCategory(
        categoryId,
        {
          name:
            form.name.trim(),

          description:
            form.description.trim(),
        }
      );

      setSuccess(
        "Category updated successfully."
      );

      setTimeout(() => {
        navigate(
          "/admin/categories"
        );
      }, 800);
    } catch (err) {
      console.error(
        "Update category error:",
        err
      );

      setError(
        err.response?.data
          ?.message ||
          err.message ||
          "Unable to update category."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <Loading
        message="Loading category..."
      />
    );
  }

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <section className="app-page">

      <div>

        <Link to="/admin/categories">
          ← Category Management
        </Link>

        <h1>
          Edit Category
        </h1>

        <p>
          Update category information.
        </p>

      </div>

      {/* ERROR */}

      {error && (
        <ErrorMessage
          message={error}
          onRetry={
            loadCategory
          }
        />
      )}

      {/* SUCCESS */}

      {success && (
        <div>
          <strong>
            Success
          </strong>

          <p>
            {success}
          </p>
        </div>
      )}

      {/* FORM */}

      <form
        onSubmit={
          handleSubmit
        }
      >

        {/* NAME */}

        <div>

          <label htmlFor="name">
            Category Name *
          </label>

          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={
              handleChange
            }
          />

        </div>

        {/* DESCRIPTION */}

        <div>

          <label htmlFor="description">
            Description
          </label>

          <textarea
            id="description"
            name="description"
            rows="5"
            value={
              form.description
            }
            onChange={
              handleChange
            }
          />

        </div>

        {/* ACTIONS */}

        <div>

          <button
            type="submit"
            disabled={saving}
          >
            {saving
              ? "Updating..."
              : "Update Category"}
          </button>

          <Link to="/admin/categories">
            Cancel
          </Link>

        </div>

      </form>

    </section>
  );
}

export default EditCategoryPage;