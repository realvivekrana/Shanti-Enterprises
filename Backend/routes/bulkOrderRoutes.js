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


const router =
  express.Router();


// ======================================================
// BULK ORDER UPLOAD
// ======================================================

router.post(

  '/upload',

  bulkOrderUpload.single(
    'file'
  ),

  uploadBulkOrder

);


module.exports =
  router;