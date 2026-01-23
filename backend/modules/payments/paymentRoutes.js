const express = require('express');
const router = express.Router();
const { handlePaymentWebhook } = require('./paymentController');
const { payWithPaymob } = require('../../controllers/paymentController');

// Initiate Payment (Restored)
router.post('/initiate', payWithPaymob);

// Webhook
router.post('/webhook', handlePaymentWebhook);

module.exports = router;
