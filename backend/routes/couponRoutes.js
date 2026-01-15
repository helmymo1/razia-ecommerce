const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect, admin } = require('../middleware/authMiddleware');
const { logAdminAction } = require('../utils/auditLogger');

// Get All Coupons (Admin) - Filter is_deleted
router.get('/', protect, admin, async (req, res, next) => {
  try {
    const [results] = await db.query('SELECT * FROM coupons WHERE is_deleted = 0 ORDER BY created_at DESC');
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err });
  }
});

// Create Coupon (Admin)
router.post('/', protect, admin, async (req, res, next) => {
  const { code, discount_type, discount_value, start_date, end_date, usage_limit } = req.body;
  
  try {
    const [result] = await db.query('INSERT INTO coupons (code, discount_type, discount_value, start_date, end_date, usage_limit) VALUES (?, ?, ?, ?, ?, ?)', 
      [code, discount_type, discount_value, start_date, end_date, usage_limit]
    );

    // Audit Log
    await logAdminAction(req.user.id, 'CREATE_COUPON', result.insertId, { code });

    res.status(201).json({ message: 'Coupon created', couponId: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Error creating coupon', error: err });
  }
});

// Soft Delete Coupon
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const [result] = await db.query('UPDATE coupons SET is_deleted = 1 WHERE id = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Coupon not found' });
        }

        // Audit Log
        await logAdminAction(req.user.id, 'DELETE_COUPON', req.params.id, { reason: 'Soft Delete' });

        res.json({ message: 'Coupon soft deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Verify Coupon
router.post('/verify', async (req, res, next) => {
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
    res.status(500).json({ message: 'Database error', error: err });
  }
});

module.exports = router;
router.get('/', protect, admin, async (req, res, next) => {
  try {
    const [results] = await db.query('SELECT * FROM coupons');
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err });
  }
});

// Create Coupon (Admin)
router.post('/', protect, admin, async (req, res, next) => {
  const { code, discount_type, discount_value, start_date, end_date, usage_limit } = req.body;
  
  try {
    const [result] = await db.query('INSERT INTO coupons (code, discount_type, discount_value, start_date, end_date, usage_limit) VALUES (?, ?, ?, ?, ?, ?)', 
      [code, discount_type, discount_value, start_date, end_date, usage_limit]
    );
    res.status(201).json({ message: 'Coupon created', couponId: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Error creating coupon', error: err });
  }
});

// Verify Coupon
router.post('/verify', async (req, res, next) => {
  const { code } = req.body;
  
  try {
    const [results] = await db.query('SELECT * FROM coupons WHERE code = ? AND status = "active"', [code]);
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
    res.status(500).json({ message: 'Database error', error: err });
  }
});

module.exports = router;
