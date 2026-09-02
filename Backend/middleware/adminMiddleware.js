// ============================================================
// SHANTI ENTERPRISES
// Admin Middleware
// Phase 6 - Admin
// ============================================================

const adminOnly = (
  req,
  res,
  next
) => {

  if (
    !req.user ||
    req.user.role !== "admin"
  ) {
    return res.status(403).json({
      success: false,
      message:
        "Admin access required",
    });
  }

  next();
};

module.exports = {
  adminOnly,
};