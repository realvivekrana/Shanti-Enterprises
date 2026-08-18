const asyncHandler =
  require('../utils/asyncHandler');

const ApiError =
  require('../utils/ApiError');

const ApiResponse =
  require('../utils/ApiResponse');

const User =
  require('../models/User');

const Product =
  require('../models/Product');

const Order =
  require('../models/Order');


// ==================================================
// GET ALL SUPPLIERS
// ==================================================

const getAllSuppliers =
  asyncHandler(async (req, res) => {

    const suppliers =
      await User.find({
        role: 'supplier',
      })
        .select(
          '-password'
        )
        .sort({
          createdAt: -1,
        });

    res.status(200).json(

      new ApiResponse(
        200,
        suppliers,
        'Suppliers fetched successfully'
      )

    );
  });


// ==================================================
// GET SUPPLIER BY ID
// ==================================================

const getSupplierById =
  asyncHandler(async (req, res) => {

    const supplier =
      await User.findOne({
        _id: req.params.id,
        role: 'supplier',
      }).select(
        '-password'
      );

    if (!supplier) {

      throw new ApiError(
        404,
        'Supplier not found'
      );

    }

    res.status(200).json(

      new ApiResponse(
        200,
        supplier,
        'Supplier fetched successfully'
      )

    );
  });


// ==================================================
// CREATE SUPPLIER
// ADMIN ONLY
// ==================================================

const createSupplier =
  asyncHandler(async (req, res) => {

    const {
      name,
      email,
      password,
      phone,
      businessName,
      gstNumber,
    } = req.body;

    // ==============================
    // REQUIRED FIELDS
    // ==============================

    if (
      !name ||
      !email ||
      !password ||
      !phone ||
      !businessName
    ) {

      throw new ApiError(
        400,
        'Name, email, password, phone and business name are required'
      );

    }

    // ==============================
    // CHECK EXISTING USER
    // ==============================

    const existingUser =
      await User.findOne({
        email:
          email.toLowerCase(),
      });

    if (existingUser) {

      throw new ApiError(
        400,
        'A user with this email already exists'
      );

    }

    // ==============================
    // CREATE SUPPLIER
    // ==============================

    const supplier =
      await User.create({

        name,

        email:
          email.toLowerCase(),

        password,

        phone,

        businessName,

        gstNumber:
          gstNumber || '',

        role:
          'supplier',

        status:
          'active',

      });

    const supplierResponse =
      await User.findById(
        supplier._id
      ).select(
        '-password'
      );

    res.status(201).json(

      new ApiResponse(
        201,
        supplierResponse,
        'Supplier created successfully'
      )

    );
  });


// ==================================================
// UPDATE SUPPLIER
// ==================================================

const updateSupplier =
  asyncHandler(async (req, res) => {

    const supplier =
      await User.findOne({
        _id: req.params.id,
        role: 'supplier',
      });

    if (!supplier) {

      throw new ApiError(
        404,
        'Supplier not found'
      );

    }

    const {
      name,
      phone,
      businessName,
      gstNumber,
      status,
    } = req.body;

    // ==============================
    // UPDATE BASIC INFORMATION
    // ==============================

    if (name !== undefined) {
      supplier.name = name;
    }

    if (phone !== undefined) {
      supplier.phone = phone;
    }

    if (
      businessName !== undefined
    ) {
      supplier.businessName =
        businessName;
    }

    if (
      gstNumber !== undefined
    ) {
      supplier.gstNumber =
        gstNumber;
    }

    if (status !== undefined) {

      const validStatuses = [
        'active',
        'inactive',
        'pending',
        'suspended',
      ];

      if (
        !validStatuses.includes(
          status
        )
      ) {

        throw new ApiError(
          400,
          'Invalid supplier status'
        );

      }

      supplier.status =
        status;
    }

    await supplier.save();

    const updatedSupplier =
      await User.findById(
        supplier._id
      ).select(
        '-password'
      );

    res.status(200).json(

      new ApiResponse(
        200,
        updatedSupplier,
        'Supplier updated successfully'
      )

    );
  });


