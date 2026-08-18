const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const Product = require('../models/Product');
const logAction = require('../utils/logAction');
const {
  getWholesaleUnitPrice,
} = require('../utils/wholesalePricing');

// ==============================
// GET ALL PRODUCTS
// SEARCH + FILTERS + SORTING
// ==============================

const getProducts = asyncHandler(async (req, res) => {
  const {
    category,
    search,
    brand,

    // Price
    minPrice,
    maxPrice,

    // MOQ
    minMoq,
    maxMoq,

    // Stock
    minStock,
    maxStock,
    inStock,

    // Rating
    minRating,

    // GST
    minGst,
    maxGst,

    // Location
    location,

    // Delivery
    maxDeliveryDays,

    // Sorting
    sort,
  } = req.query;

  const filter = {};

  // ==============================
  // CATEGORY
  // ==============================

  if (category) {
    const categories = category
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    if (categories.length > 1) {
      filter.category = {
        $in: categories,
      };
    } else if (categories.length === 1) {
      filter.category = categories[0];
    }
  }

  // ==============================
  // BRAND
  // ==============================

  if (brand) {
    filter.brand = {
      $regex: brand,
      $options: 'i',
    };
  }

  // ==============================
  // SEARCH
  // ==============================

  if (search) {
    const searchRegex = {
      $regex: search,
      $options: 'i',
    };

    filter.$or = [
      // Product name
      {
        name: searchRegex,
      },

      // Description
      {
        description: searchRegex,
      },

      // SKU
      {
        sku: searchRegex,
      },

      // Brand
      {
        brand: searchRegex,
      },

      // Specifications
      {
        'specifications.$*': searchRegex,
      },
    ];
  }

  // ==============================
  // PRICE FILTER
  // ==============================

  if (minPrice || maxPrice) {
    filter.price = {};

    if (minPrice !== undefined) {
      const value = Number(minPrice);

      if (!Number.isNaN(value)) {
        filter.price.$gte = value;
      }
    }

    if (maxPrice !== undefined) {
      const value = Number(maxPrice);

      if (!Number.isNaN(value)) {
        filter.price.$lte = value;
      }
    }

    if (Object.keys(filter.price).length === 0) {
      delete filter.price;
    }
  }

  // ==============================
  // MOQ FILTER
  // ==============================

  if (minMoq || maxMoq) {
    filter.moq = {};

    if (minMoq !== undefined) {
      const value = Number(minMoq);

      if (!Number.isNaN(value)) {
        filter.moq.$gte = value;
      }
    }

    if (maxMoq !== undefined) {
      const value = Number(maxMoq);

      if (!Number.isNaN(value)) {
        filter.moq.$lte = value;
      }
    }

    if (Object.keys(filter.moq).length === 0) {
      delete filter.moq;
    }
  }

  // ==============================
  // STOCK FILTER
  // ==============================

  if (minStock || maxStock) {
    filter.stock = {};

    if (minStock !== undefined) {
      const value = Number(minStock);

      if (!Number.isNaN(value)) {
        filter.stock.$gte = value;
      }
    }

    if (maxStock !== undefined) {
      const value = Number(maxStock);

      if (!Number.isNaN(value)) {
        filter.stock.$lte = value;
      }
    }

    if (Object.keys(filter.stock).length === 0) {
      delete filter.stock;
    }
  }

  // ==============================
  // IN STOCK ONLY
  // ==============================

  if (inStock === 'true') {
    filter.stock = {
      ...(filter.stock || {}),
      $gt: 0,
    };
  }

  // ==============================
  // RATING
  // ==============================

  if (minRating !== undefined) {
    const value = Number(minRating);

    if (!Number.isNaN(value)) {
      filter.averageRating = {
        $gte: value,
      };
    }
  }

  // ==============================
  // GST FILTER
  // ==============================

  if (minGst || maxGst) {
    filter.gst = {};

    if (minGst !== undefined) {
      const value = Number(minGst);

      if (!Number.isNaN(value)) {
        filter.gst.$gte = value;
      }
    }

    if (maxGst !== undefined) {
      const value = Number(maxGst);

      if (!Number.isNaN(value)) {
        filter.gst.$lte = value;
      }
    }

    if (Object.keys(filter.gst).length === 0) {
      delete filter.gst;
    }
  }

  // ==============================
  // LOCATION
  // ==============================

  if (location) {
    filter.location = {
      $regex: location,
      $options: 'i',
    };
  }

  // ==============================
  // DELIVERY TIME
  // ==============================

  if (maxDeliveryDays !== undefined) {
    const value = Number(maxDeliveryDays);

    if (!Number.isNaN(value)) {
      filter.deliveryTimeDays = {
        $lte: value,
      };
    }
  }

  // ==============================
  // SORTING
  // ==============================

  let sortOption = {
    createdAt: -1,
  };

  switch (sort) {
    case 'price_asc':
      sortOption = {
        price: 1,
      };
      break;

    case 'price_desc':
      sortOption = {
        price: -1,
      };
      break;

    case 'rating':
      sortOption = {
        averageRating: -1,
      };
      break;

    case 'moq_asc':
      sortOption = {
        moq: 1,
      };
      break;

    case 'newest':
      sortOption = {
        createdAt: -1,
      };
      break;

    case 'stock_desc':
      sortOption = {
        stock: -1,
      };
      break;

    default:
      sortOption = {
        createdAt: -1,
      };
  }

  // ==============================
  // FETCH PRODUCTS
  // ==============================

  const products = await Product.find(filter)
    .sort(sortOption);

  // ==============================
  // RESPONSE
  // ==============================

  res.status(200).json(
    new ApiResponse(
      200,
      products,
      'Products fetched'
    )
  );
});

