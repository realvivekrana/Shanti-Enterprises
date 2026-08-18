const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

const Quotation =
  require('../models/Quotation');

const RFQ =
  require('../models/RFQ');

const Product =
  require('../models/Product');

// ==============================
// CREATE QUOTATION FROM RFQ
// ADMIN / SUPPLIER
// ==============================

const createQuotation =
  asyncHandler(async (req, res) => {
    const {
      rfqId,
      offeredPrice,
      expiryDate,
      message,
    } = req.body;

    if (!rfqId) {
      throw new ApiError(
        400,
        'RFQ ID is required'
      );
    }

    const price =
      Number(offeredPrice);

    if (
      !Number.isFinite(price) ||
      price < 0
    ) {
      throw new ApiError(
        400,
        'Offered price must be a valid amount'
      );
    }

    // ==============================
    // GET RFQ
    // ==============================

    const rfq =
      await RFQ.findById(
        rfqId
      );

    if (!rfq) {
      throw new ApiError(
        404,
        'RFQ not found'
      );
    }

    // ==============================
    // CHECK RFQ STATUS
    // ==============================

    if (
      rfq.status ===
        'rejected' ||
      rfq.status ===
        'cancelled' ||
      rfq.status ===
        'expired'
    ) {
      throw new ApiError(
        400,
        'Quotation cannot be created for this RFQ'
      );
    }

    // ==============================
    // EXPIRY DATE
    // ==============================

    let quotationExpiry;

    if (expiryDate) {
      quotationExpiry =
        new Date(
          expiryDate
        );
    } else {
      quotationExpiry =
        new Date();

      quotationExpiry.setDate(
        quotationExpiry.getDate() +
          7
      );
    }

    if (
      Number.isNaN(
        quotationExpiry.getTime()
      )
    ) {
      throw new ApiError(
        400,
        'Invalid expiry date'
      );
    }

    if (
      quotationExpiry <=
      new Date()
    ) {
      throw new ApiError(
        400,
        'Expiry date must be in the future'
      );
    }

    // ==============================
    // CREATE PRODUCTS
    // ==============================

    const quotationProducts =
      [];

    let totalQuantity = 0;

    let totalAmount = 0;

    for (
      const rfqItem of rfq.items
    ) {
      const product =
        await Product.findById(
          rfqItem.product
        );

      if (!product) {
        throw new ApiError(
          404,
          `Product not found: ${rfqItem.productName}`
        );
      }

      const quantity =
        Number(
          rfqItem.quantity
        );

      const itemTotal =
        quantity * price;

      totalQuantity +=
        quantity;

      totalAmount +=
        itemTotal;

      quotationProducts.push({
        product:
          product._id,

        productName:
          product.name,

        quantity,

        offeredPrice:
          price,

        finalPrice:
          price,

        totalAmount:
          itemTotal,
      });
    }

    // ==============================
    // CREATE QUOTATION
    // ==============================

    const quotation =
      await Quotation.create({
        rfqId:
          rfq._id,

        customerId:
          rfq.customer,

        supplierId:
          req.user._id,

        products:
          quotationProducts,

        quantity:
          totalQuantity,

        offeredPrice:
          price,

        finalPrice:
          price,

        totalAmount,

        status:
          'offered',

        expiryDate:
          quotationExpiry,

        negotiationHistory: [
          {
            offeredBy:
              req.user._id,

            offeredByRole:
              req.user.role,

            price,

            message:
              message || '',
          },
        ],
      });

    const populatedQuotation =
      await Quotation.findById(
        quotation._id
      )
        .populate(
          'customerId',
          'name email phone businessName'
        )
        .populate(
          'supplierId',
          'name email businessName'
        )
        .populate(
          'products.product',
          'name sku images'
        );

    // Update RFQ
    rfq.status =
      'quoted';

    rfq.quotedBy =
      req.user._id;

    rfq.quotedAt =
      new Date();

    await rfq.save();

    res.status(201).json(
      new ApiResponse(
        201,
        populatedQuotation,
        'Quotation created successfully'
      )
    );
  });

