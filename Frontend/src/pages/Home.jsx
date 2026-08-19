import {
  useEffect,
  useState,
} from 'react';

import {
  Link,
  useSearchParams,
} from 'react-router-dom';

import API from '../api/axios';

import BannerCarousel from '../components/BannerCarousel';
import FAQAccordion from '../components/FAQAccordion';


// ======================================================
// MARKETPLACES
// ======================================================

const marketplaces = [

  {
    name: 'Flipkart',
    className: 'text-[#2874f0]',
  },

  {
    name: 'Amazon',
    className: 'text-[#232f3e]',
  },

  {
    name: 'Myntra',
    className: 'text-[#ff3f6c]',
  },

  {
    name: 'Meesho',
    className: 'text-[#970251]',
  },

];


// ======================================================
// HOME CATEGORIES
// ======================================================

const homeCategories = [

  {
    label: 'Courier Bags',
    category: 'Courier Bags',
    icon: '📦',
    description: 'Strong & lightweight',
  },

  {
    label: 'Boxes',
    category: 'Boxes',
    icon: '🗃️',
    description: 'Sturdy shipping boxes',
  },

  {
    label: 'Tapes',
    category: 'Tapes',
    icon: '🧻',
    description: 'Reliable packaging tapes',
  },

  {
    label: 'Labels & Stickers',
    category: 'Labels',
    icon: '🏷️',
    description: 'Professional labels',
  },

];


// ======================================================
// POPULAR CATEGORIES
// ======================================================

const popularCategories = [

  {
    title: 'Courier Bags',
    category: 'Courier Bags',
    icon: '📦',
    description:
      'Durable courier bags for daily shipping.',
  },

  {
    title: 'Packaging Boxes',
    category: 'Boxes',
    icon: '🗃️',
    description:
      'Multiple sizes for safe product packaging.',
  },

  {
    title: 'Packaging Tapes',
    category: 'Tapes',
    icon: '📏',
    description:
      'Strong tapes for secure packaging.',
  },

  {
    title: 'Labels & Stickers',
    category: 'Labels',
    icon: '🏷️',
    description:
      'Professional labels for business orders.',
  },

];


// ======================================================
// WHOLESALE BENEFITS
// ======================================================

const wholesaleBenefits = [

  {
    icon: '💰',
    title: 'Better Wholesale Prices',
    description:
      'Get competitive pricing when you buy in larger quantities.',
  },

  {
    icon: '📊',
    title: 'Bulk Order Support',
    description:
      'Upload your bulk order or contact us for large requirements.',
  },

  {
    icon: '🤝',
    title: 'Business Friendly',
    description:
      'Designed for retailers, resellers and growing businesses.',
  },

  {
    icon: '🚚',
    title: 'Reliable Delivery',
    description:
      'Smooth order processing and shipment tracking.',
  },

];


// ======================================================
// WHY CHOOSE US
// ======================================================

const whyChooseUs = [

  {
    title: 'Fast Delivery',
    icon: '🚚',
    description:
      'Quick and reliable order dispatch.',
  },

  {
    title: 'Premium Quality',
    icon: '⭐',
    description:
      'Quality products for professional businesses.',
  },

  {
    title: 'Secure Payment',
    icon: '🔒',
    description:
      'Safe and secure payment processing.',
  },

  {
    title: 'Business Support',
    icon: '💬',
    description:
      'Support for bulk and wholesale requirements.',
  },

];


// ======================================================
// HOW IT WORKS
// ======================================================

const howItWorks = [

  {
    number: '01',
    icon: '🔎',
    title: 'Browse Products',
    description:
      'Explore packaging products and find what your business needs.',
  },

  {
    number: '02',
    icon: '🛒',
    title: 'Add to Cart',
    description:
      'Select quantities and add products to your cart.',
  },

  {
    number: '03',
    icon: '📋',
    title: 'Place Order or RFQ',
    description:
      'Buy directly or request a quotation for large quantities.',
  },

  {
    number: '04',
    icon: '🚚',
    title: 'Get Delivery',
    description:
      'We process your order and deliver it to your business.',
  },

];


// ======================================================
// TESTIMONIALS
// ======================================================

const testimonials = [

  {
    name: 'Verified Buyer',
    business:
      'Online Seller',
    text:
      'Great quality courier bags and very useful for my regular shipping requirements.',
  },

  {
    name: 'Verified Buyer',
    business:
      'Retail Business',
    text:
      'The boxes are sturdy and the bulk pricing makes ordering much easier for my business.',
  },

  {
    name: 'Verified Buyer',
    business:
      'Marketplace Seller',
    text:
      'Good packaging quality, simple ordering process and reliable delivery.',
  },

];


// ======================================================
// PRODUCT CARD
// ======================================================

