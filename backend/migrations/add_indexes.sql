/* Performance Indexes for ~100k Monthly Orders */

/* Products: Filtering by Category and Price Sorting */
ALTER TABLE products ADD INDEX idx_products_category (category_id);
ALTER TABLE products ADD INDEX idx_products_price (price);
ALTER TABLE products ADD INDEX idx_products_created (created_at);

/* Orders: fast lookup by User, Status Dashboard, and Date sorting */
ALTER TABLE orders ADD INDEX idx_orders_user (user_id);
ALTER TABLE orders ADD INDEX idx_orders_status (status);
ALTER TABLE orders ADD INDEX idx_orders_created (created_at);

/* Users: Analytics sorting */
ALTER TABLE users ADD INDEX idx_users_created (created_at);
