const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect } = require('../middleware/authMiddleware');

// Get User Addresses
router.get('/', protect, (req, res) => {
  db.query('SELECT * FROM addresses WHERE user_id = ?', [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    res.json(results);
  });
});

// Add Address
router.post('/', protect, (req, res) => {
  const { type, line1, line2, city, state, zip, country, is_default } = req.body;
  
  // If setting as default, unset other defaults first (optional logic, kept simple here)
  
  const sql = `INSERT INTO addresses (user_id, type, line1, line2, city, state, zip, country, is_default) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
               
  db.query(sql, [req.user.id, type, line1, line2, city, state, zip, country, is_default], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error adding address', error: err });
    res.status(201).json({ message: 'Address added', addressId: result.insertId });
  });
});

// Delete Address
router.delete('/:id', protect, (req, res) => {
    db.query('DELETE FROM addresses WHERE id = ? AND user_id = ?', [req.params.id, req.user.id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error deleting address', error: err });
        res.json({ message: 'Address deleted' });
    });
});

module.exports = router;
