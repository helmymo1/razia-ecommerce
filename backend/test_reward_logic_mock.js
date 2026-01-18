const { handleWebhook } = require('./controllers/paymentController');
const db = require('./config/db');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const dotenv = require('dotenv');
const crypto = require('crypto');

dotenv.config({ path: path.join(__dirname, '.env') });

const runTest = async () => {
    let connection;
    try {
        console.log('🚀 Starting Reward Logic Test...');
        connection = await db.getConnection();

        // 1. Setup Test Data
        const referrerId = uuidv4();
        const refereeId = uuidv4();
        const orderId = uuidv4(); // Order ID (UUID)
        // Paymob requires merchant_order_id to match our DB ID
        
        console.log('📝 Creating Data...');
        await connection.query("INSERT INTO users (id, name, email, password_hash) VALUES (?, 'ReferrerReward', 'reward@example.com', 'hash')", [referrerId]);
        await connection.query("INSERT INTO users (id, name, email, password_hash) VALUES (?, 'RefereeReward', 'refereereward@example.com', 'hash')", [refereeId]);
        
        // Create Pending Order
        const uniqueOrderNumber = `ORD-${Date.now()}`;
        await connection.query(
            "INSERT INTO orders (id, user_id, order_number, total, subtotal, status, payment_status, shipping_name, shipping_phone, shipping_address, shipping_city, shipping_zip) VALUES (?, ?, ?, 100, 100, 'pending', 'pending', 'Test User', '1234567890', '{\"address\": \"123 St\"}', 'Test City', '12345')", 
            [orderId, refereeId, uniqueOrderNumber]
        );
        
        const productId = uuidv4();
        await connection.query("INSERT INTO products (id, sku, price, stock_quantity, name_en, name_ar) VALUES (?, 'REWARD-TEST-PROD', 100.00, 100, 'Test Product', 'منتج تجريبي')", [productId]);

        await connection.query(
            "INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, total_price, product_name) VALUES (?, ?, ?, 1, 100, 100, 'Test Product')",
            [uuidv4(), orderId, productId]
        );
        await connection.query(
            "INSERT INTO referrals (referrer_id, referee_id, referee_order_id, status) VALUES (?, ?, ?, 'pending')",
            [referrerId, refereeId, orderId]
        );

        // 2. Mock Webhook Request
        const mockPayload = {
            obj: {
                success: true,
                order: { id: 12345 },
                merchant_order_id: orderId,
                amount_cents: 10000,
                // Add other fields as per sort order for HMAC... or just mock HMAC verification bypass if possible?
                // Logic relies on HMAC verification passing. 
                // Alternatively, we can mock `req.body` and generated HMAC.
                // Or, strictly for this test, since we control the controller, we can simulate the HMAC match or just invoke the "Process Order" part if we extract it?
                // But `handleWebhook` is monolithic. 
                
                // Let's rely on constructing a valid HMAC.
                // Required fields for HMAC sorting:
                amount_cents: 10000,
                created_at: "2023-01-01T00:00:00.000000",
                currency: "EGP",
                error_occured: false,
                has_parent_transaction: false,
                id: 999999,
                integration_id: 123,
                is_3d_secure: false,
                is_auth: false,
                is_capture: false,
                is_refunded: false,
                is_standalone_payment: false,
                is_voided: false,
                order: { id: 88888 },
                owner: 101,
                pending: false,
                source_data: { pan: "xxxx", sub_type: "Visa", type: "card" },
                success: true
            }
        };

        // Construct HMAC
        const hmacSecret = process.env.PAYMOB_HMAC_SECRET || 'TEST_SECRET';
        // Temporarily set env if missing for test
        process.env.PAYMOB_HMAC_SECRET = hmacSecret;

        const keys = [
            "amount_cents", "created_at", "currency", "error_occured", 
            "has_parent_transaction", "id", "integration_id", 
            "is_3d_secure", "is_auth", "is_capture", "is_refunded", 
            "is_standalone_payment", "is_voided", "order", "owner", 
            "pending", "source_data.pan", "source_data.sub_type", 
            "source_data.type", "success"
        ];
        
        let concatenatedString = '';
        keys.sort().forEach(key => {
            const value = key.split('.').reduce((o, i) => o?.[i], mockPayload.obj);
            concatenatedString += value;
        });

        const hmac = crypto.createHmac('sha512', hmacSecret).update(concatenatedString).digest('hex');

        const req = {
            body: mockPayload,
            query: { hmac: hmac }
        };

        const res = {
            status: function(code) { console.log(`Response Status: ${code}`); return this; },
            json: function(d) { console.log('Response JSON:', d); return this; },
            send: function() { console.log('Response Sent'); return this; }
        };

        // 3. Call Controller
        console.log('▶️ Calling handleWebhook...');
        await handleWebhook(req, res);

        // 4. Verify Database
        console.log('🔍 Verifying...');
        const [referrals] = await connection.query("SELECT * FROM referrals WHERE referee_order_id = ?", [orderId]);
        
        if (referrals[0].status === 'completed' && referrals[0].reward_coupon_code) {
            console.log('✅ Referral COMPLETED. Coupon Code:', referrals[0].reward_coupon_code);
            
            // Check Coupon Table too
            const [coupons] = await connection.query("SELECT * FROM coupons WHERE code = ?", [referrals[0].reward_coupon_code]);
            if (coupons.length > 0) {
                 console.log('✅ Coupon Created in DB:', coupons[0]);
            } else {
                 console.error('❌ Coupon NOT found in coupons table.');
            }

        } else {
            console.error('❌ Referral status NOT completed:', referrals[0]);
        }

    } catch (error) {
        console.error('❌ Test Failed:', error);
    } finally {
        if (connection) {
            console.log('🧹 Cleaning up...');
            await connection.query("DELETE FROM referrals WHERE referrer_id IN (SELECT id FROM users WHERE email='reward@example.com')");
            await connection.query("DELETE FROM users WHERE email IN ('reward@example.com', 'refereereward@example.com')");
            await connection.query("DELETE FROM products WHERE sku='REWARD-TEST-PROD'");
            connection.release();
        }
        process.exit();
    }
};

runTest();
