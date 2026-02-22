'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { useTheme, type Theme } from '../hooks/useTheme';
import { useLanguage, type Language } from '../hooks/useLanguage';

interface AppContextType {
  theme: Theme;
  toggleTheme: () => void;
  lang: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLanguage, t } = useLanguage();

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        lang,
        toggleLanguage,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
