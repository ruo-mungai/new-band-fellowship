// Style exports for the application
import './themes.css';

export const theme = {
  colors: {
    primary: {
      50: 'var(--color-primary-50)',
      100: 'var(--color-primary-100)',
      200: 'var(--color-primary-200)',
      300: 'var(--color-primary-300)',
      400: 'var(--color-primary-400)',
      500: 'var(--color-primary-500)',
      600: 'var(--color-primary-600)',
      700: 'var(--color-primary-700)',
      800: 'var(--color-primary-800)',
      900: 'var(--color-primary-900)',
    },
    church: {
      warm: 'var(--color-church-warm)',
      cream: 'var(--color-church-cream)',
      stone: 'var(--color-church-stone)',
      charcoal: 'var(--color-church-charcoal)',
      light: 'var(--color-church-light)',
      dark: 'var(--color-church-dark)',
    },
    background: {
      primary: 'var(--bg-primary)',
      secondary: 'var(--bg-secondary)',
      tertiary: 'var(--bg-tertiary)',
      accent: 'var(--bg-accent)',
    },
    text: {
      primary: 'var(--text-primary)',
      secondary: 'var(--text-secondary)',
      tertiary: 'var(--text-tertiary)',
      accent: 'var(--text-accent)',
    },
    border: {
      light: 'var(--border-light)',
      medium: 'var(--border-medium)',
      dark: 'var(--border-dark)',
    },
  },
  
  spacing: {
    1: 'var(--spacing-1)',
    2: 'var(--spacing-2)',
    3: 'var(--spacing-3)',
    4: 'var(--spacing-4)',
    5: 'var(--spacing-5)',
    6: 'var(--spacing-6)',
    8: 'var(--spacing-8)',
    10: 'var(--spacing-10)',
    12: 'var(--spacing-12)',
    16: 'var(--spacing-16)',
    20: 'var(--spacing-20)',
    24: 'var(--spacing-24)',
  },
  
  typography: {
    sans: 'var(--font-sans)',
    serif: 'var(--font-serif)',
  },
  
  radius: {
    sm: 'var(--radius-sm)',
    md: 'var(--radius-md)',
    lg: 'var(--radius-lg)',
    xl: 'var(--radius-xl)',
    '2xl': 'var(--radius-2xl)',
    '3xl': 'var(--radius-3xl)',
    full: 'var(--radius-full)',
  },
  
  shadows: {
    sm: 'var(--shadow-sm)',
    md: 'var(--shadow-md)',
    lg: 'var(--shadow-lg)',
    xl: 'var(--shadow-xl)',
  },
  
  transitions: {
    fast: 'var(--transition-fast)',
    normal: 'var(--transition-normal)',
    slow: 'var(--transition-slow)',
    slowest: 'var(--transition-slowest)',
  },
  
  zIndex: {
    dropdown: 'var(--z-dropdown)',
    sticky: 'var(--z-sticky)',
    fixed: 'var(--z-fixed)',
    modalBackdrop: 'var(--z-modal-backdrop)',
    modal: 'var(--z-modal)',
    popover: 'var(--z-popover)',
    tooltip: 'var(--z-tooltip)',
    toast: 'var(--z-toast)',
  },
};

// Animation classes
export const animations = {
  fadeIn: 'fade-in',
  slideUp: 'slide-up',
  slideDown: 'slide-down',
  pulse: 'pulse',
  bounce: 'bounce',
  spin: 'spin',
  float: 'float',
};

// Utility classes
export const utilities = {
  glass: 'glass',
  gradientText: 'gradient-text',
  cardHover: 'card-hover',
  textTruncate: 'text-truncate',
  lineClamp1: 'text-line-clamp-1',
  lineClamp2: 'text-line-clamp-2',
  lineClamp3: 'text-line-clamp-3',
  flexCenter: 'flex-center',
  flexBetween: 'flex-between',
  flexAround: 'flex-around',
  flexEvenly: 'flex-evenly',
  stickyTop: 'sticky-top',
  fixedTop: 'fixed-top',
  srOnly: 'sr-only',
  notSrOnly: 'not-sr-only',
};

// Responsive breakpoints
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export default {
  theme,
  animations,
  utilities,
  breakpoints,
};