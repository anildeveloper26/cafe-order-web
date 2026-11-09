import type { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui';

export function StatCard({ label, value, icon: Icon }: { label: string; value: string; icon: LucideIcon }) {
  return (
    <Card className="flex items-center gap-4 p-5">
      <span className="rounded-xl bg-brand-50 p-3 text-brand-700">
        <Icon size={22} />
      </span>
      <div>
        <p className="text-sm text-stone-500">{label}</p>
        <p className="text-2xl font-bold tabular-nums text-stone-900">{value}</p>
      </div>
    </Card>
  );
}
