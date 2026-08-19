const jwt =
  require('jsonwebtoken');

const User =
  require('../models/User');

const ApiError =
  require('../utils/ApiError');


// ======================================================
// PROTECT ROUTE
// ======================================================

const protect =
  async (req, res, next) => {

    let token;


    // ==================================================
    // GET TOKEN
    // ==================================================

    const authorization =
      req.headers.authorization;


    if (
      authorization &&
      authorization.startsWith(
        'Bearer '
      )
    ) {

      token =
        authorization.split(
          ' '
        )[1];

    }


    // ==================================================
    // TOKEN REQUIRED
    // ==================================================

    if (!token) {

      return next(
        new ApiError(
          401,
          'Not authorized, no token'
        )
      );

    }


    // ==================================================
    // VERIFY TOKEN
    // ==================================================

    try {

      const decoded =
        jwt.verify(
          token,
          process.env.JWT_SECRET
        );


      if (
        !decoded?.id
      ) {

        return next(
          new ApiError(
            401,
            'Invalid authentication token'
          )
        );

      }


      // ==================================================
      // GET USER
      // ==================================================

      const user =
        await User.findById(
          decoded.id
        ).select(
          '-password'
        );


      if (!user) {

        return next(
          new ApiError(
            401,
            'Not authorized, user not found'
          )
        );

      }


      // ==================================================
      // ACCOUNT STATUS
      // ==================================================

      if (
        user.isActive === false
      ) {

        return next(
          new ApiError(
            403,
            'Your account has been deactivated.'
          )
        );

      }


      if (
        user.status === 'inactive' ||
        user.status === 'suspended'
      ) {

        return next(
          new ApiError(
            403,
            `Your account is ${user.status}.`
          )
        );

      }


      // ==================================================
      // ATTACH USER
      // ==================================================

      req.user =
        user;


      next();

    } catch (error) {

      if (
        error.name ===
        'TokenExpiredError'
      ) {

        return next(
          new ApiError(
            401,
            'Authentication token expired'
          )
        );

      }


      return next(
        new ApiError(
          401,
          'Invalid authentication token'
        )
      );

    }

  };


// ======================================================
// ADMIN ONLY
// ======================================================

const admin =
  (req, res, next) => {

    if (
      !req.user
    ) {

      return next(
        new ApiError(
          401,
          'Authentication required'
        )
      );

    }


    if (
      req.user.role !==
      'admin'
    ) {

      return next(
        new ApiError(
          403,
          'Admin authorization required'
        )
      );

    }


    next();

  };


// ======================================================
// ROLE AUTHORIZATION
// ======================================================
//
// Example:
//
// authorizeRoles('admin')
//
// authorizeRoles(
//   'admin',
//   'staff'
// )
//
// authorizeRoles(
//   'admin',
//   'supplier'
// )
//

const authorizeRoles =
  (...allowedRoles) => {

    return (
      req,
      res,
      next
    ) => {

      if (
        !req.user
      ) {

        return next(
          new ApiError(
            401,
            'Authentication required'
          )
        );

      }


      if (
        !allowedRoles.includes(
          req.user.role
        )
      ) {

        return next(
          new ApiError(
            403,
            'You do not have permission to access this resource'
          )
        );

      }


      next();

    };

  };


module.exports = {

  protect,

  admin,

  authorizeRoles,

};