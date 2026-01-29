const db = require('../config/db');

// @desc    Handle OTO Webhook Events
// @route   POST /api/webhooks/oto
// @access  Public (Should verify signature in prod)
const handleOtoWebhook = async (req, res, next) => {
    try {
        console.log("🔔 [OTO Webhook] Received Event:", JSON.stringify(req.body));
        
        const { orderId, status, deliveryId, timestamp } = req.body;

        // OTO payload structure might vary. Assuming:
        // { orderId: "ORD-123", status: "delivered", deliveryId: "OTO-999" ... }
        // If orderId matches our local ID or OTO ID, we proceed.

        if (!orderId && !deliveryId) {
            return res.status(400).json({ message: "Missing order identifiers" });
        }

        // Normalize status
        const normalizedStatus = status.toLowerCase();

        if (normalizedStatus === 'delivered') {
             // Update Order
             await db.query(`
                UPDATE orders 
                SET status = 'delivered', 
                    is_delivered = 1, 
                    delivered_at = NOW(), 
                    delivery_status = 'delivered'
                WHERE delivery_id = ? OR id = ? OR order_number = ?`, 
                [deliveryId, orderId, orderId]
             );
             console.log(`✅ [OTO Webhook] Order marked as delivered.`);
             
             // Emit Event?
             const bus = require('../src/events/eventBus');
             // We need to fetch ID first to be safe, but simple update is faster.
             
        } else if (normalizedStatus === 'returned') {
             await db.query(`
                UPDATE orders 
                SET status = 'returned', 
                    delivery_status = 'returned'
                WHERE delivery_id = ? OR id = ? OR order_number = ?`, 
                [deliveryId, orderId, orderId]
             );
              console.log(`↩️ [OTO Webhook] Order marked as returned.`);
        } else {
            // Update generic delivery status for other events (shipped, out_for_delivery)
            await db.query(`
                UPDATE orders 
                SET delivery_status = ? 
                WHERE delivery_id = ? OR id = ? OR order_number = ?`, 
                [normalizedStatus, deliveryId, orderId, orderId]
             );
             console.log(`ℹ️ [OTO Webhook] Delivery status updated: ${normalizedStatus}`);
        }

        res.status(200).json({ message: "Webhook processed" });

    } catch (error) {
        console.error("❌ [OTO Webhook] Error:", error.message);
        // Return 200 to prevent OTO from retrying indefinitely on logic error?
        // Or 500 to retry? Assuming 200 if it's our logic error.
        res.status(500).json({ message: "Webhook Processing Failed" });
    }
};

module.exports = {
    handleOtoWebhook
};
