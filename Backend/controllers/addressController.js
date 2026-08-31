
// ============================================================
// SHANTI ENTERPRISES
// Address Controller
// Backend - Customer Saved Addresses
// ============================================================

const Address = require("../models/addressModel");

// ============================================================
// HELPER - GET USER ID
// ============================================================

const getUserId = (req) => {
  return (
    req.user?._id ||
    req.user?.id ||
    req.userId ||
    null
  );
};

// ============================================================
// VALIDATE ADDRESS DATA
// ============================================================

const validateAddressData = ({
  name,
  phone,
  address,
  city,
  state,
  pincode,
}) => {
  if (!name || !String(name).trim()) {
    return "Full name is required.";
  }

  if (!phone || !String(phone).trim()) {
    return "Phone number is required.";
  }

  if (!address || !String(address).trim()) {
    return "Address is required.";
  }

  if (!city || !String(city).trim()) {
    return "City is required.";
  }

  if (!state || !String(state).trim()) {
    return "State is required.";
  }

  if (!pincode || !String(pincode).trim()) {
    return "Pincode is required.";
  }

  if (!/^\d{6}$/.test(String(pincode).trim())) {
    return "Pincode must contain 6 digits.";
  }

  return null;
};

// ============================================================
// GET MY ADDRESSES
// GET /api/addresses
// ============================================================

const getMyAddresses = async (
  req,
  res
) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const addresses =
      await Address.find({
        user: userId,
      }).sort({
        isDefault: -1,
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: addresses.length,
      addresses,
    });
  } catch (error) {
    console.error(
      "Get addresses error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load saved addresses.",
    });
  }
};

// ============================================================
// GET SINGLE ADDRESS
// GET /api/addresses/:id
// ============================================================

const getAddressById = async (
  req,
  res
) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const address =
      await Address.findOne({
        _id: req.params.id,
        user: userId,
      });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found.",
      });
    }

    return res.status(200).json({
      success: true,
      address,
    });
  } catch (error) {
    console.error(
      "Get address by ID error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load address.",
    });
  }
};

// ============================================================
// CREATE ADDRESS
// POST /api/addresses
// ============================================================

const createAddress = async (
  req,
  res
) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const {
      name,
      phone,
      address,
      city,
      state,
      pincode,
      isDefault,
    } = req.body;

    const validationError =
      validateAddressData({
        name,
        phone,
        address,
        city,
        state,
        pincode,
      });

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const existingCount =
      await Address.countDocuments({
        user: userId,
      });

    const shouldBeDefault =
      Boolean(isDefault) ||
      existingCount === 0;

    if (shouldBeDefault) {
      await Address.updateMany(
        {
          user: userId,
        },
        {
          $set: {
            isDefault: false,
          },
        }
      );
    }

    const newAddress =
      await Address.create({
        user: userId,

        name: String(name).trim(),

        phone: String(phone).trim(),

        address:
          String(address).trim(),

        city: String(city).trim(),

        state: String(state).trim(),

        pincode:
          String(pincode).trim(),

        isDefault:
          shouldBeDefault,
      });

    return res.status(201).json({
      success: true,
      message:
        "Address added successfully.",
      address: newAddress,
    });
  } catch (error) {
    console.error(
      "Create address error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to add address.",
    });
  }
};

// ============================================================
// UPDATE ADDRESS
// PUT /api/addresses/:id
// ============================================================

const updateAddress = async (
  req,
  res
) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const address =
      await Address.findOne({
        _id: req.params.id,
        user: userId,
      });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found.",
      });
    }

    const {
      name,
      phone,
      address: addressText,
      city,
      state,
      pincode,
      isDefault,
    } = req.body;

    const validationError =
      validateAddressData({
        name:
          name ?? address.name,

        phone:
          phone ?? address.phone,

        address:
          addressText ??
          address.address,

        city:
          city ?? address.city,

        state:
          state ?? address.state,

        pincode:
          pincode ?? address.pincode,
      });

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    if (Boolean(isDefault)) {
      await Address.updateMany(
        {
          user: userId,
          _id: {
            $ne: address._id,
          },
        },
        {
          $set: {
            isDefault: false,
          },
        }
      );
    }

    address.name =
      String(
        name ?? address.name
      ).trim();

    address.phone =
      String(
        phone ?? address.phone
      ).trim();

    address.address =
      String(
        addressText ??
          address.address
      ).trim();

    address.city =
      String(
        city ?? address.city
      ).trim();

    address.state =
      String(
        state ?? address.state
      ).trim();

    address.pincode =
      String(
        pincode ?? address.pincode
      ).trim();

    if (
      typeof isDefault ===
      "boolean"
    ) {
      address.isDefault =
        isDefault;
    }

    await address.save();

    return res.status(200).json({
      success: true,
      message:
        "Address updated successfully.",
      address,
    });
  } catch (error) {
    console.error(
      "Update address error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to update address.",
    });
  }
};

// ============================================================
// DELETE ADDRESS
// DELETE /api/addresses/:id
// ============================================================

const deleteAddress = async (
  req,
  res
) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const address =
      await Address.findOne({
        _id: req.params.id,
        user: userId,
      });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found.",
      });
    }

    const wasDefault =
      address.isDefault;

    await Address.deleteOne({
      _id: address._id,
      user: userId,
    });

    if (wasDefault) {
      const nextAddress =
        await Address.findOne({
          user: userId,
        }).sort({
          createdAt: -1,
        });

      if (nextAddress) {
        nextAddress.isDefault =
          true;

        await nextAddress.save();
      }
    }

    return res.status(200).json({
      success: true,
      message:
        "Address deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete address error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to delete address.",
    });
  }
};

// ============================================================
// SET DEFAULT ADDRESS
// PATCH /api/addresses/:id/default
// ============================================================

const setDefaultAddress =
  async (
    req,
    res
  ) => {
    try {
      const userId =
        getUserId(req);

      if (!userId) {
        return res.status(401).json({
          success: false,
          message:
            "Authentication required.",
        });
      }

      const address =
        await Address.findOne({
          _id: req.params.id,
          user: userId,
        });

      if (!address) {
        return res.status(404).json({
          success: false,
          message:
            "Address not found.",
        });
      }

      await Address.updateMany(
        {
          user: userId,
        },
        {
          $set: {
            isDefault: false,
          },
        }
      );

      address.isDefault =
        true;

      await address.save();

      return res.status(200).json({
        success: true,
        message:
          "Default address selected.",
        address,
      });
    } catch (error) {
      console.error(
        "Set default address error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to select default address.",
      });
    }
  };

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  getMyAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};
