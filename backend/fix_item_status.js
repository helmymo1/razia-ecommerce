const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const fixItemStatus = async () => {
    let connection;
    try {
        console.log('Connecting to database...');
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('Connected. Backfilling missing item_status...');

        // Update NULL or empty item_status to 'active'
        const [result] = await connection.query(
            "UPDATE order_items SET item_status = 'active' WHERE item_status IS NULL OR item_status = ''"
        );

        console.log(`Success! Updated ${result.affectedRows} order items to 'active' status.`);

    } catch (error) {
        console.error('Error fixing item status:', error);
    } finally {
        if (connection) await connection.end();
        process.exit();
    }
};

fixItemStatus();
