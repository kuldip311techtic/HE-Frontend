import type { Config } from 'tailwindcss';
import { breakpoints } from './src/theme/breakpoints';
import { colors } from './src/theme/tokens';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      screens: {
        sm: breakpoints.mobile,
        md: breakpoints.tablet,
        lg: breakpoints.desktop,
        mobile: breakpoints.mobile,
        tablet: breakpoints.tablet,
        desktop: breakpoints.desktop,
      },
      colors: {
        primary: colors.primary,
        secondary: colors.secondary,
        accent: colors.accent,
        canvas: colors.background,
        surface: colors.surface,
        ink: colors.textPrimary,
        muted: colors.textSecondary,
        line: colors.border,
        danger: colors.error,
        success: colors.success,
        warning: colors.warning,
        info: colors.info,
        overlay: colors.overlay,
        'danger-soft': colors.errorSoft,
        'accent-soft': colors.accentSoft,
        navy: colors.navy,
        'navy-muted': colors.navyMuted,
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 24px 60px rgba(7, 17, 31, 0.28)',
        focus: '0 0 0 3px rgba(234, 88, 12, 0.35)',
      },
      minHeight: {
        touch: '44px',
      },
    },
  },
  plugins: [],
} satisfies Config;
