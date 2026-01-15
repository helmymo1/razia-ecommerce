const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect } = require('../middleware/authMiddleware');

// Get Wishlist
router.get('/', protect, (req, res) => {
  const sql = `
    SELECT p.*, w.created_at as added_at 
    FROM wishlist w 
    JOIN products p ON w.product_id = p.id 
    WHERE w.user_id = ?`;
    
  db.query(sql, [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    res.json(results);
  });
});

// Add to Wishlist
router.post('/', protect, (req, res) => {
  const { product_id } = req.body;
  
  db.query('INSERT IGNORE INTO wishlist (user_id, product_id) VALUES (?, ?)', [req.user.id, product_id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error adding to wishlist', error: err });
    res.status(201).json({ message: 'Added to wishlist' });
  });
});

// Remove from Wishlist
router.delete('/:productId', protect, (req, res) => {
  db.query('DELETE FROM wishlist WHERE user_id = ? AND product_id = ?', [req.user.id, req.params.productId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error removing from wishlist', error: err });
    res.json({ message: 'Removed from wishlist' });
  });
});

module.exports = router;
