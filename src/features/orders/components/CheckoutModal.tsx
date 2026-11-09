import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Modal } from '@/components/ui';
import { getErrorMessage } from '@/lib/errors';
import type { CartLine } from '@/features/cart';
import type { Order } from '@/types/order';
import { usePlaceOrder } from '../hooks/usePlaceOrder';
import { CheckoutForm } from './CheckoutForm';
import { saveCustomer } from '../utils/customerStorage';

interface Props {
  open: boolean;
  onClose: () => void;
  lines: CartLine[];
  total: number;
  tableNumber: number | null;
  onPlaced: (order: Order) => void;
  orderPath: (id: string) => string;
}

export function CheckoutModal({ open, onClose, lines, total, tableNumber, onPlaced, orderPath }: Props) {
  const navigate = useNavigate();
  const placeOrder = usePlaceOrder();

  return (
    <Modal open={open} onClose={onClose} title="Checkout">
      {/* keyed by open so the form resets each time it opens */}
      <CheckoutForm
        key={String(open)}
        lines={lines.map((l) => ({ key: l.item._id, name: l.item.name, quantity: l.quantity, amount: l.item.price * l.quantity }))}
        items={lines.map((l) => ({ menuItem: l.item._id, quantity: l.quantity }))}
        total={total}
        tableNumber={tableNumber}
        submitting={placeOrder.isPending}
        serverError={placeOrder.error}
        onSubmit={(input) =>
          placeOrder.mutate(input, {
            onSuccess: (order) => {
              saveCustomer({ name: input.customer.name, phone: input.customer.phone });
              onPlaced(order);
              toast.success(`Order ${order.orderNumber} placed!`);
              navigate(orderPath(order._id));
            },
            onError: (err) => toast.error(getErrorMessage(err)),
          })
        }
      />
    </Modal>
  );
}
