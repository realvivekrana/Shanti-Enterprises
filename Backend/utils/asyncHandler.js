// ============================================================
// SHANTI ENTERPRISES
// Async Handler Utility
// Phase 1 - Foundation
// ============================================================

const asyncHandler = (controller) => {
  return (req, res, next) => {
    Promise.resolve(controller(req, res, next)).catch(next);
  };
};

module.exports = asyncHandler;