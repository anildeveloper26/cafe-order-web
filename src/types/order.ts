import type { ORDER_STATUSES } from '@/constants/orders';

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export interface OrderItem {
  menuItem: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Customer {
  name: string;
  phone: string;
  notes?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customer: Customer;
  tableNumber?: number;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PlaceOrderInput {
  customer: Customer;
  tableNumber?: number;
  items: { menuItem: string; quantity: number }[];
}

export interface OrderFilters {
  phone?: string;
  status?: OrderStatus | '';
  page?: number;
  limit?: number;
}

export interface OrderStatusEvent {
  _id: string;
  orderNumber: string;
  status: OrderStatus;
  updatedAt: string;
}
