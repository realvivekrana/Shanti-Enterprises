import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await API.delete(`/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  if (loading) return <p className="p-8 text-slate-500">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Manage Products</h1>
        <Link to="/admin/products/new" className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors font-medium text-sm">
          + Add Product
        </Link>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs text-slate-500 uppercase tracking-wide">
              <th className="py-3 px-4">Image</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Stock</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-b border-slate-100 last:border-0">
                <td className="py-3 px-4">
                  <img src={product.images?.[0] || 'https://via.placeholder.com/50x50?text=No+Img'} alt={product.name} className="w-12 h-12 object-cover rounded-lg bg-slate-50" />
                </td>
                <td className="py-3 px-4 font-medium text-slate-800">{product.name}</td>
                <td className="py-3 px-4 text-slate-500">{product.category}</td>
                <td className="py-3 px-4 text-slate-800">₹{product.price}</td>
                <td className="py-3 px-4 text-slate-500">{product.stock}</td>
                <td className="py-3 px-4">
                  <Link to={`/admin/products/${product._id}/edit`} className="text-teal-700 hover:underline mr-4 font-medium">Edit</Link>
                  <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:underline font-medium">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {products.length === 0 && <p className="text-slate-500 text-center py-16">No products yet.</p>}
    </div>
  );
};

export default AdminProducts;