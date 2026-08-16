import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useCart } from '../context/CartContext';

const marketplaces = ['Flipkart', 'Amazon', 'Myntra', 'Meesho'];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  if (loading) return <p className="p-8 text-slate-500">Loading...</p>;
  if (error) return <p className="p-8 text-red-600">{error}</p>;
  if (!product) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
          <img
            src={product.images?.[0] || 'https://via.placeholder.com/500x500?text=No+Image'}
            alt={product.name}
            className="w-full aspect-square object-cover"
          />
        </div>

        <div>
          <p className="text-xs text-teal-700 font-medium uppercase tracking-wide">{product.category}</p>
          <h1 className="text-2xl font-bold text-slate-800 mt-1">{product.name}</h1>
          <p className="text-2xl font-bold text-slate-900 mt-4">₹{product.price}</p>

          <p className="text-slate-600 mt-4 leading-relaxed">{product.description}</p>

          <p className={`mt-4 text-sm font-medium ${product.stock > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
          </p>

          <div className="mt-5">
            <p className="text-xs text-slate-500 mb-2">Suitable for sellers on</p>
            <div className="flex flex-wrap gap-2">
              {marketplaces.map((name) => (
                <span key={name} className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                  {name}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center border border-slate-300 rounded-lg">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-2 text-slate-600 hover:bg-slate-100"
              >
                −
              </button>
              <span className="px-4">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="px-3 py-2 text-slate-600 hover:bg-slate-100"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;