// ==============================
// GET PRODUCT BY ID
// ==============================

const getProductById =
  asyncHandler(async (req, res) => {
    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {
      throw new ApiError(
        404,
        'Product not found'
      );
    }

    res.status(200).json(
      new ApiResponse(
        200,
        product,
        'Product fetched'
      )
    );
  });

// ==============================
// CALCULATE WHOLESALE PRICE
// ==============================

const calculateWholesalePrice =
  asyncHandler(async (req, res) => {
    const quantity =
      Number(req.query.quantity);

    if (
      !Number.isInteger(quantity) ||
      quantity < 1
    ) {
      throw new ApiError(
        400,
        'Quantity must be a positive whole number'
      );
    }

    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {
      throw new ApiError(
        404,
        'Product not found'
      );
    }

    if (
      quantity >
      Number(product.stock)
    ) {
      throw new ApiError(
        400,
        `Only ${product.stock} pieces are available in stock`
      );
    }

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
      pricing.unitPrice;

    const subtotal =
      unitPrice * quantity;

    const gstRate =
      Number(product.gst || 0);

    const gstAmount =
      (subtotal * gstRate) / 100;

    const total =
      subtotal + gstAmount;

    res.status(200).json(
      new ApiResponse(
        200,
        {
          productId:
            product._id,

          productName:
            product.name,

          quantity,

          unitPrice,

          subtotal,

          gstRate,

          gstAmount,

          total,

          matchedTier:
            pricing.matchedTier,
        },
        'Wholesale price calculated'
      )
    );
  });

// ==============================
// CREATE PRODUCT
// ==============================

const createProduct =
  asyncHandler(async (req, res) => {
    const product =
      new Product(req.body);

    const createdProduct =
      await product.save();

    await logAction({
      user: req.user._id,
      action: 'PRODUCT_CREATED',
      entityType: 'Product',
      entityId:
        createdProduct._id,
      details: {
        name:
          createdProduct.name,
        sku:
          createdProduct.sku,
      },
    });

    res.status(201).json(
      new ApiResponse(
        201,
        createdProduct,
        'Product created'
      )
    );
  });

// ==============================
// UPDATE PRODUCT
// ==============================

const updateProduct =
  asyncHandler(async (req, res) => {
    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {
      throw new ApiError(
        404,
        'Product not found'
      );
    }

    Object.assign(
      product,
      req.body
    );

    const updatedProduct =
      await product.save();

    await logAction({
      user: req.user._id,
      action: 'PRODUCT_UPDATED',
      entityType: 'Product',
      entityId:
        updatedProduct._id,
      details: {
        changes: req.body,
      },
    });

    res.status(200).json(
      new ApiResponse(
        200,
        updatedProduct,
        'Product updated'
      )
    );
  });

// ==============================
// DELETE PRODUCT
// ==============================

const deleteProduct =
  asyncHandler(async (req, res) => {
    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {
      throw new ApiError(
        404,
        'Product not found'
      );
    }

    await product.deleteOne();

    await logAction({
      user: req.user._id,
      action: 'PRODUCT_DELETED',
      entityType: 'Product',
      entityId:
        req.params.id,
      details: {
        name:
          product.name,
        sku:
          product.sku,
      },
    });

    res.status(200).json(
      new ApiResponse(
        200,
        null,
        'Product removed'
      )
    );
  });

module.exports = {
  getProducts,
  getProductById,
  calculateWholesalePrice,
  createProduct,
  updateProduct,
  deleteProduct,
};