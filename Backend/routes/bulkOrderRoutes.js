const express =
  require('express');

const {
  uploadBulkOrder,
} = require(
  '../controllers/bulkOrderController'
);

const bulkOrderUpload =
  require(
    '../middleware/bulkOrderUploadMiddleware'
  );

// Pehle yahan 'protect' nahi tha — koi bhi bina login
// ke bulk order file upload/parse kar sakta tha.
// Yeh feature customer ke liye hai, isliye login zaroori hai.
const {
  protect,
} = require(
  '../middleware/authMiddleware'
);


const router =
  express.Router();


// ======================================================
// BULK ORDER UPLOAD
// ======================================================

router.post(

  '/upload',

  protect,

  bulkOrderUpload.single(
    'file'
  ),

  uploadBulkOrder

);


module.exports =
  router;