# Razia E-Commerce Platform - Complete Documentation

## Table of Contents
1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Pages & Features](#pages--features)
4. [Database Schema](#database-schema)
5. [API Endpoints](#api-endpoints)
6. [Authentication](#authentication)
7. [Business Logic](#business-logic)

---

## Overview

**Razia** is a high-end bilingual (English/Arabic) e-commerce platform for women's fashion, targeting the Saudi Arabian market. The platform features a sophisticated design with RTL support, multiple payment methods, and a unique outfit builder feature.

### Brand Identity
- **Primary Colors**: #BEB7A6 (Sand), #FFCF01 (Gold), #00A998 (Teal), #E4084D (Coral), #005A64 (Navy)
- **Secondary Colors**: #818E8D, #434244, #FEFEFD, #093942
- **Fonts**: 
  - English Headlines: 'Baloo Bhaijaan'
  - Body & Arabic: 'Bahij TheSansArabic'
- **Currency**: SAR (Saudi Riyal)

---

## Technology Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Animations**: Framer Motion
- **State Management**: React Context + TanStack Query
- **Routing**: React Router DOM v6

### Backend (Lovable Cloud/Supabase)
- **Database**: PostgreSQL
- **Authentication**: Supabase Auth (Email, Google, Apple)
- **Storage**: Supabase Storage (for images)
- **Edge Functions**: Deno-based serverless functions

---

## Pages & Features

### 1. Home Page (`/`)
**Component**: `src/pages/Index.tsx`

**Sections**:
| Section | Description | Data Source |
|---------|-------------|-------------|
| Hero | Full-width banner with CTA | Static/CMS |
| Categories | 6 category cards with images | `categories` table |
| Latest Arrivals | Product carousel (8 items) | `products` table (is_new=true) |
| Philosophy | Brand story section | Static |
| Outfit Builder CTA | Link to outfit builder | Static |

**Fields displayed**:
- Hero: title, subtitle, CTA button, background image
- Categories: name (EN/AR), image, link
- Products: name, price, image, badge (new/sale)

---

### 2. Shop Page (`/shop`)
**Component**: `src/pages/Shop.tsx`

**Features**:
- Product grid with filtering
- Sort options (price, date, popularity)
- Category filter sidebar
- Search functionality
- Pagination

**Filters**:
| Filter | Type | Options |
|--------|------|---------|
| Category | Multi-select | From `categories` table |
| Price Range | Range slider | Min: 0, Max: 5000 SAR |
| Size | Multi-select | XS, S, M, L, XL, XXL |
| Color | Color swatches | Dynamic from products |
| Sort By | Dropdown | Price (asc/desc), Newest, Popular |

**Product Card Fields**:
- `name_en` / `name_ar`
- `price`
- `compare_at_price` (for sale badge)
- Primary image from `product_images`
- `is_new`, `is_featured` badges

---

### 3. Product Detail Page (`/product/:id`)
**Component**: `src/pages/ProductPage.tsx`

**Sections**:
| Section | Fields |
|---------|--------|
| Image Gallery | All images from `product_images` |
| Product Info | name, price, description, SKU |
| Variant Selector | size, color from `product_variants` |
| Add to Cart | quantity selector, add button |
| Reviews | rating, title, content, user info |
| Related Products | Same category products |

**Actions**:
- Add to cart (with variant selection)
- Add to wishlist
- Share product
- Write review (authenticated users)

---

### 4. Categories Page (`/categories`)
**Component**: `src/pages/Categories.tsx`

**Display**:
- Grid of category cards
- Each card shows: image, name (EN/AR), product count
- Subcategories support (parent_id relation)

---

### 5. Outfit Builder (`/outfit-builder`)
**Component**: `src/pages/OutfitBuilder.tsx`

**Features**:
- Drag-and-drop interface
- Product selection by category
- Save outfit (authenticated users)
- Share outfit
- Add entire outfit to cart

**Data Flow**:
```
User selects products → Creates outfit → Saves to saved_outfits → Items saved to saved_outfit_items
```

---

### 6. Cart Drawer
**Component**: `src/components/CartDrawer.tsx`

**Features**:
- Slide-out drawer
- Line items with quantity controls
- Remove item
- Subtotal calculation
- Proceed to checkout

**Cart Item Fields**:
- Product name & image
- Selected variant (size/color)
- Quantity
- Unit price & line total

---

### 7. Checkout Page (`/checkout`)
**Component**: `src/pages/Checkout.tsx`

**Steps**:
1. **Shipping Information**
2. **Payment Method**
3. **Order Review**

**Step 1 - Shipping Fields**:
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| firstName | text | Yes | Min 2 chars |
| lastName | text | Yes | Min 2 chars |
| email | email | Yes | Valid email |
| phone | tel | Yes | Saudi format |
| address | text | Yes | Min 5 chars |
| apartment | text | No | - |
| city | select | Yes | Saudi cities |
| postalCode | text | No | 5 digits |

**Step 2 - Payment Methods**:
| Method | Type | Fields Required |
|--------|------|-----------------|
| Tabby | BNPL | None (redirect) |
| Tamara | BNPL | None (redirect) |
| Mada | Card | Card number, expiry, CVV |
| Visa | Card | Card number, expiry, CVV, name |
| Apple Pay | Digital | None (native prompt) |

**Step 3 - Order Summary**:
- Line items
- Subtotal
- Shipping cost (fixed: 25 SAR)
- Promo code input
- Discount amount
- Total

---

### 8. Authentication Page (`/auth`)
**Component**: `src/pages/Auth.tsx`

**Login Form**:
| Field | Type | Validation |
|-------|------|------------|
| email | email | Required, valid format |
| password | password | Required, min 6 chars |

**Signup Form**:
| Field | Type | Validation |
|-------|------|------------|
| firstName | text | Required |
| lastName | text | Required |
| email | email | Required, valid format |
| password | password | Required, min 6 chars |
| confirmPassword | password | Must match password |

**OAuth Providers**:
- Google
- Apple

---

### 9. Profile Page (`/profile`)
**Component**: `src/pages/Profile.tsx`

**Tabs**:
| Tab | Content |
|-----|---------|
| Overview | User info, recent orders |
| Orders | Order history list |
| Addresses | Saved addresses CRUD |
| Wishlist | Wishlisted products |
| Settings | Profile edit, password change |

---

### 10. About Page (`/about`)
**Component**: `src/pages/About.tsx`

Static content page with:
- Brand story
- Mission & values
- Team section
- Store locations

---

### 11. Contact Page (`/contact`)
**Component**: `src/pages/Contact.tsx`

**Contact Form Fields**:
| Field | Type | Required |
|-------|------|----------|
| name | text | Yes |
| email | email | Yes |
| subject | select | Yes |
| message | textarea | Yes |

**Contact Info Displayed**:
- Phone numbers
- Email addresses
- Physical address
- Business hours
- Social media links

---

## Database Schema

### Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           RAZIA DATABASE SCHEMA                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   profiles   │────<│  addresses   │     │  categories  │──┐
│──────────────│     │──────────────│     │──────────────│  │ (self-ref)
│ id (PK)      │     │ id (PK)      │     │ id (PK)      │<─┘
│ user_id (FK) │     │ user_id (FK) │     │ name_en      │
│ first_name   │     │ first_name   │     │ name_ar      │
│ last_name    │     │ last_name    │     │ slug         │
│ avatar_url   │     │ phone        │     │ parent_id    │
│ phone        │     │ street_addr  │     │ image_url    │
│ created_at   │     │ city         │     │ sort_order   │
│ updated_at   │     │ country      │     └──────┬───────┘
└──────┬───────┘     │ is_default   │            │
       │             └──────────────┘            │
       │                                         │
       │     ┌──────────────┐              ┌─────┴────────┐
       │────<│    carts     │              │   products   │
       │     │──────────────│              │──────────────│
       │     │ id (PK)      │              │ id (PK)      │
       │     │ user_id (FK) │              │ name_en      │
       │     └──────┬───────┘              │ name_ar      │
       │            │                      │ slug         │
       │     ┌──────┴───────┐              │ price        │
       │     │  cart_items  │              │ category_id  │
       │     │──────────────│              │ stock_qty    │
       │     │ id (PK)      │              │ is_active    │
       │     │ cart_id (FK) │──────────────│ is_featured  │
       │     │ product_id   │              │ is_new       │
       │     │ variant_id   │              └──────┬───────┘
       │     │ quantity     │                     │
       │     └──────────────┘         ┌───────────┼───────────┐
       │                              │           │           │
       │     ┌──────────────┐   ┌─────┴─────┐ ┌───┴───┐ ┌─────┴─────┐
       │────<│  wishlists   │   │  product  │ │product│ │  reviews  │
       │     │──────────────│   │  images   │ │variant│ │───────────│
       │     │ id (PK)      │   │───────────│ │───────│ │ id (PK)   │
       │     │ user_id (FK) │   │ id (PK)   │ │ id    │ │ user_id   │
       │     │ product_id   │   │ product_id│ │prod_id│ │ product_id│
       │     └──────────────┘   │ image_url │ │ size  │ │ rating    │
       │                        │ is_primary│ │ color │ │ content   │
       │     ┌──────────────┐   └───────────┘ │ stock │ └───────────┘
       │────<│    orders    │                 └───────┘
       │     │──────────────│
       │     │ id (PK)      │     ┌──────────────┐
       │     │ user_id (FK) │────<│ order_items  │
       │     │ order_number │     │──────────────│
       │     │ status       │     │ id (PK)      │
       │     │ subtotal     │     │ order_id (FK)│
       │     │ total        │     │ product_id   │
       │     │ payment_meth │     │ quantity     │
       │     │ ship_address │     │ unit_price   │
       │     └──────┬───────┘     └──────────────┘
       │            │
       │     ┌──────┴───────┐     ┌──────────────┐
       │     │order_status  │     │ promo_codes  │
       │     │  _history    │     │──────────────│
       │     │──────────────│     │ id (PK)      │
       │     │ id (PK)      │     │ code         │
       │     │ order_id (FK)│     │ discount_type│
       │     │ status       │     │ discount_val │
       │     │ notes        │     │ usage_limit  │
       │     └──────────────┘     └──────────────┘
       │
       │     ┌──────────────┐     ┌──────────────┐
       │────<│saved_outfits │────<│saved_outfit  │
       │     │──────────────│     │   _items     │
       │     │ id (PK)      │     │──────────────│
       │     │ user_id (FK) │     │ id (PK)      │
       │     │ name         │     │ outfit_id(FK)│
       │     │ is_public    │     │ product_id   │
       │     └──────────────┘     │ position     │
       │                          └──────────────┘
       │     ┌──────────────┐
       └────<│notifications │
             │──────────────│
             │ id (PK)      │
             │ user_id (FK) │
             │ type         │
             │ title        │
             │ message      │
             │ is_read      │
             └──────────────┘
```

---

### Table Definitions

#### 1. profiles
Stores user profile information, auto-created on signup.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Primary key |
| user_id | UUID | FK → auth.users, UNIQUE, NOT NULL | Reference to auth user |
| first_name | TEXT | NULL | User's first name |
| last_name | TEXT | NULL | User's last name |
| avatar_url | TEXT | NULL | Profile picture URL |
| phone | TEXT | NULL | Phone number |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Creation timestamp |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Last update timestamp |

**RLS Policies**:
- SELECT: Users can view their own profile
- UPDATE: Users can update their own profile
- INSERT: Users can insert their own profile

**Triggers**:
- `update_profiles_updated_at`: Updates `updated_at` on modification
- `on_auth_user_created`: Auto-creates profile on user signup

---

#### 2. categories
Product categories with bilingual support and hierarchy.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Primary key |
| name_en | TEXT | NOT NULL | English name |
| name_ar | TEXT | NOT NULL | Arabic name |
| slug | TEXT | UNIQUE, NOT NULL | URL-friendly identifier |
| description_en | TEXT | NULL | English description |
| description_ar | TEXT | NULL | Arabic description |
| image_url | TEXT | NULL | Category image |
| parent_id | UUID | FK → categories, NULL | Parent category (for hierarchy) |
| sort_order | INTEGER | DEFAULT 0 | Display order |
| is_active | BOOLEAN | DEFAULT true | Active status |
| created_at | TIMESTAMPTZ | DEFAULT now() | Creation timestamp |
| updated_at | TIMESTAMPTZ | DEFAULT now() | Last update timestamp |

**RLS Policies**:
- SELECT: Public (everyone can view)

---

#### 3. products
Main product catalog.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Primary key |
| name_en | TEXT | NOT NULL | English product name |
| name_ar | TEXT | NOT NULL | Arabic product name |
| slug | TEXT | UNIQUE, NOT NULL | URL-friendly identifier |
| description_en | TEXT | NULL | English description |
| description_ar | TEXT | NULL | Arabic description |
| price | DECIMAL(10,2) | NOT NULL | Base price in SAR |
| compare_at_price | DECIMAL(10,2) | NULL | Original price (for sales) |
| category_id | UUID | FK → categories | Product category |
| sku | TEXT | UNIQUE | Stock keeping unit |
| stock_quantity | INTEGER | DEFAULT 0 | Available stock |
| is_active | BOOLEAN | DEFAULT true | Published status |
| is_featured | BOOLEAN | DEFAULT false | Featured on homepage |
| is_new | BOOLEAN | DEFAULT false | New arrival badge |
| tags | TEXT[] | NULL | Product tags array |
| created_at | TIMESTAMPTZ | DEFAULT now() | Creation timestamp |
| updated_at | TIMESTAMPTZ | DEFAULT now() | Last update timestamp |

**RLS Policies**:
- SELECT: Public (everyone can view active products)

**Indexes**:
- `idx_products_category`: category_id
- `idx_products_is_active`: is_active
- `idx_products_is_featured`: is_featured

---

#### 4. product_images
Product image gallery.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Primary key |
| product_id | UUID | FK → products, NOT NULL | Parent product |
| image_url | TEXT | NOT NULL | Image URL |
| alt_text_en | TEXT | NULL | English alt text |
| alt_text_ar | TEXT | NULL | Arabic alt text |
| sort_order | INTEGER | DEFAULT 0 | Display order |
| is_primary | BOOLEAN | DEFAULT false | Main product image |
| created_at | TIMESTAMPTZ | DEFAULT now() | Creation timestamp |

**RLS Policies**:
- SELECT: Public

---

#### 5. product_variants
Product size/color variants with stock tracking.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Primary key |
| product_id | UUID | FK → products, NOT NULL | Parent product |
| size | TEXT | NULL | Size (XS, S, M, L, XL, XXL) |
| color | TEXT | NULL | Color name |
| color_hex | TEXT | NULL | Color hex code |
| price_adjustment | DECIMAL(10,2) | DEFAULT 0 | Price modifier (+/-) |
| stock_quantity | INTEGER | DEFAULT 0 | Variant stock |
| sku | TEXT | UNIQUE | Variant SKU |
| is_active | BOOLEAN | DEFAULT true | Available for purchase |
| created_at | TIMESTAMPTZ | DEFAULT now() | Creation timestamp |

**RLS Policies**:
- SELECT: Public

---

#### 6. addresses
User shipping/billing addresses.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Primary key |
| user_id | UUID | FK → auth.users, NOT NULL | Owner |
| label | TEXT | NULL | Address label (Home, Work) |
| first_name | TEXT | NOT NULL | Recipient first name |
| last_name | TEXT | NOT NULL | Recipient last name |
| phone | TEXT | NULL | Contact phone |
| street_address | TEXT | NOT NULL | Street address |
| apartment | TEXT | NULL | Apt/Suite number |
| city | TEXT | NOT NULL | City |
| state | TEXT | NULL | State/Province |
| postal_code | TEXT | NULL | Postal/ZIP code |
| country | TEXT | DEFAULT 'Saudi Arabia' | Country |
| is_default | BOOLEAN | DEFAULT false | Default address |
| created_at | TIMESTAMPTZ | DEFAULT now() | Creation timestamp |
| updated_at | TIMESTAMPTZ | DEFAULT now() | Last update timestamp |

**RLS Policies**:
- SELECT/INSERT/UPDATE/DELETE: Users can manage their own addresses

---

#### 7. carts
User shopping carts (one per user).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Primary key |
| user_id | UUID | FK → auth.users, UNIQUE, NOT NULL | Cart owner |
| created_at | TIMESTAMPTZ | DEFAULT now() | Creation timestamp |
| updated_at | TIMESTAMPTZ | DEFAULT now() | Last update timestamp |

**RLS Policies**:
- SELECT/INSERT/UPDATE/DELETE: Users can manage their own cart

**Triggers**:
- `create_user_cart`: Auto-creates cart when profile is created

---

#### 8. cart_items
Items in shopping cart.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Primary key |
| cart_id | UUID | FK → carts, NOT NULL | Parent cart |
| product_id | UUID | FK → products, NOT NULL | Product reference |
| variant_id | UUID | FK → product_variants, NULL | Selected variant |
| quantity | INTEGER | NOT NULL, CHECK > 0, DEFAULT 1 | Item quantity |
| created_at | TIMESTAMPTZ | DEFAULT now() | Added timestamp |
| updated_at | TIMESTAMPTZ | DEFAULT now() | Last update timestamp |

**Constraints**:
- UNIQUE(cart_id, product_id, variant_id)

**RLS Policies**:
- All operations: Through cart ownership check

---

#### 9. wishlists
User wishlisted products.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Primary key |
| user_id | UUID | FK → auth.users, NOT NULL | User |
| product_id | UUID | FK → products, NOT NULL | Wishlisted product |
| created_at | TIMESTAMPTZ | DEFAULT now() | Added timestamp |

**Constraints**:
- UNIQUE(user_id, product_id)

**RLS Policies**:
- SELECT/INSERT/DELETE: Users can manage their own wishlist

---

#### 10. orders
Customer orders.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Primary key |
| user_id | UUID | FK → auth.users, NULL | Customer (NULL for guest) |
| order_number | TEXT | UNIQUE, NOT NULL | Display order number (RZ-YYYYMMDD-XXXX) |
| status | TEXT | NOT NULL, CHECK | Order status |
| subtotal | DECIMAL(10,2) | NOT NULL | Items subtotal |
| shipping_cost | DECIMAL(10,2) | DEFAULT 0 | Shipping fee |
| tax_amount | DECIMAL(10,2) | DEFAULT 0 | Tax amount |
| discount_amount | DECIMAL(10,2) | DEFAULT 0 | Discount applied |
| total | DECIMAL(10,2) | NOT NULL | Final total |
| currency | TEXT | DEFAULT 'SAR' | Currency code |
| payment_method | TEXT | NULL | Payment method used |
| payment_status | TEXT | CHECK | Payment status |
| shipping_address | JSONB | NULL | Shipping address snapshot |
| billing_address | JSONB | NULL | Billing address snapshot |
| notes | TEXT | NULL | Order notes |
| promo_code_id | UUID | NULL | Applied promo code |
| created_at | TIMESTAMPTZ | DEFAULT now() | Order timestamp |
| updated_at | TIMESTAMPTZ | DEFAULT now() | Last update timestamp |

**Status Values**: pending, confirmed, processing, shipped, delivered, cancelled, refunded
**Payment Status Values**: pending, paid, failed, refunded

**RLS Policies**:
- SELECT/INSERT: Users can view and create their own orders

**Triggers**:
- `set_order_number`: Auto-generates order number

---

#### 11. order_items
Line items in an order.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Primary key |
| order_id | UUID | FK → orders, NOT NULL | Parent order |
| product_id | UUID | FK → products, NULL | Product reference |
| variant_id | UUID | FK → product_variants, NULL | Variant reference |
| product_name | TEXT | NOT NULL | Product name snapshot |
| variant_info | TEXT | NULL | Variant details snapshot |
| quantity | INTEGER | NOT NULL, CHECK > 0 | Quantity ordered |
| unit_price | DECIMAL(10,2) | NOT NULL | Price per unit |
| total_price | DECIMAL(10,2) | NOT NULL | Line total |
| created_at | TIMESTAMPTZ | DEFAULT now() | Creation timestamp |

**RLS Policies**:
- SELECT/INSERT: Through order ownership check

---

#### 12. order_status_history
Order status change log.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Primary key |
| order_id | UUID | FK → orders, NOT NULL | Order reference |
| status | TEXT | NOT NULL | New status |
| notes | TEXT | NULL | Status change notes |
| created_at | TIMESTAMPTZ | DEFAULT now() | Change timestamp |

**RLS Policies**:
- SELECT: Through order ownership check

---

#### 13. promo_codes
Discount codes.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Primary key |
| code | TEXT | UNIQUE, NOT NULL | Promo code |
| description | TEXT | NULL | Code description |
| discount_type | TEXT | NOT NULL, CHECK | percentage or fixed |
| discount_value | DECIMAL(10,2) | NOT NULL | Discount amount/percentage |
| minimum_order | DECIMAL(10,2) | DEFAULT 0 | Minimum order value |
| maximum_discount | DECIMAL(10,2) | NULL | Max discount cap |
| usage_limit | INTEGER | NULL | Total usage limit |
| used_count | INTEGER | DEFAULT 0 | Times used |
| starts_at | TIMESTAMPTZ | NULL | Activation date |
| expires_at | TIMESTAMPTZ | NULL | Expiration date |
| is_active | BOOLEAN | DEFAULT true | Active status |
| created_at | TIMESTAMPTZ | DEFAULT now() | Creation timestamp |

**RLS Policies**:
- SELECT: Active promo codes are public

---

#### 14. promo_code_usage
Tracks promo code usage per user.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Primary key |
| promo_code_id | UUID | FK → promo_codes, NOT NULL | Promo code used |
| user_id | UUID | FK → auth.users, NOT NULL | User who used it |
| order_id | UUID | FK → orders, NULL | Associated order |
| used_at | TIMESTAMPTZ | DEFAULT now() | Usage timestamp |

**Constraints**:
- UNIQUE(promo_code_id, user_id, order_id)

---

#### 15. reviews
Product reviews and ratings.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Primary key |
| user_id | UUID | FK → auth.users, NOT NULL | Reviewer |
| product_id | UUID | FK → products, NOT NULL | Reviewed product |
| rating | INTEGER | NOT NULL, CHECK 1-5 | Star rating |
| title | TEXT | NULL | Review title |
| content | TEXT | NULL | Review text |
| is_verified_purchase | BOOLEAN | DEFAULT false | Verified buyer |
| is_approved | BOOLEAN | DEFAULT false | Moderation status |
| created_at | TIMESTAMPTZ | DEFAULT now() | Creation timestamp |
| updated_at | TIMESTAMPTZ | DEFAULT now() | Last update timestamp |

**Constraints**:
- UNIQUE(user_id, product_id)

**RLS Policies**:
- SELECT: Approved reviews are public; users can view their own
- INSERT/UPDATE/DELETE: Users can manage their own reviews

---

#### 16. saved_outfits
User-created outfit collections.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Primary key |
| user_id | UUID | FK → auth.users, NOT NULL | Creator |
| name | TEXT | NOT NULL | Outfit name |
| description | TEXT | NULL | Outfit description |
| is_public | BOOLEAN | DEFAULT false | Publicly visible |
| created_at | TIMESTAMPTZ | DEFAULT now() | Creation timestamp |
| updated_at | TIMESTAMPTZ | DEFAULT now() | Last update timestamp |

**RLS Policies**:
- SELECT: Public outfits viewable by all; users see their own
- INSERT/UPDATE/DELETE: Users manage their own outfits

---

#### 17. saved_outfit_items
Products in saved outfits.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Primary key |
| outfit_id | UUID | FK → saved_outfits, NOT NULL | Parent outfit |
| product_id | UUID | FK → products, NOT NULL | Product in outfit |
| position | INTEGER | DEFAULT 0 | Display order |
| created_at | TIMESTAMPTZ | DEFAULT now() | Added timestamp |

**Constraints**:
- UNIQUE(outfit_id, product_id)

**RLS Policies**:
- Through outfit visibility/ownership

---

#### 18. notifications
User notifications.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Primary key |
| user_id | UUID | FK → auth.users, NOT NULL | Recipient |
| type | TEXT | NOT NULL | Notification type |
| title | TEXT | NOT NULL | Notification title |
| message | TEXT | NULL | Notification body |
| data | JSONB | NULL | Additional data |
| is_read | BOOLEAN | DEFAULT false | Read status |
| created_at | TIMESTAMPTZ | DEFAULT now() | Creation timestamp |

**Notification Types**: order_status, promotion, wishlist_sale, review_response, system

**RLS Policies**:
- SELECT/UPDATE/DELETE: Users manage their own notifications

---

## API Endpoints

### Authentication
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/signup` | POST | Create new account |
| `/auth/signin` | POST | Email/password login |
| `/auth/signout` | POST | Logout |
| `/auth/oauth/google` | GET | Google OAuth |
| `/auth/oauth/apple` | GET | Apple OAuth |
| `/auth/reset-password` | POST | Request password reset |

### Products
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/products` | GET | List products (with filters) |
| `/products/:id` | GET | Get product details |
| `/products/:id/reviews` | GET | Get product reviews |
| `/products/:id/reviews` | POST | Create review |

### Categories
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/categories` | GET | List all categories |
| `/categories/:slug` | GET | Get category with products |

### Cart
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/cart` | GET | Get user's cart |
| `/cart/items` | POST | Add item to cart |
| `/cart/items/:id` | PATCH | Update quantity |
| `/cart/items/:id` | DELETE | Remove item |

### Orders
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/orders` | GET | List user's orders |
| `/orders` | POST | Create new order |
| `/orders/:id` | GET | Get order details |

### Wishlist
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/wishlist` | GET | Get user's wishlist |
| `/wishlist` | POST | Add to wishlist |
| `/wishlist/:productId` | DELETE | Remove from wishlist |

### User
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/profile` | GET | Get user profile |
| `/profile` | PATCH | Update profile |
| `/addresses` | GET | List addresses |
| `/addresses` | POST | Add address |
| `/addresses/:id` | PATCH | Update address |
| `/addresses/:id` | DELETE | Delete address |

---

## Authentication

### Flow Diagram
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────>│  Supabase   │────>│  Database   │
│   (React)   │     │    Auth     │     │  (Postgres) │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       │  1. signUp()      │                   │
       │──────────────────>│                   │
       │                   │  2. Create user   │
       │                   │──────────────────>│
       │                   │                   │
       │                   │  3. Trigger:      │
       │                   │  create profile   │
       │                   │──────────────────>│
       │                   │                   │
       │                   │  4. Trigger:      │
       │                   │  create cart      │
       │                   │──────────────────>│
       │                   │                   │
       │  5. Session JWT   │                   │
       │<──────────────────│                   │
```

### Session Management
- JWT stored in localStorage
- Auto-refresh handled by Supabase client
- `onAuthStateChange` listener for real-time auth state

---

## Business Logic

### Cart Calculations
```typescript
subtotal = Σ(item.quantity × item.unit_price)
shipping = 25 SAR (fixed) or 0 if subtotal >= 500 SAR
discount = calculateDiscount(promo_code, subtotal)
total = subtotal + shipping - discount
```

### Promo Code Validation
```typescript
function validatePromoCode(code, subtotal, userId) {
  1. Check code exists and is_active = true
  2. Check starts_at <= now <= expires_at
  3. Check used_count < usage_limit
  4. Check subtotal >= minimum_order
  5. Check user hasn't used code before
  
  return { valid: boolean, discount: number, error?: string }
}
```

### Order Number Generation
```sql
'RZ-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0')
-- Example: RZ-20260114-4729
```

### Stock Management
```typescript
// On order creation
1. Check all items have sufficient stock
2. Reserve stock (decrement stock_quantity)
3. If payment fails, release stock (increment)
4. On cancellation, release stock
```

---

## File Storage

### Buckets
| Bucket | Public | Purpose |
|--------|--------|---------|
| products | Yes | Product images |
| avatars | Yes | User profile pictures |
| reviews | Yes | Review images |
| outfits | Yes | Outfit thumbnails |

### Upload Policies
- Product images: Admin only
- Avatars: User can upload their own
- Review images: Authenticated users

---

## Localization

### Supported Languages
- English (en) - Default
- Arabic (ar) - RTL support

### Implementation
- All text stored with `_en` and `_ar` suffixes
- `useLanguage()` hook for current language
- `t()` function for translations
- Direction switches based on language

---

## Environment Variables

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key

# Optional
VITE_GOOGLE_ANALYTICS_ID=GA-XXXXXXX
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
```

---

## Security Considerations

1. **RLS Policies**: All tables have row-level security enabled
2. **User Isolation**: Users can only access their own data
3. **Input Validation**: All forms validate input before submission
4. **SQL Injection**: Prevented by Supabase's parameterized queries
5. **XSS Prevention**: React's built-in escaping
6. **HTTPS Only**: All API calls over HTTPS

---

## Deployment

### Frontend
- Build: `npm run build`
- Deploy to: Lovable hosting or any static host

### Backend
- Managed by Lovable Cloud
- Auto-deploys on code changes
- Edge functions deploy automatically

---

*Last Updated: January 2026*
