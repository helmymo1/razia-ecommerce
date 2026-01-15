const db = require('../config/db');
const redisWrapper = require('../config/redis');

async function applyMigrations() {
    console.log('Applying Soft Delete Migrations...');
    
    // 1. Add is_deleted to Users
    try {
        await db.query(`
            ALTER TABLE users 
            ADD COLUMN is_deleted BOOLEAN DEFAULT 0
        `);
        console.log('Added is_deleted to users.');
    } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
            console.log('is_deleted already exists in users.');
        } else {
            console.error('Error migrating users:', err);
        }
    }

    // 2. Add is_deleted to Products
    try {
        await db.query(`
            ALTER TABLE products 
            ADD COLUMN is_deleted BOOLEAN DEFAULT 0
        `);
        console.log('Added is_deleted to products.');
    } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
            console.log('is_deleted already exists in products.');
        } else {
            console.error('Error migrating products:', err);
        }
    }

    // 3. Seed Redis with Product Stock (for testing Reservation)
    console.log('Seeding Redis Stock...');
    try {
        const [products] = await db.query('SELECT id, stock FROM products');
        for (const p of products) {
            const key = `product:${p.id}:stock`;
            await redisWrapper.setex(key, 600, p.stock); // 10 min TTL
            console.log(`Seeded ${key} = ${p.stock}`);
        }
    } catch (err) {
        console.error('Error seeding Redis:', err);
    }

    process.exit(0);
}

applyMigrations();
