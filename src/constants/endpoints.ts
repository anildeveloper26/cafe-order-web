/** REST endpoints, relative to VITE_API_URL. */
export const ENDPOINTS = {
  menu: '/menu',
  menuItem: (id: string) => `/menu/${encodeURIComponent(id)}`,
  orders: '/orders',
  order: (id: string) => `/orders/${encodeURIComponent(id)}`,
  orderStatus: (id: string) => `/orders/${encodeURIComponent(id)}/status`,
  orderStats: '/orders/stats',
  login: '/auth/login',
} as const;
