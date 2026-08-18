const AuditLog = require('../models/AuditLog');

const logAction = async ({ user, action, entityType, entityId, details = {}, ipAddress = '' }) => {
  try {
    await AuditLog.create({ user, action, entityType, entityId, details, ipAddress });
  } catch (err) {
    // Logging fail hone se main operation fail nahi hona chahiye, isliye sirf console mein print
    console.error('Failed to write audit log:', err.message);
  }
};

module.exports = logAction;