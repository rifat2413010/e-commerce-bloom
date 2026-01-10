export interface Product {
  id: string;
  name: string;
  nameEn?: string;
  description: string;
  descriptionEn?: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  categoryId: string;
  stock: number;
  unit: string;
  isOffer?: boolean;
  offerPercent?: number;
  isBestSeller?: boolean;
  isActive: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  nameEn: string;
  image: string;
  description?: string;
  parentId?: string;
  isActive: boolean;
  order: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  customer: CustomerInfo;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: 'cod';
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  district?: string;
  notes?: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface SiteSettings {
  siteName: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  facebookPixel?: string;
  googleAnalytics?: string;
  footerText?: string;
  deliveryCharge: number;
  freeDeliveryMin: number;
}
