const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const AuditLog = require('../models/AuditLog');

// @desc  Get audit logs (admin only, with optional filters)
// @route GET /api/audit-logs
const getAuditLogs = asyncHandler(async (req, res) => {
  const { entityType, action, limit = 50 } = req.query;
  let filter = {};

  if (entityType) filter.entityType = entityType;
  if (action) filter.action = action;

  const logs = await AuditLog.find(filter)
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(Number(limit));

  res.status(200).json(new ApiResponse(200, logs, 'Audit logs fetched'));
});

module.exports = { getAuditLogs };