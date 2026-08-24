// ============================================================
// SHANTI ENTERPRISES
// Product Controller
// Phase 2 - Shopping
// ============================================================

const Product = require("../models/Product");

// ============================================================
// GET ALL PRODUCTS
// ============================================================

const getProducts = async (req, res, next) => {
  try {
    const {
      search = "",
      category = "",
      page = 1,
      limit = 12,
    } = req.query;

    const currentPage = Math.max(
      Number(page) || 1,
      1
    );

    const perPage = Math.min(
      Math.max(Number(limit) || 12, 1),
      50
    );

    const filter = {
      isActive: true,
    };

    if (search.trim()) {
      filter.name = {
        $regex: search.trim(),
        $options: "i",
      };
    }

    if (category.trim()) {
      filter.category = category.trim();
    }

    const skip =
      (currentPage - 1) * perPage;

    const [products, totalProducts] =
      await Promise.all([
        Product.find(filter)
          .populate(
            "category",
            "name slug"
          )
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
// GET SINGLE PRODUCT
// ============================================================

const getProductById = async (
  req,
  res,
  next
) => {
  try {
    const product =
      await Product.findOne({
        _id: req.params.id,
        isActive: true,
      }).populate(
        "category",
        "name slug"
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

module.exports = {
  getProducts,
  getProductById,
};