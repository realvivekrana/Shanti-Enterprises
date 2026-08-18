const express = require('express');
const router = express.Router();
const { adjustStock, setStock, getLowStockProducts } = require('../controllers/inventoryController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/low-stock', protect, admin, getLowStockProducts);
router.patch('/:id/adjust', protect, admin, adjustStock);
router.patch('/:id/set', protect, admin, setStock);

module.exports = router;