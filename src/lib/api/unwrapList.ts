export function unwrapItems<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (!data || typeof data !== 'object') return [];

  const record = data as Record<string, unknown>;
  for (const key of ['items', 'data', 'results'] as const) {
    const value = record[key];
    if (Array.isArray(value)) return value as T[];
  }
  return [];
}
