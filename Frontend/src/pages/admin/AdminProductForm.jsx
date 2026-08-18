import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api/axios';

const categories = [
  'Courier Bags',
  'Boxes',
  'Tapes',
  'Labels',
  'Paper Shredded',
  'Others',
];

const emptyTier = {
  minQuantity: '',
  maxQuantity: '',
  price: '',
};

const emptySpecification = {
  key: '',
  value: '',
};

const AdminProductForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Courier Bags',
    brand: '',
    sku: '',
    price: '',
    moq: 1,
    stock: '',
    lowStockThreshold: 10,
    gst: 0,

    wholesalePricing: [
      {
        minQuantity: 1,
        maxQuantity: '',
        price: '',
      },
    ],

    weight: {
      value: '',
      unit: 'kg',
    },

    dimensions: {
      length: '',
      width: '',
      height: '',
      unit: 'cm',
    },

    isBestSeller: false,
  });

  const [images, setImages] = useState([]);
  const [specifications, setSpecifications] = useState([
    { ...emptySpecification },
  ]);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState('');

  // ==============================
  // LOAD PRODUCT FOR EDIT
  // ==============================

  useEffect(() => {
    if (!isEdit) return;

    const fetchProduct = async () => {
      try {
        const { data } =
          await API.get(`/products/${id}`);

        setFormData({
          name: data.name || '',
          description: data.description || '',
          category:
            data.category || 'Courier Bags',
          brand: data.brand || '',
          sku: data.sku || '',
          price: data.price ?? '',
          moq: data.moq ?? 1,
          stock: data.stock ?? '',
          lowStockThreshold:
            data.lowStockThreshold ?? 10,
          gst: data.gst ?? 0,

          wholesalePricing:
            data.wholesalePricing?.length
              ? data.wholesalePricing.map(
                  (tier) => ({
                    minQuantity:
                      tier.minQuantity,
                    maxQuantity:
                      tier.maxQuantity ?? '',
                    price: tier.price,
                  })
                )
              : [
                  {
                    minQuantity: 1,
                    maxQuantity: '',
                    price: data.price ?? '',
                  },
                ],

          weight: {
            value:
              data.weight?.value ?? '',
            unit:
              data.weight?.unit || 'kg',
          },

          dimensions: {
            length:
              data.dimensions?.length ?? '',
            width:
              data.dimensions?.width ?? '',
            height:
              data.dimensions?.height ?? '',
            unit:
              data.dimensions?.unit || 'cm',
          },

          isBestSeller:
            data.isBestSeller || false,
        });

        setImages(data.images || []);

        const specificationEntries =
          data.specifications
            ? Object.entries(
                data.specifications
              ).map(
                ([key, value]) => ({
                  key,
                  value,
                })
              )
            : [];

        setSpecifications(
          specificationEntries.length
            ? specificationEntries
            : [{ ...emptySpecification }]
        );
      } catch (err) {
        setError(
          err.response?.data?.message ||
            'Failed to load product'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, isEdit]);

  // ==============================
  // BASIC INPUT
  // ==============================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==============================
  // WEIGHT
  // ==============================

  const handleWeightChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      weight: {
        ...prev.weight,
        [name]: value,
      },
    }));
  };

  // ==============================
  // DIMENSIONS
  // ==============================

  const handleDimensionChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [name]: value,
      },
    }));
  };

  // ==============================
  // WHOLESALE PRICING
  // ==============================

  const handleTierChange = (
    index,
    field,
    value
  ) => {
    setFormData((prev) => {
      const tiers = [
        ...prev.wholesalePricing,
      ];

      tiers[index] = {
        ...tiers[index],
        [field]: value,
      };

      return {
        ...prev,
        wholesalePricing: tiers,
      };
    });
  };

  const addPricingTier = () => {
    setFormData((prev) => ({
      ...prev,
      wholesalePricing: [
        ...prev.wholesalePricing,
        {
          ...emptyTier,
        },
      ],
    }));
  };

  const removePricingTier = (
    index
  ) => {
    setFormData((prev) => ({
      ...prev,
      wholesalePricing:
        prev.wholesalePricing.filter(
          (_, i) => i !== index
        ),
    }));
  };

  // ==============================
  // SPECIFICATIONS
  // ==============================

  const handleSpecificationChange = (
    index,
    field,
    value
  ) => {
    setSpecifications((prev) => {
      const updated = [...prev];

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return updated;
    });
  };

  const addSpecification = () => {
    setSpecifications((prev) => [
      ...prev,
      {
        ...emptySpecification,
      },
    ]);
  };

  const removeSpecification = (
    index
  ) => {
    setSpecifications((prev) =>
      prev.filter(
        (_, i) => i !== index
      )
    );
  };

  // ==============================
  // IMAGE UPLOAD
  // ==============================

  const handleImageUpload = async (
    e
  ) => {
    const files = Array.from(
      e.target.files || []
    );

    if (!files.length) return;

    setUploading(true);
    setError('');

    try {
      const uploadedImages = [];

      for (const file of files) {
        const uploadData =
          new FormData();

        uploadData.append(
          'image',
          file
        );

        const { data } =
          await API.post(
            '/upload',
            uploadData,
            {
              headers: {
                'Content-Type':
                  'multipart/form-data',
              },
            }
          );

        const imageUrl =
          data.imageUrl;

        if (imageUrl) {
          uploadedImages.push(
            imageUrl
          );
        }
      }

      setImages((prev) => [
        ...prev,
        ...uploadedImages,
      ]);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Image upload failed'
      );
    } finally {
      setUploading(false);

      // Allow selecting the same file again
      e.target.value = '';
    }
  };

  const removeImage = (index) => {
    setImages((prev) =>
      prev.filter(
        (_, i) => i !== index
      )
    );
  };

  // ==============================
  // SUBMIT
  // ==============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');

    // Basic validation
    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      !formData.sku.trim()
    ) {
      setError(
        'Name, description and SKU are required'
      );
      return;
    }

    if (
      Number(formData.moq) < 1
    ) {
      setError(
        'MOQ must be at least 1'
      );
      return;
    }

    // Convert specifications into object
    const specificationObject = {};

    specifications.forEach(
      ({ key, value }) => {
        if (
          key.trim() &&
          value.trim()
        ) {
          specificationObject[
            key.trim()
          ] = value.trim();
        }
      }
    );

    // Prepare pricing tiers
    const pricingTiers =
      formData.wholesalePricing
        .filter(
          (tier) =>
            tier.minQuantity !==
              '' &&
            tier.price !== ''
        )
        .map((tier) => ({
          minQuantity: Number(
            tier.minQuantity
          ),

          maxQuantity:
            tier.maxQuantity === ''
              ? null
              : Number(
                  tier.maxQuantity
                ),

          price: Number(
            tier.price
          ),
        }));

    // Sort pricing tiers
    pricingTiers.sort(
      (a, b) =>
        a.minQuantity -
        b.minQuantity
    );

    try {
      setSaving(true);

      const payload = {
        name: formData.name.trim(),

        description:
          formData.description.trim(),

        category:
          formData.category,

        brand:
          formData.brand.trim(),

        sku:
          formData.sku
            .trim()
            .toUpperCase(),

        price:
          Number(formData.price),

        moq:
          Number(formData.moq),

        stock:
          Number(formData.stock),

        lowStockThreshold:
          Number(
            formData.lowStockThreshold
          ),

        gst:
          Number(formData.gst),

        wholesalePricing:
          pricingTiers,

        images,

        specifications:
          specificationObject,

        weight: {
          value:
            Number(
              formData.weight.value ||
                0
            ),
          unit:
            formData.weight.unit,
        },

        dimensions: {
          length:
            Number(
              formData.dimensions
                .length || 0
            ),
          width:
            Number(
              formData.dimensions
                .width || 0
            ),
          height:
            Number(
              formData.dimensions
                .height || 0
            ),
          unit:
            formData.dimensions.unit,
        },

        isBestSeller:
          formData.isBestSeller,
      };

      if (isEdit) {
        await API.put(
          `/products/${id}`,
          payload
        );
      } else {
        await API.post(
          '/products',
          payload
        );
      }

      navigate('/admin/products');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to save product'
      );
    } finally {
      setSaving(false);
    }
  };

  // ==============================
  // STYLES
  // ==============================

  const inputClass =
    'w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent';

  const sectionClass =
    'bg-white border border-slate-200 rounded-xl p-6 space-y-5';

  if (loading) {
    return (
      <p className="p-8 text-slate-500">
        Loading product...
      </p>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">
        {isEdit
          ? 'Edit Product'
          : 'Add Wholesale Product'}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* ==============================
            BASIC INFORMATION
        ============================== */}

        <div className={sectionClass}>
          <h2 className="text-lg font-semibold text-slate-800">
            Basic Product Information
          </h2>

          <input
            type="text"
            name="name"
            placeholder="Product Name"
            required
            value={formData.name}
            onChange={handleChange}
            className={inputClass}
          />

          <textarea
            name="description"
            placeholder="Product Description"
            required
            rows={4}
            value={
              formData.description
            }
            onChange={handleChange}
            className={inputClass}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              name="category"
              value={
                formData.category
              }
              onChange={handleChange}
              className={inputClass}
            >
              {categories.map(
                (cat) => (
                  <option
                    key={cat}
                    value={cat}
                  >
                    {cat}
                  </option>
                )
              )}
            </select>

            <input
              type="text"
              name="brand"
              placeholder="Brand"
              value={formData.brand}
              onChange={handleChange}
              className={inputClass}
            />

            <input
              type="text"
              name="sku"
              placeholder="SKU"
              required
              value={formData.sku}
              onChange={handleChange}
              className={inputClass}
            />

            <input
              type="number"
              name="gst"
              placeholder="GST %"
              min="0"
              max="100"
              step="0.01"
              value={formData.gst}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        {/* ==============================
            STOCK
        ============================== */}

        <div className={sectionClass}>
          <h2 className="text-lg font-semibold text-slate-800">
            Stock & Wholesale Settings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="number"
              name="price"
              placeholder="Base Price"
              required
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              className={inputClass}
            />

            <input
              type="number"
              name="moq"
              placeholder="MOQ"
              required
              min="1"
              value={formData.moq}
              onChange={handleChange}
              className={inputClass}
            />

            <input
              type="number"
              name="stock"
              placeholder="Stock"
              required
              min="0"
              value={formData.stock}
              onChange={handleChange}
              className={inputClass}
            />

            <input
              type="number"
              name="lowStockThreshold"
              placeholder="Low Stock Alert"
              min="0"
              value={
                formData.lowStockThreshold
              }
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        {/* ==============================
            WHOLESALE PRICING
        ============================== */}

        <div className={sectionClass}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                Quantity Based Wholesale Pricing
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Example: 1–49 ₹250, 50–199 ₹220,
                200–499 ₹200, 500+ ₹180
              </p>
            </div>

            <button
              type="button"
              onClick={
                addPricingTier
              }
              className="text-sm bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
            >
              + Add Tier
            </button>
          </div>

          <div className="space-y-3">
            {formData.wholesalePricing.map(
              (tier, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-3 items-center"
                >
                  <input
                    type="number"
                    min="1"
                    placeholder="Min Quantity"
                    value={
                      tier.minQuantity
                    }
                    onChange={(e) =>
                      handleTierChange(
                        index,
                        'minQuantity',
                        e.target.value
                      )
                    }
                    className={
                      inputClass
                    }
                  />

                  <input
                    type="number"
                    min="1"
                    placeholder="Max Quantity (blank = unlimited)"
                    value={
                      tier.maxQuantity
                    }
                    onChange={(e) =>
                      handleTierChange(
                        index,
                        'maxQuantity',
                        e.target.value
                      )
                    }
                    className={
                      inputClass
                    }
                  />

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Price per unit"
                    value={tier.price}
                    onChange={(e) =>
                      handleTierChange(
                        index,
                        'price',
                        e.target.value
                      )
                    }
                    className={
                      inputClass
                    }
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removePricingTier(
                        index
                      )
                    }
                    className="text-red-600 hover:text-red-700 font-medium px-2"
                  >
                    Remove
                  </button>
                </div>
              )
            )}
          </div>
        </div>

        {/* ==============================
            IMAGES
        ============================== */}

        <div className={sectionClass}>
          <h2 className="text-lg font-semibold text-slate-800">
            Product Images
          </h2>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={
              handleImageUpload
            }
            className="text-sm"
          />

          {uploading && (
            <p className="text-sm text-slate-500">
              Uploading images...
            </p>
          )}

          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {images.map(
                (image, index) => (
                  <div
                    key={image}
                    className="relative"
                  >
                    <img
                      src={image}
                      alt={`Product ${
                        index + 1
                      }`}
                      className="w-full h-28 object-cover rounded-lg bg-slate-50 border"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeImage(
                          index
                        )
                      }
                      className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded"
                    >
                      Remove
                    </button>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* ==============================
            SPECIFICATIONS
        ============================== */}

        <div className={sectionClass}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">
              Specifications
            </h2>

            <button
              type="button"
              onClick={
                addSpecification
              }
              className="text-sm bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-900"
            >
              + Add Specification
            </button>
          </div>

          <div className="space-y-3">
            {specifications.map(
              (spec, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-3"
                >
                  <input
                    type="text"
                    placeholder="Specification"
                    value={spec.key}
                    onChange={(e) =>
                      handleSpecificationChange(
                        index,
                        'key',
                        e.target.value
                      )
                    }
                    className={
                      inputClass
                    }
                  />

                  <input
                    type="text"
                    placeholder="Value"
                    value={spec.value}
                    onChange={(e) =>
                      handleSpecificationChange(
                        index,
                        'value',
                        e.target.value
                      )
                    }
                    className={
                      inputClass
                    }
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeSpecification(
                        index
                      )
                    }
                    className="text-red-600 font-medium"
                  >
                    Remove
                  </button>
                </div>
              )
            )}
          </div>
        </div>

        {/* ==============================
            WEIGHT
        ============================== */}

        <div className={sectionClass}>
          <h2 className="text-lg font-semibold text-slate-800">
            Weight
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              min="0"
              step="0.001"
              name="value"
              placeholder="Weight"
              value={
                formData.weight.value
              }
              onChange={
                handleWeightChange
              }
              className={inputClass}
            />

            <select
              name="unit"
              value={
                formData.weight.unit
              }
              onChange={
                handleWeightChange
              }
              className={inputClass}
            >
              <option value="kg">
                Kilogram (kg)
              </option>
              <option value="g">
                Gram (g)
              </option>
            </select>
          </div>
        </div>

        {/* ==============================
            DIMENSIONS
        ============================== */}

        <div className={sectionClass}>
          <h2 className="text-lg font-semibold text-slate-800">
            Dimensions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="number"
              min="0"
              step="0.01"
              name="length"
              placeholder="Length"
              value={
                formData.dimensions
                  .length
              }
              onChange={
                handleDimensionChange
              }
              className={inputClass}
            />

            <input
              type="number"
              min="0"
              step="0.01"
              name="width"
              placeholder="Width"
              value={
                formData.dimensions
                  .width
              }
              onChange={
                handleDimensionChange
              }
              className={inputClass}
            />

            <input
              type="number"
              min="0"
              step="0.01"
              name="height"
              placeholder="Height"
              value={
                formData.dimensions
                  .height
              }
              onChange={
                handleDimensionChange
              }
              className={inputClass}
            />

            <select
              name="unit"
              value={
                formData.dimensions
                  .unit
              }
              onChange={
                handleDimensionChange
              }
              className={inputClass}
            >
              <option value="cm">
                Centimeter
              </option>
              <option value="mm">
                Millimeter
              </option>
              <option value="inch">
                Inch
              </option>
            </select>
          </div>
        </div>

        {/* ==============================
            BEST SELLER
        ============================== */}

        <div className={sectionClass}>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={
                formData.isBestSeller
              }
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isBestSeller:
                    e.target.checked,
                }))
              }
              className="w-4 h-4"
            />

            <span className="text-sm font-medium text-slate-700">
              Mark as Best Seller
            </span>
          </label>
        </div>

        {/* ==============================
            ERROR
        ============================== */}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {/* ==============================
            SAVE
        ============================== */}

        <button
          type="submit"
          disabled={
            saving || uploading
          }
          className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition-colors font-medium disabled:bg-slate-300"
        >
          {saving
            ? 'Saving Product...'
            : isEdit
            ? 'Update Product'
            : 'Create Product'}
        </button>
      </form>
    </div>
  );
};

export default AdminProductForm;