import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { IconButton } from './Modal';
import { useEscape, useLockBodyScroll } from './overlay';

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}

/** Right-side panel; full width on mobile. */
export function Drawer({ open, onClose, title, subtitle, footer, children }: Props) {
  useEscape(open, onClose);
  useLockBodyScroll(open);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40" role="dialog" aria-modal="true" aria-label={title}>
      <div className="animate-fade-in absolute inset-0 bg-stone-900/40" onClick={onClose} />
      <aside className="animate-slide-in absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-stone-100 px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-stone-900">{title}</h2>
            {subtitle && <p className="text-xs text-stone-500">{subtitle}</p>}
          </div>
          <IconButton label={`Close ${title.toLowerCase()}`} onClick={onClose}>
            <X size={20} />
          </IconButton>
        </header>
        <div className="flex flex-1 flex-col overflow-y-auto">{children}</div>
        {footer && <footer className="space-y-3 border-t border-stone-100 bg-stone-50 px-5 py-4">{footer}</footer>}
      </aside>
    </div>
  );
}
