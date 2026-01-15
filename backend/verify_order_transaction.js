const axios = require('axios');
const db = require('./config/db'); // Use existing DB config for direct checks

const API_URL = 'http://localhost:5000/api';
let AUTH_TOKEN = '';
let PRODUCT_ID = 0;
let INITIAL_STOCK = 0;

async function loginAdmin() {
    try {
        const res = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@ebazer.com',
            password: 'password123' // Using seeded admin password
        });
        AUTH_TOKEN = res.data.token;
        console.log('✅ Logged in');
    } catch (error) {
        console.error('❌ Login failed:', error.message);
        process.exit(1);
    }
}

async function getProductStock() {
    const [rows] = await db.query('SELECT id, stock_quantity FROM products WHERE stock_quantity > 5 LIMIT 1');
    if (rows.length === 0) throw new Error('No testable product found');
    PRODUCT_ID = rows[0].id;
    INITIAL_STOCK = rows[0].stock_quantity;
    console.log(`ℹ️ Selected Product ${PRODUCT_ID} with Stock: ${INITIAL_STOCK}`);
}

async function verifyOrderTransaction() {
    console.log('--- Verifying Order Transaction ---');
    await loginAdmin();
    await getProductStock();

    // TEST 1: Successful Order
    console.log('\n--- Test 1: Valid Purchase (Qty: 1) ---');
    try {
        const res = await axios.post(`${API_URL}/orders`, {
            order_items: [{ product_id: PRODUCT_ID, quantity: 1 }]
        }, {
            headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
        });
        console.log('✅ Order Created:', res.data.id);
        
        const [rows] = await db.query('SELECT stock_quantity FROM products WHERE id = ?', [PRODUCT_ID]);
        const newStock = rows[0].stock_quantity;
        
        if (newStock === INITIAL_STOCK - 1) {
            console.log('✅ Stock deducted correctly');
        } else {
            console.error(`❌ Stock validation failed. Expected ${INITIAL_STOCK - 1}, got ${newStock}`);
        }
        INITIAL_STOCK = newStock; // Update for next test
    } catch (error) {
        console.error('❌ Test 1 Failed:', error.response?.data?.message || error.message);
    }

    // TEST 2: Overstock Purchase (Transaction Rollback)
    console.log('\n--- Test 2: Overstock Purchase (Should Fail) ---');
    const excessiveQty = INITIAL_STOCK + 10;
    try {
        await axios.post(`${API_URL}/orders`, {
            order_items: [{ product_id: PRODUCT_ID, quantity: excessiveQty }]
        }, {
            headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
        });
        console.error('❌ Test 2 Failed: Order should have been rejected');
    } catch (error) {
        if (error.response?.status === 500 || error.response?.status === 400) {
            console.log(`✅ Request rejected as expected (${error.response.status})`);
        } else {
            console.error(`❌ Unexpected error code: ${error.response?.status}`);
        }
    }

    // Verify Stock Unchanged
    const [rows] = await db.query('SELECT stock_quantity FROM products WHERE id = ?', [PRODUCT_ID]);
    if (rows[0].stock_quantity === INITIAL_STOCK) {
        console.log('✅ Stock remained unchanged (Rollback successful)');
    } else {
        console.error(`❌ Critical: Stock changed after failed transaction! Got ${rows[0].stock_quantity}`);
    }

    process.exit();
}

verifyOrderTransaction();
