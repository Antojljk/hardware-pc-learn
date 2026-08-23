import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Palette CoreTech — neutre claire + accent corail
        bg: {
          DEFAULT: '#f9f9fa',
          soft: '#ffffff',
          card: '#ffffff',
          elev: '#f3f3f5',
        },
        surface: {
          DEFAULT: '#141416',
          soft: '#1d1d22',
        },
        border: {
          DEFAULT: '#e3e3e7',
          soft: '#ececef',
        },
        // Accent unique — corail CoreTech
        accent: {
          DEFAULT: '#e2402a',
          soft: '#b8331f',
          mute: '#7a2417',
        },
        text: {
          DEFAULT: '#101012',
          soft: '#6e6e75',
          mute: '#9c9ca3',
        },
        muted: '#6e6e75',
        faint: '#9c9ca3',
        // États conservés mais assagis
        success: '#3ecf8e',
        warning: '#f5a524',
        danger: '#ef4444',
        brand: {
          blue: '#3b82f6',
        },
      },
      fontFamily: {
        // branchées sur les CSS vars posées par next/font dans layout.tsx
        display: ['var(--font-display)', 'Inter Tight', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'DM Mono', 'ui-monospace', 'monospace'],
        sans: ['var(--font-body)', 'DM Mono', 'system-ui', 'sans-serif'],
        mono: ['var(--font-body)', 'DM Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // Tailles d'affichage inspirées CoreTech
        hero: ['clamp(2.5rem, 6vw, 4.5rem)', { lineHeight: '1.02', letterSpacing: '-0.04em' }],
        heading: ['clamp(1.5rem, 2.5vw, 2.25rem)', { lineHeight: '1.1', letterSpacing: '-0.025em' }],
        display: ['1.125rem', { lineHeight: '1.35', letterSpacing: '-0.01em' }],
      },
      boxShadow: {
        // Ombres CoreTech — diffuses, subtiles
        card: '0 1px 2px rgba(15,23,42,0.04), 0 1px 3px rgba(15,23,42,0.06)',
        elev: '0 8px 24px rgba(15,23,42,0.06)',
        ring: '0 0 0 1px #e3e3e7',
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
