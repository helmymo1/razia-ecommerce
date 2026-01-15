// Database Schema Types for Razia E-commerce Platform
// This file defines all database entities and their relationships

// ==================== USER & AUTHENTICATION ====================

export interface User {
  id: string; // UUID, Primary Key
  email: string; // Unique, Not Null
  phone?: string;
  created_at: string; // Timestamp
  updated_at: string; // Timestamp
  last_login?: string; // Timestamp
  is_active: boolean; // Default: true
  preferred_language: 'en' | 'ar'; // Default: 'en'
}

export interface Profile {
  id: string; // UUID, Primary Key
  user_id: string; // Foreign Key -> User.id, Unique
  first_name: string;
  last_name: string;
  avatar_url?: string;
  date_of_birth?: string; // Date
  gender?: 'female' | 'male' | 'other';
  created_at: string;
  updated_at: string;
}

// ==================== ADDRESS MANAGEMENT ====================

export interface Address {
  id: string; // UUID, Primary Key
  user_id: string; // Foreign Key -> User.id
  label: string; // e.g., "Home", "Work"
  first_name: string;
  last_name: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean; // Default: false
  created_at: string;
  updated_at: string;
}

// ==================== PAYMENT METHODS ====================

export interface PaymentMethod {
  id: string; // UUID, Primary Key
  user_id: string; // Foreign Key -> User.id
  type: 'card' | 'mada' | 'tabby' | 'tamara' | 'apple_pay';
  provider: string; // e.g., "Visa", "Mastercard", "Mada"
  last_four?: string; // Last 4 digits for cards
  expiry_month?: number;
  expiry_year?: number;
  holder_name?: string;
  is_default: boolean; // Default: false
  token?: string; // Encrypted payment token
  created_at: string;
  updated_at: string;
}

// ==================== PRODUCTS & CATEGORIES ====================

export interface Category {
  id: string; // UUID, Primary Key
  slug: string; // Unique, URL-friendly
  name_en: string;
  name_ar: string;
  description_en?: string;
  description_ar?: string;
  image_url?: string;
  parent_id?: string; // Foreign Key -> Category.id (self-referencing for subcategories)
  sort_order: number; // Default: 0
  is_active: boolean; // Default: true
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string; // UUID, Primary Key
  sku: string; // Unique, Stock Keeping Unit
  slug: string; // Unique, URL-friendly
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  short_description_en?: string;
  short_description_ar?: string;
  price: number; // Decimal(10,2)
  original_price?: number; // Decimal(10,2), for showing discounts
  cost_price?: number; // Decimal(10,2), internal cost
  currency: string; // Default: 'SAR'
  category_id: string; // Foreign Key -> Category.id
  is_active: boolean; // Default: true
  is_featured: boolean; // Default: false
  is_new: boolean; // Default: false
  stock_quantity: number; // Default: 0
  low_stock_threshold: number; // Default: 5
  weight?: number; // For shipping calculations
  meta_title_en?: string;
  meta_title_ar?: string;
  meta_description_en?: string;
  meta_description_ar?: string;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string; // UUID, Primary Key
  product_id: string; // Foreign Key -> Product.id
  image_url: string;
  alt_text_en?: string;
  alt_text_ar?: string;
  sort_order: number; // Default: 0
  is_primary: boolean; // Default: false
  created_at: string;
}

export interface ProductVariant {
  id: string; // UUID, Primary Key
  product_id: string; // Foreign Key -> Product.id
  size: string; // e.g., "S", "M", "L", "XL"
  color_en: string;
  color_ar: string;
  color_hex?: string; // e.g., "#000000"
  sku_suffix?: string; // Appended to product SKU
  price_adjustment: number; // Default: 0, can be positive or negative
  stock_quantity: number; // Default: 0
  is_active: boolean; // Default: true
  created_at: string;
  updated_at: string;
}

// ==================== CART ====================

export interface Cart {
  id: string; // UUID, Primary Key
  user_id?: string; // Foreign Key -> User.id (nullable for guest carts)
  session_id?: string; // For guest users
  promo_code_id?: string; // Foreign Key -> PromoCode.id
  expires_at?: string; // Timestamp, for guest cart cleanup
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string; // UUID, Primary Key
  cart_id: string; // Foreign Key -> Cart.id
  product_id: string; // Foreign Key -> Product.id
  variant_id?: string; // Foreign Key -> ProductVariant.id
  quantity: number; // Default: 1, Min: 1
  price_at_add: number; // Price when added to cart
  created_at: string;
  updated_at: string;
}

// ==================== WISHLIST ====================

export interface Wishlist {
  id: string; // UUID, Primary Key
  user_id: string; // Foreign Key -> User.id
  product_id: string; // Foreign Key -> Product.id
  created_at: string;
  // Unique constraint on (user_id, product_id)
}

