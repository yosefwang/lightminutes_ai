'use client';

import { useState, useRef, useEffect } from 'react';
import { Palette, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { useThemeColor, type ColorTheme } from '@/contexts/ThemeColorContext';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

const colorOptions: { theme: ColorTheme; label: string; labelZh: string; color: string }[] = [
  { theme: 'ocean', label: 'Ocean', labelZh: '海洋', color: 'hsl(199.4 89.2% 48.4%)' },
  { theme: 'forest', label: 'Forest', labelZh: '森林', color: 'hsl(142.1 76.2% 36.3%)' },
  { theme: 'sunset', label: 'Sunset', labelZh: '日落', color: 'hsl(24.6 95% 53.1%)' },
  { theme: 'lavender', label: 'Lavender', labelZh: '薰衣草', color: 'hsl(262.1 83.3% 57.8%)' },
  { theme: 'rose', label: 'Rose', labelZh: '玫瑰', color: 'hsl(346.8 77.2% 49.8%)' },
];

interface ColorThemePickerProps {
  className?: string;
}

export function ColorThemePicker({ className }: ColorThemePickerProps) {
  const { t, lang } = useApp();
  const { colorTheme, setColorTheme } = useThemeColor();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentColor = colorOptions.find((o) => o.theme === colorTheme)?.color || colorOptions[0].color;

  return (
    <div className={cn('relative', className)} ref={menuRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        title={t('nav.colorTheme')}
        aria-label={t('nav.colorTheme')}
      >
        <div className="flex items-center gap-1">
          <Palette className="w-5 h-5" />
          <div
            className="w-3 h-3 rounded-full border-2 border-border"
            style={{ backgroundColor: currentColor }}
          />
        </div>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-full mt-2 w-48 rounded-xl border bg-card shadow-lg z-50 p-2"
          >
            <div className="space-y-1">
              {colorOptions.map((option) => (
                <button
                  key={option.theme}
                  onClick={() => {
                    setColorTheme(option.theme);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors',
                    colorTheme === option.theme
                      ? 'bg-accent text-accent-foreground'
                      : 'hover:bg-accent/50 text-foreground'
                  )}
                >
                  <div
                    className="w-5 h-5 rounded-full border-2 border-border flex-shrink-0"
                    style={{ backgroundColor: option.color }}
                  />
                  <span className="text-sm font-medium">{lang === 'zh' ? option.labelZh : option.label}</span>
                  {colorTheme === option.theme && (
                    <Check className="w-4 h-4 ml-auto text-primary" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
