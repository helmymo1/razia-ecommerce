const express = require('express');
const router = express.Router();
const {
    getOrders,
    getAllOrders,
    getUserOrders,
    getOrderById,
    createOrder,
    updateOrderStatus,
    deleteOrder,
    updateOrderItemStatus,
    getAnalytics,
    requestRefund,
    processRefund,
    manageRequest,
    cancelOrder,
    trackOrder,
    getShipments,
    getShipmentLabel,
    syncShipment,
    dispatchOrder
} = require('./orderController');
const { protect, admin } = require('../../middleware/authMiddleware');

// Analytics Route (Place before /:id)
router.get('/analytics', protect, admin, getAnalytics);
const validate = require('../../middleware/validateRequest');
const { orderSchemas } = require('../../middleware/schemas');
const { transactionLimiter } = require('../../middleware/securityConfig');

router.route('/')
    .get(protect, require('../../middleware/authStatusCheck'), getOrders)
    .post(protect, require('../../middleware/authStatusCheck'), transactionLimiter, validate(orderSchemas.create), createOrder);

router.get('/admin', protect, admin, require('../../middleware/authStatusCheck'), getAllOrders);
router.get('/shipments', protect, admin, require('../../middleware/authStatusCheck'), getShipments); // Dashboard Route
router.get('/mine', protect, require('../../middleware/authStatusCheck'), getUserOrders);

router.route('/:id')
    .get(protect, require('../../middleware/authStatusCheck'), getOrderById)
    .delete(protect, admin, require('../../middleware/authStatusCheck'), deleteOrder);

router.route('/:id/status')
    .put(protect, admin, require('../../middleware/authStatusCheck'), updateOrderStatus);

router.route('/:id/refund')
    .post(protect, require('../../middleware/authStatusCheck'), requestRefund);

router.post('/:id/cancel', protect, require('../../middleware/authStatusCheck'), cancelOrder);

router.get('/:id/track', protect, require('../../middleware/authStatusCheck'), trackOrder);
router.get('/:id/label', protect, admin, require('../../middleware/authStatusCheck'), getShipmentLabel);
router.post('/:id/sync', protect, admin, require('../../middleware/authStatusCheck'), syncShipment);
router.post('/:id/dispatch', protect, admin, require('../../middleware/authStatusCheck'), dispatchOrder);


router.route('/:id/refund/:requestId/process')
    .put(protect, admin, require('../../middleware/authStatusCheck'), processRefund);

router.route('/:id/item/:itemId/status')
    .put(protect, admin, require('../../middleware/authStatusCheck'), updateOrderItemStatus);

router.route('/:id/manage-request')
    .put(protect, admin, require('../../middleware/authStatusCheck'), manageRequest);

module.exports = router;

