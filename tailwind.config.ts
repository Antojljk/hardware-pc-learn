import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Palette HardwarePC — dark + accent teal (alignée sur l'AccueilHardwarePC de référence)
        bg: {
          DEFAULT: '#000000',
          soft: '#0f1414',
          card: '#0f1414',
          elev: '#162020',
        },
        surface: {
          DEFAULT: '#0f1414',
          soft: '#162020',
        },
        border: {
          DEFAULT: '#1f2a2a',
          soft: '#162222',
        },
        // Accent teal
        accent: {
          DEFAULT: '#2dd4d4',
          soft: '#26b6b6',
          mute: '#1a8a8a',
        },
        text: {
          DEFAULT: '#ffffff',
          soft: '#cbd5d5',
          mute: '#9ca3af',
        },
        muted: '#9ca3af',
        faint: '#6b7575',
        // États conservés
        success: '#3ecf8e',
        warning: '#f5a524',
        danger: '#ef4444',
        brand: {
          blue: '#2dd4d4',
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
