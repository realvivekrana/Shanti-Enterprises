import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api/axios';

const ReturnRequest = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);

  const [reason, setReason] =
    useState('Damaged');

  const [type, setType] =
    useState('return');

  const [description, setDescription] =
    useState('');

  const [selectedItems, setSelectedItems] =
    useState([]);

  const [images, setImages] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState('');

  const [success, setSuccess] =
    useState(false);

  // =====================================================
  // RETURN REASONS
  // =====================================================

  const reasons = [
    'Damaged',
    'Wrong Product',
    'Quantity Mismatch',
    'Defective',
    'Quality Issue',
    'Other',
  ];

  // =====================================================
  // FETCH ORDER
  // =====================================================

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError('');

        const { data } =
          await API.get(
            `/orders/${orderId}`
          );

        const orderData =
          data?.order || data;

        setOrder(orderData);

        // Select all items by default
        const items =
          orderData?.orderItems ||
          [];

        setSelectedItems(
          items.map((item) => ({
            product:
              item.product?._id ||
              item.product,

            returnQuantity:
              item.quantity,
          }))
        );

      } catch (err) {
        setError(
          err.response?.data?.message ||
            'Unable to load order.'
        );
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  // =====================================================
  // ITEM QUANTITY CHANGE
  // =====================================================

  const handleQuantityChange = (
    productId,
    quantity,
    maxQuantity
  ) => {
    const safeQuantity = Math.min(
      Math.max(
        Number(quantity) || 1,
        1
      ),
      maxQuantity
    );

    setSelectedItems((previous) => {
      const exists =
        previous.some(
          (item) =>
            String(item.product) ===
            String(productId)
        );

      if (exists) {
        return previous.map(
          (item) =>
            String(item.product) ===
            String(productId)
              ? {
                  ...item,
                  returnQuantity:
                    safeQuantity,
                }
              : item
        );
      }

      return [
        ...previous,
        {
          product: productId,
          returnQuantity:
            safeQuantity,
        },
      ];
    });
  };

  // =====================================================
  // ITEM SELECTION
  // =====================================================

  const handleItemToggle = (
    productId,
    quantity
  ) => {
    setSelectedItems((previous) => {
      const exists =
        previous.some(
          (item) =>
            String(item.product) ===
            String(productId)
        );

      if (exists) {
        return previous.filter(
          (item) =>
            String(item.product) !==
            String(productId)
        );
      }

      return [
        ...previous,
        {
          product: productId,
          returnQuantity: quantity,
        },
      ];
    });
  };

  // =====================================================
  // IMAGE SELECTION
  // =====================================================

  const handleImageChange = (e) => {
    const files =
      Array.from(
        e.target.files || []
      );

    setImages(files);
  };

  // =====================================================
  // SUBMIT RETURN
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');

    if (
      selectedItems.length === 0
    ) {
      setError(
        'Please select at least one product to return.'
      );

      return;
    }

    if (!description.trim()) {
      setError(
        'Please provide a description.'
      );

      return;
    }

    setSubmitting(true);

    try {
      /*
       * Backend currently accepts
       * evidenceImages as an array.
       *
       * Actual image storage/upload
       * can be connected later.
       */

      const evidenceImages =
        images.map(
          (file) => file.name
        );

      const { data } =
        await API.post(
          `/returns/${orderId}`,
          {
            reason,
            type,
            description,
            items:
              selectedItems,
            evidenceImages,
          }
        );

      console.log(
        'Return request created:',
        data
      );

      setSuccess(true);

    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to submit return request.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">

        <div className="text-center">

          <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-slate-500">
            Loading order...
          </p>

        </div>

      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (!order && error) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-16">

        <div className="max-w-xl mx-auto bg-white border border-red-200 rounded-2xl p-8 text-center">

          <div className="text-4xl">
            ⚠️
          </div>

          <h1 className="text-xl font-bold text-slate-900 mt-4">
            Unable to Load Order
          </h1>

          <p className="text-slate-500 mt-2">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate('/orders')
            }
            className="mt-6 px-5 py-3 bg-teal-600 text-white rounded-lg font-semibold"
          >
            Back to Orders
          </button>

        </div>

      </div>
    );
  }

  // =====================================================
  // SUCCESS
  // =====================================================

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-12">

        <div className="max-w-3xl mx-auto">

          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10">

            <div className="text-center">

              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto">
                ✓
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-5">
                Return Request Submitted
              </h1>

              <p className="text-slate-500 mt-2">
                Your return/refund request has been submitted successfully.
              </p>

            </div>

            {/* ==========================================
                RETURN TIMELINE
            ========================================== */}

            <div className="mt-10">

              <h2 className="text-lg font-bold text-slate-900 mb-6">
                Return Tracking
              </h2>

              <ReturnTimeline
                currentStatus="Requested"
              />

            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">

              <button
                type="button"
                onClick={() =>
                  navigate('/orders')
                }
                className="flex-1 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700"
              >
                My Orders
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate('/notifications')
                }
                className="flex-1 py-3 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50"
              >
                Notifications
              </button>

            </div>

          </div>

        </div>

      </div>
    );
  }

  // =====================================================
  // ORDER ITEMS
  // =====================================================

  const orderItems =
    order?.orderItems || [];

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ================================================
          HEADER
      ================================================ */}

      <div className="bg-white border-b border-slate-200">

        <div className="max-w-4xl mx-auto px-4 py-8">

          <p className="text-sm font-semibold text-teal-600 uppercase tracking-wide">
            Shanti Enterprises
          </p>

          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
            Return & Refund
          </h1>

          <p className="text-slate-500 mt-2">
            Request a return or refund for your delivered order.
          </p>

        </div>

      </div>

      {/* ================================================
          MAIN
      ================================================ */}

      <main className="max-w-4xl mx-auto px-4 py-8">

        {/* ==============================================
            ORDER INFO
        ============================================== */}

        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 mb-6">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div>

              <p className="text-xs text-slate-500 uppercase tracking-wide">
                Order
              </p>

              <p className="font-bold text-slate-900 mt-1 break-all">
                #{order._id}
              </p>

            </div>

            <div>

              <p className="text-xs text-slate-500 uppercase tracking-wide">
                Order Status
              </p>

              <span className="inline-flex mt-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold">
                {order.orderStatus ||
                  order.status ||
                  'Delivered'}
              </span>

            </div>

          </div>

        </div>

        {/* ==============================================
            FORM
        ============================================== */}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* ============================================
              RETURN TYPE
          ============================================ */}

          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">

            <h2 className="text-xl font-bold text-slate-900">
              Request Type
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">

              <label
                className={`border-2 rounded-xl p-4 cursor-pointer ${
                  type === 'return'
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-slate-200'
                }`}
              >

                <input
                  type="radio"
                  name="type"
                  value="return"
                  checked={
                    type === 'return'
                  }
                  onChange={(e) =>
                    setType(
                      e.target.value
                    )
                  }
                  className="mr-3"
                />

                <span className="font-semibold text-slate-800">
                  Return Product
                </span>

                <p className="text-xs text-slate-500 mt-2 ml-6">
                  Send the product back to the supplier.
                </p>

              </label>

              <label
                className={`border-2 rounded-xl p-4 cursor-pointer ${
                  type === 'refund'
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-slate-200'
                }`}
              >

                <input
                  type="radio"
                  name="type"
                  value="refund"
                  checked={
                    type === 'refund'
                  }
                  onChange={(e) =>
                    setType(
                      e.target.value
                    )
                  }
                  className="mr-3"
                />

                <span className="font-semibold text-slate-800">
                  Refund Request
                </span>

                <p className="text-xs text-slate-500 mt-2 ml-6">
                  Request a refund for the eligible order.
                </p>

              </label>

            </div>

          </div>

          {/* ============================================
              PRODUCTS
          ============================================ */}

          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">

            <h2 className="text-xl font-bold text-slate-900">
              Products
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Select the products you want to return.
            </p>

            <div className="mt-5 space-y-4">

              {orderItems.map(
                (item, index) => {

                  const productId =
                    item.product?._id ||
                    item.product;

                  const selected =
                    selectedItems.some(
                      (selectedItem) =>
                        String(
                          selectedItem.product
                        ) ===
                        String(productId)
                    );

                  const selectedItem =
                    selectedItems.find(
                      (selectedItem) =>
                        String(
                          selectedItem.product
                        ) ===
                        String(productId)
                    );

                  return (
                    <div
                      key={
                        productId ||
                        index
                      }
                      className={`border rounded-xl p-4 ${
                        selected
                          ? 'border-teal-400 bg-teal-50'
                          : 'border-slate-200'
                      }`}
                    >

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                        <div className="flex items-start gap-3">

                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() =>
                              handleItemToggle(
                                productId,
                                item.quantity
                              )
                            }
                            className="mt-1 w-4 h-4 accent-teal-600"
                          />

                          <div>

                            <p className="font-semibold text-slate-800">
                              {item.name}
                            </p>

                            <p className="text-sm text-slate-500 mt-1">
                              Ordered Quantity:{' '}
                              {item.quantity}
                            </p>

                            <p className="text-sm text-slate-500">
                              Price: ₹
                              {Number(
                                item.price || 0
                              ).toLocaleString(
                                'en-IN'
                              )}
                            </p>

                          </div>

                        </div>

                        {selected && (

                          <div className="sm:w-40">

                            <label className="text-xs font-semibold text-slate-600">
                              Return Quantity
                            </label>

                            <input
                              type="number"
                              min="1"
                              max={
                                item.quantity
                              }
                              value={
                                selectedItem?.returnQuantity ||
                                1
                              }
                              onChange={(e) =>
                                handleQuantityChange(
                                  productId,
                                  e.target.value,
                                  item.quantity
                                )
                              }
                              className="w-full mt-1 border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />

                          </div>

                        )}

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          </div>

          {/* ============================================
              REASON
          ============================================ */}

          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">

            <h2 className="text-xl font-bold text-slate-900">
              Reason
            </h2>

            <select
              value={reason}
              onChange={(e) =>
                setReason(
                  e.target.value
                )
              }
              className="w-full mt-4 border border-slate-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >

              {reasons.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                )
              )}

            </select>

          </div>

          {/* ============================================
              DESCRIPTION
          ============================================ */}

          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">

            <h2 className="text-xl font-bold text-slate-900">
              Description
            </h2>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              rows="5"
              placeholder="Please explain the problem with the product..."
              className="w-full mt-4 border border-slate-300 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
            />

          </div>

          {/* ============================================
              IMAGE UPLOAD
          ============================================ */}

          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">

            <h2 className="text-xl font-bold text-slate-900">
              Upload Images
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Upload product images as evidence of the issue.
            </p>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={
                handleImageChange
              }
              className="w-full mt-4 border border-slate-300 rounded-xl p-3"
            />

            {images.length > 0 && (

              <div className="mt-4">

                <p className="text-sm font-semibold text-slate-700">
                  Selected Images
                </p>

                <div className="mt-2 space-y-1">

                  {images.map(
                    (file, index) => (
                      <p
                        key={index}
                        className="text-sm text-slate-500"
                      >
                        📷 {file.name}
                      </p>
                    )
                  )}

                </div>

              </div>

            )}

          </div>

          {/* ============================================
              ERROR
          ============================================ */}

          {error && (

            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
              {error}
            </div>

          )}

          {/* ============================================
              SUBMIT
          ============================================ */}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
          >

            {submitting
              ? 'Submitting Request...'
              : 'Submit Return Request'}

          </button>

        </form>

      </main>

    </div>
  );
};

