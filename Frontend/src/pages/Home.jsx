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
  { title: 'Precision-Engineered Sizes', desc: 'Accurate dimensions to keep your products protected and perfectly packed.' },
  { title: 'Premium Quality Packaging', desc: 'Durable, high-strength material that keeps items safe during storage and transit.' },
  { title: 'Perfect Fit for Every Product', desc: 'Multiple box sizes tailored for everything from small accessories to medium goods.' },
  { title: 'Reliable & Sturdy', desc: 'Built to resist pressure, cushioning your products and preventing damage.' },
  { title: 'Ideal for Shipping', desc: 'Lightweight yet robust, optimizing shipping cost while ensuring product safety.' },
  { title: 'Fast Dispatch Ready', desc: 'Compact and crafted for hassle-free logistics and quick doorstep delivery.' },
];

const whyChooseUs = [
  { title: 'Fast Delivery', icon: '🚚' },
  { title: 'Premium Quality', icon: '⭐' },
  { title: 'Secure Payment', icon: '🔒' },
  { title: 'Good Support', icon: '💬' },
];

const testimonials = [
  { name: 'Verified Buyer', text: 'Great quality courier bags, exactly what I needed for my Meesho orders. Fast delivery too.' },
  { name: 'Verified Buyer', text: 'Boxes are sturdy and well-packed. Ordering in bulk for my shop from now on.' },
  { name: 'Verified Buyer', text: 'Good pricing and the tape quality is solid. Will reorder soon.' },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || '';
  const activeMarketplace = searchParams.get('marketplace') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (activeCategory) params.append('category', activeCategory);
        if (activeMarketplace) params.append('search', activeMarketplace);

        const { data } = await API.get(`/products?${params.toString()}`);
        setProducts(data);
      } catch (err) {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory, activeMarketplace]);

  const handleMarketplaceClick = (name) => {
    if (activeMarketplace === name) setSearchParams({});
    else setSearchParams({ marketplace: name });
  };

  const isFiltered = activeCategory || activeMarketplace;
  const heading = activeCategory
    ? activeCategory.replace(',', ' & ')
    : activeMarketplace
    ? `Products for ${activeMarketplace} sellers`
    : 'Our Products';

  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 8);
  const bestSellerList = bestSellers.length > 0 ? bestSellers : products.slice(0, 8);

  const newArrivals = [...products]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8);

  const ProductCard = ({ product }) => (
    <Link
      to={`/product/${product._id}`}
      className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-teal-200 transition-all"
    >
      <div className="aspect-square overflow-hidden bg-slate-50">
        <img
          src={product.images?.[0] || 'https://via.placeholder.com/300x300?text=No+Image'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <p className="text-xs text-teal-700 font-medium uppercase tracking-wide">{product.category}</p>
        <h3 className="font-semibold text-slate-800 mt-1 truncate">{product.name}</h3>
        <p className="text-lg font-bold text-slate-900 mt-2">₹{product.price}</p>
      </div>
    </Link>
  );

  return (
    <div>
      <BannerCarousel />

      {/* Marketplace strip */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-center text-xs text-slate-400 font-medium uppercase tracking-wide mb-5">
            Shop by Marketplace
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {marketplaces.map(({ name, className }) => (
              <button
                key={name}
                onClick={() => handleMarketplaceClick(name)}
                className={`bg-slate-50 rounded-xl py-6 flex items-center justify-center text-2xl font-extrabold transition-all border-2 ${className} ${
                  activeMarketplace === name ? 'border-teal-500 bg-teal-50' : 'border-transparent hover:border-slate-200'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* If filtered, show filtered results and stop here */}
      {isFiltered ? (
        <div id="products" className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-800">{heading}</h2>
            <button onClick={() => setSearchParams({})} className="text-sm text-teal-700 hover:underline font-medium">
              Clear filter
            </button>
          </div>

          {loading && <p className="text-slate-500">Loading products...</p>}
          {error && <p className="text-red-600">{error}</p>}

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product) => <ProductCard key={product._id} product={product} />)}
          </div>

          {!loading && products.length === 0 && (
            <p className="text-slate-500 text-center py-16">No products found for this filter.</p>
          )}
        </div>
      ) : (
        <>
          {/* Best Seller */}
          <div id="products" className="max-w-7xl mx-auto px-4 py-12">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">Best Seller</h2>
            {loading && <p className="text-slate-500">Loading products...</p>}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {bestSellerList.map((product) => <ProductCard key={product._id} product={product} />)}
            </div>
            {!loading && products.length === 0 && (
              <p className="text-slate-500 text-center py-10">No products yet.</p>
            )}
          </div>

          {/* Explore More */}
          <div className="bg-slate-50 border-y border-slate-200">
            <div className="max-w-7xl mx-auto px-4 py-12">
              <h2 className="text-xl font-semibold text-slate-800 mb-6">Explore More</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {exploreCategories.map(({ label, category }) => (
                  <button
                    key={label}
                    onClick={() => setSearchParams({ category })}
                    className="bg-white border border-slate-200 rounded-xl py-8 text-center font-medium text-slate-700 hover:border-teal-400 hover:text-teal-700 transition-colors"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Top Shipping Packaging */}
          <div className="max-w-7xl mx-auto px-4 py-12">
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Top Shipping Packaging</h2>
            <p className="text-slate-500 text-sm mb-6">
              Experience superior product protection with our best shipping packaging solutions.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { title: 'Safe & Smart Packaging', desc: 'High-quality packaging ensuring your orders arrive safe and protected.' },
                { title: 'Weatherproof Poly Mailers', desc: 'Strong, lightweight mailers protecting your products from moisture and damage.' },
                { title: 'Fast & Reliable Delivery', desc: 'Quick doorstep delivery with smooth tracking and effortless order confirmation.' },
              ].map((item) => (
                <div key={item.title} className="bg-white border border-slate-200 rounded-xl p-6">
                  <h3 className="font-semibold text-slate-800 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* New Arrivals */}
          {newArrivals.length > 0 && (
            <div className="bg-slate-50 border-y border-slate-200">
              <div className="max-w-7xl mx-auto px-4 py-12">
                <h2 className="text-xl font-semibold text-slate-800 mb-6">New Arrivals</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                  {newArrivals.map((product) => <ProductCard key={product._id} product={product} />)}
                </div>
              </div>
            </div>
          )}

          {/* Box Products */}
          <div className="max-w-7xl mx-auto px-4 py-12">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">Box Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {boxFeatures.map((f) => (
                <div key={f.title} className="bg-white border border-slate-200 rounded-xl p-6">
                  <h3 className="font-semibold text-slate-800 mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Save More */}
          <div className="bg-gradient-to-br from-teal-700 to-slate-800 text-white">
            <div className="max-w-7xl mx-auto px-4 py-14 text-center">
              <h2 className="text-2xl font-bold">Save More on Bulk Orders</h2>
              <p className="text-teal-100 mt-2 max-w-lg mx-auto">
                Buying in bulk? Get better pricing on courier bags, boxes, tapes & labels — contact us for wholesale rates.
              </p>
            </div>
          </div>

          {/* FAQ */}
          <div className="max-w-7xl mx-auto px-4 py-14">
            <h2 className="text-xl font-semibold text-slate-800 mb-6 text-center">Frequently Asked Questions</h2>
            <FAQAccordion />
          </div>

          {/* Testimonials */}
          <div className="bg-slate-50 border-y border-slate-200">
            <div className="max-w-7xl mx-auto px-4 py-14">
              <h2 className="text-xl font-semibold text-slate-800 mb-8 text-center">What Our Customers Say</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {testimonials.map((t, i) => (
                  <div key={i} className="bg-white border border-slate-200 rounded-xl p-6">
                    <p className="text-amber-400 mb-2">★★★★★</p>
                    <p className="text-sm text-slate-600 leading-relaxed mb-3">"{t.text}"</p>
                    <p className="text-xs text-slate-400 font-medium">{t.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="max-w-7xl mx-auto px-4 py-14">
            <h2 className="text-xl font-semibold text-slate-800 mb-8 text-center">Why Choose Shanti Enterprises</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {whyChooseUs.map((item) => (
                <div key={item.title} className="text-center">
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <p className="font-medium text-slate-700 text-sm">{item.title}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;