const { createOrder } = require('./controllers/orderController');
const db = require('./config/db');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });

const runTest = async () => {
    let connection;
    try {
        console.log('🚀 Starting Referral Flow Test...');
        connection = await db.getConnection();

        // 1. Setup Test Data
        const referrerId = uuidv4();
        const refereeId = uuidv4();
        const productId = uuidv4(); // Product ID is also UUID
        const referralCode = 'TEST-REF1';

        console.log('📝 Creating Test Users & Product...');
        await connection.query("INSERT INTO users (id, name, email, password_hash, personal_referral_code) VALUES (?, 'Referrer', 'ref@example.com', 'hash', ?)", [referrerId, referralCode]);
        await connection.query("INSERT INTO users (id, name, email, password_hash) VALUES (?, 'Referee', 'referee@example.com', 'hash')", [refereeId]);
        
        await connection.query("INSERT INTO products (id, sku, price, stock_quantity, name_en, name_ar) VALUES (?, 'TEST-SKU', 100.00, 100, 'Test Product', 'منتج تجريبي')", [productId]);

        console.log('📦 Mocking Request...');
        const req = {
            user: { id: refereeId },
            body: {
                order_items: [{ product_id: productId, quantity: 1 }],
                referralCode: referralCode, 
                shipping_info: {
                    firstName: "John",
                    lastName: "Doe",
                    address: "123 Test St",
                    city: "Test City",
                    phone: "1234567890",
                    email: "referee@example.com"
                },
                save_to_profile: false
            }
        };

        const res = {
            status: function(code) { 
                console.log(`Response Status: ${code}`);
                return this; 
            },
            json: function(data) {
                console.log('Response JSON:', JSON.stringify(data, null, 2));
                return this;
            }
        };

        const next = (err) => {
            console.error('❌ Controller Error:', err);
        };

        // 2. Run Controller Logic
        console.log('▶️ Calling createOrder...');
        await createOrder(req, res, next);

        // 3. Verify Database Records
        console.log('🔍 Verifying Database...');
        
        // Check Referrals
        const [referrals] = await connection.query("SELECT * FROM referrals WHERE referrer_id = ? AND referee_id = ?", [referrerId, refereeId]);
        if (referrals.length > 0) {
            console.log('✅ Referral Record Found:', referrals[0]);
        } else {
            console.error('❌ No referral record found!');
        }

    } catch (error) {
        console.error('❌ Test Failed:', error);
    } finally {
        if (connection) {
            // Cleanup
            console.log('🧹 Cleaning up...');
            await connection.query("DELETE FROM referrals WHERE referrer_id IN (SELECT id FROM users WHERE email='ref@example.com')");
            await connection.query("DELETE FROM users WHERE email IN ('ref@example.com', 'referee@example.com')");
            await connection.query("DELETE FROM products WHERE sku='TEST-SKU'");
            connection.release();
        }
        process.exit();
    }
};

runTest();
