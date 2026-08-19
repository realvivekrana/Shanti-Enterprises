const {
  body,
  param,
  validationResult,
} = require('express-validator');


// ======================================================
// COMMON VALIDATION HANDLER
// ======================================================

const handleValidationErrors =
  (req, res, next) => {

    const errors =
      validationResult(req);


    if (!errors.isEmpty()) {

      return res.status(400).json({

        success:
          false,

        message:
          'Validation failed',

        errors:
          errors.array().map(
            (error) => ({

              field:
                error.path,

              message:
                error.msg,

            })
          ),

      });

    }


    next();

  };


// ======================================================
// REGISTER VALIDATION
// ======================================================

const validateRegister = [

  body('name')
    .trim()
    .isLength({
      min: 2,
      max: 100,
    })
    .withMessage(
      'Name must be between 2 and 100 characters.'
    ),

  body('email')
    .trim()
    .isEmail()
    .withMessage(
      'Please provide a valid email address.'
    )
    .normalizeEmail(),

  body('password')
    .isString()
    .isLength({
      min: 8,
      max: 128,
    })
    .withMessage(
      'Password must be between 8 and 128 characters.'
    ),

  body('phone')
    .trim()
    .isLength({
      min: 10,
      max: 15,
    })
    .withMessage(
      'Phone number must be between 10 and 15 characters.'
    ),

  body('businessName')
    .trim()
    .isLength({
      min: 2,
      max: 150,
    })
    .withMessage(
      'Business name must be between 2 and 150 characters.'
    ),

  body('gstNumber')
    .optional({
      values: 'falsy',
    })
    .trim()
    .isLength({
      max: 30,
    })
    .withMessage(
      'GST number is too long.'
    ),

  handleValidationErrors,

];


// ======================================================
// LOGIN VALIDATION
// ======================================================

const validateLogin = [

  body('email')
    .trim()
    .isEmail()
    .withMessage(
      'Please provide a valid email address.'
    )
    .normalizeEmail(),

  body('password')
    .isString()
    .isLength({
      min: 1,
      max: 128,
    })
    .withMessage(
      'Password is required.'
    ),

  handleValidationErrors,

];


// ======================================================
// MONGODB ID VALIDATION
// ======================================================

const validateMongoId = (

  field = 'id'

) => [

  param(field)
    .isMongoId()
    .withMessage(
      `Invalid ${field}.`
    ),

  handleValidationErrors,

];


module.exports = {

  validateRegister,

  validateLogin,

  validateMongoId,

  handleValidationErrors,

};