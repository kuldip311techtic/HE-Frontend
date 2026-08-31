/**
 * Design tokens for Hoops Engine — single source of truth for theming.
 * Values derived from project Figma design language.
 */
export const tokens = {
  colors: {
    background: "#081410",
    surface: "#0d1612",
    accent: "#445154",
    primary: "#86d31f",
    primaryHover: "#4bcd39",
    border: "#0d1612",
    muted: "#9ca3af",
    destructive: "#ff6b6b",
    success: "#1bc94f",
    info: "#3b82f6",
  },
  spacing: {
    page: "1.5rem",
    section: "1rem",
    card: "1.5rem",
  },
  radius: {
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    card: "1.5rem",
  },
  typography: {
    fontFamily: "'Outfit', system-ui, sans-serif",
    heading: {
      h1: { size: "1.5rem", weight: 600 },
      h2: { size: "1.25rem", weight: 600 },
    },
    body: { size: "0.875rem", weight: 400 },
    label: { size: "0.875rem", weight: 500 },
  },
} as const;
