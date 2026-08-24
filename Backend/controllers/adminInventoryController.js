// ============================================================
// SHANTI ENTERPRISES
// Admin Inventory Controller
// Phase 6 - Admin
// ============================================================

const Product = require("../models/Product");

// ============================================================
// GET INVENTORY
// ============================================================

const getInventory = async (
  req,
  res,
  next
) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = "",
      lowStock = "",
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
    // SEARCH
    // --------------------------------------------------------

    if (search.trim()) {
      filter.$or = [
        {
          name: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          sku: {
            $regex: search.trim(),
            $options: "i",
          },
        },
      ];
    }

    // --------------------------------------------------------
    // LOW STOCK
    // --------------------------------------------------------

    if (lowStock === "true") {
      filter.$expr = {
        $lte: [
          "$stock",
          {
            $ifNull: [
              "$lowStockThreshold",
              10,
            ],
          },
        ],
      };
    }

    const skip =
      (currentPage - 1) * perPage;

    const [
      products,
      totalProducts,
    ] = await Promise.all([
      Product.find(filter)
        .sort({
          stock: 1,
          createdAt: -1,
        })
        .skip(skip)
        .limit(perPage)
        .select(
          "name sku stock lowStockThreshold price isActive unit image"
        ),

      Product.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(
      totalProducts / perPage
    );

    res.status(200).json({
      success: true,

      count: products.length,

      pagination: {
        page: currentPage,
        limit: perPage,
        totalProducts,
        totalPages,
      },

      products,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// GET SINGLE INVENTORY ITEM
// ============================================================

const getInventoryItem = async (
  req,
  res,
  next
) => {
  try {
    const product =
      await Product.findById(
        req.params.id
      ).select(
        "name sku stock lowStockThreshold price isActive unit image"
      );

    if (!product) {
      const error = new Error(
        "Product not found"
      );

      error.statusCode = 404;

      return next(error);
    }

    const threshold =
      product.lowStockThreshold ??
      10;

    res.status(200).json({
      success: true,

      inventory: {
        productId: product._id,
        name: product.name,
        sku: product.sku,
        stock: product.stock,
        lowStockThreshold: threshold,
        isLowStock:
          product.stock <= threshold,
        price: product.price,
        unit: product.unit,
        isActive: product.isActive,
        image: product.image,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// UPDATE STOCK
// ============================================================

const updateInventoryStock = async (
  req,
  res,
  next
) => {
  try {
    const {
      stock,
    } = req.body;

    if (
      stock === undefined ||
      stock === null ||
      stock === "" ||
      !Number.isFinite(Number(stock)) ||
      Number(stock) < 0
    ) {
      const error = new Error(
        "Stock must be a valid number greater than or equal to 0"
      );

      error.statusCode = 400;

      return next(error);
    }

    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {
      const error = new Error(
        "Product not found"
      );

      error.statusCode = 404;

      return next(error);
    }

    product.stock =
      Number(stock);

    await product.save();

    const threshold =
      product.lowStockThreshold ??
      10;

    res.status(200).json({
      success: true,

      message:
        "Inventory stock updated successfully",

      inventory: {
        productId: product._id,

        name: product.name,

        sku: product.sku,

        previousStock:
          Number(stock),

        currentStock:
          product.stock,

        lowStockThreshold:
          threshold,

        isLowStock:
          product.stock <= threshold,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// ADJUST STOCK
// ============================================================

const adjustInventoryStock = async (
  req,
  res,
  next
) => {
  try {
    const {
      quantity,
      type,
    } = req.body;

    const allowedTypes = [
      "add",
      "remove",
    ];

    if (
      !allowedTypes.includes(type)
    ) {
      const error = new Error(
        "Adjustment type must be add or remove"
      );

      error.statusCode = 400;

      return next(error);
    }

    if (
      quantity === undefined ||
      quantity === null ||
      quantity === "" ||
      !Number.isFinite(
        Number(quantity)
      ) ||
      Number(quantity) <= 0
    ) {
      const error = new Error(
        "Quantity must be greater than 0"
      );

      error.statusCode = 400;

      return next(error);
    }

    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {
      const error = new Error(
        "Product not found"
      );

      error.statusCode = 404;

      return next(error);
    }

    const previousStock =
      Number(product.stock) || 0;

    const adjustment =
      Number(quantity);

    let newStock;

    if (type === "add") {
      newStock =
        previousStock +
        adjustment;
    } else {
      newStock =
        previousStock -
        adjustment;
    }

    if (newStock < 0) {
      const error = new Error(
        "Stock cannot become negative"
      );

      error.statusCode = 400;

      return next(error);
    }

    product.stock =
      newStock;

    await product.save();

    const threshold =
      product.lowStockThreshold ??
      10;

    res.status(200).json({
      success: true,

      message:
        "Inventory adjusted successfully",

      inventory: {
        productId: product._id,

        name: product.name,

        sku: product.sku,

        previousStock,

        adjustment,

        adjustmentType: type,

        currentStock:
          product.stock,

        lowStockThreshold:
          threshold,

        isLowStock:
          product.stock <= threshold,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// UPDATE LOW STOCK THRESHOLD
// ============================================================

const updateLowStockThreshold =
  async (
    req,
    res,
    next
  ) => {
    try {
      const {
        lowStockThreshold,
      } = req.body;

      if (
        lowStockThreshold ===
          undefined ||
        lowStockThreshold ===
          null ||
        lowStockThreshold ===
          "" ||
        !Number.isFinite(
          Number(lowStockThreshold)
        ) ||
        Number(lowStockThreshold) < 0
      ) {
        const error = new Error(
          "Low stock threshold must be a valid number"
        );

        error.statusCode = 400;

        return next(error);
      }

      const product =
        await Product.findById(
          req.params.id
        );

      if (!product) {
        const error = new Error(
          "Product not found"
        );

        error.statusCode = 404;

        return next(error);
      }

      product.lowStockThreshold =
        Number(lowStockThreshold);

      await product.save();

      res.status(200).json({
        success: true,

        message:
          "Low stock threshold updated successfully",

        inventory: {
          productId:
            product._id,

          name: product.name,

          sku: product.sku,

          stock:
            product.stock,

          lowStockThreshold:
            product.lowStockThreshold,

          isLowStock:
            product.stock <=
            product.lowStockThreshold,
        },
      });
    } catch (error) {
      next(error);
    }
  };

module.exports = {
  getInventory,
  getInventoryItem,
  updateInventoryStock,
  adjustInventoryStock,
  updateLowStockThreshold,
};