import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../apps/web/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // === BLACKSENTINEL BRAND COLORS ===
        // Strictly: Orange, Black, Gray, White
        bsn: {
          // Primary Orange (from logo)
          orange: {
            DEFAULT: '#FF6B00',
            50: '#FFF7ED',
            100: '#FFEDD5',
            200: '#FED7AA',
            300: '#FDBA74',
            400: '#FB923C',
            500: '#FF6B00',
            600: '#E55A00',
            700: '#CC4D00',
            800: '#A33D00',
            900: '#7A2E00',
            glow: '#FF8A30',
            neon: '#FF5500',
          },
          // Black scale (from logo background)
          black: {
            DEFAULT: '#000000',
            50: '#050505',
            100: '#0A0A0A',
            150: '#0D0D0D',
            200: '#111111',
            250: '#141414',
            300: '#1A1A1A',
            400: '#222222',
            500: '#2A2A2A',
            600: '#333333',
            700: '#404040',
            800: '#555555',
          },
          // Gray scale (for text and subtle elements)
          gray: {
            DEFAULT: '#737373',
            50: '#FAFAFA',
            100: '#F5F5F5',
            200: '#E5E5E5',
            300: '#D4D4D4',
            400: '#A3A3A3',
            500: '#737373',
            600: '#525252',
            700: '#404040',
            800: '#262626',
            900: '#171717',
          },
          // White
          white: {
            DEFAULT: '#FFFFFF',
            50: '#FAFAFA',
            100: '#F5F5F5',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        // Orange glow effects
        'glow-sm': '0 0 10px rgba(255, 107, 0, 0.2)',
        'glow': '0 0 20px rgba(255, 107, 0, 0.3)',
        'glow-md': '0 0 30px rgba(255, 107, 0, 0.4)',
        'glow-lg': '0 0 40px rgba(255, 107, 0, 0.5)',
        'glow-xl': '0 0 60px rgba(255, 107, 0, 0.6)',
        // Dark shadows
        'elevated': '0 4px 24px rgba(0, 0, 0, 0.5)',
        'card': '0 2px 12px rgba(0, 0, 0, 0.4)',
        'panel': '0 8px 32px rgba(0, 0, 0, 0.6)',
        'inner': 'inset 0 1px 2px rgba(0, 0, 0, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'slide-right': 'slideRight 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'breathe': 'breathe 4s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 0px rgba(255, 107, 0, 0)' },
          '50%': { boxShadow: '0 0 20px rgba(255, 107, 0, 0.3)' },
        },
        breathe: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255, 107, 0, 0)' },
          '50%': { boxShadow: '0 0 20px 4px rgba(255, 107, 0, 0.2)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #FF6B00, #FF8A30)',
        'gradient-dark': 'linear-gradient(135deg, #050505, #0D0D0D)',
        'gradient-panel': 'linear-gradient(180deg, #0D0D0D, #050505)',
        'gradient-card': 'linear-gradient(135deg, #111111, #0A0A0A)',
        'gradient-glow': 'linear-gradient(135deg, rgba(255, 107, 0, 0.15), rgba(255, 107, 0, 0))',
        'gradient-shimmer': 'linear-gradient(90deg, transparent, rgba(255, 107, 0, 0.1), transparent)',
      },
    },
  },
  plugins: [],
};

export default config;
