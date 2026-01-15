const axios = require('axios');
const API_URL = 'http://localhost:5000/api';

async function setup() {
    const email = 'verifier@example.com';
    const password = 'Password123!';
    let token;

    try {
        // 1. Login or Register
        console.log('Logging in...');
        try {
            const loginRes = await axios.post(`${API_URL}/auth/login`, { email, password });
            token = loginRes.data.token;
            console.log('Logged in.');
        } catch (e) {
            console.log('Login failed, registering...');
            const regRes = await axios.post(`${API_URL}/auth/register`, {
                name: 'Verifier',
                email,
                password,
                role: 'customer'
            });
            token = regRes.data.token;
            console.log('Registered.');
        }

        // 2. Create Order
        // Need a product first? Or existing products?
        // use product_id from existing database?
        // I'll try to fetch products first
        // If not, I'll assume some IDs or fail.
        // Actually, order creation requires existing product ID and stock.
        // If I don't have products, I can't create order easily without seeding.
        // I'll skip order creation via API if it's complex, or try to pick one.
        
        console.log('Fetching products...');
        // Public endpoint?
        // Assuming /api/products is public or I have token
        let products = [];
        try {
            const prodRes = await axios.get(`${API_URL}/products`); // might be public
            products = prodRes.data.products || prodRes.data; // adjust based on response structure
        } catch (e) {
            console.log('Failed to fetch public products');
        }

        if (products.length > 0) {
            const product = products[0];
            console.log(`Using product: ${product.id}`);
            
            const orderRes = await axios.post(`${API_URL}/orders`, {
                order_items: [
                    { product_id: product.id, quantity: 1 }
                ]
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Order created:', orderRes.data.id);
        } else {
            console.log('No products found to create order. Please populate database.');
        }

        console.log('Setup Complete.');
        console.log('User: verifier@example.com');
        console.log('Pass: Password123!');

    } catch (e) {
        console.error('Setup Failed:', e.response?.data || e.message);
    }
}

setup();
