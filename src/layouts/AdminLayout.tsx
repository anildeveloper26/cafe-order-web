import { Outlet, ScrollRestoration } from 'react-router-dom';
import { useAuthStore, useLogout } from '@/features/auth';
import { useAdminOrderFeed } from '@/features/orders';
import { AdminNav } from './components/AdminNav';

export default function AdminLayout() {
  const token = useAuthStore((s) => s.token);
  const email = useAuthStore((s) => s.email);
  const logout = useLogout();
  useAdminOrderFeed(token); // live new orders + status changes on every admin page

  return (
    <div className="min-h-screen">
      <AdminNav email={email} onLogout={logout} />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <Outlet />
      </main>
      <ScrollRestoration />
    </div>
  );
}
