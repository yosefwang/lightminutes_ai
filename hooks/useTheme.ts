'use client';

import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';

export type Theme = 'light' | 'dark';

// Simple external store for theme
let currentTheme: Theme = 'light';
const listeners = new Set<() => void>();

function getTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  try {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

function setThemeDirectly(theme: Theme) {
  currentTheme = theme;
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  try {
    localStorage.setItem('theme', theme);
  } catch {}
  listeners.forEach(l => l());
}

// Initialize on module load
if (typeof window !== 'undefined') {
  currentTheme = getTheme();
  setThemeDirectly(currentTheme);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useTheme() {
  const theme = useSyncExternalStore(
    subscribe,
    () => currentTheme,
    () => 'light' as Theme
  );

  const toggleTheme = useCallback(() => {
    setThemeDirectly(theme === 'light' ? 'dark' : 'light');
  }, [theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeDirectly(newTheme);
  }, []);

  return { theme, setTheme, toggleTheme };
}
