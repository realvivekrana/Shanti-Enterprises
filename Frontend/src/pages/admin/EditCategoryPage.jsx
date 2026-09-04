// ============================================================
// SHANTI ENTERPRISES
// Edit Category Page
// Frontend Phase 6 - Premium UI/UX
// ============================================================

import { useEffect, useState } from "react";

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

import "./EditCategoryPage.css";

// ============================================================
// EDIT CATEGORY PAGE
// ============================================================

function EditCategoryPage() {
  const { categoryId } = useParams();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================================
  // LOAD CATEGORY
  // ==========================================================

  const loadCategory = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCategoryById(categoryId);

      const category =
        response?.category ||
        response?.data?.category ||
        response?.data ||
        response;

      if (!category) {
        throw new Error("Category not found.");
      }

      setForm({
        name: category.name || category.title || "",
        description: category.description || "",
      });
    } catch (err) {
      console.error("Load category error:", err);

      setError(
        err.response?.data?.message ||
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
      setSaving(true);
      setError("");
      setSuccess("");

      await updateCategory(categoryId, {
        name: form.name.trim(),
        description: form.description.trim(),
      });

      setSuccess("Category updated successfully.");

      setTimeout(() => {
        navigate("/admin/categories");
      }, 800);
    } catch (err) {
      console.error("Update category error:", err);

      setError(
        err.response?.data?.message ||
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
    return <Loading message="Loading category..." />;
  }

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <section className="app-page admin-category-editor admin-category-editor--edit">
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

            <h1>Edit Category</h1>

            <p>
              Update category information and keep your
              product catalog organized.
            </p>
          </div>

          <div className="admin-category-editor-header-icon admin-category-editor-header-icon--edit">
            <span aria-hidden="true">✎</span>
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

              <p>Review and update the category details below.</p>
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
                  placeholder="Enter category name"
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
                  placeholder="Enter category description"
                />

                <small>
                  Keep the description concise and relevant to
                  the products in this category.
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
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="admin-category-spinner" />
                    Updating...
                  </>
                ) : (
                  <>
                    <span aria-hidden="true">✓</span>
                    Update Category
                  </>
                )}
              </button>
            </div>
          </form>

          {/* SIDE INFORMATION */}
          <aside className="admin-category-editor-side">
            <div className="admin-category-tip-card">
              <div className="admin-category-tip-icon">✨</div>

              <span className="admin-category-tip-label">
                EDITING MODE
              </span>

              <h3>Make meaningful updates</h3>

              <p>
                Keep the category name consistent with the
                products and business structure it represents.
              </p>
            </div>

            <div className="admin-category-preview-card">
              <span className="admin-category-preview-label">
                LIVE PREVIEW
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

export default EditCategoryPage;
