const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

const RFQ = require('../models/RFQ');
const Product = require('../models/Product');

// ==============================
// CREATE RFQ
// ==============================

const createRFQ =
  asyncHandler(async (req, res) => {
    const {
      product,
      quantity,
      expectedPrice,
      message,
    } = req.body;

    if (!product) {
      throw new ApiError(
        400,
        'Product is required'
      );
    }

    const requestedQuantity =
      Number(quantity);

    if (
      !Number.isInteger(
        requestedQuantity
      ) ||
      requestedQuantity < 1
    ) {
      throw new ApiError(
        400,
        'Quantity must be a positive whole number'
      );
    }

    // ==============================
    // GET PRODUCT
    // ==============================

    const productData =
      await Product.findById(
        product
      );

    if (!productData) {
      throw new ApiError(
        404,
        'Product not found'
      );
    }

    // ==============================
    // MOQ
    // ==============================

    const moq =
      Number(
        productData.moq || 1
      );

    if (
      requestedQuantity < moq
    ) {
      throw new ApiError(
        400,
        `RFQ quantity must be at least ${moq} pieces`
      );
    }

    // ==============================
    // EXPECTED PRICE
    // ==============================

    let customerExpectedPrice =
      null;

    if (
      expectedPrice !==
        undefined &&
      expectedPrice !== null &&
      expectedPrice !== ''
    ) {
      customerExpectedPrice =
        Number(expectedPrice);

      if (
        !Number.isFinite(
          customerExpectedPrice
        ) ||
        customerExpectedPrice < 0
      ) {
        throw new ApiError(
          400,
          'Expected price must be a valid amount'
        );
      }
    }

    // ==============================
    // CREATE RFQ
    // ==============================

    const rfq =
      await RFQ.create({
        customer:
          req.user._id,

        items: [
          {
            product:
              productData._id,

            productName:
              productData.name,

            quantity:
              requestedQuantity,

            expectedPrice:
              customerExpectedPrice,
          },
        ],

        message:
          message || '',

        totalQuantity:
          requestedQuantity,

        status:
          'pending',
      });

    const populatedRFQ =
      await RFQ.findById(
        rfq._id
      )
        .populate(
          'customer',
          'name email phone businessName'
        )
        .populate(
          'items.product',
          'name sku price moq'
        );

    res.status(201).json(
      new ApiResponse(
        201,
        populatedRFQ,
        'RFQ submitted successfully'
      )
    );
  });

// ==============================
// GET MY RFQs
// ==============================

const getMyRFQs =
  asyncHandler(async (req, res) => {
    const rfqs =
      await RFQ.find({
        customer:
          req.user._id,
      })
        .populate(
          'items.product',
          'name sku images price moq'
        )
        .populate(
          'quotedBy',
          'name email'
        )
        .sort({
          createdAt: -1,
        });

    res.status(200).json(
      new ApiResponse(
        200,
        rfqs,
        'Your RFQs fetched'
      )
    );
  });

// ==============================
// GET RFQ BY ID
// ==============================

const getRFQById =
  asyncHandler(async (req, res) => {
    const rfq =
      await RFQ.findById(
        req.params.id
      )
        .populate(
          'customer',
          'name email phone businessName'
        )
        .populate(
          'items.product',
          'name sku images price moq'
        )
        .populate(
          'quotedBy',
          'name email'
        );

    if (!rfq) {
      throw new ApiError(
        404,
        'RFQ not found'
      );
    }

    const isOwner =
      rfq.customer._id.toString() ===
      req.user._id.toString();

    const isAdmin =
      req.user.role === 'admin';

    if (
      !isOwner &&
      !isAdmin
    ) {
      throw new ApiError(
        403,
        'Not authorized to view this RFQ'
      );
    }

    res.status(200).json(
      new ApiResponse(
        200,
        rfq,
        'RFQ fetched'
      )
    );
  });

// ==============================
// ADMIN: GET ALL RFQs
// ==============================

const getAllRFQs =
  asyncHandler(async (req, res) => {
    const rfqs =
      await RFQ.find({})
        .populate(
          'customer',
          'name email phone businessName'
        )
        .populate(
          'items.product',
          'name sku price moq'
        )
        .populate(
          'quotedBy',
          'name email'
        )
        .sort({
          createdAt: -1,
        });

    res.status(200).json(
      new ApiResponse(
        200,
        rfqs,
        'All RFQs fetched'
      )
    );
  });

// ==============================
// ADMIN: SEND QUOTATION
// ==============================

