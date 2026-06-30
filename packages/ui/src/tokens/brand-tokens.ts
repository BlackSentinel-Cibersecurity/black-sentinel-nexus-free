// BlackSentinel Nexus - Brand Design Tokens
// Colors extracted from official BlackSentinel Tech logo
// Strictly: Orange, Black, Gray, White ONLY

export const brand = {
  // === PRIMARY ORANGE ===
  // The signature BlackSentinel orange from the logo
  orange: {
    50: '#FFF7ED',    // Lightest orange tint
    100: '#FFEDD5',   // Very light orange
    200: '#FED7AA',   // Light orange
    300: '#FDBA74',   // Soft orange
    400: '#FB923C',   // Medium orange
    500: '#FF6B00',   // PRIMARY - BlackSentinel Orange (exact from logo)
    600: '#E55A00',   // Slightly darker
    700: '#CC4D00',   // Dark orange
    800: '#A33D00',   // Very dark orange
    900: '#7A2E00',   // Deepest orange
    glow: '#FF8A30',  // Glow effect orange
    neon: '#FF5500',  // Neon highlight
  },

  // === BLACK SCALE ===
  // From the logo's deep black background
  black: {
    0: '#000000',     // Pure black (logo background)
    50: '#050505',    // Near black (main background)
    100: '#0A0A0A',   // Very dark
    150: '#0D0D0D',   // Dark panels
    200: '#111111',   // Card backgrounds
    250: '#141414',   // Elevated surfaces
    300: '#1A1A1A',   // Borders, dividers
    400: '#222222',   // Hover states
    500: '#2A2A2A',   // Active states
    600: '#333333',   // Interactive elements
    700: '#404040',   // Disabled
    800: '#555555',   // Muted elements
  },

  // === GRAY SCALE ===
  // For text and subtle elements
  gray: {
    50: '#FAFAFA',    // Brightest gray
    100: '#F5F5F5',   // Very light
    200: '#E5E5E5',   // Light
    300: '#D4D4D4',   // Medium light
    400: '#A3A3A3',   // Medium
    500: '#737373',   // Base gray
    600: '#525252',   // Dark gray
    700: '#404040',   // Darker gray
    800: '#262626',   // Very dark gray
    900: '#171717',   // Near black gray
  },

  // === WHITE ===
  white: {
    0: '#FFFFFF',     // Pure white
    50: '#FAFAFA',    // Off-white
    100: '#F5F5F5',   // Slightly off-white
    withOpacity: (opacity: number) => `rgba(255, 255, 255, ${opacity})`,
  },

  // === SEMANTIC COLORS (using only orange scale) ===
  status: {
    critical: '#FF6B00',    // Orange for critical (brand color = high visibility)
    high: '#FF6B00',        // Orange for high
    medium: '#A33D00',      // Darker orange for medium
    low: '#737373',         // Gray for low
    info: '#525252',        // Dark gray for info
    healthy: '#FF6B00',     // Orange (brand-consistent)
    warning: '#FF6B00',     // Orange (brand-consistent)
    error: '#FF6B00',       // Orange (brand-consistent)
    success: '#FF6B00',     // Orange (brand-consistent)
  },
} as const;

// === GRADIENTS ===
export const gradients = {
  // Primary brand gradient (from logo)
  primary: 'linear-gradient(135deg, #FF6B00, #FF8A30)',
  dark: 'linear-gradient(135deg, #050505, #0D0D0D)',
  panel: 'linear-gradient(180deg, #0D0D0D, #050505)',
  card: 'linear-gradient(135deg, #111111, #0A0A0A)',
  glow: 'linear-gradient(135deg, rgba(255, 107, 0, 0.15), rgba(255, 107, 0, 0))',
  border: 'linear-gradient(135deg, #FF6B00, #333333)',
  shimmer: 'linear-gradient(90deg, transparent, rgba(255, 107, 0, 0.1), transparent)',
} as const;

// === SHADOWS ===
export const shadows = {
  glow: (intensity: number = 1) => `0 0 ${20 * intensity}px rgba(255, 107, 0, ${0.3 * intensity})`,
  glowSm: '0 0 10px rgba(255, 107, 0, 0.2)',
  glowMd: '0 0 20px rgba(255, 107, 0, 0.3)',
  glowLg: '0 0 40px rgba(255, 107, 0, 0.4)',
  glowXl: '0 0 60px rgba(255, 107, 0, 0.5)',
  elevated: '0 4px 24px rgba(0, 0, 0, 0.5)',
  card: '0 2px 12px rgba(0, 0, 0, 0.4)',
  panel: '0 8px 32px rgba(0, 0, 0, 0.6)',
  inner: 'inset 0 1px 2px rgba(0, 0, 0, 0.3)',
} as const;

// === GLASSMORPHISM ===
export const glass = {
  background: 'rgba(13, 13, 13, 0.85)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(255, 107, 0, 0.1)',
  borderHover: '1px solid rgba(255, 107, 0, 0.3)',
} as const;

// === TYPOGRAPHY ===
export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
    display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
    mono: ['IBM Plex Mono', 'Fira Code', 'monospace'],
  },
  fontWeight: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;

// === SPACING ===
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
  '4xl': '96px',
} as const;

// === BORDER RADIUS ===
export const radius = {
  none: '0',
  sm: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  '2xl': '16px',
  '3xl': '24px',
  full: '9999px',
} as const;

// === ANIMATIONS ===
export const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  slideRight: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  glow: {
    animate: {
      boxShadow: [
        '0 0 0px rgba(255, 107, 0, 0)',
        '0 0 20px rgba(255, 107, 0, 0.3)',
        '0 0 0px rgba(255, 107, 0, 0)',
      ],
    },
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  },
  pulse: {
    animate: {
      scale: [1, 1.02, 1],
      opacity: [1, 0.8, 1],
    },
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
  },
  breathe: {
    animate: {
      boxShadow: [
        '0 0 0 0 rgba(255, 107, 0, 0)',
        '0 0 20px 4px rgba(255, 107, 0, 0.2)',
        '0 0 0 0 rgba(255, 107, 0, 0)',
      ],
    },
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
  },
  shimmer: {
    animate: {
      backgroundPosition: ['200% 0', '-200% 0'],
    },
    transition: { duration: 2, repeat: Infinity, ease: 'linear' },
  },
} as const;
