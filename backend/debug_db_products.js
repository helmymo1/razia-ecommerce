
require('dotenv').config();
const db = require('./config/db');

const checkDB = async () => {
    try {
        const [rows] = await db.query('SELECT id, name_en, image_url FROM products');
        console.log('Total Products in DB:', rows.length);
        if (rows.length > 0) {
            console.log('Sample Product:', rows[0]);
            
             // Check product_images table too
             const [images] = await db.query('SELECT * FROM product_images WHERE product_id = ?', [rows[0].id]);
             console.log('Images for Sample Product:', images);
        }
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
};

checkDB();
