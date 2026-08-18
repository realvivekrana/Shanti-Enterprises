const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const User = require('../models/User');
const logAction = require('../utils/logAction');

// @desc  Get all users (admin)
// @route GET /api/users
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, users, 'Users fetched'));
});

// @desc  Get single user by ID (admin)
// @route GET /api/users/:id
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) throw new ApiError(404, 'User not found');
  res.status(200).json(new ApiResponse(200, user, 'User fetched'));
});

// @desc  Change a user's role (admin)
// @route PATCH /api/users/:id/role
const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!['customer', 'admin'].includes(role)) {
    throw new ApiError(400, 'Role must be "customer" or "admin"');
  }

  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');

  user.role = role;
  await user.save();

  await logAction({
    user: req.user._id,
    action: 'USER_ROLE_UPDATED',
    entityType: 'User',
    entityId: user._id,
    details: { newRole: role, targetUser: user.email },
  });

  res.status(200).json(new ApiResponse(200, user, 'User role updated'));
});

// @desc  Activate/deactivate a user account (admin)
// @route PATCH /api/users/:id/status
const updateUserStatus = asyncHandler(async (req, res) => {
  const { isActive } = req.body;
  if (typeof isActive !== 'boolean') {
    throw new ApiError(400, 'isActive must be true or false');
  }

  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');

  user.isActive = isActive;
  await user.save();

  await logAction({
    user: req.user._id,
    action: isActive ? 'USER_ACTIVATED' : 'USER_DEACTIVATED',
    entityType: 'User',
    entityId: user._id,
    details: { targetUser: user.email },
  });

  res.status(200).json(new ApiResponse(200, user, `User ${isActive ? 'activated' : 'deactivated'}`));
});

module.exports = { getUsers, getUserById, updateUserRole, updateUserStatus };