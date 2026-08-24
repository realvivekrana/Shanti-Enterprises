// ============================================================
// SHANTI ENTERPRISES
// Admin Product Controller
// Phase 6 - Admin
// ============================================================

const Product = require("../models/Product");

// ============================================================
// GET ALL PRODUCTS - ADMIN
// ============================================================

const getAdminProducts = async (
  req,
  res,
  next
) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = "",
      category = "",
      status = "",
    } = req.query;

    const currentPage = Math.max(
      Number(page) || 1,
      1
    );

    const perPage = Math.min(
      Math.max(
        Number(limit) || 20,
        1
      ),
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
    // CATEGORY
    // --------------------------------------------------------

    if (category.trim()) {
      filter.category = category.trim();
    }

    // --------------------------------------------------------
    // STATUS
    // --------------------------------------------------------

    if (status === "active") {
      filter.isActive = true;
    }

    if (status === "inactive") {
      filter.isActive = false;
    }

    const skip =
      (currentPage - 1) *
      perPage;

    const [
      products,
      totalProducts,
    ] = await Promise.all([
      Product.find(filter)
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(perPage),

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
// GET SINGLE PRODUCT - ADMIN
// ============================================================

const getAdminProductById = async (
  req,
  res,
  next
) => {
  try {
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

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// CREATE PRODUCT - ADMIN
// ============================================================

const createAdminProduct = async (
  req,
  res,
  next
) => {
  try {
    const {
      name,
      sku,
      description = "",
      category,
      price,
      wholesalePrice,
      moq,
      stock,
      unit,
      isWholesale,
      isActive,
      image,
    } = req.body;

    if (
      !name ||
      !String(name).trim()
    ) {
      const error = new Error(
        "Product name is required"
      );

      error.statusCode = 400;

      return next(error);
    }

    if (
      price === undefined ||
      price === null ||
      Number(price) < 0
    ) {
      const error = new Error(
        "Valid product price is required"
      );

      error.statusCode = 400;

      return next(error);
    }

    // --------------------------------------------------------
    // SKU DUPLICATE CHECK
    // --------------------------------------------------------

    if (
      sku &&
      String(sku).trim()
    ) {
      const existingSKU =
        await Product.findOne({
          sku: String(sku).trim(),
        });

      if (existingSKU) {
        const error = new Error(
          "Product SKU already exists"
        );

        error.statusCode = 409;

        return next(error);
      }
    }

    // --------------------------------------------------------
    // PRODUCT DATA
    // --------------------------------------------------------

    const productData = {
      name: String(name).trim(),

      description:
        String(description).trim(),

      price: Number(price),

      stock: Math.max(
        Number(stock) || 0,
        0
      ),

      unit:
        unit ||
        "piece",

      isWholesale:
        isWholesale !== false,

      isActive:
        isActive !== false,
    };

    if (
      sku &&
      String(sku).trim()
    ) {
      productData.sku =
        String(sku).trim();
    }

    if (category) {
      productData.category =
        category;
    }

    if (
      wholesalePrice !==
        undefined &&
      wholesalePrice !== null &&
      wholesalePrice !== ""
    ) {
      productData.wholesalePrice =
        Math.max(
          Number(wholesalePrice),
          0
        );
    }

    if (
      moq !== undefined &&
      moq !== null &&
      moq !== ""
    ) {
      productData.moq = Math.max(
        Number(moq),
        1
      );
    }

    if (image) {
      productData.image =
        String(image).trim();
    }

    const product =
      await Product.create(
        productData
      );

    res.status(201).json({
      success: true,

      message:
        "Product created successfully",

      product,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// UPDATE PRODUCT - ADMIN
// ============================================================

const updateAdminProduct = async (
  req,
  res,
  next
) => {
  try {
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

    const {
      name,
      sku,
      description,
      category,
      price,
      wholesalePrice,
      moq,
      stock,
      unit,
      isWholesale,
      isActive,
      image,
    } = req.body;

    // --------------------------------------------------------
    // SKU CHECK
    // --------------------------------------------------------

    if (
      sku !== undefined &&
      String(sku).trim() &&
      String(sku).trim() !==
        product.sku
    ) {
      const existingSKU =
        await Product.findOne({
          sku: String(sku).trim(),

          _id: {
            $ne: product._id,
          },
        });

      if (existingSKU) {
        const error = new Error(
          "Product SKU already exists"
        );

        error.statusCode = 409;

        return next(error);
      }

      product.sku =
        String(sku).trim();
    }

    // --------------------------------------------------------
    // UPDATE FIELDS
    // --------------------------------------------------------

    if (
      name !== undefined &&
      String(name).trim()
    ) {
      product.name =
        String(name).trim();
    }

    if (
      description !== undefined
    ) {
      product.description =
        String(description).trim();
    }

    if (
      category !== undefined
    ) {
      product.category =
        category;
    }

    if (
      price !== undefined
    ) {
      const numericPrice =
        Number(price);

      if (
        !Number.isFinite(
          numericPrice
        ) ||
        numericPrice < 0
      ) {
        const error = new Error(
          "Invalid product price"
        );

        error.statusCode = 400;

        return next(error);
      }

      product.price =
        numericPrice;
    }

    if (
      wholesalePrice !==
        undefined
    ) {
      product.wholesalePrice =
        Math.max(
          Number(wholesalePrice) ||
            0,
          0
        );
    }

    if (
      moq !== undefined
    ) {
      product.moq = Math.max(
        Number(moq) || 1,
        1
      );
    }

    if (
      stock !== undefined
    ) {
      product.stock = Math.max(
        Number(stock) || 0,
        0
      );
    }

    if (
      unit !== undefined
    ) {
      product.unit =
        String(unit).trim();
    }

    if (
      isWholesale !== undefined
    ) {
      product.isWholesale =
        Boolean(isWholesale);
    }

    if (
      isActive !== undefined
    ) {
      product.isActive =
        Boolean(isActive);
    }

    if (
      image !== undefined
    ) {
      product.image =
        String(image).trim();
    }

    await product.save();

    res.status(200).json({
      success: true,

      message:
        "Product updated successfully",

      product,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// DELETE PRODUCT - ADMIN
// ============================================================

const deleteAdminProduct = async (
  req,
  res,
  next
) => {
  try {
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

    await Product.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,

      message:
        "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// TOGGLE PRODUCT STATUS
// ============================================================

const toggleProductStatus = async (
  req,
  res,
  next
) => {
  try {
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

    product.isActive =
      !product.isActive;

    await product.save();

    res.status(200).json({
      success: true,

      message:
        product.isActive
          ? "Product activated successfully"
          : "Product deactivated successfully",

      product: {
        id: product._id,

        name: product.name,

        isActive:
          product.isActive,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminProducts,
  getAdminProductById,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  toggleProductStatus,
};