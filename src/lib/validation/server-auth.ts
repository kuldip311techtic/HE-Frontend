import type { AuthUser } from '@/types/auth';
import {
  LUNA_VALIDATION_AUTH_JSON_PATH,
  VALIDATION_AUTH_HYDRATION_MAX_ATTEMPTS,
  VALIDATION_AUTH_MAX_ATTEMPTS,
  VALIDATION_AUTH_POLL_INTERVAL_MS,
} from '@/lib/validation/config';

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

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/** Poll the Vite dev-server auth endpoint until Luna validation login succeeds or times out. */
export async function waitForServerValidationAuth(
  maxAttempts = VALIDATION_AUTH_MAX_ATTEMPTS,
  intervalMs = VALIDATION_AUTH_POLL_INTERVAL_MS,
): Promise<ServerValidationAuthResponse | null> {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const payload = await fetchServerValidationAuthOnce();
    if (payload) {
      return payload;
    }

    if (attempt < maxAttempts - 1) {
      await sleep(intervalMs);
    }
  }

  return null;
}

/** Short poll used during initial session hydration so protected routes render promptly. */
export function waitForServerValidationAuthDuringHydration(): Promise<ServerValidationAuthResponse | null> {
  return waitForServerValidationAuth(
    VALIDATION_AUTH_HYDRATION_MAX_ATTEMPTS,
    VALIDATION_AUTH_POLL_INTERVAL_MS,
  );
}

export function getServerValidationAuth(): Promise<ServerValidationAuthResponse | null> {
  if (!serverAuthPromise) {
    serverAuthPromise = waitForServerValidationAuth();
  }
  return serverAuthPromise;
}

/**
 * Continue polling after hydration when the Vite plugin has not yet populated authPayload.
 * Invokes the callback once a token is available.
 */
export function watchServerValidationAuth(
  onAuthenticated: (payload: ServerValidationAuthResponse) => void,
  options?: { startAttempt?: number },
): () => void {
  let cancelled = false;
  const startAttempt = options?.startAttempt ?? VALIDATION_AUTH_HYDRATION_MAX_ATTEMPTS;

  void (async () => {
    for (let attempt = startAttempt; attempt < VALIDATION_AUTH_MAX_ATTEMPTS; attempt += 1) {
      if (cancelled) {
        return;
      }

      const payload = await fetchServerValidationAuthOnce();
      if (payload) {
        if (!cancelled) {
          onAuthenticated(payload);
        }
        return;
      }

      if (attempt < VALIDATION_AUTH_MAX_ATTEMPTS - 1) {
        await sleep(VALIDATION_AUTH_POLL_INTERVAL_MS);
      }
    }
  })();

  return () => {
    cancelled = true;
  };
}

export function resetServerValidationAuthCache(): void {
  serverAuthPromise = null;
}
