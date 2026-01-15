const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testApi() {
  try {
    console.log('Testing Get Products...');
    try {
      const res = await axios.get(`${API_URL}/products`);
      console.log('✅ Get Products Success');
      if (res.data.length > 0) {
        const p = res.data[0];
        console.log('Sample Product:', {
            id: p.id,
            name: p.name,
            category: p.category,
            images: p.images,
            colors: p.colors,
            sizes: p.sizes
        });
        
        if (!p.category) console.error('❌ Missing category in response');
        if (!Array.isArray(p.images)) console.error('❌ images is not an array');
        if (!Array.isArray(p.colors)) console.error('❌ colors is not an array');
        
        // Test Get Single Product
        console.log(`Testing Get Product ${p.id}...`);
        const singleRes = await axios.get(`${API_URL}/products/${p.id}`);
        if (singleRes.data.id === p.id) {
             console.log('✅ Get Single Product Success');
        } else {
             console.error('❌ Get Single Product ID mismatch');
        }
      } else {
        console.warn('⚠️ No products found in DB to test structure');
      }
    } catch (e) {
      console.error('❌ Get Products Failed:', e.message);
      if (e.code) console.error('Error Code:', e.code);
      if (e.response) console.error(e.response.data);
    }

    // Test Auth (Login)
    console.log('Testing Login...');
    // We need a valid user. If we migrated data, maybe we can try a known user or skip if we don't have credentials.
    // I previously saw `userController` creating users. 
    // I'll skip login test for now as I don't have a known user password, unless I create one.
    // But I can try to access a protected route and expect 401.
    try {
        await axios.get(`${API_URL}/auth/me`);
    } catch (e) {
        if (e.response && e.response.status === 401) {
            console.log('✅ Auth Protection Check Success (401 received)');
        } else {
            console.error('❌ Auth Check Failed:', e.message);
        }
    }

  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

testApi();
