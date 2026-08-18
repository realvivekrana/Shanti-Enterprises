import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import API from '../api/axios';
import BannerCarousel from '../components/BannerCarousel';
import FAQAccordion from '../components/FAQAccordion';

const marketplaces = [
  { name: 'Flipkart', className: 'text-[#2874f0]' },
  { name: 'Amazon', className: 'text-[#232f3e]' },
  { name: 'Myntra', className: 'text-[#ff3f6c]' },
  { name: 'Meesho', className: 'text-[#970251]' },
];

const exploreCategories = [
  { label: 'Courier Bags', category: 'Courier Bags' },
  { label: 'Boxes', category: 'Boxes' },
  { label: 'Tapes', category: 'Tapes' },
  { label: 'Labels & Stickers', category: 'Labels' },
];

const boxFeatures = [
  {
    title: 'Precision-Engineered Sizes',
    desc: 'Accurate dimensions to keep your products protected and perfectly packed.',
  },
  {
    title: 'Premium Quality Packaging',
    desc: 'Durable, high-strength material that keeps items safe during storage and transit.',
  },
  {
    title: 'Perfect Fit for Every Product',
    desc: 'Multiple box sizes tailored for everything from small accessories to medium goods.',
  },
  {
    title: 'Reliable & Sturdy',
    desc: 'Built to resist pressure, cushioning your products and preventing damage.',
  },
  {
    title: 'Ideal for Shipping',
    desc: 'Lightweight yet robust, optimizing shipping cost while ensuring product safety.',
  },
  {
    title: 'Fast Dispatch Ready',
    desc: 'Compact and crafted for hassle-free logistics and quick doorstep delivery.',
  },
];

const whyChooseUs = [
  { title: 'Fast Delivery', icon: '🚚' },
  { title: 'Premium Quality', icon: '⭐' },
  { title: 'Secure Payment', icon: '🔒' },
  { title: 'Good Support', icon: '💬' },
];

