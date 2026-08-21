export function formatCount(value: number): string {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(
    value,
  );
}

export function formatRevenue(value: number, currency: string | null): string {
  if (currency) {
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency,
      }).format(value);
    } catch {
      return new Intl.NumberFormat(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(value);
    }
  }

  return new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function escapeCsvValue(value: string): string {
  if (!/[",\n]/.test(value)) {
    return value;
  }
  return `"${value.replaceAll('"', '""')}"`;
}
