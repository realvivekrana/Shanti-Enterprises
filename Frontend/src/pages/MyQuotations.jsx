import {
  useEffect,
  useState,
} from 'react';

import API from '../api/axios';

const MyQuotations = () => {
  const [quotations, setQuotations] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [counterPrices, setCounterPrices] =
    useState({});

  const [messages, setMessages] =
    useState({});

  const [submittingId, setSubmittingId] =
    useState(null);

  // ==============================
  // FETCH QUOTATIONS
  // ==============================

  const fetchQuotations =
    async () => {
      try {
        const response =
          await API.get(
            '/quotations/my'
          );

        setQuotations(
          response.data?.data ||
            []
        );
      } catch (err) {
        setError(
          err.response?.data
            ?.message ||
            'Failed to load quotations'
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchQuotations();
  }, []);

  // ==============================
  // COUNTER PRICE CHANGE
  // ==============================

  const handlePriceChange =
    (id, value) => {
      setCounterPrices(
        (previous) => ({
          ...previous,
          [id]: value,
        })
      );
    };

  // ==============================
  // MESSAGE CHANGE
  // ==============================

  const handleMessageChange =
    (id, value) => {
      setMessages(
        (previous) => ({
          ...previous,
          [id]: value,
        })
      );
    };

  // ==============================
  // COUNTER OFFER
  // ==============================

  const handleCounterOffer =
    async (quotation) => {
      const price =
        Number(
          counterPrices[
            quotation._id
          ]
        );

      if (
        !Number.isFinite(price) ||
        price < 0
      ) {
        setError(
          'Please enter a valid counter price.'
        );

        return;
      }

      setSubmittingId(
        quotation._id
      );

      setError('');

      try {
        await API.put(
          `/quotations/${quotation._id}/counter`,
          {
            price,

            message:
              messages[
                quotation._id
              ] || '',
          }
        );

        await fetchQuotations();
      } catch (err) {
        setError(
          err.response?.data
            ?.message ||
            'Failed to submit counter offer'
        );
      } finally {
        setSubmittingId(null);
      }
    };

  // ==============================
  // ACCEPT
  // ==============================

  const handleAccept =
    async (id) => {
      setSubmittingId(id);

      setError('');

      try {
        await API.put(
          `/quotations/${id}/accept`
        );

        await fetchQuotations();
      } catch (err) {
        setError(
          err.response?.data
            ?.message ||
            'Failed to accept quotation'
        );
      } finally {
        setSubmittingId(null);
      }
    };

  // ==============================
  // REJECT
  // ==============================

  const handleReject =
    async (id) => {
      setSubmittingId(id);

      setError('');

      try {
        await API.put(
          `/quotations/${id}/reject`
        );

        await fetchQuotations();
      } catch (err) {
        setError(
          err.response?.data
            ?.message ||
            'Failed to reject quotation'
        );
      } finally {
        setSubmittingId(null);
      }
    };

  // ==============================
  // LOADING
  // ==============================

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        Loading quotations...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">

      <h1 className="text-2xl font-bold text-slate-800">
        My Quotations
      </h1>

      <p className="text-slate-500 mt-1">
        Review offers and negotiate
        your wholesale prices.
      </p>

      {error && (
        <div className="mt-5 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
          {error}
        </div>
      )}

      {quotations.length === 0 ? (
        <div className="mt-8 bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
          No quotations available.
        </div>
      ) : (
        <div className="mt-8 space-y-6">

          {quotations.map(
            (quotation) => {
              const firstProduct =
                quotation.products?.[0];

              const isActive =
                [
                  'offered',
                  'negotiating',
                ].includes(
                  quotation.status
                );

              return (
                <div
                  key={
                    quotation._id
                  }
                  className="bg-white border border-slate-200 rounded-xl p-6"
                >

                  {/* HEADER */}

                  <div className="flex justify-between gap-4">

                    <div>
                      <h2 className="text-lg font-bold text-slate-800">
                        {
                          firstProduct?.productName
                        }
                      </h2>

                      <p className="text-sm text-slate-500 mt-1">
                        Quantity:{' '}
                        {
                          quotation.quantity
                        }{' '}
                        pieces
                      </p>
                    </div>

                    <span className="px-3 py-1 h-fit rounded-full bg-teal-50 text-teal-700 text-xs font-semibold capitalize">
                      {
                        quotation.status
                      }
                    </span>

                  </div>

                  {/* CURRENT OFFER */}

                  <div className="mt-5 bg-teal-50 border border-teal-200 rounded-lg p-5">

                    <p className="text-sm text-teal-800">
                      Current Supplier
                      Offer
                    </p>

                    <p className="text-3xl font-bold text-teal-900 mt-1">
                      ₹
                      {Number(
                        quotation.offeredPrice
                      ).toFixed(2)}

                      <span className="text-sm font-normal">
                        {' / piece'}
                      </span>
                    </p>

                    <p className="text-sm text-teal-800 mt-2">
                      Total: ₹
                      {Number(
                        quotation.totalAmount
                      ).toFixed(2)}
                    </p>

                  </div>

                  {/* EXPIRY */}

                  <p className="text-xs text-slate-500 mt-4">
                    Valid until:{' '}
                    {new Date(
                      quotation.expiryDate
                    ).toLocaleDateString()}
                  </p>

                  {/* NEGOTIATION HISTORY */}

                  {quotation
                    .negotiationHistory
                    ?.length >
                    0 && (
                    <div className="mt-5">

                      <p className="text-sm font-semibold text-slate-700 mb-3">
                        Negotiation History
                      </p>

                      <div className="space-y-2">

                        {quotation.negotiationHistory.map(
                          (
                            offer
                          ) => (
                            <div
                              key={
                                offer._id
                              }
                              className="flex justify-between items-center bg-slate-50 rounded-lg px-4 py-3"
                            >

                              <div>
                                <p className="text-sm font-medium text-slate-700 capitalize">
                                  {
                                    offer.offeredByRole
                                  }
                                </p>

                                {offer.message && (
                                  <p className="text-xs text-slate-500 mt-1">
                                    {
                                      offer.message
                                    }
                                  </p>
                                )}
                              </div>

                              <p className="font-semibold text-slate-800">
                                ₹
                                {Number(
                                  offer.price
                                ).toFixed(
                                  2
                                )}
                              </p>

                            </div>
                          )
                        )}

                      </div>

                    </div>
                  )}

                  {/* ACTIONS */}

                  {isActive && (
                    <div className="mt-6">

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* COUNTER PRICE */}

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Your Counter
                            Offer
                          </label>

                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={
                              counterPrices[
                                quotation
                                  ._id
                              ] ||
                              ''
                            }
                            onChange={(
                              e
                            ) =>
                              handlePriceChange(
                                quotation._id,
                                e
                                  .target
                                  .value
                              )
                            }
                            placeholder="Example: ₹290"
                            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-teal-500"
                          />
                        </div>

                        {/* MESSAGE */}

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Message
                          </label>

                          <input
                            type="text"
                            value={
                              messages[
                                quotation
                                  ._id
                              ] ||
                              ''
                            }
                            onChange={(
                              e
                            ) =>
                              handleMessageChange(
                                quotation._id,
                                e
                                  .target
                                  .value
                              )
                            }
                            placeholder="Example: I can order monthly."
                            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-teal-500"
                          />
                        </div>

                      </div>

                      {/* COUNTER BUTTON */}

                      <button
                        type="button"
                        disabled={
                          submittingId ===
                          quotation._id
                        }
                        onClick={() =>
                          handleCounterOffer(
                            quotation
                          )
                        }
                        className="mt-4 bg-slate-800 text-white px-5 py-2.5 rounded-lg hover:bg-slate-900 disabled:bg-slate-300 text-sm font-medium"
                      >
                        {submittingId ===
                        quotation._id
                          ? 'Submitting...'
                          : 'Send Counter Offer'}
                      </button>

                      {/* FINAL ACTIONS */}

                      <div className="flex gap-3 mt-4">

                        <button
                          type="button"
                          disabled={
                            submittingId ===
                            quotation._id
                          }
                          onClick={() =>
                            handleAccept(
                              quotation._id
                            )
                          }
                          className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg hover:bg-emerald-700 disabled:bg-slate-300 text-sm font-medium"
                        >
                          Accept ₹
                          {Number(
                            quotation.offeredPrice
                          ).toFixed(2)}
                        </button>

                        <button
                          type="button"
                          disabled={
                            submittingId ===
                            quotation._id
                          }
                          onClick={() =>
                            handleReject(
                              quotation._id
                            )
                          }
                          className="border border-red-300 text-red-600 px-5 py-2.5 rounded-lg hover:bg-red-50 disabled:text-slate-300 text-sm font-medium"
                        >
                          Reject
                        </button>

                      </div>

                    </div>
                  )}

                  {/* ACCEPTED */}

                  {quotation.status ===
                    'accepted' && (
                    <div className="mt-5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg p-4 text-sm font-medium">
                      Quotation accepted at ₹
                      {Number(
                        quotation.finalPrice
                      ).toFixed(2)}
                      {' per piece.'}
                    </div>
                  )}

                  {/* REJECTED */}

                  {quotation.status ===
                    'rejected' && (
                    <div className="mt-5 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm font-medium">
                      This quotation has
                      been rejected.
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

export default MyQuotations;