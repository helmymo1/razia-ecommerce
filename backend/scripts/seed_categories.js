const db = require('../config/db');

async function seedCategories() {
  try {
    const categories = [
        'Electronics', 'Fashion', 'Jewellery', 'Beauty', 'Grocery'
    ];
    
    for (const cat of categories) {
        // Check if exists
        const [existing] = await db.query('SELECT id FROM categories WHERE name = ?', [cat]);
        if (existing.length === 0) {
            const slug = cat.toLowerCase();
            await db.query('INSERT INTO categories (name, slug) VALUES (?, ?)', [cat, slug]);
            console.log(`Seeded category: ${cat}`);
        }
    }
    
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seedCategories();
