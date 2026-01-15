# Razia E-commerce Database Schema

## Overview

This document outlines the complete database schema for the Razia e-commerce platform, including all tables, relationships, and recommended indexes.

---

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           DATABASE RELATIONSHIPS                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

User (1) ─────────────── (1) Profile
  │
  ├──── (1) ─────────── (N) Address
  ├──── (1) ─────────── (N) PaymentMethod
  ├──── (1) ─────────── (1) Cart ──────── (N) CartItem
  ├──── (1) ─────────── (N) Wishlist
  ├──── (1) ─────────── (N) Order ─────── (N) OrderItem
  │                           └────────── (N) OrderStatusHistory
  ├──── (1) ─────────── (N) SavedOutfit ─ (N) SavedOutfitItem
  ├──── (1) ─────────── (N) Review
  ├──── (1) ─────────── (N) Notification
  └──── (1) ─────────── (N) Referral

Category (self-ref) ──── (N) Product ──── (N) ProductImage
                              │       ──── (N) ProductVariant
                              └────── ──── (N) Review

PromoCode ─────────────── (N) PromoCodeUsage
```

---

## Tables

### 1. Users & Authentication

#### `users`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User email |
| phone | VARCHAR(20) | | Phone number |
| created_at | TIMESTAMP | DEFAULT NOW() | Account creation |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update |
| last_login | TIMESTAMP | | Last login time |
| is_active | BOOLEAN | DEFAULT TRUE | Account status |
| preferred_language | ENUM('en','ar') | DEFAULT 'en' | Language preference |

#### `profiles`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| user_id | UUID | FOREIGN KEY → users.id, UNIQUE | Owner |
| first_name | VARCHAR(100) | NOT NULL | First name |
| last_name | VARCHAR(100) | NOT NULL | Last name |
| avatar_url | TEXT | | Profile picture URL |
| date_of_birth | DATE | | Birthday |
| gender | ENUM | | 'female', 'male', 'other' |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update |

---

### 2. Address Management

#### `addresses`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| user_id | UUID | FOREIGN KEY → users.id | Owner |
| label | VARCHAR(50) | NOT NULL | e.g., "Home", "Work" |
| first_name | VARCHAR(100) | NOT NULL | Recipient first name |
| last_name | VARCHAR(100) | NOT NULL | Recipient last name |
| phone | VARCHAR(20) | NOT NULL | Contact number |
| address_line_1 | VARCHAR(255) | NOT NULL | Street address |
| address_line_2 | VARCHAR(255) | | Apartment, suite, etc. |
| city | VARCHAR(100) | NOT NULL | City |
| state | VARCHAR(100) | NOT NULL | State/Region |
| postal_code | VARCHAR(20) | NOT NULL | ZIP/Postal code |
| country | VARCHAR(100) | NOT NULL | Country |
| is_default | BOOLEAN | DEFAULT FALSE | Default address flag |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update |

---

### 3. Payment Methods

#### `payment_methods`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| user_id | UUID | FOREIGN KEY → users.id | Owner |
| type | ENUM | NOT NULL | 'card', 'mada', 'tabby', 'tamara', 'apple_pay' |
| provider | VARCHAR(50) | | e.g., "Visa", "Mastercard" |
| last_four | VARCHAR(4) | | Last 4 digits |
| expiry_month | INT | | Card expiry month |
| expiry_year | INT | | Card expiry year |
| holder_name | VARCHAR(100) | | Name on card |
| is_default | BOOLEAN | DEFAULT FALSE | Default payment flag |
| token | TEXT | | Encrypted payment token |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update |

---

### 4. Products & Categories

#### `categories`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| slug | VARCHAR(100) | UNIQUE, NOT NULL | URL-friendly identifier |
| name_en | VARCHAR(100) | NOT NULL | English name |
| name_ar | VARCHAR(100) | NOT NULL | Arabic name |
| description_en | TEXT | | English description |
| description_ar | TEXT | | Arabic description |
| image_url | TEXT | | Category image |
| parent_id | UUID | FOREIGN KEY → categories.id | Parent category |
| sort_order | INT | DEFAULT 0 | Display order |
| is_active | BOOLEAN | DEFAULT TRUE | Active status |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update |

#### `products`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| sku | VARCHAR(50) | UNIQUE, NOT NULL | Stock keeping unit |
| slug | VARCHAR(200) | UNIQUE, NOT NULL | URL-friendly identifier |
| name_en | VARCHAR(200) | NOT NULL | English name |
| name_ar | VARCHAR(200) | NOT NULL | Arabic name |
| description_en | TEXT | NOT NULL | English description |
| description_ar | TEXT | NOT NULL | Arabic description |
| short_description_en | VARCHAR(500) | | Short English description |
| short_description_ar | VARCHAR(500) | | Short Arabic description |
| price | DECIMAL(10,2) | NOT NULL | Current price |
| original_price | DECIMAL(10,2) | | Original price (for sales) |
| cost_price | DECIMAL(10,2) | | Internal cost |
| currency | VARCHAR(3) | DEFAULT 'SAR' | Currency code |
| category_id | UUID | FOREIGN KEY → categories.id | Product category |
| is_active | BOOLEAN | DEFAULT TRUE | Active status |
| is_featured | BOOLEAN | DEFAULT FALSE | Featured flag |
| is_new | BOOLEAN | DEFAULT FALSE | New arrival flag |
| stock_quantity | INT | DEFAULT 0 | Total stock |
| low_stock_threshold | INT | DEFAULT 5 | Low stock alert |
| weight | DECIMAL(8,2) | | Weight in kg |
| meta_title_en | VARCHAR(70) | | SEO title English |
| meta_title_ar | VARCHAR(70) | | SEO title Arabic |
| meta_description_en | VARCHAR(160) | | SEO description English |
| meta_description_ar | VARCHAR(160) | | SEO description Arabic |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update |

#### `product_images`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| product_id | UUID | FOREIGN KEY → products.id | Parent product |
| image_url | TEXT | NOT NULL | Image URL |
| alt_text_en | VARCHAR(200) | | Alt text English |
| alt_text_ar | VARCHAR(200) | | Alt text Arabic |
| sort_order | INT | DEFAULT 0 | Display order |
| is_primary | BOOLEAN | DEFAULT FALSE | Primary image flag |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |

#### `product_variants`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| product_id | UUID | FOREIGN KEY → products.id | Parent product |
| size | VARCHAR(20) | NOT NULL | Size (S, M, L, XL, etc.) |
| color_en | VARCHAR(50) | NOT NULL | Color in English |
| color_ar | VARCHAR(50) | NOT NULL | Color in Arabic |
| color_hex | VARCHAR(7) | | Hex color code |
| sku_suffix | VARCHAR(20) | | SKU suffix |
| price_adjustment | DECIMAL(10,2) | DEFAULT 0 | Price +/- |
| stock_quantity | INT | DEFAULT 0 | Variant stock |
| is_active | BOOLEAN | DEFAULT TRUE | Active status |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update |

---

### 5. Shopping Cart

#### `carts`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| user_id | UUID | FOREIGN KEY → users.id | Cart owner (null for guests) |
| session_id | VARCHAR(100) | | Guest session ID |
| promo_code_id | UUID | FOREIGN KEY → promo_codes.id | Applied promo |
| expires_at | TIMESTAMP | | Guest cart expiry |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update |

#### `cart_items`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| cart_id | UUID | FOREIGN KEY → carts.id | Parent cart |
| product_id | UUID | FOREIGN KEY → products.id | Product |
| variant_id | UUID | FOREIGN KEY → product_variants.id | Variant |
| quantity | INT | NOT NULL, MIN 1 | Item quantity |
| price_at_add | DECIMAL(10,2) | NOT NULL | Price when added |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update |

---

### 6. Wishlist

#### `wishlists`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| user_id | UUID | FOREIGN KEY → users.id | Owner |
| product_id | UUID | FOREIGN KEY → products.id | Saved product |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |

**Unique Constraint:** (user_id, product_id)

---

### 7. Orders

#### `orders`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| order_number | VARCHAR(50) | UNIQUE, NOT NULL | Human-readable ID |
| user_id | UUID | FOREIGN KEY → users.id | Customer |
| status | ENUM | DEFAULT 'pending' | Order status |
| payment_status | ENUM | DEFAULT 'pending' | Payment status |
| subtotal | DECIMAL(10,2) | NOT NULL | Items total |
| discount_amount | DECIMAL(10,2) | DEFAULT 0 | Discount applied |
| shipping_amount | DECIMAL(10,2) | NOT NULL | Shipping cost |
| tax_amount | DECIMAL(10,2) | NOT NULL | VAT amount |
| total_amount | DECIMAL(10,2) | NOT NULL | Final total |
| currency | VARCHAR(3) | DEFAULT 'SAR' | Currency |
| promo_code_id | UUID | FOREIGN KEY → promo_codes.id | Applied promo |
| referral_id | UUID | FOREIGN KEY → referrals.id | Referral used |
| shipping_address_id | UUID | FOREIGN KEY → addresses.id | Delivery address |
| shipping_method | ENUM | NOT NULL | 'standard', 'express', 'same_day' |
| estimated_delivery_date | DATE | | Expected delivery |
| actual_delivery_date | DATE | | Actual delivery |
| tracking_number | VARCHAR(100) | | Shipment tracking |
| carrier | VARCHAR(100) | | Shipping carrier |
| payment_method_id | UUID | FOREIGN KEY → payment_methods.id | Payment used |
| payment_provider | VARCHAR(50) | | Payment gateway |
| payment_transaction_id | VARCHAR(200) | | Transaction reference |
| customer_notes | TEXT | | Customer instructions |
| internal_notes | TEXT | | Staff notes |
| created_at | TIMESTAMP | DEFAULT NOW() | Order placed |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update |

**Order Status Values:** `pending`, `confirmed`, `processing`, `shipped`, `out_for_delivery`, `delivered`, `cancelled`, `refunded`, `returned`

**Payment Status Values:** `pending`, `authorized`, `captured`, `failed`, `refunded`, `partially_refunded`

#### `order_items`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| order_id | UUID | FOREIGN KEY → orders.id | Parent order |
| product_id | UUID | FOREIGN KEY → products.id | Product |
| variant_id | UUID | FOREIGN KEY → product_variants.id | Variant |
| product_name_en | VARCHAR(200) | NOT NULL | Product name snapshot |
| product_name_ar | VARCHAR(200) | NOT NULL | Product name snapshot |
| product_sku | VARCHAR(50) | NOT NULL | SKU snapshot |
| variant_size | VARCHAR(20) | | Size snapshot |
| variant_color_en | VARCHAR(50) | | Color snapshot |
| variant_color_ar | VARCHAR(50) | | Color snapshot |
| quantity | INT | NOT NULL | Quantity ordered |
| unit_price | DECIMAL(10,2) | NOT NULL | Price per unit |
| total_price | DECIMAL(10,2) | NOT NULL | Line total |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |

#### `order_status_history`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| order_id | UUID | FOREIGN KEY → orders.id | Parent order |
| status | ENUM | NOT NULL | New status |
| notes | TEXT | | Status change notes |
| created_by | VARCHAR(100) | | Who made the change |
| created_at | TIMESTAMP | DEFAULT NOW() | Change time |

---

### 8. Promo Codes

#### `promo_codes`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| code | VARCHAR(50) | UNIQUE, NOT NULL | Promo code (uppercase) |
| type | ENUM | NOT NULL | 'percentage', 'fixed_amount', 'free_shipping' |
| value | DECIMAL(10,2) | NOT NULL | Discount value |
| min_order_amount | DECIMAL(10,2) | | Minimum order required |
| max_discount_amount | DECIMAL(10,2) | | Maximum discount cap |
| max_uses | INT | | Total uses allowed |
| max_uses_per_user | INT | | Per-user limit |
| current_uses | INT | DEFAULT 0 | Times used |
| starts_at | TIMESTAMP | NOT NULL | Valid from |
| expires_at | TIMESTAMP | NOT NULL | Valid until |
| is_active | BOOLEAN | DEFAULT TRUE | Active status |
| applicable_categories | UUID[] | | Category restrictions |
| applicable_products | UUID[] | | Product restrictions |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update |

#### `promo_code_usage`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| promo_code_id | UUID | FOREIGN KEY → promo_codes.id | Promo used |
| user_id | UUID | FOREIGN KEY → users.id | User who used |
| order_id | UUID | FOREIGN KEY → orders.id | Associated order |
| discount_applied | DECIMAL(10,2) | NOT NULL | Discount amount |
| created_at | TIMESTAMP | DEFAULT NOW() | Usage time |

---

### 9. Referral System

#### `referrals`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| referrer_id | UUID | FOREIGN KEY → users.id | Who shared |
| referee_id | UUID | FOREIGN KEY → users.id | Who used link |
| referral_code | VARCHAR(20) | UNIQUE, NOT NULL | Unique code |
| share_link | TEXT | NOT NULL | Shareable URL |
| referrer_discount_percent | DECIMAL(5,2) | NOT NULL | Referrer reward % |
| referee_discount_percent | DECIMAL(5,2) | NOT NULL | Referee discount % |
| referrer_reward_amount | DECIMAL(10,2) | | Cash reward |
| status | ENUM | DEFAULT 'pending' | Referral status |
| order_id | UUID | FOREIGN KEY → orders.id | Qualifying order |
| clicked_at | TIMESTAMP | | Link clicked time |
| registered_at | TIMESTAMP | | Referee signup time |
| purchased_at | TIMESTAMP | | First purchase time |
| rewarded_at | TIMESTAMP | | Reward issued time |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |
| expires_at | TIMESTAMP | | Expiry time |

**Status Values:** `pending`, `clicked`, `registered`, `purchased`, `rewarded`

---

### 10. Saved Outfits

#### `saved_outfits`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| user_id | UUID | FOREIGN KEY → users.id | Creator |
| name | VARCHAR(100) | NOT NULL | Outfit name |
| description | TEXT | | Description |
| share_link | TEXT | | Public share URL |
| is_public | BOOLEAN | DEFAULT FALSE | Public visibility |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update |

#### `saved_outfit_items`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| outfit_id | UUID | FOREIGN KEY → saved_outfits.id | Parent outfit |
| product_id | UUID | FOREIGN KEY → products.id | Product |
| variant_id | UUID | FOREIGN KEY → product_variants.id | Variant |
| box_position | INT | NOT NULL | 0=top, 1=middle, 2=bottom, 3=accessory |
| sort_order | INT | DEFAULT 0 | Order in box |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |

---

### 11. Reviews

#### `reviews`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| product_id | UUID | FOREIGN KEY → products.id | Reviewed product |
| user_id | UUID | FOREIGN KEY → users.id | Reviewer |
| order_id | UUID | FOREIGN KEY → orders.id | Purchase proof |
| rating | INT | NOT NULL, 1-5 | Star rating |
| title | VARCHAR(200) | | Review title |
| comment | TEXT | | Review text |
| is_verified_purchase | BOOLEAN | DEFAULT FALSE | Verified buyer |
| is_approved | BOOLEAN | DEFAULT FALSE | Moderation status |
| helpful_count | INT | DEFAULT 0 | Helpful votes |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update |

#### `review_images`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| review_id | UUID | FOREIGN KEY → reviews.id | Parent review |
| image_url | TEXT | NOT NULL | Image URL |
| created_at | TIMESTAMP | DEFAULT NOW() | Upload time |

---

### 12. Notifications

#### `notifications`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| user_id | UUID | FOREIGN KEY → users.id | Recipient |
| type | ENUM | NOT NULL | Notification type |
| title_en | VARCHAR(200) | NOT NULL | English title |
| title_ar | VARCHAR(200) | NOT NULL | Arabic title |
| message_en | TEXT | NOT NULL | English message |
| message_ar | TEXT | NOT NULL | Arabic message |
| data | JSONB | | Additional data |
| is_read | BOOLEAN | DEFAULT FALSE | Read status |
| read_at | TIMESTAMP | | Read time |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |

**Type Values:** `order_confirmed`, `order_shipped`, `order_delivered`, `promo_code`, `referral_reward`, `back_in_stock`, `price_drop`, `new_arrival`

---

### 13. Analytics

#### `product_views`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| product_id | UUID | FOREIGN KEY → products.id | Viewed product |
| user_id | UUID | FOREIGN KEY → users.id | Viewer (if logged in) |
| session_id | VARCHAR(100) | | Session ID |
| source | VARCHAR(50) | | Traffic source |
| created_at | TIMESTAMP | DEFAULT NOW() | View time |

#### `search_queries`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| user_id | UUID | FOREIGN KEY → users.id | Searcher |
| session_id | VARCHAR(100) | | Session ID |
| query | VARCHAR(200) | NOT NULL | Search term |
| results_count | INT | NOT NULL | Results found |
| created_at | TIMESTAMP | DEFAULT NOW() | Search time |

---

## Recommended Indexes

### Performance Indexes
```sql
-- Products
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active_featured ON products(is_active, is_featured);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_sku ON products(sku);

