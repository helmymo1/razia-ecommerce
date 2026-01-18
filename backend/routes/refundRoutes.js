const express = require('express');
const router = express.Router();
const refundController = require('../controllers/refundController');
const { protect, admin } = require('../middleware/authMiddleware');

// User Routes
router.post('/', protect, refundController.createRefundRequest);

// Admin Routes
router.get('/admin/all', protect, admin, refundController.getAllRefunds); // Matches /api/refunds/admin/all
router.get('/admin/refunds/all', protect, admin, refundController.getAllRefunds); // Aliased for safety if needed
router.put('/admin/:id/resolve', protect, admin, refundController.resolveRefund);

module.exports = router;
