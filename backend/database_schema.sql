-- eBazer Database Schema Initialization (MySQL 8.0)
CREATE DATABASE IF NOT EXISTS ebazer_shop;
USE ebazer_shop;

-- =======================================================
-- 1. Tables Definition
-- =======================================================

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'customer') DEFAULT 'customer',
    is_deleted BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    image VARCHAR(255),
    parent_id INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    category_id INT,
    image_url VARCHAR(255),
    status ENUM('active', 'inactive') DEFAULT 'active',
    is_deleted BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Extended Fields
    tags TEXT,
    discount_type ENUM('no_discount', 'percentage', 'fixed') DEFAULT 'no_discount',
    discount_value DECIMAL(10, 2) DEFAULT 0,
    shipping_width DECIMAL(10, 2),
    shipping_height DECIMAL(10, 2),
    shipping_weight DECIMAL(10, 2),
    shipping_cost DECIMAL(10, 2),
    colors JSON,
    sizes JSON,
    
    
    -- Indexes
    INDEX idx_sku (sku),
    INDEX idx_category_id (category_id),
    
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Coupons Table
CREATE TABLE IF NOT EXISTS coupons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    discount_type ENUM('percentage', 'fixed') NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL,
    start_date DATETIME,
    end_date DATETIME,
    usage_limit INT DEFAULT NULL,
    usage_count INT DEFAULT 0,
    status ENUM('active', 'inactive') DEFAULT 'active',
    is_deleted BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT,
    action VARCHAR(255) NOT NULL,
    target_id INT,
    details JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    coupon_id INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_user_id (user_id),
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Wishlist Table
CREATE TABLE IF NOT EXISTS wishlist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_wishlist (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =======================================================
-- 2. Seeding Data
-- =======================================================

-- Seed Admin User (Password: 'password123')
INSERT INTO users (name, email, password_hash, role) 
SELECT * FROM (SELECT 'Admin User', 'admin@ebazer.com', '$2a$10$dkrYe4XfokMmoiwz83D6CuPFR1R6zWqMPaUWpj5hNDXsE8mqVfkZm', 'admin') AS tmp
WHERE NOT EXISTS (
    SELECT email FROM users WHERE email = 'admin@ebazer.com'
) LIMIT 1;

-- Seed Categories
INSERT INTO categories (name, slug) VALUES 
('Electronics', 'electronics'),
('Fashion', 'fashion'),
('Home & Garden', 'home-garden')
ON DUPLICATE KEY UPDATE name=name;

-- Seed Products (5 Samples)
INSERT INTO products (name, sku, price, stock, category_id, description, image_url) VALUES
('Wireless Headphones', 'WH-001', 99.99, 50, 1, 'Noise cancelling over-ear headphones', '/uploads/headphones.jpg'),
('Smartphone X', 'SP-X01', 699.00, 20, 1, 'Latest generation smartphone', '/uploads/phone.jpg'),
('Running Shoes', 'RS-002', 79.50, 100, 2, 'Lightweight running shoes', '/uploads/shoes.jpg'),
('Cotton T-Shirt', 'TS-003', 19.99, 200, 2, '100% Organic Cotton', '/uploads/tshirt.jpg'),
('Coffee Maker', 'CM-004', 45.00, 30, 3, 'Programmable coffee maker', '/uploads/coffeemaker.jpg')
ON DUPLICATE KEY UPDATE stock=VALUES(stock);
