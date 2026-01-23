require('dotenv').config();
const db = require('./config/db');
const fs = require('fs');
const path = require('path');

const debugImages = async () => {
    try {
        // 1. Get ALL products with image data
        const [products] = await db.query(`
            SELECT p.id, p.name_en, p.image_url, 
                   (SELECT GROUP_CONCAT(image_url) FROM product_images WHERE product_id = p.id) as gallery_images
            FROM products p 
            ORDER BY p.created_at DESC 
            LIMIT 5
        `);
        
        console.log('=== PRODUCTS IN DATABASE ===');
        products.forEach((p, i) => {
            console.log(`\n[${i+1}] ${p.name_en}`);
            console.log(`    Main Image: ${p.image_url || 'NULL'}`);
            console.log(`    Gallery: ${p.gallery_images || 'NONE'}`);
            
            // Check if main image file exists
            if (p.image_url) {
                const filePath = path.join(__dirname, p.image_url);
                const exists = fs.existsSync(filePath);
                console.log(`    File Exists: ${exists ? '✅ YES' : '❌ NO'} (${filePath})`);
            }
        });

        // 2. List actual files in uploads folder
        const uploadsDir = path.join(__dirname, 'uploads');
        console.log('\n=== FILES IN UPLOADS FOLDER ===');
        if (fs.existsSync(uploadsDir)) {
            const files = fs.readdirSync(uploadsDir);
            console.log(`Found ${files.length} files:`);
            files.slice(0, 10).forEach(f => console.log(`  - ${f}`));
            if (files.length > 10) console.log(`  ... and ${files.length - 10} more`);
        } else {
            console.log('❌ UPLOADS FOLDER DOES NOT EXIST!');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit();
    }
};

debugImages();
