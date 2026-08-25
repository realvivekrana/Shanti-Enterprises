// ============================================================
// SHANTI ENTERPRISES
// Edit Product Page
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
  getProductById,
  updateProduct,
} from "../../api/productApi";

import Loading from "../../components/common/Loading";

import ErrorMessage from "../../components/common/ErrorMessage";

// ============================================================
// EDIT PRODUCT PAGE
// ============================================================

function EditProductPage() {
  const {
    productId,
  } = useParams();

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
  // LOAD PRODUCT
  // ==========================================================

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getProductById(
          productId
        );

      const product =
        response?.product ||
        response?.data?.product ||
        response?.data ||
        response;

      if (!product) {
        throw new Error(
          "Product not found."
        );
      }

      const category =
        typeof product.category ===
        "object"
          ? product.category?.name
          : product.category;

      const brand =
        typeof product.brand ===
        "object"
          ? product.brand?.name
          : product.brand;

      const image =
        product.image ||
        (
          Array.isArray(
            product.images
          )
            ? product.images[0]
            : ""
        );

      setForm({
        name:
          product.name ||
          product.title ||
          "",

        sku:
          product.sku ||
          "",

        description:
          product.description ||
          "",

        price:
          product.price ??
          product.sellingPrice ??
          product.salePrice ??
          "",

        stock:
          product.stock ??
          product.countInStock ??
          product.inventory ??
          product.quantity ??
          "",

        moq:
          product.moq ??
          product.minimumOrderQuantity ??
          product.minOrderQuantity ??
          1,

        category:
          category || "",

        brand:
          brand || "",

        image:
          image || "",
      });
    } catch (err) {
      console.error(
        "Load product error:",
        err
      );

      setError(
        err.response?.data
          ?.message ||
          err.message ||
          "Unable to load product."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    if (productId) {
      loadProduct();
    }
  }, [productId]);

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

    if (
      form.price === "" ||
      Number(form.price) < 0
    ) {
      return "Valid price is required.";
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
  // UPDATE PRODUCT
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
      setSaving(true);
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

      await updateProduct(
        productId,
        productData
      );

      setSuccess(
        "Product updated successfully."
      );

      setTimeout(() => {
        navigate(
          "/admin/products"
        );
      }, 800);
    } catch (err) {
      console.error(
        "Update product error:",
        err
      );

      setError(
        err.response?.data
          ?.message ||
          err.message ||
          "Unable to update product."
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
        message="Loading product..."
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

        <Link to="/admin/products">
          ← Product Management
        </Link>

        <h1>
          Edit Product
        </h1>

        <p>
          Update product information.
        </p>

      </div>

      {/* ERROR */}

      {error && (
        <ErrorMessage
          message={error}
          onRetry={loadProduct}
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
            Product Name *
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

        {/* SKU */}

        <div>

          <label htmlFor="sku">
            SKU
          </label>

          <input
            id="sku"
            name="sku"
            type="text"
            value={form.sku}
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
            value={form.price}
            onChange={
              handleChange
            }
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
            value={form.stock}
            onChange={
              handleChange
            }
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
            value={form.moq}
            onChange={
              handleChange
            }
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
            value={form.brand}
            onChange={
              handleChange
            }
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
            value={form.image}
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
              : "Update Product"}
          </button>

          <Link to="/admin/products">
            Cancel
          </Link>

        </div>

      </form>

    </section>
  );
}

export default EditProductPage;