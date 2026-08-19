const multer = require('multer');


// ======================================================
// MEMORY STORAGE
// ======================================================
//
// File ko server ke disk par save nahi karenge.
// Direct memory buffer se Excel/CSV read karenge.
//

const storage = multer.memoryStorage();


// ======================================================
// FILE FILTER
// ======================================================

const fileFilter = (req, file, cb) => {

  const allowedExtensions = [
    '.csv',
    '.xlsx',
    '.xls',
  ];

  const fileName =
    file.originalname.toLowerCase();

  const isAllowed =
    allowedExtensions.some(
      (extension) =>
        fileName.endsWith(extension)
    );


  if (!isAllowed) {

    return cb(
      new Error(
        'Only CSV, XLSX and XLS files are allowed.'
      ),
      false
    );
  }


  cb(null, true);
};


// ======================================================
// MULTER CONFIGURATION
// ======================================================

const bulkOrderUpload = multer({

  storage,

  fileFilter,

  limits: {

    // Maximum file size = 5 MB
    fileSize: 5 * 1024 * 1024,

  },

});


module.exports =
  bulkOrderUpload;