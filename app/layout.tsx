import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Sans_SC, JetBrains_Mono } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import { AppProvider } from '@/contexts/AppContext';
import { PromptSettingsProvider } from '@/contexts/PromptSettingsContext';
import { ThemeColorProvider } from '@/contexts/ThemeColorContext';

// Get Clerk publishable key from environment
const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  variable: '--font-noto-sans-sc',
  display: 'swap',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'LiteMinute AI',
  description: 'Speech to Text & Smart Summary',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
  viewportFit: 'cover',
};

// Make this route dynamic to prevent static prerendering with Clerk
export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      publishableKey={clerkPublishableKey}
    >
      <html lang="zh-CN" suppressHydrationWarning>
        <head />
        <body className={`${inter.variable} ${notoSansSC.variable} ${jetBrainsMono.variable} font-sans`}>
          <AppProvider>
            <ThemeColorProvider>
              <PromptSettingsProvider>
                {children}
              </PromptSettingsProvider>
            </ThemeColorProvider>
          </AppProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
