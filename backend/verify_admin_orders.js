const axios = require('axios');
const db = require('./config/db');

const API_URL = 'http://localhost:5000/api';
const ADMIN_EMAIL = 'admin@ebazer.com';
const ADMIN_PASS = '123456';

async function verifyAdminOrders() {
    console.log('--- Verifying Admin Order Dashboard API ---');

    // 1. Login as Admin
    let token;
    try {
        const res = await axios.post(`${API_URL}/auth/login`, {
            email: ADMIN_EMAIL,
            password: ADMIN_PASS
        });
        token = res.data.token;
        console.log('✅ Admin Logged In');
    } catch (e) {
        console.error('❌ Login Failed:', e.message);
        process.exit(1);
    }

    // 2. Fetch All Orders
    try {
        const res = await axios.get(`${API_URL}/orders/admin`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        const orders = res.data;
        console.log(`✅ Fetched ${orders.length} orders`);

        if (orders.length > 0) {
            const firstOrder = orders[0];
            console.log('First Order Sample:', {
                id: firstOrder.id,
                total: firstOrder.total,
                status: firstOrder.status,
                user: firstOrder.user_name,
                items_count: firstOrder.items ? firstOrder.items.length : 0
            });

            if (Array.isArray(firstOrder.items)) {
                console.log('✅ Items Structure: Valid JSON Array');
            } else {
                console.error('❌ Items Structure: Not an array (JSON_ARRAYAGG failed?)');
            }
        } else {
            console.log('⚠️ No orders to verify structure against.');
        }

    } catch (e) {
        console.error('❌ Fetch Admin Orders Failed:', e.response?.data?.message || e.message);
    }

    process.exit();
}

verifyAdminOrders();
