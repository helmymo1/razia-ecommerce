const axios = require('axios');
const FormData = require('form-data');

const API_URL = 'http://localhost:5000/api';

async function testCreateProduct() {
  try {
    // 1. Login
    console.log('Logging in...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@ebazer.com',
      password: 'password123'
    });
    const token = loginRes.data.token; // Bearer token
    console.log('Login successful. Token:', token ? 'Yes' : 'No');

    // 2. Get Categories
    console.log('Fetching categories...');
    const catRes = await axios.get(`${API_URL}/categories`);
    const categories = catRes.data;
    if (categories.length === 0) {
      console.error('No categories found! Cannot test.');
      return;
    }
    const catId = categories[0].id;
    console.log('Using Category ID:', catId);

    // 3. Create Product
    console.log('Creating Product...');
    const form = new FormData();
    form.append('name', 'Test Product ' + Date.now());
    form.append('description', 'Test Description');
    form.append('price', '100');
    form.append('sku', 'SKU-' + Date.now());
    form.append('quantity', '10');
    form.append('category', catId); // UUID
    
    // Extra fields that were failing
    form.append('discount_type', 'no_discount');
    form.append('discount_value', '0');
    form.append('shipping_width', '10');
    // form.append('shipping_height', '10'); // Test omission
    form.append('tags', 'test,demo');
    form.append('colors', 'Red,Blue');
    form.append('sizes', 'S,M');

    // Headers
    const headers = {
      'Authorization': `Bearer ${token}`,
      ...form.getHeaders()
    };
    
    // Cookie support if needed? No, using Bearer.
    
    const productRes = await axios.post(`${API_URL}/products`, form, { headers });
    console.log('✅ Product Created Successfully!', productRes.data);

  } catch (error) {
    if (error.response) {
      console.error('❌ Request Failed:', error.response.status, error.response.statusText);
      console.error('Response Data:', error.response.data);
    } else {
      console.error('❌ Error:', error.message);
    }
  }
}

testCreateProduct();
