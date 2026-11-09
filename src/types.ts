export const CATEGORIES = ['coffee', 'tea', 'beverages', 'snacks', 'meals', 'desserts'] as const;
export type Category = (typeof CATEGORIES)[number];

export const ORDER_STATUSES = ['pending', 'preparing', 'ready', 'completed', 'cancelled'] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type SortOption = 'name' | 'price_asc' | 'price_desc' | 'newest';

export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  category: Category;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
  isVeg: boolean;
  createdAt: string;
  updatedAt: string;
}

export type MenuItemInput = Omit<MenuItem, '_id' | 'createdAt' | 'updatedAt'>;

export interface OrderItem {
  menuItem: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customer: { name: string; phone: string; notes?: string };
  tableNumber?: number;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  pagination?: Pagination;
}

export interface OrderStats {
  totals: { revenue: number; orders: number; avgOrder: number };
  byStatus: { status: OrderStatus; count: number }[];
  revenueByDay: { date: string; revenue: number; orders: number }[];
  topItems: { menuItem: string; name: string; quantity: number; revenue: number }[];
}
