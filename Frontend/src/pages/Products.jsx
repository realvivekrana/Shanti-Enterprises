import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Link,
  useSearchParams,
} from 'react-router-dom';

import {
  useCart,
} from '../context/CartContext';


// ======================================================
// API
// ======================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000';


// ======================================================
// PRODUCTS PAGE
// ======================================================

const Products = () => {

  const {
    addToCart,
  } = useCart();


  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();


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
  ] = useState(
    searchParams.get('search') || ''
  );


  const [
    category,
    setCategory,
  ] = useState(
    searchParams.get('category') || ''
  );


  const [
    brand,
    setBrand,
  ] = useState('');


  const [
    minPrice,
    setMinPrice,
  ] = useState('');


  const [
    maxPrice,
    setMaxPrice,
  ] = useState('');


  const [
    moq,
    setMoq,
  ] = useState('');


  const [
    stock,
    setStock,
  ] = useState('');


  const [
    sort,
    setSort,
  ] = useState('default'
  );


  const [
    mobileFiltersOpen,
    setMobileFiltersOpen,
  ] = useState(false);


  // ====================================================
  // FETCH PRODUCTS
  // ====================================================

  useEffect(() => {

    const fetchProducts =
      async () => {

        try {

          setLoading(true);

          setError('');


          const response =
            await fetch(
              `${API_URL}/api/products`
            );


          if (!response.ok) {

            throw new Error(
              'Failed to fetch products'
            );

          }


          const data =
            await response.json();


          /*
           * Backend response ko flexible rakha
           * gaya hai taaki existing API ke saath
           * kaam kar sake.
           */

          const productData =
            Array.isArray(data)
              ? data
              : Array.isArray(data.data)
                ? data.data
                : Array.isArray(
                    data.products
                  )
                  ? data.products
                  : Array.isArray(
                      data.data?.products
                    )
                    ? data.data.products
                    : [];


          setProducts(
            productData
          );

        } catch (err) {

          console.error(
            'Products fetch error:',
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


    fetchProducts();

  }, []);


  // ====================================================
  // URL SEARCH PARAMS
  // ====================================================

  useEffect(() => {

    const urlSearch =
      searchParams.get(
        'search'
      ) || '';


    const urlCategory =
      searchParams.get(
        'category'
      ) || '';


    setSearch(
      urlSearch
    );


    setCategory(
      urlCategory
    );

  }, [
    searchParams,
  ]);


  // ====================================================
  // NORMALIZE PRODUCT DATA
  // ====================================================

  const normalizedProducts =
    useMemo(() => {

      return products.map(
        (product) => {

          const price =
            Number(
              product.price ??
              product.sellingPrice ??
              product.salePrice ??
              0
            );


          const minimumOrderQuantity =
            Number(
              product.moq ??
              product.minimumOrderQuantity ??
              product.minOrderQuantity ??
              1
            );


          const stockQuantity =
            Number(
              product.stock ??
              product.countInStock ??
              product.inventory ??
              product.quantity ??
              0
            );


          const productCategory =
            typeof product.category ===
            'object'
              ? product.category?.name
              : product.category;


          const productBrand =
            typeof product.brand ===
            'object'
              ? product.brand?.name
              : product.brand;


          return {

            ...product,

            displayPrice:
              price,

            displayMOQ:
              minimumOrderQuantity,

            displayStock:
              stockQuantity,

            displayCategory:
              productCategory || '',

            displayBrand:
              productBrand || '',

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

      const values =
        normalizedProducts
          .map(
            (product) =>
              product.displayCategory
          )
          .filter(Boolean);


      return [
        ...new Set(
          values
        ),
      ].sort();

    }, [
      normalizedProducts,
    ]);


  // ====================================================
  // BRAND OPTIONS
  // ====================================================

  const brands =
    useMemo(() => {

      const values =
        normalizedProducts
          .map(
            (product) =>
              product.displayBrand
          )
          .filter(Boolean);


      return [
        ...new Set(
          values
        ),
      ].sort();

    }, [
      normalizedProducts,
    ]);


  // ====================================================
  // FILTER PRODUCTS
  // ====================================================

  const filteredProducts =
    useMemo(() => {

      let result = [
        ...normalizedProducts,
      ];


      // ==================================================
      // SEARCH
      // ==================================================

      if (search.trim()) {

        const searchValue =
          search
            .trim()
            .toLowerCase();


        result =
          result.filter(
            (product) => {

              const name =
                String(
                  product.name || ''
                ).toLowerCase();


              const description =
                String(
                  product.description || ''
                ).toLowerCase();


              const productBrand =
                String(
                  product.displayBrand ||
                  ''
                ).toLowerCase();


              return (

                name.includes(
                  searchValue
                ) ||

                description.includes(
                  searchValue
                ) ||

                productBrand.includes(
                  searchValue
                )

              );

            }
          );

      }


      // ==================================================
      // CATEGORY
      // ==================================================

      if (category) {

        result =
          result.filter(
            (product) =>

              String(
                product.displayCategory
              ).toLowerCase() ===
              String(
                category
              ).toLowerCase()

          );

      }


      // ==================================================
      // BRAND
      // ==================================================

      if (brand) {

        result =
          result.filter(
            (product) =>

              String(
                product.displayBrand
              ).toLowerCase() ===
              String(
                brand
              ).toLowerCase()

          );

      }


      // ==================================================
      // MIN PRICE
      // ==================================================

      if (minPrice !== '') {

        result =
          result.filter(
            (product) =>
              product.displayPrice >=
              Number(
                minPrice
              )
          );

      }


      // ==================================================
      // MAX PRICE
      // ==================================================

      if (maxPrice !== '') {

        result =
          result.filter(
            (product) =>
              product.displayPrice <=
              Number(
                maxPrice
              )
          );

      }


      // ==================================================
      // MOQ
      // ==================================================

      if (moq) {

        const selectedMOQ =
          Number(
            moq
          );


        result =
          result.filter(
            (product) => {

              if (
                selectedMOQ ===
                500
              ) {

                return (
                  product.displayMOQ >=
                  500
                );

              }


              if (
                selectedMOQ ===
                100
              ) {

                return (
                  product.displayMOQ >=
                  100 &&
                  product.displayMOQ <
                  500
                );

              }


              return (
                product.displayMOQ <
                100
              );

            }
          );

      }


      // ==================================================
      // STOCK
      // ==================================================

      if (stock === 'in-stock') {

        result =
          result.filter(
            (product) =>
              product.displayStock >
              0
          );

      }


      if (stock === 'out-of-stock') {

        result =
          result.filter(
            (product) =>
              product.displayStock <=
              0
          );

      }


      // ==================================================
      // SORT
      // ==================================================

      if (
        sort ===
        'price-low'
      ) {

        result.sort(
          (a, b) =>
            a.displayPrice -
            b.displayPrice
        );

      }


      if (
        sort ===
        'price-high'
      ) {

        result.sort(
          (a, b) =>
            b.displayPrice -
            a.displayPrice
        );

      }


      if (
        sort ===
        'name'
      ) {

        result.sort(
          (a, b) =>
            String(
              a.name || ''
            ).localeCompare(
              String(
                b.name || ''
              )
            )
        );

      }


      if (
        sort ===
        'moq-low'
      ) {

        result.sort(
          (a, b) =>
            a.displayMOQ -
            b.displayMOQ
        );

      }


      return result;

    }, [
      normalizedProducts,
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      moq,
      stock,
      sort,
    ]);


  // ====================================================
  // UPDATE SEARCH URL
  // ====================================================

  const handleSearch =
    (event) => {

      event.preventDefault();


      const params = {};


      if (search.trim()) {

        params.search =
          search.trim();

      }


      if (category) {

        params.category =
          category;

      }


      setSearchParams(
        params
      );

    };


  // ====================================================
  // CLEAR FILTERS
  // ====================================================

  const clearFilters =
    () => {

      setSearch('');

      setCategory('');

      setBrand('');

      setMinPrice('');

      setMaxPrice('');

      setMoq('');

      setStock('');

      setSort('default');

      setSearchParams({});

    };


  // ====================================================
  // ADD TO CART
  // ====================================================

  const handleAddToCart =
    (product) => {

      try {

        addToCart(
          product,
          1
        );

      } catch (err) {

        console.error(
          'Add to cart error:',
          err
        );

      }

    };


  return (

    <div
      className="
        min-h-screen
        bg-slate-50
      "
    >

      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <section
        className="
          bg-white
          border-b
          border-slate-200
        "
      >

        <div
          className="
            max-w-7xl
            mx-auto
            px-4
            py-8
            sm:py-10
          "
        >

          <p
            className="
              text-sm
              font-semibold
              text-teal-600
              uppercase
              tracking-wider
            "
          >

            Wholesale Store

          </p>


          <h1
            className="
              mt-1
              text-3xl
              sm:text-4xl
              font-extrabold
              text-slate-900
            "
          >

            Products

          </h1>


          <p
            className="
              mt-2
              text-sm
              text-slate-500
            "
          >

            Browse packaging products
            and find the right option
            for your business.

          </p>

        </div>

      </section>


      {/* ==================================================
          SEARCH BAR
      ================================================== */}

      <section
        className="
          max-w-7xl
          mx-auto
          px-4
          pt-6
        "
      >

        <form
          onSubmit={
            handleSearch
          }
          className="
            relative
          "
        >

          <span
            className="
              absolute
              left-4
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
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search products..."
            className="
              w-full
              h-12
              pl-11
              pr-4
              rounded-xl
              border
              border-slate-200
              bg-white
              outline-none
              text-sm
              focus:border-teal-500
              focus:ring-4
              focus:ring-teal-50
            "
          />

        </form>

      </section>


      {/* ==================================================
          MOBILE FILTER / SORT
      ================================================== */}

      <section
        className="
          lg:hidden
          max-w-7xl
          mx-auto
          px-4
          pt-4
        "
      >

        <div
          className="
            grid
            grid-cols-2
            gap-3
          "
        >

          <button
            type="button"
            onClick={() =>
              setMobileFiltersOpen(
                true
              )
            }
            className="
              h-11
              rounded-xl
              bg-white
              border
              border-slate-200
              text-sm
              font-semibold
              text-slate-700
              hover:border-teal-500
            "
          >

            ⚙️ Filter

          </button>


          <select
            value={
              sort
            }
            onChange={(event) =>
              setSort(
                event.target.value
              )
            }
            className="
              h-11
              rounded-xl
              bg-white
              border
              border-slate-200
              px-3
              text-sm
              font-semibold
              text-slate-700
              outline-none
            "
          >

            <option value="default">
              Sort
            </option>

            <option value="price-low">
              Price: Low to High
            </option>

            <option value="price-high">
              Price: High to Low
            </option>

            <option value="name">
              Name
            </option>

            <option value="moq-low">
              MOQ: Low to High
            </option>

          </select>

        </div>

      </section>


      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <main
        className="
          max-w-7xl
          mx-auto
          px-4
          py-6
        "
      >

        <div
          className="
            flex
            items-start
            gap-6
          "
        >

          {/* ==================================================
              DESKTOP FILTER SIDEBAR
          ================================================== */}

          <aside
            className="
              hidden
              lg:block
              w-64
              shrink-0
              bg-white
              border
              border-slate-200
              rounded-2xl
              p-5
              sticky
              top-24
            "
          >

            <FilterContent
              categories={
                categories
              }
              brands={
                brands
              }
              category={
                category
              }
              setCategory={
                setCategory
              }
              brand={
                brand
              }
              setBrand={
                setBrand
              }
              minPrice={
                minPrice
              }
              setMinPrice={
                setMinPrice
              }
              maxPrice={
                maxPrice
              }
              setMaxPrice={
                setMaxPrice
              }
              moq={
                moq
              }
              setMoq={
                setMoq
              }
              stock={
                stock
              }
              setStock={
                setStock
              }
              clearFilters={
                clearFilters
              }
            />

          </aside>


          {/* ==================================================
              PRODUCT AREA
          ================================================== */}

          <section
            className="
              flex-1
              min-w-0
            "
          >

            {/* ==================================================
                TOP BAR
            ================================================== */}

            <div
              className="
                hidden
                lg:flex
                items-center
                justify-between
                mb-5
              "
            >

              <div>

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

                  </span>{' '}

                  products

                </p>

              </div>


              <select
                value={
                  sort
                }
                onChange={(event) =>
                  setSort(
                    event.target.value
                  )
                }
                className="
                  h-10
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  px-3
                  text-sm
                  text-slate-600
                  outline-none
                  focus:border-teal-500
                "
              >

                <option value="default">
                  Sort by
                </option>

                <option value="price-low">
                  Price: Low to High
                </option>

                <option value="price-high">
                  Price: High to Low
                </option>

                <option value="name">
                  Name
                </option>

                <option value="moq-low">
                  MOQ: Low to High
                </option>

              </select>

            </div>


            {/* ==================================================
                MOBILE RESULT COUNT
            ================================================== */}

            <div
              className="
                lg:hidden
                mb-4
              "
            >

              <p
                className="
                  text-sm
                  text-slate-500
                "
              >

                <span
                  className="
                    font-bold
                    text-slate-800
                  "
                >

                  {
                    filteredProducts.length
                  }

                </span>{' '}

                products found

              </p>

            </div>


            {/* ==================================================
                LOADING
            ================================================== */}

            {loading && (

              <div
                className="
                  bg-white
                  border
                  border-slate-200
                  rounded-2xl
                  p-10
                  text-center
                "
              >

                <div
                  className="
                    w-8
                    h-8
                    mx-auto
                    border-4
                    border-teal-100
                    border-t-teal-600
                    rounded-full
                    animate-spin
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

            )}


            {/* ==================================================
                ERROR
            ================================================== */}

            {!loading &&
              error && (

                <div
                  className="
                    bg-white
                    border
                    border-red-200
                    rounded-2xl
                    p-8
                    text-center
                  "
                >

                  <div
                    className="
                      text-3xl
                    "
                  >

                    ⚠️

                  </div>


                  <h2
                    className="
                      mt-3
                      font-bold
                      text-slate-800
                    "
                  >

                    Unable to load products

                  </h2>


                  <p
                    className="
                      mt-2
                      text-sm
                      text-slate-500
                    "
                  >

                    {error}

                  </p>

                </div>

              )}


            {/* ==================================================
                EMPTY
            ================================================== */}

            {!loading &&
              !error &&
              filteredProducts.length === 0 && (

                <div
                  className="
                    bg-white
                    border
                    border-slate-200
                    rounded-2xl
                    p-10
                    text-center
                  "
                >

                  <div
                    className="
                      text-4xl
                    "
                  >

                    🔎

                  </div>


                  <h2
                    className="
                      mt-4
                      text-xl
                      font-bold
                      text-slate-800
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

                    Try changing your search
                    or filters.

                  </p>


                  <button
                    type="button"
                    onClick={
                      clearFilters
                    }
                    className="
                      mt-5
                      px-5
                      py-2.5
                      rounded-lg
                      bg-teal-600
                      text-white
                      text-sm
                      font-semibold
                      hover:bg-teal-700
                    "
                  >

                    Clear Filters

                  </button>

                </div>

              )}


            {/* ==================================================
                PRODUCT GRID
            ================================================== */}

            {!loading &&
              !error &&
              filteredProducts.length > 0 && (

                <div
                  className="
                    grid
                    grid-cols-2
                    sm:grid-cols-2
                    xl:grid-cols-3
                    gap-3
                    sm:gap-5
                  "
                >

                  {filteredProducts.map(
                    (product) => (

                      <ProductCard
                        key={
                          product._id ||
                          product.id
                        }
                        product={
                          product
                        }
                        onAddToCart={
                          handleAddToCart
                        }
                      />

                    )
                  )}

                </div>

              )}

          </section>

        </div>

      </main>


      {/* ==================================================
          MOBILE FILTER DRAWER
      ================================================== */}

      {mobileFiltersOpen && (

        <>

          {/* BACKDROP */}

          <div
            className="
              fixed
              inset-0
              bg-black/40
              z-[60]
              lg:hidden
            "
            onClick={() =>
              setMobileFiltersOpen(
                false
              )
            }
          />


          {/* DRAWER */}

          <div
            className="
              fixed
              left-0
              right-0
              bottom-0
              z-[70]
              bg-white
              rounded-t-3xl
              max-h-[85vh]
              overflow-y-auto
              lg:hidden
            "
          >

            <div
              className="
                sticky
                top-0
                bg-white
                border-b
                border-slate-200
                px-5
                py-4
                flex
                items-center
                justify-between
              "
            >

              <h2
                className="
                  text-lg
                  font-bold
                  text-slate-800
                "
              >

                Filters

              </h2>


              <button
                type="button"
                onClick={() =>
                  setMobileFiltersOpen(
                    false
                  )
                }
                className="
                  w-9
                  h-9
                  rounded-lg
                  hover:bg-slate-100
                  text-xl
                "
              >

                ×

              </button>

            </div>


            <div
              className="
                p-5
              "
            >

              <FilterContent
                categories={
                  categories
                }
                brands={
                  brands
                }
                category={
                  category
                }
                setCategory={
                  setCategory
                }
                brand={
                  brand
                }
                setBrand={
                  setBrand
                }
                minPrice={
                  minPrice
                }
                setMinPrice={
                  setMinPrice
                }
                maxPrice={
                  maxPrice
                }
                setMaxPrice={
                  setMaxPrice
                }
                moq={
                  moq
                }
                setMoq={
                  setMoq
                }
                stock={
                  stock
                }
                setStock={
                  setStock
                }
                clearFilters={
                  clearFilters
                }
              />


              <button
                type="button"
                onClick={() =>
                  setMobileFiltersOpen(
                    false
                  )
                }
                className="
                  w-full
                  mt-5
                  h-11
                  rounded-xl
                  bg-teal-600
                  text-white
                  text-sm
                  font-bold
                  hover:bg-teal-700
                "
              >

                Apply Filters

              </button>

            </div>

          </div>

        </>

      )}

    </div>

  );

};


// ======================================================
// FILTER CONTENT
// ======================================================

const FilterContent = ({
  categories,
  brands,
  category,
  setCategory,
  brand,
  setBrand,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  moq,
  setMoq,
  stock,
  setStock,
  clearFilters,
}) => {

  return (

    <div>

      {/* ==================================================
          FILTER HEADER
      ================================================== */}

      <div
        className="
          flex
          items-center
          justify-between
          mb-5
        "
      >

        <h2
          className="
            text-lg
            font-bold
            text-slate-800
          "
        >

          Filters

        </h2>


        <button
          type="button"
          onClick={
            clearFilters
          }
          className="
            text-xs
            font-semibold
            text-teal-700
            hover:text-teal-800
          "
        >

          Clear All

        </button>

      </div>


      {/* ==================================================
          CATEGORY
      ================================================== */}

      <FilterSection
        title="Category"
      >

        <select
          value={
            category
          }
          onChange={(event) =>
            setCategory(
              event.target.value
            )
          }
          className="
            w-full
            h-10
            px-3
            rounded-lg
            border
            border-slate-200
            bg-white
            text-sm
            outline-none
            focus:border-teal-500
          "
        >

          <option value="">
            All Categories
          </option>

          {categories.map(
            (item) => (

              <option
                key={
                  item
                }
                value={
                  item
                }
              >

                {item}

              </option>

            )
          )}

        </select>

      </FilterSection>


      {/* ==================================================
          PRICE
      ================================================== */}

      <FilterSection
        title="Price"
      >

        <div
          className="
            grid
            grid-cols-2
            gap-2
          "
        >

          <input
            type="number"
            min="0"
            value={
              minPrice
            }
            onChange={(event) =>
              setMinPrice(
                event.target.value
              )
            }
            placeholder="Min ₹"
            className="
              w-full
              h-10
              px-3
              rounded-lg
              border
              border-slate-200
              text-sm
              outline-none
              focus:border-teal-500
            "
          />


          <input
            type="number"
            min="0"
            value={
              maxPrice
            }
            onChange={(event) =>
              setMaxPrice(
                event.target.value
              )
            }
            placeholder="Max ₹"
            className="
              w-full
              h-10
              px-3
              rounded-lg
              border
              border-slate-200
              text-sm
              outline-none
              focus:border-teal-500
            "
          />

        </div>

      </FilterSection>


      {/* ==================================================
          MOQ
      ================================================== */}

      <FilterSection
        title="MOQ"
      >

        <div
          className="
            space-y-2
          "
        >

          <label
            className="
              flex
              items-center
              gap-2
              text-sm
              text-slate-600
              cursor-pointer
            "
          >

            <input
              type="radio"
              name="moq"
              value=""
              checked={
                moq === ''
              }
              onChange={() =>
                setMoq('')
              }
              className="
                accent-teal-600
              "
            />

            Any MOQ

          </label>


          <label
            className="
              flex
              items-center
              gap-2
              text-sm
              text-slate-600
              cursor-pointer
            "
          >

            <input
              type="radio"
              name="moq"
              value="100"
              checked={
                moq === '100'
              }
              onChange={(event) =>
                setMoq(
                  event.target.value
                )
              }
              className="
                accent-teal-600
              "
            />

            Below 500

          </label>


          <label
            className="
              flex
              items-center
              gap-2
              text-sm
              text-slate-600
              cursor-pointer
            "
          >

            <input
              type="radio"
              name="moq"
              value="500"
              checked={
                moq === '500'
              }
              onChange={(event) =>
                setMoq(
                  event.target.value
                )
              }
              className="
                accent-teal-600
              "
            />

            500+

          </label>

        </div>

      </FilterSection>


      {/* ==================================================
          BRAND
      ================================================== */}

      <FilterSection
        title="Brand"
      >

        {brands.length === 0 ? (

          <p
            className="
              text-xs
              text-slate-400
            "
          >

            No brands available

          </p>

        ) : (

          <div
            className="
              space-y-2
              max-h-32
              overflow-y-auto
            "
          >

            {brands.map(
              (item) => (

                <label
                  key={
                    item
                  }
                  className="
                    flex
                    items-center
                    gap-2
                    text-sm
                    text-slate-600
                    cursor-pointer
                  "
                >

                  <input
                    type="radio"
                    name="brand"
                    value={
                      item
                    }
                    checked={
                      brand ===
                      item
                    }
                    onChange={(event) =>
                      setBrand(
                        event.target.value
                      )
                    }
                    className="
                      accent-teal-600
                    "
                  />

                  {item}

                </label>

              )
            )}

          </div>

        )}

      </FilterSection>


      {/* ==================================================
          STOCK
      ================================================== */}

      <FilterSection
        title="Stock"
      >

        <div
          className="
            space-y-2
          "
        >

          <label
            className="
              flex
              items-center
              gap-2
              text-sm
              text-slate-600
              cursor-pointer
            "
          >

            <input
              type="radio"
              name="stock"
              value=""
              checked={
                stock === ''
              }
              onChange={() =>
                setStock('')
              }
              className="
                accent-teal-600
              "
            />

            All

          </label>


          <label
            className="
              flex
              items-center
              gap-2
              text-sm
              text-slate-600
              cursor-pointer
            "
          >

            <input
              type="radio"
              name="stock"
              value="in-stock"
              checked={
                stock ===
                'in-stock'
              }
              onChange={(event) =>
                setStock(
                  event.target.value
                )
              }
              className="
                accent-teal-600
              "
            />

            In Stock

          </label>


          <label
            className="
              flex
              items-center
              gap-2
              text-sm
              text-slate-600
              cursor-pointer
            "
          >

            <input
              type="radio"
              name="stock"
              value="out-of-stock"
              checked={
                stock ===
                'out-of-stock'
              }
              onChange={(event) =>
                setStock(
                  event.target.value
                )
              }
              className="
                accent-teal-600
              "
            />

            Out of Stock

          </label>

        </div>

      </FilterSection>

    </div>

  );

};


// ======================================================
// FILTER SECTION
// ======================================================

const FilterSection = ({
  title,
  children,
}) => {

  return (

    <div
      className="
        border-t
        border-slate-100
        pt-5
        mt-5
      "
    >

      <h3
        className="
          text-sm
          font-bold
          text-slate-700
          mb-3
        "
      >

        {title}

      </h3>


      {children}

    </div>

  );

};


// ======================================================
// PRODUCT CARD
// ======================================================

const ProductCard = ({
  product,
  onAddToCart,
}) => {

  const productId =
    product._id ||
    product.id;


  const image =
    product.image ||
    product.images?.[0] ||
    product.thumbnail ||
    '';


  const isOutOfStock =
    product.displayStock <=
    0;


  return (

    <article
      className="
        bg-white
        border
        border-slate-200
        rounded-2xl
        overflow-hidden
        group
        hover:border-teal-300
        hover:shadow-lg
        transition-all
        duration-300
      "
    >

      {/* ==================================================
          IMAGE
      ================================================== */}

      <Link
        to={`/product/${productId}`}
        className="
          block
          aspect-square
          bg-slate-100
          overflow-hidden
        "
      >

        {image ? (

          <img
            src={image}
            alt={
              product.name ||
              'Product'
            }
            className="
              w-full
              h-full
              object-cover
              group-hover:scale-105
              transition-transform
              duration-500
            "
          />

        ) : (

          <div
            className="
              w-full
              h-full
              flex
              items-center
              justify-center
              text-4xl
              text-slate-300
            "
          >

            📦

          </div>

        )}

      </Link>


      {/* ==================================================
          CONTENT
      ================================================== */}

      <div
        className="
          p-3
          sm:p-4
        "
      >

        {/* Brand */}

        {product.displayBrand && (

          <p
            className="
              text-[10px]
              sm:text-xs
              font-semibold
              uppercase
              tracking-wide
              text-teal-600
            "
          >

            {product.displayBrand}

          </p>

        )}


        {/* Name */}

        <Link
          to={`/product/${productId}`}
          className="
            block
            mt-1
            font-bold
            text-sm
            sm:text-base
            text-slate-800
            line-clamp-2
            hover:text-teal-700
          "
        >

          {product.name ||
            'Unnamed Product'}

        </Link>


        {/* Price */}

        <div
          className="
            mt-3
            flex
            items-baseline
            gap-1
          "
        >

          <span
            className="
              text-lg
              sm:text-xl
              font-extrabold
              text-slate-900
            "
          >

            ₹
            {
              product.displayPrice.toLocaleString(
                'en-IN'
              )
            }

          </span>


          {product.mrp &&
            Number(
              product.mrp
            ) >
            product.displayPrice && (

              <span
                className="
                  text-xs
                  text-slate-400
                  line-through
                "
              >

                ₹
                {Number(
                  product.mrp
                ).toLocaleString(
                  'en-IN'
                )}

              </span>

            )}

        </div>


        {/* MOQ */}

        <div
          className="
            mt-2
            flex
            items-center
            justify-between
            gap-2
          "
        >

          <span
            className="
              text-xs
              sm:text-sm
              text-slate-500
            "
          >

            MOQ:{' '}

            <strong
              className="
                text-slate-700
              "
            >

              {product.displayMOQ}

            </strong>

          </span>


          {/* STOCK */}

          <span
            className={`
              text-[10px]
              sm:text-xs
              font-semibold
              ${
                isOutOfStock
                  ? 'text-red-500'
                  : 'text-emerald-600'
              }
            `}
          >

            {isOutOfStock
              ? 'Out of Stock'
              : 'In Stock'}

          </span>

        </div>


        {/* Add Cart */}

        <button
          type="button"
          disabled={
            isOutOfStock
          }
          onClick={() =>
            onAddToCart(
              product
            )
          }
          className={`
            w-full
            mt-4
            h-10
            rounded-lg
            text-xs
            sm:text-sm
            font-bold
            transition-colors
            ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-teal-600 text-white hover:bg-teal-700'
            }
          `}
        >

          {isOutOfStock
            ? 'Out of Stock'
            : 'Add to Cart'}

        </button>

      </div>

    </article>

  );

};


export default Products;