// ==================== ORDERS ====================

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refunded'
  | 'returned';

export type PaymentStatus = 
  | 'pending'
  | 'authorized'
  | 'captured'
  | 'failed'
  | 'refunded'
  | 'partially_refunded';

export interface Order {
  id: string; // UUID, Primary Key
  order_number: string; // Unique, human-readable (e.g., "RZA-20250113-0001")
  user_id: string; // Foreign Key -> User.id
  status: OrderStatus; // Default: 'pending'
  payment_status: PaymentStatus; // Default: 'pending'
  
  // Pricing
  subtotal: number; // Decimal(10,2)
  discount_amount: number; // Default: 0
  shipping_amount: number; // Decimal(10,2)
  tax_amount: number; // Decimal(10,2), VAT
  total_amount: number; // Decimal(10,2)
  currency: string; // Default: 'SAR'
  
  // Promo & Referral
  promo_code_id?: string; // Foreign Key -> PromoCode.id
  referral_id?: string; // Foreign Key -> Referral.id
  
  // Shipping
  shipping_address_id: string; // Foreign Key -> Address.id
  shipping_method: 'standard' | 'express' | 'same_day';
  estimated_delivery_date?: string; // Date
  actual_delivery_date?: string; // Date
  tracking_number?: string;
  carrier?: string;
  
  // Payment
  payment_method_id?: string; // Foreign Key -> PaymentMethod.id
  payment_provider?: string;
  payment_transaction_id?: string;
  
  // Notes
  customer_notes?: string;
  internal_notes?: string;
  
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string; // UUID, Primary Key
  order_id: string; // Foreign Key -> Order.id
  product_id: string; // Foreign Key -> Product.id
  variant_id?: string; // Foreign Key -> ProductVariant.id
  
  // Snapshot of product at time of order
  product_name_en: string;
  product_name_ar: string;
  product_sku: string;
  variant_size?: string;
  variant_color_en?: string;
  variant_color_ar?: string;
  
  quantity: number;
  unit_price: number; // Price at time of order
  total_price: number; // unit_price * quantity
  
  created_at: string;
}

export interface OrderStatusHistory {
  id: string; // UUID, Primary Key
  order_id: string; // Foreign Key -> Order.id
  status: OrderStatus;
  notes?: string;
  created_by?: string; // User or system that made the change
  created_at: string;
}

// ==================== PROMO CODES ====================

export type PromoCodeType = 'percentage' | 'fixed_amount' | 'free_shipping';

export interface PromoCode {
  id: string; // UUID, Primary Key
  code: string; // Unique, uppercase
  type: PromoCodeType;
  value: number; // Percentage or fixed amount
  min_order_amount?: number; // Minimum order to apply
  max_discount_amount?: number; // Cap for percentage discounts
  max_uses?: number; // Total uses allowed
  max_uses_per_user?: number; // Uses per user
  current_uses: number; // Default: 0
  starts_at: string; // Timestamp
  expires_at: string; // Timestamp
  is_active: boolean; // Default: true
  applicable_categories?: string[]; // Array of Category IDs
  applicable_products?: string[]; // Array of Product IDs
  created_at: string;
  updated_at: string;
}

export interface PromoCodeUsage {
  id: string; // UUID, Primary Key
  promo_code_id: string; // Foreign Key -> PromoCode.id
  user_id: string; // Foreign Key -> User.id
  order_id: string; // Foreign Key -> Order.id
  discount_applied: number;
  created_at: string;
}

// ==================== REFERRAL SYSTEM ====================

export interface Referral {
  id: string; // UUID, Primary Key
  referrer_id: string; // Foreign Key -> User.id (who shared)
  referee_id?: string; // Foreign Key -> User.id (who used the link)
  referral_code: string; // Unique
  share_link: string;
  
  // Rewards
  referrer_discount_percent: number; // e.g., 10
  referee_discount_percent: number; // e.g., 15
  referrer_reward_amount?: number; // Cash reward after successful order
  
  status: 'pending' | 'clicked' | 'registered' | 'purchased' | 'rewarded';
  order_id?: string; // Foreign Key -> Order.id (the qualifying order)
  
  clicked_at?: string;
  registered_at?: string;
  purchased_at?: string;
  rewarded_at?: string;
  created_at: string;
  expires_at?: string;
}

// ==================== SAVED OUTFITS ====================

export interface SavedOutfit {
  id: string; // UUID, Primary Key
  user_id: string; // Foreign Key -> User.id
  name: string;
  description?: string;
  share_link?: string;
  is_public: boolean; // Default: false
  created_at: string;
  updated_at: string;
}

