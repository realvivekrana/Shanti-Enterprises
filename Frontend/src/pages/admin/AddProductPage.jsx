// ============================================================
// SHANTI ENTERPRISES
// Add Product Page
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
  createProduct,
} from "../../api/productApi";

function AddProductPage() {
  const navigate =
    useNavigate();

  const [
    form,
    setForm,
  ] = useState({
    name: "",
    sku: "",
    description: "",
    price: "",
    stock: "",
    moq: "1",
    category: "",
    brand: "",
    image: "",
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
  // VALIDATION
  // ==========================================================

  const validateForm = () => {
    if (!form.name.trim()) {
      return "Product name is required.";
    }

    if (!form.price) {
      return "Product price is required.";
    }

    if (
      Number(form.price) < 0
    ) {
      return "Price cannot be negative.";
    }

    if (
      form.stock === "" ||
      Number(form.stock) < 0
    ) {
      return "Valid stock is required.";
    }

    if (
      !form.moq ||
      Number(form.moq) < 1
    ) {
      return "MOQ must be at least 1.";
    }

    return "";
  };

  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    const validationError =
      validateForm();

    if (validationError) {
      setError(
        validationError
      );

      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const productData = {
        name:
          form.name.trim(),

        sku:
          form.sku.trim(),

        description:
          form.description.trim(),

        price:
          Number(form.price),

        stock:
          Number(form.stock),

        moq:
          Number(form.moq),

        category:
          form.category.trim(),

        brand:
          form.brand.trim(),

        image:
          form.image.trim(),
      };

      await createProduct(
        productData
      );

      setSuccess(
        "Product created successfully."
      );

      setTimeout(() => {
        navigate(
          "/admin/products"
        );
      }, 800);

    } catch (err) {
      console.error(
        "Create product error:",
        err
      );

      setError(
        err.response?.data
          ?.message ||
          err.message ||
          "Unable to create product."
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

      {/* ====================================================
          HEADER
          ==================================================== */}

      <div>

        <Link to="/admin/products">
          ← Product Management
        </Link>

        <h1>
          Add Product
        </h1>

        <p>
          Create a new product
          for your store.
        </p>

      </div>

      {/* ====================================================
          ERROR
          ==================================================== */}

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

      {/* ====================================================
          SUCCESS
          ==================================================== */}

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

      {/* ====================================================
          FORM
          ==================================================== */}

      <form
        onSubmit={
          handleSubmit
        }
      >

        {/* PRODUCT NAME */}

        <div>

          <label htmlFor="name">
            Product Name *
          </label>

          <input
            id="name"
            name="name"
            type="text"
            value={
              form.name
            }
            onChange={
              handleChange
            }
            placeholder="Enter product name"
          />

        </div>

        {/* SKU */}

        <div>

          <label htmlFor="sku">
            SKU
          </label>

          <input
            id="sku"
            name="sku"
            type="text"
            value={
              form.sku
            }
            onChange={
              handleChange
            }
            placeholder="Enter SKU"
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
            value={
              form.description
            }
            onChange={
              handleChange
            }
            placeholder="Enter product description"
            rows="5"
          />

        </div>

        {/* PRICE */}

        <div>

          <label htmlFor="price">
            Price *
          </label>

          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={
              form.price
            }
            onChange={
              handleChange
            }
            placeholder="Enter price"
          />

        </div>

        {/* STOCK */}

        <div>

          <label htmlFor="stock">
            Stock *
          </label>

          <input
            id="stock"
            name="stock"
            type="number"
            min="0"
            value={
              form.stock
            }
            onChange={
              handleChange
            }
            placeholder="Enter stock quantity"
          />

        </div>

        {/* MOQ */}

        <div>

          <label htmlFor="moq">
            Minimum Order Quantity *
          </label>

          <input
            id="moq"
            name="moq"
            type="number"
            min="1"
            value={
              form.moq
            }
            onChange={
              handleChange
            }
            placeholder="Enter MOQ"
          />

        </div>

        {/* CATEGORY */}

        <div>

          <label htmlFor="category">
            Category
          </label>

          <input
            id="category"
            name="category"
            type="text"
            value={
              form.category
            }
            onChange={
              handleChange
            }
            placeholder="Enter category"
          />

        </div>

        {/* BRAND */}

        <div>

          <label htmlFor="brand">
            Brand
          </label>

          <input
            id="brand"
            name="brand"
            type="text"
            value={
              form.brand
            }
            onChange={
              handleChange
            }
            placeholder="Enter brand"
          />

        </div>

        {/* IMAGE */}

        <div>

          <label htmlFor="image">
            Image URL
          </label>

          <input
            id="image"
            name="image"
            type="url"
            value={
              form.image
            }
            onChange={
              handleChange
            }
            placeholder="https://example.com/image.jpg"
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
              : "Create Product"}
          </button>

          <Link to="/admin/products">
            Cancel
          </Link>

        </div>

      </form>

    </section>
  );
}

export default AddProductPage;