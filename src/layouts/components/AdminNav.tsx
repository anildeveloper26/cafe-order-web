import { NavLink } from 'react-router-dom';
import { BarChart3, ExternalLink, LogOut, QrCode, ReceiptText, UtensilsCrossed } from 'lucide-react';
import { BrandLogo } from '@/components/common/BrandLogo';
import { buttonClasses } from '@/components/ui';
import { cn } from '@/lib/cn';
import { PATHS } from '@/routes/paths';

const NAV = [
  { to: PATHS.admin, label: 'Dashboard', icon: BarChart3, end: true },
  { to: PATHS.adminOrders, label: 'Orders', icon: ReceiptText },
  { to: PATHS.adminMenu, label: 'Menu', icon: UtensilsCrossed },
  { to: PATHS.adminQr, label: 'QR codes', icon: QrCode },
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn('flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition', isActive ? 'bg-brand-700 text-white' : 'text-stone-600 hover:bg-stone-100');

export function AdminNav({ email, onLogout }: { email: string | null; onLogout: () => void }) {
  return (
    <header className="sticky top-0 z-30 border-b border-stone-200 bg-white print:hidden">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
        <span className="flex items-center gap-2 font-bold text-stone-900">
          <BrandLogo size="sm" />
          <span className="hidden sm:inline">Admin</span>
        </span>
        <nav className="flex flex-1 gap-1 overflow-x-auto" aria-label="Admin">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={linkClass}>
              <Icon size={16} /> <span className="hidden sm:inline">{label}</span>
            </NavLink>
          ))}
        </nav>
        <a href={PATHS.menu} target="_blank" rel="noreferrer" className={buttonClasses('ghost', 'md', 'hidden md:inline-flex')}>
          <ExternalLink size={16} /> Customer view
        </a>
        <span className="hidden text-sm text-stone-500 lg:inline">{email}</span>
        <button type="button" onClick={onLogout} className={buttonClasses('ghost', 'icon')} aria-label="Log out">
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
