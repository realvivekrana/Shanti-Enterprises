import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', formData);
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/');
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent";

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="bg-white border border-slate-200 rounded-xl p-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Create account</h1>
        <p className="text-slate-500 text-sm mb-6">Join Shanti Enterprises today</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Full Name" required value={formData.name} onChange={handleChange} className={inputClass} />
          <input type="email" name="email" placeholder="Email" required value={formData.email} onChange={handleChange} className={inputClass} />
          <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className={inputClass} />
          <input type="password" name="password" placeholder="Password (min 6 characters)" required minLength={6} value={formData.password} onChange={handleChange} className={inputClass} />

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button type="submit" disabled={loading} className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition-colors font-medium disabled:bg-slate-300">
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="text-sm text-slate-600 mt-5 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-teal-700 font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;