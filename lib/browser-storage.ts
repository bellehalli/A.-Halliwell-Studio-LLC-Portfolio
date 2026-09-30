type Store = "local" | "session";
const storage = (kind: Store) => kind === "local" ? window.localStorage : window.sessionStorage;

export function readStorage(kind: Store, key: string): string | null {
  try { return storage(kind).getItem(key); } catch { return null; }
}
export function writeStorage(kind: Store, key: string, value: string): boolean {
  try { storage(kind).setItem(key, value); return true; } catch { return false; }
}
export function removeStorage(kind: Store, key: string): boolean {
  try { storage(kind).removeItem(key); return true; } catch { return false; }
}
