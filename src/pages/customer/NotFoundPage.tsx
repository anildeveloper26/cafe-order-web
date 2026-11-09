import { Link } from 'react-router-dom';
import { buttonClasses } from '@/components/ui';
import { PATHS } from '@/routes/paths';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <p className="text-6xl">☕</p>
      <h1 className="mt-4 text-2xl font-bold text-stone-900">Page not found</h1>
      <p className="mt-1 text-stone-500">This page doesn't exist.</p>
      <Link to={PATHS.menu} className={buttonClasses('primary', 'md', 'mt-6')}>
        Go to menu
      </Link>
    </div>
  );
}
