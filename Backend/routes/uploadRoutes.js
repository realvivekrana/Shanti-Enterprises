const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { uploadImage } = require('../controllers/uploadController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, admin, (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Upload error:', err.message || err);
      return res.status(500).json({ message: err.message || 'Upload failed' });
    }
    next();
  });
}, uploadImage);

module.exports = router;