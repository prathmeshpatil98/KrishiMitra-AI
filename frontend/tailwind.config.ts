import type { Config } from 'tailwindcss'

/**
 * KrishiMitra AI — Tailwind CSS Configuration
 * =============================================
 * Extends the default Tailwind theme with the official KrishiMitra design tokens.
 * Never add one-off utilities. All design decisions live here.
 * Dark mode uses the 'class' strategy — toggled by ThemeProvider.
 */
const config: Config = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      // -----------------------------------------------------------------
      // Brand Color Palette (from 08_ui_design_system.md)
      // -----------------------------------------------------------------
      colors: {
        brand: {
          primary:   '#2E7D32',
          secondary: '#81C784',
          accent:    '#F9A825',
        },
        success:  '#16A34A',
        danger:   '#DC2626',
        warning:  '#D97706',
        info:     '#2563EB',
        surface: {
          DEFAULT: '#FFFFFF',
          dark:    '#1E2433',
        },
        background: {
          DEFAULT: '#F7F9F5',
          dark:    '#111827',
        },
        sidebar: {
          DEFAULT: '#1F2937',
          dark:    '#111827',
        },
        border: {
          DEFAULT: '#E5E7EB',
          dark:    '#374151',
        },
        text: {
          primary:   '#111827',
          secondary: '#6B7280',
          muted:     '#9CA3AF',
        },
      },

      // -----------------------------------------------------------------
      // Typography — Inter font
      // -----------------------------------------------------------------
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        'display': ['3rem', { lineHeight: '1.1', fontWeight: '700' }],
        'h1':  ['2.25rem', { lineHeight: '1.2', fontWeight: '700' }],
        'h2':  ['1.875rem', { lineHeight: '1.25', fontWeight: '600' }],
        'h3':  ['1.5rem',  { lineHeight: '1.3', fontWeight: '600' }],
        'h4':  ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body':    ['1rem',    { lineHeight: '1.6' }],
        'small':   ['0.875rem', { lineHeight: '1.5' }],
        'caption': ['0.75rem',  { lineHeight: '1.4' }],
      },

      // -----------------------------------------------------------------
      // Border Radius (from design system)
      // -----------------------------------------------------------------
      borderRadius: {
        'card':   '16px',
        'btn':    '12px',
        'input':  '12px',
        'dialog': '20px',
        'map':    '20px',
      },

      // -----------------------------------------------------------------
      // Layout
      // -----------------------------------------------------------------
      width: {
        'sidebar':         '280px',
        'sidebar-collapsed': '72px',
      },
      height: {
        'navbar': '72px',
      },
      maxWidth: {
        'content': '1280px',
        'page':    '1440px',
      },

      // -----------------------------------------------------------------
      // Shadows
      // -----------------------------------------------------------------
      boxShadow: {
        'card':    '0 4px 24px rgba(0,0,0,0.06)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.12)',
        'float':   '0 16px 64px rgba(0,0,0,0.16)',
        'glow-primary': '0 0 20px rgba(46,125,50,0.35)',
        'glow-accent':  '0 0 20px rgba(249,168,37,0.35)',
      },

      // -----------------------------------------------------------------
      // Animations
      // -----------------------------------------------------------------
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'fade-in': {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-left': {
          '0%':   { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 8px rgba(46,125,50,0.3)' },
          '50%':      { boxShadow: '0 0 24px rgba(46,125,50,0.6)' },
        },
      },
      animation: {
        'shimmer':       'shimmer 1.6s linear infinite',
        'fade-in':       'fade-in 0.25s ease-out',
        'slide-in-left': 'slide-in-left 0.25s ease-out',
        'pulse-glow':    'pulse-glow 2s ease-in-out infinite',
      },

      // -----------------------------------------------------------------
      // Spacing (8px grid — Tailwind defaults already cover this)
      // Extended for named semantic values
      // -----------------------------------------------------------------
      spacing: {
        'sidebar': '280px',
        'navbar':  '72px',
      },

      // -----------------------------------------------------------------
      // Backdrop Blur
      // -----------------------------------------------------------------
      backdropBlur: {
        'nav': '12px',
      },
    },
  },
  plugins: [],
}

export default config
