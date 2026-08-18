import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';

const AdminSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    businessName: '',
    gstNumber: '',
  });

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // ==============================
  // FETCH SUPPLIERS
  // ==============================

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      setError('');

      const { data } = await API.get('/suppliers');

      setSuppliers(data || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to load suppliers'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // ==============================
  // FORM CHANGE
  // ==============================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // ==============================
  // CREATE SUPPLIER
  // ==============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormError('');
    setSuccessMessage('');

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.phone ||
      !formData.businessName
    ) {
      setFormError(
        'Please fill all required fields.'
      );
      return;
    }

    try {
      setFormLoading(true);

      await API.post(
        '/suppliers',
        formData
      );

      setSuccessMessage(
        'Supplier created successfully.'
      );

      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        businessName: '',
        gstNumber: '',
      });

      setShowForm(false);

      fetchSuppliers();
    } catch (err) {
      setFormError(
        err.response?.data?.message ||
          'Failed to create supplier'
      );
    } finally {
      setFormLoading(false);
    }
  };

  // ==============================
  // LOADING
  // ==============================

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <p className="text-slate-500">
          Loading suppliers...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* ==============================
          HEADER
      ============================== */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>
          <p className="text-sm text-teal-600 font-semibold">
            ADMIN MANAGEMENT
          </p>

          <h1 className="text-3xl font-bold text-slate-800 mt-1">
            Suppliers
          </h1>

          <p className="text-slate-500 mt-2">
            Manage all suppliers and their business information.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowForm((current) => !current);
            setFormError('');
            setSuccessMessage('');
          }}
          className="bg-teal-600 text-white px-5 py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors"
        >
          {showForm
            ? 'Close Form'
            : '+ Add Supplier'}
        </button>

      </div>

      {/* ==============================
          SUCCESS MESSAGE
      ============================== */}

      {successMessage && (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg p-4">
          {successMessage}
        </div>
      )}

      {/* ==============================
          ERROR
      ============================== */}

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
          {error}
        </div>
      )}

      {/* ==============================
          ADD SUPPLIER FORM
      ============================== */}

      {showForm && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mb-8">

          <h2 className="text-xl font-bold text-slate-800 mb-6">
            Create New Supplier
          </h2>

          {formError && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
              {formError}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >

            {/* NAME */}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Supplier Name *
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter supplier name"
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-teal-500"
              />
            </div>

            {/* EMAIL */}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email *
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="supplier@example.com"
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-teal-500"
              />
            </div>

            {/* PASSWORD */}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password *
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-teal-500"
              />
            </div>

            {/* PHONE */}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Phone *
              </label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-teal-500"
              />
            </div>

            {/* BUSINESS NAME */}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Business Name *
              </label>

              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                placeholder="Enter business/company name"
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-teal-500"
              />
            </div>

            {/* GST */}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                GST Number
              </label>

              <input
                type="text"
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleChange}
                placeholder="Enter GST number"
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-teal-500"
              />
            </div>

            {/* SUBMIT */}

            <div className="md:col-span-2 flex justify-end">

              <button
                type="submit"
                disabled={formLoading}
                className="bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                {formLoading
                  ? 'Creating...'
                  : 'Create Supplier'}
              </button>

            </div>

          </form>
        </div>
      )}

      {/* ==============================
          SUPPLIER COUNT
      ============================== */}

      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6">
        <p className="text-sm text-slate-500">
          Total Suppliers
        </p>

        <p className="text-3xl font-bold text-slate-800 mt-1">
          {suppliers.length}
        </p>
      </div>

      {/* ==============================
          SUPPLIER LIST
      ============================== */}

      {suppliers.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
          <p className="text-slate-500">
            No suppliers found.
          </p>

          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="mt-4 text-teal-600 font-medium hover:text-teal-700"
          >
            Add your first supplier
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-50 border-b border-slate-200">

                <tr>
                  <th className="text-left px-5 py-4 text-sm font-semibold text-slate-600">
                    Supplier
                  </th>

                  <th className="text-left px-5 py-4 text-sm font-semibold text-slate-600">
                    Business
                  </th>

                  <th className="text-left px-5 py-4 text-sm font-semibold text-slate-600">
                    Contact
                  </th>

                  <th className="text-left px-5 py-4 text-sm font-semibold text-slate-600">
                    Status
                  </th>

                  <th className="text-left px-5 py-4 text-sm font-semibold text-slate-600">
                    Action
                  </th>
                </tr>

              </thead>

              <tbody>

                {suppliers.map((supplier) => (

                  <tr
                    key={supplier._id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >

                    {/* SUPPLIER */}

                    <td className="px-5 py-4">

                      <p className="font-semibold text-slate-800">
                        {supplier.name}
                      </p>

                      <p className="text-sm text-slate-500 mt-1">
                        {supplier.email}
                      </p>

                    </td>

                    {/* BUSINESS */}

                    <td className="px-5 py-4">

                      <p className="text-sm text-slate-700">
                        {supplier.businessName || '-'}
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        GST: {supplier.gstNumber || 'N/A'}
                      </p>

                    </td>

                    {/* CONTACT */}

                    <td className="px-5 py-4">

                      <p className="text-sm text-slate-700">
                        {supplier.phone}
                      </p>

                    </td>

                    {/* STATUS */}

                    <td className="px-5 py-4">

                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          supplier.status === 'active'
                            ? 'bg-emerald-100 text-emerald-700'
                            : supplier.status === 'suspended'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {supplier.status}
                      </span>

                    </td>

                    {/* ACTION */}

                    <td className="px-5 py-4">

                      <Link
                        to={`/admin/suppliers/${supplier._id}`}
                        className="text-teal-600 font-medium text-sm hover:text-teal-700"
                      >
                        View Details
                      </Link>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>
      )}

    </div>
  );
};

export default AdminSuppliers;