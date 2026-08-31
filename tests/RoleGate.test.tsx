import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RoleGate } from '@/components/RoleGate';
import { AuthProvider } from '@/context/AuthProvider';
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from '@/lib/utils';
import type { AuthUser } from '@/types';

function renderWithAuth(user: AuthUser | null, token: string | null) {
  if (user && token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  }

  return render(
    <AuthProvider>
      <RoleGate>
        <div>Protected content</div>
      </RoleGate>
    </AuthProvider>,
  );
}

describe('RoleGate', () => {
  it('renders protected content for super_admin users', async () => {
    renderWithAuth(
      {
        id: '1',
        email: 'admin@example.com',
        name: 'Admin',
        role: 'super_admin',
      },
      'test-token',
    );

    expect(await screen.findByText('Protected content')).toBeInTheDocument();
  });
});
