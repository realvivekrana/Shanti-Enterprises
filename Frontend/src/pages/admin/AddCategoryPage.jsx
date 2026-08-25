// ============================================================
// SHANTI ENTERPRISES
// Add Category Page
// Frontend Phase 5 - Admin
// ============================================================

import {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  createCategory,
} from "../../api/categoryApi";

// ============================================================
// ADD CATEGORY PAGE
// ============================================================

function AddCategoryPage() {
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
      setLoading(true);
      setError("");
      setSuccess("");

      await createCategory({
        name:
          form.name.trim(),

        description:
          form.description.trim(),
      });

      setSuccess(
        "Category created successfully."
      );

      setTimeout(() => {
        navigate(
          "/admin/categories"
        );
      }, 800);
    } catch (err) {
      console.error(
        "Create category error:",
        err
      );

      setError(
        err.response?.data
          ?.message ||
          err.message ||
          "Unable to create category."
      );
    } finally {
      setLoading(false);
    }
  };

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
          Add Category
        </h1>

        <p>
          Create a new product
          category.
        </p>

      </div>

      {/* ERROR */}

      {error && (
        <div>
          <strong>
            Error
          </strong>

          <p>
            {error}
          </p>
        </div>
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
            placeholder="Enter category name"
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
            placeholder="Enter category description"
          />

        </div>

        {/* ACTIONS */}

        <div>

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating..."
              : "Create Category"}
          </button>

          <Link to="/admin/categories">
            Cancel
          </Link>

        </div>

      </form>

    </section>
  );
}

export default AddCategoryPage;