const ProductCard = ({
  product,
}) => {

  return (

    <Link
      to={`/product/${product._id}`}
      className="
        group
        bg-white
        border
        border-slate-200
        rounded-2xl
        overflow-hidden
        hover:shadow-xl
        hover:border-teal-300
        transition-all
        duration-300
      "
    >

      {/* ==================================================
          IMAGE
      ================================================== */}

      <div
        className="
          aspect-square
          overflow-hidden
          bg-slate-50
        "
      >

        <img
          src={
            product.images?.[0] ||
            'https://via.placeholder.com/500x500?text=No+Image'
          }
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

      </div>


      {/* ==================================================
          DETAILS
      ================================================== */}

      <div className="p-4">

        <p
          className="
            text-xs
            text-teal-700
            font-semibold
            uppercase
            tracking-wide
          "
        >

          {product.category}

        </p>


        <h3
          className="
            font-semibold
            text-slate-800
            mt-1
            line-clamp-2
            min-h-[48px]
          "
        >

          {product.name}

        </h3>


        <div
          className="
            flex
            items-center
            justify-between
            gap-2
            mt-3
          "
        >

          <p
            className="
              text-lg
              font-bold
              text-slate-900
            "
          >

            ₹
            {Number(
              product.price || 0
            ).toLocaleString('en-IN')}

          </p>


          <span
            className="
              text-xs
              font-medium
              text-teal-700
              bg-teal-50
              px-2
              py-1
              rounded-full
            "
          >

            Wholesale

          </span>

        </div>

      </div>

    </Link>

  );

};


// ======================================================
// HOME PAGE
// ======================================================

