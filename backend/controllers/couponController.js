const db = require('../config/db');
const { logAdminAction } = require('../utils/auditLogger');

// @desc    Get All Coupons (Admin)
// @route   GET /api/coupons
// @access  Private/Admin
const getCoupons = async (req, res, next) => {
  try {
    const [results] = await db.query('SELECT * FROM coupons WHERE is_deleted = 0 ORDER BY created_at DESC');
    res.json(results);
  } catch (err) {
    next(err);
  }
};

// @desc    Create Coupon
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = async (req, res, next) => {
  const { code, discount_type, discount_value, start_date, end_date, usage_limit } = req.body;
  
  try {
    const [result] = await db.query('INSERT INTO coupons (code, discount_type, discount_value, start_date, end_date, usage_limit) VALUES (?, ?, ?, ?, ?, ?)', 
      [code, discount_type, discount_value, start_date, end_date, usage_limit]
    );

    await logAdminAction(req.user.id, 'CREATE_COUPON', result.insertId, { code });

    res.status(201).json({ message: 'Coupon created', couponId: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
        res.status(400); 
        const error = new Error('Coupon code already exists');
        return next(error);
    }
    next(err);
  }
};

// @desc    Delete Coupon (Soft)
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
const deleteCoupon = async (req, res, next) => {
    try {
        const [result] = await db.query('UPDATE coupons SET is_deleted = 1 WHERE id = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Coupon not found' });
        }

        await logAdminAction(req.user.id, 'DELETE_COUPON', req.params.id, { reason: 'Soft Delete' });

        res.json({ message: 'Coupon soft deleted' });
    } catch (err) {
        next(err);
    }
};

// @desc    Verify Coupon (User Store)
// @route   POST /api/coupons/verify
// @access  Public
const verifyCoupon = async (req, res, next) => {
  const { code } = req.body;
  
  try {
    const [results] = await db.query('SELECT * FROM coupons WHERE code = ? AND status = "active" AND is_deleted = 0', [code]);
    if (results.length === 0) return res.status(404).json({ message: 'Invalid or inactive coupon' });
    
    const coupon = results[0];
    const now = new Date();
    
    if (coupon.start_date && new Date(coupon.start_date) > now) {
       return res.status(400).json({ message: 'Coupon not yet active' }); 
    }
    
    if (coupon.end_date && new Date(coupon.end_date) < now) {
       return res.status(400).json({ message: 'Coupon expired' }); 
    }

    if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
       return res.status(400).json({ message: 'Coupon usage limit reached' }); 
    }
    
    res.json(coupon);
  } catch (err) {
    next(err);
  }
};

module.exports = {
    getCoupons,
    createCoupon,
    deleteCoupon,
    verifyCoupon
};