export interface SavedOutfitItem {
  id: string; // UUID, Primary Key
  outfit_id: string; // Foreign Key -> SavedOutfit.id
  product_id: string; // Foreign Key -> Product.id
  variant_id?: string; // Foreign Key -> ProductVariant.id
  box_position: number; // 0 = top, 1 = middle, 2 = bottom, 3 = accessory
  sort_order: number; // For multiple items in same box
  created_at: string;
}

// ==================== REVIEWS ====================

export interface Review {
  id: string; // UUID, Primary Key
  product_id: string; // Foreign Key -> Product.id
  user_id: string; // Foreign Key -> User.id
  order_id?: string; // Foreign Key -> Order.id (verified purchase)
  rating: number; // 1-5
  title?: string;
  comment?: string;
  is_verified_purchase: boolean; // Default: false
  is_approved: boolean; // Default: false (moderation)
  helpful_count: number; // Default: 0
  created_at: string;
  updated_at: string;
}

export interface ReviewImage {
  id: string; // UUID, Primary Key
  review_id: string; // Foreign Key -> Review.id
  image_url: string;
  created_at: string;
}

// ==================== NOTIFICATIONS ====================

export type NotificationType = 
  | 'order_confirmed'
  | 'order_shipped'
  | 'order_delivered'
  | 'promo_code'
  | 'referral_reward'
  | 'back_in_stock'
  | 'price_drop'
  | 'new_arrival';

export interface Notification {
  id: string; // UUID, Primary Key
  user_id: string; // Foreign Key -> User.id
  type: NotificationType;
  title_en: string;
  title_ar: string;
  message_en: string;
  message_ar: string;
  data?: Record<string, unknown>; // JSON, additional data
  is_read: boolean; // Default: false
  read_at?: string;
  created_at: string;
}

// ==================== ANALYTICS & TRACKING ====================

export interface ProductView {
  id: string; // UUID, Primary Key
  product_id: string; // Foreign Key -> Product.id
  user_id?: string; // Foreign Key -> User.id
  session_id?: string;
  source?: string; // e.g., "search", "category", "home"
  created_at: string;
}

export interface SearchQuery {
  id: string; // UUID, Primary Key
  user_id?: string; // Foreign Key -> User.id
  session_id?: string;
  query: string;
  results_count: number;
  created_at: string;
}

// ==================== RELATIONSHIP DIAGRAM ====================
/*

┌─────────────────────────────────────────────────────────────────────────────────┐
│                           DATABASE RELATIONSHIPS                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

User (1) ─────────────── (1) Profile
  │
  ├──── (1) ─────────── (N) Address
  │
  ├──── (1) ─────────── (N) PaymentMethod
  │
  ├──── (1) ─────────── (1) Cart ──────── (N) CartItem ──────── (1) Product
  │                                              │
  │                                              └──────────── (1) ProductVariant
  │
  ├──── (1) ─────────── (N) Wishlist ─────────── (1) Product
  │
  ├──── (1) ─────────── (N) Order
  │                           │
  │                           ├──── (N) OrderItem ──────── (1) Product
  │                           │                    └────── (1) ProductVariant
  │                           │
  │                           ├──── (N) OrderStatusHistory
  │                           │
  │                           ├──── (1) Address (shipping)
  │                           │
  │                           ├──── (1) PromoCode
  │                           │
  │                           └──── (1) Referral
  │
  ├──── (1) ─────────── (N) SavedOutfit ──────── (N) SavedOutfitItem ──── (1) Product
  │
  ├──── (1) ─────────── (N) Review ──────────── (N) ReviewImage
  │                           │
  │                           └──────────────── (1) Product
  │
  ├──── (1) ─────────── (N) Notification
  │
  ├──── (1) ─────────── (N) Referral (as referrer)
  │
  └──── (1) ─────────── (N) Referral (as referee)


Category (self-referencing for subcategories)
  │
  └──── (1) ─────────── (N) Product
                              │
                              ├──── (N) ProductImage
                              │
                              ├──── (N) ProductVariant
                              │
                              ├──── (N) Review
                              │
                              └──── (N) ProductView


PromoCode (1) ─────────── (N) PromoCodeUsage ──── (1) User
                                         └────── (1) Order

*/

// ==================== DATABASE INDEXES (Recommended) ====================
/*

Performance Indexes:
- products: (category_id), (is_active, is_featured), (slug), (sku)
- orders: (user_id, created_at), (order_number), (status)
- order_items: (order_id), (product_id)
- cart_items: (cart_id), (product_id)
- addresses: (user_id, is_default)
- reviews: (product_id, is_approved), (user_id)
- promo_codes: (code), (is_active, expires_at)
- referrals: (referral_code), (referrer_id), (referee_id)
- product_views: (product_id, created_at)
- notifications: (user_id, is_read, created_at)

Full-Text Search Indexes:
- products: (name_en, name_ar, description_en, description_ar)

*/
