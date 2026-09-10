const DEFAULT_BASE = 'http://localhost:3300/api';

export function getApiBaseUrl(): string {
  return import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE;
}

export function resolveUrl(relativePath: string, baseUrl = getApiBaseUrl()): string {
  const normalizedPath = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;

  if (normalizedPath.startsWith('/api')) {
    const hostRoot = baseUrl.replace(/\/api\/?$/, '');
    return `${hostRoot}${normalizedPath}`;
  }

  const hostRoot = baseUrl.replace(/\/api\/?$/, '');
  return `${hostRoot}${normalizedPath}`;
}
