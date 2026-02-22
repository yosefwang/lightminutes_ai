'use client';

import { useState } from 'react';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import { Mic, ListMusic, BarChart3 } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Recorder } from './Recorder';
import { RecordingList } from './RecordingList';
import { StatsChart } from './StatsChart';
import { LandingPage } from './LandingPage';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { ColorThemePicker } from './ColorThemePicker';
import { UserMenu } from './UserMenu';
import { PromptSettingsModal } from './PromptSettingsModal';

type Tab = 'recordings' | 'stats';

export function App() {
  const { t } = useApp();
  const [tab, setTab] = useState<Tab>('recordings');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showPromptSettings, setShowPromptSettings] = useState(false);

  const refresh = () => setRefreshTrigger((prev) => prev + 1);

  const tabs: { id: Tab; icon: typeof Mic; label: string }[] = [
    { id: 'recordings', icon: ListMusic, label: t('tabs.local') },
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
              <div className="grid grid-cols-1">
                <div
                  className={
                    'col-start-1 row-start-1 transition-opacity duration-200 ease-out ' +
                    (tab === 'recordings' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none')
                  }
                >
                  <RecordingList refreshTrigger={refreshTrigger} onRefresh={refresh} />
                </div>
                <div
                  className={
                    'col-start-1 row-start-1 transition-opacity duration-200 ease-out ' +
                    (tab === 'stats' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none')
                  }
                >
                  <StatsChart refreshTrigger={refreshTrigger} />
                </div>
              </div>
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