// ==============================
// GET MY CUSTOMER QUOTATIONS
// ==============================

const getMyQuotations =
  asyncHandler(async (req, res) => {
    const quotations =
      await Quotation.find({
        customerId:
          req.user._id,
      })
        .populate(
          'supplierId',
          'name email businessName'
        )
        .populate(
          'products.product',
          'name sku images'
        )
        .sort({
          createdAt: -1,
        });

    res.status(200).json(
      new ApiResponse(
        200,
        quotations,
        'Your quotations fetched'
      )
    );
  });

// ==============================
// GET SUPPLIER QUOTATIONS
// ==============================

const getSupplierQuotations =
  asyncHandler(async (req, res) => {
    const quotations =
      await Quotation.find({
        supplierId:
          req.user._id,
      })
        .populate(
          'customerId',
          'name email phone businessName'
        )
        .populate(
          'products.product',
          'name sku images'
        )
        .sort({
          createdAt: -1,
        });

    res.status(200).json(
      new ApiResponse(
        200,
        quotations,
        'Supplier quotations fetched'
      )
    );
  });

// ==============================
// GET QUOTATION BY ID
// ==============================

const getQuotationById =
  asyncHandler(async (req, res) => {
    const quotation =
      await Quotation.findById(
        req.params.id
      )
        .populate(
          'customerId',
          'name email phone businessName'
        )
        .populate(
          'supplierId',
          'name email businessName'
        )
        .populate(
          'products.product',
          'name sku images price'
        )
        .populate(
          'negotiationHistory.offeredBy',
          'name email role'
        );

    if (!quotation) {
      throw new ApiError(
        404,
        'Quotation not found'
      );
    }

    const isCustomer =
      quotation.customerId._id.toString() ===
      req.user._id.toString();

    const isSupplier =
      quotation.supplierId._id.toString() ===
      req.user._id.toString();

    const isAdmin =
      req.user.role ===
      'admin';

    if (
      !isCustomer &&
      !isSupplier &&
      !isAdmin
    ) {
      throw new ApiError(
        403,
        'Not authorized to view this quotation'
      );
    }

    res.status(200).json(
      new ApiResponse(
        200,
        quotation,
        'Quotation fetched'
      )
    );
  });

// ==============================
// COUNTER OFFER
// ==============================

const counterOffer =
  asyncHandler(async (req, res) => {
    const {
      price,
      message,
    } = req.body;

    const quotation =
      await Quotation.findById(
        req.params.id
      );

    if (!quotation) {
      throw new ApiError(
        404,
        'Quotation not found'
      );
    }

    // ==============================
    // CHECK EXPIRY
    // ==============================

    if (
      new Date() >
      new Date(
        quotation.expiryDate
      )
    ) {
      quotation.status =
        'expired';

      await quotation.save();

      throw new ApiError(
        400,
        'This quotation has expired'
      );
    }

    // ==============================
    // CHECK STATUS
    // ==============================

    if (
      quotation.status ===
        'accepted' ||
      quotation.status ===
        'rejected' ||
      quotation.status ===
        'expired' ||
      quotation.status ===
        'cancelled'
    ) {
      throw new ApiError(
        400,
        'Negotiation is no longer available for this quotation'
      );
    }

    // ==============================
    // PRICE
    // ==============================

    const counterPrice =
      Number(price);

    if (
      !Number.isFinite(
        counterPrice
      ) ||
      counterPrice < 0
    ) {
      throw new ApiError(
        400,
        'Counter offer price must be valid'
      );
    }

    // ==============================
    // AUTHORIZATION
    // ==============================

    const isCustomer =
      quotation.customerId.toString() ===
      req.user._id.toString();

    const isSupplier =
      quotation.supplierId.toString() ===
      req.user._id.toString();

    const isAdmin =
      req.user.role ===
      'admin';

    if (
      !isCustomer &&
      !isSupplier &&
      !isAdmin
    ) {
      throw new ApiError(
        403,
        'Not authorized to negotiate this quotation'
      );
    }

    // ==============================
    // ADD NEGOTIATION ENTRY
    // ==============================

    quotation.negotiationHistory.push({
      offeredBy:
        req.user._id,

      offeredByRole:
        req.user.role,

      price:
        counterPrice,

      message:
        message || '',
    });

    // ==============================
    // UPDATE CURRENT PRICE
    // ==============================

    quotation.offeredPrice =
      counterPrice;

    quotation.finalPrice =
      counterPrice;

    quotation.totalAmount =
      quotation.quantity *
      counterPrice;

    quotation.products =
      quotation.products.map(
        (item) => ({
          ...item.toObject(),

          offeredPrice:
            counterPrice,

          finalPrice:
            counterPrice,

          totalAmount:
            item.quantity *
            counterPrice,
        })
      );

    quotation.status =
      'negotiating';

    quotation.respondedAt =
      new Date();

    const updatedQuotation =
      await quotation.save();

    const populatedQuotation =
      await Quotation.findById(
        updatedQuotation._id
      )
        .populate(
          'customerId',
          'name email phone businessName'
        )
        .populate(
          'supplierId',
          'name email businessName'
        )
        .populate(
          'negotiationHistory.offeredBy',
          'name email role'
        );

    res.status(200).json(
      new ApiResponse(
        200,
        populatedQuotation,
        'Counter offer submitted successfully'
      )
    );
  });