-- Orders
CREATE INDEX idx_orders_user_created ON orders(user_id, created_at DESC);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);

-- Order Items
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- Cart
CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);
CREATE INDEX idx_cart_items_product ON cart_items(product_id);

-- Addresses
CREATE INDEX idx_addresses_user_default ON addresses(user_id, is_default);

-- Reviews
CREATE INDEX idx_reviews_product_approved ON reviews(product_id, is_approved);
CREATE INDEX idx_reviews_user ON reviews(user_id);

-- Promo Codes
CREATE INDEX idx_promo_codes_code ON promo_codes(code);
CREATE INDEX idx_promo_codes_active ON promo_codes(is_active, expires_at);

-- Referrals
CREATE INDEX idx_referrals_code ON referrals(referral_code);
CREATE INDEX idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX idx_referrals_referee ON referrals(referee_id);

-- Analytics
CREATE INDEX idx_product_views_product ON product_views(product_id, created_at DESC);

-- Notifications
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read, created_at DESC);
```

### Full-Text Search
```sql
-- Product search
CREATE INDEX idx_products_search ON products 
USING GIN(to_tsvector('english', name_en || ' ' || description_en));

CREATE INDEX idx_products_search_ar ON products 
USING GIN(to_tsvector('arabic', name_ar || ' ' || description_ar));
```

---

## Security (Row Level Security Policies)

### Example RLS Policies
```sql
-- Users can only read their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only manage their own addresses
CREATE POLICY "Users can manage own addresses" ON addresses
  FOR ALL USING (auth.uid() = user_id);

-- Users can only view their own orders
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

-- Anyone can view active products
CREATE POLICY "Anyone can view active products" ON products
  FOR SELECT USING (is_active = true);

-- Anyone can view approved reviews
CREATE POLICY "Anyone can view approved reviews" ON reviews
  FOR SELECT USING (is_approved = true);
```

---

## Summary Statistics

| Entity | Table Count | Primary Tables |
|--------|-------------|----------------|
| Users & Auth | 2 | users, profiles |
| Address | 1 | addresses |
| Payment | 1 | payment_methods |
| Products | 4 | categories, products, product_images, product_variants |
| Cart | 2 | carts, cart_items |
| Wishlist | 1 | wishlists |
| Orders | 3 | orders, order_items, order_status_history |
| Promo | 2 | promo_codes, promo_code_usage |
| Referral | 1 | referrals |
| Outfits | 2 | saved_outfits, saved_outfit_items |
| Reviews | 2 | reviews, review_images |
| Notifications | 1 | notifications |
| Analytics | 2 | product_views, search_queries |

**Total Tables: 24**
