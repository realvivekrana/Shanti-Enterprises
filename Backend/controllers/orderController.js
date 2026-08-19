const asyncHandler =
  require('../utils/asyncHandler');

const ApiError =
  require('../utils/ApiError');

const ApiResponse =
  require('../utils/ApiResponse');

const Order =
  require('../models/Order');

const Product =
  require('../models/Product');

const razorpay =
  require('../config/razorpay');

const sendEmail =
  require('../utils/sendEmail');

const {
  orderConfirmationTemplate,
} = require('../utils/emailTemplates');

const {
  getWholesaleUnitPrice,
} = require('../utils/wholesalePricing');


// ======================================================
// CREATE ORDER
// ======================================================

const createOrder =
  asyncHandler(
    async (req, res) => {

      const {
        orderItems,
        shippingAddress,
        paymentMethod,
      } = req.body;


      // ==================================================
      // VALIDATION
      // ==================================================

      if (
        !Array.isArray(orderItems) ||
        orderItems.length === 0
      ) {

        throw new ApiError(
          400,
          'No order items'
        );

      }


      if (
        !shippingAddress
      ) {

        throw new ApiError(
          400,
          'Shipping address is required'
        );

      }


      if (
        !paymentMethod
      ) {

        throw new ApiError(
          400,
          'Payment method is required'
        );

      }


      // ==================================================
      // VARIABLES
      // ==================================================

      const validatedOrderItems = [];

      let calculatedItemsPrice =
        0;


      // ==================================================
      // VALIDATE PRODUCTS
      // ==================================================

      for (
        const item of orderItems
      ) {

        if (
          !item.product
        ) {

          throw new ApiError(
            400,
            'Product ID is required'
          );

        }


        const quantity =
          Number(
            item.quantity
          );


        if (
          !Number.isInteger(
            quantity
          ) ||
          quantity < 1
        ) {

          throw new ApiError(
            400,
            'Quantity must be a positive whole number'
          );

        }


        // ----------------------------------------------
        // GET LATEST PRODUCT
        // ----------------------------------------------

        const product =
          await Product.findById(
            item.product
          );


        if (
          !product
        ) {

          throw new ApiError(
            404,
            'Product not found'
          );

        }


        // =================================================
        // MOQ
        // =================================================

        const moq =
          Number(
            product.moq ||
            1
          );


        if (
          quantity < moq
        ) {

          throw new ApiError(
            400,
            `${product.name} requires a minimum order of ${moq} pieces`
          );

        }


        // =================================================
        // STOCK
        // =================================================

        const stock =
          Number(
            product.stock ||
            0
          );


        if (
          quantity > stock
        ) {

          throw new ApiError(
            400,
            `Only ${stock} pieces of ${product.name} are available`
          );

        }


        // =================================================
        // WHOLESALE PRICE
        // =================================================

        let pricing;


        try {

          pricing =
            getWholesaleUnitPrice(
              product,
              quantity
            );

        } catch (error) {

          throw new ApiError(
            400,
            error.message
          );

        }


        const unitPrice =
          Number(
            pricing.unitPrice
          );


        const itemTotal =
          unitPrice *
          quantity;


        calculatedItemsPrice +=
          itemTotal;


        // =================================================
        // SAVE VALIDATED ITEM
        // =================================================

        validatedOrderItems.push({

          product:
            product._id,

          name:
            product.name,

          quantity,

          price:
            unitPrice,

        });

      }


      // ==================================================
      // SHIPPING
      // ==================================================

      const shippingPrice =
        Number(
          req.body.shippingPrice ||
          0
        );


      if (
        !Number.isFinite(
          shippingPrice
        ) ||
        shippingPrice < 0
      ) {

        throw new ApiError(
          400,
          'Invalid shipping price'
        );

      }


      // ==================================================
      // TOTAL
      // ==================================================

      const totalPrice =
        calculatedItemsPrice +
        shippingPrice;


      // ==================================================
      // CREATE ORDER
      // ==================================================

      const order =
        new Order({

          user:
            req.user._id,

          orderItems:
            validatedOrderItems,

          shippingAddress,

          paymentMethod,

          itemsPrice:
            calculatedItemsPrice,

          shippingPrice,

          totalPrice,

        });


      const createdOrder =
        await order.save();


      // ==================================================
      // EMAIL
      // ==================================================

      try {

        await sendEmail({

          to:
            req.user.email,

          subject:
            'Order Confirmation - Shanti Enterprises',

          html:
            orderConfirmationTemplate(
              createdOrder,
              req.user.name
            ),

        });

      } catch (error) {

        console.error(
          'Order email failed:',
          error.message
        );

      }


      // ==================================================
      // RESPONSE
      // ==================================================

      res.status(201).json(

        new ApiResponse(

          201,

          createdOrder,

          'Order created successfully'

        )

      );

    }
  );


