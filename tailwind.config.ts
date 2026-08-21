import type { Config } from "tailwindcss";

import { tokens } from "./src/theme/tokens";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: tokens.colors.primary,
          hover: tokens.colors.primaryHover,
          focus: tokens.colors.primaryFocus,
        },
        background: tokens.colors.background,
        surface: tokens.colors.surface,
        sidebar: {
          DEFAULT: tokens.colors.sidebar,
          text: tokens.colors.sidebarText,
          muted: tokens.colors.sidebarMuted,
          active: tokens.colors.sidebarActive,
        },
        border: tokens.colors.border,
        foreground: tokens.colors.text,
        muted: tokens.colors.textMuted,
        error: {
          DEFAULT: tokens.colors.error,
          background: tokens.colors.errorBackground,
          border: tokens.colors.errorBorder,
        },
        success: {
          DEFAULT: tokens.colors.success,
          background: tokens.colors.successBackground,
        },
        warning: tokens.colors.warning,
        focus: tokens.colors.focusRing,
      },
      fontFamily: {
        sans: tokens.typography.fontFamily
          .split(",")
          .map((part) => part.trim()),
      },
      fontSize: {
        xs: [
          tokens.typography.size.xs,
          { lineHeight: tokens.typography.lineHeight.xs },
        ],
        sm: [
          tokens.typography.size.sm,
          { lineHeight: tokens.typography.lineHeight.sm },
        ],
        base: [
          tokens.typography.size.base,
          { lineHeight: tokens.typography.lineHeight.base },
        ],
        lg: [
          tokens.typography.size.lg,
          { lineHeight: tokens.typography.lineHeight.lg },
        ],
        xl: [
          tokens.typography.size.xl,
          { lineHeight: tokens.typography.lineHeight.xl },
        ],
        "2xl": [
          tokens.typography.size["2xl"],
          { lineHeight: tokens.typography.lineHeight["2xl"] },
        ],
      },
      fontWeight: {
        regular: tokens.typography.weight.regular,
        medium: tokens.typography.weight.medium,
        semibold: tokens.typography.weight.semibold,
        bold: tokens.typography.weight.bold,
      },
      spacing: {
        sidebar: tokens.spacing.sidebar,
        header: tokens.spacing.header,
        touch: tokens.spacing.touch,
      },
      minHeight: {
        touch: tokens.spacing.touch,
      },
      minWidth: {
        touch: tokens.spacing.touch,
      },
      width: {
        sidebar: tokens.spacing.sidebar,
      },
      height: {
        header: tokens.spacing.header,
      },
      borderRadius: {
        sm: tokens.radii.sm,
        md: tokens.radii.md,
        lg: tokens.radii.lg,
      },
      boxShadow: {
        sm: tokens.shadow.sm,
        md: tokens.shadow.md,
      },
    },
  },
  plugins: [],
};

export default config;
