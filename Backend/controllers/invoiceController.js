const PDFDocument =
  require('pdfkit');

const asyncHandler =
  require('../utils/asyncHandler');

const ApiError =
  require('../utils/ApiError');

const ApiResponse =
  require('../utils/ApiResponse');

const Invoice =
  require('../models/Invoice');

const Order =
  require('../models/Order');

const User =
  require('../models/User');

const Product =
  require('../models/Product');

// ==============================
// SELLER DETAILS
// ==============================
//
// Keep these in .env for production.
//
// SHANTI_ENTERPRISES_NAME
// SHANTI_ENTERPRISES_GSTIN
// SHANTI_ENTERPRISES_ADDRESS
// SHANTI_ENTERPRISES_CITY
// SHANTI_ENTERPRISES_STATE
// SHANTI_ENTERPRISES_PINCODE
// SHANTI_ENTERPRISES_PHONE
// SHANTI_ENTERPRISES_EMAIL
//
// SHANTI_ENTERPRISES_STATE is especially
// important for CGST/SGST vs IGST.
//

const getSellerDetails = () => {
  return {
    name:
      process.env.SHANTI_ENTERPRISES_NAME ||
      'Shanti Enterprises',

    address: {
      addressLine1:
        process.env.SHANTI_ENTERPRISES_ADDRESS ||
        '',

      city:
        process.env.SHANTI_ENTERPRISES_CITY ||
        '',

      state:
        process.env.SHANTI_ENTERPRISES_STATE ||
        '',

      pincode:
        process.env.SHANTI_ENTERPRISES_PINCODE ||
        '',

      country:
        'India',
    },

    gstin:
      process.env.SHANTI_ENTERPRISES_GSTIN ||
      '',

    phone:
      process.env.SHANTI_ENTERPRISES_PHONE ||
      '',

    email:
      process.env.SHANTI_ENTERPRISES_EMAIL ||
      '',
  };
};

// ==============================
// ROUND MONEY
// ==============================

const roundMoney = (value) => {
  return Math.round(
    Number(value) * 100
  ) / 100;
};

// ==============================
// NORMALIZE STATE
// ==============================

const normalizeState = (
  state
) => {
  return String(
    state || ''
  )
    .trim()
    .toLowerCase();
};

// ==============================
// GENERATE INVOICE NUMBER
// ==============================

const generateInvoiceNumber =
  async () => {
    const year =
      new Date().getFullYear();

    const lastInvoice =
      await Invoice.findOne({
        invoiceNumber: {
          $regex: `^SE-${year}-`,
        },
      })
        .sort({
          createdAt: -1,
        })
        .select(
          'invoiceNumber'
        );

    let nextNumber = 1;

    if (
      lastInvoice &&
      lastInvoice.invoiceNumber
    ) {
      const parts =
        lastInvoice.invoiceNumber.split(
          '-'
        );

      const lastNumber =
        Number(
          parts[parts.length - 1]
        );

      if (
        Number.isFinite(
          lastNumber
        )
      ) {
        nextNumber =
          lastNumber + 1;
      }
    }

    return `SE-${year}-${String(
      nextNumber
    ).padStart(6, '0')}`;
  };

// ==============================
// BUILD INVOICE DATA
// ==============================

