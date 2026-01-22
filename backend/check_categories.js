
require('dotenv').config();
const db = require('./config/db');

const checkCategories = async () => {
    try {
        const [categories] = await db.query('SELECT * FROM categories');
        console.log('Total Categories:', categories.length);
        if (categories.length > 0) {
            console.log('Sample Categories:', categories.slice(0, 3));
        } else {
            console.log('⚠️ No categories found in database.');
        }
    } catch (error) {
        console.error('Error checking categories:', error);
    } finally {
        process.exit();
    }
};

checkCategories();
