/**
 * Design tokens extracted from PROJECT_FIGMA visual language.
 * Dark sports-coaching theme with green accent.
 */
export const colors = {
  background: "#081410",
  backgroundFa: "#081410fa",
  surface: "#1a2332",
  sidebar: "#171f2b",
  border: "#0d1612",
  accent: "#445154",
  primary: "#4bcd39",
  primaryMuted: "#1bc94f1a",
  destructive: "#ff6b6b",
  muted: "#9ca3af",
  foreground: "#ffffff",
  foregroundMuted: "#d1d5db",
  info: "#3b82f6",
  gold: "#ffd700",
} as const;

export const typography = {
  fontFamily: "'Outfit', system-ui, sans-serif",
  sizes: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
  },
  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;

export const spacing = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "0.75rem",
  lg: "1rem",
  xl: "1.5rem",
  "2xl": "2rem",
  "3xl": "3rem",
} as const;

export const radii = {
  sm: "0.25rem",
  md: "0.375rem",
  lg: "0.5rem",
  xl: "0.75rem",
  full: "9999px",
} as const;

export const shadows = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
} as const;

export const theme = {
  colors,
  typography,
  spacing,
  radii,
  shadows,
} as const;

export default theme;