const buildInvoiceData =
  async (orderId) => {
    const order =
      await Order.findById(
        orderId
      ).populate(
        'user'
      );

    if (!order) {
      throw new ApiError(
        404,
        'Order not found'
      );
    }

    const user =
      order.user;

    if (!user) {
      throw new ApiError(
        404,
        'Customer information not found'
      );
    }

    const productIds =
      order.orderItems.map(
        (item) =>
          item.product
      );

    const products =
      await Product.find({
        _id: {
          $in: productIds,
        },
      });

    const productMap =
      new Map();

    products.forEach(
      (product) => {
        productMap.set(
          product._id.toString(),
          product
        );
      }
    );

    const seller =
      getSellerDetails();

    const buyerAddress =
      user.addresses?.billing ||
      user.addresses?.business ||
      {};

    // ==============================
    // GST TYPE
    // ==============================

    const sellerState =
      normalizeState(
        seller.address.state
      );

    const buyerState =
      normalizeState(
        order.shippingAddress?.state ||
          buyerAddress.state
      );

    let taxType =
      'NONE';

    if (
      sellerState &&
      buyerState
    ) {
      taxType =
        sellerState ===
        buyerState
          ? 'CGST_SGST'
          : 'IGST';
    }

    // ==============================
    // ITEMS
    // ==============================

    const invoiceItems = [];

    let subtotal = 0;
    let totalDiscount = 0;
    let taxableAmount = 0;
    let totalCGST = 0;
    let totalSGST = 0;
    let totalIGST = 0;

    for (
      const orderItem of order.orderItems
    ) {
      const product =
        productMap.get(
          orderItem.product.toString()
        );

      const quantity =
        Number(
          orderItem.quantity
        );

      const rate =
        Number(
          orderItem.price
        );

      const itemSubtotal =
        rate * quantity;

      // Current Order model doesn't
      // store a separate discount.
      const discount = 0;

      const itemTaxableAmount =
        itemSubtotal -
        discount;

      const gstRate =
        Number(
          product?.gst || 0
        );

      let cgstRate = 0;
      let cgstAmount = 0;

      let sgstRate = 0;
      let sgstAmount = 0;

      let igstRate = 0;
      let igstAmount = 0;

      if (
        gstRate > 0 &&
        taxType ===
          'CGST_SGST'
      ) {
        cgstRate =
          gstRate / 2;

        sgstRate =
          gstRate / 2;

        cgstAmount =
          roundMoney(
            itemTaxableAmount *
              cgstRate /
              100
          );

        sgstAmount =
          roundMoney(
            itemTaxableAmount *
              sgstRate /
              100
          );

        totalCGST +=
          cgstAmount;

        totalSGST +=
          sgstAmount;
      }

      if (
        gstRate > 0 &&
        taxType === 'IGST'
      ) {
        igstRate =
          gstRate;

        igstAmount =
          roundMoney(
            itemTaxableAmount *
              igstRate /
              100
          );

        totalIGST +=
          igstAmount;
      }

      const itemTax =
        cgstAmount +
        sgstAmount +
        igstAmount;

      const itemTotal =
        itemTaxableAmount +
        itemTax;

      subtotal +=
        itemSubtotal;

      totalDiscount +=
        discount;

      taxableAmount +=
        itemTaxableAmount;

      invoiceItems.push({
        product:
          orderItem.product,

        name:
          orderItem.name ||
          product?.name ||
          '',

        sku:
          product?.sku ||
          '',

        quantity,

        rate,

        discount,

        taxableAmount:
          roundMoney(
            itemTaxableAmount
          ),

        gstRate,

        cgstRate,
        cgstAmount,

        sgstRate,
        sgstAmount,

        igstRate,
        igstAmount,

        totalAmount:
          roundMoney(
            itemTotal
          ),
      });
    }

    // ==============================
    // SHIPPING
    // ==============================

    const shippingAmount =
      Number(
        order.shippingPrice || 0
      );

    const grandTotal =
      roundMoney(
        taxableAmount +
          totalCGST +
          totalSGST +
          totalIGST +
          shippingAmount
      );

    return {
      order,
      user,

      seller,

      buyer: {
        name:
          user.name,

        businessName:
          user.businessName ||
          '',

        gstin:
          user.gstNumber ||
          '',

        address: {
          addressLine1:
            buyerAddress.addressLine1 ||
            order.shippingAddress?.street ||
            '',

          addressLine2:
            buyerAddress.addressLine2 ||
            '',

          street:
            order.shippingAddress?.street ||
            '',

          city:
            buyerAddress.city ||
            order.shippingAddress?.city ||
            '',

          state:
            buyerAddress.state ||
            order.shippingAddress?.state ||
            '',

          pincode:
            buyerAddress.pincode ||
            order.shippingAddress?.pincode ||
            '',

          country:
            buyerAddress.country ||
            'India',

          phone:
            order.shippingAddress?.phone ||
            user.phone ||
            '',
        },

        phone:
          user.phone ||
          '',

        email:
          user.email ||
          '',
      },

      items:
        invoiceItems,

      subtotal:
        roundMoney(
          subtotal
        ),

      totalDiscount:
        roundMoney(
          totalDiscount
        ),

      taxableAmount:
        roundMoney(
          taxableAmount
        ),

      totalCGST:
        roundMoney(
          totalCGST
        ),

      totalSGST:
        roundMoney(
          totalSGST
        ),

      totalIGST:
        roundMoney(
          totalIGST
        ),

      shippingAmount:
        roundMoney(
          shippingAmount
        ),

      grandTotal,

      taxType,

      paymentMethod:
        order.paymentMethod,
    };
  };

