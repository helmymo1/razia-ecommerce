
const axios = require('axios');

const verifyProduct = async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/products');
    if (res.data.length > 0) {
      console.log('Sample Product Images:', JSON.stringify(res.data[0].images, null, 2));
      console.log('Sample Product Image URL:', res.data[0].image_url);
    } else {
      console.log('No products found.');
    }
  } catch (error) {
    console.error('Error fetching products:', error.message);
  }
};

verifyProduct();
