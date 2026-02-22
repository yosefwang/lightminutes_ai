'use client';

import { Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { Button } from './ui/button';

export function LanguageToggle() {
  const { lang, toggleLanguage, t } = useApp();

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleLanguage}
        title={t('nav.language')}
        aria-label={t('nav.language')}
        className="flex items-center gap-1.5"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">
          {lang === 'zh' ? 'EN' : '中'}
        </span>
      </Button>
    </motion.div>
  );
}
