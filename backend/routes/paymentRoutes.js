const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

const { protect } = require('../middleware/authMiddleware');

// The route definition
// The route definition
router.post('/initiate', protect, paymentController.payWithPaymob);
// router.post('/webhook', paymentController.handleWebhook); 
// Note: This becomes /api/payment/webhook when mounted

module.exports = router;
