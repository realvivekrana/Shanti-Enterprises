import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Link,
} from 'react-router-dom';


// ======================================================
// API URL
// ======================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000';


// ======================================================
// ADMIN PRODUCTS
// ======================================================

const AdminProducts = () => {

  // ====================================================
  // STATE
  // ====================================================

  const [
    products,
    setProducts,
  ] = useState([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState('');


  const [
    search,
    setSearch,
  ] = useState('');


  const [
    categoryFilter,
    setCategoryFilter,
  ] = useState('');


  const [
    stockFilter,
    setStockFilter,
  ] = useState('all');


  const [
    deleteLoading,
    setDeleteLoading,
  ] = useState('');


  // ====================================================
  // GET TOKEN
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

      const parsedUser =
        JSON.parse(
          userInfo
        );


      return (
        parsedUser.token ||
        parsedUser.accessToken ||
        ''
      );

    } catch {

      return '';

    }

  };


  // ====================================================
  // EXTRACT PRODUCTS
  // ====================================================

  const extractProducts = (
    responseData
  ) => {

    if (
      Array.isArray(
        responseData
      )
    ) {

      return responseData;

    }


    if (
      Array.isArray(
        responseData?.data
      )
    ) {

      return responseData.data;

    }


    if (
      Array.isArray(
        responseData?.products
      )
    ) {

      return responseData.products;

    }


    if (
      Array.isArray(
        responseData?.data?.products
      )
    ) {

      return responseData.data.products;

    }


    return [];

  };


  // ====================================================
  // FETCH PRODUCTS
  // ====================================================

  const fetchProducts =
    async () => {

      try {

        setLoading(true);

        setError('');


        const response =
          await fetch(
            `${API_URL}/api/products`
          );


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data?.message ||
              data?.error ||
              'Failed to load products'
          );

        }


        const productData =
          extractProducts(
            data
          );


        setProducts(
          productData
        );

      } catch (err) {

        console.error(
          'Admin products fetch error:',
          err
        );


        setError(
          err.message ||
            'Unable to load products'
        );

      } finally {

        setLoading(false);

      }

    };


  // ====================================================
  // INITIAL LOAD
  // ====================================================

  useEffect(() => {

    fetchProducts();

  }, []);


  // ====================================================
  // NORMALIZE PRODUCTS
  // ====================================================

  const normalizedProducts =
    useMemo(() => {

      return products.map(
        (product) => {

          const id =
            product._id ||
            product.id;


          const price =
            Number(
              product.price ??
                product.sellingPrice ??
                product.salePrice ??
                0
            );


          const costPrice =
            Number(
              product.costPrice ??
                0
            );


          const stock =
            Number(
              product.stock ??
                product.countInStock ??
                product.inventory ??
                product.quantity ??
                0
            );


          const moq =
            Number(
              product.moq ??
                product.minimumOrderQuantity ??
                product.minOrderQuantity ??
                1
            );


          const lowStockThreshold =
            Number(
              product.lowStockThreshold ??
                10
            );


          const category =
            typeof product.category ===
            'object'
              ? product.category?.name
              : product.category;


          const brand =
            typeof product.brand ===
            'object'
              ? product.brand?.name
              : product.brand;


          const image =
            Array.isArray(
              product.images
            )
              ? product.images[0]
              : product.image ||
                '';


          const profit =
            price -
            costPrice;


          return {

            ...product,

            displayId:
              id,

            displayPrice:
              price,

            displayCostPrice:
              costPrice,

            displayProfit:
              profit,

            displayStock:
              stock,

            displayMOQ:
              moq,

            displayLowStockThreshold:
              lowStockThreshold,

            displayCategory:
              category ||
              'Uncategorized',

            displayBrand:
              brand ||
              '—',

            displayImage:
              image,

          };

        }
      );

    }, [
      products,
    ]);


  // ====================================================
  // CATEGORY OPTIONS
  // ====================================================

  const categories =
    useMemo(() => {

      return [
        ...new Set(
          normalizedProducts
            .map(
              (product) =>
                product.displayCategory
            )
            .filter(Boolean)
        ),
      ].sort();

    }, [
      normalizedProducts,
    ]);


  // ====================================================
  // STOCK STATUS
  // ====================================================

  const getStockStatus = (
    product
  ) => {

    const stock =
      Number(
        product.displayStock
      );


    const threshold =
      Number(
        product.displayLowStockThreshold
      );


    if (
      stock <= 0
    ) {

      return {

        label:
          'Out of Stock',

        className:
          'bg-red-50 text-red-700 border-red-200',

      };

    }


    if (
      stock <= threshold
    ) {

      return {

        label:
          'Low Stock',

        className:
          'bg-amber-50 text-amber-700 border-amber-200',

      };

    }


    return {

      label:
        'In Stock',

      className:
        'bg-emerald-50 text-emerald-700 border-emerald-200',

    };

  };


  // ====================================================
  // FILTER PRODUCTS
  // ====================================================

  const filteredProducts =
    useMemo(() => {

      let result = [
        ...normalizedProducts,
      ];


      // ----------------------------------------------
      // SEARCH
      // ----------------------------------------------

      if (
        search.trim()
      ) {

        const searchValue =
          search
            .trim()
            .toLowerCase();


        result =
          result.filter(
            (product) => {

              const name =
                String(
                  product.name ||
                    ''
                ).toLowerCase();


              const sku =
                String(
                  product.sku ||
                    ''
                ).toLowerCase();


              const category =
                String(
                  product.displayCategory ||
                    ''
                ).toLowerCase();


              const brand =
                String(
                  product.displayBrand ||
                    ''
                ).toLowerCase();


              return (

                name.includes(
                  searchValue
                ) ||

                sku.includes(
                  searchValue
                ) ||

                category.includes(
                  searchValue
                ) ||

                brand.includes(
                  searchValue
                )

              );

            }
          );

      }


      // ----------------------------------------------
      // CATEGORY
      // ----------------------------------------------

      if (
        categoryFilter
      ) {

        result =
          result.filter(
            (product) =>
              product.displayCategory ===
              categoryFilter
          );

      }


      // ----------------------------------------------
      // STOCK
      // ----------------------------------------------

      if (
        stockFilter ===
        'in-stock'
      ) {

        result =
          result.filter(
            (product) =>
              product.displayStock >
              product.displayLowStockThreshold
          );

      }


      if (
        stockFilter ===
        'low-stock'
      ) {

        result =
          result.filter(
            (product) =>
              product.displayStock >
                0 &&
              product.displayStock <=
                product.displayLowStockThreshold
          );

      }


      if (
        stockFilter ===
        'out-of-stock'
      ) {

        result =
          result.filter(
            (product) =>
              product.displayStock <=
              0
          );

      }


      return result;

    }, [
      normalizedProducts,
      search,
      categoryFilter,
      stockFilter,
    ]);


  // ====================================================
  // STATS
  // ====================================================

  const totalProducts =
    normalizedProducts.length;


  const inStockProducts =
    normalizedProducts.filter(
      (product) =>
        product.displayStock >
        product.displayLowStockThreshold
    ).length;


  const lowStockProducts =
    normalizedProducts.filter(
      (product) =>
        product.displayStock >
          0 &&
        product.displayStock <=
          product.displayLowStockThreshold
    ).length;


  const outOfStockProducts =
    normalizedProducts.filter(
      (product) =>
        product.displayStock <=
        0
    ).length;


  // ====================================================
  // DELETE PRODUCT
  // ====================================================

  const handleDelete =
    async (
      product
    ) => {

      const productId =
        product.displayId;


      if (!productId) {

        alert(
          'Product ID not found.'
        );

        return;

      }


      const confirmed =
        window.confirm(
          `Are you sure you want to delete "${product.name}"?`
        );


      if (!confirmed) {
        return;
      }


      try {

        setDeleteLoading(
          String(productId)
        );


        setError('');


        const token =
          getToken();


        const headers = {};


        if (token) {

          headers.Authorization =
            `Bearer ${token}`;

        }


        const response =
          await fetch(
            `${API_URL}/api/products/${productId}`,
            {
              method:
                'DELETE',

              headers,
            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data?.message ||
              data?.error ||
              'Failed to delete product'
          );

        }


        setProducts(
          (
            previousProducts
          ) =>
            previousProducts.filter(
              (item) =>
                String(
                  item._id ||
                    item.id
                ) !==
                String(
                  productId
                )
            )
        );


        alert(
          data?.message ||
            'Product deleted successfully'
        );

      } catch (err) {

        console.error(
          'Delete product error:',
          err
        );


        setError(
          err.message ||
            'Failed to delete product'
        );

      } finally {

        setDeleteLoading('');

      }

    };


  // ====================================================
  // CLEAR FILTERS
  // ====================================================

  const handleClearFilters =
    () => {

      setSearch('');

      setCategoryFilter('');

      setStockFilter(
        'all'
      );

    };


  // ====================================================
  // FORMAT PRICE
  // ====================================================

  const formatPrice =
    (value) => {

      return Number(
        value || 0
      ).toLocaleString(
        'en-IN',
        {
          minimumFractionDigits:
            2,

          maximumFractionDigits:
            2,
        }
      );

    };


  // ====================================================
  // LOADING
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
            max-w-7xl
          "
        >

          <div
            className="
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
              Loading products...
            </p>

          </div>

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
            max-w-7xl
            px-4
            py-6
            sm:px-6
          "
        >

          <div
            className="
              flex
              flex-col
              gap-5
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >

            <div>

              <p
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.15em]
                  text-teal-600
                "
              >
                Admin Panel
              </p>


              <h1
                className="
                  mt-1
                  text-3xl
                  font-extrabold
                  text-slate-900
                "
              >
                Products
              </h1>


              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                "
              >
                Manage your wholesale product catalog.
              </p>

            </div>


            <Link
              to="/admin/products/new"
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-teal-600
                px-5
                py-3
                text-sm
                font-bold
                text-white
                transition
                hover:bg-teal-700
              "
            >

              <span
                className="
                  text-lg
                  leading-none
                "
              >
                +
              </span>

              Add Product

            </Link>

          </div>

        </div>

      </header>


      {/* ==================================================
          MAIN
      =================================================== */}

      <main
        className="
          mx-auto
          max-w-7xl
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
              mb-6
              rounded-xl
              border
              border-red-200
              bg-red-50
              px-4
              py-3
              text-sm
              text-red-700
            "
          >

            <div
              className="
                flex
                flex-col
                gap-3
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >

              <span>
                {error}
              </span>


              <button
                type="button"
                onClick={
                  fetchProducts
                }
                className="
                  rounded-lg
                  bg-red-600
                  px-4
                  py-2
                  text-xs
                  font-bold
                  text-white
                  hover:bg-red-700
                "
              >
                Retry
              </button>

            </div>

          </div>

        )}


        {/* ==================================================
            STATS
        =================================================== */}

        <div
          className="
            mb-6
            grid
            grid-cols-2
            gap-4
            lg:grid-cols-4
          "
        >

          <StatCard
            label="Total Products"
            value={
              totalProducts
            }
            valueClass="text-slate-900"
          />


          <StatCard
            label="In Stock"
            value={
              inStockProducts
            }
            valueClass="text-emerald-600"
          />


          <StatCard
            label="Low Stock"
            value={
              lowStockProducts
            }
            valueClass="text-amber-600"
          />


          <StatCard
            label="Out of Stock"
            value={
              outOfStockProducts
            }
            valueClass="text-red-600"
          />

        </div>


        {/* ==================================================
            FILTERS
        =================================================== */}

        <section
          className="
            mb-6
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-4
          "
        >

          <div
            className="
              grid
              grid-cols-1
              gap-3
              md:grid-cols-2
              lg:grid-cols-4
            "
          >

            {/* SEARCH */}

            <div
              className="
                lg:col-span-2
              "
            >

              <label
                className="
                  mb-1.5
                  block
                  text-xs
                  font-bold
                  text-slate-600
                "
              >
                Search
              </label>


              <div
                className="
                  relative
                "
              >

                <span
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                >
                  🔍
                </span>


                <input
                  type="text"
                  value={
                    search
                  }
                  onChange={(
                    event
                  ) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search by name, SKU, brand..."
                  className="
                    h-11
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    pl-10
                    pr-4
                    text-sm
                    outline-none
                    focus:border-teal-500
                    focus:ring-4
                    focus:ring-teal-50
                  "
                />

              </div>

            </div>


            {/* CATEGORY */}

            <div>

              <label
                className="
                  mb-1.5
                  block
                  text-xs
                  font-bold
                  text-slate-600
                "
              >
                Category
              </label>


              <select
                value={
                  categoryFilter
                }
                onChange={(
                  event
                ) =>
                  setCategoryFilter(
                    event.target.value
                  )
                }
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  px-3
                  text-sm
                  outline-none
                  focus:border-teal-500
                "
              >

                <option value="">
                  All Categories
                </option>


                {categories.map(
                  (category) => (

                    <option
                      key={
                        category
                      }
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


            {/* STOCK */}

            <div>

              <label
                className="
                  mb-1.5
                  block
                  text-xs
                  font-bold
                  text-slate-600
                "
              >
                Stock
              </label>


              <select
                value={
                  stockFilter
                }
                onChange={(
                  event
                ) =>
                  setStockFilter(
                    event.target.value
                  )
                }
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  px-3
                  text-sm
                  outline-none
                  focus:border-teal-500
                "
              >

                <option value="all">
                  All Stock
                </option>


                <option value="in-stock">
                  In Stock
                </option>


                <option value="low-stock">
                  Low Stock
                </option>


                <option value="out-of-stock">
                  Out of Stock
                </option>

              </select>

            </div>

          </div>


          {/* FILTER FOOTER */}

          <div
            className="
              mt-4
              flex
              flex-col
              gap-3
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            <p
              className="
                text-sm
                text-slate-500
              "
            >

              Showing{' '}

              <span
                className="
                  font-bold
                  text-slate-800
                "
              >
                {
                  filteredProducts.length
                }
              </span>

              {' '}of{' '}

              <span
                className="
                  font-bold
                  text-slate-800
                "
              >
                {
                  normalizedProducts.length
                }
              </span>

              {' '}products

            </p>


            <button
              type="button"
              onClick={
                handleClearFilters
              }
              className="
                text-left
                text-sm
                font-semibold
                text-teal-600
                hover:text-teal-700
                sm:text-right
              "
            >
              Clear Filters
            </button>

          </div>

        </section>


        {/* ==================================================
            EMPTY STATE
        =================================================== */}

        {filteredProducts.length ===
          0 && (

          <div
            className="
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
                text-5xl
              "
            >
              📦
            </div>


            <h2
              className="
                mt-4
                text-xl
                font-bold
                text-slate-900
              "
            >
              No products found
            </h2>


            <p
              className="
                mt-2
                text-sm
                text-slate-500
              "
            >
              Try changing your search or filters.
            </p>


            <button
              type="button"
              onClick={
                handleClearFilters
              }
              className="
                mt-5
                rounded-xl
                bg-teal-600
                px-5
                py-2.5
                text-sm
                font-bold
                text-white
                hover:bg-teal-700
              "
            >
              Clear Filters
            </button>

          </div>

        )}


        {/* ==================================================
            DESKTOP TABLE
        =================================================== */}

        {filteredProducts.length >
          0 && (

          <div
            className="
              hidden
              overflow-hidden
              rounded-2xl
              border
              border-slate-200
              bg-white
              lg:block
            "
          >

            <div
              className="
                overflow-x-auto
              "
            >

              <table
                className="
                  w-full
                "
              >

                <thead>

                  <tr
                    className="
                      border-b
                      border-slate-200
                      bg-slate-50
                    "
                  >

                    <TableHeader>
                      Product
                    </TableHeader>


                    <TableHeader>
                      Category
                    </TableHeader>


                    <TableHeader>
                      Price
                    </TableHeader>


                    <TableHeader>
                      MOQ
                    </TableHeader>


                    <TableHeader>
                      Stock
                    </TableHeader>


                    <TableHeader
                      align="right"
                    >
                      Actions
                    </TableHeader>

                  </tr>

                </thead>


                <tbody
                  className="
                    divide-y
                    divide-slate-100
                  "
                >

                  {filteredProducts.map(
                    (product) => {

                      const stockStatus =
                        getStockStatus(
                          product
                        );


                      return (

                        <tr
                          key={
                            product.displayId
                          }
                          className="
                            transition
                            hover:bg-slate-50
                          "
                        >

                          {/* PRODUCT */}

                          <td
                            className="
                              px-5
                              py-4
                            "
                          >

                            <div
                              className="
                                flex
                                min-w-[280px]
                                items-center
                                gap-3
                              "
                            >

                              <ProductImage
                                src={
                                  product.displayImage
                                }
                                name={
                                  product.name
                                }
                                size="large"
                              />


                              <div
                                className="
                                  min-w-0
                                "
                              >

                                <p
                                  className="
                                    max-w-[260px]
                                    truncate
                                    font-bold
                                    text-slate-900
                                  "
                                >
                                  {
                                    product.name
                                  }
                                </p>


                                <p
                                  className="
                                    mt-1
                                    text-xs
                                    text-slate-500
                                  "
                                >
                                  SKU:{' '}
                                  {
                                    product.sku ||
                                    '—'
                                  }
                                </p>


                                {product.displayBrand !==
                                  '—' && (

                                  <p
                                    className="
                                      mt-0.5
                                      text-xs
                                      text-slate-400
                                    "
                                  >
                                    {
                                      product.displayBrand
                                    }
                                  </p>

                                )}

                              </div>

                            </div>

                          </td>


                          {/* CATEGORY */}

                          <td
                            className="
                              px-5
                              py-4
                            "
                          >

                            <span
                              className="
                                inline-flex
                                rounded-full
                                border
                                border-teal-100
                                bg-teal-50
                                px-3
                                py-1
                                text-xs
                                font-semibold
                                text-teal-700
                              "
                            >
                              {
                                product.displayCategory
                              }
                            </span>

                          </td>


                          {/* PRICE */}

                          <td
                            className="
                              px-5
                              py-4
                            "
                          >

                            <p
                              className="
                                font-bold
                                text-slate-900
                              "
                            >
                              ₹
                              {formatPrice(
                                product.displayPrice
                              )}
                            </p>

                          </td>


                          {/* MOQ */}

                          <td
                            className="
                              px-5
                              py-4
                            "
                          >

                            <p
                              className="
                                font-semibold
                                text-slate-700
                              "
                            >
                              {
                                product.displayMOQ
                              }
                            </p>


                            <p
                              className="
                                text-xs
                                text-slate-400
                              "
                            >
                              pieces
                            </p>

                          </td>


                          {/* STOCK */}

                          <td
                            className="
                              px-5
                              py-4
                            "
                          >

                            <p
                              className="
                                font-bold
                                text-slate-800
                              "
                            >
                              {
                                product.displayStock
                              }
                            </p>


                            <span
                              className={`
                                mt-1
                                inline-flex
                                rounded-full
                                border
                                px-2.5
                                py-1
                                text-[11px]
                                font-bold
                                ${stockStatus.className}
                              `}
                            >
                              {
                                stockStatus.label
                              }
                            </span>


                            {stockStatus.label ===
                              'Low Stock' && (

                              <p
                                className="
                                  mt-1
                                  text-[10px]
                                  text-slate-400
                                "
                              >
                                Threshold:{' '}
                                {
                                  product.displayLowStockThreshold
                                }
                              </p>

                            )}

                          </td>


                          {/* ACTIONS */}

                          <td
                            className="
                              px-5
                              py-4
                            "
                          >

                            <div
                              className="
                                flex
                                items-center
                                justify-end
                                gap-2
                              "
                            >

                              <Link
                                to={`/products/${product.displayId}`}
                                className="
                                  rounded-lg
                                  border
                                  border-slate-200
                                  bg-white
                                  px-3
                                  py-2
                                  text-xs
                                  font-bold
                                  text-slate-700
                                  transition
                                  hover:border-teal-300
                                  hover:text-teal-700
                                "
                              >
                                View
                              </Link>


                              <Link
                                to={`/admin/products/${product.displayId}/edit`}
                                className="
                                  rounded-lg
                                  border
                                  border-teal-100
                                  bg-teal-50
                                  px-3
                                  py-2
                                  text-xs
                                  font-bold
                                  text-teal-700
                                  transition
                                  hover:bg-teal-100
                                "
                              >
                                Edit
                              </Link>


                              <button
                                type="button"
                                disabled={
                                  deleteLoading ===
                                  String(
                                    product.displayId
                                  )
                                }
                                onClick={() =>
                                  handleDelete(
                                    product
                                  )
                                }
                                className="
                                  rounded-lg
                                  border
                                  border-red-100
                                  bg-red-50
                                  px-3
                                  py-2
                                  text-xs
                                  font-bold
                                  text-red-700
                                  transition
                                  hover:bg-red-100
                                  disabled:cursor-not-allowed
                                  disabled:opacity-50
                                "
                              >

                                {deleteLoading ===
                                String(
                                  product.displayId
                                )
                                  ? 'Deleting...'
                                  : 'Delete'}

                              </button>

                            </div>

                          </td>

                        </tr>

                      );

                    }
                  )}

                </tbody>

              </table>

            </div>

          </div>

        )}


        {/* ==================================================
            MOBILE CARDS
        =================================================== */}

        {filteredProducts.length >
          0 && (

          <div
            className="
              space-y-4
              lg:hidden
            "
          >

            {filteredProducts.map(
              (product) => {

                const stockStatus =
                  getStockStatus(
                    product
                  );


                return (

                  <div
                    key={
                      product.displayId
                    }
                    className="
                      rounded-2xl
                      border
                      border-slate-200
                      bg-white
                      p-4
                    "
                  >

                    {/* TOP */}

                    <div
                      className="
                        flex
                        items-start
                        gap-3
                      "
                    >

                      <ProductImage
                        src={
                          product.displayImage
                        }
                        name={
                          product.name
                        }
                        size="small"
                      />


                      <div
                        className="
                          min-w-0
                          flex-1
                        "
                      >

                        <p
                          className="
                            font-bold
                            leading-snug
                            text-slate-900
                          "
                        >
                          {
                            product.name
                          }
                        </p>


                        <p
                          className="
                            mt-1
                            text-xs
                            text-slate-500
                          "
                        >
                          SKU:{' '}
                          {
                            product.sku ||
                            '—'
                          }
                        </p>


                        <p
                          className="
                            mt-1
                            text-xs
                            text-slate-400
                          "
                        >
                          {
                            product.displayBrand
                          }
                        </p>

                      </div>

                    </div>


                    {/* CATEGORY */}

                    <div
                      className="
                        mt-4
                      "
                    >

                      <span
                        className="
                          inline-flex
                          rounded-full
                          border
                          border-teal-100
                          bg-teal-50
                          px-3
                          py-1
                          text-xs
                          font-semibold
                          text-teal-700
                        "
                      >
                        {
                          product.displayCategory
                        }
                      </span>

                    </div>


                    {/* DETAILS */}

                    <div
                      className="
                        mt-4
                        grid
                        grid-cols-3
                        gap-3
                      "
                    >

                      <MiniInfo
                        label="Price"
                        value={
                          `₹${formatPrice(
                            product.displayPrice
                          )}`
                        }
                      />


                      <MiniInfo
                        label="MOQ"
                        value={
                          product.displayMOQ
                        }
                      />


                      <MiniInfo
                        label="Stock"
                        value={
                          product.displayStock
                        }
                      />

                    </div>


                    {/* STATUS */}

                    <div
                      className="
                        mt-3
                      "
                    >

                      <span
                        className={`
                          inline-flex
                          rounded-full
                          border
                          px-3
                          py-1
                          text-xs
                          font-bold
                          ${stockStatus.className}
                        `}
                      >
                        {
                          stockStatus.label
                        }
                      </span>


                      {stockStatus.label ===
                        'Low Stock' && (

                        <span
                          className="
                            ml-2
                            text-[10px]
                            text-slate-400
                          "
                        >
                          Threshold:{' '}
                          {
                            product.displayLowStockThreshold
                          }
                        </span>

                      )}

                    </div>


                    {/* ACTIONS */}

                    <div
                      className="
                        mt-4
                        grid
                        grid-cols-3
                        gap-2
                      "
                    >

                      <Link
                        to={`/products/${product.displayId}`}
                        className="
                          flex
                          items-center
                          justify-center
                          rounded-xl
                          border
                          border-slate-200
                          bg-white
                          px-3
                          py-2.5
                          text-xs
                          font-bold
                          text-slate-700
                        "
                      >
                        View
                      </Link>


                      <Link
                        to={`/admin/products/${product.displayId}/edit`}
                        className="
                          flex
                          items-center
                          justify-center
                          rounded-xl
                          border
                          border-teal-100
                          bg-teal-50
                          px-3
                          py-2.5
                          text-xs
                          font-bold
                          text-teal-700
                        "
                      >
                        Edit
                      </Link>


                      <button
                        type="button"
                        disabled={
                          deleteLoading ===
                          String(
                            product.displayId
                          )
                        }
                        onClick={() =>
                          handleDelete(
                            product
                          )
                        }
                        className="
                          rounded-xl
                          border
                          border-red-100
                          bg-red-50
                          px-3
                          py-2.5
                          text-xs
                          font-bold
                          text-red-700
                          disabled:opacity-50
                        "
                      >

                        {deleteLoading ===
                        String(
                          product.displayId
                        )
                          ? '...'
                          : 'Delete'}

                      </button>

                    </div>

                  </div>

                );

              }
            )}

          </div>

        )}

      </main>

    </div>

  );

};


// ======================================================
// STAT CARD
// ======================================================

const StatCard = ({
  label,
  value,
  valueClass,
}) => {

  return (

    <div
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-5
      "
    >

      <p
        className="
          text-xs
          font-semibold
          uppercase
          tracking-wide
          text-slate-500
        "
      >
        {label}
      </p>


      <p
        className={`
          mt-2
          text-2xl
          font-extrabold
          ${valueClass}
        `}
      >
        {value}
      </p>

    </div>

  );

};


// ======================================================
// TABLE HEADER
// ======================================================

const TableHeader = ({
  children,
  align = 'left',
}) => {

  return (

    <th
      className={`
        px-5
        py-4
        text-xs
        font-bold
        uppercase
        tracking-wide
        text-slate-500
        ${
          align === 'right'
            ? 'text-right'
            : 'text-left'
        }
      `}
    >
      {children}
    </th>

  );

};


// ======================================================
// PRODUCT IMAGE
// ======================================================

const ProductImage = ({
  src,
  name,
  size = 'large',
}) => {

  const sizeClass =
    size === 'small'
      ? 'h-20 w-20'
      : 'h-14 w-14';


  if (!src) {

    return (

      <div
        className={`
          ${sizeClass}
          flex
          flex-shrink-0
          items-center
          justify-center
          overflow-hidden
          rounded-xl
          border
          border-slate-200
          bg-slate-100
          text-2xl
        `}
      >
        📦
      </div>

    );

  }


  return (

    <div
      className={`
        ${sizeClass}
        flex-shrink-0
        overflow-hidden
        rounded-xl
        border
        border-slate-200
        bg-slate-100
      `}
    >

      <img
        src={src}
        alt={
          name ||
          'Product'
        }
        className="
          h-full
          w-full
          object-cover
        "
        onError={(
          event
        ) => {

          event.currentTarget.style.display =
            'none';

        }}
      />

    </div>

  );

};


// ======================================================
// MINI INFO
// ======================================================

const MiniInfo = ({
  label,
  value,
}) => {

  return (

    <div
      className="
        rounded-xl
        bg-slate-50
        p-3
      "
    >

      <p
        className="
          text-[11px]
          font-semibold
          uppercase
          tracking-wide
          text-slate-400
        "
      >
        {label}
      </p>


      <p
        className="
          mt-1
          truncate
          font-bold
          text-slate-900
        "
      >
        {value}
      </p>

    </div>

  );

};


export default AdminProducts;