import type { Config } from 'tailwindcss';

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        // Warm Sunset Color Scale
        'sunset-50': 'oklch(var(--sunset-50) / <alpha-value>)',
        'sunset-100': 'oklch(var(--sunset-100) / <alpha-value>)',
        'sunset-200': 'oklch(var(--sunset-200) / <alpha-value>)',
        'sunset-300': 'oklch(var(--sunset-300) / <alpha-value>)',
        'sunset-400': 'oklch(var(--sunset-400) / <alpha-value>)',
        'sunset-500': 'oklch(var(--sunset-500) / <alpha-value>)',
        'sunset-600': 'oklch(var(--sunset-600) / <alpha-value>)',
        'sunset-700': 'oklch(var(--sunset-700) / <alpha-value>)',
        'sunset-800': 'oklch(var(--sunset-800) / <alpha-value>)',
        'sunset-900': 'oklch(var(--sunset-900) / <alpha-value>)',

        // Warm Accent Colors
        'gold': 'oklch(var(--gold) / <alpha-value>)',
        'amber': 'oklch(var(--amber) / <alpha-value>)',
        'coral': 'oklch(var(--coral) / <alpha-value>)',
        'terracotta': 'oklch(var(--terracotta) / <alpha-value>)',

        // Semantic Colors
        'primary': 'oklch(var(--primary) / <alpha-value>)',
        'primary-foreground': 'oklch(var(--primary-foreground) / <alpha-value>)',
        'secondary': 'oklch(var(--secondary) / <alpha-value>)',
        'secondary-foreground': 'oklch(var(--secondary-foreground) / <alpha-value>)',
        'accent': 'oklch(var(--accent) / <alpha-value>)',
        'accent-foreground': 'oklch(var(--accent-foreground) / <alpha-value>)',
        'destructive': 'oklch(var(--destructive) / <alpha-value>)',
        'destructive-foreground': 'oklch(var(--destructive-foreground) / <alpha-value>)',
        'success': 'oklch(var(--success) / <alpha-value>)',
        'success-foreground': 'oklch(var(--success-foreground) / <alpha-value>)',
        'muted': 'oklch(var(--muted) / <alpha-value>)',
        'muted-foreground': 'oklch(var(--muted-foreground) / <alpha-value>)',
        'background': 'oklch(var(--background) / <alpha-value>)',
        'foreground': 'oklch(var(--foreground) / <alpha-value>)',
        'card': 'oklch(var(--card) / <alpha-value>)',
        'card-foreground': 'oklch(var(--card-foreground) / <alpha-value>)',
        'popover': 'oklch(var(--popover) / <alpha-value>)',
        'popover-foreground': 'oklch(var(--popover-foreground) / <alpha-value>)',
        'border': 'oklch(var(--border) / <alpha-value>)',
        'input': 'oklch(var(--input) / <alpha-value>)',
        'ring': 'oklch(var(--ring) / <alpha-value>)',

        // Text Colors
        'text-primary': 'oklch(var(--text-primary) / <alpha-value>)',
        'text-secondary': 'oklch(var(--text-secondary) / <alpha-value>)',
        'text-muted': 'oklch(var(--text-muted) / <alpha-value>)',
        'text-warm': 'oklch(var(--text-warm) / <alpha-value>)',

        // Background Variations
        'bg-cream': 'oklch(var(--bg-cream) / <alpha-value>)',
        'bg-light-main': 'oklch(var(--bg-light-main) / <alpha-value>)',
        'bg-light-card': 'oklch(var(--bg-light-card) / <alpha-value>)',
        'bg-light-elevated': 'oklch(var(--bg-light-elevated) / <alpha-value>)',

        // Glass Effects
        'glass-bg': 'oklch(var(--glass-bg) / <alpha-value>)',
        'glass-border': 'oklch(var(--glass-border) / <alpha-value>)',
        'glass-warm': 'oklch(var(--glass-warm) / <alpha-value>)',
      },
      boxShadow: {
        'glow-sunset': 'var(--glow-sunset)',
        'glow-gold': 'var(--glow-gold)',
        'glow-coral': 'var(--glow-coral)',
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',
        'warm': 'var(--shadow-warm)',
        'elegant': '0 4px 24px oklch(0.665 0.195 25 / 0.12), 0 2px 8px oklch(0.665 0.195 25 / 0.08)',
        'soft': '0 2px 16px oklch(0.665 0.195 25 / 0.06)',
      },
      animation: {
        'warm-pulse': 'warm-pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
      },
      keyframes: {
        'warm-pulse': {
          '0%, 100%': { 
            boxShadow: '0 0 0 0 oklch(0.665 0.195 25 / 0.7)',
            transform: 'scale(1)',
          },
          '50%': { 
            boxShadow: '0 0 0 12px oklch(0.665 0.195 25 / 0)',
            transform: 'scale(1.03)',
          },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'glow': {
          '0%, 100%': { 
            filter: 'drop-shadow(0 0 8px oklch(0.665 0.195 25 / 0.3))',
          },
          '50%': { 
            filter: 'drop-shadow(0 0 20px oklch(0.665 0.195 25 / 0.6))',
          },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      borderRadius: {
        'xl': 'var(--radius-xl)',
        'lg': 'var(--radius-lg)',
        'md': 'var(--radius-md)',
        'sm': 'var(--radius-sm)',
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '40px',
        '3xl': '64px',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      letterSpacing: {
        tighter: '-0.04em',
        tight: '-0.02em',
        normal: '0',
        wide: '0.02em',
        wider: '0.04em',
      },
      backgroundImage: {
        'warm-gradient': 'linear-gradient(135deg, var(--sunset-400), var(--gold))',
        'sunset-gradient': 'linear-gradient(180deg, var(--sunset-50), var(--sunset-100))',
        'elegant-radial': 'radial-gradient(circle at top right, var(--sunset-100), var(--sunset-50), white)',
      },
    },
  },
  plugins: [],
} satisfies Config;