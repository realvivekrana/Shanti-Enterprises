// ============================================================
// SHANTI ENTERPRISES
// Admin Quotation Controller
// Phase 6 - Admin
// ============================================================

const Quotation = require("../models/Quotation");
const RFQ = require("../models/RFQ");

// ============================================================
// GENERATE QUOTATION NUMBER
// ============================================================

const generateQuotationNumber = () => {
  const timestamp = Date.now();

  const random = Math.floor(
    1000 + Math.random() * 9000
  );

  return `SE-Q-${timestamp}-${random}`;
};

// ============================================================
// GET ALL QUOTATIONS - ADMIN
// ============================================================

const getAdminQuotations = async (
  req,
  res,
  next
) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = "",
      status = "",
    } = req.query;

    const currentPage = Math.max(
      Number(page) || 1,
      1
    );

    const perPage = Math.min(
      Math.max(Number(limit) || 20, 1),
      100
    );

    const filter = {};

    // --------------------------------------------------------
    // STATUS FILTER
    // --------------------------------------------------------

    if (status.trim()) {
      filter.status = status.trim();
    }

    // --------------------------------------------------------
    // SEARCH
    // --------------------------------------------------------

    if (search.trim()) {
      filter.quotationNumber = {
        $regex: search.trim(),
        $options: "i",
      };
    }

    const skip =
      (currentPage - 1) * perPage;

    const [
      quotations,
      totalQuotations,
    ] = await Promise.all([
      Quotation.find(filter)
        .populate(
          "user",
          "name email phone"
        )
        .populate(
          "rfq",
          "rfqNumber status"
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(perPage),

      Quotation.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(
      totalQuotations / perPage
    );

    res.status(200).json({
      success: true,

      count: quotations.length,

      pagination: {
        page: currentPage,
        limit: perPage,
        totalQuotations,
        totalPages,
      },

      quotations,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// GET SINGLE QUOTATION - ADMIN
// ============================================================

const getAdminQuotationById = async (
  req,
  res,
  next
) => {
  try {
    const quotation =
      await Quotation.findById(
        req.params.id
      )
        .populate(
          "user",
          "name email phone"
        )
        .populate(
          "rfq",
          "rfqNumber status items message"
        )
        .populate(
          "items.product",
          "name slug image price unit"
        );

    if (!quotation) {
      const error = new Error(
        "Quotation not found"
      );

      error.statusCode = 404;

      return next(error);
    }

    res.status(200).json({
      success: true,
      quotation,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// CREATE QUOTATION FROM RFQ - ADMIN
// ============================================================

const createAdminQuotation = async (
  req,
  res,
  next
) => {
  try {
    const {
      rfqId,
      items,
      note = "",
      validUntil = null,
    } = req.body;

    // --------------------------------------------------------
    // BASIC VALIDATION
    // --------------------------------------------------------

    if (!rfqId) {
      const error = new Error(
        "RFQ ID is required"
      );

      error.statusCode = 400;

      return next(error);
    }

    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {
      const error = new Error(
        "At least one quotation item is required"
      );

      error.statusCode = 400;

      return next(error);
    }

    // --------------------------------------------------------
    // FIND RFQ
    // --------------------------------------------------------

    const rfq =
      await RFQ.findById(rfqId);

    if (!rfq) {
      const error = new Error(
        "RFQ not found"
      );

      error.statusCode = 404;

      return next(error);
    }

    // --------------------------------------------------------
    // CHECK RFQ STATUS
    // --------------------------------------------------------
    //
    // Quotation can be created when RFQ is:
    //
    // pending
    // reviewing
    // quoted
    // accepted
    //
    // We allow accepted here because your current test RFQ
    // is already in accepted status.
    // --------------------------------------------------------

    const allowedRFQStatuses = [
      "pending",
      "reviewing",
      "quoted",
      "accepted",
    ];

    if (
      !allowedRFQStatuses.includes(
        rfq.status
      )
    ) {
      const error = new Error(
        `Quotation cannot be created for RFQ with status "${rfq.status}"`
      );

      error.statusCode = 400;

      return next(error);
    }

    // --------------------------------------------------------
    // CHECK EXISTING QUOTATION
    // --------------------------------------------------------

    const existingQuotation =
      await Quotation.findOne({
        rfq: rfq._id,
      });

    if (existingQuotation) {
      const error = new Error(
        "A quotation already exists for this RFQ"
      );

      error.statusCode = 409;

      return next(error);
    }

    // --------------------------------------------------------
    // BUILD QUOTATION ITEMS
    // --------------------------------------------------------

    const quotationItems = [];

    let subtotal = 0;

    for (const requestedItem of items) {
      const {
        productId,
        unitPrice,
      } = requestedItem;

      if (!productId) {
        const error = new Error(
          "Product ID is required for every quotation item"
        );

        error.statusCode = 400;

        return next(error);
      }

      const parsedUnitPrice =
        Number(unitPrice);

      if (
        !Number.isFinite(
          parsedUnitPrice
        ) ||
        parsedUnitPrice < 0
      ) {
        const error = new Error(
          "Valid unit price is required for every quotation item"
        );

        error.statusCode = 400;

        return next(error);
      }

      // ------------------------------------------------------
      // FIND PRODUCT IN RFQ
      // ------------------------------------------------------

      const rfqItem =
        rfq.items.find(
          (item) =>
            item.product.toString() ===
            productId.toString()
        );

      if (!rfqItem) {
        const error = new Error(
          `Product ${productId} is not part of this RFQ`
        );

        error.statusCode = 400;

        return next(error);
      }

      // ------------------------------------------------------
      // CALCULATE TOTAL
      // ------------------------------------------------------

      const totalPrice =
        rfqItem.quantity *
        parsedUnitPrice;

      subtotal += totalPrice;

      quotationItems.push({
        product:
          rfqItem.product,

        productName:
          rfqItem.productName,

        quantity:
          rfqItem.quantity,

        unit:
          rfqItem.unit,

        unitPrice:
          parsedUnitPrice,

        totalPrice,
      });
    }

    // --------------------------------------------------------
    // VALIDATE ALL RFQ ITEMS ARE QUOTED
    // --------------------------------------------------------

    if (
      quotationItems.length !==
      rfq.items.length
    ) {
      const error = new Error(
        "Quotation must include pricing for every RFQ item"
      );

      error.statusCode = 400;

      return next(error);
    }

    // --------------------------------------------------------
    // VALIDATE VALID UNTIL
    // --------------------------------------------------------

    let quotationValidUntil =
      null;

    if (validUntil) {
      const parsedDate =
        new Date(validUntil);

      if (
        Number.isNaN(
          parsedDate.getTime()
        )
      ) {
        const error = new Error(
          "Invalid quotation validity date"
        );

        error.statusCode = 400;

        return next(error);
      }

      if (
        parsedDate <= new Date()
      ) {
        const error = new Error(
          "Quotation validUntil must be a future date"
        );

        error.statusCode = 400;

        return next(error);
      }

      quotationValidUntil =
        parsedDate;
    }

    // --------------------------------------------------------
    // CREATE QUOTATION
    // --------------------------------------------------------

    const quotation =
      await Quotation.create({
        quotationNumber:
          generateQuotationNumber(),

        rfq: rfq._id,

        user: rfq.user,

        items: quotationItems,

        subtotal,

        totalAmount: subtotal,

        note:
          typeof note === "string"
            ? note.trim()
            : "",

        validUntil:
          quotationValidUntil,

        status: "pending",
      });

    // --------------------------------------------------------
    // UPDATE RFQ
    // --------------------------------------------------------

    rfq.status = "quoted";
    rfq.quotedAt = new Date();

    await rfq.save();

    // --------------------------------------------------------
    // RESPONSE
    // --------------------------------------------------------

    res.status(201).json({
      success: true,

      message:
        "Quotation created successfully",

      quotation: {
        id: quotation._id,

        quotationNumber:
          quotation.quotationNumber,

        rfq:
          quotation.rfq,

        user:
          quotation.user,

        items:
          quotation.items,

        subtotal:
          quotation.subtotal,

        totalAmount:
          quotation.totalAmount,

        note:
          quotation.note,

        validUntil:
          quotation.validUntil,

        status:
          quotation.status,

        createdAt:
          quotation.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// UPDATE QUOTATION STATUS - ADMIN
// ============================================================

const updateAdminQuotationStatus =
  async (
    req,
    res,
    next
  ) => {
    try {
      const {
        status,
      } = req.body;

      const allowedStatuses = [
        "pending",
        "sent",
        "accepted",
        "rejected",
        "expired",
      ];

      if (
        !status ||
        !allowedStatuses.includes(
          status
        )
      ) {
        const error = new Error(
          `Invalid quotation status. Allowed values: ${allowedStatuses.join(
            ", "
          )}`
        );

        error.statusCode = 400;

        return next(error);
      }

      const quotation =
        await Quotation.findById(
          req.params.id
        );

      if (!quotation) {
        const error = new Error(
          "Quotation not found"
        );

        error.statusCode = 404;

        return next(error);
      }

      quotation.status =
        status;

      // ------------------------------------------------------
      // STATUS DATES
      // ------------------------------------------------------

      if (
        status === "sent"
      ) {
        quotation.sentAt =
          quotation.sentAt ||
          new Date();
      }

      if (
        status === "accepted"
      ) {
        quotation.acceptedAt =
          quotation.acceptedAt ||
          new Date();
      }

      if (
        status === "rejected"
      ) {
        quotation.rejectedAt =
          quotation.rejectedAt ||
          new Date();
      }

      await quotation.save();

      // ------------------------------------------------------
      // UPDATE RELATED RFQ
      // ------------------------------------------------------

      if (
        status === "sent"
      ) {
        await RFQ.findByIdAndUpdate(
          quotation.rfq,
          {
            $set: {
              status: "quoted",
              quotedAt:
                new Date(),
            },
          }
        );
      }

      if (
        status === "accepted"
      ) {
        await RFQ.findByIdAndUpdate(
          quotation.rfq,
          {
            $set: {
              status: "accepted",
              acceptedAt:
                new Date(),
            },
          }
        );
      }

      if (
        status === "rejected"
      ) {
        await RFQ.findByIdAndUpdate(
          quotation.rfq,
          {
            $set: {
              status: "rejected",
            },
          }
        );
      }

      res.status(200).json({
        success: true,

        message:
          "Quotation status updated successfully",

        quotation: {
          id:
            quotation._id,

          quotationNumber:
            quotation.quotationNumber,

          status:
            quotation.status,

          sentAt:
            quotation.sentAt,

          acceptedAt:
            quotation.acceptedAt,

          rejectedAt:
            quotation.rejectedAt,
        },
      });
    } catch (error) {
      next(error);
    }
  };

// ============================================================
// CANCEL QUOTATION - ADMIN
// ============================================================

const cancelAdminQuotation =
  async (
    req,
    res,
    next
  ) => {
    try {
      const quotation =
        await Quotation.findById(
          req.params.id
        );

      if (!quotation) {
        const error = new Error(
          "Quotation not found"
        );

        error.statusCode = 404;

        return next(error);
      }

      if (
        [
          "accepted",
          "rejected",
          "expired",
        ].includes(
          quotation.status
        )
      ) {
        const error = new Error(
          "This quotation cannot be cancelled"
        );

        error.statusCode = 400;

        return next(error);
      }

      const rfq =
        await RFQ.findById(
          quotation.rfq
        );

      quotation.status =
        "rejected";

      quotation.rejectedAt =
        new Date();

      await quotation.save();

      // ------------------------------------------------------
      // UPDATE RFQ
      // ------------------------------------------------------

      if (
        rfq &&
        rfq.status !==
          "accepted"
      ) {
        rfq.status =
          "rejected";

        await rfq.save();
      }

      res.status(200).json({
        success: true,

        message:
          "Quotation cancelled successfully",

        quotation: {
          id:
            quotation._id,

          quotationNumber:
            quotation.quotationNumber,

          status:
            quotation.status,

          rejectedAt:
            quotation.rejectedAt,
        },
      });
    } catch (error) {
      next(error);
    }
  };

// ============================================================
// EXPORT
// ============================================================

module.exports = {
  getAdminQuotations,
  getAdminQuotationById,
  createAdminQuotation,
  updateAdminQuotationStatus,
  cancelAdminQuotation,
};