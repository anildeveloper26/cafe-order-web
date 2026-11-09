import { Link } from 'react-router-dom';
import { BrandLogo } from '@/components/common/BrandLogo';
import { buttonClasses } from '@/components/ui';
import { CartButton } from '@/features/cart';
import { menuPath, PATHS } from '@/routes/paths';

export function CustomerHeader({ tableNumber }: { tableNumber: number | null }) {
  return (
    <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to={menuPath({ table: tableNumber })} className="flex items-center gap-2.5">
          <BrandLogo />
          <span className="leading-tight">
            <span className="block font-bold text-stone-900">Brew &amp; Bite</span>
            <span className="block text-xs text-stone-500">{tableNumber ? `Table ${tableNumber}` : 'Cafe'}</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          <Link to={PATHS.myOrders} className={buttonClasses('ghost', 'md', 'hidden sm:inline-flex')}>
            My orders
          </Link>
          <CartButton />
        </nav>
      </div>
    </header>
  );
}
