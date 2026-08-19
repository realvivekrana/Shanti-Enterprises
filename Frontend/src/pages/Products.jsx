import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Link,
  useSearchParams,
} from 'react-router-dom';

import API from '../api/axios';

import {
  useCart,
} from '../context/CartContext';


// ======================================================
// CATEGORIES
// ======================================================

const categories = [
  'All',
  'Courier Bags',
  'Boxes',
  'Tapes',
  'Labels',
  'Paper Shredded',
];


// ======================================================
// PRODUCT CARD
// ======================================================

const ProductCard = ({
  product,
  addToCart,
}) => {

  const image =
    product.images?.[0] ||
    product.image ||
    'https://via.placeholder.com/500x500?text=No+Image';


  const price =
    Number(
      product.price || 0
    );


  const wholesalePrice =
    Number(
      product.wholesalePrice ||
      product.bulkPrice ||
      price
    );


  const moq =
    Number(
      product.moq ||
      product.minimumOrderQuantity ||
      1
    );


  const stock =
    Number(
      product.stock ||
      product.countInStock ||
      0
    );


  const handleAddToCart =
    () => {

      addToCart({
        ...product,
        quantity: moq,
      });

    };


  return (

    <div
      className="
        group
        bg-white
        border
        border-slate-200
        rounded-2xl
        overflow-hidden
        hover:border-teal-400
        hover:shadow-xl
        transition-all
        duration-300
      "
    >

      {/* ==================================================
          IMAGE
      ================================================== */}

      <Link
        to={`/product/${product._id}`}
        className="
          block
          aspect-square
          bg-slate-50
          overflow-hidden
        "
      >

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

      </Link>


      {/* ==================================================
          PRODUCT DETAILS
      ================================================== */}

      <div className="p-4">

        {/* Category */}

        <p
          className="
            text-[11px]
            uppercase
            tracking-wide
            font-semibold
            text-teal-600
          "
        >

          {product.category ||
            'Packaging'}

        </p>


        {/* Name */}

        <Link
          to={`/product/${product._id}`}
        >

          <h3
            className="
              mt-1
              font-bold
              text-slate-800
              line-clamp-2
              min-h-[48px]
              hover:text-teal-700
            "
          >

            {product.name}

          </h3>

        </Link>


        {/* Price */}

        <div
          className="
            mt-3
            flex
            items-end
            justify-between
            gap-2
          "
        >

          <div>

            <p
              className="
                text-xs
                text-slate-400
              "
            >

              Wholesale Price

            </p>


            <p
              className="
                text-xl
                font-extrabold
                text-slate-900
              "
            >

              ₹
              {wholesalePrice.toLocaleString(
                'en-IN'
              )}

            </p>

          </div>


          {wholesalePrice <
            price && (

            <span
              className="
                text-[10px]
                font-bold
                text-green-700
                bg-green-50
                px-2
                py-1
                rounded-full
              "
            >

              Bulk Saving

            </span>

          )}

        </div>


        {/* MOQ / Stock */}

        <div
          className="
            grid
            grid-cols-2
            gap-2
            mt-4
          "
        >

          <div
            className="
              bg-slate-50
              rounded-lg
              px-3
              py-2
            "
          >

            <p
              className="
                text-[10px]
                text-slate-400
              "
            >

              MOQ

            </p>


            <p
              className="
                text-sm
                font-bold
                text-slate-700
              "
            >

              {moq} pcs

            </p>

          </div>


          <div
            className="
              bg-slate-50
              rounded-lg
              px-3
              py-2
            "
          >

            <p
              className="
                text-[10px]
                text-slate-400
              "
            >

              Stock

            </p>


            <p
              className={`
                text-sm
                font-bold
                ${
                  stock > 0
                    ? 'text-green-700'
                    : 'text-red-600'
                }
              `}
            >

              {stock > 0
                ? `${stock} pcs`
                : 'Out of stock'}

            </p>

          </div>

        </div>


        {/* Add Cart */}

        <button
          type="button"
          disabled={
            stock <= 0
          }
          onClick={
            handleAddToCart
          }
          className="
            w-full
            mt-4
            py-2.5
            rounded-xl
            bg-teal-600
            text-white
            font-semibold
            text-sm
            hover:bg-teal-700
            disabled:bg-slate-300
            disabled:cursor-not-allowed
            transition-colors
          "
        >

          {stock > 0
            ? `Add ${moq} pcs to Cart`
            : 'Out of Stock'}

        </button>

      </div>

    </div>

  );

};


// ======================================================
// PRODUCTS PAGE
// ======================================================

