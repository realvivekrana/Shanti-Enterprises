import {
  useRef,
  useState,
} from 'react';

import {
  Link,
  useNavigate,
} from 'react-router-dom';

import API from '../api/axios';

import {
  useCart,
} from '../context/CartContext';


// ======================================================
// BULK ORDER UPLOAD PAGE
// ======================================================

const BulkOrderUpload = () => {

  const fileInputRef =
    useRef(null);

  const navigate =
    useNavigate();


  const {
    addToCart,
    cartItems,
  } = useCart();


  const [
    selectedFile,
    setSelectedFile,
  ] = useState(null);


  const [
    loading,
    setLoading,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState('');


  const [
    result,
    setResult,
  ] = useState(null);


  const [
    dragActive,
    setDragActive,
  ] = useState(false);


  // ====================================================
  // SELECT FILE
  // ====================================================

  const handleFileChange = (
    event
  ) => {

    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    validateAndSetFile(file);

  };


  // ====================================================
  // VALIDATE FILE
  // ====================================================

  const validateAndSetFile = (
    file
  ) => {

    setError('');

    setResult(null);


    const fileName =
      file.name.toLowerCase();


    const allowed =
      [
        '.csv',
        '.xlsx',
        '.xls',
      ].some(
        (extension) =>
          fileName.endsWith(
            extension
          )
      );


    if (!allowed) {

      setError(
        'Please upload a CSV, XLSX or XLS file.'
      );

      return;

    }


    const maxSize =
      5 * 1024 * 1024;


    if (
      file.size > maxSize
    ) {

      setError(
        'File size must be less than 5 MB.'
      );

      return;

    }


    setSelectedFile(file);

  };


  // ====================================================
  // DRAG ENTER
  // ====================================================

  const handleDragEnter = (
    event
  ) => {

    event.preventDefault();

    event.stopPropagation();

    setDragActive(true);

  };


  // ====================================================
  // DRAG LEAVE
  // ====================================================

  const handleDragLeave = (
    event
  ) => {

    event.preventDefault();

    event.stopPropagation();

    setDragActive(false);

  };


  // ====================================================
  // DRAG OVER
  // ====================================================

  const handleDragOver = (
    event
  ) => {

    event.preventDefault();

    event.stopPropagation();

    setDragActive(true);

  };


  // ====================================================
  // DROP
  // ====================================================

  const handleDrop = (
    event
  ) => {

    event.preventDefault();

    event.stopPropagation();

    setDragActive(false);


    const file =
      event.dataTransfer.files?.[0];


    if (!file) {
      return;
    }


    validateAndSetFile(file);

  };


  // ====================================================
  // REMOVE FILE
  // ====================================================

  const removeFile = () => {

    setSelectedFile(null);

    setResult(null);

    setError('');


    if (
      fileInputRef.current
    ) {

      fileInputRef.current.value =
        '';

    }

  };


  // ====================================================
  // UPLOAD FILE
  // ====================================================

  const handleUpload = async () => {

    if (!selectedFile) {

      setError(
        'Please select a file first.'
      );

      return;

    }


    setLoading(true);

    setError('');

    setResult(null);


    try {

      const formData =
        new FormData();


      formData.append(
        'file',
        selectedFile
      );


      const response =
        await API.post(
          '/bulk-orders/upload',
          formData,
          {
            headers: {
              'Content-Type':
                'multipart/form-data',
            },
          }
        );


      const data =
        response.data;


      // ==================================================
      // ADD VALID PRODUCTS TO CART
      // ==================================================

      const addedToCart = [];

      const cartRejected = [];


      if (
        Array.isArray(
          data.addedItems
        )
      ) {

        for (
          const item
          of data.addedItems
        ) {

          const product =
            item.product;


          const quantity =
            Number(
              item.quantity
            );


          // ----------------------------------------------
          // EXISTING CART QUANTITY
          // ----------------------------------------------

          const existingCartItem =
            cartItems.find(
              (cartItem) =>
                cartItem._id ===
                product._id
            );


          const existingQuantity =
            Number(
              existingCartItem?.quantity ||
              0
            );


          const requestedTotal =
            existingQuantity +
            quantity;


          const stock =
            Number(
              product.stock || 0
            );


          const moq =
            Number(
              product.moq || 1
            );


          // ----------------------------------------------
          // MOQ CHECK WITH EXISTING CART
          // ----------------------------------------------

          if (
            requestedTotal < moq
          ) {

            cartRejected.push({

              sku:
                product.sku,

              quantity,

              reason:
                `Cart quantity would be below MOQ ${moq}.`,

            });

            continue;

          }


          // ----------------------------------------------
          // STOCK CHECK WITH EXISTING CART
          // ----------------------------------------------

          if (
            requestedTotal > stock
          ) {

            cartRejected.push({

              sku:
                product.sku,

              quantity,

              reason:
                `Existing cart quantity + uploaded quantity exceeds available stock (${stock}).`,

            });

            continue;

          }


          // ----------------------------------------------
          // ADD TO CART
          // ----------------------------------------------

          const added =
            addToCart(
              product,
              quantity
            );


          if (added) {

            addedToCart.push({

              sku:
                product.sku,

              productName:
                product.name,

              quantity,

            });

          } else {

            cartRejected.push({

              sku:
                product.sku,

              quantity,

              reason:
                'Product could not be added to cart.',

            });

          }

        }

      }


      // ==================================================
      // SAVE RESULT
      // ==================================================

      setResult({

        ...data,

        cartAddedItems:
          addedToCart,

        cartRejectedItems:
          cartRejected,

      });


    } catch (requestError) {

      console.error(
        'Bulk order upload error:',
        requestError
      );


      setError(
        requestError
          ?.response
          ?.data
          ?.message ||
        'Unable to process the bulk order file. Please try again.'
      );

    } finally {

      setLoading(false);

    }

  };


  // ====================================================
  // DOWNLOAD TEMPLATE
  // ====================================================

  const downloadTemplate = () => {

    const csvContent =
      [
        'SKU,Quantity',
        'TS001,500',
        'TS002,200',
        'TS005,1000',
      ].join('\n');


    const blob =
      new Blob(
        [csvContent],
        {
          type:
            'text/csv;charset=utf-8;',
        }
      );


    const url =
      URL.createObjectURL(
        blob
      );


    const link =
      document.createElement(
        'a'
      );


    link.href = url;

    link.download =
      'bulk-order-template.csv';


    document.body.appendChild(
      link
    );


    link.click();


    document.body.removeChild(
      link
    );


    URL.revokeObjectURL(
      url
    );

  };


  // ====================================================
  // GO TO CART
  // ====================================================

  const goToCart = () => {

    navigate('/cart');

  };


  return (

    <div className="min-h-screen bg-slate-50 py-10">

      <div className="max-w-5xl mx-auto px-4">


        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="mb-8">

          <Link
            to="/"
            className="text-sm text-teal-600 hover:text-teal-700"
          >
            ← Continue Shopping
          </Link>


          <h1 className="text-3xl font-bold text-slate-800 mt-4">
            Bulk Order Upload
          </h1>


          <p className="text-slate-600 mt-2">
            Upload your SKU and quantity list and
            automatically add all valid products to your cart.
          </p>

        </div>


        {/* ==================================================
            MAIN CARD
        ================================================== */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">


          {/* ==================================================
              INSTRUCTIONS
          ================================================== */}

          <div className="grid md:grid-cols-3 gap-4 mb-8">

            <div className="bg-teal-50 rounded-xl p-5">

              <div className="text-2xl mb-2">
                📄
              </div>

              <h3 className="font-semibold text-slate-800">
                1. Prepare File
              </h3>

              <p className="text-sm text-slate-600 mt-1">
                Add SKU and Quantity columns.
              </p>

            </div>


            <div className="bg-blue-50 rounded-xl p-5">

              <div className="text-2xl mb-2">
                📤
              </div>

              <h3 className="font-semibold text-slate-800">
                2. Upload
              </h3>

              <p className="text-sm text-slate-600 mt-1">
                Upload CSV or Excel file.
              </p>

            </div>


            <div className="bg-green-50 rounded-xl p-5">

              <div className="text-2xl mb-2">
                🛒
              </div>

              <h3 className="font-semibold text-slate-800">
                3. Add to Cart
              </h3>

              <p className="text-sm text-slate-600 mt-1">
                Valid products go directly to cart.
              </p>

            </div>

          </div>


          {/* ==================================================
              TEMPLATE
          ================================================== */}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

            <div>

              <h2 className="font-semibold text-slate-800">
                File Format
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Required columns: SKU and Quantity
              </p>

            </div>


            <button
              type="button"
              onClick={
                downloadTemplate
              }
              className="px-4 py-2 rounded-lg border border-teal-600 text-teal-700 font-medium hover:bg-teal-50 transition"
            >
              ⬇ Download Template
            </button>

          </div>


          {/* ==================================================
              EXAMPLE TABLE
          ================================================== */}

          <div className="overflow-x-auto mb-8">

            <table className="w-full border-collapse">

              <thead>

                <tr className="bg-slate-100">

                  <th className="text-left px-4 py-3 border border-slate-200 text-sm font-semibold">
                    SKU
                  </th>

                  <th className="text-left px-4 py-3 border border-slate-200 text-sm font-semibold">
                    Quantity
                  </th>

                </tr>

              </thead>


              <tbody>

                <tr>

                  <td className="px-4 py-3 border border-slate-200">
                    TS001
                  </td>

                  <td className="px-4 py-3 border border-slate-200">
                    500
                  </td>

                </tr>


                <tr>

                  <td className="px-4 py-3 border border-slate-200">
                    TS002
                  </td>

                  <td className="px-4 py-3 border border-slate-200">
                    200
                  </td>

                </tr>


                <tr>

                  <td className="px-4 py-3 border border-slate-200">
                    TS005
                  </td>

                  <td className="px-4 py-3 border border-slate-200">
                    1000
                  </td>

                </tr>

              </tbody>

            </table>

          </div>


          {/* ==================================================
              DROP ZONE
          ================================================== */}

          <div
            onDragEnter={
              handleDragEnter
            }
            onDragLeave={
              handleDragLeave
            }
            onDragOver={
              handleDragOver
            }
            onDrop={
              handleDrop
            }
            className={`border-2 border-dashed rounded-2xl p-10 text-center transition ${
              dragActive
                ? 'border-teal-600 bg-teal-50'
                : 'border-slate-300 bg-slate-50'
            }`}
          >

            <input
              ref={
                fileInputRef
              }
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={
                handleFileChange
              }
              className="hidden"
            />


            <div className="text-5xl mb-4">
              📊
            </div>


            <h2 className="text-xl font-semibold text-slate-800">
              Upload Bulk Order File
            </h2>


            <p className="text-slate-500 mt-2">
              Drag & drop your file here
            </p>


            <p className="text-sm text-slate-400 mt-1">
              CSV, XLSX or XLS · Maximum 5 MB
            </p>


            <button
              type="button"
              onClick={() =>
                fileInputRef.current?.click()
              }
              className="mt-5 px-5 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition"
            >
              Choose File
            </button>

          </div>


          {/* ==================================================
              SELECTED FILE
          ================================================== */}

          {selectedFile && (

            <div className="mt-5 p-4 bg-slate-100 rounded-xl flex items-center justify-between gap-4">

              <div className="flex items-center gap-3 min-w-0">

                <div className="text-2xl">
                  📄
                </div>


                <div className="min-w-0">

                  <p className="font-medium text-slate-800 truncate">
                    {selectedFile.name}
                  </p>

                  <p className="text-sm text-slate-500">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>

                </div>

              </div>


              <button
                type="button"
                onClick={
                  removeFile
                }
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Remove
              </button>

            </div>

          )}


          {/* ==================================================
              ERROR
          ================================================== */}

          {error && (

            <div className="mt-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">

              <div className="font-semibold">
                Upload Error
              </div>

              <div className="text-sm mt-1">
                {error}
              </div>

            </div>

          )}


          {/* ==================================================
              UPLOAD BUTTON
          ================================================== */}

          <div className="mt-6 flex justify-end">

            <button
              type="button"
              disabled={
                !selectedFile ||
                loading
              }
              onClick={
                handleUpload
              }
              className="px-7 py-3 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition"
            >

              {loading
                ? 'Processing...'
                : 'Upload & Add to Cart'}

            </button>

          </div>


          {/* ==================================================
              RESULT
          ================================================== */}

          {result && (

            <div className="mt-10 border-t border-slate-200 pt-8">

              <h2 className="text-xl font-bold text-slate-800 mb-5">
                Upload Result
              </h2>


              {/* ==================================================
                  SUMMARY
              ================================================== */}

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

                <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">

                  <p className="text-sm text-slate-500">
                    Total Rows
                  </p>

                  <p className="text-2xl font-bold text-slate-800 mt-1">
                    {result.totalRows || 0}
                  </p>

                </div>


                <div className="rounded-xl bg-green-50 border border-green-200 p-4">

                  <p className="text-sm text-green-700">
                    Added to Cart
                  </p>

                  <p className="text-2xl font-bold text-green-800 mt-1">
                    {result.cartAddedItems?.length || 0}
                  </p>

                </div>


                <div className="rounded-xl bg-yellow-50 border border-yellow-200 p-4">

                  <p className="text-sm text-yellow-700">
                    Invalid Rows
                  </p>

                  <p className="text-2xl font-bold text-yellow-800 mt-1">
                    {result.invalidItems?.length || 0}
                  </p>

                </div>


                <div className="rounded-xl bg-red-50 border border-red-200 p-4">

                  <p className="text-sm text-red-700">
                    Unavailable
                  </p>

                  <p className="text-2xl font-bold text-red-800 mt-1">
                    {(
                      result.unavailableItems?.length ||
                      0
                    ) +
                      (
                        result.cartRejectedItems?.length ||
                        0
                      )}
                  </p>

                </div>

              </div>


              {/* ==================================================
                  SUCCESS ITEMS
              ================================================== */}

              {result.cartAddedItems?.length > 0 && (

                <div className="mb-8">

                  <h3 className="font-semibold text-green-700 mb-3">
                    ✅ Added to Cart
                  </h3>


                  <div className="space-y-2">

                    {result.cartAddedItems.map(
                      (item, index) => (

                        <div
                          key={`${item.sku}-${index}`}
                          className="flex items-center justify-between gap-4 p-3 bg-green-50 border border-green-200 rounded-lg"
                        >

                          <div>

                            <p className="font-medium text-slate-800">
                              {item.productName}
                            </p>

                            <p className="text-sm text-slate-500">
                              SKU: {item.sku}
                            </p>

                          </div>


                          <span className="font-semibold text-green-700">
                            Qty: {item.quantity}
                          </span>

                        </div>

                      )
                    )}

                  </div>

                </div>

              )}


              {/* ==================================================
                  UNAVAILABLE ITEMS
              ================================================== */}

              {result.unavailableItems?.length > 0 && (

                <div className="mb-8">

                  <h3 className="font-semibold text-red-700 mb-3">
                    ❌ Products Not Added
                  </h3>


                  <div className="space-y-2">

                    {result.unavailableItems.map(
                      (item, index) => (

                        <div
                          key={`${item.sku}-${index}`}
                          className="p-3 bg-red-50 border border-red-200 rounded-lg"
                        >

                          <div className="flex justify-between gap-4">

                            <div>

                              <p className="font-medium text-slate-800">
                                {item.sku}
                              </p>

                              {item.productName && (

                                <p className="text-sm text-slate-500">
                                  {item.productName}
                                </p>

                              )}

                            </div>


                            <span className="text-sm font-medium text-red-700">
                              Qty: {item.quantity}
                            </span>

                          </div>


                          <p className="text-sm text-red-600 mt-1">
                            {item.reason}
                          </p>

                        </div>

                      )
                    )}

                  </div>

                </div>

              )}


              {/* ==================================================
                  INVALID ROWS
              ================================================== */}

              {result.invalidItems?.length > 0 && (

                <div className="mb-8">

                  <h3 className="font-semibold text-yellow-700 mb-3">
                    ⚠️ Invalid Rows
                  </h3>


                  <div className="space-y-2">

                    {result.invalidItems.map(
                      (item, index) => (

                        <div
                          key={`${item.row}-${index}`}
                          className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                        >

                          <div className="flex justify-between gap-4">

                            <span className="font-medium text-slate-800">
                              Row {item.row}
                            </span>

                            <span className="text-sm text-slate-500">
                              {item.sku || 'No SKU'}
                            </span>

                          </div>


                          <p className="text-sm text-yellow-700 mt-1">
                            {item.reason}
                          </p>

                        </div>

                      )
                    )}

                  </div>

                </div>

              )}


              {/* ==================================================
                  CART REJECTED
              ================================================== */}

              {result.cartRejectedItems?.length > 0 && (

                <div className="mb-8">

                  <h3 className="font-semibold text-orange-700 mb-3">
                    ⚠️ Cart Validation Issues
                  </h3>


                  <div className="space-y-2">

                    {result.cartRejectedItems.map(
                      (item, index) => (

                        <div
                          key={`${item.sku}-${index}`}
                          className="p-3 bg-orange-50 border border-orange-200 rounded-lg"
                        >

                          <div className="flex justify-between gap-4">

                            <span className="font-medium text-slate-800">
                              {item.sku}
                            </span>

                            <span className="text-sm text-slate-500">
                              Qty: {item.quantity}
                            </span>

                          </div>


                          <p className="text-sm text-orange-700 mt-1">
                            {item.reason}
                          </p>

                        </div>

                      )
                    )}

                  </div>

                </div>

              )}


              {/* ==================================================
                  VIEW CART
              ================================================== */}

              {result.cartAddedItems?.length > 0 && (

                <div className="flex justify-end">

                  <button
                    type="button"
                    onClick={
                      goToCart
                    }
                    className="px-7 py-3 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 transition"
                  >
                    View Cart →
                  </button>

                </div>

              )}

            </div>

          )}

        </div>

      </div>

    </div>

  );

};


export default BulkOrderUpload;