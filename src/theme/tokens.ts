/**
 * Design tokens derived from PROJECT_FIGMA extracted theme colors.
 * All components must consume these tokens — never hardcode hex values.
 */
export const tokens = {
  colors: {
    background: '#081410',
    foreground: '#fafafa',
    primary: '#86d31f',
    primaryForeground: '#081410',
    accent: '#445154',
    border: '#0d1612',
    muted: '#445154',
    mutedForeground: '#9ca3af',
    destructive: '#ff6b6b',
    success: '#4bcd39',
    warning: '#ffd700',
    card: '#0d1612',
    cardForeground: '#fafafa',
  },
  spacing: {
    pageGutterX: '1.5rem',
    pageGutterY: '1rem',
    compact: '0.5rem',
    section: '1.5rem',
  },
  typography: {
    fontFamily: "'Outfit', system-ui, sans-serif",
    pageTitle: { size: '1.5rem', weight: '600', lineHeight: '2rem' },
    sectionTitle: { size: '1.125rem', weight: '600', lineHeight: '1.75rem' },
    body: { size: '0.875rem', weight: '400', lineHeight: '1.25rem' },
    caption: { size: '0.75rem', weight: '400', lineHeight: '1rem' },
  },
  radius: {
    sm: 'calc(var(--radius) - 4px)',
    md: 'calc(var(--radius) - 2px)',
    lg: 'var(--radius)',
    full: '9999px',
  },
  layout: {
    sidebarWidth: '16rem',
    headerHeight: '3.5rem',
    tableRowHeight: '3rem',
  },
} as const;

export type DesignTokens = typeof tokens;
