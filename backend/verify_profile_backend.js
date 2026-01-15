
const axios = require('axios');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
require('dotenv').config();

const API_URL = 'http://localhost:5000/api';
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
const DB_CONFIG = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

(async () => {
    let connection;
    try {
        console.log('--- STARTING PROFILE VERIFICATION ---');
        
        // 1. Setup DB Connection & Test User
        connection = await mysql.createConnection(DB_CONFIG);
        const [users] = await connection.query('SELECT * FROM users LIMIT 1');
        
        let user;
        if (users.length === 0) {
            console.log('No users found. Please create a user first.');
            process.exit(1);
        }
        user = users[0];
        console.log(`Using User: ${user.email} (${user.id})`);

        // 2. Generate Token
        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        const headers = { Authorization: `Bearer ${token}` };

        // 3. Test GET Profile
        console.log('\n[TEST] GET /users/profile');
        try {
            await axios.put(`${API_URL}/users/profile`, {
                address: '123 Test St', city: 'Test City', zip: '12345', phone: '555-555-5555', country: 'Testland'
            }, { headers });
            console.log('✅ Updated Profile');
        } catch (e) {
            console.error('❌ Failed Update Profile:', e.response?.data || e.message);
        }

        // 4. Test Change Password
        console.log('\n[TEST] PUT /users/password (Expect fail without correct current pass)');
        try {
             await axios.put(`${API_URL}/users/password`, {
                current_password: 'wrong_password', new_password: 'new_password123'
             }, { headers });
             console.error('❌ Should have failed!');
        } catch (e) {
            if (e.response && e.response.status === 401) {
                console.log('✅ Correctly rejected invalid current password (401)');
            } else if (e.response && e.response.status === 400) {
                 console.log(`✅ Correctly rejected (400): ${e.response.data.message}`);
            } else {
                console.error('❌ Failed with unexpected error:', e.response?.data || e.message);
            }
        }

        // 5. Test Wishlist
        console.log('\n[TEST] Wishlist Flow');
        // Get a product
        const [products] = await connection.query('SELECT id FROM products LIMIT 1');
        if (products.length > 0) {
            const productId = products[0].id;
            
            // Toggle On
            const resAdd = await axios.post(`${API_URL}/users/wishlist`, { product_id: productId }, { headers });
            console.log(`✅ Toggle 1: ${resAdd.data.message} (${resAdd.data.action})`);
            
            // Get Wishlist
            const resGet = await axios.get(`${API_URL}/users/wishlist`, { headers });
            console.log(`✅ Wishlist Count: ${resGet.data.length}`);
            
            if (resGet.data.find(i => i.product_id === productId)) {
                console.log('✅ Product found in wishlist');
            } else {
                console.error('❌ Product NOT found in wishlist');
            }

            // Toggle Off
            const resRemove = await axios.post(`${API_URL}/users/wishlist`, { product_id: productId }, { headers });
            console.log(`✅ Toggle 2: ${resRemove.data.message} (${resRemove.data.action})`);
        } else {
            console.log('⚠️ No products found to test wishlist');
        }

    } catch (error) {
        console.error('FATAL ERROR:', error.message);
    } finally {
        if (connection) await connection.end();
        console.log('\n--- VERIFICATION COMPLETE ---');
    }
})();
