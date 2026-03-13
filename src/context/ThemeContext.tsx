import React, { createContext, useContext, useState, useEffect } from 'react';
import { themes, DEFAULT_THEME, type Theme, type ThemeKey } from '../themes/tokens';

interface ThemeContextType {
  theme: Theme;
  themeKey: ThemeKey;
  setTheme: (key: ThemeKey) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Applies all theme CSS variables to :root whenever the theme changes.
 * This is the single source of truth for the entire design system.
 */
function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.style.setProperty('--color-bg-base', theme.bgBase);
  root.style.setProperty('--color-bg-surface', theme.bgSurface);
  root.style.setProperty('--color-bg-card', theme.bgCard);
  root.style.setProperty('--color-bg-muted', theme.bgMuted);
  root.style.setProperty('--color-text-primary', theme.textPrimary);
  root.style.setProperty('--color-text-secondary', theme.textSecondary);
  root.style.setProperty('--color-text-inverse', theme.textInverse);
  root.style.setProperty('--color-accent', theme.accent);
  root.style.setProperty('--color-accent-deep', theme.accentDeep);
  root.style.setProperty('--color-accent-soft', theme.accentSoft);
  root.style.setProperty('--color-border', theme.border);
  root.style.setProperty('--color-cta-bg', theme.ctaBg);
  root.style.setProperty('--color-cta-text', theme.ctaText);
  root.style.setProperty('--color-success', theme.success);
  root.style.setProperty('--color-warning', theme.warning);

  // Detect dark theme and set a class for any dark-specific CSS overrides
  const isDark = theme.bgBase.startsWith('#0') || theme.bgBase.startsWith('#1');
  document.documentElement.classList.toggle('theme-dark', isDark);
  document.documentElement.classList.toggle('theme-light', !isDark);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeKey, setThemeKey] = useState<ThemeKey>(() => {
    const saved = localStorage.getItem('arome_theme') as ThemeKey | null;
    return saved && themes[saved] ? saved : DEFAULT_THEME;
  });

  const theme = themes[themeKey];

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem('arome_theme', themeKey);
  }, [theme, themeKey]);

  return (
    <ThemeContext.Provider value={{ theme, themeKey, setTheme: setThemeKey }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
