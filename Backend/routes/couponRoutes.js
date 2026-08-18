const express = require('express');
const router = express.Router();
const { createCoupon, getCoupons, deleteCoupon, applyCoupon } = require('../controllers/couponController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/apply', protect, applyCoupon);
router.post('/', protect, admin, createCoupon);
router.get('/', protect, admin, getCoupons);
router.delete('/:id', protect, admin, deleteCoupon);

module.exports = router;