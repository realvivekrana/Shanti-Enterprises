const { rateLimit } =
  require('express-rate-limit');


// ======================================================
// GLOBAL API RATE LIMITER
// ======================================================
//
// Har IP ko 15 minutes mein maximum 300 requests.
//

const globalRateLimiter =
  rateLimit({

    windowMs:
      15 * 60 * 1000,

    limit:
      300,

    standardHeaders:
      'draft-8',

    legacyHeaders:
      false,

    message: {

      success:
        false,

      message:
        'Too many requests. Please try again later.',

    },

  });


// ======================================================
// AUTH RATE LIMITER
// ======================================================
//
// Login / Register / authentication endpoints ko
// brute-force attacks se protect karta hai.
//

const authRateLimiter =
  rateLimit({

    windowMs:
      15 * 60 * 1000,

    limit:
      10,

    standardHeaders:
      'draft-8',

    legacyHeaders:
      false,

    message: {

      success:
        false,

      message:
        'Too many authentication attempts. Please try again after 15 minutes.',

    },

  });


// ======================================================
// PAYMENT RATE LIMITER
// ======================================================
//
// Payment endpoints par repeated requests ko limit karta hai.
//

const paymentRateLimiter =
  rateLimit({

    windowMs:
      15 * 60 * 1000,

    limit:
      30,

    standardHeaders:
      'draft-8',

    legacyHeaders:
      false,

    message: {

      success:
        false,

      message:
        'Too many payment requests. Please try again later.',

    },

  });


module.exports = {

  globalRateLimiter,

  authRateLimiter,

  paymentRateLimiter,

};