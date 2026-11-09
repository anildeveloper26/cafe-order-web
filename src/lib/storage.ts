/** JSON helpers over Web Storage that never throw (private mode, quota, bad JSON). */
function make(store: () => Storage) {
  return {
    get<T>(key: string, fallback: T): T {
      try {
        const raw = store().getItem(key);
        return raw === null ? fallback : (JSON.parse(raw) as T);
      } catch {
        return fallback;
      }
    },
    set(key: string, value: unknown) {
      try {
        store().setItem(key, JSON.stringify(value));
      } catch {
        /* ignore */
      }
    },
    remove(key: string) {
      try {
        store().removeItem(key);
      } catch {
        /* ignore */
      }
    },
  };
}

export const local = make(() => window.localStorage);
export const session = make(() => window.sessionStorage);
