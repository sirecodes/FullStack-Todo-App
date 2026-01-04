"use client";

/**
 * useTheme Hook - Light Mode Only (Warm Sunset Theme)
 *
 * Provides theme context with warm sunset color palette.
 * Always uses light mode - dark mode disabled.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { theme, mode } = useTheme();
 *
 *   return (
 *     <div style={{ backgroundColor: theme.palette.background }}>
 *       <p>Current mode: {mode}</p>
 *     </div>
 *   );
 * }
 * ```
 */

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import type { Theme, ThemeMode, ColorPalette } from "@/types";

/**
 * Theme context shape
 */
interface ThemeContextValue {
  theme: Theme;
  mode: ThemeMode;
  toggleDarkMode: () => void; // Kept for compatibility but does nothing
  setMode: (mode: ThemeMode) => void; // Kept for compatibility but always sets light
}

/**
 * Light mode color palette - Warm Sunset Elegance
 */
const lightPalette: ColorPalette = {
  primary: "#FF6B35", // Burnt orange
  primaryHover: "#EA580C", // Deep orange
  secondary: "#FFB627", // Warm gold
  accent: "#FF8C42", // Soft coral
  background: "#FFF8F0", // Cream background
  surface: "#FFFFFF", // White cards
  text: "#1A1410", // Warm near-black
  textSecondary: "#78716C", // Warm gray
  border: "#FED7AA", // Light apricot
  success: "#10B981", // Green
  warning: "#F59E0B", // Amber
  error: "#EF4444", // Red
  info: "#FF6B35", // Sunset orange
};

/**
 * Dark mode palette (unused but kept for type compatibility)
 */
const darkPalette: ColorPalette = {
  ...lightPalette, // Just use light palette
};

/**
 * Base theme configuration (mode-independent)
 */
const baseTheme = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: "0.25rem", // 4px
    md: "0.5rem", // 8px
    lg: "0.75rem", // 12px
    full: "9999px",
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: {
      xs: "0.75rem", // 12px
      sm: "0.875rem", // 14px
      md: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.25rem", // 20px
      xxl: "1.5rem", // 24px
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(255, 107, 53, 0.05)",
    md: "0 4px 6px -1px rgba(255, 107, 53, 0.1)",
    lg: "0 10px 15px -3px rgba(255, 107, 53, 0.1)",
    xl: "0 20px 25px -5px rgba(255, 107, 53, 0.1)",
  },
  transitions: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
};

/**
 * Create theme object - Always light mode
 */
const createTheme = (mode: ThemeMode): Theme => ({
  ...baseTheme,
  palette: lightPalette, // Always use light palette
  mode: "light", // Always light mode
});

/**
 * Theme context
 */
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Local storage key for theme preference
 */
const THEME_STORAGE_KEY = "todo-app-theme";

/**
 * Get initial theme mode - Always returns light
 */
const getInitialMode = (): ThemeMode => {
  return "light"; // Always light mode
};

/**
 * ThemeProvider Component Props
 */
interface ThemeProviderProps {
  children: React.ReactNode;
  initialMode?: ThemeMode;
}

/**
 * ThemeProvider Component
 *
 * Wraps app with theme context provider.
 * Always provides light mode theme.
 *
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <ThemeProvider>
 *       <YourApp />
 *     </ThemeProvider>
 *   );
 * }
 * ```
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, initialMode }) => {
  const [mode, setModeState] = useState<ThemeMode>("light");

  // Initialize theme - always light
  useEffect(() => {
    setModeState("light");
  }, []);

  // Persist theme changes to localStorage and update document class
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Always save as light
      localStorage.setItem(THEME_STORAGE_KEY, "light");

      // Always remove dark class
      const root = document.documentElement;
      root.classList.remove("dark");
    }
  }, [mode]);

  // Create theme object (memoized to prevent unnecessary re-renders)
  const theme = useMemo(() => createTheme("light"), []);

  // Toggle between light and dark mode - disabled (does nothing)
  const toggleDarkMode = () => {
    // Does nothing - kept for compatibility
    console.log("Dark mode is disabled. App uses light theme only.");
  };

  // Set specific mode - always sets to light
  const setMode = (newMode: ThemeMode) => {
    // Always set to light regardless of input
    setModeState("light");
  };

  const value: ThemeContextValue = {
    theme,
    mode: "light", // Always light
    toggleDarkMode,
    setMode,
  };

  return React.createElement(ThemeContext.Provider, { value }, children);
};

/**
 * useTheme Hook
 *
 * Access theme context in any component.
 * Must be used within ThemeProvider.
 *
 * @returns Theme context value with current theme (always light mode)
 * @throws Error if used outside ThemeProvider
 */
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};

/**
 * Hook to detect system dark mode preference
 * Returns light mode always
 */
export const useSystemTheme = (): ThemeMode => {
  return "light"; // Always return light
};