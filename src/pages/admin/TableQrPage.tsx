import { Printer } from 'lucide-react';
import { Button, FormField, Input, PageHeader } from '@/components/ui';
import { TableQrCard } from '@/features/qr';
import { isPositiveInt } from '@/constants/guards';
import { useUrlState } from '@/hooks/useUrlState';
import { PUBLIC_URL } from '@/lib/env';
import { menuPath } from '@/routes/paths';

const MAX_TABLES = 50;
const URL_DEFAULTS = { tables: '6' };
const URL_VALIDATORS = { tables: (v: string) => isPositiveInt(v) && Number(v) <= MAX_TABLES };

export default function TableQrPage() {
  const [url, setUrl] = useUrlState(URL_DEFAULTS, URL_VALIDATORS);
  const count = Number(url.tables);

  return (
    <div className="space-y-8">
      <div className="print:hidden">
        <PageHeader
          title="Table QR codes"
          description="Customers scan these to open the menu for their table and order without logging in."
          actions={
            <>
              <div className="w-28">
                <FormField label="Tables" htmlFor="qr-count">
                  <Input
                    id="qr-count"
                    type="number"
                    min={1}
                    max={MAX_TABLES}
                    value={count}
                    onChange={(e) => setUrl({ tables: String(Math.min(Math.max(Number(e.target.value) || 1, 1), MAX_TABLES)) })}
                  />
                </FormField>
              </div>
              <Button className="mt-6 h-[42px]" onClick={() => window.print()} icon={<Printer size={16} />}>
                Print
              </Button>
            </>
          }
        />
      </div>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
        {Array.from({ length: count }, (_, i) => i + 1).map((t) => (
          <TableQrCard key={t} tableNumber={t} url={`${PUBLIC_URL}${menuPath({ table: t })}`} />
        ))}
      </div>
    </div>
  );
}
