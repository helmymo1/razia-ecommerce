const express = require('express');
const router = express.Router();
const { track, getDashboard, exportData } = require('../controllers/analyticsController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/track', track);
router.get('/dashboard', protect, admin, getDashboard);
router.get('/export', protect, admin, exportData);

module.exports = router;
