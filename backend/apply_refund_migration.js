const db = require('./config/db');
const logger = require('./utils/logger');

const migrate = async () => {
    try {
        logger.info('Starting refund migration...');
        
        // Update payment_status ENUM to include 'refund_requested' and 'refunded' if not present
        // Note: 'refunded' likely already exists or is a valid status, but we ensure 'refund_requested' is added.
        // We modify the column definition.
        
        await db.query(`
            ALTER TABLE orders MODIFY COLUMN payment_status 
            ENUM('pending', 'paid', 'failed', 'refunded', 'refund_requested') 
            NOT NULL DEFAULT 'pending';
        `);

        logger.info('Successfully updated orders table schema.');
        process.exit(0);

    } catch (error) {
        logger.error('Migration failed: ' + error.message);
        console.error(error);
        process.exit(1);
    }
};

migrate();
