const db = require('../config/db');

const createRefundRequestsTable = async () => {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS refund_requests (
                id VARCHAR(36) PRIMARY KEY,
                order_id VARCHAR(36) NOT NULL,
                user_id VARCHAR(36) NOT NULL,
                reason TEXT NOT NULL,
                pickup_time VARCHAR(255) NOT NULL,
                contact_phone VARCHAR(50) NOT NULL,
                status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
                admin_response TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (order_id) REFERENCES orders(id),
                FOREIGN KEY (user_id) REFERENCES users(id)
            );
        `);
        console.log('refund_requests table created successfully');
        process.exit();
    } catch (error) {
        console.error('Error creating table:', error);
        process.exit(1);
    }
};

createRefundRequestsTable();