// ==============================
// GET / CREATE INVOICE
// ==============================

const getOrCreateInvoice =
  asyncHandler(async (req, res) => {
    const orderId =
      req.params.orderId;

    const order =
      await Order.findById(
        orderId
      );

    if (!order) {
      throw new ApiError(
        404,
        'Order not found'
      );
    }

    // ==============================
    // AUTHORIZATION
    // ==============================

    const isAdmin =
      req.user.role ===
      'admin';

    const isOwner =
      order.user.toString() ===
      req.user._id.toString();

    if (
      !isOwner &&
      !isAdmin
    ) {
      throw new ApiError(
        403,
        'Not authorized to access this invoice'
      );
    }

    // ==============================
    // EXISTING INVOICE
    // ==============================

    let invoice =
      await Invoice.findOne({
        order:
          orderId,
      });

    if (invoice) {
      return res.status(200).json(
        new ApiResponse(
          200,
          invoice,
          'Invoice fetched'
        )
      );
    }

    // ==============================
    // BUILD DATA
    // ==============================

    const data =
      await buildInvoiceData(
        orderId
      );

    // ==============================
    // GENERATE NUMBER
    // ==============================

    const invoiceNumber =
      await generateInvoiceNumber();

    // ==============================
    // CREATE
    // ==============================

    invoice =
      await Invoice.create({
        invoiceNumber,

        invoiceDate:
          new Date(),

        order:
          orderId,

        customer:
          data.user._id,

        seller:
          data.seller,

        buyer:
          data.buyer,

        items:
          data.items,

        subtotal:
          data.subtotal,

        totalDiscount:
          data.totalDiscount,

        taxableAmount:
          data.taxableAmount,

        totalCGST:
          data.totalCGST,

        totalSGST:
          data.totalSGST,

        totalIGST:
          data.totalIGST,

        shippingAmount:
          data.shippingAmount,

        grandTotal:
          data.grandTotal,

        taxType:
          data.taxType,

        paymentMethod:
          data.paymentMethod,
      });

    res.status(201).json(
      new ApiResponse(
        201,
        invoice,
        'Invoice generated successfully'
      )
    );
  });

// ==============================
// DOWNLOAD INVOICE PDF
// ==============================

