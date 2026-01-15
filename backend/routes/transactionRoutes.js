const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect, admin } = require('../middleware/authMiddleware');

// Get Transactions for an Order
router.get('/order/:orderId', protect, (req, res) => {
    // Verify user owns order or is admin
    const sql = `SELECT * FROM transactions WHERE order_id = ?`;
    db.query(sql, [req.params.orderId], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        res.json(results);
    });
});

// Create Transaction (Simulated Payment Callback)
router.post('/', protect, (req, res) => {
    const { order_id, transaction_id, payment_method, amount, status } = req.body;
    
    // In a real app, this would verify webhook signatures from Stripe/PayPal
    
    const sql = `INSERT INTO transactions (order_id, transaction_id, payment_method, amount, status) 
                 VALUES (?, ?, ?, ?, ?)`;
                 
    db.query(sql, [order_id, transaction_id, payment_method, amount, status || 'pending'], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error recording transaction', error: err });
        
        // Update Order Status if payment completed
        if (status === 'completed') {
            db.query('UPDATE orders SET status = "processing" WHERE id = ?', [order_id]);
        }
        
        res.status(201).json({ message: 'Transaction recorded', transactionId: result.insertId });
    });
});

module.exports = router;
