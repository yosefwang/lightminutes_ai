import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type ColorTheme = 'ocean' | 'forest' | 'sunset' | 'lavender' | 'rose';

interface ColorThemeConfig {
  primary: string;
  primaryForeground: string;
  primary50: string;
  primary100: string;
  primary200: string;
  primary300: string;
  primary400: string;
  primary500: string;
  primary600: string;
  primary700: string;
  primary800: string;
  primary900: string;
  ring: string;
}

const colorThemes: Record<ColorTheme, ColorThemeConfig> = {
  ocean: {
    primary: '199.4 89.2% 48.4%',
    primaryForeground: '210 40% 98%',
    primary50: '199.2 100% 97.3%',
    primary100: '199.2 100% 94.1%',
    primary200: '199.4 95.5% 86.9%',
    primary300: '199.4 93.4% 77.5%',
    primary400: '199.4 91.1% 63.9%',
    primary500: '199.4 89.2% 48.4%',
    primary600: '199.4 88.1% 39.2%',
    primary700: '199.5 88.3% 32.2%',
    primary800: '199.6 87.6% 27.5%',
    primary900: '200.4 86.1% 23.9%',
    ring: '199.4 89.2% 48.4%',
  },
  forest: {
    primary: '142.1 76.2% 36.3%',
    primaryForeground: '355.7 100% 97.3%',
    primary50: '138.5 76.5% 96.7%',
    primary100: '140.6 84.2% 92.5%',
    primary200: '141 78.9% 85.1%',
    primary300: '141.7 76.6% 73.1%',
    primary400: '141.9 75.5% 56.7%',
    primary500: '142.1 76.2% 36.3%',
    primary600: '142.1 70.6% 29.2%',
    primary700: '142.4 71.8% 23.7%',
    primary800: '142.8 72.5% 19.4%',
    primary900: '143.8 73.3% 16.5%',
    ring: '142.1 76.2% 36.3%',
  },
  sunset: {
    primary: '24.6 95% 53.1%',
    primaryForeground: '210 40% 98%',
    primary50: '33.4 100% 96.5%',
    primary100: '34.3 100% 91.8%',
    primary200: '32.1 98.6% 83.1%',
    primary300: '30.8 97.5% 72.4%',
    primary400: '27.9 96.1% 61%',
    primary500: '24.6 95% 53.1%',
    primary600: '20.5 90.2% 48.2%',
    primary700: '17.5 88.3% 40.4%',
    primary800: '15 79.1% 33.7%',
    primary900: '15.3 74.6% 27.8%',
    ring: '24.6 95% 53.1%',
  },
  lavender: {
    primary: '262.1 83.3% 57.8%',
    primaryForeground: '210 40% 98%',
    primary50: '264 100% 97.5%',
    primary100: '263.4 100% 94.9%',
    primary200: '263.5 100% 91.8%',
    primary300: '262.7 98.3% 86.1%',
    primary400: '262.1 88.8% 75.9%',
    primary500: '262.1 83.3% 57.8%',
    primary600: '263.4 70% 50.4%',
    primary700: '263.4 69.3% 42.2%',
    primary800: '263.5 67.4% 34.9%',
    primary900: '264 67.2% 28%',
    ring: '262.1 83.3% 57.8%',
  },
  rose: {
    primary: '346.8 77.2% 49.8%',
    primaryForeground: '210 40% 98%',
    primary50: '355.7 100% 97.3%',
    primary100: '355.6 100% 94.7%',
    primary200: '352.7 96.1% 90%',
    primary300: '350.4 95.7% 82.2%',
    primary400: '347.7 92.9% 72.2%',
    primary500: '346.8 77.2% 49.8%',
    primary600: '345.8 74.7% 40.6%',
    primary700: '345.1 75.5% 34.1%',
    primary800: '344.7 74.9% 29.2%',
    primary900: '344.9 72.4% 25.1%',
    ring: '346.8 77.2% 49.8%',
  },
};

interface ThemeColorContextType {
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
  applyColorTheme: (theme: ColorTheme) => void;
}

const ThemeColorContext = createContext<ThemeColorContextType | undefined>(undefined);

export function ThemeColorProvider({ children }: { children: ReactNode }) {
  const [colorTheme, setColorThemeState] = useState<ColorTheme>(() => {
    if (typeof window === 'undefined') return 'ocean';
    const saved = localStorage.getItem('colorTheme');
    return (saved as ColorTheme) || 'ocean';
  });

  const applyColorTheme = (theme: ColorTheme) => {
    const config = colorThemes[theme];
    const root = document.documentElement;

    root.style.setProperty('--primary', config.primary);
    root.style.setProperty('--primary-foreground', config.primaryForeground);
    root.style.setProperty('--primary-50', config.primary50);
    root.style.setProperty('--primary-100', config.primary100);
    root.style.setProperty('--primary-200', config.primary200);
    root.style.setProperty('--primary-300', config.primary300);
    root.style.setProperty('--primary-400', config.primary400);
    root.style.setProperty('--primary-500', config.primary500);
    root.style.setProperty('--primary-600', config.primary600);
    root.style.setProperty('--primary-700', config.primary700);
    root.style.setProperty('--primary-800', config.primary800);
    root.style.setProperty('--primary-900', config.primary900);
    root.style.setProperty('--ring', config.ring);
  };

  const setColorTheme = (theme: ColorTheme) => {
    setColorThemeState(theme);
    localStorage.setItem('colorTheme', theme);
    applyColorTheme(theme);
  };

  useEffect(() => {
    applyColorTheme(colorTheme);
  }, [colorTheme]);

  return (
    <ThemeColorContext.Provider value={{ colorTheme, setColorTheme, applyColorTheme }}>
      {children}
    </ThemeColorContext.Provider>
  );
}

export function useThemeColor() {
  const context = useContext(ThemeColorContext);
  if (context === undefined) {
    throw new Error('useThemeColor must be used within a ThemeColorProvider');
  }
  return context;
}
