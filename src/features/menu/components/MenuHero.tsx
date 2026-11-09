export function MenuHero({ tableNumber }: { tableNumber: number | null }) {
  return (
    <section className="bg-gradient-to-br from-brand-700 via-brand-600 to-amber-700 text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
        <p className="text-sm font-medium text-brand-100">{tableNumber ? `Welcome, Table ${tableNumber}` : 'Welcome'}</p>
        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">What would you like today?</h1>
        <p className="mt-2 max-w-xl text-sm text-brand-100">Browse the menu, add items to your cart and order straight from your table — no login needed.</p>
      </div>
    </section>
  );
}
