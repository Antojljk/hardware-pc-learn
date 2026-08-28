import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Palette HardwarePC — monochrome premium noir/blanc/gris
        bg: {
          DEFAULT: '#000000',
          soft: '#0a0a0a',
          card: '#0f0f10',
          elev: '#161617',
        },
        surface: {
          DEFAULT: '#0f0f10',
          soft: '#161617',
        },
        border: {
          DEFAULT: '#262626',
          soft: '#1a1a1a',
        },
        // Accent neutre (gris clair) — pas de couleur vive
        accent: {
          DEFAULT: '#e5e5e5',
          soft: '#cfcfcf',
          mute: '#8a8a8a',
        },
        text: {
          DEFAULT: '#ffffff',
          soft: '#d4d4d4',
          mute: '#9ca3af',
        },
        muted: '#9ca3af',
        faint: '#6b7575',
        // États conservés (succès/avertissement/erreur) en gris léger pour cohérence monochrome
        success: '#cfcfcf',
        warning: '#a3a3a3',
        danger: '#737373',
        brand: {
          blue: '#e5e5e5',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Inter', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['var(--font-body)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-body)', 'Inter', 'system-ui', 'monospace'],
      },
      fontSize: {
        hero: ['clamp(2.5rem, 6vw, 5rem)', { lineHeight: '1.02', letterSpacing: '-0.02em' }],
        heading: ['clamp(1.75rem, 3.5vw, 3rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        display: ['1.125rem', { lineHeight: '1.35', letterSpacing: '-0.01em' }],
      },
      boxShadow: {
        card: '0 4px 12px rgba(0, 0, 0, 0.3)',
        elev: '0 10px 24px rgba(0, 0, 0, 0.4)',
        ring: '0 0 0 1px #1f2a2a',
      },
      borderRadius: {
        DEFAULT: '16px',
        lg: '20px',
        xl: '24px',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
