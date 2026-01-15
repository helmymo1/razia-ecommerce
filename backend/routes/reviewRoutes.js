const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect } = require('../middleware/authMiddleware');

// Get Reviews for a Product
router.get('/product/:productId', (req, res) => {
  const sql = `
    SELECT r.*, u.name as user_name 
    FROM reviews r 
    JOIN users u ON r.user_id = u.id 
    WHERE r.product_id = ? 
    ORDER BY r.created_at DESC`;
    
  db.query(sql, [req.params.productId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    res.json(results);
  });
});

// Add Review (Protected)
router.post('/', protect, (req, res) => {
  const { product_id, rating, comment } = req.body;
  
  // Optional: Check if user already reviewed this product
  db.query('SELECT * FROM reviews WHERE product_id = ? AND user_id = ?', [product_id, req.user.id], (err, results) => {
    if (results.length > 0) {
        return res.status(400).json({ message: 'Product already reviewed' });
    }
    
    db.query('INSERT INTO reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)', 
      [product_id, req.user.id, rating, comment], 
      (err, result) => {
        if (err) return res.status(500).json({ message: 'Error adding review', error: err });
        res.status(201).json({ message: 'Review added' });
      }
    );
  });
});

module.exports = router;