// =====================================================
// RETURN TIMELINE
// =====================================================

const ReturnTimeline = ({
  currentStatus,
}) => {

  const steps = [
    {
      key: 'Requested',
      title: 'Request Submitted',
      description:
        'Your return request has been submitted.',
    },

    {
      key: 'Approved',
      title: 'Approved',
      description:
        'Your return request has been approved.',
    },

    {
      key: 'Pickup Scheduled',
      title: 'Pickup Scheduled',
      description:
        'Pickup has been scheduled for your return.',
    },

    {
      key: 'Received',
      title: 'Product Received',
      description:
        'The returned product has been received.',
    },

    {
      key: 'Refund Pending',
      title: 'Refund Initiated',
      description:
        'Your refund is being processed.',
    },

    {
      key: 'Refunded',
      title: 'Refund Completed',
      description:
        'Your refund has been completed.',
    },
  ];

  const currentIndex =
    steps.findIndex(
      (step) =>
        step.key === currentStatus
    );

  return (
    <div className="space-y-0">

      {steps.map(
        (step, index) => {

          const completed =
            currentIndex >= 0 &&
            index <
              currentIndex;

          const current =
            index === currentIndex;

          const last =
            index ===
            steps.length - 1;

          return (

            <div
              key={step.key}
              className="flex gap-4"
            >

              {/* ======================================
                  TIMELINE
              ====================================== */}

              <div className="flex flex-col items-center">

                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold z-10 ${
                    completed
                      ? 'bg-teal-600 text-white'
                      : current
                      ? 'bg-white border-2 border-teal-600 text-teal-600'
                      : 'bg-white border-2 border-slate-300 text-slate-400'
                  }`}
                >

                  {completed
                    ? '✓'
                    : index + 1}

                </div>

                {!last && (

                  <div
                    className={`w-0.5 h-16 ${
                      completed
                        ? 'bg-teal-500'
                        : 'bg-slate-200'
                    }`}
                  />

                )}

              </div>

              {/* ======================================
                  CONTENT
              ====================================== */}

              <div className="pb-8">

                <div className="flex flex-wrap items-center gap-2">

                  <h3
                    className={`font-bold ${
                      current ||
                      completed
                        ? 'text-slate-900'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.title}
                  </h3>

                  {current && (

                    <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold">
                      Current
                    </span>

                  )}

                </div>

                <p
                  className={`text-sm mt-1 ${
                    current ||
                    completed
                      ? 'text-slate-500'
                      : 'text-slate-400'
                  }`}
                >
                  {step.description}
                </p>

              </div>

            </div>

          );
        }
      )}

    </div>
  );
};

export default ReturnRequest;