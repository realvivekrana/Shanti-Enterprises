const express = require('express');
const router = express.Router();
const {
  createReturnRequest,
  getMyReturnRequests,
  getAllReturnRequests,
  updateReturnStatus,
} = require('../controllers/returnController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/:orderId', protect, createReturnRequest);
router.get('/mine', protect, getMyReturnRequests);
router.get('/', protect, admin, getAllReturnRequests);
router.patch('/:id', protect, admin, updateReturnStatus);

module.exports = router;