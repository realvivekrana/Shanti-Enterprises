const express = require('express');
const router = express.Router();
const { getUsers, getUserById, updateUserRole, updateUserStatus } = require('../controllers/userManagementController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', protect, admin, getUsers);
router.get('/:id', protect, admin, getUserById);
router.patch('/:id/role', protect, admin, updateUserRole);
router.patch('/:id/status', protect, admin, updateUserStatus);

module.exports = router;