const Products = () => {

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
    searchParams,
    setSearchParams,
  ] = useSearchParams();


  const {
    addToCart,
  } = useCart();


  // ====================================================
  // FILTER STATE
  // ====================================================

  const [
    search,
    setSearch,
  ] = useState(
    searchParams.get(
      'search'
    ) || ''
  );


  const [
    category,
    setCategory,
  ] = useState(
    searchParams.get(
      'category'
    ) || 'All'
  );


  const [
    minPrice,
    setMinPrice,
  ] = useState('');


  const [
    maxPrice,
    setMaxPrice,
  ] = useState('');


  const [
    onlyInStock,
    setOnlyInStock,
  ] = useState(false);


  const [
    onlyWholesale,
    setOnlyWholesale,
  ] = useState(false);


  const [
    sort,
    setSort,
  ] = useState('featured');


  // ====================================================
  // FETCH PRODUCTS
  // ====================================================

  useEffect(() => {

    const fetchProducts =
      async () => {

        setLoading(true);
        setError('');


        try {

          const params =
            new URLSearchParams();


          const urlSearch =
            searchParams.get(
              'search'
            );


          const urlCategory =
            searchParams.get(
              'category'
            );


          if (urlSearch) {

            params.append(
              'search',
              urlSearch
            );

          }


          if (
            urlCategory &&
            urlCategory !== 'All'
          ) {

            params.append(
              'category',
              urlCategory
            );

          }


          const response =
            await API.get(
              `/products?${params.toString()}`
            );


          const data =
            response.data;


          if (
            Array.isArray(data)
          ) {

            setProducts(
              data
            );

          } else if (
            Array.isArray(
              data?.data
            )
          ) {

            setProducts(
              data.data
            );

          } else if (
            Array.isArray(
              data?.products
            )
          ) {

            setProducts(
              data.products
            );

          } else {

            setProducts([]);

          }

        } catch (err) {

          console.error(
            'Products fetch error:',
            err
          );


          setError(
            err.response?.data
              ?.message ||
            'Failed to load products.'
          );

          setProducts([]);

        } finally {

          setLoading(false);

        }

      };


    fetchProducts();

  }, [
    searchParams,
  ]);


  // ====================================================
  // SEARCH
  // ====================================================

  const handleSearch =
    (event) => {

      event.preventDefault();


      const params =
        new URLSearchParams(
          searchParams
        );


      if (
        search.trim()
      ) {

        params.set(
          'search',
          search.trim()
        );

      } else {

        params.delete(
          'search'
        );

      }


      if (
        category &&
        category !== 'All'
      ) {

        params.set(
          'category',
          category
        );

      } else {

        params.delete(
          'category'
        );

      }


      setSearchParams(
        params
      );

    };


  // ====================================================
  // CATEGORY
  // ====================================================

  const handleCategory =
    (value) => {

      setCategory(
        value
      );


      const params =
        new URLSearchParams(
          searchParams
        );


      if (
        value === 'All'
      ) {

        params.delete(
          'category'
        );

      } else {

        params.set(
          'category',
          value
        );

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
      setCategory('All');
      setMinPrice('');
      setMaxPrice('');
      setOnlyInStock(false);
      setOnlyWholesale(false);
      setSort('featured');


      setSearchParams({});

    };


  // ====================================================
  // FILTER + SORT
  // ====================================================

  const filteredProducts =
    useMemo(() => {

      let result =
        [...products];


      // ================================================
      // SEARCH
      // ================================================

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


              const productCategory =
                String(
                  product.category ||
                  ''
                ).toLowerCase();


              const sku =
                String(
                  product.sku ||
                  ''
                ).toLowerCase();


              return (
                name.includes(
                  searchValue
                ) ||
                productCategory.includes(
                  searchValue
                ) ||
                sku.includes(
                  searchValue
                )
              );

            }
          );

      }


      // ================================================
      // PRICE
      // ================================================

      if (
        minPrice !== ''
      ) {

        result =
          result.filter(
            (product) => {

              const price =
                Number(
                  product.wholesalePrice ||
                  product.bulkPrice ||
                  product.price ||
                  0
                );


              return (
                price >=
                Number(
                  minPrice
                )
              );

            }
          );

      }


      if (
        maxPrice !== ''
      ) {

        result =
          result.filter(
            (product) => {

              const price =
                Number(
                  product.wholesalePrice ||
                  product.bulkPrice ||
                  product.price ||
                  0
                );


              return (
                price <=
                Number(
                  maxPrice
                )
              );

            }
          );

      }


      // ================================================
      // STOCK
      // ================================================

      if (
        onlyInStock
      ) {

        result =
          result.filter(
            (product) => {

              const stock =
                Number(
                  product.stock ||
                  product.countInStock ||
                  0
                );


              return stock > 0;

            }
          );

      }


      // ================================================
      // WHOLESALE
      // ================================================

      if (
        onlyWholesale
      ) {

        result =
          result.filter(
            (product) => {

              return Boolean(
                product.wholesalePrice ||
                product.bulkPrice ||
                product.moq ||
                product.minimumOrderQuantity
              );

            }
          );

      }


      // ================================================
      // SORT
      // ================================================

      if (
        sort === 'priceLow'
      ) {

        result.sort(
          (a, b) => {

            const priceA =
              Number(
                a.wholesalePrice ||
                a.bulkPrice ||
                a.price ||
                0
              );


            const priceB =
              Number(
                b.wholesalePrice ||
                b.bulkPrice ||
                b.price ||
                0
              );


            return (
              priceA -
              priceB
            );

          }
        );

      }


      if (
        sort === 'priceHigh'
      ) {

        result.sort(
          (a, b) => {

            const priceA =
              Number(
                a.wholesalePrice ||
                a.bulkPrice ||
                a.price ||
                0
              );


            const priceB =
              Number(
                b.wholesalePrice ||
                b.bulkPrice ||
                b.price ||
                0
              );


            return (
              priceB -
              priceA
            );

          }
        );

      }


      if (
        sort === 'newest'
      ) {

        result.sort(
          (a, b) =>
            new Date(
              b.createdAt || 0
            ) -
            new Date(
              a.createdAt || 0
            )
        );

      }


      if (
        sort === 'name'
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
        sort === 'popular'
      ) {

        result.sort(
          (a, b) =>
            Number(
              b.totalSold ||
              b.sold ||
              0
            ) -
            Number(
              a.totalSold ||
              a.sold ||
              0
            )
        );

      }


      return result;

    }, [
      products,
      search,
      minPrice,
      maxPrice,
      onlyInStock,
      onlyWholesale,
      sort,
    ]);


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
          "
        >

          <p
            className="
              text-sm
              font-semibold
              text-teal-600
            "
          >

            Wholesale Marketplace

          </p>


          <h1
            className="
              text-3xl
              sm:text-4xl
              font-extrabold
              text-slate-900
              mt-1
            "
          >

            Products

          </h1>


          <p
            className="
              text-sm
              text-slate-500
              mt-2
              max-w-2xl
            "
          >

            Find quality packaging products
            at competitive wholesale prices
            for your business.

          </p>

        </div>

      </section>


      {/* ==================================================
          MAIN
      ================================================== */}

      <main
        className="
          max-w-7xl
          mx-auto
          px-4
          py-7
        "
      >

        {/* ==================================================
            SEARCH
        ================================================== */}

        <form
          onSubmit={
            handleSearch
          }
          className="
            bg-white
            rounded-2xl
            border
            border-slate-200
            p-4
            mb-6
          "
        >

          <div
            className="
              flex
              flex-col
              sm:flex-row
              gap-3
            "
          >

            <div
              className="
                relative
                flex-1
              "
            >

              <span
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                "
              >

                🔍

              </span>


              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search products, SKU, categories..."
                className="
                  w-full
                  h-12
                  pl-11
                  pr-4
                  rounded-xl
                  bg-slate-50
                  border
                  border-slate-200
                  outline-none
                  focus:bg-white
                  focus:border-teal-500
                  focus:ring-4
                  focus:ring-teal-50
                "
              />

            </div>


            <button
              type="submit"
              className="
                h-12
                px-6
                rounded-xl
                bg-teal-600
                text-white
                font-semibold
                hover:bg-teal-700
                transition-colors
              "
            >

              Search

            </button>

          </div>

        </form>


        {/* ==================================================
            CATEGORY TABS
        ================================================== */}

        <div
          className="
            flex
            gap-2
            overflow-x-auto
            pb-2
            mb-7
          "
        >

          {categories.map(
            (item) => (

              <button
                key={item}
                type="button"
                onClick={() =>
                  handleCategory(
                    item
                  )
                }
                className={`
                  whitespace-nowrap
                  px-4
                  py-2.5
                  rounded-full
                  text-sm
                  font-semibold
                  border
                  transition-colors
                  ${
                    category ===
                    item
                      ? 'bg-teal-600 text-white border-teal-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-teal-400 hover:text-teal-700'
                  }
                `}
              >

                {item}

              </button>

            )
          )}

        </div>


        {/* ==================================================
            CONTENT
        ================================================== */}

        <div
          className="
            grid
            lg:grid-cols-[250px_1fr]
            gap-6
          "
        >

          {/* ==================================================
              FILTER SIDEBAR
          ================================================== */}

          <aside
            className="
              bg-white
              border
              border-slate-200
              rounded-2xl
              p-5
              h-fit
              lg:sticky
              lg:top-24
            "
          >

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
                  hover:underline
                "
              >

                Clear All

              </button>

            </div>


            {/* Price */}

            <div
              className="
                pb-5
                border-b
                border-slate-100
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

                Price Range

              </h3>


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
                    bg-slate-50
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
                    bg-slate-50
                    outline-none
                    focus:border-teal-500
                  "
                />

              </div>

            </div>


            {/* Availability */}

            <div
              className="
                py-5
                border-b
                border-slate-100
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

                Availability

              </h3>


              <label
                className="
                  flex
                  items-center
                  gap-3
                  cursor-pointer
                  text-sm
                  text-slate-600
                "
              >

                <input
                  type="checkbox"
                  checked={
                    onlyInStock
                  }
                  onChange={(event) =>
                    setOnlyInStock(
                      event.target.checked
                    )
                  }
                  className="
                    w-4
                    h-4
                    accent-teal-600
                  "
                />

                In Stock Only

              </label>

            </div>


            {/* Wholesale */}

            <div
              className="
                py-5
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

                Buying Type

              </h3>


              <label
                className="
                  flex
                  items-center
                  gap-3
                  cursor-pointer
                  text-sm
                  text-slate-600
                "
              >

                <input
                  type="checkbox"
                  checked={
                    onlyWholesale
                  }
                  onChange={(event) =>
                    setOnlyWholesale(
                      event.target.checked
                    )
                  }
                  className="
                    w-4
                    h-4
                    accent-teal-600
                  "
                />

                Wholesale Products

              </label>

            </div>

          </aside>


          {/* ==================================================
              PRODUCTS
          ================================================== */}

          <section>

            {/* Top Bar */}

            <div
              className="
                bg-white
                border
                border-slate-200
                rounded-2xl
                p-4
                mb-5
                flex
                flex-col
                sm:flex-row
                sm:items-center
                justify-between
                gap-3
              "
            >

              <div>

                <p
                  className="
                    text-sm
                    text-slate-500
                  "
                >

                  Showing

                  <span
                    className="
                      font-bold
                      text-slate-800
                      mx-1
                    "
                  >

                    {
                      filteredProducts.length
                    }

                  </span>

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
                  px-3
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  text-sm
                  font-medium
                  outline-none
                  focus:border-teal-500
                "
              >

                <option value="featured">
                  Featured
                </option>

                <option value="popular">
                  Most Popular
                </option>

                <option value="newest">
                  Newest
                </option>

                <option value="priceLow">
                  Price: Low to High
                </option>

                <option value="priceHigh">
                  Price: High to Low
                </option>

                <option value="name">
                  Name
                </option>

              </select>

            </div>


            {/* Loading */}

            {loading && (

              <div
                className="
                  bg-white
                  rounded-2xl
                  border
                  border-slate-200
                  p-12
                  text-center
                "
              >

                <div
                  className="
                    w-10
                    h-10
                    mx-auto
                    rounded-full
                    border-4
                    border-slate-200
                    border-t-teal-600
                    animate-spin
                  "
                />


                <p
                  className="
                    text-sm
                    text-slate-500
                    mt-4
                  "
                >

                  Loading products...

                </p>

              </div>

            )}


            {/* Error */}

            {!loading &&
              error && (

              <div
                className="
                  bg-red-50
                  border
                  border-red-200
                  rounded-2xl
                  p-6
                  text-red-700
                "
              >

                <p
                  className="
                    font-semibold
                  "
                >

                  Unable to load products

                </p>


                <p
                  className="
                    text-sm
                    mt-1
                  "
                >

                  {error}

                </p>

              </div>

            )}


            {/* Product Grid */}

            {!loading &&
              !error &&
              filteredProducts.length >
                0 && (

                <div
                  className="
                    grid
                    grid-cols-2
                    sm:grid-cols-2
                    xl:grid-cols-3
                    gap-4
                  "
                >

                  {filteredProducts.map(
                    (product) => (

                      <ProductCard
                        key={
                          product._id
                        }
                        product={
                          product
                        }
                        addToCart={
                          addToCart
                        }
                      />

                    )
                  )}

                </div>

              )}


            {/* Empty */}

            {!loading &&
              !error &&
              filteredProducts.length ===
                0 && (

                <div
                  className="
                    bg-white
                    border
                    border-slate-200
                    rounded-2xl
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
                      text-xl
                      font-bold
                      text-slate-800
                      mt-4
                    "
                  >

                    No Products Found

                  </h2>


                  <p
                    className="
                      text-sm
                      text-slate-500
                      mt-2
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
                      rounded-xl
                      bg-teal-600
                      text-white
                      font-semibold
                      text-sm
                      hover:bg-teal-700
                    "
                  >

                    Clear Filters

                  </button>

                </div>

              )}

          </section>

        </div>

      </main>

    </div>

  );

};


export default Products;