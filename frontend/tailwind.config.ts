import type { Config } from 'tailwindcss'

/**
 * KrishiMitra AI — Tailwind CSS Configuration
 * =============================================
 * Agricultural premium design tokens.
 * Farm Green + Golden Amber + Cream palette.
 */
const config: Config = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      // ── Farm Color Palette ────────────────────────────────────
      colors: {
        // Primary brand — Deep Forest Green
        brand: {
          primary:   '#1B4D1F',
          hover:     '#153D19',
          light:     '#2D6A31',
          mid:       '#3A7D3F',
          pale:      '#EDF7EE',
        },
        // Accent — Golden Amber
        gold: {
          DEFAULT:   '#F59E0B',
          dark:      '#D97706',
          light:     '#FCD34D',
          pale:      '#FEF3C7',
        },
        // Neutral warm palette
        cream: {
          DEFAULT:   '#FDF8F0',
          dark:      '#F5EDD9',
          warm:      '#FAF4EA',
        },
        farm: {
          dark:      '#0D1A0E',
          green:     '#1B4D1F',
          mid:       '#2D6A31',
          sage:      '#6B8F4F',
          wheat:     '#C8A85A',
          soil:      '#8B6914',
        },
        // Semantic
        success:  '#16A34A',
        danger:   '#DC2626',
        warning:  '#D97706',
        info:     '#2563EB',
        // Surfaces
        surface: {
          DEFAULT: '#FFFFFF',
          dark:    '#111A12',
          raised:  '#F9FAFB',
        },
        background: {
          DEFAULT: '#FDF8F0',
          dark:    '#0A100B',
        },
        border: {
          DEFAULT: '#E5E7EB',
          dark:    '#1E3A20',
        },
        text: {
          primary:   '#111827',
          secondary: '#4B5563',
          muted:     '#9CA3AF',
        },
      },

      // ── Typography ───────────────────────────────────────────
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
        mono:    ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        'hero':    ['clamp(2.8rem,7vw,6rem)', { lineHeight: '1.0', letterSpacing: '-0.02em', fontWeight: '900' }],
        'display': ['clamp(2rem,4.5vw,3.75rem)', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '800' }],
        'h1':      ['2.25rem', { lineHeight: '1.2', fontWeight: '700', letterSpacing: '-0.02em' }],
        'h2':      ['1.875rem', { lineHeight: '1.25', fontWeight: '700', letterSpacing: '-0.02em' }],
        'h3':      ['1.5rem',   { lineHeight: '1.3',  fontWeight: '600' }],
        'h4':      ['1.25rem',  { lineHeight: '1.4',  fontWeight: '600' }],
        'body':    ['1rem',     { lineHeight: '1.7' }],
        'small':   ['0.875rem', { lineHeight: '1.5' }],
        'caption': ['0.75rem',  { lineHeight: '1.4' }],
      },

      // ── Border Radius ────────────────────────────────────────
      borderRadius: {
        'card':   '20px',
        'btn':    '12px',
        'input':  '12px',
        'dialog': '24px',
        'badge':  '6px',
        'pill':   '999px',
      },

      // ── Layout ───────────────────────────────────────────────
      maxWidth: {
        'content': '1280px',
        'page':    '1440px',
        'prose':   '720px',
      },
      height: {
        'navbar': '72px',
      },

      // ── Shadows ──────────────────────────────────────────────
      boxShadow: {
        'card':       '0 1px 3px rgba(0,0,0,0.06), 0 4px 24px rgba(0,0,0,0.06)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.14)',
        'float':      '0 20px 80px rgba(0,0,0,0.2)',
        'glow-green': '0 0 30px rgba(27,77,31,0.3)',
        'glow-gold':  '0 0 24px rgba(245,158,11,0.4)',
        'farm':       '0 4px 32px rgba(27,77,31,0.15)',
      },

      // ── Animations ───────────────────────────────────────────
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 8px rgba(245,158,11,0.3)' },
          '50%':      { boxShadow: '0 0 24px rgba(245,158,11,0.6)' },
        },
        'wheat-sway': {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%':      { transform: 'rotate(3deg)' },
        },
        'count-up': {
          '0%':   { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'spin-slow': {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'grain': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%':  { transform: 'translate(-2%, -3%)' },
          '30%':  { transform: 'translate(3%, -1%)' },
          '50%':  { transform: 'translate(-1%, 2%)' },
          '70%':  { transform: 'translate(2%, 1%)' },
          '90%':  { transform: 'translate(-3%, 2%)' },
        },
      },
      animation: {
        'shimmer':     'shimmer 1.8s linear infinite',
        'marquee':     'marquee 25s linear infinite',
        'fade-up':     'fade-up 0.6s ease-out',
        'float':       'float 4s ease-in-out infinite',
        'pulse-glow':  'pulse-glow 2s ease-in-out infinite',
        'wheat-sway':  'wheat-sway 3s ease-in-out infinite',
        'spin-slow':   'spin-slow 20s linear infinite',
        'grain':       'grain 8s steps(10) infinite',
      },

      // ── Spacing ──────────────────────────────────────────────
      spacing: {
        'navbar': '72px',
      },
      backdropBlur: {
        'nav': '16px',
      },
    },
  },
  plugins: [],
}

export default config
