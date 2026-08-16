import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api/axios';

const categories = ['Courier Bags', 'Boxes', 'Tapes', 'Labels', 'Paper Shredded', 'Others'];

const AdminProductForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '', description: '', category: 'Courier Bags', price: '', stock: '' });
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      API.get(`/products/${id}`).then(({ data }) => {
        setFormData({ name: data.name, description: data.description, category: data.category, price: data.price, stock: data.stock });
        setImageUrl(data.images?.[0] || '');
      });
    }
  }, [id, isEdit]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const uploadData = new FormData();
    uploadData.append('image', file);
    setUploading(true);
    try {
      const { data } = await API.post('/upload', uploadData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setImageUrl(data.imageUrl);
    } catch (err) {
      setError('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = { ...formData, price: Number(formData.price), stock: Number(formData.stock), images: imageUrl ? [imageUrl] : [] };
      if (isEdit) {
        await API.put(`/products/${id}`, payload);
      } else {
        await API.post('/products', payload);
      }
      navigate('/admin/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent";

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">{isEdit ? 'Edit Product' : 'Add Product'}</h1>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <input type="text" name="name" placeholder="Product Name" required value={formData.name} onChange={handleChange} className={inputClass} />
        <textarea name="description" placeholder="Description" required rows={3} value={formData.description} onChange={handleChange} className={inputClass} />

        <select name="category" value={formData.category} onChange={handleChange} className={inputClass}>
          {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
        </select>

        <div className="grid grid-cols-2 gap-4">
          <input type="number" name="price" placeholder="Price" required min="0" value={formData.price} onChange={handleChange} className={inputClass} />
          <input type="number" name="stock" placeholder="Stock" required min="0" value={formData.stock} onChange={handleChange} className={inputClass} />
        </div>

        <div>
          <label className="block text-sm text-slate-600 mb-2">Product Image</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm" />
          {uploading && <p className="text-sm text-slate-500 mt-2">Uploading...</p>}
          {imageUrl && <img src={imageUrl} alt="Preview" className="w-24 h-24 object-cover rounded-lg mt-2 bg-slate-50" />}
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button type="submit" disabled={saving || uploading} className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition-colors font-medium disabled:bg-slate-300">
          {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
        </button>
      </form>
    </div>
  );
};

export default AdminProductForm;