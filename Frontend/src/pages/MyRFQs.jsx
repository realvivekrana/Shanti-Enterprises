import {
  useEffect,
  useState,
} from 'react';

import {
  useLocation,
  useNavigate,
} from 'react-router-dom';


// ======================================================
// API
// ======================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000';


// ======================================================
// RFQ PAGE
// ======================================================

const RFQ = () => {

  const navigate =
    useNavigate();

  const location =
    useLocation();


  // ====================================================
  // STATE
  // ====================================================

  const [
    products,
    setProducts,
  ] = useState([]);


  const [
    loadingProducts,
    setLoadingProducts,
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


  const [
    product,
    setProduct,
  ] = useState(
    location.state?.productId ||
    ''
  );


  const [
    quantity,
    setQuantity,
  ] = useState(
    location.state?.quantity ||
    ''
  );


  const [
    targetPrice,
    setTargetPrice,
  ] = useState(
    location.state?.unitPrice ||
    ''
  );


  const [
    expectedDelivery,
    setExpectedDelivery,
  ] = useState('');


  const [
    message,
    setMessage,
  ] = useState('');


  // ====================================================
  // FETCH PRODUCTS
  // ====================================================

  useEffect(() => {

    const fetchProducts =
      async () => {

        try {

          setLoadingProducts(true);


          const response =
            await fetch(
              `${API_URL}/api/products`
            );


          if (!response.ok) {

            throw new Error(
              'Unable to load products'
            );

          }


          const data =
            await response.json();


          const productData =
            Array.isArray(data)
              ? data
              : Array.isArray(data.data)
                ? data.data
                : Array.isArray(
                    data.products
                  )
                  ? data.products
                  : Array.isArray(
                      data.data?.products
                    )
                    ? data.data.products
                    : [];


          setProducts(
            productData
          );

        } catch (err) {

          console.error(
            'RFQ products error:',
            err
          );


          setError(
            err.message ||
            'Unable to load products'
          );

        } finally {

          setLoadingProducts(false);

        }

      };


    fetchProducts();

  }, []);


  // ====================================================
  // PRODUCT CHANGE
  // ====================================================

  const handleProductChange =
    (event) => {

      const productId =
        event.target.value;


      setProduct(
        productId
      );


      /*
       * Product select karne par
       * uski current price ko target
       * price ke liye prefill kar dete hain.
       */

      const selectedProduct =
        products.find(
          (item) =>
            String(
              item._id ||
              item.id
            ) ===
            String(
              productId
            )
        );


      if (
        selectedProduct
      ) {

        const price =
          selectedProduct.price ??
          selectedProduct.sellingPrice ??
          selectedProduct.salePrice ??
          '';


        setTargetPrice(
          price
        );

      }

    };


  // ====================================================
  // SUBMIT RFQ
  // ====================================================

  const handleSubmit =
    async (event) => {

      event.preventDefault();


      setError('');

      setSuccess('');


      // ==================================================
      // VALIDATION
      // ==================================================

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
        Number(targetPrice) < 0
      ) {

        setError(
          'Please enter a valid target price.'
        );

        return;

      }


      // ==================================================
      // AUTH
      // ==================================================

      const userInfo =
        localStorage.getItem(
          'userInfo'
        );


      if (!userInfo) {

        navigate(
          '/login',
          {
            state: {
              from: '/rfq',
            },
          }
        );

        return;

      }


      let token = '';


      try {

        const parsedUser =
          JSON.parse(
            userInfo
          );


        token =
          parsedUser.token ||
          parsedUser.accessToken ||
          '';

      } catch {

        setError(
          'Please login again.'
        );

        return;

      }


      if (!token) {

        setError(
          'Authentication token not found. Please login again.'
        );

        return;

      }


      // ==================================================
      // SUBMIT
      // ==================================================

      try {

        setSubmitting(true);


        const response =
          await fetch(
            `${API_URL}/api/rfqs`,
            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'application/json',

                Authorization:
                  `Bearer ${token}`,
              },

              body: JSON.stringify({

                product,

                quantity:
                  Number(
                    quantity
                  ),

                targetPrice:
                  Number(
                    targetPrice
                  ),

                expectedDelivery:
                  expectedDelivery ||
                  null,

                message:
                  message.trim(),

              }),

            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data?.message ||
            data?.error ||
            'Failed to submit RFQ'
          );

        }


        setSuccess(
          'Your quotation request has been submitted successfully.'
        );


        // ==================================================
        // RESET FORM
        // ==================================================

        setQuantity('');

        setTargetPrice('');

        setExpectedDelivery('');

        setMessage('');


      } catch (err) {

        console.error(
          'RFQ submit error:',
          err
        );


        setError(
          err.message ||
          'Unable to submit RFQ.'
        );

      } finally {

        setSubmitting(false);

      }

    };


  return (

    <div
      className="
        min-h-screen
        bg-slate-50
      "
    >

      {/* ==================================================
          HEADER
      ================================================== */}

      <section
        className="
          bg-white
          border-b
          border-slate-200
        "
      >

        <div
          className="
            max-w-4xl
            mx-auto
            px-4
            py-8
            sm:py-10
          "
        >

          <p
            className="
              text-sm
              font-semibold
              uppercase
              tracking-wider
              text-teal-600
            "
          >

            Wholesale Enquiry

          </p>


          <h1
            className="
              mt-1
              text-3xl
              sm:text-4xl
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

            Tell us what you need and our
            team will provide a quotation.

          </p>

        </div>

      </section>


      {/* ==================================================
          FORM
      ================================================== */}

      <main
        className="
          max-w-4xl
          mx-auto
          px-4
          py-8
        "
      >

        <div
          className="
            bg-white
            border
            border-slate-200
            rounded-2xl
            shadow-sm
            p-5
            sm:p-8
          "
        >

          {/* ==================================================
              SUCCESS
          ================================================== */}

          {success && (

            <div
              className="
                mb-6
                p-4
                rounded-xl
                bg-emerald-50
                border
                border-emerald-200
                text-sm
                text-emerald-800
              "
            >

              <div
                className="
                  flex
                  gap-3
                  items-start
                "
              >

                <span>
                  ✅
                </span>


                <div>

                  <p
                    className="
                      font-bold
                    "
                  >

                    RFQ Submitted

                  </p>


                  <p
                    className="
                      mt-1
                    "
                  >

                    {success}

                  </p>

                </div>

              </div>

            </div>

          )}


          {/* ==================================================
              ERROR
          ================================================== */}

          {error && (

            <div
              className="
                mb-6
                p-4
                rounded-xl
                bg-red-50
                border
                border-red-200
                text-sm
                text-red-700
              "
            >

              ⚠️ {error}

            </div>

          )}


          <form
            onSubmit={
              handleSubmit
            }
            className="
              space-y-6
            "
          >

            {/* ==================================================
                PRODUCT
            ================================================== */}

            <div>

              <label
                htmlFor="rfq-product"
                className="
                  block
                  mb-2
                  text-sm
                  font-bold
                  text-slate-700
                "
              >

                Product

                <span
                  className="
                    text-red-500
                  "
                >

                  *

                </span>

              </label>


              <select
                id="rfq-product"
                value={
                  product
                }
                onChange={
                  handleProductChange
                }
                disabled={
                  loadingProducts
                }
                className="
                  w-full
                  h-12
                  px-4
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  text-sm
                  text-slate-700
                  outline-none
                  focus:border-teal-500
                  focus:ring-4
                  focus:ring-teal-50
                "
              >

                <option value="">

                  {loadingProducts
                    ? 'Loading products...'
                    : 'Select Product'}

                </option>


                {products.map(
                  (item) => (

                    <option
                      key={
                        item._id ||
                        item.id
                      }
                      value={
                        item._id ||
                        item.id
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
                htmlFor="rfq-quantity"
                className="
                  block
                  mb-2
                  text-sm
                  font-bold
                  text-slate-700
                "
              >

                Quantity

                <span
                  className="
                    text-red-500
                  "
                >

                  *

                </span>

              </label>


              <input
                id="rfq-quantity"
                type="number"
                min="1"
                value={
                  quantity
                }
                onChange={(event) =>
                  setQuantity(
                    event.target.value
                  )
                }
                placeholder="e.g. 2000"
                className="
                  w-full
                  h-12
                  px-4
                  rounded-xl
                  border
                  border-slate-200
                  text-sm
                  outline-none
                  focus:border-teal-500
                  focus:ring-4
                  focus:ring-teal-50
                "
              />

            </div>


            {/* ==================================================
                TARGET PRICE
            ================================================== */}

            <div>

              <label
                htmlFor="rfq-price"
                className="
                  block
                  mb-2
                  text-sm
                  font-bold
                  text-slate-700
                "
              >

                Target Price

                <span
                  className="
                    text-red-500
                  "
                >

                  *

                </span>

              </label>


              <div
                className="
                  relative
                "
              >

                <span
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-500
                    font-semibold
                  "
                >

                  ₹

                </span>


                <input
                  id="rfq-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={
                    targetPrice
                  }
                  onChange={(event) =>
                    setTargetPrice(
                      event.target.value
                    )
                  }
                  placeholder="e.g. 320"
                  className="
                    w-full
                    h-12
                    pl-9
                    pr-4
                    rounded-xl
                    border
                    border-slate-200
                    text-sm
                    outline-none
                    focus:border-teal-500
                    focus:ring-4
                    focus:ring-teal-50
                  "
                />

              </div>


              <p
                className="
                  mt-2
                  text-xs
                  text-slate-400
                "
              >

                Enter the price you are
                expecting per piece.

              </p>

            </div>


            {/* ==================================================
                EXPECTED DELIVERY
            ================================================== */}

            <div>

              <label
                htmlFor="rfq-delivery"
                className="
                  block
                  mb-2
                  text-sm
                  font-bold
                  text-slate-700
                "
              >

                Expected Delivery

              </label>


              <input
                id="rfq-delivery"
                type="date"
                value={
                  expectedDelivery
                }
                onChange={(event) =>
                  setExpectedDelivery(
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
                  h-12
                  px-4
                  rounded-xl
                  border
                  border-slate-200
                  text-sm
                  text-slate-700
                  outline-none
                  focus:border-teal-500
                  focus:ring-4
                  focus:ring-teal-50
                "
              />

            </div>


            {/* ==================================================
                MESSAGE
            ================================================== */}

            <div>

              <label
                htmlFor="rfq-message"
                className="
                  block
                  mb-2
                  text-sm
                  font-bold
                  text-slate-700
                "
              >

                Message

              </label>


              <textarea
                id="rfq-message"
                rows="5"
                value={
                  message
                }
                onChange={(event) =>
                  setMessage(
                    event.target.value
                  )
                }
                placeholder="Tell us about your requirements..."
                className="
                  w-full
                  px-4
                  py-3
                  rounded-xl
                  border
                  border-slate-200
                  text-sm
                  resize-none
                  outline-none
                  focus:border-teal-500
                  focus:ring-4
                  focus:ring-teal-50
                "
              />

            </div>


            {/* ==================================================
                SUBMIT
            ================================================== */}

            <button
              type="submit"
              disabled={
                submitting ||
                loadingProducts
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
                disabled:bg-slate-300
                disabled:cursor-not-allowed
                transition-colors
              "
            >

              {submitting
                ? 'Submitting...'
                : 'Submit RFQ'}

            </button>

          </form>

        </div>


        {/* ==================================================
            SIMPLE INFO
        ================================================== */}

        <div
          className="
            mt-5
            p-4
            rounded-xl
            bg-teal-50
            border
            border-teal-100
          "
        >

          <p
            className="
              text-xs
              sm:text-sm
              text-teal-800
              leading-6
            "
          >

            💡 For large quantities, our team
            can provide a customized wholesale
            quotation based on your requirements.

          </p>

        </div>

      </main>

    </div>

  );

};


export default RFQ;