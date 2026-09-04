// ============================================================
// SHANTI ENTERPRISES
// Add Category Page
// Frontend Phase 6 - Premium UI/UX
// ============================================================

import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { createCategory } from "../../api/categoryApi";

import "./AddCategoryPage.css";

// ============================================================
// ADD CATEGORY PAGE
// ============================================================

function AddCategoryPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================================
  // HANDLE CHANGE
  // ==========================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Category name is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await createCategory({
        name: form.name.trim(),
        description: form.description.trim(),
      });

      setSuccess("Category created successfully.");

      setTimeout(() => {
        navigate("/admin/categories");
      }, 800);
    } catch (err) {
      console.error("Create category error:", err);

      setError(
        err.response?.data?.message ||
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
    <section className="app-page admin-category-editor admin-category-editor--add">
      <div className="admin-category-editor-container">
        {/* HEADER */}
        <header className="admin-category-editor-header">
          <div className="admin-category-editor-heading">
            <Link
              to="/admin/categories"
              className="admin-category-editor-back"
            >
              <span aria-hidden="true">←</span>
              Category Management
            </Link>

            <span className="admin-category-editor-eyebrow">
              CATEGORY MANAGEMENT
            </span>

            <h1>Add Category</h1>

            <p>
              Create a new product category and keep your
              catalog organized.
            </p>
          </div>

          <div className="admin-category-editor-header-icon">
            <span aria-hidden="true">＋</span>
          </div>
        </header>

        <div className="admin-category-editor-layout">
          {/* FORM CARD */}
          <form
            className="admin-category-editor-card admin-category-form"
            onSubmit={handleSubmit}
          >
            <div className="admin-category-card-heading">
              <div>
                <span>01</span>
                <h2>Category Information</h2>
              </div>

              <p>Enter the basic details for your new category.</p>
            </div>

            {/* ERROR */}
            {error && (
              <div
                className="admin-category-alert admin-category-alert--error"
                role="alert"
              >
                <div className="admin-category-alert-icon">!</div>
                <div>
                  <strong>Error</strong>
                  <p>{error}</p>
                </div>
              </div>
            )}

            {/* SUCCESS */}
            {success && (
              <div
                className="admin-category-alert admin-category-alert--success"
                role="status"
              >
                <div className="admin-category-alert-icon">✓</div>
                <div>
                  <strong>Success</strong>
                  <p>{success}</p>
                </div>
              </div>
            )}

            <div className="admin-category-form-fields">
              {/* NAME */}
              <div className="admin-category-field">
                <label htmlFor="name">
                  Category Name
                  <span>*</span>
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Electronics"
                  autoComplete="off"
                  required
                />

                <small>
                  Use a clear and recognizable category name.
                </small>
              </div>

              {/* DESCRIPTION */}
              <div className="admin-category-field">
                <div className="admin-category-label-row">
                  <label htmlFor="description">
                    Description
                  </label>
                  <span>Optional</span>
                </div>

                <textarea
                  id="description"
                  name="description"
                  rows="6"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe the products that belong to this category..."
                />

                <small>
                  A short description helps admins and customers
                  understand the category.
                </small>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="admin-category-form-actions">
              <Link
                to="/admin/categories"
                className="admin-category-cancel"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="admin-category-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="admin-category-spinner" />
                    Creating...
                  </>
                ) : (
                  <>
                    <span aria-hidden="true">✓</span>
                    Create Category
                  </>
                )}
              </button>
            </div>
          </form>

          {/* SIDE INFORMATION */}
          <aside className="admin-category-editor-side">
            <div className="admin-category-tip-card">
              <div className="admin-category-tip-icon">💡</div>

              <span className="admin-category-tip-label">
                QUICK TIP
              </span>

              <h3>Keep categories simple</h3>

              <p>
                Choose names that are easy to understand and
                useful for grouping related products.
              </p>
            </div>

            <div className="admin-category-preview-card">
              <span className="admin-category-preview-label">
                PREVIEW
              </span>

              <div className="admin-category-preview-icon">
                🗂️
              </div>

              <h3>
                {form.name.trim() || "Category Name"}
              </h3>

              <p>
                {form.description.trim() ||
                  "Your category description will appear here."}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default AddCategoryPage;