const downloadInvoicePDF =
  asyncHandler(async (req, res) => {
    const orderId =
      req.params.orderId;

    const order =
      await Order.findById(
        orderId
      );

    if (!order) {
      throw new ApiError(
        404,
        'Order not found'
      );
    }

    // ==============================
    // AUTHORIZATION
    // ==============================

    const isAdmin =
      req.user.role ===
      'admin';

    const isOwner =
      order.user.toString() ===
      req.user._id.toString();

    if (
      !isOwner &&
      !isAdmin
    ) {
      throw new ApiError(
        403,
        'Not authorized to download this invoice'
      );
    }

    // ==============================
    // GET EXISTING INVOICE
    // ==============================

    let invoice =
      await Invoice.findOne({
        order:
          orderId,
      });

    // ==============================
    // CREATE IF NOT EXISTS
    // ==============================

    if (!invoice) {
      const data =
        await buildInvoiceData(
          orderId
        );

      const invoiceNumber =
        await generateInvoiceNumber();

      invoice =
        await Invoice.create({
          invoiceNumber,

          invoiceDate:
            new Date(),

          order:
            orderId,

          customer:
            data.user._id,

          seller:
            data.seller,

          buyer:
            data.buyer,

          items:
            data.items,

          subtotal:
            data.subtotal,

          totalDiscount:
            data.totalDiscount,

          taxableAmount:
            data.taxableAmount,

          totalCGST:
            data.totalCGST,

          totalSGST:
            data.totalSGST,

          totalIGST:
            data.totalIGST,

          shippingAmount:
            data.shippingAmount,

          grandTotal:
            data.grandTotal,

          taxType:
            data.taxType,

          paymentMethod:
            data.paymentMethod,
        });
    }

    // ==============================
    // PDF RESPONSE
    // ==============================

    res.setHeader(
      'Content-Type',
      'application/pdf'
    );

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${invoice.invoiceNumber}.pdf"`
    );

    const doc =
      new PDFDocument({
        size: 'A4',
        margin: 40,
      });

    doc.pipe(res);

    // ==============================
    // HEADER
    // ==============================

    doc
      .fontSize(20)
      .font('Helvetica-Bold')
      .text(
        invoice.seller.name,
        {
          align: 'center',
        }
      );

    doc
      .fontSize(10)
      .font('Helvetica')
      .text(
        invoice.seller.address
          .addressLine1 ||
          '',
        {
          align: 'center',
        }
      );

    doc.text(
      `${invoice.seller.address.city || ''}, ${
        invoice.seller.address.state || ''
      } - ${
        invoice.seller.address.pincode || ''
      }`,
      {
        align: 'center',
      }
    );

    doc.text(
      `GSTIN: ${
        invoice.seller.gstin ||
        'N/A'
      }`,
      {
        align: 'center',
      }
    );

    doc.text(
      `Phone: ${
        invoice.seller.phone ||
        'N/A'
      } | Email: ${
        invoice.seller.email ||
        'N/A'
      }`,
      {
        align: 'center',
      }
    );

    doc.moveDown();

    // ==============================
    // TAX INVOICE TITLE
    // ==============================

    doc
      .fontSize(16)
      .font('Helvetica-Bold')
      .text(
        'TAX INVOICE',
        {
          align: 'center',
        }
      );

    doc.moveDown();

    // ==============================
    // INVOICE DETAILS
    // ==============================

    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .text(
        `Invoice Number: ${invoice.invoiceNumber}`
      );

    doc
      .font('Helvetica')
      .text(
        `Invoice Date: ${new Date(
          invoice.invoiceDate
        ).toLocaleDateString('en-IN')}`
      );

    doc.text(
      `Order ID: ${invoice.order}`
    );

    doc.text(
      `Payment Method: ${invoice.paymentMethod}`
    );

    doc.moveDown();

    // ==============================
    // BUYER
    // ==============================

    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text(
        'BILL TO'
      );

    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .text(
        invoice.buyer.businessName ||
        invoice.buyer.name
      );

    doc
      .font('Helvetica')
      .text(
        `Customer: ${invoice.buyer.name}`
      );

    doc.text(
      `GSTIN: ${
        invoice.buyer.gstin ||
        'Unregistered'
      }`
    );

    doc.text(
      invoice.buyer.address
        .addressLine1 ||
        ''
    );

    doc.text(
      `${invoice.buyer.address.city || ''}, ${
        invoice.buyer.address.state || ''
      } - ${
        invoice.buyer.address.pincode || ''
      }`
    );

    doc.text(
      `Phone: ${
        invoice.buyer.phone ||
        'N/A'
      }`
    );

    doc.moveDown();

    // ==============================
    // TABLE HEADER
    // ==============================

    const tableTop =
      doc.y;

    doc
      .font('Helvetica-Bold')
      .fontSize(8);

    doc.text(
      'Product',
      40,
      tableTop,
      {
        width: 110,
      }
    );

    doc.text(
      'SKU',
      150,
      tableTop,
      {
        width: 70,
      }
    );

    doc.text(
      'Qty',
      220,
      tableTop,
      {
        width: 35,
      }
    );

    doc.text(
      'Rate',
      255,
      tableTop,
      {
        width: 55,
      }
    );

    doc.text(
      'Taxable',
      310,
      tableTop,
      {
        width: 65,
      }
    );

    doc.text(
      'GST',
      375,
      tableTop,
      {
        width: 45,
      }
    );

    doc.text(
      'Total',
      420,
      tableTop,
      {
        width: 75,
      }
    );

    doc
      .moveTo(
        40,
        tableTop + 15
      )
      .lineTo(
        520,
        tableTop + 15
      )
      .stroke();

    // ==============================
    // TABLE ITEMS
    // ==============================

    let currentY =
      tableTop + 22;

    doc
      .font('Helvetica')
      .fontSize(8);

    invoice.items.forEach(
      (item) => {
        // Avoid overlapping rows
        if (
          currentY >
          720
        ) {
          doc.addPage();

          currentY = 50;
        }

        const totalTax =
          item.cgstAmount +
          item.sgstAmount +
          item.igstAmount;

        doc.text(
          item.name,
          40,
          currentY,
          {
            width: 110,
          }
        );

        doc.text(
          item.sku,
          150,
          currentY,
          {
            width: 70,
          }
        );

        doc.text(
          String(
            item.quantity
          ),
          220,
          currentY,
          {
            width: 35,
          }
        );

        doc.text(
          `₹${item.rate.toFixed(2)}`,
          255,
          currentY,
          {
            width: 55,
          }
        );

        doc.text(
          `₹${item.taxableAmount.toFixed(
            2
          )}`,
          310,
          currentY,
          {
            width: 65,
          }
        );

        doc.text(
          `${item.gstRate}%`,
          375,
          currentY,
          {
            width: 45,
          }
        );

        doc.text(
          `₹${item.totalAmount.toFixed(
            2
          )}`,
          420,
          currentY,
          {
            width: 75,
          }
        );

        currentY += 35;
      }
    );

    // ==============================
    // SUMMARY
    // ==============================

    if (
      currentY >
      650
    ) {
      doc.addPage();

      currentY = 50;
    }

    currentY += 10;

    doc
      .moveTo(
        300,
        currentY
      )
      .lineTo(
        520,
        currentY
      )
      .stroke();

    currentY += 15;

    const addSummaryLine =
      (
        label,
        value
      ) => {
        doc
          .font('Helvetica')
          .fontSize(10)
          .text(
            label,
            330,
            currentY,
            {
              width: 100,
            }
          );

        doc.text(
          `₹${Number(
            value
          ).toFixed(2)}`,
          430,
          currentY,
          {
            width: 90,
            align: 'right',
          }
        );

        currentY += 18;
      };

    addSummaryLine(
      'Subtotal',
      invoice.subtotal
    );

    addSummaryLine(
      'Discount',
      invoice.totalDiscount
    );

    addSummaryLine(
      'Taxable Amount',
      invoice.taxableAmount
    );

    if (
      invoice.taxType ===
      'CGST_SGST'
    ) {
      addSummaryLine(
        'CGST',
        invoice.totalCGST
      );

      addSummaryLine(
        'SGST',
        invoice.totalSGST
      );
    }

    if (
      invoice.taxType ===
      'IGST'
    ) {
      addSummaryLine(
        'IGST',
        invoice.totalIGST
      );
    }

    addSummaryLine(
      'Shipping',
      invoice.shippingAmount
    );

    currentY += 5;

    doc
      .font('Helvetica-Bold')
      .fontSize(12)
      .text(
        'Grand Total',
        330,
        currentY,
        {
          width: 100,
        }
      );

    doc.text(
      `₹${invoice.grandTotal.toFixed(
        2
      )}`,
      430,
      currentY,
      {
        width: 90,
        align: 'right',
      }
    );

    currentY += 35;

    // ==============================
    // TAX SUMMARY
    // ==============================

    doc
      .font('Helvetica-Bold')
      .fontSize(10)
      .text(
        'Tax Summary'
      );

    doc
      .font('Helvetica')
      .fontSize(9);

    if (
      invoice.taxType ===
      'CGST_SGST'
    ) {
      doc.text(
        `CGST: ₹${invoice.totalCGST.toFixed(
          2
        )}`
      );

      doc.text(
        `SGST: ₹${invoice.totalSGST.toFixed(
          2
        )}`
      );
    }

    if (
      invoice.taxType ===
      'IGST'
    ) {
      doc.text(
        `IGST: ₹${invoice.totalIGST.toFixed(
          2
        )}`
      );
    }

    doc.moveDown();

    // ==============================
    // FOOTER
    // ==============================

    doc
      .fontSize(9)
      .font('Helvetica')
      .text(
        'This is a computer-generated invoice.',
        {
          align: 'center',
        }
      );

    doc.text(
      'Thank you for doing business with Shanti Enterprises.',
      {
        align: 'center',
      }
    );

    doc.end();
  });

// ==============================
// EXPORT
// ==============================

module.exports = {
  getOrCreateInvoice,
  downloadInvoicePDF,
};