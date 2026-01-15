const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
const ADMIN_EMAIL = 'admin@ebazer.com';
const ADMIN_PASSWORD = 'password123';

async function runVerification() {
    let token = '';
    console.log('--- Starting Verification ---');

    // 1. Verify Seed Data (Login)
    try {
        console.log('\n[TEST 1] Testing Admin Login (Seed Data Fix)...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD
        });
        token = loginRes.data.token;
        console.log('✅ Login Successful! Token received.');
    } catch (error) {
        console.error('❌ Login Failed:', error.response ? error.response.data : error.message);
        process.exit(1);
    }

    const config = { headers: { Authorization: `Bearer ${token}` } };

    // 2. Verify Product Validation
    try {
        console.log('\n[TEST 2] Testing Validation Logic (Invalid JSON colors)...');
        // Valid fields but invalid colors JSON
        const invalidProduct = {
             name: "Invalid Color Product",
             sku: `INV-${Date.now()}`,
             price: 100,
             quantity: 10,
             colors: "not-a-json-array", 
             description: "Test"
        };
        
        await axios.post(`${API_URL}/products`, invalidProduct, config);
        console.error('❌ Validation Failed: Server accepted invalid JSON.');
    } catch (error) {
        if (error.response && error.response.status === 400) {
             const errors = error.response.data.errors || [];
             const colorError = errors.find(e => e.msg.includes('Colors must be a valid JSON'));
             if (colorError) {
                 console.log('✅ Validation Working! Rejected invalid JSON as expected.');
             } else {
                 console.log('⚠️ Got 400 but unexpected error message:', JSON.stringify(errors));
             }
        } else {
            console.error('❌ Unexpected Error during validation test:', error.message);
        }
    }

    // 3. Verify Soft Deletes
    try {
        console.log('\n[TEST 3] Testing Soft Deletes...');
        // Create Valid Product
        const validProduct = {
             name: "Soft Delete Test Product",
             sku: `DEL-${Date.now()}`,
             price: 50,
             quantity: 5,
             colors: JSON.stringify(["Red", "Blue"]),
             description: "To be deleted"
        };
        
        const createRes = await axios.post(`${API_URL}/products`, validProduct, config);
        const productId = createRes.data.id;
        console.log(`- Created product ID: ${productId}`);

        // Delete Product
        await axios.delete(`${API_URL}/products/${productId}`, config);
        console.log('- Product deleted via API');

        // Try to fetch by ID (Should be 404 or filtered out)
        try {
            await axios.get(`${API_URL}/products/${productId}`);
            console.error('❌ Soft Delete Failed: Product still accessible via GET /:id');
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.log('✅ GET /:id returned 404 (Correctly filtered)');
            } else {
                console.log(`- GET /:id returned ${error.response ? error.response.status : error.message}`);
            }
        }

        // Search list (Should not be there)
        const listRes = await axios.get(`${API_URL}/products`);
        const found = listRes.data.find(p => p.id === productId);
        if (found) {
            console.error('❌ Soft Delete Failed: Product still appears in GET /products list');
        } else {
            console.log('✅ Product absent from GET /products list');
        }

    } catch (error) {
        console.error('❌ Soft Delete Test Error:', error.response ? error.response.data : error.message);
    }
}

runVerification();
