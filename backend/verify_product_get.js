const axios = require('axios');
const API_URL = 'http://localhost:5000/api';

async function testGetProduct() {
  try {
    // 1. Login
    console.log('Logging in...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@ebazer.com',
      password: 'password123'
    });
    const token = loginRes.data.token;
    
    // 2. Fetch All Products (to get an ID)
    const listRes = await axios.get(`${API_URL}/products`);
    if (listRes.data.length === 0) {
        console.log('No products to test.');
        return;
    }
    const productId = listRes.data[0].id;
    console.log('Testing Product ID:', productId);

    // 3. Fetch Single Product
    const productRes = await axios.get(`${API_URL}/products/${productId}`);
    const product = productRes.data;
    
    console.log('Fetched Product Data:', product);

    // 4. Verify Fields (CamelCase)
    if (product.name && !product.name_en) {
        console.log('✅ Name field present (Correctly Mapped)');
    } else {
        console.error('❌ Name field missing or incorrectly mapped!');
    }
    
    if (Array.isArray(product.tags)) {
        console.log('✅ Tags is Array (Correctly Parsed)');
    } else {
        console.log('Tags type:', typeof product.tags); 
        // Frontend expects comma string for tags input, actually.
        // My controller joins it! So it should be a string.
        if (typeof product.tags === 'string') {
             console.log('✅ Tags is String (Correctly Joined for Frontend)');
        } else {
             console.log('⚠️ Tags is not a string (Frontend might show empty)');
        }
    }

  } catch (error) {
    if (error.response) {
      console.error('❌ Request Failed:', error.response.status, error.response.statusText);
      console.error('Response Data:', error.response.data);
    } else {
      console.error('❌ Error:', error.message);
    }
  }
}

testGetProduct();
