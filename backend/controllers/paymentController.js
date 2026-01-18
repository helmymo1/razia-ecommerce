const crypto = require('crypto');
const db = require('../config/db'); // Your database connection
const { initiatePayment } = require('../services/paymobService');
const emailService = require('../services/emailService');

exports.initiatePayment = async (req, res) => {
    try {
        const { items, shipping_info, order_id } = req.body;
        // User from Auth Middleware (preferred) OR fallback to shipping_info
        const user = req.user || {
            name: `${shipping_info.firstName} ${shipping_info.lastName}`,
            email: shipping_info.email,
            phone: shipping_info.phone,
            address: shipping_info.address,
            city: shipping_info.city,
            zip: shipping_info.zipCode
        };

        // Calculate Total
        const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Call Service
        const paymentData = await initiatePayment(user, totalAmount, items, order_id);
        
        res.json(paymentData);
    } catch (error) {
        console.error("Initiate Payment Error:", error);
        res.status(500).json({ message: "Failed to initiate payment" });
    }
};

exports.handleWebhook = async (req, res) => {
    try {
        const { obj } = req.body;
        const receivedHmac = req.query.hmac;
        const hmacSecret = process.env.PAYMOB_HMAC_SECRET;

        // 1. DATA EXTRACTION & SORTING
        // Paymob requires sorting specific keys lexicographically
        const keys = [
            "amount_cents", "created_at", "currency", "error_occured", 
            "has_parent_transaction", "id", "integration_id", 
            "is_3d_secure", "is_auth", "is_capture", "is_refunded", 
            "is_standalone_payment", "is_voided", "order", "owner", 
            "pending", "source_data.pan", "source_data.sub_type", 
            "source_data.type", "success"
        ];
        
        // 2. CONCATENATE VALUES
        let concatenatedString = '';
        keys.sort().forEach(key => {
            // Access nested properties like source_data.type
            const value = key.split('.').reduce((o, i) => o?.[i], obj);
            concatenatedString += value;
        });

        // 3. HASHING (HMAC SHA512)
        const calculatedHmac = crypto
            .createHmac('sha512', hmacSecret)
            .update(concatenatedString)
            .digest('hex');

        // 4. VERIFICATION
        if (calculatedHmac !== receivedHmac) {
            console.error('⛔ HMAC Mismatch! Possible Fraud Attempt.');
            return res.status(403).json({ message: "Invalid Signature" });
        }

        // 5. PROCESS ORDER
        if (obj.success === true) {
            console.log(`✅ Payment Success for Order PaymobID: ${obj.order.id}`);
            
            const orderId = obj.merchant_order_id;

            // Update Status
            await db.execute(
                "UPDATE orders SET status = 'processing', payment_status = 'paid' WHERE id = ?", 
                [orderId] 
            );

            // Fetch Order & User Details for Email
            const [orderRows] = await db.query(
                `SELECT o.*, u.email as user_email 
                 FROM orders o 
                 JOIN users u ON o.user_id = u.id 
                 WHERE o.id = ?`, 
                [orderId]
            );

            if (orderRows.length > 0) {
                const orderDetails = orderRows[0];

                // Fetch Order Items
                const [items] = await db.query(
                    `SELECT p.name_en as name, oi.quantity, oi.unit_price
                     FROM order_items oi 
                     JOIN products p ON oi.product_id = p.id 
                     WHERE oi.order_id = ?`,
                    [orderId]
                );

                // Send Confirmation Email
                if (orderDetails.user_email) {
                    await emailService.sendOrderConfirmation(orderDetails, items);
                }

                // --- REFERRAL REWARD LOGIC ---
                // Check for pending referral linked to this order
                const [referrals] = await db.query(
                    "SELECT * FROM referrals WHERE referee_order_id = ? AND status = 'pending'",
                    [orderId]
                );

                if (referrals.length > 0) {
                    const referral = referrals[0];
                    const referrerId = referral.referrer_id;

                    // Generate Unique Coupon Code
                    const randomSuffix = Math.floor(1000 + Math.random() * 9000); // 4 digit random
                    // Fetch Referrer Name for personalization (optional, using generic for now)
                    const rewardCode = `THANKS-${randomSuffix}`;

                    // Create Coupon in DB
                    // Expires in 30 days
                    const expiryDate = new Date();
                    expiryDate.setDate(expiryDate.getDate() + 30);

                    await db.execute(
                        `INSERT INTO coupons (code, discount_type, discount_value, start_date, end_date, usage_limit, status, created_at) 
                         VALUES (?, 'percentage', 15.00, NOW(), ?, 1, 'active', NOW())`,
                        [rewardCode, expiryDate]
                    );

                    // Update Referral Status
                    await db.execute(
                        "UPDATE referrals SET status = 'completed', reward_coupon_code = ? WHERE id = ?",
                        [rewardCode, referral.id]
                    );

                    // Send Email to Referrer
                    // We need referrer email
                    const [referrerRows] = await db.query("SELECT email FROM users WHERE id = ?", [referrerId]);
                    if (referrerRows.length > 0) {
                        await emailService.sendReferralReward(referrerRows[0].email, rewardCode);
                        console.log(`🎁 Reward sent to referrer ${referrerRows[0].email}`);
                    }
                }
                // -----------------------------
            }

        } else {
             console.log(`❌ Payment Failed/Pending for Order ${obj.order.id}`);
        }

        // Always return 200 to acknowledge receipt to Paymob
        return res.status(200).send();

    } catch (error) {
        console.error("Webhook Error:", error);
        // Return 200 even on error to stop Paymob from retrying indefinitely
        return res.status(200).send();
    }
};
