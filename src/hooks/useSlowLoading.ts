import { useEffect, useState } from 'react';

/** True once `active` has been true for longer than `ms` (e.g. Render cold start). */
export function useSlowLoading(active: boolean, ms = 4000) {
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setSlow(true), ms);
    return () => {
      clearTimeout(t);
      setSlow(false);
    };
  }, [active, ms]);
  return active && slow;
}
