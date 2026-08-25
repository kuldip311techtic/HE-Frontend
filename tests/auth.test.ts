import { afterEach, describe, expect, it } from 'vitest';
import {
  AUTH_ROLE_STORAGE_KEY,
  AUTH_TOKEN_STORAGE_KEY,
  clearAuth,
  hasAdminAccess,
  isAuthenticated,
  persistSession,
} from '../src/lib/auth/session';
import { isAdminRole } from '../src/types/auth';
import type { LoginResponse } from '../src/types/api';

const memory = new Map<string, string>();

const localStorageMock: Storage = {
  get length() {
    return memory.size;
  },
  clear: () => memory.clear(),
  getItem: (key: string) => memory.get(key) ?? null,
  key: (index: number) => Array.from(memory.keys())[index] ?? null,
  removeItem: (key: string) => {
    memory.delete(key);
  },
  setItem: (key: string, value: string) => {
    memory.set(key, value);
  },
};

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  configurable: true,
});

const loginResponse: LoginResponse = {
  success: true,
  message: 'Authenticated',
  description: 'Login successful',
  token: 'jwt-token',
  email: 'admin@example.com',
  data: {
    token: 'jwt-token',
    token_type: 'bearer',
    expires_in: 3600,
    email: 'admin@example.com',
  },
};

afterEach(() => {
  memory.clear();
});

describe('auth session', () => {
  it('persists the token, email, and super admin role', () => {
    persistSession(loginResponse);

    expect(localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)).toBe('jwt-token');
    expect(isAuthenticated()).toBe(true);
    expect(hasAdminAccess()).toBe(true);
    expect(localStorage.getItem(AUTH_ROLE_STORAGE_KEY)).toBe('super_admin');
  });

  it('clears the stored session', () => {
    persistSession(loginResponse);
    clearAuth();

    expect(isAuthenticated()).toBe(false);
    expect(hasAdminAccess()).toBe(false);
  });

  it('rejects non-admin roles', () => {
    persistSession(loginResponse);
    localStorage.setItem(AUTH_ROLE_STORAGE_KEY, 'player');

    expect(isAuthenticated()).toBe(true);
    expect(hasAdminAccess()).toBe(false);
  });
});

describe('admin roles', () => {
  it('accepts admin equivalents', () => {
    expect(isAdminRole('Admin')).toBe(true);
    expect(isAdminRole('super admin')).toBe(true);
    expect(isAdminRole('super-admin')).toBe(true);
    expect(isAdminRole('player')).toBe(false);
  });
});
