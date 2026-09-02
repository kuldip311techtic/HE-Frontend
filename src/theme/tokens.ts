/**
 * Design tokens extracted from PROJECT_FIGMA visual language.
 * Dark sports admin theme with lime-green accents.
 */
export const colors = {
  accent: '#445154',
  brand: '#86d31f',
  border: '#0d1612',
  background: '#081410',
  backgroundMuted: '#081410fa',
  surface: '#111827',
  surfaceElevated: '#1f2937',
  primary: '#4bcd39',
  primaryMuted: '#1bc94f1a',
  muted: '#9ca3af',
  destructive: '#ff6b6b',
  destructiveMuted: '#ff41411f',
  info: '#3b82f6',
  overlay: '#030a077f',
  white: '#ffffff',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',
} as const;

export const typography = {
  fontFamily: "'Outfit', system-ui, sans-serif",
  sizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
  },
  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
} as const;

export const radii = {
  sm: '0.375rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  full: '9999px',
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.4)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.4)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.5)',
} as const;

export const layout = {
  sidebarWidth: '16rem',
  headerHeight: '3.5rem',
  contentPadding: '1.5rem',
  tableRowHeight: '3rem',
} as const;

export const tokens = {
  colors,
  typography,
  spacing,
  radii,
  shadows,
  layout,
} as const;

export default tokens;
