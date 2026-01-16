const db = require('./config/db');
const { v4: uuidv4 } = require('uuid');

const categories = [
  { name: 'Dresses', image: 'https://via.placeholder.com/150' },
  { name: 'Jumpsuits', image: 'https://via.placeholder.com/150' },
  { name: 'Mix & Match', image: 'https://via.placeholder.com/150' },
  { name: 'New Arrivals', image: 'https://via.placeholder.com/150' },
  { name: 'Skirts', image: 'https://via.placeholder.com/150' },
  { name: 'Tops', image: 'https://via.placeholder.com/150' },
  { name: 'Trousers', image: 'https://via.placeholder.com/150' },
  { name: 'Vests', image: 'https://via.placeholder.com/150' }
];

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function seed() {
  console.log('Seeding categories (with UUID and slug)...');
  try {
      for (const cat of categories) {
          // Check if category already exists
          const [existing] = await db.query('SELECT id FROM categories WHERE name_en = ?', [cat.name]);
          if (existing.length > 0) {
            console.log(`  SKIP: ${cat.name} (already exists)`);
            continue;
          }

          const newId = uuidv4();
          const slug = slugify(cat.name);
          await db.query(
            'INSERT INTO categories (id, name_en, slug, image_url) VALUES (?, ?, ?, ?)',
            [newId, cat.name, slug, cat.image]
          );
          console.log(`  INSERT: ${cat.name} -> ${newId}`);
        }
      console.log('Categories seeded successfully!');
      process.exit(0);
    } catch (err) {
      console.error('Error seeding categories:', err.message);
      process.exit(1);
    }
}

seed();
