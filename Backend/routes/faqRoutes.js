const express = require('express');
const router = express.Router();
const { getFAQs, getAllFAQsAdmin, createFAQ, updateFAQ, deleteFAQ } = require('../controllers/faqController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getFAQs);
router.get('/all', protect, admin, getAllFAQsAdmin);
router.post('/', protect, admin, createFAQ);
router.put('/:id', protect, admin, updateFAQ);
router.delete('/:id', protect, admin, deleteFAQ);

module.exports = router;