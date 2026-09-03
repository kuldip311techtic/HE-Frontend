import type { Plugin, ViteDevServer } from 'vite';

const AUTH_JSON_PATH = '/__luna_validation_auth.json';

interface ValidationAuthPayload {
  access_token: string;
  user: {
    id: string;
    email: string;
    role: string;
    org_id: string | null;
    first_name: string | null;
    last_name: string | null;
    is_super_admin: boolean;
    is_active: boolean;
    last_sign_in_at: string | null;
  };
}

interface ValidationAuthConfig {
  email: string;
  password: string;
  accessToken: string;
  apiBaseUrl: string;
}

function readValidationConfig(env: Record<string, string>): ValidationAuthConfig {
  return {
    email: env.VITE_LUNA_VALIDATION_EMAIL || process.env.LUNA_VALIDATION_EMAIL || '',
    password: env.VITE_LUNA_VALIDATION_PASSWORD || process.env.LUNA_VALIDATION_PASSWORD || '',
    accessToken:
      env.VITE_LUNA_VALIDATION_ACCESS_TOKEN || process.env.LUNA_VALIDATION_ACCESS_TOKEN || '',
    apiBaseUrl: (process.env.LUNA_VALIDATION_API_PROXY_TARGET || 'http://localhost:3300').replace(
      /\/$/,
      '',
    ),
  };
}

function isValidationConfigured(config: ValidationAuthConfig): boolean {
  return Boolean(config.accessToken || (config.email && config.password));
}

async function loginForValidation(config: ValidationAuthConfig): Promise<ValidationAuthPayload | null> {
  if (config.accessToken) {
    return {
      access_token: config.accessToken,
      user: {
        id: '00000000-0000-4000-8000-000000000001',
        email: config.email || 'admin.hoopsengine@yopmail.com',
        role: 'super_admin',
        org_id: null,
        first_name: 'Super',
        last_name: 'Admin',
        is_super_admin: true,
        is_active: true,
        last_sign_in_at: null,
      },
    };
  }

  if (!config.email || !config.password) {
    return null;
  }

  try {
    const response = await fetch(`${config.apiBaseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: config.email, password: config.password }),
      signal: AbortSignal.timeout(8_000),
    });

    if (!response.ok) {
      return null;
    }

    const body = (await response.json()) as ValidationAuthPayload;
    if (!body.access_token || !body.user) {
      return null;
    }

    return body;
  } catch {
    return null;
  }
}

function startAuthPolling(
  config: ValidationAuthConfig,
  onResolved: (payload: ValidationAuthPayload) => void,
): void {
  if (config.accessToken) {
    void loginForValidation(config).then((payload) => {
      if (payload) {
        onResolved(payload);
      }
    });
    return;
  }

  let attempts = 0;
  const maxAttempts = 120;

  const poll = async (): Promise<void> => {
    attempts += 1;
    const payload = await loginForValidation(config);
    if (payload) {
      onResolved(payload);
      return;
    }

    if (attempts < maxAttempts) {
      setTimeout(() => {
        void poll();
      }, 500);
    }
  };

  void poll();
}

export function lunaValidationAuthPlugin(env: Record<string, string>): Plugin {
  const config = readValidationConfig(env);
  let authPayload: ValidationAuthPayload | null = null;

  return {
    name: 'luna-validation-auth',
    configureServer(server: ViteDevServer) {
      if (!isValidationConfigured(config)) {
        return;
      }

      server.middlewares.use((req, res, next) => {
        if (req.url?.split('?')[0] === AUTH_JSON_PATH) {
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Cache-Control', 'no-store');
          res.end(JSON.stringify(authPayload));
          return;
        }
        next();
      });

      startAuthPolling(config, (payload) => {
        authPayload = payload;
        server.config.logger.info('[luna-validation-auth] Super admin session ready');
      });
    },
  };
}
