import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import MenuPage from './pages/MenuPage';
import OrderSuccess from './pages/OrderSuccess';
import MyOrders from './pages/MyOrders';
import NotFound from './pages/NotFound';
import { Spinner } from './components/States';

// Admin + QR pages are code-split so customers only download the menu bundle.
const QrPage = lazy(() => import('./pages/QrPage'));
const Login = lazy(() => import('./pages/admin/Login'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const MenuAdmin = lazy(() => import('./pages/admin/MenuAdmin'));
const OrdersAdmin = lazy(() => import('./pages/admin/OrdersAdmin'));

const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center text-brand-700">
    <Spinner className="h-8 w-8" />
  </div>
);

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Navigate to="/menu" replace />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/order/:id" element={<OrderSuccess />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/qr" element={<QrPage />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="menu" element={<MenuAdmin />} />
          <Route path="orders" element={<OrdersAdmin />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
