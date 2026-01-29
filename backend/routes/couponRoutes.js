const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getCoupons,
  createCoupon,
  deleteCoupon,
  verifyCoupon
} = require('../controllers/couponController');

// Admin Routes
router.route('/')
  .get(protect, admin, getCoupons)
  .post(protect, admin, createCoupon);

router.delete('/:id', protect, admin, deleteCoupon);

// Public/User Routes
router.post('/verify', verifyCoupon);

module.exports = router;
