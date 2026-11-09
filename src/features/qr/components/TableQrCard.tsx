import { QRCodeSVG } from 'qrcode.react';

export function TableQrCard({ tableNumber, url }: { tableNumber: number; url: string }) {
  return (
    <div className="flex break-inside-avoid flex-col items-center rounded-2xl border-2 border-dashed border-stone-300 p-5 text-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-brand-700">Brew &amp; Bite</p>
      <p className="text-2xl font-bold text-stone-900">Table {tableNumber}</p>
      <a href={url} target="_blank" rel="noreferrer" className="mt-3" aria-label={`Open menu for table ${tableNumber}`}>
        <QRCodeSVG value={url} size={148} level="M" fgColor="#431407" />
      </a>
      <p className="mt-3 text-sm text-stone-500">Scan to view menu &amp; order</p>
    </div>
  );
}
