import {
  useEffect,
  useState,
} from 'react';

import API from '../api/axios';

const MyRFQs = () => {
  const [rfqs, setRFQs] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const fetchRFQs =
    async () => {
      try {
        const { data } =
          await API.get(
            '/rfqs/my'
          );

        setRFQs(
          data.data || []
        );
      } catch (err) {
        setError(
          err.response?.data
            ?.message ||
            'Failed to load RFQs'
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchRFQs();
  }, []);

  // ==============================
  // ACCEPT
  // ==============================

  const handleAccept =
    async (id) => {
      try {
        await API.put(
          `/rfqs/${id}/accept`
        );

        fetchRFQs();
      } catch (err) {
        setError(
          err.response?.data
            ?.message ||
            'Failed to accept quotation'
        );
      }
    };

  // ==============================
  // REJECT
  // ==============================

  const handleReject =
    async (id) => {
      try {
        await API.put(
          `/rfqs/${id}/reject`
        );

        fetchRFQs();
      } catch (err) {
        setError(
          err.response?.data
            ?.message ||
            'Failed to reject quotation'
        );
      }
    };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        Loading RFQs...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-800">
        My RFQs
      </h1>

      <p className="text-slate-500 mt-1">
        Track your quotation requests
        and admin offers.
      </p>

      {error && (
        <div className="mt-5 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
          {error}
        </div>
      )}

      {rfqs.length === 0 ? (
        <div className="mt-8 bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
          You have not submitted any
          RFQ yet.
        </div>
      ) : (
        <div className="mt-8 space-y-5">
          {rfqs.map(
            (rfq) => {
              const item =
                rfq.items?.[0];

              const statusClasses = {
                pending:
                  'bg-amber-50 text-amber-700',
                quoted:
                  'bg-blue-50 text-blue-700',
                accepted:
                  'bg-emerald-50 text-emerald-700',
                rejected:
                  'bg-red-50 text-red-700',
                expired:
                  'bg-slate-100 text-slate-600',
                cancelled:
                  'bg-slate-100 text-slate-600',
              };

              return (
                <div
                  key={
                    rfq._id
                  }
                  className="bg-white border border-slate-200 rounded-xl p-6"
                >
                  <div className="flex justify-between gap-4">
                    <div>
                      <h2 className="font-semibold text-lg text-slate-800">
                        {
                          item?.productName
                        }
                      </h2>

                      <p className="text-sm text-slate-500 mt-1">
                        Quantity:{' '}
                        {
                          item?.quantity
                        }{' '}
                        pieces
                      </p>

                      {item?.expectedPrice !==
                        null &&
                        item?.expectedPrice !==
                          undefined && (
                          <p className="text-sm text-slate-500">
                            Expected Price: ₹
                            {Number(
                              item.expectedPrice
                            ).toFixed(
                              2
                            )}
                            {' / piece'}
                          </p>
                        )}
                    </div>

                    <span
                      className={`h-fit px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                        statusClasses[
                          rfq.status
                        ] ||
                        'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {
                        rfq.status
                      }
                    </span>
                  </div>

                  {/* CUSTOMER MESSAGE */}

                  {rfq.message && (
                    <div className="mt-4 bg-slate-50 rounded-lg p-4">
                      <p className="text-xs text-slate-500">
                        Your Requirement
                      </p>

                      <p className="text-sm text-slate-700 mt-1">
                        {
                          rfq.message
                        }
                      </p>
                    </div>
                  )}

                  {/* ADMIN QUOTE */}

                  {rfq.status ===
                    'quoted' ||
                  rfq.status ===
                    'accepted' ||
                  rfq.status ===
                    'rejected' ? (
                    <div className="mt-4 bg-teal-50 border border-teal-200 rounded-lg p-4">
                      <p className="text-sm font-semibold text-teal-900">
                        Admin Quotation
                      </p>

                      <p className="text-2xl font-bold text-teal-900 mt-2">
                        ₹
                        {Number(
                          item?.quotedPrice ||
                            0
                        ).toFixed(
                          2
                        )}
                        <span className="text-sm font-normal">
                          {' / piece'}
                        </span>
                      </p>

                      <p className="text-sm text-teal-800 mt-1">
                        Total: ₹
                        {Number(
                          rfq.quotedTotal ||
                            0
                        ).toFixed(
                          2
                        )}
                      </p>

                      {rfq.adminMessage && (
                        <p className="text-sm text-teal-800 mt-3">
                          {
                            rfq.adminMessage
                          }
                        </p>
                      )}

                      {rfq.quotationValidUntil && (
                        <p className="text-xs text-teal-700 mt-3">
                          Valid until:{' '}
                          {new Date(
                            rfq.quotationValidUntil
                          ).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ) : null}

                  {/* ACTIONS */}

                  {rfq.status ===
                    'quoted' && (
                    <div className="flex gap-3 mt-5">
                      <button
                        type="button"
                        onClick={() =>
                          handleAccept(
                            rfq._id
                          )
                        }
                        className="bg-emerald-600 text-white px-5 py-2 rounded-lg hover:bg-emerald-700 text-sm font-medium"
                      >
                        Accept Quote
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleReject(
                            rfq._id
                          )
                        }
                        className="bg-white border border-red-300 text-red-600 px-5 py-2 rounded-lg hover:bg-red-50 text-sm font-medium"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {rfq.status ===
                    'accepted' && (
                    <div className="mt-5 bg-emerald-50 text-emerald-700 rounded-lg px-4 py-3 text-sm font-medium">
                      Quotation accepted.
                    </div>
                  )}

                  {rfq.status ===
                    'rejected' && (
                    <div className="mt-5 bg-red-50 text-red-700 rounded-lg px-4 py-3 text-sm font-medium">
                      Quotation rejected.
                    </div>
                  )}
                </div>
              );
            }
          )}
        </div>
      )}
    </div>
  );
};

export default MyRFQs;