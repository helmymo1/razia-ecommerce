const express = require('express');
const router = express.Router();
const { handleOtoWebhook } = require('../controllers/webhookController');

// Define specific routes
router.post('/oto', handleOtoWebhook);

module.exports = router;
