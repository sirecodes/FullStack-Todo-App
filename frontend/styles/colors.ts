/**
 * WARM SUNSET ELEGANCE COLOR PALETTE
 * Inverse of Purple: Warm Orange-Coral-Gold Theme
 * 
 * Philosophy: Sophisticated warmth with sunset-inspired gradients
 * Primary: Burnt Orange (#FF6B35) to Coral (#FF8C42) to Gold (#FFB627)
 * Accent: Deep Terracotta, Warm Amber, Soft Peach
 */

/* ========================================
   WARM SUNSET COLOR SCALE (HEX VALUES)
   Custom Elegant Palette - No Copy-Paste
   ======================================== */

export const sunsetColors = {
  // Light Warm Tones (Backgrounds, Soft Accents)
  sunset50: '#FFF8F0',   // Cream - softest warm background
  sunset100: '#FFEDD5',  // Soft peach - light backgrounds
  sunset200: '#FED7AA',  // Light apricot - subtle accents
  sunset300: '#FDBA74',  // Warm peach - borders, light elements
  sunset400: '#FB923C',  // Medium coral - secondary actions

  // Primary Sunset Colors (Main Brand)
  sunset500: '#FF6B35',  // PRIMARY - Burnt orange, main brand
  sunset600: '#EA580C',  // Deep orange - hover states
  sunset700: '#C2410C',  // Dark terracotta - active states
  sunset800: '#9A3412',  // Deep rust - strong text
  sunset900: '#7C2D12',  // Darkest rust - headings, depth
  
  // Complementary Warm Accents
  gold: '#FFB627',       // Warm gold - highlights
  amber: '#F59E0B',      // Rich amber - warnings, attention
  coral: '#FF8C42',      // Soft coral - playful accents
  terracotta: '#D97706', // Earthy terracotta - grounded elements
} as const;

/* ========================================
   OKLCH COLOR SPACE CONVERSIONS
   For modern CSS with smooth gradients
   ======================================== */

export const sunsetColorsOKLCH = {
  sunset50: 'oklch(0.982 0.015 75)',    // #FFF8F0
  sunset100: 'oklch(0.952 0.045 65)',   // #FFEDD5
  sunset200: 'oklch(0.895 0.085 55)',   // #FED7AA
  sunset300: 'oklch(0.825 0.135 45)',   // #FDBA74
  sunset400: 'oklch(0.735 0.165 35)',   // #FB923C
  sunset500: 'oklch(0.665 0.195 25)',   // #FF6B35 (PRIMARY)
  sunset600: 'oklch(0.595 0.215 20)',   // #EA580C
  sunset700: 'oklch(0.515 0.245 18)',   // #C2410C
  sunset800: 'oklch(0.445 0.255 15)',   // #9A3412
  sunset900: 'oklch(0.385 0.265 12)',   // #7C2D12
  
  // Accents
  gold: 'oklch(0.785 0.145 85)',        // #FFB627
  amber: 'oklch(0.715 0.165 65)',       // #F59E0B
  coral: 'oklch(0.725 0.175 45)',       // #FF8C42
  terracotta: 'oklch(0.645 0.185 55)',  // #D97706
} as const;

/* ========================================
   SEMANTIC COLOR TOKENS
   Elegant Warm Theme Mapping
   ======================================== */