// ======================================================
// GET MY ORDERS
// ======================================================

const getMyOrders =
  asyncHandler(
    async (req, res) => {

      const orders =
        await Order.find({

          user:
            req.user._id,

        })
          .sort({

            createdAt:
              -1,

          });


      res.status(200).json(

        new ApiResponse(

          200,

          orders,

          'Your orders fetched'

        )

      );

    }
  );


// ======================================================
// GET ORDER BY ID
// ======================================================

const getOrderById =
  asyncHandler(
    async (req, res) => {

      const order =
        await Order.findById(
          req.params.id
        ).populate(

          'user',

          'name email businessName'

        );


      if (
        !order
      ) {

        throw new ApiError(
          404,
          'Order not found'
        );

      }


      // ==================================================
      // AUTHORIZATION
      // ==================================================

      const isOwner =
        order.user._id.toString() ===
        req.user._id.toString();


      const isAdmin =
        req.user.role ===
        'admin';


      if (
        !isOwner &&
        !isAdmin
      ) {

        throw new ApiError(
          403,
          'Not authorized to view this order'
        );

      }


      res.status(200).json(

        new ApiResponse(

          200,

          order,

          'Order fetched'

        )

      );

    }
  );


// ======================================================
// UPDATE ORDER TO PAID
// ======================================================

const updateOrderToPaid =
  asyncHandler(
    async (req, res) => {

      const order =
        await Order.findById(
          req.params.id
        );


      if (
        !order
      ) {

        throw new ApiError(
          404,
          'Order not found'
        );

      }


      // ==================================================
      // ONLY THE ORDER OWNER OR ADMIN
      // ==================================================

      const isOwner =
        order.user.toString() ===
        req.user._id.toString();


      const isAdmin =
        req.user.role ===
        'admin';


      if (
        !isOwner &&
        !isAdmin
      ) {

        throw new ApiError(
          403,
          'You are not authorized to update this order payment'
        );

      }


      // ==================================================
      // RAZORPAY PAYMENT VERIFICATION
      // ==================================================

      const razorpayPaymentId =
        req.body.id;


      if (
        !razorpayPaymentId
      ) {

        throw new ApiError(
          400,
          'Verified Razorpay payment ID is required'
        );

      }


      let razorpayPayment;


      try {

        razorpayPayment =
          await razorpay.payments.fetch(
            razorpayPaymentId
          );

      } catch (error) {

        throw new ApiError(
          400,
          'Unable to verify payment with Razorpay'
        );

      }


      // ==================================================
      // CAPTURED CHECK
      // ==================================================

      if (
        razorpayPayment?.status !==
        'captured'
      ) {

        throw new ApiError(
          400,
          'Razorpay payment is not captured'
        );

      }


      // ==================================================
      // GET RAZORPAY ORDER ID
      // ==================================================

      const razorpayOrderId =
        razorpayPayment?.order_id;


      if (
        !razorpayOrderId
      ) {

        throw new ApiError(
          400,
          'Razorpay order ID was not found for this payment'
        );

      }


      // ==================================================
      // FETCH RAZORPAY ORDER
      // ==================================================

      let razorpayOrder;


      try {

        razorpayOrder =
          await razorpay.orders.fetch(
            razorpayOrderId
          );

      } catch (error) {

        throw new ApiError(
          400,
          'Unable to verify Razorpay order'
        );

      }


      // ==================================================
      // PAYMENT CUSTOMER CHECK
      // ==================================================

      const paymentCustomerId =
        razorpayOrder?.notes?.customerId;


      if (
        !paymentCustomerId ||
        paymentCustomerId !==
          order.user.toString()
      ) {

        throw new ApiError(
          403,
          'This payment does not belong to this order customer'
        );

      }


      // ==================================================
      // PAYMENT AMOUNT CHECK
      // ==================================================

      const expectedAmount =
        Math.round(

          Number(
            order.totalPrice
          ) *
          100

        );


      if (
        Number(
          razorpayPayment.amount
        ) !==
        expectedAmount
      ) {

        throw new ApiError(
          400,
          'Payment amount does not match the order total'
        );

      }


      // ==================================================
      // ALREADY PAID
      // ==================================================

      if (
        order.isPaid
      ) {

        return res.status(200).json(

          new ApiResponse(

            200,

            order,

            'Order is already marked as paid'

          )

        );

      }


      // ==================================================
      // MARK PAID
      // ==================================================

      order.isPaid =
        true;


      order.paidAt =
        new Date();


      order.paymentResult = {

        id:
          razorpayPaymentId,

        status:
          'success',

        updateTime:
          new Date().toISOString(),

      };


      const updatedOrder =
        await order.save();


      res.status(200).json(

        new ApiResponse(

          200,

          updatedOrder,

          'Order marked as paid'

        )

      );

    }
  );


