/**
 * Centralized Styles Configuration
 * Contains all styling constants used throughout the app
 */

// ==================== SIZES ====================
export const Sizes = {
  // Spacing sizes (multiples of 4 for consistency)
  xs: 4,
  s: 8,
  m: 12,
  l: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  massive: 48,

  // Specific spacing values
  spacing: {
    xs: 4,
    s: 8,
    m: 12,
    l: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    huge: 40,
    massive: 48,
  },

  // Font sizes
  fontSize: {
    xs: 10,
    s: 12,
    m: 14,
    l: 16,
    xl: 18,
    xxl: 20,
    xxxl: 24,
    huge: 28,
    massive: 32,
    giant: 36,
  },

  // Icon sizes
  icon: {
    xs: 16,
    s: 20,
    m: 24,
    l: 28,
    xl: 32,
    xxl: 40,
    huge: 48,
  },

  // Border widths
  borderWidth: {
    none: 0,
    thin: 1,
    medium: 2,
    thick: 3,
  },

  // Avatar sizes
  avatar: {
    xs: 32,
    s: 40,
    m: 56,
    l: 80,
    xl: 100,
    xxl: 120,
  },

  // Button heights
  button: {
    xs: 24,
    s: 32,
    m: 40,
    l: 48,
    xl: 56,
    xxl: 64,
    xxxl: 72,
    huge: 80,
    massive: 88,
  },

  // Input heights
  input: {
    s: 40,
    m: 48,
    l: 56,
  },

  // Tab bar
  tabBar: {
    height: 60,
    iconSize: 24,
  },

  // Bottom bar
  bottomBar: {
    height: 80,
    iconSize: 24,
  },

  // Animation sizes
  animation: {
    small: 150,
    medium: 200,
    large: 250,
  },

  // Header logo sizes
  headerLogo: {
    width: 120,
    height: 40,
  },

  image: {
    xxxs: 40,
    xxs: 60,
    xs: 100,
    s: 120,
    m: 160,
    l: 200,
    xl: 240,
    xxl: 280,
  },
};

// ==================== COLORS ====================
export const Colors = {
  // Primary colors (Yellow theme)
  primary: '#f8d215',
  primaryDark: '#d4b011',
  primaryLight: '#fae04d',

  // Secondary colors (Black theme)
  secondary: '#000000',
  secondaryDark: '#000000',
  secondaryLight: '#1a1a1a',

  // Accent colors
  accent: '#f8d215',
  accentDark: '#d4b011',
  accentLight: '#fae04d',

  // Status colors
  success: '#4CAF50',
  error: '#F44336',
  warning: '#f8d215',
  info: '#f8d215',

  // Text colors (optimized for black/yellow theme)
  text: {
    primary: '#FFFFFF',
    secondary: '#CCCCCC',
    tertiary: '#999999',
    disabled: '#666666',
    inverse: '#000000',
    link: '#f8d215',
  },

  // Background colors (Black theme)
  background: {
    primary: '#000000',
    secondary: '#1a1a1a',
    tertiary: '#2a2a2a',
    dark: '#000000',
    light: '#0a0a0a',
  },

  // Border colors (for dark theme)
  border: {
    light: '#333333',
    medium: '#555555',
    dark: '#777777',
  },

  // Common colors
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    light: '#333333',
    medium: '#666666',
    dark: '#999999',
  },
  blue: '#2196F3',
  red: '#F44336',
  green: '#4CAF50',
  orange: '#FF9800',
  yellow: '#f8d215',
  purple: '#9C27B0',

  // Navigation colors (Black header with yellow accents)
  navigation: {
    headerBackground: '#000000',
    headerText: '#f8d215',
    tabActive: '#f8d215',
    tabInactive: '#666666',
  },
};

// ==================== BORDER RADIUS ====================
export const BorderRadius = {
  none: 0,
  xs: 2,
  s: 4,
  m: 6,
  l: 8,
  xl: 10,
  xxl: 12,
  xxxl: 16,
  round: 9999, // For circular elements

  // Specific use cases
  button: {
    s: 4,
    m: 6,
    l: 8,
    xl: 12,
  },
  card: {
    s: 8,
    m: 10,
    l: 12,
    xl: 16,
  },
  input: {
    s: 4,
    m: 6,
    l: 8,
  },
  avatar: 9999, // Circular
  badge: 12,
};

// ==================== FONT WEIGHTS ====================
export const FontWeight = {
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
};

// ==================== SHADOWS ====================
export const Shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
  },
  xlarge: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 12,
  },
};

// ==================== OPACITY ====================
export const Opacity = {
  transparent: 0,
  almostTransparent: 0.1,
  veryLight: 0.2,
  light: 0.3,
  medium: 0.5,
  semiOpaque: 0.7,
  almostOpaque: 0.9,
  opaque: 1,
};

// ==================== LAYOUT ====================
export const Layout = {
  // Common flex values
  flex: {
    none: 0,
    auto: 1,
  },

  // Common alignments
  align: {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    stretch: 'stretch',
    spaceBetween: 'space-between',
    spaceAround: 'space-around',
    spaceEvenly: 'space-evenly',
  },

  // Common justify content
  justify: {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    spaceBetween: 'space-between',
    spaceAround: 'space-around',
    spaceEvenly: 'space-evenly',
  },

  // Common directions
  direction: {
    row: 'row',
    column: 'column',
    rowReverse: 'row-reverse',
    columnReverse: 'column-reverse',
  },

  // Position
  position: {
    relative: 'relative',
    absolute: 'absolute',
  },
};

// ==================== Z-INDEX ====================
export const ZIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
};

// ==================== ANIMATION ====================
export const Animation = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
};

// ==================== COMMON STYLE HELPERS ====================
export const CommonStyles = {
  // Container styles
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },

  // Centered content
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Row layout
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Card style
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.card.m,
    padding: Sizes.l,
    ...Shadows.medium,
  },

  // Button base
  buttonBase: {
    paddingHorizontal: Sizes.xl,
    paddingVertical: Sizes.m,
    borderRadius: BorderRadius.button.m,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Input base
  inputBase: {
    height: Sizes.input.m,
    paddingHorizontal: Sizes.l,
    borderRadius: BorderRadius.input.m,
    borderWidth: Sizes.borderWidth.thin,
    borderColor: Colors.border.light,
    backgroundColor: Colors.white,
  },

  // Text styles
  text: {
    primary: {
      fontSize: Sizes.fontSize.m,
      color: Colors.text.primary,
      fontWeight: FontWeight.normal,
    },
    secondary: {
      fontSize: Sizes.fontSize.m,
      color: Colors.text.secondary,
      fontWeight: FontWeight.normal,
    },
    heading: {
      fontSize: Sizes.fontSize.xxl,
      color: Colors.text.primary,
      fontWeight: FontWeight.bold,
    },
    subheading: {
      fontSize: Sizes.fontSize.l,
      color: Colors.text.primary,
      fontWeight: FontWeight.semibold,
    },
  },
};

// ==================== EXPORT ALL ====================
export default {
  Sizes,
  Colors,
  BorderRadius,
  FontWeight,
  Shadows,
  Opacity,
  Layout,
  ZIndex,
  Animation,
  CommonStyles,
};

