const db = require('./config/db');
const { v4: uuidv4 } = require('uuid');

const products = [
  { name: "White & Light Purple Panel Top", category: "Tops", image: "https://raziastore.com/wp-content/uploads/2025/08/Copy-of-NAW02294-scaled-1.jpg", price: 0, description: "Sleek white top with structured blue panels." },
  { name: "Wide-Leg Trouser with Colorful Side Skirt", category: "Skirts", image: "https://raziastore.com/wp-content/uploads/2025/08/Copy-of-NAW02290-scaled-1.jpg", price: 0, description: "Wide-leg trousers with a colorful wrap skirt." },
  { name: "Drape Elegant Trouser", category: "Trousers", image: "https://raziastore.com/wp-content/uploads/2025/08/20250225_222050_0000.png", price: 0, description: "Lavender blue trousers with movement and elegance." },
  { name: "Blouse with Colorful Shawl", category: "Tops", image: "https://raziastore.com/wp-content/uploads/2025/08/Copy-of-A7301154-scaled-1.jpg", price: 0, description: "Relaxed blouse with a vibrant colorful scarf." },
  { name: "Linen Jumpsuit with Embroidered Side Panel", category: "Jumpsuits", image: "https://raziastore.com/wp-content/uploads/2025/08/Copy-of-A7301270-scaled-1.jpg", price: 0, description: "Navy jumpsuit with traditional embroidered side panel." },
  { name: "Two-Tone Vest & Trouser Set", category: "Vests", image: "https://raziastore.com/wp-content/uploads/2025/08/Copy-of-A7301323-scaled-1.jpg", price: 0, description: "Beige and white color block vest and trouser set." },
  { name: "Vest With Side Panel", category: "Vests", image: "https://raziastore.com/wp-content/uploads/2025/08/Copy-of-A7301344-scaled-1.jpg", price: 0, description: "Beige vest with artistic colorful side panel." },
  { name: "Wrap Skirt with Colorful Panel", category: "Skirts", image: "https://raziastore.com/wp-content/uploads/2025/08/Copy-of-A7301344-scaled-1.jpg", price: 0, description: "Beige wrap skirt with vibrant side pattern." },
  { name: "Satin Printed Dress", category: "Dresses", image: "https://raziastore.com/wp-content/uploads/2025/08/Copy-of-A7301398-scaled-1.jpg", price: 0, description: "Bold colorful print dress in blue, red, and yellow." },
  { name: "Classic Linen Top", category: "Tops", image: "https://via.placeholder.com/150", price: 0, description: "Simple elegant linen top for daily wear." }
];

async function seedProducts() {
    console.log('--- SEEDING PRODUCTS ---');
    
    // Step 1: Build category lookup map
    console.log('1. Fetching categories...');
    const [categories] = await db.query('SELECT id, name_en FROM categories');
    const categoryMap = {};
    categories.forEach(cat => {
        categoryMap[cat.name_en] = cat.id;
    });
    console.log(`   Found ${categories.length} categories:`, Object.keys(categoryMap).join(', '));

    // Step 2: Insert products
    console.log('2. Inserting products...');
    let inserted = 0;
    let skipped = 0;

    for (const product of products) {
        const categoryId = categoryMap[product.category];
        if (!categoryId) {
            console.log(`   SKIP: Category "${product.category}" not found for "${product.name}"`);
            skipped++;
            continue;
        }

        // Check if product already exists by name
        const [existing] = await db.query('SELECT id FROM products WHERE name_en = ?', [product.name]);
        if (existing.length > 0) {
            console.log(`   SKIP: "${product.name}" already exists.`);
            skipped++;
            continue;
        }

        const newId = uuidv4();
        await db.query(
            `INSERT INTO products (id, name_en, name_ar, description_en, price, category_id, image_url, stock_quantity, is_active) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [newId, product.name, product.name, product.description, product.price, categoryId, product.image, 100, true]
        );
        console.log(`   INSERT: "${product.name}" -> Category ID: ${categoryId}`);
        inserted++;
    }

    console.log(`\n--- SEEDING COMPLETE ---`);
    console.log(`   Inserted: ${inserted}`);
    console.log(`   Skipped: ${skipped}`);
    process.exit(0);
}

seedProducts().catch(err => {
    console.error('SEEDING FAILED:', err.message);
    process.exit(1);
});