// ======================================================
// GET ALL ORDERS - ADMIN
// ======================================================

const getAllOrders =
  asyncHandler(
    async (req, res) => {

      const orders =
        await Order.find({})

          .populate(
            'user',
            'name email businessName'
          )

          .sort({

            createdAt:
              -1,

          });


      res.status(200).json(

        new ApiResponse(

          200,

          orders,

          'All orders fetched'

        )

      );

    }
  );


// ======================================================
// UPDATE ORDER STATUS - ADMIN
// ======================================================

const updateOrderStatus =
  asyncHandler(
    async (req, res) => {

      const order =
        await Order.findById(
          req.params.id
        );


      if (
        !order
      ) {

        throw new ApiError(
          404,
          'Order not found'
        );

      }


      if (
        req.body.orderStatus
      ) {

        order.orderStatus =
          req.body.orderStatus;

      }


      if (
        req.body.trackingId !==
        undefined
      ) {

        if (
          !order.shipment
        ) {

          order.shipment =
            {};

        }


        order.shipment.trackingId =
          req.body.trackingId;

      }


      const updatedOrder =
        await order.save();


      res.status(200).json(

        new ApiResponse(

          200,

          updatedOrder,

          'Order status updated'

        )

      );

    }
  );


// ======================================================
// REORDER PREVIOUS ORDER
// ======================================================
//
// POST /api/orders/:id/reorder
//
// Customer previous order ko dobara cart me
// add karne ke liye current product information
// check ki jaati hai.
//
// Checks:
// 1. Order exists
// 2. User owns order
// 3. Product still exists
// 4. Product stock available hai
// 5. MOQ valid hai
// 6. Current wholesale price calculate hota hai
//
// ======================================================

