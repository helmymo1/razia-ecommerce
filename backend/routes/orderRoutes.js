const express = require('express');
const router = express.Router();
const {
    getOrders,
    getAllOrders,
    getUserOrders,
    getOrderById,
    createOrder,
    updateOrderStatus,
    deleteOrder
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateRequest');
const { orderSchemas } = require('../middleware/schemas');
const { transactionLimiter } = require('../middleware/securityConfig');

router.route('/')
    .get(protect, require('../middleware/authStatusCheck'), getOrders)
    .post(protect, require('../middleware/authStatusCheck'), transactionLimiter, validate(orderSchemas.create), createOrder);

router.get('/admin', protect, admin, require('../middleware/authStatusCheck'), getAllOrders);
router.get('/mine', protect, require('../middleware/authStatusCheck'), getUserOrders);

router.route('/:id')
    .get(protect, require('../middleware/authStatusCheck'), getOrderById)
    .delete(protect, admin, require('../middleware/authStatusCheck'), deleteOrder);

router.route('/:id/status')
    .put(protect, admin, require('../middleware/authStatusCheck'), updateOrderStatus);

module.exports = router;
