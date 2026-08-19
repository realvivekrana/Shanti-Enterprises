import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../api/axios';

const AdminRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    adminCode: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      const { data } = await API.post(
        '/auth/admin/register',
        formData
      );

      localStorage.setItem(
        'userInfo',
        JSON.stringify(data)
      );

      navigate('/admin/dashboard');

      window.location.reload();

    } catch (err) {
      console.error(
        'Admin registration error:',
        err
      );

      setError(
        err.response?.data?.message ||
        'Admin registration failed'
      );

    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500';

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-950">

      <div className="w-full max-w-md">

        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">

          <div className="text-center mb-7">

            <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-900 text-white flex items-center justify-center text-3xl mb-4">
              🏢
            </div>

            <h1 className="text-2xl font-extrabold text-slate-900">
              Create Admin Account
            </h1>

            <p className="text-sm text-slate-500 mt-2">
              Shanti Enterprises Administration
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Name
              </label>

              <input
                type="text"
                name="name"
                placeholder="Enter admin name"
                value={formData.name}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Email
              </label>

              <input
                type="email"
                name="email"
                placeholder="Enter admin email"
                value={formData.email}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Password
              </label>

              <input
                type="password"
                name="password"
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Admin Registration Code
              </label>

              <input
                type="password"
                name="adminCode"
                placeholder="Enter admin code"
                value={formData.adminCode}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                bg-slate-900
                hover:bg-slate-800
                disabled:bg-slate-300
                text-white
                font-semibold
                py-3
                rounded-lg
              "
            >
              {loading
                ? 'Creating Admin...'
                : 'Create Admin Account'}
            </button>

          </form>

          <div className="mt-6 pt-5 border-t text-center">

            <p className="text-sm text-slate-500">
              Already an admin?
            </p>

            <Link
              to="/admin/login"
              className="inline-block mt-2 text-sm font-semibold text-teal-700 hover:underline"
            >
              Admin Login
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminRegister;