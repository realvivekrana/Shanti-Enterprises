const express = require('express');
const router = express.Router();
const { getProductReviews, addReview, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:productId', getProductReviews);
router.post('/:productId', protect, addReview);
router.delete('/:reviewId', protect, deleteReview);

module.exports = router;