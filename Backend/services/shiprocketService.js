const axios = require('axios');


// ======================================================
// SHIPROCKET CONFIGURATION
// ======================================================

const SHIPROCKET_BASE_URL =
  'https://apiv2.shiprocket.in/v1/external';


// ======================================================
// TOKEN CACHE
// ======================================================

let cachedToken = null;

let tokenExpiresAt = 0;


// ======================================================
// CHECK CONFIGURATION
// ======================================================

const isConfigured = () => {

  return Boolean(

    process.env.SHIPROCKET_EMAIL &&

    process.env.SHIPROCKET_PASSWORD

  );

};


// ======================================================
// GET SHIPROCKET TOKEN
// ======================================================

const getShiprocketToken = async () => {

  // ====================================================
  // CHECK CONFIG
  // ====================================================

  if (!isConfigured()) {

    throw new Error(
      'Shiprocket credentials are missing'
    );

  }


  // ====================================================
  // USE CACHED TOKEN
  // ====================================================

  if (

    cachedToken &&

    Date.now() <
      tokenExpiresAt

  ) {

    return cachedToken;

  }


  // ====================================================
  // LOGIN
  // ====================================================

  try {

    const response =
      await axios.post(

        `${SHIPROCKET_BASE_URL}/auth/login`,

        {

          email:
            process.env.SHIPROCKET_EMAIL,

          password:
            process.env.SHIPROCKET_PASSWORD,

        },

        {

          headers: {

            'Content-Type':
              'application/json',

          },

          timeout: 20000,

        }

      );


    const token =
      response.data?.token;


    if (!token) {

      throw new Error(
        'Shiprocket authentication token not received'
      );

    }


    // ==================================================
    // CACHE TOKEN
    // ==================================================

    cachedToken =
      token;


    // Shiprocket tokens are documented
    // as valid for 240 hours.
    //
    // We keep a small safety buffer and
    // refresh slightly before expiry.

    tokenExpiresAt =
      Date.now() +
      (
        9 * 24 * 60 * 60 * 1000
      );


    return token;

  } catch (error) {

    console.error(
      'Shiprocket authentication failed:',
      error.response?.data ||
      error.message
    );


    throw new Error(

      error.response?.data
        ?.message ||

      'Shiprocket authentication failed'

    );

  }

};


// ======================================================
// AUTHENTICATED REQUEST
// ======================================================

const shiprocketRequest = async ({

  method,

  url,

  data,

  params,

}) => {

  const token =
    await getShiprocketToken();


  try {

    const response =
      await axios({

        method,

        url:
          `${SHIPROCKET_BASE_URL}${url}`,

        data,

        params,

        headers: {

          Authorization:
            `Bearer ${token}`,

          'Content-Type':
            'application/json',

        },

        timeout: 30000,

      });


    return response.data;

  } catch (error) {

    // ==================================================
    // TOKEN EXPIRED / INVALID
    // ==================================================

    if (
      error.response?.status ===
      401
    ) {

      cachedToken =
        null;

      tokenExpiresAt =
        0;


      try {

        const newToken =
          await getShiprocketToken();


        const retryResponse =
          await axios({

            method,

            url:
              `${SHIPROCKET_BASE_URL}${url}`,

            data,

            params,

            headers: {

              Authorization:
                `Bearer ${newToken}`,

              'Content-Type':
                'application/json',

            },

            timeout: 30000,

          });


        return retryResponse.data;

      } catch (retryError) {

        console.error(

          'Shiprocket retry failed:',

          retryError.response?.data ||
          retryError.message

        );


        throw new Error(

          retryError.response?.data
            ?.message ||

          'Shiprocket request failed after token refresh'

        );

      }

    }


    // ==================================================
    // OTHER ERROR
    // ==================================================

    console.error(

      'Shiprocket API error:',

      error.response?.data ||
      error.message

    );


    const apiError =
      error.response?.data;


    throw new Error(

      apiError?.message ||

      apiError?.error ||

      apiError?.errors
        ? JSON.stringify(
            apiError.errors
          )
        :

      'Shiprocket API request failed'

    );

  }

};


// ======================================================
// CREATE SHIPROCKET ORDER
// ======================================================
//
// POST
// /orders/create/adhoc
//
// Shiprocket requires customer,
// address, pickup location,
// order items, payment method,
// amount, weight etc.
//
// ======================================================

