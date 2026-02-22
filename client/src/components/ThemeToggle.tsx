import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../contexts/AppContext';
import { Button } from './ui/button';

export function ThemeToggle() {
  const { theme, toggleTheme, t } = useApp();

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        title={t('nav.theme')}
        aria-label={t('nav.theme')}
      >
        {theme === 'light' ? (
          <Moon className="w-5 h-5" />
        ) : (
          <Sun className="w-5 h-5" />
        )}
      </Button>
    </motion.div>
  );
}
