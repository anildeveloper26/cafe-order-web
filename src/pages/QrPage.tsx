import { useState } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Printer } from 'lucide-react';
import { PUBLIC_URL } from '../lib/env';

export default function QrPage() {
  const [count, setCount] = useState(6);
  const tables = Array.from({ length: Math.min(Math.max(count, 1), 50) }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4 print:hidden">
          <div>
            <Link to="/admin" className="text-sm text-brand-700 hover:underline">← Admin</Link>
            <h1 className="mt-1 text-2xl font-bold text-stone-900">Table QR codes</h1>
            <p className="text-sm text-stone-500">Customers scan these to open the menu for their table and order without logging in.</p>
          </div>
          <div className="flex items-end gap-2">
            <label className="w-28">
              <span className="label">Tables</span>
              <input type="number" min={1} max={50} value={count} onChange={(e) => setCount(Number(e.target.value))} className="input" />
            </label>
            <button type="button" onClick={() => window.print()} className="btn-primary h-[42px]"><Printer size={16} /> Print</button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3">
          {tables.map((t) => {
            const url = `${PUBLIC_URL}/menu?table=${t}`;
            return (
              <div key={t} className="flex break-inside-avoid flex-col items-center rounded-2xl border-2 border-dashed border-stone-300 p-5 text-center">
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-700">Brew &amp; Bite</p>
                <p className="text-2xl font-bold text-stone-900">Table {t}</p>
                <a href={url} target="_blank" rel="noreferrer" className="mt-3" aria-label={`Open menu for table ${t}`}>
                  <QRCodeSVG value={url} size={148} level="M" fgColor="#431407" />
                </a>
                <p className="mt-3 text-sm text-stone-500">Scan to view menu &amp; order</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
