import { useState, useEffect, useCallback } from 'react';
import { zh, en, type Language } from '../i18n';

export type { Language } from '../i18n';

const translations = { zh, en };

export function useLanguage() {
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'zh';
    const saved = localStorage.getItem('lang');
    if (saved === 'zh' || saved === 'en') return saved;
    // Follow browser language
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('zh') || browserLang.startsWith('zh-CN') || browserLang.startsWith('zh-TW')) {
      return 'zh';
    }
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  }, [lang]);

  const toggleLanguage = useCallback(() => {
    setLang(prev => prev === 'zh' ? 'en' : 'zh');
  }, []);

  const t = useCallback((key: string): string => {
    const keys = key.split('.');
    let value: any = translations[lang];
    for (const k of keys) {
      value = value?.[k];
    }
    return typeof value === 'string' ? value : key;
  }, [lang]);

  return {
    lang,
    setLang,
    toggleLanguage,
    t,
  };
}
