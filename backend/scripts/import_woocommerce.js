const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');

dotenv.config({ path: path.join(__dirname, '../.env') });

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    connectionLimit: 10,
    multipleStatements: true
};

async function importData() {
    const pool = mysql.createPool(dbConfig);
    const connection = await pool.getConnection();

    try {
        console.log('Starting Import...');
        
        // 1. Clear Database
        console.log('Clearing old data...');
        // Disable FK checks to allow truncation
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');
        // Clear dependent tables first generally, but with FK checks off order matters less (but truncation is DDL)
        // Using DELETE allows returning rows count, TRUNCATE is faster and resets auto_increment (if any, though using UUIDs)
        await connection.query('DELETE FROM order_items'); 
        await connection.query('DELETE FROM product_variants');
        await connection.query('DELETE FROM product_images');
        await connection.query('DELETE FROM products');
        await connection.query('DELETE FROM categories');
        await connection.query('SET FOREIGN_KEY_CHECKS = 1');

        // 2. Read CSV
        const rows = [];
        const csvPath = path.join(__dirname, '../import_data.csv');
        
        await new Promise((resolve, reject) => {
            fs.createReadStream(csvPath)
                .pipe(csv())
                .on('data', (data) => rows.push(data))
                .on('end', resolve)
                .on('error', reject);
        });

        console.log(`Read ${rows.length} rows.`);

        // 3. Process Categories
        const categoryMap = new Map(); // Name -> ID
        
        for (const row of rows) {
            if (!row.Categories) continue;
            const cats = row.Categories.split(',').map(c => c.trim()).filter(c => c);
            
            for (const catName of cats) {
                if (!categoryMap.has(catName)) {
                    const id = uuidv4();
                    const slug = catName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    await connection.query(
                        'INSERT INTO categories (id, name_en, name_ar, slug, is_active) VALUES (?, ?, ?, ?, 1)',
                        [id, catName, catName, slug]
                    );
                    categoryMap.set(catName, id);
                }
            }
        }
        console.log(`Imported ${categoryMap.size} categories.`);

        // 4. Process Parent Products
        const productMap = new Map(); // Name -> ID
        const variableProducts = rows.filter(r => ['variable', 'simple', 'box_product'].includes(r.Type));
        
        for (const row of variableProducts) {
            const id = uuidv4();
            const name = row.Name || 'Untitled Product';
            const description = row['Description'] || row['Short description'] || '';
            const price = parseFloat(row['Sale price']) || 0; 
            
            const cats = row.Categories ? row.Categories.split(',').map(c => c.trim()).filter(c => c) : [];
            const categoryId = cats.length > 0 ? categoryMap.get(cats[0]) : null;
            
            // Insert Product
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            await connection.query(
                `INSERT INTO products (id, name_en, name_ar, description_en, description_ar, price, sku, category_id, slug, created_at) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
                [id, name, name, description, description, price, row.SKU || null, categoryId, slug]
            );

            // Images
            if (row.Images) {
                const imageUrls = row.Images.split(',').map(u => u.trim()).filter(u => u);
                let isPrimary = 1;
                for (const url of imageUrls) {
                    await connection.query(
                        'INSERT INTO product_images (id, product_id, image_url, is_primary) VALUES (?, ?, ?, ?)',
                        [uuidv4(), id, url, isPrimary]
                    );
                    isPrimary = 0;
                }
            }

            productMap.set(name, id);
        }
        console.log(`Imported ${variableProducts.length} parent products.`);

        // 5. Process Variations
        const variations = rows.filter(r => r.Type && r.Type.startsWith('variation'));
        let variantsCount = 0;

        for (const row of variations) {
            // Find parent
            let parentId = null;
            let parentName = null;
            
            for (const [pName, pId] of productMap.entries()) {
                if (row.Name.startsWith(pName)) {
                    if (!parentName || pName.length > parentName.length) {
                        parentName = pName;
                        parentId = pId;
                    }
                }
            }

            if (parentId) {
                // Extract attributes
                const suffix = row.Name.substring(parentName.length).replace(/^[\s-]+/, '').trim();
                const parts = suffix.split(',').map(p => p.trim());
                
                let size = null;
                let color = null;

                const sizeKeywords = ['S', 'M', 'L', 'XL', 'XXL', 'XS', 'Free size', 'FreeSize', 'Free size'];
                
                for (const part of parts) {
                    // Check if strictly matches size keyword
                    if (sizeKeywords.some(k => part.toUpperCase() === k.toUpperCase())) {
                        size = part;
                    } else {
                        color = part;
                    }
                }

                await connection.query(
                    `INSERT INTO product_variants (id, product_id, size, color, sku, stock_quantity, created_at)
                     VALUES (?, ?, ?, ?, ?, ?, NOW())`,
                    [uuidv4(), parentId, size, color, row.SKU || null, 100]
                );
                variantsCount++;
            }
        }
        console.log(`Imported ${variantsCount} variants.`);

        // 6. Aggregate Colors/Sizes for Parents
        console.log('Aggregating attributes...');
        const [allIds] = await connection.query('SELECT id FROM products');
        
        for (const { id } of allIds) {
            const [vars] = await connection.query(
                'SELECT size, color FROM product_variants WHERE product_id = ?',
                [id]
            );
            
            const sizes = [...new Set(vars.map(v => v.size).filter(Boolean))];
            const colors = [...new Set(vars.map(v => v.color).filter(Boolean))];
            
            await connection.query(
                'UPDATE products SET sizes = ?, colors = ? WHERE id = ?',
                [JSON.stringify(sizes), JSON.stringify(colors), id]
            );
        }

        console.log('Import Complete!');

    } catch (error) {
        console.error('Import Error:', error);
    } finally {
        if (connection) connection.release();
        process.exit();
    }
}

importData();
