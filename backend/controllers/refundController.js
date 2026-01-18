const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const emailService = require('../services/emailService');

// Create Refund Request
exports.createRefundRequest = async (req, res) => {
    try {
        const { orderId, reason, pickupTime, phone } = req.body;
        const userId = req.user.id; // From authMiddleware

        if (!orderId || !reason || !pickupTime || !phone) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const refundId = uuidv4();

        // Check if order exists and belongs to user
        const [orders] = await db.query('SELECT * FROM orders WHERE id = ? AND user_id = ?', [orderId, userId]);
        if (orders.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Create Refund Request
        await db.query(
            `INSERT INTO refund_requests (id, order_id, user_id, reason, pickup_time, contact_phone, status) 
             VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
            [refundId, orderId, userId, reason, pickupTime, phone]
        );

        // Update Order Status
        await db.query("UPDATE orders SET payment_status = 'refund_requested' WHERE id = ?", [orderId]);

        // Email Notify Admin (Optional but good)
        await emailService.sendRefundRequestAdminNotification(orderId);

        res.status(201).json({ message: 'Refund request submitted successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get All Refund Requests (Admin)
exports.getAllRefunds = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                r.id, r.order_id, r.reason, r.status, r.created_at, r.pickup_time, r.contact_phone,
                u.first_name, u.last_name, u.email,
                o.total_amount
            FROM refund_requests r
            LEFT JOIN users u ON r.user_id = u.id
            LEFT JOIN orders o ON r.order_id = o.id
            ORDER BY r.created_at DESC
        `);

        const formatted = rows.map(row => ({
            id: row.id,
            order_id: row.order_id,
            reason: row.reason,
            pickup_time: row.pickup_time,
            contact_phone: row.contact_phone,
            status: row.status,
            user: {
                first_name: row.first_name,
                last_name: row.last_name,
                email: row.email
            },
            amount: row.total_amount,
            created_at: row.created_at
        }));

        res.json(formatted);
    } catch (error) {
        console.error("Error fetching refunds:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Resolve Refund Request (Admin)
exports.resolveRefund = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, emailBody } = req.body;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        // Get Request Details
        const [refunds] = await db.query(
            `SELECT r.*, u.email as user_email 
             FROM refund_requests r
             JOIN users u ON r.user_id = u.id 
             WHERE r.id = ?`, 
            [id]
        );

        if (refunds.length === 0) {
            return res.status(404).json({ message: 'Refund request not found' });
        }
        
        const refundRequest = refunds[0];

        // Update Refund Request
        await db.query(
            'UPDATE refund_requests SET status = ?, admin_response = ? WHERE id = ?',
            [status, emailBody, id]
        );

        // Update Order Status based on decision
        if (status === 'approved') {
            await db.query("UPDATE orders SET status = 'refunded', payment_status = 'refunded' WHERE id = ?", [refundRequest.order_id]);
        } else {
            // Revert payment status / ensure it's delivered/completed if rejected? 
            // Usually if rejected, we might set it back to 'delivered' or 'paid' depending on previous state.
            // Assuming 'delivered' is safe default fallback or 'paid'
             await db.query("UPDATE orders SET payment_status = 'paid' WHERE id = ?", [refundRequest.order_id]);
        }

        // Send Custom Email
        if (emailBody) {
             const subject = `Update on Refund Request #${refundRequest.order_id.slice(0, 8)}`;
            await emailService.sendCustomResponse(refundRequest.user_email, subject, emailBody);
        }

        res.json({ message: `Refund request ${status}` });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