const createShiprocketOrder =
  async (order) => {

    // ==================================================
    // CUSTOMER
    // ==================================================

    const customer =
      order.user || {};


    const shipping =
      order.shippingAddress || {};


    const customerName =
      customer.name ||
      'Customer';


    const customerPhone =
      shipping.phone ||
      customer.phone ||
      '9999999999';


    const customerEmail =
      customer.email ||
      '';


    // ==================================================
    // PAYMENT
    // ==================================================

    const paymentMethod =
      String(
        order.paymentMethod ||
        'COD'
      )
        .toUpperCase();


    const isCOD =
      paymentMethod ===
      'COD';


    // ==================================================
    // ORDER ITEMS
    // ==================================================

    const orderItems =
      Array.isArray(
        order.orderItems
      )
        ? order.orderItems
        : [];


    if (
      orderItems.length ===
      0
    ) {

      throw new Error(
        'Order has no products'
      );

    }


    const shiprocketItems =
      orderItems.map(
        (item) => {

          return {

            name:
              item.name ||
              item.product?.name ||
              'Product',

            sku:
              item.product?.sku ||
              String(
                item.product?._id ||
                item.product ||
                'SKU'
              ),

            units:
              Number(
                item.quantity ||
                1
              ),

            selling_price:
              Number(
                item.price ||
                0
              ),

            discount:
              0,

            tax:
              0,

            hsn:
              item.product?.hsn ||
              '',

          };

        }
      );


    // ==================================================
    // TOTAL WEIGHT
    // ==================================================

    let weight =
      Number(
        order.shipment
          ?.totalWeight ||
        0
      );


    // Shiprocket expects weight in KG.
    // If your database stores grams,
    // convert them to KG.

    if (
      order.shipment
        ?.weightUnit ===
      'g'
    ) {

      weight =
        weight /
        1000;

    }


    // Fallback weight
    // for testing / missing product weight.

    if (
      !weight ||
      weight <= 0
    ) {

      weight =
        Number(
          process.env.SHIPROCKET_DEFAULT_WEIGHT_KG ||
          0.5
        );

    }


    // ==================================================
    // PICKUP LOCATION
    // ==================================================

    const pickupLocation =
      process.env.SHIPROCKET_PICKUP_LOCATION;


    if (!pickupLocation) {

      throw new Error(

        'SHIPROCKET_PICKUP_LOCATION is missing in .env'

      );

    }


    // ==================================================
    // ORDER DATE
    // ==================================================

    const orderDate =
      order.createdAt ||
      new Date();


    // ==================================================
    // PAYMENT
    // ==================================================

    const subTotal =
      Number(
        order.itemsPrice ||
        0
      );


    const totalAmount =
      Number(
        order.totalPrice ||
        0
      );


    const codAmount =
      isCOD
        ? totalAmount
        : 0;


    // ==================================================
    // CREATE PAYLOAD
    // ==================================================

    const payload = {

      // ------------------------------------------------
      // ORDER
      // ------------------------------------------------

      order_id:
        String(
          order._id
        ),

      order_date:
        new Date(
          orderDate
        )
          .toISOString()
          .split('T')[0],


      // ------------------------------------------------
      // PICKUP
      // ------------------------------------------------

      pickup_location:
        pickupLocation,


      // ------------------------------------------------
      // BILLING
      // ------------------------------------------------

      billing_customer_name:
        customerName,

      billing_last_name:
        '',

      billing_address:
        shipping.street ||
        '',

      billing_address_2:
        '',

      billing_city:
        shipping.city ||
        '',

      billing_pincode:
        String(
          shipping.pincode ||
          ''
        ),

      billing_state:
        shipping.state ||
        '',

      billing_country:
        'India',

      billing_email:
        customerEmail,

      billing_phone:
        customerPhone,


      // ------------------------------------------------
      // SHIPPING
      // ------------------------------------------------

      shipping_is_billing:
        true,

      shipping_customer_name:
        customerName,

      shipping_last_name:
        '',

      shipping_address:
        shipping.street ||
        '',

      shipping_address_2:
        '',

      shipping_city:
        shipping.city ||
        '',

      shipping_pincode:
        String(
          shipping.pincode ||
          ''
        ),

      shipping_country:
        'India',

      shipping_state:
        shipping.state ||
        '',

      shipping_email:
        customerEmail,

      shipping_phone:
        customerPhone,


      // ------------------------------------------------
      // PRODUCTS
      // ------------------------------------------------

      order_items:
        shiprocketItems,


      // ------------------------------------------------
      // PAYMENT
      // ------------------------------------------------

      payment_method:
        isCOD
          ? 'COD'
          : 'Prepaid',


      // ------------------------------------------------
      // PRICE
      // ------------------------------------------------

      sub_total:
        subTotal,

      length:
        Number(
          process.env.SHIPROCKET_PACKAGE_LENGTH_CM ||
          10
        ),

      breadth:
        Number(
          process.env.SHIPROCKET_PACKAGE_BREADTH_CM ||
          10
        ),

      height:
        Number(
          process.env.SHIPROCKET_PACKAGE_HEIGHT_CM ||
          10
        ),

      weight:


        weight,


      // ------------------------------------------------
      // COD
      // ------------------------------------------------

      cod:
        codAmount,

    };


    // ==================================================
    // API CALL
    // ==================================================

    return shiprocketRequest({

      method:
        'POST',

      url:
        '/orders/create/adhoc',

      data:
        payload,

    });

  };


