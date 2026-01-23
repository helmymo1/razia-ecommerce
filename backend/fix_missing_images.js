require('dotenv').config();
const db = require('./config/db');

const fixImages = async () => {
    try {
        // Use a reliable placeholder for products with missing images
        const placeholder = 'https://via.placeholder.com/400x500?text=Product+Image';
        
        // Update products that have non-existent image files
        const result = await db.query(`
            UPDATE products 
            SET image_url = ? 
            WHERE image_url LIKE '/uploads/%' 
            AND image_url NOT IN (
                SELECT image_url FROM product_images WHERE image_url IS NOT NULL
            )
        `, [placeholder]);
        
        console.log('Updated products with placeholder:', result[0].affectedRows);
        
        // Also check for specific known missing files and fix them
        const knownMissing = [
            '/uploads/earbuds.jpg',
            '/uploads/coffeemaker.jpg', 
            '/uploads/tshirt.jpg',
            '/uploads/jacket.jpg',
            '/uploads/dress.jpg'
        ];
        
        for (const img of knownMissing) {
            await db.query('UPDATE products SET image_url = ? WHERE image_url = ?', [placeholder, img]);
        }
        
        console.log('✅ Fixed products with missing image files');
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit();
    }
};

fixImages();
