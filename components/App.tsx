'use client';

import { useState } from 'react';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import { Mic, HardDrive, Cloud, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { Recorder } from './Recorder';
import { RecordingList } from './RecordingList';
import { CloudTab } from './CloudTab';
import { StatsChart } from './StatsChart';
import { LandingPage } from './LandingPage';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { ColorThemePicker } from './ColorThemePicker';
import { UserMenu } from './UserMenu';
import { PromptSettingsModal } from './PromptSettingsModal';

type Tab = 'local' | 'cloud' | 'stats';

export function App() {
  const { t } = useApp();
  const [tab, setTab] = useState<Tab>('local');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showPromptSettings, setShowPromptSettings] = useState(false);

  const refresh = () => setRefreshTrigger((prev) => prev + 1);

  const tabs: { id: Tab; icon: typeof Mic; label: string }[] = [
    { id: 'local', icon: HardDrive, label: t('tabs.local') },
    { id: 'cloud', icon: Cloud, label: t('tabs.cloud') },
    { id: 'stats', icon: BarChart3, label: t('tabs.stats') },
  ];

  return (
    <>
      <SignedOut>
        <LandingPage />
      </SignedOut>
      <SignedIn>
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <header className="sticky top-0 z-40 backdrop-blur-lg bg-background/80 border-b">
            <div className="max-w-2xl mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                    <Mic className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <h1 className="text-lg font-semibold tracking-tight">
                    {t('app.title')}
                  </h1>
                </div>
                <div className="flex items-center gap-1">
                  <ThemeToggle />
                  <LanguageToggle />
                  <ColorThemePicker />
                  <UserMenu onOpenPromptSettings={() => setShowPromptSettings(true)} />
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1">
            <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
              <Recorder onUploadComplete={refresh} />

              {/* Tab Navigation */}
              <div className="flex bg-muted rounded-lg p-1">
                {tabs.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={
                      'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all min-h-[2.75rem] ' +
                      (tab === t.id
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground')
                    }
                  >
                    <t.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{t.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                >
                  {tab === 'local' && (
                    <RecordingList refreshTrigger={refreshTrigger} onRefresh={refresh} />
                  )}
                  {tab === 'cloud' && (
                    <CloudTab refreshTrigger={refreshTrigger} />
                  )}
                  {tab === 'stats' && (
                    <StatsChart refreshTrigger={refreshTrigger} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>

          {/* Safe area bottom padding for mobile */}
          <div className="h-0" style={{ height: 'env(safe-area-inset-bottom)' }} />

          <PromptSettingsModal
            isOpen={showPromptSettings}
            onClose={() => setShowPromptSettings(false)}
          />
        </div>
      </SignedIn>
    </>
  );
}
