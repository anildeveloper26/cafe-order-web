export const STORAGE_KEYS = {
  cart: 'cafe-cart',
  table: 'cafe-table',
  auth: 'cafe-admin',
  customer: 'cafe-customer',
  welcomeSeen: (table: number) => `cafe-welcome-${table}`,
} as const;
