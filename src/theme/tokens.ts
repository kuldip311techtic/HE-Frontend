export const colors = {
  primary: '#0B1A2E',
  secondary: '#FFFFFF',
  accent: '#EA580C',
  background: '#07111F',
  surface: '#FFFFFF',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  border: '#E2E8F0',
  error: '#B91C1C',
  success: '#15803D',
  warning: '#C2410C',
  info: '#1D4ED8',
  muted: '#64748B',
  overlay: '#0B1A2ECC',
  errorSoft: '#FEF2F2',
  successSoft: '#F0FDF4',
  accentSoft: '#FFF7ED',
  navy: '#12243C',
  navyMuted: '#94A3B8',
} as const;

type FontToken = {
  fontFamily: string;
  fontSize: string;
  fontWeight: number;
  lineHeight: string;
  letterSpacing?: string;
};

const font = (
  fontFamily: string,
  fontSize: number | string,
  fontWeight: number,
  lineHeight: number | string,
  letterSpacing?: number | string,
): FontToken => ({
  fontFamily,
  fontSize: typeof fontSize === 'string' ? fontSize : `${fontSize}px`,
  fontWeight,
  lineHeight: typeof lineHeight === 'string' ? lineHeight : `${lineHeight}px`,
  ...(letterSpacing === undefined
    ? {}
    : {
        letterSpacing:
          typeof letterSpacing === 'string'
            ? letterSpacing
            : `${letterSpacing}px`,
      }),
});

export const typography = {
  heading: font('Inter', 32, 700, 40),
  'heading-md': font('Inter', 24, 700, 32),
  body: font('Inter', 16, 400, 24),
  'body-sm': font('Inter', 14, 400, 20),
  caption: font('Inter', 12, 500, 16),
  label: font('Inter', 14, 600, 20),
  button: font('Inter', 16, 600, 24),
} as const;

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
} as const;

export const radii = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
} as const;

export const shadows = {
  card: '0 24px 60px rgba(7, 17, 31, 0.28)',
  focus: '0 0 0 3px rgba(234, 88, 12, 0.35)',
} as const;

export const tokens = {
  colors,
  typography,
  spacing,
  radii,
  shadows,
} as const;

export default tokens;