// ======================================================
// ASSIGN AWB
// ======================================================
//
// POST
// /courier/assign/awb
//
// ======================================================

const assignAWB =
  async ({
    shipmentId,
    courierId,
  }) => {

    if (!shipmentId) {

      throw new Error(
        'Shipment ID is required'
      );

    }


    const payload = {

      shipment_id:
        Number(
          shipmentId
        ),

    };


    if (courierId) {

      payload.courier_id =
        Number(
          courierId
        );

    }


    return shiprocketRequest({

      method:
        'POST',

      url:
        '/courier/assign/awb',

      data:
        payload,

    });

  };


// ======================================================
// REQUEST PICKUP
// ======================================================
//
// POST
// /courier/generate/pickup
//
// ======================================================

const requestPickup =
  async ({
    shipmentId,
    pickupDate,
  }) => {

    if (!shipmentId) {

      throw new Error(
        'Shipment ID is required'
      );

    }


    const payload = {

      shipment_id: [

        Number(
          shipmentId
        ),

      ],

    };


    if (pickupDate) {

      payload.pickup_date = [

        pickupDate,

      ];

    }


    return shiprocketRequest({

      method:
        'POST',

      url:
        '/courier/generate/pickup',

      data:
        payload,

    });

  };


// ======================================================
// TRACK BY AWB
// ======================================================
//
// GET
// /courier/track/awb/:awb
//
// ======================================================

const trackByAWB =
  async (awbCode) => {

    if (!awbCode) {

      throw new Error(
        'AWB code is required'
      );

    }


    return shiprocketRequest({

      method:
        'GET',

      url:
        `/courier/track/awb/${encodeURIComponent(
          awbCode
        )}`,

    });

  };


// ======================================================
// GENERATE LABEL
// ======================================================
//
// POST
// /courier/generate/label
//
// ======================================================

const generateLabel =
  async (shipmentId) => {

    if (!shipmentId) {

      throw new Error(
        'Shipment ID is required'
      );

    }


    return shiprocketRequest({

      method:
        'POST',

      url:
        '/courier/generate/label',

      data: {

        shipment_id: [

          Number(
            shipmentId
          ),

        ],

      },

    });

  };


// ======================================================
// GENERATE INVOICE
// ======================================================
//
// POST
// /orders/print/invoice
//
// ======================================================

const generateInvoice =
  async (shiprocketOrderId) => {

    if (!shiprocketOrderId) {

      throw new Error(
        'Shiprocket Order ID is required'
      );

    }


    return shiprocketRequest({

      method:
        'POST',

      url:
        '/orders/print/invoice',

      data: {

        ids: [

          Number(
            shiprocketOrderId
          ),

        ],

      },

    });

  };


// ======================================================
// CANCEL SHIPMENT
// ======================================================
//
// POST
// /orders/cancel/shipment/awbs
//
// ======================================================

const cancelShipment =
  async (awbCode) => {

    if (!awbCode) {

      throw new Error(
        'AWB code is required'
      );

    }


    return shiprocketRequest({

      method:
        'POST',

      url:
        '/orders/cancel/shipment/awbs',

      data: {

        awbs: [

          String(
            awbCode
          ),

        ],

      },

    });

  };


// ======================================================
// EXPORT
// ======================================================

module.exports = {

  isConfigured,

  getShiprocketToken,

  createShiprocketOrder,

  assignAWB,

  requestPickup,

  trackByAWB,

  generateLabel,

  generateInvoice,

  cancelShipment,

};