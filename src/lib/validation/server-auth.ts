import type { AuthUser } from '@/types/auth';
import { LUNA_VALIDATION_AUTH_JSON_PATH } from '@/lib/validation/config';

interface ServerValidationAuthResponse {
  access_token: string;
  user: AuthUser;
}

let serverAuthPromise: Promise<ServerValidationAuthResponse | null> | null = null;

async function fetchServerValidationAuthOnce(): Promise<ServerValidationAuthResponse | null> {
  try {
    const response = await fetch(LUNA_VALIDATION_AUTH_JSON_PATH, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const body = (await response.json()) as Partial<ServerValidationAuthResponse> | null;
    if (!body?.access_token || !body.user) {
      return null;
    }

    return body as ServerValidationAuthResponse;
  } catch {
    return null;
  }
}

/** Poll the Vite dev-server auth endpoint until Luna validation login succeeds or times out. */
export async function waitForServerValidationAuth(
  maxAttempts = 120,
  intervalMs = 500,
): Promise<ServerValidationAuthResponse | null> {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const payload = await fetchServerValidationAuthOnce();
    if (payload) {
      return payload;
    }

    await new Promise((resolve) => {
      setTimeout(resolve, intervalMs);
    });
  }

  return null;
}

export function getServerValidationAuth(): Promise<ServerValidationAuthResponse | null> {
  if (!serverAuthPromise) {
    serverAuthPromise = waitForServerValidationAuth();
  }
  return serverAuthPromise;
}

export function resetServerValidationAuthCache(): void {
  serverAuthPromise = null;
}
