const express = require('express');
const router = express.Router();
const {
    getStats,
    getSalesChart,
    getRecentOrders,
    getBestSellers,
    getLowStock
} = require('../controllers/dashboardController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/stats', protect, admin, require('../middleware/authStatusCheck'), getStats);
router.get('/sales-chart', protect, admin, require('../middleware/authStatusCheck'), getSalesChart);
router.get('/recent-orders', protect, admin, require('../middleware/authStatusCheck'), getRecentOrders);
router.get('/best-sellers', protect, admin, require('../middleware/authStatusCheck'), getBestSellers);
router.get('/low-stock', protect, admin, require('../middleware/authStatusCheck'), getLowStock);

module.exports = router;
