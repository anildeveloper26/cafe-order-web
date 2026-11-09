const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });

export const formatPrice = (n: number) => inr.format(n);

export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

export const formatShortDate = (iso: string) => new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });

export const pluralize = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;

export const roundMoney = (n: number) => Math.round(n * 100) / 100;

export const digitsOnly = (s: string, max?: number) => {
  const d = s.replace(/\D/g, '');
  return max ? d.slice(0, max) : d;
};