const Home = () => {

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


  const [
    searchText,
    setSearchText,
  ] = useState('');


  // ====================================================
  // URL FILTERS
  // ====================================================

  const activeCategory =
    searchParams.get(
      'category'
    ) || '';


  const activeMarketplace =
    searchParams.get(
      'marketplace'
    ) || '';


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


          if (
            activeCategory
          ) {

            params.append(
              'category',
              activeCategory
            );

          }


          if (
            activeMarketplace
          ) {

            params.append(
              'search',
              activeMarketplace
            );

          }


          const response =
            await API.get(
              `/products?${params.toString()}`
            );


          setProducts(
            response.data || []
          );

        } catch (err) {

          console.error(
            'Home products error:',
            err
          );


          setError(
            err.response?.data
              ?.message ||
            'Failed to load products'
          );

        } finally {

          setLoading(false);

        }

      };


    fetchProducts();

  }, [
    activeCategory,
    activeMarketplace,
  ]);


  // ====================================================
  // CATEGORY FILTER
  // ====================================================

  const handleCategoryClick =
    (category) => {

      setSearchParams({
        category,
      });

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });

    };


  // ====================================================
  // MARKETPLACE FILTER
  // ====================================================

  const handleMarketplaceClick =
    (name) => {

      if (
        activeMarketplace ===
        name
      ) {

        setSearchParams({});

      } else {

        setSearchParams({
          marketplace: name,
        });

      }

    };


  // ====================================================
  // SEARCH
  // ====================================================

  const handleSearch =
    (event) => {

      event.preventDefault();


      const value =
        searchText.trim();


      if (!value) {

        return;

      }


      setSearchParams({
        search: value,
      });


      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });

    };


  // ====================================================
  // PRODUCTS
  // ====================================================

  const bestSellers =
    products
      .filter(
        (product) =>
          product.isBestSeller
      )
      .slice(0, 8);


  const bestSellerList =
    bestSellers.length > 0
      ? bestSellers
      : products.slice(0, 8);


  const trendingProducts =
    products
      .slice()
      .sort(
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
      )
      .slice(0, 8);


  const newArrivals =
    products
      .slice()
      .sort(
        (a, b) =>
          new Date(
            b.createdAt || 0
          ) -
          new Date(
            a.createdAt || 0
          )
      )
      .slice(0, 8);


  const isFiltered =
    Boolean(
      activeCategory ||
      activeMarketplace
    );


  const filteredHeading =
    activeCategory
      ? activeCategory.replace(
          ',',
          ' & '
        )
      : activeMarketplace
      ? `Products for ${activeMarketplace} sellers`
      : 'Search Results';


  // ====================================================
  // RENDER
  // ====================================================

  return (

    <div
      className="
        bg-white
        text-slate-800
      "
    >


      {/* ==================================================
          HERO
      ================================================== */}

      <section
        className="
          relative
          overflow-hidden
          bg-gradient-to-br
          from-teal-700
          via-teal-600
          to-slate-900
          text-white
        "
      >

        {/* Background decoration */}

        <div
          className="
            absolute
            -top-32
            -right-32
            w-80
            h-80
            rounded-full
            bg-white/10
            blur-3xl
          "
        />


        <div
          className="
            absolute
            -bottom-40
            -left-20
            w-96
            h-96
            rounded-full
            bg-teal-300/10
            blur-3xl
          "
        />


        <div
          className="
            relative
            max-w-7xl
            mx-auto
            px-4
            py-14
            sm:py-20
            lg:py-24
          "
        >

          <div
            className="
              grid
              lg:grid-cols-2
              gap-10
              lg:gap-16
              items-center
            "
          >

            {/* ==================================================
                HERO CONTENT
            ================================================== */}

            <div>

              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  px-3
                  py-1.5
                  rounded-full
                  bg-white/10
                  border
                  border-white/20
                  text-sm
                  font-medium
                  mb-5
                "
              >

                <span>
                  🏢
                </span>

                Wholesale Solutions for Businesses

              </div>


              <h1
                className="
                  text-4xl
                  sm:text-5xl
                  lg:text-6xl
                  font-extrabold
                  leading-tight
                  tracking-tight
                "
              >

                Wholesale Products

                <span
                  className="
                    block
                    text-teal-100
                  "
                >

                  At Better Prices

                </span>

              </h1>


              <p
                className="
                  mt-5
                  text-base
                  sm:text-lg
                  text-teal-50
                  max-w-xl
                  leading-relaxed
                "
              >

                Source quality packaging products
                for your business at competitive
                wholesale prices with easy bulk
                ordering and quotation support.

              </p>


              {/* ==================================================
                  HERO ACTIONS
              ================================================== */}

              <div
                className="
                  flex
                  flex-col
                  sm:flex-row
                  gap-3
                  mt-8
                "
              >

                <Link
                  to="/?category=Courier%20Bags"
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    px-6
                    py-3.5
                    rounded-xl
                    bg-white
                    text-teal-700
                    font-bold
                    hover:bg-teal-50
                    transition-colors
                  "
                >

                  Shop Now

                  <span>
                    →
                  </span>

                </Link>


                <Link
                  to="/my-rfqs"
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    px-6
                    py-3.5
                    rounded-xl
                    bg-white/10
                    border
                    border-white/30
                    text-white
                    font-bold
                    hover:bg-white/20
                    transition-colors
                  "
                >

                  Request a Quote

                  <span>
                    📋
                  </span>

                </Link>

              </div>


              {/* ==================================================
                  TRUST POINTS
              ================================================== */}

              <div
                className="
                  grid
                  grid-cols-2
                  sm:grid-cols-3
                  gap-4
                  mt-9
                  pt-7
                  border-t
                  border-white/15
                "
              >

                <div>

                  <p className="font-bold">
                    Bulk Friendly
                  </p>

                  <p
                    className="
                      text-xs
                      text-teal-100
                      mt-1
                    "
                  >
                    Built for businesses
                  </p>

                </div>


                <div>

                  <p className="font-bold">
                    Better Pricing
                  </p>

                  <p
                    className="
                      text-xs
                      text-teal-100
                      mt-1
                    "
                  >
                    Wholesale rates
                  </p>

                </div>


                <div
                  className="
                    hidden
                    sm:block
                  "
                >

                  <p className="font-bold">
                    Reliable Support
                  </p>

                  <p
                    className="
                      text-xs
                      text-teal-100
                      mt-1
                    "
                  >
                    Business assistance
                  </p>

                </div>

              </div>

            </div>


            {/* ==================================================
                HERO VISUAL
            ================================================== */}

            <div
              className="
                hidden
                lg:block
              "
            >

              <div
                className="
                  relative
                  bg-white/10
                  border
                  border-white/20
                  rounded-3xl
                  p-6
                  backdrop-blur-sm
                "
              >

                <div
                  className="
                    bg-white
                    rounded-2xl
                    p-6
                    text-slate-800
                    shadow-2xl
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

                    <div>

                      <p
                        className="
                          text-xs
                          text-slate-400
                          uppercase
                          tracking-wide
                        "
                      >

                        Business Order

                      </p>

                      <h3
                        className="
                          text-lg
                          font-bold
                          mt-1
                        "
                      >

                        Wholesale Supply

                      </h3>

                    </div>


                    <div
                      className="
                        w-11
                        h-11
                        rounded-xl
                        bg-teal-50
                        flex
                        items-center
                        justify-center
                        text-xl
                      "
                    >

                      📦

                    </div>

                  </div>


                  <div
                    className="
                      space-y-3
                    "
                  >

                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        bg-slate-50
                        rounded-xl
                        p-3
                      "
                    >

                      <span>
                        Courier Bags
                      </span>

                      <span
                        className="
                          font-bold
                          text-teal-700
                        "
                      >
                        500 pcs
                      </span>

                    </div>


                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        bg-slate-50
                        rounded-xl
                        p-3
                      "
                    >

                      <span>
                        Packaging Boxes
                      </span>

                      <span
                        className="
                          font-bold
                          text-teal-700
                        "
                      >
                        200 pcs
                      </span>

                    </div>


                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        bg-slate-50
                        rounded-xl
                        p-3
                      "
                    >

                      <span>
                        Packaging Tapes
                      </span>

                      <span
                        className="
                          font-bold
                          text-teal-700
                        "
                      >
                        100 pcs
                      </span>

                    </div>

                  </div>


                  <div
                    className="
                      mt-5
                      p-4
                      rounded-xl
                      bg-teal-50
                      border
                      border-teal-100
                    "
                  >

                    <p
                      className="
                        text-sm
                        font-semibold
                        text-teal-800
                      "
                    >

                      💡 Need a larger quantity?

                    </p>

                    <p
                      className="
                        text-xs
                        text-teal-700
                        mt-1
                      "
                    >

                      Request a custom quotation
                      for your business order.

                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ==================================================
          SEARCH
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
            max-w-4xl
            mx-auto
            px-4
            py-5
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
                text-lg
              "
            >

              🔍

            </span>


            <input
              type="text"
              value={searchText}
              onChange={(event) =>
                setSearchText(
                  event.target.value
                )
              }
              placeholder="Search products, SKU, packaging supplies..."
              className="
                w-full
                h-14
                pl-12
                pr-28
                rounded-xl
                border
                border-slate-300
                bg-slate-50
                outline-none
                focus:bg-white
                focus:border-teal-500
                focus:ring-4
                focus:ring-teal-50
                transition-all
              "
            />


            <button
              type="submit"
              className="
                absolute
                right-2
                top-2
                h-10
                px-4
                rounded-lg
                bg-teal-600
                text-white
                font-semibold
                hover:bg-teal-700
                transition-colors
              "
            >

              Search

            </button>

          </form>

        </div>

      </section>


      {/* ==================================================
          EXISTING BANNER
      ================================================== */}

      <BannerCarousel />


      {/* ==================================================
          CATEGORIES
      ================================================== */}

      <section
        className="
          max-w-7xl
          mx-auto
          px-4
          py-12
          sm:py-14
        "
      >

        <div
          className="
            flex
            items-end
            justify-between
            gap-4
            mb-7
          "
        >

          <div>

            <p
              className="
                text-sm
                font-semibold
                text-teal-600
              "
            >

              Shop by Category

            </p>

            <h2
              className="
                text-2xl
                sm:text-3xl
                font-bold
                text-slate-900
                mt-1
              "
            >

              Packaging for Your Business

            </h2>

          </div>


          <Link
            to="/"
            className="
              hidden
              sm:block
              text-sm
              font-semibold
              text-teal-700
              hover:underline
            "
          >

            View All

          </Link>

        </div>


        <div
          className="
            grid
            grid-cols-2
            md:grid-cols-4
            gap-4
          "
        >

          {homeCategories.map(
            (item) => (

              <button
                key={
                  item.label
                }
                onClick={() =>
                  handleCategoryClick(
                    item.category
                  )
                }
                className="
                  text-left
                  bg-white
                  border
                  border-slate-200
                  rounded-2xl
                  p-5
                  hover:border-teal-400
                  hover:shadow-lg
                  transition-all
                  group
                "
              >

                <div
                  className="
                    w-12
                    h-12
                    rounded-xl
                    bg-teal-50
                    flex
                    items-center
                    justify-center
                    text-2xl
                    group-hover:scale-110
                    transition-transform
                  "
                >

                  {item.icon}

                </div>


                <h3
                  className="
                    font-bold
                    text-slate-800
                    mt-4
                  "
                >

                  {item.label}

                </h3>


                <p
                  className="
                    text-xs
                    text-slate-500
                    mt-1
                  "
                >

                  {item.description}

                </p>


                <span
                  className="
                    inline-block
                    text-xs
                    text-teal-700
                    font-semibold
                    mt-4
                  "
                >

                  Shop Now →

                </span>

              </button>

            )
          )}

        </div>

      </section>


      {/* ==================================================
          MARKETPLACE
      ================================================== */}

      <section
        className="
          bg-slate-50
          border-y
          border-slate-200
        "
      >

        <div
          className="
            max-w-7xl
            mx-auto
            px-4
            py-10
          "
        >

          <p
            className="
              text-center
              text-xs
              text-slate-400
              font-semibold
              uppercase
              tracking-widest
              mb-5
            "
          >

            Trusted by sellers across

          </p>


          <div
            className="
              grid
              grid-cols-2
              sm:grid-cols-4
              gap-3
            "
          >

            {marketplaces.map(
              ({
                name,
                className,
              }) => (

                <button
                  key={name}
                  onClick={() =>
                    handleMarketplaceClick(
                      name
                    )
                  }
                  className={`
                    bg-white
                    rounded-xl
                    py-5
                    flex
                    items-center
                    justify-center
                    text-xl
                    sm:text-2xl
                    font-extrabold
                    transition-all
                    border-2
                    ${className}
                    ${
                      activeMarketplace ===
                      name
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-transparent hover:border-slate-200'
                    }
                  `}
                >

                  {name}

                </button>

              )
            )}

          </div>

        </div>

      </section>


      {/* ==================================================
          FILTERED PRODUCTS
      ================================================== */}

      {isFiltered && (

        <section
          id="products"
          className="
            max-w-7xl
            mx-auto
            px-4
            py-12
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
              gap-4
              mb-7
            "
          >

            <div>

              <p
                className="
                  text-sm
                  text-teal-600
                  font-semibold
                "
              >

                Search Results

              </p>

              <h2
                className="
                  text-2xl
                  font-bold
                  text-slate-900
                  mt-1
                "
              >

                {filteredHeading}

              </h2>

            </div>


            <button
              onClick={() =>
                setSearchParams({})
              }
              className="
                text-sm
                text-teal-700
                hover:underline
                font-semibold
              "
            >

              Clear

            </button>

          </div>


          {loading && (

            <div
              className="
                py-10
                text-center
                text-slate-500
              "
            >

              Loading products...

            </div>

          )}


          {error && (

            <div
              className="
                bg-red-50
                border
                border-red-200
                text-red-700
                rounded-xl
                p-4
              "
            >

              {error}

            </div>

          )}


          {!loading &&
            products.length > 0 && (

              <div
                className="
                  grid
                  grid-cols-2
                  sm:grid-cols-3
                  lg:grid-cols-4
                  gap-4
                  sm:gap-5
                "
              >

                {products.map(
                  (product) => (

                    <ProductCard
                      key={
                        product._id
                      }
                      product={
                        product
                      }
                    />

                  )
                )}

              </div>

            )}


          {!loading &&
            products.length === 0 && (

              <div
                className="
                  py-16
                  text-center
                  text-slate-500
                "
              >

                No products found.

              </div>

            )}

        </section>

      )}


      {!isFiltered && (

        <>


          {/* ==================================================
              FEATURED PRODUCTS
          ================================================== */}

          <section
            id="products"
            className="
              max-w-7xl
              mx-auto
              px-4
              py-12
              sm:py-14
            "
          >

            <div
              className="
                flex
                items-end
                justify-between
                gap-4
                mb-7
              "
            >

              <div>

                <p
                  className="
                    text-sm
                    font-semibold
                    text-teal-600
                  "
                >

                  Best Sellers

                </p>

                <h2
                  className="
                    text-2xl
                    sm:text-3xl
                    font-bold
                    text-slate-900
                    mt-1
                  "
                >

                  Popular Products

                </h2>

              </div>


              <Link
                to="/"
                className="
                  text-sm
                  font-semibold
                  text-teal-700
                  hover:underline
                "
              >

                Explore →

              </Link>

            </div>


            {loading && (

              <p className="text-slate-500">
                Loading products...
              </p>

            )}


            {!loading &&
              bestSellerList.length > 0 && (

                <div
                  className="
                    grid
                    grid-cols-2
                    sm:grid-cols-3
                    lg:grid-cols-4
                    gap-4
                    sm:gap-5
                  "
                >

                  {bestSellerList.map(
                    (product) => (

                      <ProductCard
                        key={
                          product._id
                        }
                        product={
                          product
                        }
                      />

                    )
                  )}

                </div>

              )}


            {!loading &&
              products.length === 0 && (

                <div
                  className="
                    py-12
                    text-center
                    text-slate-500
                  "
                >

                  No products available yet.

                </div>

              )}

          </section>


          {/* ==================================================
              TRENDING
          ================================================== */}

          {trendingProducts.length > 0 && (

            <section
              className="
                bg-slate-50
                border-y
                border-slate-200
              "
            >

              <div
                className="
                  max-w-7xl
                  mx-auto
                  px-4
                  py-12
                  sm:py-14
                "
              >

                <div className="mb-7">

                  <p
                    className="
                      text-sm
                      font-semibold
                      text-teal-600
                    "
                  >

                    Trending Now

                  </p>

                  <h2
                    className="
                      text-2xl
                      sm:text-3xl
                      font-bold
                      text-slate-900
                      mt-1
                    "
                  >

                    Products Businesses Love

                  </h2>

                </div>


                <div
                  className="
                    grid
                    grid-cols-2
                    sm:grid-cols-3
                    lg:grid-cols-4
                    gap-4
                    sm:gap-5
                  "
                >

                  {trendingProducts.map(
                    (product) => (

                      <ProductCard
                        key={
                          product._id
                        }
                        product={
                          product
                        }
                      />

                    )
                  )}

                </div>

              </div>

            </section>

          )}


          {/* ==================================================
              WHY CHOOSE US
          ================================================== */}

          <section
            className="
              max-w-7xl
              mx-auto
              px-4
              py-14
            "
          >

            <div
              className="
                text-center
                max-w-2xl
                mx-auto
                mb-9
              "
            >

              <p
                className="
                  text-sm
                  font-semibold
                  text-teal-600
                "
              >

                Why Choose Us?

              </p>

              <h2
                className="
                  text-2xl
                  sm:text-3xl
                  font-bold
                  text-slate-900
                  mt-1
                "
              >

                Built for Business Buying

              </h2>

              <p
                className="
                  text-slate-500
                  text-sm
                  mt-3
                "
              >

                Everything you need to make
                business purchasing easier.

              </p>

            </div>


            <div
              className="
                grid
                grid-cols-2
                lg:grid-cols-4
                gap-4
              "
            >

              {whyChooseUs.map(
                (item) => (

                  <div
                    key={
                      item.title
                    }
                    className="
                      text-center
                      bg-white
                      border
                      border-slate-200
                      rounded-2xl
                      p-6
                      hover:shadow-lg
                      transition-shadow
                    "
                  >

                    <div
                      className="
                        w-14
                        h-14
                        mx-auto
                        rounded-2xl
                        bg-teal-50
                        flex
                        items-center
                        justify-center
                        text-2xl
                      "
                    >

                      {item.icon}

                    </div>


                    <h3
                      className="
                        font-bold
                        text-slate-800
                        mt-4
                      "
                    >

                      {item.title}

                    </h3>


                    <p
                      className="
                        text-xs
                        text-slate-500
                        mt-2
                        leading-relaxed
                      "
                    >

                      {item.description}

                    </p>

                  </div>

                )
              )}

            </div>

          </section>


          {/* ==================================================
              WHOLESALE BENEFITS
          ================================================== */}

          <section
            className="
              bg-slate-50
              border-y
              border-slate-200
            "
          >

            <div
              className="
                max-w-7xl
                mx-auto
                px-4
                py-14
              "
            >

              <div
                className="
                  grid
                  lg:grid-cols-2
                  gap-10
                  items-center
                "
              >

                <div>

                  <p
                    className="
                      text-sm
                      font-semibold
                      text-teal-600
                    "
                  >

                    Wholesale Advantage

                  </p>

                  <h2
                    className="
                      text-2xl
                      sm:text-3xl
                      font-bold
                      text-slate-900
                      mt-2
                    "
                  >

                    Buy More.
                    <span
                      className="
                        text-teal-700
                      "
                    >
                      Save More.
                    </span>

                  </h2>


                  <p
                    className="
                      text-slate-500
                      mt-4
                      leading-relaxed
                    "
                  >

                    Whether you are an online seller,
                    retailer, reseller or growing
                    business, our wholesale buying
                    experience is designed around
                    your requirements.

                  </p>


                  <Link
                    to="/bulk-order-upload"
                    className="
                      inline-flex
                      items-center
                      gap-2
                      mt-6
                      px-5
                      py-3
                      rounded-xl
                      bg-teal-600
                      text-white
                      font-semibold
                      hover:bg-teal-700
                      transition-colors
                    "
                  >

                    Upload Bulk Order

                    <span>
                      →
                    </span>

                  </Link>

                </div>


                <div
                  className="
                    grid
                    sm:grid-cols-2
                    gap-4
                  "
                >

                  {wholesaleBenefits.map(
                    (item) => (

                      <div
                        key={
                          item.title
                        }
                        className="
                          bg-white
                          rounded-2xl
                          border
                          border-slate-200
                          p-5
                        "
                      >

                        <div
                          className="
                            text-2xl
                          "
                        >

                          {item.icon}

                        </div>


                        <h3
                          className="
                            font-bold
                            text-slate-800
                            mt-3
                          "
                        >

                          {item.title}

                        </h3>


                        <p
                          className="
                            text-xs
                            text-slate-500
                            mt-2
                            leading-relaxed
                          "
                        >

                          {item.description}

                        </p>

                      </div>

                    )
                  )}

                </div>

              </div>

            </div>

          </section>


          {/* ==================================================
              BULK ORDER / RFQ CTA
          ================================================== */}

          <section
            className="
              max-w-7xl
              mx-auto
              px-4
              py-14
            "
          >

            <div
              className="
                rounded-3xl
                overflow-hidden
                bg-gradient-to-r
                from-teal-700
                to-slate-900
                text-white
              "
            >

              <div
                className="
                  p-7
                  sm:p-10
                  lg:p-14
                  text-center
                "
              >

                <div
                  className="
                    text-4xl
                    mb-4
                  "
                >

                  📦

                </div>


                <h2
                  className="
                    text-2xl
                    sm:text-4xl
                    font-bold
                  "
                >

                  Need a Large Quantity?

                </h2>


                <p
                  className="
                    text-teal-50
                    max-w-2xl
                    mx-auto
                    mt-3
                    text-sm
                    sm:text-base
                    leading-relaxed
                  "
                >

                  Upload your bulk order or request
                  a quotation. Our team can help you
                  with large quantity requirements
                  and wholesale pricing.

                </p>


                <div
                  className="
                    flex
                    flex-col
                    sm:flex-row
                    justify-center
                    gap-3
                    mt-7
                  "
                >

                  <Link
                    to="/bulk-order-upload"
                    className="
                      px-6
                      py-3.5
                      rounded-xl
                      bg-white
                      text-teal-700
                      font-bold
                      hover:bg-teal-50
                      transition-colors
                    "
                  >

                    📊 Upload Bulk Order

                  </Link>


                  <Link
                    to="/my-rfqs"
                    className="
                      px-6
                      py-3.5
                      rounded-xl
                      border
                      border-white/30
                      bg-white/10
                      font-bold
                      hover:bg-white/20
                      transition-colors
                    "
                  >

                    📋 Request Quotation

                  </Link>

                </div>

              </div>

            </div>

          </section>


          {/* ==================================================
              POPULAR CATEGORIES
          ================================================== */}

          <section
            className="
              bg-slate-50
              border-y
              border-slate-200
            "
          >

            <div
              className="
                max-w-7xl
                mx-auto
                px-4
                py-14
              "
            >

              <div className="mb-8">

                <p
                  className="
                    text-sm
                    font-semibold
                    text-teal-600
                  "
                >

                  Explore

                </p>

                <h2
                  className="
                    text-2xl
                    sm:text-3xl
                    font-bold
                    text-slate-900
                    mt-1
                  "
                >

                  Popular Categories

                </h2>

              </div>


              <div
                className="
                  grid
                  grid-cols-1
                  sm:grid-cols-2
                  lg:grid-cols-4
                  gap-5
                "
              >

                {popularCategories.map(
                  (item) => (

                    <button
                      key={
                        item.title
                      }
                      onClick={() =>
                        handleCategoryClick(
                          item.category
                        )
                      }
                      className="
                        text-left
                        bg-white
                        rounded-2xl
                        border
                        border-slate-200
                        p-6
                        hover:border-teal-400
                        hover:shadow-lg
                        transition-all
                      "
                    >

                      <div
                        className="
                          text-3xl
                        "
                      >

                        {item.icon}

                      </div>


                      <h3
                        className="
                          font-bold
                          text-slate-800
                          mt-4
                        "
                      >

                        {item.title}

                      </h3>


                      <p
                        className="
                          text-sm
                          text-slate-500
                          mt-2
                          leading-relaxed
                        "
                      >

                        {item.description}

                      </p>


                      <span
                        className="
                          inline-block
                          text-sm
                          font-semibold
                          text-teal-700
                          mt-5
                        "
                      >

                        Explore Category →

                      </span>

                    </button>

                  )
                )}

              </div>

            </div>

          </section>


          {/* ==================================================
              HOW IT WORKS
          ================================================== */}

          <section
            className="
              max-w-7xl
              mx-auto
              px-4
              py-14
            "
          >

            <div
              className="
                text-center
                max-w-2xl
                mx-auto
                mb-10
              "
            >

              <p
                className="
                  text-sm
                  font-semibold
                  text-teal-600
                "
              >

                Simple Process

              </p>


              <h2
                className="
                  text-2xl
                  sm:text-3xl
                  font-bold
                  text-slate-900
                  mt-1
                "
              >

                How It Works

              </h2>


              <p
                className="
                  text-sm
                  text-slate-500
                  mt-3
                "
              >

                From finding products to receiving
                your business order.

              </p>

            </div>


            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-4
                gap-5
              "
            >

              {howItWorks.map(
                (item) => (

                  <div
                    key={
                      item.number
                    }
                    className="
                      relative
                      bg-white
                      border
                      border-slate-200
                      rounded-2xl
                      p-6
                    "
                  >

                    <div
                      className="
                        flex
                        items-center
                        justify-between
                      "
                    >

                      <div
                        className="
                          w-12
                          h-12
                          rounded-xl
                          bg-teal-50
                          flex
                          items-center
                          justify-center
                          text-xl
                        "
                      >

                        {item.icon}

                      </div>


                      <span
                        className="
                          text-3xl
                          font-black
                          text-slate-100
                        "
                      >

                        {item.number}

                      </span>

                    </div>


                    <h3
                      className="
                        font-bold
                        text-slate-800
                        mt-5
                      "
                    >

                      {item.title}

                    </h3>


                    <p
                      className="
                        text-sm
                        text-slate-500
                        mt-2
                        leading-relaxed
                      "
                    >

                      {item.description}

                    </p>

                  </div>

                )
              )}

            </div>

          </section>


          {/* ==================================================
              NEW ARRIVALS
          ================================================== */}

          {newArrivals.length > 0 && (

            <section
              className="
                bg-slate-50
                border-y
                border-slate-200
              "
            >

              <div
                className="
                  max-w-7xl
                  mx-auto
                  px-4
                  py-14
                "
              >

                <div className="mb-7">

                  <p
                    className="
                      text-sm
                      font-semibold
                      text-teal-600
                    "
                  >

                    Fresh Stock

                  </p>

                  <h2
                    className="
                      text-2xl
                      sm:text-3xl
                      font-bold
                      text-slate-900
                      mt-1
                    "
                  >

                    New Arrivals

                  </h2>

                </div>


                <div
                  className="
                    grid
                    grid-cols-2
                    sm:grid-cols-3
                    lg:grid-cols-4
                    gap-4
                    sm:gap-5
                  "
                >

                  {newArrivals.map(
                    (product) => (

                      <ProductCard
                        key={
                          product._id
                        }
                        product={
                          product
                        }
                      />

                    )
                  )}

                </div>

              </div>

            </section>

          )}


          {/* ==================================================
              TRUST / TESTIMONIALS
          ================================================== */}

          <section
            className="
              max-w-7xl
              mx-auto
              px-4
              py-14
            "
          >

            <div
              className="
                text-center
                max-w-2xl
                mx-auto
                mb-9
              "
            >

              <p
                className="
                  text-sm
                  font-semibold
                  text-teal-600
                "
              >

                Customer Trust

              </p>


              <h2
                className="
                  text-2xl
                  sm:text-3xl
                  font-bold
                  text-slate-900
                  mt-1
                "
              >

                What Businesses Say

              </h2>

            </div>


            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-3
                gap-5
              "
            >

              {testimonials.map(
                (
                  testimonial,
                  index
                ) => (

                  <div
                    key={
                      index
                    }
                    className="
                      bg-white
                      border
                      border-slate-200
                      rounded-2xl
                      p-6
                      shadow-sm
                    "
                  >

                    <div
                      className="
                        text-amber-400
                        tracking-wider
                      "
                    >

                      ★★★★★

                    </div>


                    <p
                      className="
                        text-sm
                        text-slate-600
                        leading-relaxed
                        mt-4
                      "
                    >

                      "{testimonial.text}"

                    </p>


                    <div
                      className="
                        mt-5
                        pt-4
                        border-t
                        border-slate-100
                      "
                    >

                      <p
                        className="
                          font-semibold
                          text-slate-800
                        "
                      >

                        {testimonial.name}

                      </p>


                      <p
                        className="
                          text-xs
                          text-slate-400
                          mt-1
                        "
                      >

                        {testimonial.business}

                      </p>

                    </div>

                  </div>

                )
              )}

            </div>

          </section>


          {/* ==================================================
              FAQ
          ================================================== */}

          <section
            className="
              bg-slate-50
              border-y
              border-slate-200
            "
          >

            <div
              className="
                max-w-4xl
                mx-auto
                px-4
                py-14
              "
            >

              <div
                className="
                  text-center
                  mb-8
                "
              >

                <p
                  className="
                    text-sm
                    font-semibold
                    text-teal-600
                  "
                >

                  Need Help?

                </p>


                <h2
                  className="
                    text-2xl
                    sm:text-3xl
                    font-bold
                    text-slate-900
                    mt-1
                  "
                >

                  Frequently Asked Questions

                </h2>

              </div>


              <FAQAccordion />

            </div>

          </section>


          {/* ==================================================
              FINAL CTA
          ================================================== */}

          <section
            className="
              bg-gradient-to-r
              from-teal-700
              to-slate-900
              text-white
            "
          >

            <div
              className="
                max-w-7xl
                mx-auto
                px-4
                py-14
                text-center
              "
            >

              <h2
                className="
                  text-2xl
                  sm:text-4xl
                  font-bold
                "
              >

                Ready to Grow Your Business?

              </h2>


              <p
                className="
                  text-teal-100
                  max-w-xl
                  mx-auto
                  mt-3
                  text-sm
                  sm:text-base
                "
              >

                Start shopping wholesale products
                or talk to us about your bulk
                requirements.

              </p>


              <div
                className="
                  flex
                  flex-col
                  sm:flex-row
                  justify-center
                  gap-3
                  mt-7
                "
              >

                <Link
                  to="/"
                  className="
                    px-6
                    py-3.5
                    rounded-xl
                    bg-white
                    text-teal-700
                    font-bold
                    hover:bg-teal-50
                    transition-colors
                  "
                >

                  Start Shopping

                </Link>


                <Link
                  to="/bulk-order-upload"
                  className="
                    px-6
                    py-3.5
                    rounded-xl
                    border
                    border-white/30
                    bg-white/10
                    font-bold
                    hover:bg-white/20
                    transition-colors
                  "
                >

                  Bulk Order

                </Link>

              </div>

            </div>

          </section>

        </>

      )}

    </div>

  );

};


export default Home;