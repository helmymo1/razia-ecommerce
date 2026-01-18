-- Production Indexes Optimization
-- Generated for Razia E-Commerce (MySQL 8.0)
-- Target: High-volume reads, Soft Delete pattern (is_deleted), and FK JOIN performance.

-- =======================================================
-- 1. PRODUCTS: Composite Indexes for "Shop" & Filtering
-- =======================================================

-- Scenario: "Show me all Active, Non-Deleted products in Category X"
-- Logic: Filter by Category (Equality) -> Filter by Active/Deleted (Equality)
-- Cardinality: Category (High) > is_active (Low) > is_deleted (Low)
CREATE INDEX idx_products_cat_active_deleted 
ON products (category_id, is_active, is_deleted);

-- Scenario: "Show me New Arrivals" (Global)
-- Logic: Filter is_active=1, is_deleted=0, Sort by created_at DESC
CREATE INDEX idx_products_global_sort 
ON products (is_active, is_deleted, created_at DESC);

-- =======================================================
-- 2. ORDERS: User Dashboard Performance
-- =======================================================

-- Scenario: "My Orders" page.
-- Logic: Filter by user_id -> Sort/Filter by status or date.
CREATE INDEX idx_orders_user_status_created 
ON orders (user_id, status, created_at);

-- =======================================================
-- 3. PROMO CODES: Validation Performance
-- =======================================================

-- Scenario: Checkout applies a coupon. 
-- Logic: Lookup by code (Unique) -> Check Active -> Check Date Range.
-- Note: 'code' is UNIQUE (via Schema), adding index for range checks on active codes.
CREATE INDEX idx_promocodes_validation 
ON promo_codes (is_active, starts_at, expires_at);

-- Ensure Constraints (Idempotent-ish check recommended manually if not 8.0+)
-- SQL below assumes these might be missing if relying on 'repair' scripts.
-- CREATE UNIQUE INDEX idx_promo_code_unique ON promo_codes (code); 

-- =======================================================
-- 4. FOREIGN KEY OPTIMIZATIONS (Prevent Locks/Scans)
-- =======================================================

-- Order Items -> Products (Critical for JOINs in Order Details)
CREATE INDEX idx_order_items_product_id 
ON order_items (product_id);

-- Cart Items -> Products (Critical for Cart loading)
CREATE INDEX idx_cart_items_product_id 
ON cart_items (product_id);

-- Cart Items -> Variants
CREATE INDEX idx_cart_items_variant_id 
ON cart_items (variant_id);

-- =======================================================
-- 5. SAFETY NET: Missing Unique Constraints
-- =======================================================
-- Intended to patch systems where unique constraints were lost.
-- Uncomment if running on a drifted database.
/*
CREATE UNIQUE INDEX idx_users_email_unique ON users (email);
CREATE UNIQUE INDEX idx_categories_slug_unique ON categories (slug);
*/
