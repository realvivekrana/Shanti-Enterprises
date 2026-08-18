import {
  useEffect,
  useState,
} from 'react';

import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import API from '../api/axios';

const CreateRFQ = () => {
  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const [product, setProduct] =
    useState(null);

  const [quantity, setQuantity] =
    useState('');

  const [expectedPrice, setExpectedPrice] =
    useState('');

  const [message, setMessage] =
    useState('');

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState('');

  const [success, setSuccess] =
    useState('');

  // ==============================
  // GET PRODUCT
  // ==============================

  useEffect(() => {
    const fetchProduct =
      async () => {
        try {
          const { data } =
            await API.get(
              `/products/${id}`
            );

          setProduct(
            data.data || data
          );
        } catch (err) {
          setError(
            err.response?.data
              ?.message ||
              'Failed to load product'
          );
        } finally {
          setLoading(false);
        }
      };

    fetchProduct();
  }, [id]);

  // ==============================
  // SUBMIT RFQ
  // ==============================

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      setError('');
      setSuccess('');

      const requestedQuantity =
        Number(quantity);

      const moq =
        Number(
          product?.moq || 1
        );

      if (
        !Number.isInteger(
          requestedQuantity
        ) ||
        requestedQuantity < moq
      ) {
        setError(
          `Minimum RFQ quantity is ${moq} pieces.`
        );

        return;
      }

      setSubmitting(true);

      try {
        await API.post(
          '/rfqs',
          {
            product: id,

            quantity:
              requestedQuantity,

            expectedPrice:
              expectedPrice
                ? Number(
                    expectedPrice
                  )
                : null,

            message,
          }
        );

        setSuccess(
          'Your quotation request has been submitted successfully.'
        );

        setTimeout(() => {
          navigate('/my-rfqs');
        }, 1000);
      } catch (err) {
        setError(
          err.response?.data
            ?.message ||
            'Failed to submit RFQ'
        );
      } finally {
        setSubmitting(false);
      }
    };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-red-600">
        Product not found.
      </div>
    );
  }

  const moq =
    Number(
      product.moq || 1
    );

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Request For Quotation
        </h1>

        <p className="text-slate-500 text-sm mt-1">
          Request a special wholesale
          price for large quantities.
        </p>

        {/* PRODUCT */}

        <div className="mt-6 bg-slate-50 rounded-lg p-4">
          <p className="text-xs text-slate-500">
            Product
          </p>

          <p className="font-semibold text-slate-800 mt-1">
            {product.name}
          </p>

          <p className="text-xs text-slate-500 mt-1">
            SKU: {product.sku}
          </p>

          <p className="text-xs text-teal-700 mt-2">
            MOQ: {moq} pieces
          </p>
        </div>

        <form
          onSubmit={
            handleSubmit
          }
          className="mt-6 space-y-5"
        >
          {/* QUANTITY */}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Required Quantity
            </label>

            <input
              type="number"
              min={moq}
              value={quantity}
              onChange={(e) =>
                setQuantity(
                  e.target.value
                )
              }
              placeholder={`Minimum ${moq} pieces`}
              required
              className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
            />

            <p className="text-xs text-slate-500 mt-1">
              Minimum quantity:{' '}
              {moq} pieces
            </p>
          </div>

          {/* EXPECTED PRICE */}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Expected Price Per Piece
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              value={
                expectedPrice
              }
              onChange={(e) =>
                setExpectedPrice(
                  e.target.value
                )
              }
              placeholder="Example: ₹320"
              className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
            />

            <p className="text-xs text-slate-500 mt-1">
              Optional — tell us your
              target price.
            </p>
          </div>

          {/* MESSAGE */}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Message / Requirement
            </label>

            <textarea
              rows="5"
              value={message}
              onChange={(e) =>
                setMessage(
                  e.target.value
                )
              }
              placeholder="Example: Long-term requirement. Need regular monthly supply."
              className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500 resize-none"
            />
          </div>

          {/* ERROR */}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {/* SUCCESS */}

          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg px-4 py-3 text-sm">
              {success}
            </div>
          )}

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={
              submitting
            }
            className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 disabled:bg-slate-300 font-medium"
          >
            {submitting
              ? 'Submitting...'
              : 'Request Best Price'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRFQ;