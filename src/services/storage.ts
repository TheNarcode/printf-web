import type { UserProfile, ThemeMode, Order } from '../types';

const KEYS = {
  AUTH_USER: 'printf_auth_user',
  AUTH_ID_TOKEN: 'printf_auth_id_token',
  THEME_MODE: 'printf_theme_mode',
  ORDERS: 'printf_orders',
} as const;

function safeGet(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}
function safeSet(key: string, value: string): void {
  try { localStorage.setItem(key, value); } catch {}
}
function safeRemove(key: string): void {
  try { localStorage.removeItem(key); } catch {}
}

export function getStoredUser(): UserProfile | null {
  const json = safeGet(KEYS.AUTH_USER);
  return json ? JSON.parse(json) : null;
}

export function setStoredUser(user: UserProfile | null): void {
  if (user) safeSet(KEYS.AUTH_USER, JSON.stringify(user));
  else safeRemove(KEYS.AUTH_USER);
}

export function getStoredIdToken(): string | null {
  return safeGet(KEYS.AUTH_ID_TOKEN);
}

export function setStoredIdToken(token: string | null): void {
  if (token) safeSet(KEYS.AUTH_ID_TOKEN, token);
  else safeRemove(KEYS.AUTH_ID_TOKEN);
}

export function getStoredThemeMode(): ThemeMode | null {
  return safeGet(KEYS.THEME_MODE) as ThemeMode | null;
}

export function setStoredThemeMode(mode: ThemeMode): void {
  safeSet(KEYS.THEME_MODE, mode);
}

export function getStoredOrders(): Order[] {
  const json = safeGet(KEYS.ORDERS);
  return json ? JSON.parse(json) : [];
}

export function setStoredOrders(orders: Order[]): void {
  safeSet(KEYS.ORDERS, JSON.stringify(orders));
}

export function clearAllStorage(): void {
  try {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
  } catch {}
}
