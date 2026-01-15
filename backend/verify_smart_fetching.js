const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function verifySmartFetching() {
    console.log('--- Verifying Smart Fetching ---');

    // 1. Verify Latest Arrivals (Sort Newest)
    try {
        console.log('Fetching Latest Products (sort=newest)...');
        const res = await axios.get(`${API_URL}/products`, {
            params: { sort: 'newest', limit: 4 }
        });
        
        const products = res.data.data; // Pagination format
        console.log(`Received ${products.length} products.`);
        
        if (products.length > 1) {
             const firstDate = new Date(products[0].created_at).getTime();
             const secondDate = new Date(products[1].created_at).getTime();
             if (firstDate >= secondDate) {
                 console.log('✅ Latest Arrivals Sort verified (Newest first)');
             } else {
                 console.error('❌ Sorting Failed: First item is older than second.');
             }
        }
    } catch (error) {
        console.error('❌ Latest Arrivals Fetch Failed:', error.message);
    }

    // 2. Verify Category Filtering (Outfit Builder)
    try {
        // First get a category ID that exists
        const catRes = await axios.get(`${API_URL}/products`); // Get generic list to find a category
        const sampleProduct = catRes.data.data[0];
        
        if (sampleProduct && sampleProduct.category) {
            // Wait, we need category ID. My API returns category NAME in 'category' field. 
            // My updated controller only returns `p.*`. 
            // And `p.category_id` should be in `p`. 
            // Let's check if the generic fetch includes `category_id`.
            
            const categoryId = sampleProduct.category_id;
            if (categoryId) {
                console.log(`Testing Filter for Category ID: ${categoryId}`);
                const filterRes = await axios.get(`${API_URL}/products`, {
                    params: { category_id: categoryId }
                });
                const filtered = filterRes.data.data;
                const allMatch = filtered.every(p => p.category_id === categoryId);
                
                if (allMatch && filtered.length > 0) {
                     console.log('✅ Category Filter verified');
                } else if (filtered.length === 0) {
                     console.warn('⚠️ No products found for category (might be okay if empty)');
                } else {
                     console.error('❌ Category Filter Failed: Found non-matching products');
                }
            } else {
                 console.warn('⚠️ Could not find a category_id to test with.');
            }
        }
    } catch (error) {
        console.error('❌ Category Filter Test Failed:', error.message);
    }

    process.exit();
}

verifySmartFetching();
