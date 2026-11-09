import { QrCode } from 'lucide-react';
import { Button, Modal } from '@/components/ui';

export function WelcomeTableModal({ open, tableNumber, onClose }: { open: boolean; tableNumber: number | null; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title={`Table ${tableNumber ?? ''}`}>
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
          <QrCode size={28} />
        </div>
        <h3 className="mt-3 text-lg font-bold text-stone-900">Welcome to Brew &amp; Bite!</h3>
        <ol className="mx-auto mt-3 max-w-xs space-y-1.5 text-left text-sm text-stone-600">
          <li>1. Pick your favourites from the menu</li>
          <li>2. Enter your mobile number at checkout</li>
          <li>3. We bring your order to Table {tableNumber}</li>
        </ol>
        <Button size="lg" fullWidth className="mt-5" onClick={onClose}>
          View menu
        </Button>
      </div>
    </Modal>
  );
}
