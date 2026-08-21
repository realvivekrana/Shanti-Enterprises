import {
  useEffect,
  useState,
} from 'react';

import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom';


// ======================================================
// API CONFIG
// ======================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000';


// ======================================================
// CATEGORY OPTIONS
// Product.js ke actual enum ke according
// ======================================================

const CATEGORY_OPTIONS = [
  'Courier Bags',
  'Boxes',
  'Tapes',
  'Labels',
  'Paper Shredded',
  'Others',
];


// ======================================================
// INITIAL FORM
// ======================================================

const INITIAL_FORM = {
  name: '',
  description: '',
  category: '',
  brand: '',
  sku: '',

  price: '',
  costPrice: '',

  moq: '1',

  stock: '',
  lowStockThreshold: '10',

  gst: '0',

  location: '',
  deliveryTimeDays: '7',

  weightValue: '',
  weightUnit: 'kg',

  dimensionLength: '',
  dimensionWidth: '',
  dimensionHeight: '',
  dimensionUnit: 'cm',

  isBestSeller: false,
};


// ======================================================
// ADMIN PRODUCT FORM
// ======================================================

const AdminProductForm = () => {
  const navigate =
    useNavigate();

  const { id } =
    useParams();

  const isEditMode =
    Boolean(id);


  // ====================================================
  // FORM STATE
  // ====================================================

  const [form, setForm] =
    useState(
      INITIAL_FORM
    );


  // ====================================================
  // WHOLESALE PRICING
  // ====================================================

  const [
    wholesalePricing,
    setWholesalePricing,
  ] = useState([]);


  // ====================================================
  // SPECIFICATIONS
  // ====================================================

  const [
    specifications,
    setSpecifications,
  ] = useState([]);


  // ====================================================
  // IMAGES
  // ====================================================

  const [
    existingImages,
    setExistingImages,
  ] = useState([]);


  const [
    imageFiles,
    setImageFiles,
  ] = useState([]);


  const [
    imagePreviews,
    setImagePreviews,
  ] = useState([]);


  // ====================================================
  // STATE
  // ====================================================

  const [loading, setLoading] =
    useState(isEditMode);

  const [saving, setSaving] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [error, setError] =
    useState('');

  const [success, setSuccess] =
    useState('');


  // ====================================================
  // TOKEN
  // ====================================================

  const getToken = () => {
    const adminToken =
      localStorage.getItem(
        'adminToken'
      );

    if (adminToken) {
      return adminToken;
    }


    const token =
      localStorage.getItem(
        'token'
      );

    if (token) {
      return token;
    }


    const userInfo =
      localStorage.getItem(
        'userInfo'
      );

    if (!userInfo) {
      return '';
    }


    try {
      const parsed =
        JSON.parse(
          userInfo
        );

      return (
        parsed.token ||
        parsed.accessToken ||
        ''
      );
    } catch {
      return '';
    }
  };


  // ====================================================
  // API REQUEST
  // ====================================================

  const apiRequest = async (
    endpoint,
    options = {}
  ) => {

    const token =
      getToken();


    const headers = {
      ...(options.headers || {}),
    };


    if (
      !(options.body instanceof FormData)
    ) {
      headers[
        'Content-Type'
      ] =
        'application/json';
    }


    if (token) {
      headers.Authorization =
        `Bearer ${token}`;
    }


    const response =
      await fetch(
        `${API_URL}${endpoint}`,
        {
          ...options,
          headers,
        }
      );


    let data = {};

    try {
      data =
        await response.json();
    } catch {
      data = {};
    }


    if (!response.ok) {
      throw new Error(
        data?.message ||
          data?.error ||
          'Something went wrong'
      );
    }


    return data;
  };


  // ====================================================
  // GET PRODUCT
  // ====================================================

  const fetchProduct =
    async () => {

      if (!id) {
        return;
      }


      try {

        setLoading(true);

        setError('');


        const data =
          await apiRequest(
            `/api/products/${id}`
          );


        const product =
          data?.data ||
          data?.product ||
          data;


        if (!product) {
          throw new Error(
            'Product data not found'
          );
        }


        // ----------------------------------------------
        // BASIC DATA
        // ----------------------------------------------

        setForm({
          name:
            product.name || '',

          description:
            product.description || '',

          category:
            product.category || '',

          brand:
            product.brand || '',

          sku:
            product.sku || '',

          price:
            product.price ?? '',

          costPrice:
            product.costPrice ?? '',

          moq:
            product.moq ?? 1,

          stock:
            product.stock ?? '',

          lowStockThreshold:
            product.lowStockThreshold ??
            10,

          gst:
            product.gst ?? 0,

          location:
            product.location || '',

          deliveryTimeDays:
            product.deliveryTimeDays ??
            7,

          weightValue:
            product.weight?.value ??
            '',

          weightUnit:
            product.weight?.unit ||
            'kg',

          dimensionLength:
            product.dimensions?.length ??
            '',

          dimensionWidth:
            product.dimensions?.width ??
            '',

          dimensionHeight:
            product.dimensions?.height ??
            '',

          dimensionUnit:
            product.dimensions?.unit ||
            'cm',

          isBestSeller:
            product.isBestSeller ===
            true,
        });


        // ----------------------------------------------
        // WHOLESALE PRICING
        // ----------------------------------------------

        setWholesalePricing(
          Array.isArray(
            product.wholesalePricing
          )
            ? product.wholesalePricing.map(
                (tier) => ({
                  minQuantity:
                    tier.minQuantity ??
                    '',
                  maxQuantity:
                    tier.maxQuantity ??
                    '',
                  price:
                    tier.price ??
                    '',
                })
              )
            : []
        );


        // ----------------------------------------------
        // SPECIFICATIONS
        // ----------------------------------------------

        if (
          product.specifications
        ) {

          let specificationEntries =
            [];


          if (
            product.specifications
              instanceof Map
          ) {

            specificationEntries =
              Array.from(
                product.specifications.entries()
              );

          } else if (
            typeof product.specifications ===
            'object'
          ) {

            specificationEntries =
              Object.entries(
                product.specifications
              );

          }


          setSpecifications(
            specificationEntries.map(
              ([key, value]) => ({
                key,
                value,
              })
            )
          );

        } else {

          setSpecifications([]);

        }


        // ----------------------------------------------
        // IMAGES
        // ----------------------------------------------

        setExistingImages(
          Array.isArray(
            product.images
          )
            ? product.images
            : []
        );

      } catch (err) {

        console.error(
          'Fetch product error:',
          err
        );


        setError(
          err.message ||
            'Unable to load product'
        );

      } finally {

        setLoading(false);

      }

    };


  // ====================================================
  // LOAD EDIT PRODUCT
  // ====================================================

  useEffect(() => {

    if (isEditMode) {
      fetchProduct();
    }

  }, [id]);


  // ====================================================
  // CLEAN IMAGE PREVIEWS
  // ====================================================

  useEffect(() => {

    return () => {

      imagePreviews.forEach(
        (url) => {
          URL.revokeObjectURL(
            url
          );
        }
      );

    };

  }, [imagePreviews]);


  // ====================================================
  // INPUT CHANGE
  // ====================================================

  const handleChange =
    (event) => {

      const {
        name,
        value,
        type,
        checked,
      } = event.target;


      setForm(
        (previous) => ({
          ...previous,

          [name]:
            type === 'checkbox'
              ? checked
              : value,
        })
      );


      setError('');
      setSuccess('');

    };


  // ====================================================
  // WHOLESALE TIER
  // ====================================================

  const addWholesaleTier =
    () => {

      setWholesalePricing(
        (previous) => [
          ...previous,
          {
            minQuantity: '',
            maxQuantity: '',
            price: '',
          },
        ]
      );

    };


  const removeWholesaleTier =
    (index) => {

      setWholesalePricing(
        (previous) =>
          previous.filter(
            (_, itemIndex) =>
              itemIndex !== index
          )
      );

    };


  const updateWholesaleTier =
    (
      index,
      field,
      value
    ) => {

      setWholesalePricing(
        (previous) =>
          previous.map(
            (tier, itemIndex) => {

              if (
                itemIndex !== index
              ) {
                return tier;
              }


              return {
                ...tier,
                [field]: value,
              };

            }
          )
      );

    };


  // ====================================================
  // SPECIFICATION
  // ====================================================

  const addSpecification =
    () => {

      setSpecifications(
        (previous) => [
          ...previous,
          {
            key: '',
            value: '',
          },
        ]
      );

    };


  const removeSpecification =
    (index) => {

      setSpecifications(
        (previous) =>
          previous.filter(
            (_, itemIndex) =>
              itemIndex !== index
          )
      );

    };


  const updateSpecification =
    (
      index,
      field,
      value
    ) => {

      setSpecifications(
        (previous) =>
          previous.map(
            (
              specification,
              itemIndex
            ) => {

              if (
                itemIndex !== index
              ) {
                return specification;
              }


              return {
                ...specification,
                [field]: value,
              };

            }
          )
      );

    };


  // ====================================================
  // IMAGE SELECT
  // ====================================================

  const handleImageChange =
    (event) => {

      const files =
        Array.from(
          event.target.files ||
            []
        );


      if (!files.length) {
        return;
      }


      setImageFiles(
        (previous) => [
          ...previous,
          ...files,
        ]
      );


      const newUrls =
        files.map(
          (file) =>
            URL.createObjectURL(
              file
            )
        );


      setImagePreviews(
        (previous) => [
          ...previous,
          ...newUrls,
        ]
      );


      event.target.value = '';

    };


  // ====================================================
  // REMOVE NEW IMAGE
  // ====================================================

  const removeNewImage =
    (index) => {

      const url =
        imagePreviews[index];


      if (url) {
        URL.revokeObjectURL(
          url
        );
      }


      setImageFiles(
        (previous) =>
          previous.filter(
            (_, itemIndex) =>
              itemIndex !== index
          )
      );


      setImagePreviews(
        (previous) =>
          previous.filter(
            (_, itemIndex) =>
              itemIndex !== index
          )
      );

    };


  // ====================================================
  // REMOVE EXISTING IMAGE
  // ====================================================

  const removeExistingImage =
    (index) => {

      setExistingImages(
        (previous) =>
          previous.filter(
            (_, itemIndex) =>
              itemIndex !== index
          )
      );

    };


  // ====================================================
  // VALIDATE WHOLESALE
  // ====================================================

  const validateWholesale =
    () => {

      if (
        wholesalePricing.length ===
        0
      ) {
        return '';
      }


      const tiers =
        wholesalePricing.map(
          (tier) => ({
            minQuantity:
              Number(
                tier.minQuantity
              ),

            maxQuantity:
              tier.maxQuantity ===
                '' ||
              tier.maxQuantity ===
                null
                ? null
                : Number(
                    tier.maxQuantity
                  ),

            price:
              Number(
                tier.price
              ),
          })
        );


      for (
        const tier of tiers
      ) {

        if (
          !Number.isInteger(
            tier.minQuantity
          ) ||
          tier.minQuantity < 1
        ) {
          return 'Wholesale minimum quantity must be a positive whole number.';
        }


        if (
          tier.maxQuantity !==
            null &&
          (
            !Number.isInteger(
              tier.maxQuantity
            ) ||
            tier.maxQuantity <
              tier.minQuantity
          )
        ) {
          return 'Wholesale maximum quantity must be greater than or equal to minimum quantity.';
        }


        if (
          Number.isNaN(
            tier.price
          ) ||
          tier.price < 0
        ) {
          return 'Wholesale price must be a valid positive number.';
        }

      }


      const sorted =
        [...tiers].sort(
          (a, b) =>
            a.minQuantity -
            b.minQuantity
        );


      for (
        let i = 0;
        i <
        sorted.length - 1;
        i++
      ) {

        const current =
          sorted[i];

        const next =
          sorted[i + 1];


        if (
          current.maxQuantity !==
            null &&
          current.maxQuantity >=
            next.minQuantity
        ) {

          return 'Wholesale pricing tiers cannot overlap.';

        }

      }


      return '';

    };


  // ====================================================
  // VALIDATE FORM
  // ====================================================

  const validateForm =
    () => {

      if (
        !form.name.trim()
      ) {
        return 'Product name is required.';
      }


      if (
        !form.description.trim()
      ) {
        return 'Product description is required.';
      }


      if (
        !form.category
      ) {
        return 'Please select a product category.';
      }


      if (
        !form.sku.trim()
      ) {
        return 'SKU is required.';
      }


      if (
        form.price === '' ||
        Number(form.price) < 0
      ) {
        return 'Please enter a valid selling price.';
      }


      if (
        form.costPrice === '' ||
        Number(form.costPrice) < 0
      ) {
        return 'Please enter a valid cost price.';
      }


      if (
        form.moq === '' ||
        Number(form.moq) < 1
      ) {
        return 'MOQ must be at least 1.';
      }


      if (
        form.stock === '' ||
        Number(form.stock) < 0
      ) {
        return 'Please enter a valid stock quantity.';
      }


      if (
        form.lowStockThreshold ===
          '' ||
        Number(
          form.lowStockThreshold
        ) < 0
      ) {
        return 'Please enter a valid low stock threshold.';
      }


      if (
        form.gst === '' ||
        Number(form.gst) < 0 ||
        Number(form.gst) > 100
      ) {
        return 'GST must be between 0 and 100.';
      }


      if (
        form.deliveryTimeDays ===
          '' ||
        Number(
          form.deliveryTimeDays
        ) < 0
      ) {
        return 'Please enter a valid delivery time.';
      }


      const wholesaleError =
        validateWholesale();


      if (wholesaleError) {
        return wholesaleError;
      }


      return '';

    };


  // ====================================================
  // BUILD PAYLOAD
  // ====================================================

  const buildPayload =
    () => {

      // ----------------------------------------------
      // WHOLESALE
      // ----------------------------------------------

      const cleanedWholesale =
        wholesalePricing
          .filter(
            (tier) =>
              tier.minQuantity !==
                '' &&
              tier.price !==
                ''
          )
          .map(
            (tier) => ({
              minQuantity:
                Number(
                  tier.minQuantity
                ),

              maxQuantity:
                tier.maxQuantity ===
                  '' ||
                tier.maxQuantity ===
                  null
                  ? null
                  : Number(
                      tier.maxQuantity
                    ),

              price:
                Number(
                  tier.price
                ),
            })
          );


      // ----------------------------------------------
      // SPECIFICATIONS
      // ----------------------------------------------

      const cleanedSpecifications =
        {};


      specifications.forEach(
        (item) => {

          const key =
            item.key.trim();

          const value =
            item.value.trim();


          if (
            key &&
            value
          ) {

            cleanedSpecifications[
              key
            ] = value;

          }

        }
      );


      // ----------------------------------------------
      // PAYLOAD
      // ----------------------------------------------

      return {

        name:
          form.name.trim(),

        description:
          form.description.trim(),

        category:
          form.category,

        brand:
          form.brand.trim(),

        sku:
          form.sku
            .trim()
            .toUpperCase(),

        price:
          Number(form.price),

        costPrice:
          Number(
            form.costPrice
          ),

        moq:
          Number(form.moq),

        stock:
          Number(form.stock),

        lowStockThreshold:
          Number(
            form.lowStockThreshold
          ),

        gst:
          Number(form.gst),

        wholesalePricing:
          cleanedWholesale,

        images:
          existingImages,

        specifications:
          cleanedSpecifications,

        weight: {
          value:
            form.weightValue ===
            ''
              ? 0
              : Number(
                  form.weightValue
                ),

          unit:
            form.weightUnit,
        },

        dimensions: {
          length:
            form.dimensionLength ===
            ''
              ? 0
              : Number(
                  form.dimensionLength
                ),

          width:
            form.dimensionWidth ===
            ''
              ? 0
              : Number(
                  form.dimensionWidth
                ),

          height:
            form.dimensionHeight ===
            ''
              ? 0
              : Number(
                  form.dimensionHeight
                ),

          unit:
            form.dimensionUnit,
        },

        location:
          form.location.trim(),

        deliveryTimeDays:
          Number(
            form.deliveryTimeDays
          ),

        isBestSeller:
          form.isBestSeller,

      };

    };


  // ====================================================
  // UPLOAD IMAGES
  // ====================================================

  const uploadImages =
    async (
      productId
    ) => {

      if (
        imageFiles.length ===
        0
      ) {
        return [];
      }


      setUploading(true);


      try {

        const uploadedUrls =
          [];


        for (
          const file of imageFiles
        ) {

          const formData =
            new FormData();


          formData.append(
            'image',
            file
          );


          formData.append(
            'productId',
            productId
          );


          const token =
            getToken();


          const headers = {};


          if (token) {
            headers.Authorization =
              `Bearer ${token}`;
          }


          const response =
            await fetch(
              `${API_URL}/api/upload`,
              {
                method: 'POST',
                headers,
                body: formData,
              }
            );


          let data = {};


          try {
            data =
              await response.json();
          } catch {
            data = {};
          }


          if (!response.ok) {

            throw new Error(
              data?.message ||
                data?.error ||
                'Image upload failed'
            );

          }


          const url =
            data?.url ||
            data?.data?.url ||
            data?.imageUrl ||
            data?.data?.imageUrl;


          if (url) {
            uploadedUrls.push(
              url
            );
          }

        }


        return uploadedUrls;

      } finally {

        setUploading(false);

      }

    };


  // ====================================================
  // SAVE PRODUCT
  // ====================================================

  const handleSubmit =
    async (event) => {

      event.preventDefault();


      setError('');
      setSuccess('');


      const validationError =
        validateForm();


      if (validationError) {

        setError(
          validationError
        );


        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });


        return;

      }


      try {

        setSaving(true);


        // --------------------------------------------
        // CREATE
        // --------------------------------------------

        if (!isEditMode) {

          const payload =
            buildPayload();


          // Product create
          // Images initially empty.
          payload.images =
            [];


          const data =
            await apiRequest(
              '/api/products',
              {
                method: 'POST',

                body:
                  JSON.stringify(
                    payload
                  ),
              }
            );


          const createdProduct =
            data?.data ||
            data?.product ||
            data;


          const productId =
            createdProduct?._id;


          // ------------------------------------------
          // UPLOAD IMAGES
          // ------------------------------------------

          if (
            productId &&
            imageFiles.length >
              0
          ) {

            const uploadedUrls =
              await uploadImages(
                productId
              );


            if (
              uploadedUrls.length >
              0
            ) {

              await apiRequest(
                `/api/products/${productId}`,
                {
                  method: 'PUT',

                  body:
                    JSON.stringify({
                      images:
                        uploadedUrls,
                    }),
                }
              );

            }

          }


          setSuccess(
            'Product created successfully.'
          );


          setTimeout(() => {

            navigate(
              '/admin/products'
            );

          }, 900);


          return;

        }


        // --------------------------------------------
        // UPDATE
        // --------------------------------------------

        const payload =
          buildPayload();


        const updatedData =
          await apiRequest(
            `/api/products/${id}`,
            {
              method: 'PUT',

              body:
                JSON.stringify(
                  payload
                ),
            }
          );


        // ------------------------------------------
        // UPLOAD NEW IMAGES
        // ------------------------------------------

        if (
          imageFiles.length >
          0
        ) {

          const uploadedUrls =
            await uploadImages(
              id
            );


          if (
            uploadedUrls.length >
            0
          ) {

            const finalImages =
              [
                ...existingImages,
                ...uploadedUrls,
              ];


            await apiRequest(
              `/api/products/${id}`,
              {
                method: 'PUT',

                body:
                  JSON.stringify({
                    images:
                      finalImages,
                  }),
              }
            );

          }

        }


        setSuccess(
          updatedData?.message ||
            'Product updated successfully.'
        );


        setTimeout(() => {

          navigate(
            '/admin/products'
          );

        }, 900);

      } catch (err) {

        console.error(
          'Save product error:',
          err
        );


        setError(
          err.message ||
            'Unable to save product.'
        );


        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });

      } finally {

        setSaving(false);

      }

    };


  // ====================================================
  // LOADING SCREEN
  // ====================================================

  if (loading) {

    return (
      <div
        className="
          min-h-screen
          bg-slate-50
          p-6
        "
      >

        <div
          className="
            mx-auto
            max-w-6xl
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-12
            text-center
          "
        >

          <div
            className="
              mx-auto
              h-10
              w-10
              animate-spin
              rounded-full
              border-4
              border-slate-200
              border-t-teal-600
            "
          />

          <p
            className="
              mt-4
              text-sm
              text-slate-500
            "
          >
            Loading product...
          </p>

        </div>

      </div>
    );

  }


  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div
      className="
        min-h-screen
        bg-slate-50
      "
    >

      {/* ==================================================
          HEADER
      =================================================== */}

      <header
        className="
          border-b
          border-slate-200
          bg-white
        "
      >

        <div
          className="
            mx-auto
            max-w-6xl
            px-4
            py-6
            sm:px-6
          "
        >

          <Link
            to="/admin/products"
            className="
              text-sm
              font-semibold
              text-teal-600
              hover:text-teal-700
            "
          >
            ← Back to Products
          </Link>


          <div
            className="
              mt-3
            "
          >

            <h1
              className="
                text-2xl
                font-extrabold
                text-slate-900
                sm:text-3xl
              "
            >
              {isEditMode
                ? 'Edit Product'
                : 'Add Product'}
            </h1>


            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              {isEditMode
                ? 'Update your product information and inventory.'
                : 'Add a new product to your wholesale catalog.'}
            </p>

          </div>

        </div>

      </header>


      {/* ==================================================
          MAIN
      =================================================== */}

      <main
        className="
          mx-auto
          max-w-6xl
          px-4
          py-6
          sm:px-6
        "
      >

        {/* ==================================================
            ERROR
        =================================================== */}

        {error && (
          <div
            className="
              mb-5
              rounded-xl
              border
              border-red-200
              bg-red-50
              px-4
              py-3
              text-sm
              font-medium
              text-red-700
            "
          >
            {error}
          </div>
        )}


        {/* ==================================================
            SUCCESS
        =================================================== */}

        {success && (
          <div
            className="
              mb-5
              rounded-xl
              border
              border-emerald-200
              bg-emerald-50
              px-4
              py-3
              text-sm
              font-semibold
              text-emerald-700
            "
          >
            {success}
          </div>
        )}


        <form
          onSubmit={
            handleSubmit
          }
          className="
            space-y-6
          "
        >

          {/* ==================================================
              BASIC INFORMATION
          =================================================== */}

          <section
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-5
              shadow-sm
              sm:p-6
            "
          >

            <SectionHeader
              title="Basic Information"
              description="Product name, description and catalog identity."
            />


            <div
              className="
                grid
                gap-5
                sm:grid-cols-2
              "
            >

              <InputField
                label="Product Name"
                name="name"
                value={form.name}
                onChange={
                  handleChange
                }
                required
                placeholder="Enter product name"
              />


              <InputField
                label="SKU"
                name="sku"
                value={form.sku}
                onChange={
                  handleChange
                }
                required
                placeholder="Example: CB-001"
              />


              <div>

                <label
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                  "
                >
                  Category
                  <span className="text-red-500">
                    {' '}*
                  </span>
                </label>


                <select
                  name="category"
                  value={
                    form.category
                  }
                  onChange={
                    handleChange
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-4
                    py-3
                    text-sm
                    outline-none
                    focus:border-teal-500
                    focus:ring-4
                    focus:ring-teal-50
                  "
                >

                  <option value="">
                    Select Category
                  </option>


                  {CATEGORY_OPTIONS.map(
                    (category) => (
                      <option
                        key={category}
                        value={
                          category
                        }
                      >
                        {category}
                      </option>
                    )
                  )}

                </select>

              </div>


              <InputField
                label="Brand"
                name="brand"
                value={form.brand}
                onChange={
                  handleChange
                }
                placeholder="Brand name"
              />


              <div
                className="
                  sm:col-span-2
                "
              >

                <label
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                  "
                >
                  Description
                  <span className="text-red-500">
                    {' '}*
                  </span>
                </label>


                <textarea
                  name="description"
                  value={
                    form.description
                  }
                  onChange={
                    handleChange
                  }
                  rows={6}
                  placeholder="Enter complete product description"
                  className="
                    w-full
                    resize-y
                    rounded-xl
                    border
                    border-slate-200
                    px-4
                    py-3
                    text-sm
                    outline-none
                    focus:border-teal-500
                    focus:ring-4
                    focus:ring-teal-50
                  "
                />

              </div>

            </div>

          </section>


          {/* ==================================================
              PRICING & INVENTORY
          =================================================== */}

          <section
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-5
              shadow-sm
              sm:p-6
            "
          >

            <SectionHeader
              title="Pricing & Inventory"
              description="Manage selling price, business cost, MOQ and available stock."
            />


            <div
              className="
                grid
                gap-5
                sm:grid-cols-2
                lg:grid-cols-3
              "
            >

              <NumberField
                label="Selling Price"
                name="price"
                value={form.price}
                onChange={
                  handleChange
                }
                required
                min="0"
                step="0.01"
                prefix="₹"
              />


              <NumberField
                label="Cost Price"
                name="costPrice"
                value={
                  form.costPrice
                }
                onChange={
                  handleChange
                }
                required
                min="0"
                step="0.01"
                prefix="₹"
              />


              <NumberField
                label="MOQ"
                name="moq"
                value={form.moq}
                onChange={
                  handleChange
                }
                required
                min="1"
                step="1"
              />


              <NumberField
                label="Stock Quantity"
                name="stock"
                value={form.stock}
                onChange={
                  handleChange
                }
                required
                min="0"
                step="1"
              />


              <NumberField
                label="Low Stock Threshold"
                name="lowStockThreshold"
                value={
                  form.lowStockThreshold
                }
                onChange={
                  handleChange
                }
                min="0"
                step="1"
              />


              <NumberField
                label="GST"
                name="gst"
                value={form.gst}
                onChange={
                  handleChange
                }
                min="0"
                max="100"
                step="0.01"
                suffix="%"
              />

            </div>

          </section>


          {/* ==================================================
              WHOLESALE PRICING
          =================================================== */}

          <section
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-5
              shadow-sm
              sm:p-6
            "
          >

            <div
              className="
                mb-5
                flex
                flex-col
                gap-3
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >

              <SectionHeader
                title="Wholesale Pricing"
                description="Set quantity-based wholesale prices."
                noMargin
              />


              <button
                type="button"
                onClick={
                  addWholesaleTier
                }
                className="
                  rounded-xl
                  bg-teal-600
                  px-4
                  py-2.5
                  text-sm
                  font-bold
                  text-white
                  hover:bg-teal-700
                "
              >
                + Add Price Tier
              </button>

            </div>


            {wholesalePricing.length ===
              0 ? (

              <div
                className="
                  rounded-xl
                  border
                  border-dashed
                  border-slate-300
                  bg-slate-50
                  p-6
                  text-center
                "
              >

                <p
                  className="
                    text-sm
                    font-semibold
                    text-slate-600
                  "
                >
                  No wholesale pricing tiers added.
                </p>


                <p
                  className="
                    mt-1
                    text-xs
                    text-slate-400
                  "
                >
                  Add a tier when you want different prices for bulk quantities.
                </p>

              </div>

            ) : (

              <div
                className="
                  space-y-4
                "
              >

                {wholesalePricing.map(
                  (
                    tier,
                    index
                  ) => (

                    <div
                      key={index}
                      className="
                        rounded-xl
                        border
                        border-slate-200
                        bg-slate-50
                        p-4
                      "
                    >

                      <div
                        className="
                          mb-3
                          flex
                          items-center
                          justify-between
                        "
                      >

                        <p
                          className="
                            text-sm
                            font-bold
                            text-slate-800
                          "
                        >
                          Price Tier {index + 1}
                        </p>


                        <button
                          type="button"
                          onClick={() =>
                            removeWholesaleTier(
                              index
                            )
                          }
                          className="
                            text-xs
                            font-bold
                            text-red-600
                            hover:text-red-700
                          "
                        >
                          Remove
                        </button>

                      </div>


                      <div
                        className="
                          grid
                          gap-4
                          sm:grid-cols-3
                        "
                      >

                        <NumberField
                          label="Minimum Quantity"
                          value={
                            tier.minQuantity
                          }
                          onChange={(
                            event
                          ) =>
                            updateWholesaleTier(
                              index,
                              'minQuantity',
                              event
                                .target
                                .value
                            )
                          }
                          min="1"
                          step="1"
                        />


                        <NumberField
                          label="Maximum Quantity"
                          value={
                            tier.maxQuantity
                          }
                          onChange={(
                            event
                          ) =>
                            updateWholesaleTier(
                              index,
                              'maxQuantity',
                              event
                                .target
                                .value
                            )
                          }
                          min="1"
                          step="1"
                          placeholder="Leave empty for unlimited"
                        />


                        <NumberField
                          label="Wholesale Price"
                          value={
                            tier.price
                          }
                          onChange={(
                            event
                          ) =>
                            updateWholesaleTier(
                              index,
                              'price',
                              event
                                .target
                                .value
                            )
                          }
                          min="0"
                          step="0.01"
                          prefix="₹"
                        />

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </section>


          {/* ==================================================
              PRODUCT DETAILS
          =================================================== */}

          <section
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-5
              shadow-sm
              sm:p-6
            "
          >

            <SectionHeader
              title="Product Details"
              description="Weight, dimensions, delivery and location."
            />


            <div
              className="
                grid
                gap-5
                sm:grid-cols-2
                lg:grid-cols-3
              "
            >

              <NumberField
                label="Weight"
                name="weightValue"
                value={
                  form.weightValue
                }
                onChange={
                  handleChange
                }
                min="0"
                step="0.01"
              />


              <div>

                <label
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                  "
                >
                  Weight Unit
                </label>


                <select
                  name="weightUnit"
                  value={
                    form.weightUnit
                  }
                  onChange={
                    handleChange
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-4
                    py-3
                    text-sm
                    outline-none
                    focus:border-teal-500
                    focus:ring-4
                    focus:ring-teal-50
                  "
                >

                  <option value="kg">
                    Kilogram (kg)
                  </option>

                  <option value="g">
                    Gram (g)
                  </option>

                </select>

              </div>


              <InputField
                label="Location"
                name="location"
                value={
                  form.location
                }
                onChange={
                  handleChange
                }
                placeholder="Warehouse / Location"
              />


              <NumberField
                label="Delivery Time"
                name="deliveryTimeDays"
                value={
                  form.deliveryTimeDays
                }
                onChange={
                  handleChange
                }
                min="0"
                step="1"
                suffix="days"
              />

            </div>


            {/* DIMENSIONS */}

            <div
              className="
                mt-6
                border-t
                border-slate-100
                pt-6
              "
            >

              <h3
                className="
                  mb-4
                  text-sm
                  font-bold
                  text-slate-800
                "
              >
                Dimensions
              </h3>


              <div
                className="
                  grid
                  gap-4
                  sm:grid-cols-2
                  lg:grid-cols-4
                "
              >

                <NumberField
                  label="Length"
                  name="dimensionLength"
                  value={
                    form.dimensionLength
                  }
                  onChange={
                    handleChange
                  }
                  min="0"
                  step="0.01"
                />


                <NumberField
                  label="Width"
                  name="dimensionWidth"
                  value={
                    form.dimensionWidth
                  }
                  onChange={
                    handleChange
                  }
                  min="0"
                  step="0.01"
                />


                <NumberField
                  label="Height"
                  name="dimensionHeight"
                  value={
                    form.dimensionHeight
                  }
                  onChange={
                    handleChange
                  }
                  min="0"
                  step="0.01"
                />


                <div>

                  <label
                    className="
                      mb-2
                      block
                      text-sm
                      font-semibold
                      text-slate-700
                    "
                  >
                    Dimension Unit
                  </label>


                  <select
                    name="dimensionUnit"
                    value={
                      form.dimensionUnit
                    }
                    onChange={
                      handleChange
                    }
                    className="
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      bg-white
                      px-4
                      py-3
                      text-sm
                      outline-none
                      focus:border-teal-500
                      focus:ring-4
                      focus:ring-teal-50
                    "
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

            </div>

          </section>


          {/* ==================================================
              SPECIFICATIONS
          =================================================== */}

          <section
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-5
              shadow-sm
              sm:p-6
            "
          >

            <div
              className="
                mb-5
                flex
                flex-col
                gap-3
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >

              <SectionHeader
                title="Specifications"
                description="Add product-specific key-value specifications."
                noMargin
              />


              <button
                type="button"
                onClick={
                  addSpecification
                }
                className="
                  rounded-xl
                  bg-teal-600
                  px-4
                  py-2.5
                  text-sm
                  font-bold
                  text-white
                  hover:bg-teal-700
                "
              >
                + Add Specification
              </button>

            </div>


            {specifications.length ===
              0 ? (

              <div
                className="
                  rounded-xl
                  border
                  border-dashed
                  border-slate-300
                  bg-slate-50
                  p-6
                  text-center
                "
              >

                <p
                  className="
                    text-sm
                    font-semibold
                    text-slate-600
                  "
                >
                  No specifications added.
                </p>

              </div>

            ) : (

              <div
                className="
                  space-y-3
                "
              >

                {specifications.map(
                  (
                    specification,
                    index
                  ) => (

                    <div
                      key={index}
                      className="
                        flex
                        flex-col
                        gap-3
                        rounded-xl
                        border
                        border-slate-200
                        bg-slate-50
                        p-4
                        sm:flex-row
                      "
                    >

                      <input
                        type="text"
                        value={
                          specification.key
                        }
                        onChange={(
                          event
                        ) =>
                          updateSpecification(
                            index,
                            'key',
                            event
                              .target
                              .value
                          )
                        }
                        placeholder="Specification name"
                        className="
                          flex-1
                          rounded-xl
                          border
                          border-slate-200
                          bg-white
                          px-4
                          py-3
                          text-sm
                          outline-none
                          focus:border-teal-500
                        "
                      />


                      <input
                        type="text"
                        value={
                          specification.value
                        }
                        onChange={(
                          event
                        ) =>
                          updateSpecification(
                            index,
                            'value',
                            event
                              .target
                              .value
                          )
                        }
                        placeholder="Specification value"
                        className="
                          flex-1
                          rounded-xl
                          border
                          border-slate-200
                          bg-white
                          px-4
                          py-3
                          text-sm
                          outline-none
                          focus:border-teal-500
                        "
                      />


                      <button
                        type="button"
                        onClick={() =>
                          removeSpecification(
                            index
                          )
                        }
                        className="
                          rounded-xl
                          border
                          border-red-200
                          bg-red-50
                          px-4
                          py-3
                          text-sm
                          font-bold
                          text-red-600
                          hover:bg-red-100
                        "
                      >
                        Remove
                      </button>

                    </div>

                  )
                )}

              </div>

            )}

          </section>


          {/* ==================================================
              IMAGES
          =================================================== */}

          <section
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-5
              shadow-sm
              sm:p-6
            "
          >

            <SectionHeader
              title="Product Images"
              description="Upload product images for your catalog."
            />


            {/* EXISTING */}

            {existingImages.length >
              0 && (

              <div
                className="
                  mb-6
                "
              >

                <p
                  className="
                    mb-3
                    text-sm
                    font-bold
                    text-slate-700
                  "
                >
                  Current Images
                </p>


                <div
                  className="
                    grid
                    grid-cols-2
                    gap-4
                    sm:grid-cols-4
                  "
                >

                  {existingImages.map(
                    (
                      image,
                      index
                    ) => (

                      <div
                        key={`${image}-${index}`}
                        className="
                          relative
                          aspect-square
                          overflow-hidden
                          rounded-xl
                          border
                          border-slate-200
                          bg-slate-100
                        "
                      >

                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="
                            h-full
                            w-full
                            object-cover
                          "
                        />


                        <button
                          type="button"
                          onClick={() =>
                            removeExistingImage(
                              index
                            )
                          }
                          className="
                            absolute
                            right-2
                            top-2
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-full
                            bg-red-600
                            text-lg
                            font-bold
                            text-white
                            shadow
                          "
                        >
                          ×
                        </button>

                      </div>

                    )
                  )}

                </div>

              </div>

            )}


            {/* NEW IMAGES */}

            {imagePreviews.length >
              0 && (

              <div
                className="
                  mb-6
                "
              >

                <p
                  className="
                    mb-3
                    text-sm
                    font-bold
                    text-slate-700
                  "
                >
                  New Images
                </p>


                <div
                  className="
                    grid
                    grid-cols-2
                    gap-4
                    sm:grid-cols-4
                  "
                >

                  {imagePreviews.map(
                    (
                      preview,
                      index
                    ) => (

                      <div
                        key={preview}
                        className="
                          relative
                          aspect-square
                          overflow-hidden
                          rounded-xl
                          border
                          border-slate-200
                          bg-slate-100
                        "
                      >

                        <img
                          src={preview}
                          alt={`New product ${index + 1}`}
                          className="
                            h-full
                            w-full
                            object-cover
                          "
                        />


                        <button
                          type="button"
                          onClick={() =>
                            removeNewImage(
                              index
                            )
                          }
                          className="
                            absolute
                            right-2
                            top-2
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-full
                            bg-red-600
                            text-lg
                            font-bold
                            text-white
                            shadow
                          "
                        >
                          ×
                        </button>

                      </div>

                    )
                  )}

                </div>

              </div>

            )}


            <label
              className="
                flex
                cursor-pointer
                flex-col
                items-center
                justify-center
                rounded-2xl
                border-2
                border-dashed
                border-slate-300
                bg-slate-50
                px-6
                py-10
                text-center
                transition
                hover:border-teal-400
                hover:bg-teal-50
              "
            >

              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-full
                  bg-white
                  text-xl
                  shadow-sm
                "
              >
                📷
              </div>


              <p
                className="
                  mt-3
                  text-sm
                  font-bold
                  text-slate-800
                "
              >
                Click to upload product images
              </p>


              <p
                className="
                  mt-1
                  text-xs
                  text-slate-500
                "
              >
                JPG, JPEG, PNG or WEBP
              </p>


              <input
                type="file"
                accept="
                  image/jpeg,
                  image/jpg,
                  image/png,
                  image/webp
                "
                multiple
                onChange={
                  handleImageChange
                }
                className="hidden"
              />

            </label>

          </section>


          {/* ==================================================
              STATUS
          =================================================== */}

          <section
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-5
              shadow-sm
              sm:p-6
            "
          >

            <SectionHeader
              title="Product Status"
              description="Control product merchandising options."
            />


            <label
              className="
                flex
                cursor-pointer
                items-start
                gap-3
                rounded-xl
                border
                border-slate-200
                p-4
              "
            >

              <input
                type="checkbox"
                name="isBestSeller"
                checked={
                  form.isBestSeller
                }
                onChange={
                  handleChange
                }
                className="
                  mt-1
                  h-4
                  w-4
                  accent-teal-600
                "
              />


              <span>

                <span
                  className="
                    block
                    text-sm
                    font-bold
                    text-slate-800
                  "
                >
                  Best Seller
                </span>


                <span
                  className="
                    mt-1
                    block
                    text-xs
                    leading-5
                    text-slate-500
                  "
                >
                  Mark this product as a best-selling product.
                </span>

              </span>

            </label>

          </section>


          {/* ==================================================
              ACTIONS
          =================================================== */}

          <div
            className="
              flex
              flex-col-reverse
              gap-3
              sm:flex-row
              sm:justify-end
            "
          >

            <Link
              to="/admin/products"
              className="
                inline-flex
                items-center
                justify-center
                rounded-xl
                border
                border-slate-200
                bg-white
                px-6
                py-3
                text-sm
                font-bold
                text-slate-700
                hover:bg-slate-50
              "
            >
              Cancel
            </Link>


            <button
              type="submit"
              disabled={
                saving ||
                uploading
              }
              className="
                inline-flex
                min-w-[180px]
                items-center
                justify-center
                rounded-xl
                bg-teal-600
                px-7
                py-3
                text-sm
                font-bold
                text-white
                shadow-sm
                hover:bg-teal-700
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >

              {saving ? (
                <>
                  <span
                    className="
                      mr-2
                      h-4
                      w-4
                      animate-spin
                      rounded-full
                      border-2
                      border-white/40
                      border-t-white
                    "
                  />

                  {uploading
                    ? 'Uploading...'
                    : 'Saving...'}
                </>
              ) : (
                isEditMode
                  ? 'Update Product'
                  : 'Create Product'
              )}

            </button>

          </div>

        </form>

      </main>

    </div>
  );
};


// ======================================================
// SECTION HEADER
// ======================================================

const SectionHeader = ({
  title,
  description,
  noMargin = false,
}) => {

  return (
    <div
      className={
        noMargin
          ? ''
          : 'mb-6'
      }
    >

      <h2
        className="
          text-lg
          font-bold
          text-slate-900
        "
      >
        {title}
      </h2>


      <p
        className="
          mt-1
          text-sm
          text-slate-500
        "
      >
        {description}
      </p>

    </div>
  );

};


// ======================================================
// INPUT FIELD
// ======================================================

const InputField = ({
  label,
  name,
  value,
  onChange,
  required = false,
  placeholder = '',
}) => {

  return (
    <div>

      <label
        className="
          mb-2
          block
          text-sm
          font-semibold
          text-slate-700
        "
      >

        {label}

        {required && (
          <span className="text-red-500">
            {' '}*
          </span>
        )}

      </label>


      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
          w-full
          rounded-xl
          border
          border-slate-200
          px-4
          py-3
          text-sm
          outline-none
          transition
          focus:border-teal-500
          focus:ring-4
          focus:ring-teal-50
        "
      />

    </div>
  );

};


// ======================================================
// NUMBER FIELD
// ======================================================

const NumberField = ({
  label,
  name,
  value,
  onChange,
  required = false,
  min,
  max,
  step,
  prefix,
  suffix,
  placeholder,
}) => {

  return (
    <div>

      <label
        className="
          mb-2
          block
          text-sm
          font-semibold
          text-slate-700
        "
      >

        {label}

        {required && (
          <span className="text-red-500">
            {' '}*
          </span>
        )}

      </label>


      <div
        className="
          relative
        "
      >

        {prefix && (
          <span
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-sm
              font-bold
              text-slate-400
            "
          >
            {prefix}
          </span>
        )}


        <input
          type="number"
          name={name}
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          className={`
            w-full
            rounded-xl
            border
            border-slate-200
            py-3
            text-sm
            outline-none
            transition
            focus:border-teal-500
            focus:ring-4
            focus:ring-teal-50
            ${prefix ? 'pl-9' : 'pl-4'}
            ${suffix ? 'pr-14' : 'pr-4'}
          `}
        />


        {suffix && (
          <span
            className="
              absolute
              right-4
              top-1/2
              -translate-y-1/2
              text-xs
              font-semibold
              text-slate-400
            "
          >
            {suffix}
          </span>
        )}

      </div>

    </div>
  );

};


export default AdminProductForm;