// ==============================
// ACCEPT QUOTATION
// ==============================

const acceptQuotation =
  asyncHandler(async (req, res) => {
    const quotation =
      await Quotation.findById(
        req.params.id
      );

    if (!quotation) {
      throw new ApiError(
        404,
        'Quotation not found'
      );
    }

    // Only customer can accept
    if (
      quotation.customerId.toString() !==
      req.user._id.toString()
    ) {
      throw new ApiError(
        403,
        'Only the customer can accept this quotation'
      );
    }

    if (
      new Date() >
      new Date(
        quotation.expiryDate
      )
    ) {
      quotation.status =
        'expired';

      await quotation.save();

      throw new ApiError(
        400,
        'Quotation has expired'
      );
    }

    if (
      quotation.status ===
        'accepted' ||
      quotation.status ===
        'rejected' ||
      quotation.status ===
        'expired'
    ) {
      throw new ApiError(
        400,
        'Quotation cannot be accepted in its current status'
      );
    }

    quotation.finalPrice =
      quotation.offeredPrice;

    quotation.status =
      'accepted';

    quotation.acceptedAt =
      new Date();

    quotation.respondedAt =
      new Date();

    const updatedQuotation =
      await quotation.save();

    res.status(200).json(
      new ApiResponse(
        200,
        updatedQuotation,
        'Quotation accepted successfully'
      )
    );
  });

// ==============================
// REJECT QUOTATION
// ==============================

const rejectQuotation =
  asyncHandler(async (req, res) => {
    const quotation =
      await Quotation.findById(
        req.params.id
      );

    if (!quotation) {
      throw new ApiError(
        404,
        'Quotation not found'
      );
    }

    if (
      quotation.customerId.toString() !==
      req.user._id.toString()
    ) {
      throw new ApiError(
        403,
        'Only the customer can reject this quotation'
      );
    }

    if (
      quotation.status ===
        'accepted' ||
      quotation.status ===
        'rejected'
    ) {
      throw new ApiError(
        400,
        'Quotation already has a final response'
      );
    }

    quotation.status =
      'rejected';

    quotation.rejectedAt =
      new Date();

    quotation.respondedAt =
      new Date();

    const updatedQuotation =
      await quotation.save();

    res.status(200).json(
      new ApiResponse(
        200,
        updatedQuotation,
        'Quotation rejected successfully'
      )
    );
  });

// ==============================
// EXPORT
// ==============================

module.exports = {
  createQuotation,
  getMyQuotations,
  getSupplierQuotations,
  getQuotationById,
  counterOffer,
  acceptQuotation,
  rejectQuotation,
};