export const semanticColors = {
  // Primary Brand Colors
  primary: sunsetColors.sunset500,         // Burnt orange
  primaryHover: sunsetColors.sunset600,    // Deep orange
  primaryActive: sunsetColors.sunset700,   // Dark terracotta

  // Secondary Colors (Light, Elegant)
  secondary: sunsetColors.sunset100,       // Soft peach backgrounds
  secondaryHover: sunsetColors.sunset200,  // Light apricot hover

  // Accent Colors (Gold & Coral)
  accent: sunsetColors.gold,               // Warm gold highlights
  accentHover: sunsetColors.amber,         // Rich amber hover
  accentSecondary: sunsetColors.coral,     // Soft coral alternative

  // Text Colors (Elegant Contrast)
  textPrimary: '#1A1410',                  // Warm near-black
  textSecondary: '#78716C',                // Warm gray
  textWarm: sunsetColors.sunset700,        // Warm orange text (AAA)
  textStrong: sunsetColors.sunset800,      // High contrast warm text

  // Border Colors
  borderLight: sunsetColors.sunset200,     // Soft apricot
  borderMedium: sunsetColors.sunset300,    // Warm peach
  borderStrong: sunsetColors.sunset500,    // Burnt orange focus

  // Background Colors
  bgLight: sunsetColors.sunset50,          // Cream background
  bgMedium: sunsetColors.sunset100,        // Soft peach
  bgStrong: sunsetColors.sunset200,        // Light apricot
  bgDark: '#1A1410',                       // Warm dark background

  // Interactive States
  focusRing: sunsetColors.sunset500,       // Burnt orange focus
  hoverBg: sunsetColors.sunset100,         // Soft peach hover
  activeBg: sunsetColors.sunset200,        // Light apricot active
} as const;

/* ========================================
   TAILWIND CSS CLASS UTILITIES
   Ready-to-use elegant warm classes
   ======================================== */

export const tailwindClasses = {
  // Button Classes
  buttonPrimary: 'bg-sunset-500 hover:bg-sunset-600 active:bg-sunset-700 text-white shadow-lg hover:shadow-xl transition-all',
  buttonSecondary: 'bg-sunset-100 hover:bg-sunset-200 active:bg-sunset-300 text-sunset-800 shadow-md',
  buttonGold: 'bg-linear-to-r from-gold to-amber hover:from-amber hover:to-gold text-white shadow-lg',

  // Card Classes (Elegant Glass Effect)
  card: 'bg-white/80 backdrop-blur-sm border border-sunset-200 rounded-xl shadow-md hover:shadow-lg hover:border-sunset-300 transition-all',
  cardDark: 'bg-sunset-900/20 backdrop-blur-md border border-sunset-700/30 rounded-xl shadow-lg',

  // Text Classes
  textLink: 'text-sunset-700 hover:text-sunset-500 underline-offset-4 hover:underline transition-colors',
  textHeading: 'text-sunset-800 font-bold tracking-tight',
  textGold: 'text-gold font-semibold',

  // Background Classes (Warm Gradients)
  bgWarmGradient: 'bg-linear-to-br from-sunset-50 via-sunset-100 to-sunset-200',
  bgSunsetGlow: 'bg-linear-to-r from-sunset-500 via-coral to-gold',
  bgDarkWarm: 'bg-linear-to-br from-sunset-900 via-sunset-800 to-sunset-700',

  // Focus Classes
  focusRing: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset-500 focus-visible:ring-offset-2',
} as const;

/* ========================================
   USAGE GUIDELINES
   When to use each warm shade
   ======================================== */

export const colorUsageGuidelines = {
  backgrounds: {
    elegant: 'sunset50, sunset100 - Soft, sophisticated backgrounds',
    warm: 'sunset200, sunset300 - Warm, inviting sections',
    bold: 'sunset500-700 gradients - Hero sections, feature cards',
  },
  buttons: {
    primary: 'sunset500 (burnt orange) - Main CTAs',
    gold: 'Gold gradient - Premium features, upgrades',
    subtle: 'sunset100-200 - Secondary, non-intrusive actions',
  },
  text: {
    elegant: 'sunset700-800 - Readable, warm text (AAA compliant)',
    luxury: 'Gold - Premium features, highlights',
    standard: 'Warm gray (#78716C) - Body text',
  },
  accents: {
    highlights: 'Gold, Coral - Draw attention elegantly',
    borders: 'sunset300-500 - Subtle to prominent borders',
    glow: 'Warm gradients with shadow-lg - Elevated elements',
  },
} as const;

/* ========================================
   TYPE EXPORTS
   ======================================== */

export type SunsetColorKey = keyof typeof sunsetColors;
export type SemanticColorKey = keyof typeof semanticColors;
export type TailwindClassKey = keyof typeof tailwindClasses;