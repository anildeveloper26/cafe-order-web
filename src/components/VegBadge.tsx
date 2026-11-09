export function VegBadge({ isVeg }: { isVeg: boolean }) {
  const color = isVeg ? 'border-green-600' : 'border-red-600';
  const dot = isVeg ? 'bg-green-600' : 'bg-red-600';
  return (
    <span className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border-2 bg-white ${color}`} title={isVeg ? 'Veg' : 'Non-veg'}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
    </span>
  );
}
