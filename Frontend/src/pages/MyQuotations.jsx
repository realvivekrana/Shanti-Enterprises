import {
  useEffect,
  useState,
} from 'react';

import API from '../api/axios';


// ======================================================
// MY QUOTATIONS / CUSTOMER NEGOTIATION PAGE
// ======================================================

const MyQuotations = () => {

  // ====================================================
  // STATE
  // ====================================================

  const [
    quotations,
    setQuotations,
  ] = useState([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState('');


  const [
    counterPrices,
    setCounterPrices,
  ] = useState({});


  const [
    messages,
    setMessages,
  ] = useState({});


  const [
    submittingId,
    setSubmittingId,
  ] = useState(null);


  // ====================================================
  // FETCH QUOTATIONS
  // ====================================================

  const fetchQuotations =
    async () => {

      try {

        setLoading(true);

        const response =
          await API.get(
            '/quotations/my'
          );


        setQuotations(
          response.data?.data ||
          []
        );

      } catch (err) {

        console.error(
          'Fetch quotations error:',
          err
        );


        setError(
          err.response?.data?.message ||
          'Failed to load quotations'
        );

      } finally {

        setLoading(false);

      }

    };


  // ====================================================
  // INITIAL FETCH
  // ====================================================

  useEffect(() => {

    fetchQuotations();

  }, []);


  // ====================================================
  // FORMAT PRICE
  // ====================================================

  const formatPrice =
    (price) => {

      return Number(
        price || 0
      ).toLocaleString(
        'en-IN',
        {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }
      );

    };


  // ====================================================
  // FORMAT DATE
  // ====================================================

  const formatDate =
    (date) => {

      if (!date) {
        return 'N/A';
      }


      return new Date(
        date
      ).toLocaleDateString(
        'en-IN',
        {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }
      );

    };


  // ====================================================
  // QUOTATION NUMBER
  // ====================================================

  const getQuotationNumber =
    (quotation) => {

      return (
        quotation.quotationNumber ||
        quotation.quoteNumber ||
        quotation.number ||
        `QT${String(
          quotation._id || ''
        ).slice(-4).toUpperCase()}`
      );

    };


  // ====================================================
  // GET PRODUCT
  // ====================================================

  const getProduct =
    (quotation) => {

      return (
        quotation.products?.[0] ||
        quotation.product ||
        {}
      );

    };


  // ====================================================
  // PRODUCT NAME
  // ====================================================

  const getProductName =
    (quotation) => {

      const product =
        getProduct(
          quotation
        );


      return (
        product.productName ||
        product.name ||
        quotation.productName ||
        'Wholesale Product'
      );

    };


  // ====================================================
  // QUANTITY
  // ====================================================

  const getQuantity =
    (quotation) => {

      const product =
        getProduct(
          quotation
        );


      return (
        quotation.quantity ||
        product.quantity ||
        0
      );

    };


  // ====================================================
  // CUSTOMER REQUEST PRICE
  // ====================================================

  const getRequestedPrice =
    (quotation) => {

      return (
        quotation.targetPrice ||
        quotation.requestedPrice ||
        quotation.customerPrice ||
        quotation.yourRequestPrice ||
        0
      );

    };


  // ====================================================
  // SUPPLIER OFFER
  // ====================================================

  const getSupplierOffer =
    (quotation) => {

      return (
        quotation.offeredPrice ||
        quotation.supplierOffer ||
        quotation.supplierPrice ||
        0
      );

    };


  // ====================================================
  // STATUS LABEL
  // ====================================================

  const getStatusLabel =
    (status) => {

      switch (
        String(
          status || ''
        ).toLowerCase()
      ) {

        case 'offered':
          return 'Negotiation';

        case 'negotiating':
          return 'Negotiation';

        case 'accepted':
          return 'Accepted';

        case 'rejected':
          return 'Rejected';

        case 'pending':
          return 'Pending';

        default:
          return status || 'Negotiation';

      }

    };


  // ====================================================
  // STATUS STYLE
  // ====================================================

  const getStatusClass =
    (status) => {

      switch (
        String(
          status || ''
        ).toLowerCase()
      ) {

        case 'accepted':

          return `
            bg-emerald-50
            text-emerald-700
            border-emerald-200
          `;


        case 'rejected':

          return `
            bg-red-50
            text-red-700
            border-red-200
          `;


        case 'pending':

          return `
            bg-amber-50
            text-amber-700
            border-amber-200
          `;


        default:

          return `
            bg-teal-50
            text-teal-700
            border-teal-200
          `;

      }

    };


  // ====================================================
  // COUNTER PRICE CHANGE
  // ====================================================

  const handlePriceChange =
    (
      id,
      value
    ) => {

      setCounterPrices(
        (previous) => ({

          ...previous,

          [id]: value,

        })
      );

    };


  // ====================================================
  // MESSAGE CHANGE
  // ====================================================

  const handleMessageChange =
    (
      id,
      value
    ) => {

      setMessages(
        (previous) => ({

          ...previous,

          [id]: value,

        })
      );

    };


  // ====================================================
  // COUNTER OFFER
  // ====================================================

  const handleCounterOffer =
    async (
      quotation
    ) => {

      const price =
        Number(
          counterPrices[
            quotation._id
          ]
        );


      if (
        !Number.isFinite(
          price
        ) ||
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


        setCounterPrices(
          (previous) => ({

            ...previous,

            [quotation._id]: '',

          })
        );


        setMessages(
          (previous) => ({

            ...previous,

            [quotation._id]: '',

          })
        );


        await fetchQuotations();

      } catch (err) {

        console.error(
          'Counter offer error:',
          err
        );


        setError(
          err.response?.data?.message ||
          'Failed to submit counter offer'
        );

      } finally {

        setSubmittingId(
          null
        );

      }

    };


  // ====================================================
  // ACCEPT OFFER
  // ====================================================

  const handleAccept =
    async (
      id
    ) => {

      setSubmittingId(id);

      setError('');


      try {

        await API.put(
          `/quotations/${id}/accept`
        );


        await fetchQuotations();

      } catch (err) {

        console.error(
          'Accept quotation error:',
          err
        );


        setError(
          err.response?.data?.message ||
          'Failed to accept quotation'
        );

      } finally {

        setSubmittingId(
          null
        );

      }

    };


  // ====================================================
  // REJECT OFFER
  // ====================================================

  const handleReject =
    async (
      id
    ) => {

      setSubmittingId(id);

      setError('');


      try {

        await API.put(
          `/quotations/${id}/reject`
        );


        await fetchQuotations();

      } catch (err) {

        console.error(
          'Reject quotation error:',
          err
        );


        setError(
          err.response?.data?.message ||
          'Failed to reject quotation'
        );

      } finally {

        setSubmittingId(
          null
        );

      }

    };


  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {

    return (

      <div
        className="
          min-h-[70vh]
          bg-slate-50
          flex
          items-center
          justify-center
          px-4
        "
      >

        <div
          className="
            text-center
          "
        >

          <div
            className="
              w-10
              h-10
              mx-auto
              border-4
              border-teal-100
              border-t-teal-600
              rounded-full
              animate-spin
            "
          />

          <p
            className="
              mt-4
              text-sm
              text-slate-500
            "
          >

            Loading quotations...

          </p>

        </div>

      </div>

    );

  }


  // ====================================================
  // MAIN PAGE
  // ====================================================

  return (

    <div
      className="
        min-h-screen
        bg-slate-50
        px-4
        py-8
        sm:py-10
      "
    >

      <div
        className="
          max-w-5xl
          mx-auto
        "
      >

        {/* ==================================================
            PAGE HEADER
        ================================================== */}

        <div>

          <p
            className="
              text-xs
              sm:text-sm
              font-bold
              uppercase
              tracking-wider
              text-teal-600
            "
          >

            Wholesale Negotiation

          </p>


          <h1
            className="
              mt-1
              text-2xl
              sm:text-3xl
              font-extrabold
              text-slate-900
            "
          >

            My Quotations

          </h1>


          <p
            className="
              mt-2
              text-sm
              text-slate-500
            "
          >

            Review supplier offers and
            negotiate your wholesale prices.

          </p>

        </div>


        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (

          <div
            className="
              mt-5
              bg-red-50
              border
              border-red-200
              text-red-700
              rounded-xl
              p-4
              text-sm
            "
          >

            {error}

          </div>

        )}


        {/* ==================================================
            EMPTY STATE
        ================================================== */}

        {quotations.length === 0 ? (

          <div
            className="
              mt-8
              bg-white
              border
              border-slate-200
              rounded-2xl
              p-8
              sm:p-12
              text-center
            "
          >

            <div
              className="
                w-16
                h-16
                mx-auto
                rounded-full
                bg-teal-50
                flex
                items-center
                justify-center
                text-3xl
              "
            >

              🤝

            </div>


            <h2
              className="
                mt-5
                text-xl
                font-bold
                text-slate-800
              "
            >

              No Quotations Available

            </h2>


            <p
              className="
                mt-2
                text-sm
                text-slate-500
              "
            >

              Your supplier quotations will
              appear here.

            </p>

          </div>

        ) : (

          /* ==================================================
             QUOTATION LIST
          ================================================== */

          <div
            className="
              mt-8
              space-y-6
            "
          >

            {quotations.map(
              (
                quotation
              ) => {

                const productName =
                  getProductName(
                    quotation
                  );


                const quantity =
                  getQuantity(
                    quotation
                  );


                const requestedPrice =
                  getRequestedPrice(
                    quotation
                  );


                const supplierOffer =
                  getSupplierOffer(
                    quotation
                  );


                const status =
                  String(
                    quotation.status ||
                    'negotiating'
                  ).toLowerCase();


                const isActive =
                  [
                    'offered',
                    'negotiating',
                  ].includes(
                    status
                  );


                const isSubmitting =
                  submittingId ===
                  quotation._id;


                return (

                  <article
                    key={
                      quotation._id
                    }
                    className="
                      bg-white
                      border
                      border-slate-200
                      rounded-2xl
                      overflow-hidden
                      shadow-sm
                    "
                  >

                    {/* ==================================================
                        QUOTATION HEADER
                    ================================================== */}

                    <div
                      className="
                        px-5
                        sm:px-6
                        py-5
                        border-b
                        border-slate-200
                      "
                    >

                      <div
                        className="
                          flex
                          flex-col
                          sm:flex-row
                          sm:items-center
                          sm:justify-between
                          gap-4
                        "
                      >

                        <div>

                          <p
                            className="
                              text-xs
                              font-bold
                              uppercase
                              tracking-wider
                              text-slate-400
                            "
                          >

                            Quotation

                          </p>


                          <h2
                            className="
                              mt-1
                              text-lg
                              sm:text-xl
                              font-extrabold
                              text-slate-900
                            "
                          >

                            #{getQuotationNumber(
                              quotation
                            )}

                          </h2>

                        </div>


                        <span
                          className={`
                            inline-flex
                            items-center
                            justify-center
                            w-fit
                            px-3
                            py-1.5
                            rounded-full
                            border
                            text-xs
                            font-bold
                            capitalize
                            ${getStatusClass(
                              status
                            )}
                          `}
                        >

                          {getStatusLabel(
                            status
                          )}

                        </span>

                      </div>

                    </div>


                    {/* ==================================================
                        PRODUCT INFO
                    ================================================== */}

                    <div
                      className="
                        px-5
                        sm:px-6
                        py-5
                      "
                    >

                      <div
                        className="
                          flex
                          flex-col
                          sm:flex-row
                          sm:items-center
                          sm:justify-between
                          gap-3
                        "
                      >

                        <div>

                          <p
                            className="
                              text-xs
                              font-semibold
                              uppercase
                              tracking-wide
                              text-slate-400
                            "
                          >

                            Product

                          </p>


                          <h3
                            className="
                              mt-1
                              text-lg
                              font-bold
                              text-slate-800
                            "
                          >

                            {productName}

                          </h3>

                        </div>


                        <div
                          className="
                            sm:text-right
                          "
                        >

                          <p
                            className="
                              text-xs
                              text-slate-400
                            "
                          >

                            Quantity

                          </p>


                          <p
                            className="
                              mt-1
                              font-bold
                              text-slate-800
                            "
                          >

                            {Number(
                              quantity
                            ).toLocaleString(
                              'en-IN'
                            )}

                            {' pieces'}

                          </p>

                        </div>

                      </div>


                      {/* ==================================================
                          PRICE COMPARISON
                      ================================================== */}

                      <div
                        className="
                          mt-6
                          grid
                          grid-cols-1
                          md:grid-cols-2
                          gap-4
                        "
                      >

                        {/* YOUR REQUEST */}

                        <div
                          className="
                            rounded-xl
                            border
                            border-slate-200
                            bg-slate-50
                            p-5
                          "
                        >

                          <p
                            className="
                              text-sm
                              font-semibold
                              text-slate-500
                            "
                          >

                            Your Request

                          </p>


                          <p
                            className="
                              mt-2
                              text-2xl
                              sm:text-3xl
                              font-extrabold
                              text-slate-800
                            "
                          >

                            ₹
                            {formatPrice(
                              requestedPrice
                            )}

                            <span
                              className="
                                ml-1
                                text-sm
                                font-normal
                                text-slate-500
                              "
                            >

                              / piece

                            </span>

                          </p>

                        </div>


                        {/* SUPPLIER OFFER */}

                        <div
                          className="
                            rounded-xl
                            border
                            border-teal-200
                            bg-teal-50
                            p-5
                          "
                        >

                          <p
                            className="
                              text-sm
                              font-semibold
                              text-teal-700
                            "
                          >

                            Supplier Offer

                          </p>


                          <p
                            className="
                              mt-2
                              text-2xl
                              sm:text-3xl
                              font-extrabold
                              text-teal-900
                            "
                          >

                            ₹
                            {formatPrice(
                              supplierOffer
                            )}

                            <span
                              className="
                                ml-1
                                text-sm
                                font-normal
                                text-teal-700
                              "
                            >

                              / piece

                            </span>

                          </p>


                          {quantity > 0 &&
                            supplierOffer > 0 && (

                            <p
                              className="
                                mt-2
                                text-xs
                                text-teal-700
                              "
                            >

                              Total: ₹
                              {formatPrice(
                                Number(
                                  supplierOffer
                                ) *
                                Number(
                                  quantity
                                )
                              )}

                            </p>

                          )}

                        </div>

                      </div>


                      {/* ==================================================
                          EXPIRY
                      ================================================== */}

                      {quotation.expiryDate && (

                        <p
                          className="
                            mt-4
                            text-xs
                            text-slate-500
                          "
                        >

                          Valid until:{' '}

                          <strong
                            className="
                              text-slate-600
                            "
                          >

                            {formatDate(
                              quotation.expiryDate
                            )}

                          </strong>

                        </p>

                      )}


                      {/* ==================================================
                          NEGOTIATION HISTORY
                      ================================================== */}

                      {quotation
                        .negotiationHistory
                        ?.length > 0 && (

                        <div
                          className="
                            mt-6
                            border-t
                            border-slate-200
                            pt-5
                          "
                        >

                          <h3
                            className="
                              text-sm
                              font-bold
                              text-slate-700
                            "
                          >

                            Negotiation History

                          </h3>


                          <div
                            className="
                              mt-3
                              space-y-2
                            "
                          >

                            {quotation
                              .negotiationHistory
                              .map(
                                (
                                  offer,
                                  index
                                ) => (

                                  <div
                                    key={
                                      offer._id ||
                                      index
                                    }
                                    className="
                                      flex
                                      flex-col
                                      sm:flex-row
                                      sm:items-center
                                      sm:justify-between
                                      gap-2
                                      px-4
                                      py-3
                                      rounded-xl
                                      bg-slate-50
                                      border
                                      border-slate-100
                                    "
                                  >

                                    <div>

                                      <p
                                        className="
                                          text-sm
                                          font-semibold
                                          text-slate-700
                                          capitalize
                                        "
                                      >

                                        {offer.offeredByRole ||
                                          'Offer'}

                                      </p>


                                      {offer.message && (

                                        <p
                                          className="
                                            mt-1
                                            text-xs
                                            text-slate-500
                                          "
                                        >

                                          {offer.message}

                                        </p>

                                      )}

                                    </div>


                                    <p
                                      className="
                                        font-bold
                                        text-slate-800
                                      "
                                    >

                                      ₹
                                      {formatPrice(
                                        offer.price
                                      )}

                                      <span
                                        className="
                                          ml-1
                                          text-xs
                                          font-normal
                                          text-slate-400
                                        "
                                      >

                                        / piece

                                      </span>

                                    </p>

                                  </div>

                                )
                            )}

                          </div>

                        </div>

                      )}


                      {/* ==================================================
                          NEGOTIATION ACTIONS
                      ================================================== */}

                      {isActive && (

                        <div
                          className="
                            mt-6
                            border-t
                            border-slate-200
                            pt-6
                          "
                        >

                          <h3
                            className="
                              text-base
                              sm:text-lg
                              font-extrabold
                              text-slate-800
                            "
                          >

                            Negotiate This Offer

                          </h3>


                          <p
                            className="
                              mt-1
                              text-sm
                              text-slate-500
                            "
                          >

                            Accept the supplier's
                            price or send your own
                            counter offer.

                          </p>


                          {/* ==================================================
                              COUNTER OFFER
                          ================================================== */}

                          <div
                            className="
                              mt-5
                              rounded-2xl
                              bg-slate-50
                              border
                              border-slate-200
                              p-4
                              sm:p-5
                            "
                          >

                            <label
                              className="
                                block
                                text-sm
                                font-bold
                                text-slate-700
                              "
                            >

                              Your Counter Price

                            </label>


                            <div
                              className="
                                mt-2
                                relative
                              "
                            >

                              <span
                                className="
                                  absolute
                                  left-3
                                  top-1/2
                                  -translate-y-1/2
                                  font-semibold
                                  text-slate-500
                                "
                              >

                                ₹

                              </span>


                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={
                                  counterPrices[
                                    quotation._id
                                  ] || ''
                                }
                                onChange={(
                                  event
                                ) =>
                                  handlePriceChange(
                                    quotation._id,
                                    event.target.value
                                  )
                                }
                                placeholder="290"
                                className="
                                  w-full
                                  h-12
                                  pl-8
                                  pr-4
                                  rounded-xl
                                  border
                                  border-slate-300
                                  bg-white
                                  text-slate-800
                                  font-semibold
                                  outline-none
                                  focus:border-teal-500
                                  focus:ring-2
                                  focus:ring-teal-100
                                "
                              />

                              <span
                                className="
                                  absolute
                                  right-3
                                  top-1/2
                                  -translate-y-1/2
                                  text-xs
                                  text-slate-400
                                "
                              >

                                / piece

                              </span>

                            </div>


                            {/* MESSAGE */}

                            <label
                              className="
                                block
                                mt-4
                                text-sm
                                font-bold
                                text-slate-700
                              "
                            >

                              Message

                              <span
                                className="
                                  ml-1
                                  text-xs
                                  font-normal
                                  text-slate-400
                                "
                              >

                                (Optional)

                              </span>

                            </label>


                            <textarea
                              rows="3"
                              value={
                                messages[
                                  quotation._id
                                ] || ''
                              }
                              onChange={(
                                event
                              ) =>
                                handleMessageChange(
                                  quotation._id,
                                  event.target.value
                                )
                              }
                              placeholder="Example: I can order monthly at this price."
                              className="
                                mt-2
                                w-full
                                px-4
                                py-3
                                rounded-xl
                                border
                                border-slate-300
                                bg-white
                                text-sm
                                text-slate-800
                                resize-none
                                outline-none
                                focus:border-teal-500
                                focus:ring-2
                                focus:ring-teal-100
                              "
                            />


                            {/* SEND COUNTER */}

                            <button
                              type="button"
                              disabled={
                                isSubmitting
                              }
                              onClick={() =>
                                handleCounterOffer(
                                  quotation
                                )
                              }
                              className="
                                mt-4
                                w-full
                                sm:w-auto
                                px-6
                                h-11
                                rounded-xl
                                bg-slate-900
                                text-white
                                text-sm
                                font-bold
                                hover:bg-slate-800
                                disabled:bg-slate-300
                                disabled:cursor-not-allowed
                                transition
                              "
                            >

                              {isSubmitting
                                ? 'Sending...'
                                : 'Send Counter Offer'}

                            </button>

                          </div>


                          {/* ==================================================
                              FINAL ACTIONS
                          ================================================== */}

                          <div
                            className="
                              mt-4
                              grid
                              grid-cols-1
                              sm:grid-cols-2
                              gap-3
                            "
                          >

                            {/* ACCEPT */}

                            <button
                              type="button"
                              disabled={
                                isSubmitting
                              }
                              onClick={() =>
                                handleAccept(
                                  quotation._id
                                )
                              }
                              className="
                                h-12
                                rounded-xl
                                bg-emerald-600
                                text-white
                                text-sm
                                font-bold
                                hover:bg-emerald-700
                                disabled:bg-slate-300
                                disabled:cursor-not-allowed
                                transition
                              "
                            >

                              {isSubmitting
                                ? 'Processing...'
                                : `Accept Offer ₹${formatPrice(
                                    supplierOffer
                                  )}`}

                            </button>


                            {/* REJECT */}

                            <button
                              type="button"
                              disabled={
                                isSubmitting
                              }
                              onClick={() =>
                                handleReject(
                                  quotation._id
                                )
                              }
                              className="
                                h-12
                                rounded-xl
                                border-2
                                border-red-200
                                text-red-600
                                text-sm
                                font-bold
                                hover:bg-red-50
                                disabled:text-slate-300
                                disabled:border-slate-200
                                disabled:cursor-not-allowed
                                transition
                              "
                            >

                              Reject

                            </button>

                          </div>

                        </div>

                      )}


                      {/* ==================================================
                          ACCEPTED
                      ================================================== */}

                      {status ===
                        'accepted' && (

                        <div
                          className="
                            mt-6
                            p-5
                            rounded-xl
                            bg-emerald-50
                            border
                            border-emerald-200
                          "
                        >

                          <p
                            className="
                              text-sm
                              font-bold
                              text-emerald-800
                            "
                          >

                            ✓ Offer Accepted

                          </p>


                          <p
                            className="
                              mt-1
                              text-sm
                              text-emerald-700
                            "
                          >

                            Final Price:{' '}

                            <strong>

                              ₹
                              {formatPrice(
                                quotation.finalPrice ||
                                supplierOffer
                              )}

                            </strong>

                            {' / piece'}

                          </p>

                        </div>

                      )}


                      {/* ==================================================
                          REJECTED
                      ================================================== */}

                      {status ===
                        'rejected' && (

                        <div
                          className="
                            mt-6
                            p-5
                            rounded-xl
                            bg-red-50
                            border
                            border-red-200
                          "
                        >

                          <p
                            className="
                              text-sm
                              font-bold
                              text-red-800
                            "
                          >

                            ✕ Quotation Rejected

                          </p>


                          <p
                            className="
                              mt-1
                              text-sm
                              text-red-700
                            "
                          >

                            This quotation is no
                            longer available for
                            negotiation.

                          </p>

                        </div>

                      )}

                    </div>

                  </article>

                );

              }
            )}

          </div>

        )}

      </div>

    </div>

  );

};


export default MyQuotations;