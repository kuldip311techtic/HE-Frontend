const DEFAULT_API_BASE = "/api";

function isLocalHost(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

/**
 * Normalize API base URLs so local backends are reached through the Vite proxy
 * instead of cross-origin browser requests that trigger CORS failures.
 */
export function resolveApiBaseUrl(configured: string | undefined): string {
  const value = configured?.trim() || DEFAULT_API_BASE;

  if (!value.startsWith("http")) {
    return value;
  }

  try {
    const parsed = new URL(value);

    if (isLocalHost(parsed.hostname)) {
      return parsed.pathname.replace(/\/$/, "") || DEFAULT_API_BASE;
    }
  } catch {
    return DEFAULT_API_BASE;
  }

  return value;
}
