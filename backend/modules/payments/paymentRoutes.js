const express = require('express');
const router = express.Router();
const { handlePaymentWebhook } = require('./paymentController');

// Helper wrapper for async errors if needed, but the controller is simple
router.post('/webhook', handlePaymentWebhook);

module.exports = router;
