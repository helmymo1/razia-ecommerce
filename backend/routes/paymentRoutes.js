const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

const { protect } = require('../middleware/authMiddleware');

// The route definition
router.post('/initiate', protect, paymentController.initiatePayment);
router.post('/webhook', paymentController.handleWebhook); 
// Note: This becomes /api/payment/webhook when mounted

module.exports = router;
