import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic as MicIcon, HardDrive as HardDriveIcon, Cloud as CloudIcon, BarChart3, Menu, X } from 'lucide-react';
import { useUser, SignedIn, SignedOut } from '@clerk/clerk-react';
import { AppProvider, useApp } from './contexts/AppContext';
import { PromptSettingsProvider } from './contexts/PromptSettingsContext';
import { ThemeToggle } from './components/ThemeToggle';
import { LanguageToggle } from './components/LanguageToggle';
import { ColorThemePicker } from './components/ColorThemePicker';
import { UserMenu } from './components/UserMenu';
import { Recorder } from './components/Recorder';
import { RecordingList } from './components/RecordingList';
import { CloudTab } from './components/CloudTab';
import { LandingPage } from './components/LandingPage';
import { StatsChart } from './components/StatsChart';
import { PromptSettingsModal } from './components/PromptSettingsModal';
import { cn } from './lib/utils';

function Header({ onOpenPromptSettings }: { onOpenPromptSettings: () => void }) {
  const { t } = useApp();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-md shrink-0"
              >
                <MicIcon className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-primary-foreground" />
              </motion.div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg font-bold tracking-tight truncate">{t('app.title')}</h1>
                <p className="text-xs text-muted-foreground truncate hidden sm:block">{t('app.subtitle')}</p>
              </div>
            </div>

            {/* Desktop controls */}
            <div className="hidden sm:flex items-center gap-1 sm:gap-2 shrink-0">
              <div className="flex items-center gap-1 sm:gap-2">
                <LanguageToggle />
                <ThemeToggle />
                <ColorThemePicker />
              </div>
              <div className="h-6 w-px bg-border mx-1 sm:mx-2"></div>
              <UserMenu onOpenPromptSettings={onOpenPromptSettings} />
            </div>

            {/* Mobile menu button */}
            <button
              className="sm:hidden p-2 -mr-2 text-muted-foreground hover:text-foreground min-h-[2.75rem] min-w-[2.75rem]"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu dropdown */}
      {showMobileMenu && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="sm:hidden bg-background border-b border-border z-40"
        >
          <div className="px-4 py-3 flex items-center justify-around">
            <LanguageToggle />
            <ThemeToggle />
            <ColorThemePicker />
            <UserMenu onOpenPromptSettings={onOpenPromptSettings} />
          </div>
        </motion.div>
      )}
    </>
  );
}

type Tab = 'local' | 'cloud' | 'stats';

function TabButton({
  tab,
  current,
  onClick,
  icon: Icon,
  label,
}: {
  tab: Tab;
  current: Tab;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
}) {
  const isActive = tab === current;
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        'flex-1 flex items-center justify-center gap-1.5 py-2.5 sm:py-3 rounded-xl transition-all duration-200',
        'min-h-[2.75rem]',
        isActive
          ? 'bg-primary text-primary-foreground shadow-sm'
          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
      )}
    >
      <Icon className="w-5 h-5" />
      <span className="text-xs sm:text-sm hidden sm:inline font-medium">{label}</span>
    </motion.button>
  );
}

function AppContent() {
  const { t } = useApp();
  const { isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState<Tab>('local');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showPromptSettings, setShowPromptSettings] = useState(false);

  if (!isLoaded) {
    return (
      <div className="min-h-dvh bg-background flex items-center justify-center"
           style={{
             paddingTop: 'env(safe-area-inset-top)',
             paddingBottom: 'env(safe-area-inset-bottom)',
           }}>
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('app.loading')}</p>
        </div>
      </div>
    );
  }

  const handleUploadComplete = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <>
      <SignedOut>
        <LandingPage />
      </SignedOut>
      <SignedIn>
        <div
          className={cn(
            'min-h-dvh bg-background flex flex-col',
            showPromptSettings && 'pointer-events-none'
          )}
          style={{
            paddingBottom: 'env(safe-area-inset-bottom)',
          }}
        >
          <Header onOpenPromptSettings={() => setShowPromptSettings(true)} />

          <main className="flex-1 w-full max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="flex gap-1.5 sm:gap-2 mb-4 sm:mb-6 bg-muted/50 p-1.5 rounded-xl"
            >
              <TabButton
                tab="local"
                current={activeTab}
                onClick={() => setActiveTab('local')}
                icon={HardDriveIcon}
                label={t('tabs.local')}
              />
              <TabButton
                tab="cloud"
                current={activeTab}
                onClick={() => setActiveTab('cloud')}
                icon={CloudIcon}
                label={t('tabs.cloud')}
              />
              <TabButton
                tab="stats"
                current={activeTab}
                onClick={() => setActiveTab('stats')}
                icon={BarChart3}
                label={t('tabs.stats')}
              />
            </motion.div>

            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: activeTab === 'local' ? -20 : activeTab === 'cloud' ? 20 : 0 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4 sm:space-y-6"
            >
              {activeTab === 'local' && (
                <>
                  <Recorder onUploadComplete={handleUploadComplete} />
                  <RecordingList refreshTrigger={refreshTrigger} onRefresh={handleRefresh} />
                </>
              )}

              {activeTab === 'cloud' && <CloudTab refreshTrigger={refreshTrigger} />}

              {activeTab === 'stats' && <StatsChart refreshTrigger={refreshTrigger} />}
            </motion.div>
          </main>

          <footer className="py-4 sm:py-8 text-center text-xs sm:text-sm text-muted-foreground">
            <p>LiteMinute AI © {new Date().getFullYear()}</p>
          </footer>
        </div>

        {/* Prompt Settings Modal - Outside everything! */}
        <PromptSettingsModal
          isOpen={showPromptSettings}
          onClose={() => setShowPromptSettings(false)}
        />
      </SignedIn>
    </>
  );
}

export function App() {
  return (
    <AppProvider>
      <PromptSettingsProvider>
        <AppContent />
      </PromptSettingsProvider>
    </AppProvider>
  );
}
