'use client';

import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';

export function ThemeToggle() {
  // Directly manipulate DOM for testing - bypass React state management
  const toggleThemeDirect = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    try {
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    } catch {}
  };

  // Check current theme from DOM
  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleThemeDirect}
        title="Toggle theme"
        aria-label="Toggle theme"
      >
        {isDark ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </Button>
    </motion.div>
  );
}
