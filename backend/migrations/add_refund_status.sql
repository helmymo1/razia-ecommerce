-- Add 'refund_requested' status to orders
ALTER TABLE orders MODIFY COLUMN payment_status 
ENUM('pending', 'paid', 'failed', 'refunded', 'refund_requested') NOT NULL DEFAULT 'pending';
