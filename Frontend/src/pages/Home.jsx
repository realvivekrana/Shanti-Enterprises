import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await API.get('/products');
        setProducts(data);
      } catch (err) {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-teal-700 to-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h1 className="text-3xl sm:text-4xl font-bold">Shanti Enterprises</h1>
          <p className="text-teal-100 mt-3 max-w-xl">
            Trusted packaging supplies for your e-commerce business — courier bags, boxes, tapes & labels, delivered fast.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-xl font-semibold text-slate-800 mb-6">Our Products</h2>

        {loading && <p className="text-slate-500">Loading products...</p>}
        {error && <p className="text-red-600">{error}</p>}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((product) => (
            <Link
              to={`/product/${product._id}`}
              key={product._id}
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
          ))}
        </div>

        {!loading && products.length === 0 && (
          <p className="text-slate-500 text-center py-16">No products found.</p>
        )}
      </div>
    </div>
  );
};

export default Home;