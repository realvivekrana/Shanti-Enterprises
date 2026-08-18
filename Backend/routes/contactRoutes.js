const express = require('express');
const router = express.Router();
const { submitEnquiry, getEnquiries, updateEnquiryStatus } = require('../controllers/contactController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', submitEnquiry);
router.get('/', protect, admin, getEnquiries);
router.patch('/:id', protect, admin, updateEnquiryStatus);

module.exports = router;