'use client';

import { AppProvider } from '@/contexts/AppContext';
import { ThemeColorProvider } from '@/contexts/ThemeColorContext';
import { PromptSettingsProvider } from '@/contexts/PromptSettingsContext';
import { App } from '@/components/App';

export default function Home() {
  return (
    <AppProvider>
      <ThemeColorProvider>
        <PromptSettingsProvider>
          <App />
        </PromptSettingsProvider>
      </ThemeColorProvider>
    </AppProvider>
  );
}
