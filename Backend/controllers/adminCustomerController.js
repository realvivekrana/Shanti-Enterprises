// ============================================================
// SHANTI ENTERPRISES
// Admin Customer Controller
// Phase 6 - Admin
// ============================================================

const User = require("../models/User");

// ============================================================
// GET ALL CUSTOMERS - ADMIN
// ============================================================

const getAdminCustomers = async (
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

    if (status === "active") {
      filter.isActive = true;
    }

    if (status === "inactive") {
      filter.isActive = false;
    }

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
          email: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          phone: {
            $regex: search.trim(),
            $options: "i",
          },
        },
      ];
    }

    const skip =
      (currentPage - 1) * perPage;

    const [
      customers,
      totalCustomers,
    ] = await Promise.all([
      User.find(filter)
        .select(
          "-password -resetPasswordToken -resetPasswordExpires"
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(perPage),

      User.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(
      totalCustomers / perPage
    );

    res.status(200).json({
      success: true,

      count: customers.length,

      pagination: {
        page: currentPage,
        limit: perPage,
        totalCustomers,
        totalPages,
      },

      customers,

      // Compatibility for the admin user-management UI.
      users: customers,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// GET SINGLE CUSTOMER - ADMIN
// ============================================================

const getAdminCustomerById = async (
  req,
  res,
  next
) => {
  try {
    const customer =
      await User.findOne({
        _id: req.params.id,
      }).select(
        "-password -resetPasswordToken -resetPasswordExpires"
      );

    if (!customer) {
      const error = new Error(
        "Customer not found"
      );

      error.statusCode = 404;

      return next(error);
    }

    res.status(200).json({
      success: true,

      customer,

      // Compatibility for the admin user-details UI.
      user: customer,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// UPDATE CUSTOMER STATUS
// ============================================================

const updateCustomerStatus = async (
  req,
  res,
  next
) => {
  try {
    const {
      isActive,
    } = req.body;

    if (
      typeof isActive !== "boolean"
    ) {
      const error = new Error(
        "isActive must be true or false"
      );

      error.statusCode = 400;

      return next(error);
    }

    const customer =
      await User.findOne({
        _id: req.params.id,
      });

    if (!customer) {
      const error = new Error(
        "Customer not found"
      );

      error.statusCode = 404;

      return next(error);
    }

    if (
      String(customer._id) ===
      String(req.user?.id)
    ) {
      const error = new Error(
        "You cannot change your own account status."
      );

      error.statusCode = 400;

      return next(error);
    }

    customer.isActive =
      isActive;

    await customer.save();

    res.status(200).json({
      success: true,

      message: isActive
        ? "Customer activated successfully"
        : "Customer deactivated successfully",

      customer: {
        id: customer._id,

        name: customer.name,

        email: customer.email,

        isActive:
          customer.isActive,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// UPDATE CUSTOMER BASIC INFORMATION
// ============================================================

const updateAdminCustomer = async (
  req,
  res,
  next
) => {
  try {
    const {
      name,
      phone,
      role,
    } = req.body;

    const customer =
      await User.findOne({
        _id: req.params.id,
      });

    if (!customer) {
      const error = new Error(
        "Customer not found"
      );

      error.statusCode = 404;

      return next(error);
    }

    if (
      name !== undefined
    ) {
      if (
        !String(name).trim()
      ) {
        const error = new Error(
          "Customer name cannot be empty"
        );

        error.statusCode = 400;

        return next(error);
      }

      customer.name =
        String(name).trim();
    }

    if (
      phone !== undefined
    ) {
      customer.phone =
        String(phone).trim();
    }

    if (
      role !== undefined
    ) {
      if (
        ![
          "customer",
          "admin",
        ].includes(role)
      ) {
        const error = new Error(
          "Role must be customer or admin"
        );

        error.statusCode = 400;

        return next(error);
      }

      if (
        String(customer._id) ===
        String(req.user?.id)
      ) {
        const error = new Error(
          "You cannot change your own role."
        );

        error.statusCode = 400;

        return next(error);
      }

      customer.role = role;
    }

    await customer.save();

    res.status(200).json({
      success: true,

      message:
        "Customer updated successfully",

      customer: {
        id: customer._id,

        name: customer.name,

        email: customer.email,

        phone: customer.phone,

        role: customer.role,

        isActive:
          customer.isActive,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// DELETE USER
// ============================================================

const deleteAdminCustomer = async (
  req,
  res,
  next
) => {
  try {
    const customer =
      await User.findById(
        req.params.id
      );

    if (!customer) {
      const error = new Error(
        "User not found"
      );

      error.statusCode = 404;

      return next(error);
    }

    if (
      String(customer._id) ===
      String(req.user?.id)
    ) {
      const error = new Error(
        "You cannot delete your own account."
      );

      error.statusCode = 400;

      return next(error);
    }

    await customer.deleteOne();

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminCustomers,
  getAdminCustomerById,
  updateCustomerStatus,
  updateAdminCustomer,
  deleteAdminCustomer,
};
