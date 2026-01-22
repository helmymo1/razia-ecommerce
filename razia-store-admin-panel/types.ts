
export enum OrderStatus {
  PENDING = 'Pending',
  PROCESSING = 'Processing',
  SHIPPED = 'Shipped',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled',
  REFUNDED = 'Refunded'
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface Category {
  id: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  image: string;
}

export interface Product {
  id: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  price: number;
  discount: number;
  categoryId: string;
  colors: string[];
  sizes: string[];
  images: string[];
  stock: number;
}

export interface Order {
  id: string;
  userId: string;
  userPhone?: string;
  items: { 
    productId: string; 
    quantity: number; 
    price: number; 
    color: string; 
    size?: string;
    nameEn: string;
  }[];
  total: number;
  status: OrderStatus;
  shippingAddress: string;
  paymentMethod: string;
  createdAt: string;
  trackingNumber?: string;
}

export interface RefundRequest {
  id: string;
  orderId: string;
  itemId?: string;
  userId: string;
  userPhone?: string;
  reason: string;
  pickupTime: string;
  address: string;
  status: 'pending' | 'accepted' | 'rejected';
  adminNote?: string;
}

export interface PromoCode {
  id: string;
  code: string;
  discount: number;
  type: 'fixed' | 'percentage';
  startDate: string;
  endDate: string;
  active: boolean;
}
