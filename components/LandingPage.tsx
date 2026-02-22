'use client';

import { Mic, FileText, Cloud, Zap, CheckCircle2, Globe } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { SignInButton, SignUpButton } from '@clerk/nextjs';

const features = [
  {
    icon: Mic,
    titleZh: '智能语音转录',
    titleEn: 'Smart Voice Transcription',
    descZh: '使用先进的AI技术将语音实时转换为文字',
    descEn: 'Real-time voice-to-text using advanced AI technology',
  },
  {
    icon: FileText,
    titleZh: 'AI智能摘要',
    titleEn: 'AI Summary',
    descZh: '自动生成结构化的会议摘要和待办事项',
    descEn: 'Automatically generate structured meeting summaries and action items',
  },
  {
    icon: Cloud,
    titleZh: '云端存储',
    titleEn: 'Cloud Storage',
    descZh: '安全可靠的Cloudflare R2云存储',
    descEn: 'Secure and reliable Cloudflare R2 cloud storage',
  },
  {
    icon: Zap,
    titleZh: '快速高效',
    titleEn: 'Fast & Efficient',
    descZh: '使用Groq和Anthropic的极速API',
    descEn: 'Blazing fast APIs from Groq and Anthropic',
  },
];

export function LandingPage() {
  const { lang, toggleLanguage } = useApp();

  return (
    <div className="min-h-screen">
      {/* Header with Language Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <Button variant="ghost" size="sm" onClick={toggleLanguage} className="flex items-center gap-2">
          <Globe className="w-4 h-4" />
          <span className="text-sm font-medium">
            {lang === 'zh' ? 'EN' : '中'}
          </span>
        </Button>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <header className="text-center mb-16 pt-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary mb-6">
            <Mic className="w-10 h-10 text-primary-foreground" />
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            LiteMinute AI
          </h1>

          <p className="text-xl sm:text-2xl text-muted-foreground mb-8">
            {lang === 'zh' ? '语音转文字与智能摘要' : 'Speech to Text & Smart Summary'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <SignUpButton mode="modal">
              <Button size="lg" className="text-lg px-8 py-6">
                {lang === 'zh' ? '免费开始' : 'Get Started Free'}
              </Button>
            </SignUpButton>
            <SignInButton mode="modal">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                {lang === 'zh' ? '登录' : 'Sign In'}
              </Button>
            </SignInButton>
          </div>
        </header>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {features.map((feature, i) => (
            <Card key={i} className="h-full">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {lang === 'zh' ? feature.titleZh : feature.titleEn}
                </h3>
                <p className="text-muted-foreground">
                  {lang === 'zh' ? feature.descZh : feature.descEn}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
              {lang === 'zh' ? '安全可靠' : 'Secure & Reliable'}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            {lang === 'zh' ? '使用Clerk提供专业的身份验证' : 'Professional authentication powered by Clerk'}
          </p>
        </div>
      </div>
    </div>
  );
}
