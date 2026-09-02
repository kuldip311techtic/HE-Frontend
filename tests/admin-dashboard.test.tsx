import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { getAutoDemoSession, shouldAutoDemoAuth } from '@/lib/dev-auth';

describe('AdminDashboardPage', () => {
  it('renders a descriptive h1 on all viewports', () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <AdminDashboardPage />
      </QueryClientProvider>,
    );

    const heading = screen.getByRole('heading', {
      level: 1,
      name: 'Organization Admin Dashboard',
    });

    expect(heading).toBeVisible();
    expect(heading.tagName).toBe('H1');
  });
});

describe('dev-auth', () => {
  it('provides a demo session when auto demo auth is enabled', () => {
    expect(shouldAutoDemoAuth()).toBe(true);

    const session = getAutoDemoSession();
    expect(session?.user.role).toBe('organization_admin');
    expect(session?.token).toBeTruthy();
  });
});