const testimonials = [
  {
    name: 'Verified Buyer',
    text: 'Great quality courier bags, exactly what I needed for my Meesho orders. Fast delivery too.',
  },
  {
    name: 'Verified Buyer',
    text: 'Boxes are sturdy and well-packed. Ordering in bulk for my shop from now on.',
  },
  {
    name: 'Verified Buyer',
    text: 'Good pricing and the tape quality is solid. Will reorder soon.',
  },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchParams, setSearchParams] =
    useSearchParams();

  // ==============================
  // URL FILTERS
  // ==============================

  const activeCategory =
    searchParams.get('category') || '';

  const activeMarketplace =
    searchParams.get('marketplace') || '';

  // ==============================
  // FILTER STATE
  // ==============================

  const [search, setSearch] = useState(
    searchParams.get('search') || ''
  );

  const [brand, setBrand] = useState(
    searchParams.get('brand') || ''
  );

  const [minPrice, setMinPrice] = useState(
    searchParams.get('minPrice') || ''
  );

  const [maxPrice, setMaxPrice] = useState(
    searchParams.get('maxPrice') || ''
  );

  const [minMoq, setMinMoq] = useState(
    searchParams.get('minMoq') || ''
  );

  const [maxMoq, setMaxMoq] = useState(
    searchParams.get('maxMoq') || ''
  );

  const [inStock, setInStock] = useState(
    searchParams.get('inStock') === 'true'
  );

  const [minRating, setMinRating] = useState(
    searchParams.get('minRating') || ''
  );

  const [minGst, setMinGst] = useState(
    searchParams.get('minGst') || ''
  );

  const [maxGst, setMaxGst] = useState(
    searchParams.get('maxGst') || ''
  );

  const [location, setLocation] = useState(
    searchParams.get('location') || ''
  );

  const [maxDeliveryDays, setMaxDeliveryDays] =
    useState(
      searchParams.get('maxDeliveryDays') || ''
    );

  const [sort, setSort] = useState(
    searchParams.get('sort') || 'newest'
  );

  const [showFilters, setShowFilters] =
    useState(false);

  // ==============================
  // FETCH PRODUCTS
  // ==============================

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');

      try {
        const params = new URLSearchParams();

        if (activeCategory) {
          params.append(
            'category',
            activeCategory
          );
        }

        if (activeMarketplace) {
          params.append(
            'search',
            activeMarketplace
          );
        }

        if (search) {
          params.append('search', search);
        }

        if (brand) {
          params.append('brand', brand);
        }

        if (minPrice) {
          params.append(
            'minPrice',
            minPrice
          );
        }

        if (maxPrice) {
          params.append(
            'maxPrice',
            maxPrice
          );
        }

        if (minMoq) {
          params.append('minMoq', minMoq);
        }

        if (maxMoq) {
          params.append('maxMoq', maxMoq);
        }

        if (inStock) {
          params.append(
            'inStock',
            'true'
          );
        }

        if (minRating) {
          params.append(
            'minRating',
            minRating
          );
        }

        if (minGst) {
          params.append(
            'minGst',
            minGst
          );
        }

        if (maxGst) {
          params.append(
            'maxGst',
            maxGst
          );
        }

        if (location) {
          params.append(
            'location',
            location
          );
        }

        if (maxDeliveryDays) {
          params.append(
            'maxDeliveryDays',
            maxDeliveryDays
          );
        }

        if (sort) {
          params.append('sort', sort);
        }

        const { data } =
          await API.get(
            `/products?${params.toString()}`
          );

        setProducts(data);
      } catch (err) {
        console.error(
          'Product fetch error:',
          err
        );

        setError(
          err.response?.data?.message ||
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
    search,
    brand,
    minPrice,
    maxPrice,
    minMoq,
    maxMoq,
    inStock,
    minRating,
    minGst,
    maxGst,
    location,
    maxDeliveryDays,
    sort,
  ]);

  // ==============================
  // MARKETPLACE
  // ==============================

  const handleMarketplaceClick = (
    name
  ) => {
    if (activeMarketplace === name) {
      setSearchParams({});
    } else {
      setSearchParams({
        marketplace: name,
      });
    }
  };

  // ==============================
  // APPLY FILTERS
  // ==============================

  const applyFilters = () => {
    const params = {};

    if (activeCategory) {
      params.category = activeCategory;
    }

    if (activeMarketplace) {
      params.marketplace =
        activeMarketplace;
    }

    if (search.trim()) {
      params.search = search.trim();
    }

    if (brand.trim()) {
      params.brand = brand.trim();
    }

    if (minPrice) {
      params.minPrice = minPrice;
    }

    if (maxPrice) {
      params.maxPrice = maxPrice;
    }

    if (minMoq) {
      params.minMoq = minMoq;
    }

    if (maxMoq) {
      params.maxMoq = maxMoq;
    }

    if (inStock) {
      params.inStock = 'true';
    }

    if (minRating) {
      params.minRating = minRating;
    }

    if (minGst) {
      params.minGst = minGst;
    }

    if (maxGst) {
      params.maxGst = maxGst;
    }

    if (location.trim()) {
      params.location =
        location.trim();
    }

    if (maxDeliveryDays) {
      params.maxDeliveryDays =
        maxDeliveryDays;
    }

    if (sort) {
      params.sort = sort;
    }

    setSearchParams(params);

    setShowFilters(false);
  };

  // ==============================
  // CLEAR FILTERS
  // ==============================

  const clearFilters = () => {
    setSearch('');
    setBrand('');
    setMinPrice('');
    setMaxPrice('');
    setMinMoq('');
    setMaxMoq('');
    setInStock(false);
    setMinRating('');
    setMinGst('');
    setMaxGst('');
    setLocation('');
    setMaxDeliveryDays('');
    setSort('newest');

    setSearchParams({});
  };

  // ==============================
  // FILTER STATUS
  // ==============================

  const isFiltered =
    activeCategory ||
    activeMarketplace ||
    search ||
    brand ||
    minPrice ||
    maxPrice ||
    minMoq ||
    maxMoq ||
    inStock ||
    minRating ||
    minGst ||
    maxGst ||
    location ||
    maxDeliveryDays ||
    sort !== 'newest';

  const heading = activeCategory
    ? activeCategory.replace(
        ',',
        ' & '
      )
    : activeMarketplace
    ? `Products for ${activeMarketplace} sellers`
    : isFiltered
    ? 'Filtered Products'
    : 'Our Products';

  // ==============================
  // PRODUCT SECTIONS
  // ==============================

  const bestSellers =
    products
      .filter(
        (p) => p.isBestSeller
      )
      .slice(0, 8);

  const bestSellerList =
    bestSellers.length > 0
      ? bestSellers
      : products.slice(0, 8);

  const newArrivals =
    [...products]
      .sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      )
      .slice(0, 8);

  // ==============================
  // PRODUCT CARD
  // ==============================

  const ProductCard = ({
    product,
  }) => (
    <Link
      to={`/product/${product._id}`}
      className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-teal-200 transition-all"
    >
      <div className="aspect-square overflow-hidden bg-slate-50">
        <img
          src={
            product.images?.[0] ||
            'https://via.placeholder.com/300x300?text=No+Image'
          }
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="p-4">
        <p className="text-xs text-teal-700 font-medium uppercase tracking-wide">
          {product.category}
        </p>

        <h3 className="font-semibold text-slate-800 mt-1 truncate">
          {product.name}
        </h3>

        <p className="text-lg font-bold text-slate-900 mt-2">
          ₹{product.price}
        </p>

        <div className="flex flex-wrap gap-2 mt-2">
          {product.moq && (
            <span className="text-xs bg-teal-50 text-teal-700 px-2 py-1 rounded">
              MOQ: {product.moq}
            </span>
          )}

          {product.stock > 0 ? (
            <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded">
              In Stock
            </span>
          ) : (
            <span className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded">
              Out of Stock
            </span>
          )}

          {product.averageRating > 0 && (
            <span className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded">
              ⭐ {product.averageRating}
            </span>
          )}
        </div>
      </div>
    </Link>
  );

  return (
    <div>
      <BannerCarousel />

      {/* ==============================
          MARKETPLACE
      ============================== */}

      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-center text-xs text-slate-400 font-medium uppercase tracking-wide mb-5">
            Shop by Marketplace
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
                  className={`bg-slate-50 rounded-xl py-6 flex items-center justify-center text-2xl font-extrabold transition-all border-2 ${className} ${
                    activeMarketplace ===
                    name
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-transparent hover:border-slate-200'
                  }`}
                >
                  {name}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* ==============================
          SEARCH & FILTERS
      ============================== */}

      <section
        id="search-filters"
        className="bg-slate-50 border-b border-slate-200"
      >
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

            {/* SEARCH BAR */}

            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  🔍
                </span>

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  onKeyDown={(e) => {
                    if (
                      e.key === 'Enter'
                    ) {
                      applyFilters();
                    }
                  }}
                  placeholder="Search products, SKU, brand, e.g. T Shirt 200 GSM"
                  className="w-full border border-slate-300 rounded-lg pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowFilters(
                    !showFilters
                  )
                }
                className="px-5 py-3 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50"
              >
                ⚙️ Filters
              </button>

              <button
                type="button"
                onClick={
                  applyFilters
                }
                className="px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700"
              >
                Search
              </button>
            </div>

            {/* FILTER PANEL */}

            {showFilters && (
              <div className="mt-6 pt-6 border-t border-slate-200">

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                  {/* CATEGORY */}

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Category
                    </label>

                    <select
                      value={
                        activeCategory
                      }
                      onChange={(e) => {
                        const value =
                          e.target.value;

                        if (value) {
                          setSearchParams(
                            {
                              category:
                                value,
                            }
                          );
                        } else {
                          setSearchParams(
                            {}
                          );
                        }
                      }}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="">
                        All Categories
                      </option>
                      <option value="Courier Bags">
                        Courier Bags
                      </option>
                      <option value="Boxes">
                        Boxes
                      </option>
                      <option value="Tapes">
                        Tapes
                      </option>
                      <option value="Labels">
                        Labels
                      </option>
                      <option value="Paper Shredded">
                        Paper Shredded
                      </option>
                      <option value="Others">
                        Others
                      </option>
                    </select>
                  </div>

                  {/* BRAND */}

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Brand
                    </label>

                    <input
                      type="text"
                      value={brand}
                      onChange={(e) =>
                        setBrand(
                          e.target.value
                        )
                      }
                      placeholder="Enter brand"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  {/* MIN PRICE */}

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Minimum Price
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={minPrice}
                      onChange={(e) =>
                        setMinPrice(
                          e.target.value
                        )
                      }
                      placeholder="₹ Min"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  {/* MAX PRICE */}

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Maximum Price
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={maxPrice}
                      onChange={(e) =>
                        setMaxPrice(
                          e.target.value
                        )
                      }
                      placeholder="₹ Max"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  {/* MIN MOQ */}

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Minimum MOQ
                    </label>

                    <input
                      type="number"
                      min="1"
                      value={minMoq}
                      onChange={(e) =>
                        setMinMoq(
                          e.target.value
                        )
                      }
                      placeholder="Min MOQ"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  {/* MAX MOQ */}

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Maximum MOQ
                    </label>

                    <input
                      type="number"
                      min="1"
                      value={maxMoq}
                      onChange={(e) =>
                        setMaxMoq(
                          e.target.value
                        )
                      }
                      placeholder="Max MOQ"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  {/* RATING */}

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Minimum Rating
                    </label>

                    <select
                      value={
                        minRating
                      }
                      onChange={(e) =>
                        setMinRating(
                          e.target.value
                        )
                      }
                      className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="">
                        Any Rating
                      </option>
                      <option value="4">
                        ⭐ 4+ Rating
                      </option>
                      <option value="3">
                        ⭐ 3+ Rating
                      </option>
                      <option value="2">
                        ⭐ 2+ Rating
                      </option>
                      <option value="1">
                        ⭐ 1+ Rating
                      </option>
                    </select>
                  </div>

                  {/* SORT */}

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Sort By
                    </label>

                    <select
                      value={sort}
                      onChange={(e) =>
                        setSort(
                          e.target.value
                        )
                      }
                      className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="newest">
                        Newest
                      </option>
                      <option value="price_asc">
                        Price: Low to High
                      </option>
                      <option value="price_desc">
                        Price: High to Low
                      </option>
                      <option value="rating">
                        Highest Rated
                      </option>
                      <option value="moq_asc">
                        Lowest MOQ
                      </option>
                      <option value="stock_desc">
                        Highest Stock
                      </option>
                    </select>
                  </div>

                  {/* MIN GST */}

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Minimum GST %
                    </label>

                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={minGst}
                      onChange={(e) =>
                        setMinGst(
                          e.target.value
                        )
                      }
                      placeholder="GST Min"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  {/* MAX GST */}

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Maximum GST %
                    </label>

                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={maxGst}
                      onChange={(e) =>
                        setMaxGst(
                          e.target.value
                        )
                      }
                      placeholder="GST Max"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  {/* LOCATION */}

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Location
                    </label>

                    <input
                      type="text"
                      value={location}
                      onChange={(e) =>
                        setLocation(
                          e.target.value
                        )
                      }
                      placeholder="e.g. Pune"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  {/* DELIVERY */}

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Delivery Time
                    </label>

                    <select
                      value={
                        maxDeliveryDays
                      }
                      onChange={(e) =>
                        setMaxDeliveryDays(
                          e.target.value
                        )
                      }
                      className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="">
                        Any Delivery Time
                      </option>
                      <option value="1">
                        Within 1 Day
                      </option>
                      <option value="3">
                        Within 3 Days
                      </option>
                      <option value="5">
                        Within 5 Days
                      </option>
                      <option value="7">
                        Within 7 Days
                      </option>
                      <option value="15">
                        Within 15 Days
                      </option>
                    </select>
                  </div>

                  {/* STOCK */}

                  <div className="flex items-center">
                    <label className="flex items-center gap-3 cursor-pointer mt-5">
                      <input
                        type="checkbox"
                        checked={
                          inStock
                        }
                        onChange={(e) =>
                          setInStock(
                            e.target.checked
                          )
                        }
                        className="w-5 h-5 accent-teal-600"
                      />

                      <span className="text-sm font-medium text-slate-700">
                        Show In-Stock Products Only
                      </span>
                    </label>
                  </div>
                </div>

                {/* FILTER BUTTONS */}

                <div className="flex flex-wrap gap-3 mt-6 pt-5 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={
                      applyFilters
                    }
                    className="bg-teal-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-teal-700"
                  >
                    Apply Filters
                  </button>

                  <button
                    type="button"
                    onClick={
                      clearFilters
                    }
                    className="border border-slate-300 text-slate-700 px-6 py-2.5 rounded-lg font-medium hover:bg-slate-50"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ==============================
          PRODUCTS
      ============================== */}

      {isFiltered ? (
        <div
          id="products"
          className="max-w-7xl mx-auto px-4 py-10"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-800">
                {heading}
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                {products.length}{' '}
                product
                {products.length !== 1
                  ? 's'
                  : ''}{' '}
                found
              </p>
            </div>

            <button
              onClick={
                clearFilters
              }
              className="text-sm text-teal-700 hover:underline font-medium"
            >
              Clear all filters
            </button>
          </div>

          {loading && (
            <p className="text-slate-500">
              Loading products...
            </p>
          )}

          {error && (
            <p className="text-red-600">
              {error}
            </p>
          )}

          {!loading &&
            !error &&
            products.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
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
            !error &&
            products.length === 0 && (
              <div className="text-center py-16">
                <p className="text-5xl mb-4">
                  🔍
                </p>

                <h3 className="text-lg font-semibold text-slate-800">
                  No products found
                </h3>

                <p className="text-slate-500 mt-2">
                  Try changing your search or filters.
                </p>

                <button
                  onClick={
                    clearFilters
                  }
                  className="mt-5 bg-teal-600 text-white px-5 py-2.5 rounded-lg hover:bg-teal-700"
                >
                  Clear Filters
                </button>
              </div>
            )}
        </div>
      ) : (
        <>
          {/* ==============================
              BEST SELLER
          ============================== */}

          <div
            id="products"
            className="max-w-7xl mx-auto px-4 py-12"
          >
            <h2 className="text-xl font-semibold text-slate-800 mb-6">
              Best Seller
            </h2>

            {loading && (
              <p className="text-slate-500">
                Loading products...
              </p>
            )}

            {error && (
              <p className="text-red-600">
                {error}
              </p>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
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

            {!loading &&
              products.length ===
                0 && (
                <p className="text-slate-500 text-center py-10">
                  No products yet.
                </p>
              )}
          </div>

          {/* ==============================
              EXPLORE MORE
          ============================== */}

          <div className="bg-slate-50 border-y border-slate-200">
            <div className="max-w-7xl mx-auto px-4 py-12">
              <h2 className="text-xl font-semibold text-slate-800 mb-6">
                Explore More
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {exploreCategories.map(
                  ({
                    label,
                    category,
                  }) => (
                    <button
                      key={label}
                      onClick={() =>
                        setSearchParams(
                          {
                            category,
                          }
                        )
                      }
                      className="bg-white border border-slate-200 rounded-xl py-8 text-center font-medium text-slate-700 hover:border-teal-400 hover:text-teal-700 transition-colors"
                    >
                      {label}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          {/* ==============================
              TOP SHIPPING PACKAGING
          ============================== */}

          <div className="max-w-7xl mx-auto px-4 py-12">
            <h2 className="text-xl font-semibold text-slate-800 mb-2">
              Top Shipping Packaging
            </h2>

            <p className="text-slate-500 text-sm mb-6">
              Experience superior product protection with our best shipping packaging solutions.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  title:
                    'Safe & Smart Packaging',
                  desc:
                    'High-quality packaging ensuring your orders arrive safe and protected.',
                },
                {
                  title:
                    'Weatherproof Poly Mailers',
                  desc:
                    'Strong, lightweight mailers protecting your products from moisture and damage.',
                },
                {
                  title:
                    'Fast & Reliable Delivery',
                  desc:
                    'Quick doorstep delivery with smooth tracking and effortless order confirmation.',
                },
              ].map((item) => (
                <div
                  key={
                    item.title
                  }
                  className="bg-white border border-slate-200 rounded-xl p-6"
                >
                  <h3 className="font-semibold text-slate-800 mb-2">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ==============================
              NEW ARRIVALS
          ============================== */}

          {newArrivals.length >
            0 && (
            <div className="bg-slate-50 border-y border-slate-200">
              <div className="max-w-7xl mx-auto px-4 py-12">
                <h2 className="text-xl font-semibold text-slate-800 mb-6">
                  New Arrivals
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
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
            </div>
          )}

          {/* ==============================
              BOX PRODUCTS
          ============================== */}

          <div className="max-w-7xl mx-auto px-4 py-12">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">
              Box Products
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {boxFeatures.map(
                (feature) => (
                  <div
                    key={
                      feature.title
                    }
                    className="bg-white border border-slate-200 rounded-xl p-6"
                  >
                    <h3 className="font-semibold text-slate-800 mb-2">
                      {
                        feature.title
                      }
                    </h3>

                    <p className="text-sm text-slate-500 leading-relaxed">
                      {
                        feature.desc
                      }
                    </p>
                  </div>
                )
              )}
            </div>
          </div>

          {/* ==============================
              SAVE MORE
          ============================== */}

          <div className="bg-gradient-to-br from-teal-700 to-slate-800 text-white">
            <div className="max-w-7xl mx-auto px-4 py-14 text-center">
              <h2 className="text-2xl font-bold">
                Save More on Bulk Orders
              </h2>

              <p className="text-teal-100 mt-2 max-w-lg mx-auto">
                Buying in bulk? Get better pricing on courier bags, boxes, tapes & labels — contact us for wholesale rates.
              </p>
            </div>
          </div>

          {/* ==============================
              FAQ
          ============================== */}

          <div className="max-w-7xl mx-auto px-4 py-14">
            <h2 className="text-xl font-semibold text-slate-800 mb-6 text-center">
              Frequently Asked Questions
            </h2>

            <FAQAccordion />
          </div>

          {/* ==============================
              TESTIMONIALS
          ============================== */}

          <div className="bg-slate-50 border-y border-slate-200">
            <div className="max-w-7xl mx-auto px-4 py-14">
              <h2 className="text-xl font-semibold text-slate-800 mb-8 text-center">
                What Our Customers Say
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {testimonials.map(
                  (testimonial, index) => (
                    <div
                      key={index}
                      className="bg-white border border-slate-200 rounded-xl p-6"
                    >
                      <p className="text-amber-400 mb-2">
                        ★★★★★
                      </p>

                      <p className="text-sm text-slate-600 leading-relaxed mb-3">
                        "{testimonial.text}"
                      </p>

                      <p className="text-xs text-slate-400 font-medium">
                        {
                          testimonial.name
                        }
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* ==============================
              WHY CHOOSE US
          ============================== */}

          <div className="max-w-7xl mx-auto px-4 py-14">
            <h2 className="text-xl font-semibold text-slate-800 mb-8 text-center">
              Why Choose Shanti Enterprises
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {whyChooseUs.map(
                (item) => (
                  <div
                    key={
                      item.title
                    }
                    className="text-center"
                  >
                    <div className="text-3xl mb-2">
                      {item.icon}
                    </div>

                    <p className="font-medium text-slate-700 text-sm">
                      {item.title}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;