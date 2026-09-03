/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        lato: ['Lato', 'sans-serif'],
      },
      spacing: {
        'figma-1': '1px',
        'figma-2': '2px',
        'figma-3': '3px',
        'figma-10': '10px',
        'figma-11': '11px',
        'figma-12': '12px',
        'figma-14': '14px',
        'figma-15': '15px',
        'figma-16': '16px',
        'figma-18': '18px',
        'figma-19': '19px',
        'figma-20': '20px',
        'figma-24': '24px',
        'figma-28': '28px',
        'figma-30': '30px',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        'figma-10': '10px',
        'figma-12': '12px',
        'figma-14': '14px',
        'figma-16': '16px',
        'figma-20': '20px',
        'figma-100': '100px',
      },
      colors: {
        figma: {
          accent: 'var(--figma-hex-accent)',
          brand: 'var(--figma-hex-brand)',
          border: 'var(--figma-hex-border)',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar))',
          foreground: 'hsl(var(--sidebar-foreground))',
          border: 'hsl(var(--sidebar-border))',
          accent: 'hsl(var(--sidebar-accent))',
        },
      },
    },
  },
  plugins: [],
};
