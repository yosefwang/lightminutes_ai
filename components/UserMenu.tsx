'use client';

import { useState, useRef, useEffect } from 'react';
import { LogOut, ChevronDown, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { useClerk, useUser } from '@clerk/nextjs';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface UserMenuProps {
  className?: string;
  onOpenPromptSettings: () => void;
}

export function UserMenu({ className, onOpenPromptSettings }: UserMenuProps) {
  const { t } = useApp();
  const { signOut } = useClerk();
  const { user } = useUser();
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

  const handleSignOut = () => {
    signOut();
    setIsOpen(false);
  };

  const handlePromptSettings = () => {
    setIsOpen(false);
    onOpenPromptSettings();
  };

  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : user?.primaryEmailAddress?.emailAddress[0].toUpperCase() || 'U';

  return (
    <div className={cn('relative', className)} ref={menuRef}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-primary-foreground text-sm font-semibold">
          {initials}
        </div>
        <ChevronDown className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')} />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-full mt-2 w-56 rounded-xl border bg-card shadow-lg z-50"
          >
            <div className="p-4 border-b">
              <p className="text-sm font-medium">{user?.fullName || user?.primaryEmailAddress?.emailAddress}</p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
            <div className="p-2 space-y-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-muted-foreground hover:text-foreground"
                onClick={handlePromptSettings}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                {t('nav.promptSettings')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-muted-foreground hover:text-foreground"
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4 mr-2" />
                {t('nav.signOut')}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
