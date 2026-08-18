import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import API from '../api/axios';

const MyWishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  // ==============================
  // FETCH WISHLIST
  // ==============================

  const fetchWishlist = async () => {
    try {
      setLoading(true);

      const response = await API.get('/wishlist');

      setWishlist(response.data || []);
    } catch (error) {
      console.error(
        'Wishlist fetch error:',
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // ==============================
  // REMOVE FROM WISHLIST
  // ==============================

  const removeFromWishlist = async (productId) => {
    try {
      setRemovingId(productId);

      await API.delete(`/wishlist/${productId}`);

      setWishlist((previous) =>
        previous.filter(
          (product) => product._id !== productId
        )
      );
    } catch (error) {
      console.error(
        'Remove wishlist error:',
        error
      );

      alert(
        error.response?.data?.message ||
          'Failed to remove product'
      );
    } finally {
      setRemovingId(null);
    }
  };

  // ==============================
  // LOADING
  // ==============================

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-slate-500">
          Loading wishlist...
        </p>
      </div>
    );
  }

  // ==============================
  // EMPTY WISHLIST
  // ==============================

  if (wishlist.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="text-6xl mb-4">
          ❤️
        </div>

        <h1 className="text-2xl font-bold text-slate-800">
          My Wishlist
        </h1>

        <p className="text-slate-500 mt-2 text-center">
          You haven't saved any products yet.
        </p>

        <Link
          to="/"
          className="mt-6 bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-700 transition"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  // ==============================
  // WISHLIST
  // ==============================

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">

        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            ❤️ My Wishlist
          </h1>

          <p className="text-slate-500 mt-1">
            {wishlist.length} saved product
            {wishlist.length !== 1 ? 's' : ''}
          </p>
        </div>

        <Link
          to="/"
          className="text-teal-600 font-medium hover:text-teal-700"
        >
          Continue Shopping
        </Link>

      </div>

      {/* PRODUCTS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {wishlist.map((product) => (
          <div
            key={product._id}
            className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
          >

            {/* IMAGE */}

            <Link
              to={`/product/${product._id}`}
            >
              <div className="h-52 bg-slate-100 flex items-center justify-center">

                {product.images?.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-slate-400">
                    No Image
                  </span>
                )}

              </div>
            </Link>

            {/* CONTENT */}

            <div className="p-4">

              {/* CATEGORY */}

              <p className="text-xs text-slate-500 mb-1">
                {product.category}
              </p>

              {/* PRODUCT NAME */}

              <Link
                to={`/product/${product._id}`}
              >
                <h2 className="font-semibold text-slate-800 hover:text-teal-600 line-clamp-2">
                  {product.name}
                </h2>
              </Link>

              {/* PRICE */}

              <div className="mt-3">

                <p className="text-lg font-bold text-slate-900">
                  ₹
                  {Number(
                    product.price || 0
                  ).toLocaleString('en-IN')}
                </p>

                <p className="text-sm text-slate-500">
                  MOQ: {product.moq}
                </p>

              </div>

              {/* ACTIONS */}

              <div className="mt-4 flex gap-2">

                <Link
                  to={`/product/${product._id}`}
                  className="flex-1 text-center bg-teal-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition"
                >
                  View Product
                </Link>

                <button
                  onClick={() =>
                    removeFromWishlist(product._id)
                  }
                  disabled={
                    removingId === product._id
                  }
                  className="px-3 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition disabled:opacity-50"
                >
                  {removingId === product._id
                    ? '...'
                    : '♥'}
                </button>

              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
};

export default MyWishlist;