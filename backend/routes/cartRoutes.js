const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect } = require('../middleware/authMiddleware');

// Helper to get or create cart
const getOrCreateCart = (userId, callback) => {
    db.query('SELECT id FROM carts WHERE user_id = ?', [userId], (err, results) => {
        if (err) return callback(err);
        if (results.length > 0) return callback(null, results[0].id);
        
        db.query('INSERT INTO carts (user_id) VALUES (?)', [userId], (err, result) => {
            if (err) return callback(err);
            callback(null, result.insertId);
        });
    });
};

// Get Cart
router.get('/', protect, (req, res) => {
    getOrCreateCart(req.user.id, (err, cartId) => {
        if (err) return res.status(500).json({ message: 'Error retrieving cart' });
        
        const sql = `
            SELECT ci.id, ci.quantity, p.id as product_id, p.name, p.price, p.image_url 
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.cart_id = ?`;
            
        db.query(sql, [cartId], (err, results) => {
            if (err) return res.status(500).json({ message: 'Database error', error: err });
            res.json({ cartId, items: results });
        });
    });
});

// Add Item to Cart
router.post('/', protect, (req, res) => {
    const { product_id, quantity } = req.body;
    getOrCreateCart(req.user.id, (err, cartId) => {
        if (err) return res.status(500).json({ message: 'Error retrieving cart' });
        
        // Check if item exists
        db.query('SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?', [cartId, product_id], (err, results) => {
            if (err) return res.status(500).json({ message: 'Error checking item' });
            
            if (results.length > 0) {
                // Update quantity
                const newQty = results[0].quantity + (quantity || 1);
                db.query('UPDATE cart_items SET quantity = ? WHERE id = ?', [newQty, results[0].id], (err) => {
                    if (err) return res.status(500).json({ message: 'Error updating quantity' });
                    res.json({ message: 'Cart updated' });
                });
            } else {
                // Insert new item
                db.query('INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)', [cartId, product_id, quantity || 1], (err) => {
                    if (err) return res.status(500).json({ message: 'Error adding item' });
                    res.status(201).json({ message: 'Item added to cart' });
                });
            }
        });
    });
});

// Remove Item
router.delete('/:itemId', protect, (req, res) => {
    // Ideally verify cart belongs to user, simplified here
    db.query('DELETE FROM cart_items WHERE id = ?', [req.params.itemId], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error removing item' });
        res.json({ message: 'Item removed' });
    });
});

module.exports = router;
