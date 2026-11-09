import { createBrowserRouter, redirect, type LazyRouteFunction, type RouteObject } from 'react-router-dom';
import type { ComponentType } from 'react';
import CustomerLayout from '@/layouts/CustomerLayout';
import MenuPage from '@/pages/customer/MenuPage';
import RouteErrorPage from '@/pages/RouteErrorPage';
import { FullPageSpinner } from '@/components/common/FullPageSpinner';
import RequireAdmin from './guards/RequireAdmin';
import RedirectIfAuthed from './guards/RedirectIfAuthed';
import { PATHS } from './paths';

/** Code-split a page module whose default export is the route component. */
const page =
  (load: () => Promise<{ default: ComponentType }>): LazyRouteFunction<RouteObject> =>
  async () => ({ Component: (await load()).default });

export const routes: RouteObject[] = [
  {
    path: PATHS.root,
    ErrorBoundary: RouteErrorPage,
    HydrateFallback: FullPageSpinner,
    children: [
      { index: true, loader: () => redirect(PATHS.menu) },

      // Customer (no login)
      {
        Component: CustomerLayout,
        children: [
          { path: PATHS.menu, Component: MenuPage },
          { path: PATHS.order, lazy: page(() => import('@/pages/customer/OrderTrackingPage')) },
          { path: PATHS.myOrders, lazy: page(() => import('@/pages/customer/MyOrdersPage')) },
        ],
      },

      // Admin auth
      {
        Component: RedirectIfAuthed,
        children: [{ path: PATHS.adminLogin, lazy: page(() => import('@/pages/admin/LoginPage')) }],
      },

      // Admin (JWT)
      {
        Component: RequireAdmin,
        children: [
          {
            path: PATHS.admin,
            lazy: page(() => import('@/layouts/AdminLayout')),
            children: [
              { index: true, lazy: page(() => import('@/pages/admin/DashboardPage')) },
              { path: PATHS.adminMenu, lazy: page(() => import('@/pages/admin/MenuManagementPage')) },
              { path: PATHS.adminOrders, lazy: page(() => import('@/pages/admin/OrdersBoardPage')) },
              { path: PATHS.adminQr, lazy: page(() => import('@/pages/admin/TableQrPage')) },
            ],
          },
        ],
      },

      { path: PATHS.legacyQr, loader: () => redirect(PATHS.adminQr) },
      { path: '*', lazy: page(() => import('@/pages/customer/NotFoundPage')) },
    ],
  },
];

export const router = createBrowserRouter(routes);
