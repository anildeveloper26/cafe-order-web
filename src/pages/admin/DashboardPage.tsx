import { IndianRupee, ReceiptText, TrendingUp } from 'lucide-react';
import { CenteredSpinner, ErrorState, PageHeader } from '@/components/ui';
import { RevenueChart, StatCard, StatusBreakdown, TopItemsTable, useOrderStats } from '@/features/dashboard';
import { getErrorMessage } from '@/lib/errors';
import { formatPrice } from '@/lib/format';

export default function DashboardPage() {
  const stats = useOrderStats();
  if (stats.isError && !stats.data) return <ErrorState message={getErrorMessage(stats.error)} onRetry={() => stats.refetch()} />;
  if (!stats.data) return <CenteredSpinner />;
  const { totals, revenueByDay, byStatus, topItems } = stats.data;

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Revenue" value={formatPrice(totals.revenue)} icon={IndianRupee} />
        <StatCard label="Orders" value={String(totals.orders)} icon={ReceiptText} />
        <StatCard label="Avg. order" value={formatPrice(Math.round(totals.avgOrder ?? 0))} icon={TrendingUp} />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <RevenueChart data={revenueByDay} />
        <StatusBreakdown data={byStatus} />
      </div>
      <TopItemsTable data={topItems} />
    </div>
  );
}
