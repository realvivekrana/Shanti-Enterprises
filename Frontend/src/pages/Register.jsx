import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    businessName: '',
    gstNumber: '',

    businessAddress: {
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
    },

    billingAddress: {
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
    },

    shippingAddress: {
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
    },
  });

  const [sameAddress, setSameAddress] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (section, e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value,
      },
    }));
  };

  const handleSameAddressChange = (e) => {
    const checked = e.target.checked;

    setSameAddress(checked);

    if (checked) {
      setFormData((prev) => ({
        ...prev,
        shippingAddress: {
          ...prev.billingAddress,
        },
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        businessName: formData.businessName,
        gstNumber: formData.gstNumber,

        addresses: {
          business: formData.businessAddress,
          billing: formData.billingAddress,
          shipping: sameAddress
            ? formData.billingAddress
            : formData.shippingAddress,
        },
      };

      const { data } = await API.post('/auth/register', payload);

      localStorage.setItem('userInfo', JSON.stringify(data));

      navigate('/');
      window.location.reload();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent';

  const sectionClass =
    'border border-slate-200 rounded-xl p-5 bg-slate-50';

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">
          Create Business Account
        </h1>

        <p className="text-slate-500 text-sm mb-8">
          Register with your business details to start wholesale shopping.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ==============================
              PERSONAL INFORMATION
          ============================== */}
          <div className={sectionClass}>
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                required
                value={formData.name}
                onChange={handleChange}
                className={inputClass}
              />

              <input
                type="tel"
                name="phone"
                placeholder="Mobile Number"
                required
                value={formData.phone}
                onChange={handleChange}
                className={inputClass}
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                required
                value={formData.email}
                onChange={handleChange}
                className={inputClass}
              />

              <input
                type="password"
                name="password"
                placeholder="Password (min 6 characters)"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          {/* ==============================
              BUSINESS INFORMATION
          ============================== */}
          <div className={sectionClass}>
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Business Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="businessName"
                placeholder="Business / Company Name"
                required
                value={formData.businessName}
                onChange={handleChange}
                className={inputClass}
              />

              <input
                type="text"
                name="gstNumber"
                placeholder="GST Number (Optional)"
                value={formData.gstNumber}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          {/* ==============================
              BUSINESS ADDRESS
          ============================== */}
          <div className={sectionClass}>
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Business Address
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                name="addressLine1"
                placeholder="Address Line 1"
                required
                value={formData.businessAddress.addressLine1}
                onChange={(e) =>
                  handleAddressChange('businessAddress', e)
                }
                className={inputClass}
              />

              <input
                type="text"
                name="addressLine2"
                placeholder="Address Line 2 (Optional)"
                value={formData.businessAddress.addressLine2}
                onChange={(e) =>
                  handleAddressChange('businessAddress', e)
                }
                className={inputClass}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  required
                  value={formData.businessAddress.city}
                  onChange={(e) =>
                    handleAddressChange('businessAddress', e)
                  }
                  className={inputClass}
                />

                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  required
                  value={formData.businessAddress.state}
                  onChange={(e) =>
                    handleAddressChange('businessAddress', e)
                  }
                  className={inputClass}
                />

                <input
                  type="text"
                  name="pincode"
                  placeholder="Pincode"
                  required
                  value={formData.businessAddress.pincode}
                  onChange={(e) =>
                    handleAddressChange('businessAddress', e)
                  }
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* ==============================
              BILLING ADDRESS
          ============================== */}
          <div className={sectionClass}>
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Billing Address
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                name="addressLine1"
                placeholder="Address Line 1"
                required
                value={formData.billingAddress.addressLine1}
                onChange={(e) =>
                  handleAddressChange('billingAddress', e)
                }
                className={inputClass}
              />

              <input
                type="text"
                name="addressLine2"
                placeholder="Address Line 2 (Optional)"
                value={formData.billingAddress.addressLine2}
                onChange={(e) =>
                  handleAddressChange('billingAddress', e)
                }
                className={inputClass}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  required
                  value={formData.billingAddress.city}
                  onChange={(e) =>
                    handleAddressChange('billingAddress', e)
                  }
                  className={inputClass}
                />

                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  required
                  value={formData.billingAddress.state}
                  onChange={(e) =>
                    handleAddressChange('billingAddress', e)
                  }
                  className={inputClass}
                />

                <input
                  type="text"
                  name="pincode"
                  placeholder="Pincode"
                  required
                  value={formData.billingAddress.pincode}
                  onChange={(e) =>
                    handleAddressChange('billingAddress', e)
                  }
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* ==============================
              SHIPPING ADDRESS
          ============================== */}
          <div className={sectionClass}>
            <div className="flex items-center justify-between gap-4 mb-4">
              <h2 className="text-lg font-semibold text-slate-800">
                Shipping Address
              </h2>

              <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sameAddress}
                  onChange={handleSameAddressChange}
                  className="w-4 h-4"
                />
                Same as billing
              </label>
            </div>

            {!sameAddress && (
              <div className="space-y-4">
                <input
                  type="text"
                  name="addressLine1"
                  placeholder="Address Line 1"
                  required={!sameAddress}
                  value={formData.shippingAddress.addressLine1}
                  onChange={(e) =>
                    handleAddressChange('shippingAddress', e)
                  }
                  className={inputClass}
                />

                <input
                  type="text"
                  name="addressLine2"
                  placeholder="Address Line 2 (Optional)"
                  value={formData.shippingAddress.addressLine2}
                  onChange={(e) =>
                    handleAddressChange('shippingAddress', e)
                  }
                  className={inputClass}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    required={!sameAddress}
                    value={formData.shippingAddress.city}
                    onChange={(e) =>
                      handleAddressChange('shippingAddress', e)
                    }
                    className={inputClass}
                  />

                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    required={!sameAddress}
                    value={formData.shippingAddress.state}
                    onChange={(e) =>
                      handleAddressChange('shippingAddress', e)
                    }
                    className={inputClass}
                  />

                  <input
                    type="text"
                    name="pincode"
                    placeholder="Pincode"
                    required={!sameAddress}
                    value={formData.shippingAddress.pincode}
                    onChange={(e) =>
                      handleAddressChange('shippingAddress', e)
                    }
                    className={inputClass}
                  />
                </div>
              </div>
            )}
          </div>

          {/* ERROR */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {/* REGISTER BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition-colors font-medium disabled:bg-slate-300"
          >
            {loading ? 'Creating account...' : 'Create Business Account'}
          </button>
        </form>

        <p className="text-sm text-slate-600 mt-5 text-center">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-teal-700 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;