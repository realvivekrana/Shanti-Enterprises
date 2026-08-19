import { useState } from 'react';

import API from '../../api/axios';


// ======================================================
// ADMIN SHIPPING
// ======================================================

const AdminShipping = () => {

  const [orderId, setOrderId] =
    useState('');

  const [courierId, setCourierId] =
    useState('');

  const [pickupDate, setPickupDate] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState('');

  const [error, setError] =
    useState('');

  const [result, setResult] =
    useState(null);


  // ======================================================
  // COMMON REQUEST HANDLER
  // ======================================================

  const handleRequest = async (
    request,
    successMessage
  ) => {

    if (!orderId.trim()) {

      setError(
        'Please enter Order ID'
      );

      return;

    }


    try {

      setLoading(true);

      setError('');

      setMessage('');

      setResult(null);


      const response =
        await request();


      setResult(
        response.data?.data ||
        response.data
      );


      setMessage(
        successMessage
      );

    } catch (err) {

      console.error(
        'Shipping request failed:',
        err
      );


      setError(

        err.response?.data?.message ||

        err.message ||

        'Something went wrong'

      );

    } finally {

      setLoading(false);

    }

  };


  // ======================================================
  // CREATE SHIPROCKET ORDER
  // ======================================================

  const createShipment = () => {

    handleRequest(

      () =>
        API.post(
          `/shipments/${orderId}/shiprocket/create`
        ),

      'Shiprocket order created successfully.'

    );

  };


  // ======================================================
  // ASSIGN AWB
  // ======================================================

  const assignAWB = () => {

    handleRequest(

      () =>
        API.post(
          `/shipments/${orderId}/shiprocket/awb`,
          courierId
            ? {
                courierId,
              }
            : {}
        ),

      'AWB assignment completed.'

    );

  };


  // ======================================================
  // REQUEST PICKUP
  // ======================================================

  const requestPickup = () => {

    handleRequest(

      () =>
        API.post(
          `/shipments/${orderId}/shiprocket/pickup`,
          pickupDate
            ? {
                pickupDate,
              }
            : {}
        ),

      'Pickup request submitted successfully.'

    );

  };


  // ======================================================
  // TRACK SHIPMENT
  // ======================================================

  const trackShipment = () => {

    handleRequest(

      () =>
        API.get(
          `/shipments/${orderId}/shiprocket/track`
        ),

      'Tracking information fetched successfully.'

    );

  };


  // ======================================================
  // GENERATE LABEL
  // ======================================================

  const generateLabel = () => {

    handleRequest(

      () =>
        API.post(
          `/shipments/${orderId}/shiprocket/label`
        ),

      'Shipping label generated successfully.'

    );

  };


  // ======================================================
  // GENERATE INVOICE
  // ======================================================

  const generateInvoice = () => {

    handleRequest(

      () =>
        API.post(
          `/shipments/${orderId}/shiprocket/invoice`
        ),

      'Shipping invoice generated successfully.'

    );

  };


  // ======================================================
  // CANCEL SHIPMENT
  // ======================================================

  const cancelShipment = () => {

    const confirmed =
      window.confirm(
        'Are you sure you want to cancel this Shiprocket shipment?'
      );


    if (!confirmed) {

      return;

    }


    handleRequest(

      () =>
        API.delete(
          `/shipments/${orderId}/shiprocket`
        ),

      'Shiprocket shipment cancelled successfully.'

    );

  };


  // ======================================================
  // UI
  // ======================================================

  return (

    <div className="min-h-screen bg-slate-50 py-8">

      <div className="max-w-6xl mx-auto px-4">


        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="mb-8">

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">

            Shipping Management

          </h1>


          <p className="mt-2 text-sm text-slate-500">

            Manage Shiprocket shipments, AWB,
            pickup, labels and tracking.

          </p>

        </div>


        {/* ==================================================
            ORDER INFORMATION
        ================================================== */}

        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6 shadow-sm">

          <h2 className="text-lg font-semibold text-slate-800 mb-4">

            Shipment Order

          </h2>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


            {/* ORDER ID */}

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">

                Order ID

              </label>


              <input
                type="text"
                value={orderId}
                onChange={(e) =>
                  setOrderId(
                    e.target.value
                  )
                }
                placeholder="Enter MongoDB Order ID"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
              />

            </div>


            {/* COURIER ID */}

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">

                Courier ID

                <span className="text-slate-400 font-normal">
                  {' '}(Optional)
                </span>

              </label>


              <input
                type="text"
                value={courierId}
                onChange={(e) =>
                  setCourierId(
                    e.target.value
                  )
                }
                placeholder="Example: 10"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
              />

            </div>


            {/* PICKUP DATE */}

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">

                Pickup Date

                <span className="text-slate-400 font-normal">
                  {' '}(Optional)
                </span>

              </label>


              <input
                type="date"
                value={pickupDate}
                onChange={(e) =>
                  setPickupDate(
                    e.target.value
                  )
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
              />

            </div>

          </div>

        </div>


        {/* ==================================================
            MESSAGES
        ================================================== */}

        {message && (

          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">

            {message}

          </div>

        )}


        {error && (

          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

            {error}

          </div>

        )}


        {/* ==================================================
            SHIPROCKET ACTIONS
        ================================================== */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">


          {/* CREATE */}

          <ActionCard
            title="Create Shipment"
            description="Create the order in Shiprocket."
            buttonText="Create Shiprocket Order"
            onClick={createShipment}
            loading={loading}
          />


          {/* AWB */}

          <ActionCard
            title="Assign AWB"
            description="Assign courier and generate AWB."
            buttonText="Assign AWB"
            onClick={assignAWB}
            loading={loading}
          />


          {/* PICKUP */}

          <ActionCard
            title="Schedule Pickup"
            description="Request courier pickup."
            buttonText="Request Pickup"
            onClick={requestPickup}
            loading={loading}
          />


          {/* TRACK */}

          <ActionCard
            title="Live Tracking"
            description="Fetch latest shipment tracking."
            buttonText="Track Shipment"
            onClick={trackShipment}
            loading={loading}
          />


          {/* LABEL */}

          <ActionCard
            title="Shipping Label"
            description="Generate shipping label."
            buttonText="Generate Label"
            onClick={generateLabel}
            loading={loading}
          />


          {/* INVOICE */}

          <ActionCard
            title="Shipping Invoice"
            description="Generate Shiprocket invoice."
            buttonText="Generate Invoice"
            onClick={generateInvoice}
            loading={loading}
          />

        </div>


        {/* ==================================================
            CANCEL
        ================================================== */}

        <div className="mt-6 bg-white rounded-xl border border-red-200 p-5">

          <h2 className="text-lg font-semibold text-slate-800">

            Cancel Shipment

          </h2>


          <p className="text-sm text-slate-500 mt-1 mb-4">

            Cancel the Shiprocket shipment
            associated with this order.

          </p>


          <button
            type="button"
            onClick={cancelShipment}
            disabled={loading}
            className="px-5 py-3 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
          >

            {loading
              ? 'Processing...'
              : 'Cancel Shipment'
            }

          </button>

        </div>


        {/* ==================================================
            RESULT
        ================================================== */}

        {result && (

          <div className="mt-8 bg-white rounded-xl border border-slate-200 shadow-sm">

            <div className="p-5 border-b border-slate-200">

              <h2 className="text-lg font-semibold text-slate-800">

                Response

              </h2>

            </div>


            <div className="p-5 overflow-auto">

              <pre className="text-xs sm:text-sm text-slate-700 whitespace-pre-wrap break-words">

                {JSON.stringify(
                  result,
                  null,
                  2
                )}

              </pre>

            </div>

          </div>

        )}

      </div>

    </div>

  );

};


// ======================================================
// ACTION CARD
// ======================================================

const ActionCard = ({
  title,
  description,
  buttonText,
  onClick,
  loading,
}) => {

  return (

    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">

      <h2 className="text-lg font-semibold text-slate-800">

        {title}

      </h2>


      <p className="text-sm text-slate-500 mt-2 mb-5">

        {description}

      </p>


      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className="w-full px-4 py-3 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-700 disabled:opacity-50 transition-colors"
      >

        {loading
          ? 'Processing...'
          : buttonText
        }

      </button>

    </div>

  );

};


// ======================================================
// DEFAULT EXPORT
// ======================================================

export default AdminShipping;