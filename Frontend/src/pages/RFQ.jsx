import {
  useEffect,
  useState,
} from 'react';

import {
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

import API from '../api/axios';


// ======================================================
// REQUEST FOR QUOTATION
// ======================================================

const RFQ = () => {

  const navigate =
    useNavigate();

  const [
    searchParams,
  ] = useSearchParams();


  // ====================================================
  // STATE
  // ====================================================

  const [
    products,
    setProducts,
  ] = useState([]);


  const [
    product,
    setProduct,
  ] = useState(
    searchParams.get('product') || ''
  );


  const [
    quantity,
    setQuantity,
  ] = useState('');


  const [
    targetPrice,
    setTargetPrice,
  ] = useState('');


  const [
    deliveryDate,
    setDeliveryDate,
  ] = useState('');


  const [
    message,
    setMessage,
  ] = useState('');


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    submitting,
    setSubmitting,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState('');


  const [
    success,
    setSuccess,
  ] = useState('');


  // ====================================================
  // FETCH PRODUCTS
  // ====================================================

  useEffect(() => {

    const fetchProducts =
      async () => {

        try {

          setLoading(true);

          const response =
            await API.get(
              '/products'
            );


          const data =
            response.data?.data ||
            response.data;


          const productList =
            Array.isArray(data)
              ? data
              : Array.isArray(
                  data?.products
                )
                ? data.products
                : [];


          setProducts(
            productList
          );

        } catch (err) {

          console.error(
            'RFQ products error:',
            err
          );

          setError(
            'Unable to load products.'
          );

        } finally {

          setLoading(false);

        }

      };


    fetchProducts();

  }, []);


  // ====================================================
  // SUBMIT RFQ
  // ====================================================

  const handleSubmit =
    async (event) => {

      event.preventDefault();


      setError('');
      setSuccess('');


      // -----------------------------------------------
      // VALIDATION
      // -----------------------------------------------

      if (!product) {

        setError(
          'Please select a product.'
        );

        return;

      }


      if (
        !quantity ||
        Number(quantity) <= 0
      ) {

        setError(
          'Please enter a valid quantity.'
        );

        return;

      }


      if (
        !targetPrice ||
        Number(targetPrice) <= 0
      ) {

        setError(
          'Please enter your target price.'
        );

        return;

      }


      if (!deliveryDate) {

        setError(
          'Please select expected delivery date.'
        );

        return;

      }


      try {

        setSubmitting(true);


        // ---------------------------------------------
        // RFQ DATA
        // ---------------------------------------------

        const payload = {

          product,

          quantity:
            Number(quantity),

          targetPrice:
            Number(targetPrice),

          expectedDelivery:
            deliveryDate,

          message:
            message.trim(),

        };


        // ---------------------------------------------
        // CREATE RFQ
        // ---------------------------------------------

        await API.post(
          '/rfq',
          payload
        );


        setSuccess(
          'RFQ submitted successfully.'
        );


        // ---------------------------------------------
        // RESET
        // ---------------------------------------------

        setQuantity('');
        setTargetPrice('');
        setDeliveryDate('');
        setMessage('');


        // ---------------------------------------------
        // REDIRECT
        // ---------------------------------------------

        setTimeout(() => {

          navigate(
            '/my-rfqs'
          );

        }, 1000);

      } catch (err) {

        console.error(
          'RFQ submit error:',
          err
        );


        setError(
          err.response?.data?.message ||
          'Unable to submit RFQ. Please try again.'
        );

      } finally {

        setSubmitting(false);

      }

    };


  // ====================================================
  // PAGE
  // ====================================================

  return (

    <div
      className="
        min-h-screen
        bg-slate-50
        px-4
        py-8
        sm:py-12
      "
    >

      <div
        className="
          max-w-2xl
          mx-auto
        "
      >

        {/* ==================================================
            HEADER
        ================================================== */}

        <div
          className="
            text-center
            mb-7
          "
        >

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

            Wholesale

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

            Request For Quotation

          </h1>


          <p
            className="
              mt-2
              text-sm
              text-slate-500
            "
          >

            Tell us your requirements and
            get the best wholesale quotation.

          </p>

        </div>


        {/* ==================================================
            FORM CARD
        ================================================== */}

        <div
          className="
            bg-white
            border
            border-slate-200
            rounded-2xl
            shadow-sm
            p-5
            sm:p-7
          "
        >

          {/* ==================================================
              ERROR
          ================================================== */}

          {error && (

            <div
              className="
                mb-5
                px-4
                py-3
                rounded-xl
                bg-red-50
                border
                border-red-200
                text-red-700
                text-sm
              "
            >

              {error}

            </div>

          )}


          {/* ==================================================
              SUCCESS
          ================================================== */}

          {success && (

            <div
              className="
                mb-5
                px-4
                py-3
                rounded-xl
                bg-emerald-50
                border
                border-emerald-200
                text-emerald-700
                text-sm
              "
            >

              {success}

            </div>

          )}


          <form
            onSubmit={
              handleSubmit
            }
            className="
              space-y-5
            "
          >

            {/* ==================================================
                PRODUCT
            ================================================== */}

            <div>

              <label
                className="
                  block
                  mb-2
                  text-sm
                  font-semibold
                  text-slate-700
                "
              >

                Product

              </label>


              <select
                value={
                  product
                }
                onChange={(event) =>
                  setProduct(
                    event.target.value
                  )
                }
                disabled={
                  loading
                }
                className="
                  w-full
                  h-11
                  px-3
                  rounded-xl
                  border
                  border-slate-300
                  bg-white
                  text-sm
                  text-slate-800
                  outline-none
                  focus:border-teal-500
                  focus:ring-2
                  focus:ring-teal-100
                "
              >

                <option value="">

                  {loading
                    ? 'Loading products...'
                    : 'Select Product'}

                </option>


                {products.map(
                  (item) => (

                    <option
                      key={
                        item._id
                      }
                      value={
                        item._id
                      }
                    >

                      {item.name}

                    </option>

                  )
                )}

              </select>

            </div>


            {/* ==================================================
                QUANTITY
            ================================================== */}

            <div>

              <label
                className="
                  block
                  mb-2
                  text-sm
                  font-semibold
                  text-slate-700
                "
              >

                Quantity

              </label>


              <input
                type="number"
                min="1"
                placeholder="2000"
                value={
                  quantity
                }
                onChange={(event) =>
                  setQuantity(
                    event.target.value
                  )
                }
                className="
                  w-full
                  h-11
                  px-3
                  rounded-xl
                  border
                  border-slate-300
                  text-sm
                  text-slate-800
                  outline-none
                  focus:border-teal-500
                  focus:ring-2
                  focus:ring-teal-100
                "
              />

            </div>


            {/* ==================================================
                TARGET PRICE
            ================================================== */}

            <div>

              <label
                className="
                  block
                  mb-2
                  text-sm
                  font-semibold
                  text-slate-700
                "
              >

                Target Price

              </label>


              <div
                className="
                  relative
                "
              >

                <span
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-sm
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
                  placeholder="320"
                  value={
                    targetPrice
                  }
                  onChange={(event) =>
                    setTargetPrice(
                      event.target.value
                    )
                  }
                  className="
                    w-full
                    h-11
                    pl-8
                    pr-3
                    rounded-xl
                    border
                    border-slate-300
                    text-sm
                    text-slate-800
                    outline-none
                    focus:border-teal-500
                    focus:ring-2
                    focus:ring-teal-100
                  "
                />

              </div>

            </div>


            {/* ==================================================
                EXPECTED DELIVERY
            ================================================== */}

            <div>

              <label
                className="
                  block
                  mb-2
                  text-sm
                  font-semibold
                  text-slate-700
                "
              >

                Expected Delivery

              </label>


              <input
                type="date"
                value={
                  deliveryDate
                }
                onChange={(event) =>
                  setDeliveryDate(
                    event.target.value
                  )
                }
                min={
                  new Date()
                    .toISOString()
                    .split('T')[0]
                }
                className="
                  w-full
                  h-11
                  px-3
                  rounded-xl
                  border
                  border-slate-300
                  text-sm
                  text-slate-800
                  outline-none
                  focus:border-teal-500
                  focus:ring-2
                  focus:ring-teal-100
                "
              />

            </div>


            {/* ==================================================
                MESSAGE
            ================================================== */}

            <div>

              <label
                className="
                  block
                  mb-2
                  text-sm
                  font-semibold
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
                rows="5"
                placeholder="Write any additional requirements..."
                value={
                  message
                }
                onChange={(event) =>
                  setMessage(
                    event.target.value
                  )
                }
                className="
                  w-full
                  px-3
                  py-3
                  rounded-xl
                  border
                  border-slate-300
                  text-sm
                  text-slate-800
                  resize-none
                  outline-none
                  focus:border-teal-500
                  focus:ring-2
                  focus:ring-teal-100
                "
              />

            </div>


            {/* ==================================================
                SUBMIT
            ================================================== */}

            <button
              type="submit"
              disabled={
                submitting
              }
              className="
                w-full
                h-12
                rounded-xl
                bg-teal-600
                text-white
                text-sm
                font-bold
                hover:bg-teal-700
                disabled:bg-teal-300
                disabled:cursor-not-allowed
                transition
              "
            >

              {submitting
                ? 'Submitting...'
                : 'Submit RFQ'}

            </button>

          </form>

        </div>


        {/* ==================================================
            BACK
        ================================================== */}

        <button
          type="button"
          onClick={() =>
            navigate(-1)
          }
          className="
            block
            mx-auto
            mt-5
            text-sm
            font-semibold
            text-slate-500
            hover:text-teal-700
          "
        >

          ← Back

        </button>

      </div>

    </div>

  );

};


export default RFQ;