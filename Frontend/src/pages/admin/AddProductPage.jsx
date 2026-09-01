// ============================================================
// SHANTI ENTERPRISES
// Add Product Page
// Frontend Phase 6 - Admin
// ============================================================

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  createProduct,
} from "../../api/productApi";

import {
  getCategories,
} from "../../api/categoryApi";

import {
  uploadImage,
} from "../../api/uploadApi";

// ============================================================
// ADD PRODUCT PAGE
// ============================================================

function AddProductPage() {
  const navigate =
    useNavigate();

  const fileInputRef =
    useRef(null);

  // ==========================================================
  // FORM
  // ==========================================================

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

  // ==========================================================
  // SELECTED IMAGE
  // ==========================================================

  const [
    selectedImage,
    setSelectedImage,
  ] = useState(null);

  const [
    imagePreview,
    setImagePreview,
  ] = useState("");

  const [
    imageUploading,
    setImageUploading,
  ] = useState(false);

  const [
    uploadedImageUrl,
    setUploadedImageUrl,
  ] = useState("");

  // ==========================================================
  // PAGE STATE
  // ==========================================================

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

  const [
    categories,
    setCategories,
  ] = useState([]);

  const [
    categoriesLoading,
    setCategoriesLoading,
  ] = useState(true);

  // ==========================================================
  // LOAD ACTIVE CATEGORIES
  // ==========================================================

  useEffect(() => {
    let isMounted = true;

    getCategories()
      .then((response) => {
        if (!isMounted) {
          return;
        }

        setCategories(
          response?.categories || []
        );
      })
      .catch((loadError) => {
        console.error(
          "Load categories error:",
          loadError
        );
      })
      .finally(() => {
        if (isMounted) {
          setCategoriesLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // ==========================================================
  // CLEANUP IMAGE PREVIEW
  // ==========================================================

  useEffect(() => {
    return () => {
      if (
        imagePreview &&
        imagePreview.startsWith(
          "blob:"
        )
      ) {
        URL.revokeObjectURL(
          imagePreview
        );
      }
    };
  }, [
    imagePreview,
  ]);

  // ==========================================================
  // HANDLE TEXT INPUT
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
  // OPEN FILE SELECTOR
  // ==========================================================

  const handleChooseImage = () => {
    if (
      imageUploading ||
      loading
    ) {
      return;
    }

    fileInputRef.current?.click();
  };

  // ==========================================================
  // HANDLE IMAGE SELECTION
  // ==========================================================

  const handleImageChange = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    setError("");
    setSuccess("");

    if (!file) {
      return;
    }

    // --------------------------------------------------------
    // ALLOWED FILE TYPES
    // --------------------------------------------------------

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      setError(
        "Only JPG, JPEG, PNG, WEBP and GIF images are allowed."
      );

      event.target.value = "";

      return;
    }

    // --------------------------------------------------------
    // FILE SIZE
    // --------------------------------------------------------

    const maxSize =
      5 * 1024 * 1024;

    if (
      file.size >
      maxSize
    ) {
      setError(
        "Image size cannot exceed 5 MB."
      );

      event.target.value = "";

      return;
    }

    // --------------------------------------------------------
    // PREVIEW
    // --------------------------------------------------------

    const previewUrl =
      URL.createObjectURL(
        file
      );

    setSelectedImage(file);

    setImagePreview(
      previewUrl
    );

    setUploadedImageUrl("");

    setForm(
      (current) => ({
        ...current,
        image: "",
      })
    );
  };

  // ==========================================================
  // REMOVE IMAGE
  // ==========================================================

  const handleRemoveImage = () => {
    if (
      imagePreview &&
      imagePreview.startsWith(
        "blob:"
      )
    ) {
      URL.revokeObjectURL(
        imagePreview
      );
    }

    setSelectedImage(null);
    setImagePreview("");
    setUploadedImageUrl("");

    setForm(
      (current) => ({
        ...current,
        image: "",
      })
    );

    if (
      fileInputRef.current
    ) {
      fileInputRef.current.value =
        "";
    }

    setError("");
    setSuccess("");
  };

  // ==========================================================
  // UPLOAD IMAGE
  // ==========================================================

  const handleUploadImage =
    async () => {
      if (!selectedImage) {
        setError(
          "Please choose an image first."
        );

        return;
      }

      try {
        setImageUploading(true);
        setError("");
        setSuccess("");

        const response =
          await uploadImage(
            selectedImage
          );

        const imageUrl =
          response?.image?.url;

        if (!imageUrl) {
          throw new Error(
            "Image uploaded but no image URL was returned."
          );
        }

        setUploadedImageUrl(
          imageUrl
        );

        setForm(
          (current) => ({
            ...current,
            image: imageUrl,
          })
        );

        setSuccess(
          "Image uploaded successfully."
        );
      } catch (err) {
        console.error(
          "Image upload error:",
          err
        );

        setUploadedImageUrl("");
        setForm(
          (current) => ({
            ...current,
            image: "",
          })
        );

        setError(
          err.response?.data
            ?.message ||
            err.message ||
            "Unable to upload image."
        );
      } finally {
        setImageUploading(false);
      }
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

    if (
      selectedImage &&
      !uploadedImageUrl
    ) {
      return "Please upload the selected image before creating the product.";
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
          form.category || null,

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
      }, 1000);
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

        <Link
          to="/admin/products"
        >
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

          <select
            id="category"
            name="category"
            value={
              form.category
            }
            onChange={
              handleChange
            }
            disabled={categoriesLoading}
          >

            <option value="">
              {categoriesLoading
                ? "Loading categories..."
                : "No category"}
            </option>

            {categories.map((category) => (
              <option
                key={category._id}
                value={category._id}
              >
                {category.name}
              </option>
            ))}

          </select>

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

        {/* ==================================================
            PRODUCT IMAGE
            ================================================== */}

        <div>

          <label>
            Product Image
          </label>

          {/* HIDDEN FILE INPUT */}

          <input
            ref={
              fileInputRef
            }
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            onChange={
              handleImageChange
            }
            style={{
              display: "none",
            }}
          />

          {/* CHOOSE IMAGE */}

          {!selectedImage && (
            <button
              type="button"
              onClick={
                handleChooseImage
              }
              disabled={
                loading ||
                imageUploading
              }
            >
              Choose Image
            </button>
          )}

          {/* IMAGE PREVIEW */}

          {imagePreview && (
            <div>

              <div>
                <img
                  src={
                    imagePreview
                  }
                  alt="Product preview"
                  style={{
                    width:
                      "220px",
                    height:
                      "220px",
                    objectFit:
                      "cover",
                    borderRadius:
                      "12px",
                    display:
                      "block",
                  }}
                />
              </div>

              <p>
                {selectedImage?.name}
              </p>

              <div>

                <button
                  type="button"
                  onClick={
                    handleChooseImage
                  }
                  disabled={
                    loading ||
                    imageUploading
                  }
                >
                  Change Image
                </button>

                <button
                  type="button"
                  onClick={
                    handleRemoveImage
                  }
                  disabled={
                    loading ||
                    imageUploading
                  }
                >
                  Remove
                </button>

              </div>

            </div>
          )}

          {/* UPLOAD IMAGE */}

          {selectedImage &&
            !uploadedImageUrl && (
              <div>

                <button
                  type="button"
                  onClick={
                    handleUploadImage
                  }
                  disabled={
                    imageUploading ||
                    loading
                  }
                >
                  {imageUploading
                    ? "Uploading..."
                    : "Upload Image"}
                </button>

              </div>
            )}

          {/* UPLOADED STATUS */}

          {uploadedImageUrl && (
            <div>

              <p>
                ✓ Image uploaded
                successfully
              </p>

              <button
                type="button"
                onClick={
                  handleChooseImage
                }
                disabled={
                  loading ||
                  imageUploading
                }
              >
                Change Image
              </button>

            </div>
          )}

          <p>
            JPG, JPEG, PNG, WEBP or GIF
            · Maximum 5 MB
          </p>

        </div>

        {/* ==================================================
            ACTIONS
            ================================================== */}

        <div>

          <button
            type="submit"
            disabled={
              loading ||
              imageUploading
            }
          >
            {loading
              ? "Creating..."
              : "Create Product"}
          </button>

          <Link
            to="/admin/products"
          >
            Cancel
          </Link>

        </div>

      </form>

    </section>
  );
}

export default AddProductPage;