const quoteRFQ =
  asyncHandler(async (req, res) => {
    const {
      quotedPrice,
      adminMessage,
      quotationValidUntil,
    } = req.body;

    const rfq =
      await RFQ.findById(
        req.params.id
      );

    if (!rfq) {
      throw new ApiError(
        404,
        'RFQ not found'
      );
    }

    if (
      rfq.status !==
        'pending' &&
      rfq.status !==
        'quoted'
    ) {
      throw new ApiError(
        400,
        `RFQ cannot be quoted because its current status is ${rfq.status}`
      );
    }

    const price =
      Number(quotedPrice);

    if (
      !Number.isFinite(price) ||
      price < 0
    ) {
      throw new ApiError(
        400,
        'Quoted price must be a valid amount'
      );
    }

    // ==============================
    // UPDATE ALL ITEMS
    // ==============================

    let totalQuantity = 0;

    let totalQuotationAmount = 0;

    rfq.items =
      rfq.items.map(
        (item) => {
          const quantity =
            Number(
              item.quantity
            );

          const itemTotal =
            quantity * price;

          totalQuantity +=
            quantity;

          totalQuotationAmount +=
            itemTotal;

          item.quotedPrice =
            price;

          item.quotedTotal =
            itemTotal;

          return item;
        }
      );

    rfq.totalQuantity =
      totalQuantity;

    rfq.quotedTotal =
      totalQuotationAmount;

    rfq.adminMessage =
      adminMessage || '';

    rfq.status =
      'quoted';

    rfq.quotedBy =
      req.user._id;

    rfq.quotedAt =
      new Date();

    if (
      quotationValidUntil
    ) {
      const expiryDate =
        new Date(
          quotationValidUntil
        );

      if (
        Number.isNaN(
          expiryDate.getTime()
        )
      ) {
        throw new ApiError(
          400,
          'Invalid quotation expiry date'
        );
      }

      if (
        expiryDate <=
        new Date()
      ) {
        throw new ApiError(
          400,
          'Quotation expiry must be in the future'
        );
      }

      rfq.quotationValidUntil =
        expiryDate;
    }

    const updatedRFQ =
      await rfq.save();

    const populatedRFQ =
      await RFQ.findById(
        updatedRFQ._id
      )
        .populate(
          'customer',
          'name email phone businessName'
        )
        .populate(
          'items.product',
          'name sku images price moq'
        )
        .populate(
          'quotedBy',
          'name email'
        );

    res.status(200).json(
      new ApiResponse(
        200,
        populatedRFQ,
        'Quotation sent successfully'
      )
    );
  });

// ==============================
// CUSTOMER: ACCEPT QUOTATION
// ==============================

const acceptRFQ =
  asyncHandler(async (req, res) => {
    const rfq =
      await RFQ.findById(
        req.params.id
      );

    if (!rfq) {
      throw new ApiError(
        404,
        'RFQ not found'
      );
    }

    if (
      rfq.customer.toString() !==
      req.user._id.toString()
    ) {
      throw new ApiError(
        403,
        'Not authorized to accept this RFQ'
      );
    }

    if (
      rfq.status !==
      'quoted'
    ) {
      throw new ApiError(
        400,
        'Only quoted RFQs can be accepted'
      );
    }

    if (
      rfq.quotationValidUntil &&
      new Date() >
        new Date(
          rfq.quotationValidUntil
        )
    ) {
      rfq.status =
        'expired';

      await rfq.save();

      throw new ApiError(
        400,
        'This quotation has expired'
      );
    }

    rfq.status =
      'accepted';

    rfq.customerResponseAt =
      new Date();

    const updatedRFQ =
      await rfq.save();

    res.status(200).json(
      new ApiResponse(
        200,
        updatedRFQ,
        'Quotation accepted successfully'
      )
    );
  });

// ==============================
// CUSTOMER: REJECT QUOTATION
// ==============================

const rejectRFQ =
  asyncHandler(async (req, res) => {
    const rfq =
      await RFQ.findById(
        req.params.id
      );

    if (!rfq) {
      throw new ApiError(
        404,
        'RFQ not found'
      );
    }

    if (
      rfq.customer.toString() !==
      req.user._id.toString()
    ) {
      throw new ApiError(
        403,
        'Not authorized to reject this RFQ'
      );
    }

    if (
      rfq.status !==
      'quoted'
    ) {
      throw new ApiError(
        400,
        'Only quoted RFQs can be rejected'
      );
    }

    rfq.status =
      'rejected';

    rfq.customerResponseAt =
      new Date();

    const updatedRFQ =
      await rfq.save();

    res.status(200).json(
      new ApiResponse(
        200,
        updatedRFQ,
        'Quotation rejected'
      )
    );
  });

// ==============================
// EXPORT
// ==============================

module.exports = {
  createRFQ,
  getMyRFQs,
  getRFQById,
  getAllRFQs,
  quoteRFQ,
  acceptRFQ,
  rejectRFQ,
};