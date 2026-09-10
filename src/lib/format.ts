export const SEARCH_DEBOUNCE_MS = 300;
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  return new Intl.NumberFormat().format(value);
}

export function formatWholeDollars(value: number): string {
  return `$${new Intl.NumberFormat().format(value)}`;
}

export function formatMoneyAmount(amount: string | number, currency?: string | null): string {
  const numeric = typeof amount === 'number' ? amount : Number(amount);
  const formatted = Number.isNaN(numeric)
    ? String(amount)
    : new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(numeric);
  if (!currency) return formatted;
  return `${formatted} ${currency}`;
}

export function displayText(value: string | null | undefined): string {
  if (value === null || value === undefined || value.trim() === '') return '—';
  return value;
}

export function formatUserRole(role: string | null | undefined): string {
  if (!role) return '—';
  if (role === 'org_admin') return 'Organization Admin';
  if (role === 'super_admin') return 'Super Admin';
  return role
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
