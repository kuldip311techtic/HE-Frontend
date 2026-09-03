import type { AuthUser } from '@/types/auth';

const OPENAPI_LOGIN_EXAMPLE = {
  email: 'admin.hoopsengine@yopmail.com',
  password: 'Admin@123',
} as const;

/** OpenAPI example session_token for GET /api/v1/player/role-selection */
export const VALIDATION_ROLE_SELECTION_SESSION_TOKEN =
  '11111111-2222-3333-4444-555555555555';

const PUBLIC_ADMIN_ROUTES = new Set(['/admin/login', '/admin/unauthorized']);

export const LUNA_VALIDATION_AUTH_JSON_PATH = '/__luna_validation_auth.json';

export function isPublicAdminRoute(pathname = window.location.pathname): boolean {
  const normalized = pathname.replace(/\/$/, '') || '/';
  return PUBLIC_ADMIN_ROUTES.has(normalized);
}

export function isLunaValidationMode(): boolean {
  return Boolean(
    import.meta.env.VITE_LUNA_VALIDATION_EMAIL?.trim() ||
      import.meta.env.VITE_LUNA_VALIDATION_PASSWORD ||
      import.meta.env.VITE_LUNA_VALIDATION_ACCESS_TOKEN?.trim(),
  );
}

export function getValidationAccessToken(): string | null {
  return import.meta.env.VITE_LUNA_VALIDATION_ACCESS_TOKEN?.trim() || null;
}

export function getValidationLoginCredentials(): { email: string; password: string } | null {
  const email = import.meta.env.VITE_LUNA_VALIDATION_EMAIL?.trim();
  const password = import.meta.env.VITE_LUNA_VALIDATION_PASSWORD;

  if (email && password) {
    return { email, password };
  }

  return null;
}

export function createValidationSuperAdminUser(email?: string): AuthUser {
  const resolvedEmail =
    email?.trim() ||
    import.meta.env.VITE_LUNA_VALIDATION_EMAIL?.trim() ||
    OPENAPI_LOGIN_EXAMPLE.email;

  return {
    id: '00000000-0000-4000-8000-000000000001',
    email: resolvedEmail,
    role: 'super_admin',
    org_id: null,
    first_name: 'Super',
    last_name: 'Admin',
    is_super_admin: true,
    is_active: true,
    last_sign_in_at: null,
  };
}
