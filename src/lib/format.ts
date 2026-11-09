const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });

export const formatPrice = (n: number) => inr.format(n);

export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const PHONE_REGEX = /^[6-9]\d{9}$/;
