// ============================================================
// SHANTI ENTERPRISES
// Basic Validation Middleware
// Phase 1 - Foundation
// ============================================================

const validate = (validations) => {
  return async (req, res, next) => {
    try {
      for (const validation of validations) {
        await validation.run(req);
      }

      const { validationResult } = require("express-validator");

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const error = new Error("Validation failed");

        error.statusCode = 400;
        error.details = errors.array();

        return next(error);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = validate;