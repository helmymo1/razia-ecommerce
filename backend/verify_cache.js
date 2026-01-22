const axios = require('axios');

const BASE_URL = 'http://localhost:5007/api/products'; // Using 5007 as server is running there

async function testCache() {
    try {
        console.log("1️⃣ Request 1: Expect Cache MISS");
        const t1 = Date.now();
        await axios.get(BASE_URL);
        console.log(`   Time: ${Date.now() - t1}ms`);

        console.log("\n2️⃣ Request 2: Expect Cache HIT (Should be faster)");
        const t2 = Date.now();
        await axios.get(BASE_URL);
        console.log(`   Time: ${Date.now() - t2}ms`);
        
        console.log("\n✅ Cache verification steps complete. Check Server Logs for '⚡ [Cache] Hit' message.");

    } catch (error) {
        console.error("❌ Link Error:", error.message);
    }
}

testCache();
