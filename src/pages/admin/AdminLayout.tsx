import { NavLink, Navigate, Outlet, useLocation } from 'react-router-dom';
import { BarChart3, Coffee, ExternalLink, LogOut, QrCode, ReceiptText, UtensilsCrossed } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: BarChart3, end: true },
  { to: '/admin/orders', label: 'Orders', icon: ReceiptText },
  { to: '/admin/menu', label: 'Menu', icon: UtensilsCrossed },
];

export default function AdminLayout() {
  const { token, email, logout } = useAuthStore();
  const location = useLocation();
  if (!token) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-brand-700 text-white' : 'text-stone-600 hover:bg-stone-100'}`;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-stone-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
          <span className="flex items-center gap-2 font-bold text-stone-900">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-700 text-white"><Coffee size={16} /></span>
            <span className="hidden sm:inline">Admin</span>
          </span>
          <nav className="flex flex-1 gap-1 overflow-x-auto">
            {NAV.map(({ to, label, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end} className={linkClass}>
                <Icon size={16} /> <span className="hidden sm:inline">{label}</span>
              </NavLink>
            ))}
            <NavLink to="/qr" className={linkClass}><QrCode size={16} /> <span className="hidden sm:inline">QR codes</span></NavLink>
          </nav>
          <a href="/menu" target="_blank" rel="noreferrer" className="btn-ghost hidden md:inline-flex"><ExternalLink size={16} /> Customer view</a>
          <span className="hidden text-sm text-stone-500 lg:inline">{email}</span>
          <button type="button" onClick={logout} className="btn-ghost" aria-label="Log out"><LogOut size={16} /></button>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