const reorderOrder =
  asyncHandler(
    async (req, res) => {

      // =================================================
      // GET ORIGINAL ORDER
      // =================================================

      const order =
        await Order.findById(
          req.params.id
        );


      if (
        !order
      ) {

        throw new ApiError(
          404,
          'Order not found'
        );

      }


      // =================================================
      // CHECK ORDER OWNER
      // =================================================

      const isOwner =
        order.user.toString() ===
        req.user._id.toString();


      const isAdmin =
        req.user.role ===
        'admin';


      if (
        !isOwner &&
        !isAdmin
      ) {

        throw new ApiError(
          403,
          'You are not authorized to reorder this order'
        );

      }


      // =================================================
      // RESULT ARRAYS
      // =================================================

      const reorderItems = [];

      const unavailableItems = [];


      // =================================================
      // CHECK EACH OLD ORDER ITEM
      // =================================================

      for (
        const oldItem
        of order.orderItems
      ) {

        // -----------------------------------------------
        // PRODUCT ID
        // -----------------------------------------------

        const productId =
          oldItem.product;


        if (
          !productId
        ) {

          unavailableItems.push({

            name:
              oldItem.name ||
              'Unknown Product',

            quantity:
              oldItem.quantity,

            reason:
              'Product ID missing',

          });

          continue;

        }


        // -----------------------------------------------
        // GET CURRENT PRODUCT
        // -----------------------------------------------

        const product =
          await Product.findById(
            productId
          );


        // -----------------------------------------------
        // PRODUCT DELETED
        // -----------------------------------------------

        if (
          !product
        ) {

          unavailableItems.push({

            product:
              productId,

            name:
              oldItem.name ||
              'Unknown Product',

            quantity:
              oldItem.quantity,

            reason:
              'Product is no longer available',

          });

          continue;

        }


        // =================================================
        // OLD QUANTITY
        // =================================================

        const quantity =
          Number(
            oldItem.quantity
          );


        // =================================================
        // CURRENT MOQ
        // =================================================

        const moq =
          Number(
            product.moq ||
            1
          );


        // =================================================
        // CURRENT STOCK
        // =================================================

        const stock =
          Number(
            product.stock ||
            0
          );


        // -----------------------------------------------
        // STOCK CHECK
        // -----------------------------------------------

        if (
          stock < quantity
        ) {

          unavailableItems.push({

            product:
              product._id,

            name:
              product.name,

            quantity,

            availableStock:
              stock,

            reason:
              `Only ${stock} pieces are currently available`,

          });

          continue;

        }


        // -----------------------------------------------
        // MOQ CHECK
        // -----------------------------------------------

        if (
          quantity < moq
        ) {

          unavailableItems.push({

            product:
              product._id,

            name:
              product.name,

            quantity,

            currentMOQ:
              moq,

            reason:
              `Current minimum order quantity is ${moq}`,

          });

          continue;

        }


        // =================================================
        // CURRENT WHOLESALE PRICE
        // =================================================

        let pricing;


        try {

          pricing =
            getWholesaleUnitPrice(
              product,
              quantity
            );

        } catch (error) {

          unavailableItems.push({

            product:
              product._id,

            name:
              product.name,

            quantity,

            reason:
              error.message,

          });

          continue;

        }


        const unitPrice =
          Number(
            pricing.unitPrice
          );


        // =================================================
        // ADD TO REORDER ITEMS
        // =================================================

        reorderItems.push({

          product:
            product._id,

          name:
            product.name,

          quantity,

          price:
            unitPrice,

          image:
            product.images?.[0] ||
            '',

          images:
            product.images ||
            [],

          moq,

          stock,

          gst:
            Number(
              product.gst ||
              0
            ),

          wholesalePricing:
            product.wholesalePricing ||
            [],

          matchedTier:
            pricing.matchedTier ||
            null,

        });

      }


      // ==================================================
      // NO AVAILABLE PRODUCTS
      // ==================================================

      if (
        reorderItems.length ===
        0
      ) {

        return res.status(200).json(

          new ApiResponse(

            200,

            {

              orderId:
                order._id,

              reorderItems:
                [],

              unavailableItems,

              canReorder:
                false,

            },

            'No products are currently available for reorder'

          )

        );

      }


      // ==================================================
      // SUCCESS RESPONSE
      // ==================================================

      res.status(200).json(

        new ApiResponse(

          200,

          {

            orderId:
              order._id,

            reorderItems,

            unavailableItems,

            canReorder:
              true,

            totalItems:
              reorderItems.length,

          },

          'Reorder items prepared successfully'

        )

      );

    }
  );


// ======================================================
// EXPORT
// ======================================================

module.exports = {

  createOrder,

  getMyOrders,

  getOrderById,

  updateOrderToPaid,

  getAllOrders,

  updateOrderStatus,

  reorderOrder,

};