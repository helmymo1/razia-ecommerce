const db = require('./config/db');

async function seedCategories() {
  console.log('--- Seeding Categories ---');
  try {
    const categories = [
      { name: 'Tops', slug: 'tops', image: 'https://via.placeholder.com/150?text=Tops' },
      { name: 'Bottoms', slug: 'bottoms', image: 'https://via.placeholder.com/150?text=Bottoms' },
      { name: 'Footwear', slug: 'footwear', image: 'https://via.placeholder.com/150?text=Footwear' },
      { name: 'Accessories', slug: 'accessories', image: 'https://via.placeholder.com/150?text=Accessories' }
    ];

    for (const cat of categories) {
      // Check if exists
      const [existing] = await db.query('SELECT id FROM categories WHERE slug = ?', [cat.slug]);
      if (existing.length === 0) {
        await db.query('INSERT INTO categories (name_en, slug, image_url) VALUES (?, ?, ?)', [cat.name, cat.slug, cat.image]);
        console.log(`✅ Created category: ${cat.name}`);
      } else {
        console.log(`ℹ️ Category already exists: ${cat.name}`);
      }
    }
    
    console.log('✅ Seeding Complete');
  } catch (error) {
    console.error('❌ Seeding Failed:', error.message);
  }
  process.exit();
}

seedCategories();
