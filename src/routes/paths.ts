/** Single source of truth for every route string in the app. */
export const PATHS = {
  root: '/',
  menu: '/menu',
  order: '/order/:id',
  myOrders: '/my-orders',
  admin: '/admin',
  adminLogin: '/admin/login',
  adminMenu: '/admin/menu',
  adminOrders: '/admin/orders',
  adminQr: '/admin/qr',
  legacyQr: '/qr',
} as const;

export const orderPath = (id: string) => `/order/${encodeURIComponent(id)}`;

export const menuPath = (params: { table?: number | null } = {}) =>
  params.table ? `${PATHS.menu}?table=${params.table}` : PATHS.menu;
