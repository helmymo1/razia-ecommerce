
const axios = require('axios');
const fs = require('fs');

const testImage = async () => {
    // Filename grabbed from previous 'dir' output in Step 1151
    const filename = 'image-1768475671562.png'; 
    const url = `http://localhost:5000/uploads/${filename}`;
    
    console.log(`Attempting to fetch: ${url}`);
    
    try {
        const res = await axios.get(url);
        console.log(`✅ Success! Status: ${res.status}`);
        console.log(`Content-Type: ${res.headers['content-type']}`);
        console.log(`Content-Length: ${res.headers['content-length']}`);
    } catch (err) {
        console.log(`❌ Failed! Status: ${err.response?.status}`);
        console.log(`Error: ${err.message}`);
        if(err.response) {
            console.log('Headers:', err.response.headers);
        }
    }
};

testImage();