// ==================================================
// GET SUPPLIER PRODUCTS
// ==================================================

const getSupplierProducts =
  asyncHandler(async (req, res) => {

    const supplier =
      await User.findOne({
        _id: req.params.id,
        role: 'supplier',
      });

    if (!supplier) {

      throw new ApiError(
        404,
        'Supplier not found'
      );

    }

    const products =
      await Product.find({
        supplier:
          supplier._id,
      }).sort({
        createdAt: -1,
      });

    res.status(200).json(

      new ApiResponse(
        200,
        products,
        'Supplier products fetched successfully'
      )

    );
  });


// ==================================================
// GET MY PRODUCTS
// SUPPLIER ONLY
// ==================================================

const getMyProducts =
  asyncHandler(async (req, res) => {

    const products =
      await Product.find({
        supplier:
          req.user._id,
      }).sort({
        createdAt: -1,
      });

    res.status(200).json(

      new ApiResponse(
        200,
        products,
        'Your products fetched successfully'
      )

    );
  });


// ==================================================
// GET MY ORDERS
// SUPPLIER ONLY
// ==================================================

const getMyOrders =
  asyncHandler(async (req, res) => {

    const orders =
      await Order.find({
        'orderItems.supplier':
          req.user._id,
      })
        .populate(
          'user',
          'name email businessName'
        )
        .populate(
          'orderItems.product',
          'name sku'
        )
        .sort({
          createdAt: -1,
        });

    // ==============================
    // ONLY SUPPLIER ITEMS
    // ==============================

    const supplierOrders =
      orders.map((order) => {

        const supplierItems =
          order.orderItems.filter(
            (item) =>
              item.supplier &&
              item.supplier.toString() ===
                req.user._id.toString()
          );

        return {
          _id:
            order._id,

          user:
            order.user,

          orderStatus:
            order.orderStatus,

          paymentMethod:
            order.paymentMethod,

          isPaid:
            order.isPaid,

          createdAt:
            order.createdAt,

          updatedAt:
            order.updatedAt,

          orderItems:
            supplierItems,
        };
      });

    res.status(200).json(

      new ApiResponse(
        200,
        supplierOrders,
        'Supplier orders fetched successfully'
      )

    );
  });


// ==================================================
// SUPPLIER DASHBOARD
// ==================================================

const getSupplierDashboard =
  asyncHandler(async (req, res) => {

    // ==============================
    // PRODUCTS
    // ==============================

    const totalProducts =
      await Product.countDocuments({
        supplier:
          req.user._id,
      });


    // ==============================
    // LOW STOCK
    // ==============================

    const lowStockProducts =
      await Product.countDocuments({

        supplier:
          req.user._id,

        $expr: {
          $lte: [
            '$stock',
            '$lowStockThreshold',
          ],
        },

      });


    // ==============================
    // ORDERS
    // ==============================

    const orders =
      await Order.find({
        'orderItems.supplier':
          req.user._id,
      });


    // ==============================
    // CALCULATE SUPPLIER SALES
    // ==============================

    let totalSales = 0;

    let totalItemsSold = 0;

    for (
      const order of orders
    ) {

      // Ignore cancelled orders
      if (
        order.orderStatus ===
        'Cancelled'
      ) {
        continue;
      }

      for (
        const item
        of order.orderItems
      ) {

        if (
          item.supplier &&
          item.supplier.toString() ===
            req.user._id.toString()
        ) {

          totalSales +=
            Number(item.price || 0) *
            Number(item.quantity || 0);

          totalItemsSold +=
            Number(item.quantity || 0);

        }
      }
    }


    res.status(200).json(

      new ApiResponse(

        200,

        {
          totalProducts,

          lowStockProducts,

          totalOrders:
            orders.length,

          totalSales,

          totalItemsSold,
        },

        'Supplier dashboard fetched successfully'

      )

    );
  });


// ==================================================
// EXPORT
// ==================================================

module.exports = {

  getAllSuppliers,

  getSupplierById,

  createSupplier,

  updateSupplier,

  getSupplierProducts,

  getMyProducts,

  getMyOrders,

  getSupplierDashboard,

};