
export enum RefundStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  CANCELLED = 'CANCELLED'
}

export interface ProductDetails {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
}

export interface RefundRequest {
  id: string;
  customerName: string;
  customerEmail: string;
  phone: string;
  address: string;
  reason: string;
  pickupTime: string;
  requestedAt: string;
  status: RefundStatus;
  product: ProductDetails;
}

export interface DashboardStats {
  total: number;
  pending: number;
  approved: number;
  cancelled: number;
}
