/**
 * Design tokens for the admin panel.
 * Re-theme the entire app by editing CSS variables in global.css and values here.
 */
export const tokens = {
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
  radius: {
    sm: 'calc(var(--radius) - 4px)',
    md: 'calc(var(--radius) - 2px)',
    lg: 'var(--radius)',
    full: '9999px',
  },
  typography: {
    pageTitle: 'text-2xl font-semibold tracking-tight text-foreground',
    sectionTitle: 'text-lg font-semibold text-foreground',
    body: 'text-sm text-foreground',
    muted: 'text-sm text-muted-foreground',
    label: 'text-sm font-medium text-foreground',
  },
  layout: {
    sidebarWidth: '16rem',
    headerHeight: '4rem',
    maxContentWidth: '80rem',
  },
} as const;
