const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

const API_URL = 'http://localhost:5000/api';
const ADMIN_EMAIL = 'admin@ebazer.com';
const ADMIN_PASS = '123456';

async function verify() {
    try {
        // 1. Login
        console.log('Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: ADMIN_EMAIL,
            password: ADMIN_PASS
        });
        const token = loginRes.data.token;
        console.log('Login successful');

        // 2. Upload Image
        console.log('Uploading image...');
        const form = new FormData();
        form.append('image', fs.createReadStream('test_image.png'));

        const uploadRes = await axios.post(`${API_URL}/upload`, form, {
            headers: {
                ...form.getHeaders(),
                Authorization: `Bearer ${token}`
            }
        });
        
        const imageUrl = uploadRes.data.imageUrl;
        console.log('Upload successful. URL:', imageUrl);

        // 3. Create Product with Image URL
        console.log('Creating product...');
        const productData = {
            name: 'Test Upload Product ' + Date.now(),
            price: 100,
            sku: 'SKU-' + Date.now(),
            quantity: 10,
            description: 'Test Description',
            image_url: imageUrl,
            images: [imageUrl],
            category: null // Optional
        };

        const createRes = await axios.post(`${API_URL}/products`, productData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log('Product created:', createRes.data.id);
        console.log('Product Image URL:', createRes.data.image_url);

        if (createRes.data.image_url === imageUrl) {
             console.log('✅ SUCCESS: Product saved with uploaded image URL');
        } else {
             console.error('❌ FAILURE: Product image URL mismatch');
             console.log('Expected:', imageUrl);
             console.log('Got:', createRes.data.image_url);
        }

    } catch (e) {
        console.error('Error:', e.response?.data || e.message);
    }
}

verify();
