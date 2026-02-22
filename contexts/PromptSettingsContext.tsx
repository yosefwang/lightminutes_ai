'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useApp } from './AppContext';

export type PromptType = 'transcribe' | 'summary';

export interface PromptTemplate {
  id: string;
  name: string;
  content: string;
  type: PromptType;
}

// Chinese defaults
const DEFAULT_TRANSCRIBE_PROMPTS_ZH: PromptTemplate[] = [
  {
    id: 'transcribe-default-zh',
    name: '默认转录',
    type: 'transcribe',
    content: ``,
  },
];

const DEFAULT_SUMMARY_PROMPTS_ZH: PromptTemplate[] = [
  {
    id: 'summary-default-zh',
    name: '默认摘要',
    type: 'summary',
    content: `请将以下转录内容整理成一份清晰的会议摘要，包括：

1. 会议主题
2. 关键要点（3-5个）
3. 待办事项

请使用简洁明了的语言。`,
  },
  {
    id: 'summary-detailed-zh',
    name: '详细笔记',
    type: 'summary',
    content: `请详细分析以下转录内容，提供：

1. 完整的会议概述
2. 每个讨论点的详细说明
3. 做出的决定
4. 分配的行动项和负责人
5. 下次会议的安排

请尽可能详细地记录所有信息。`,
  },
  {
    id: 'summary-action-zh',
    name: '行动项聚焦',
    type: 'summary',
    content: `请重点关注以下转录内容中的行动项：

1. 简要主题
2. 所有待办事项（详细列出）
3. 每项任务的负责人（如果提到）
4. 时间要求（如果提到）

格式要清晰，便于执行。`,
  },
];

// English defaults
const DEFAULT_TRANSCRIBE_PROMPTS_EN: PromptTemplate[] = [
  {
    id: 'transcribe-default-en',
    name: 'Default Transcribe',
    type: 'transcribe',
    content: ``,
  },
];

const DEFAULT_SUMMARY_PROMPTS_EN: PromptTemplate[] = [
  {
    id: 'summary-default-en',
    name: 'Default Summary',
    type: 'summary',
    content: `Please organize the following transcript into a clear meeting summary including:

1. Meeting topic
2. Key points (3-5 items)
3. Action items

Use clear and concise language.`,
  },
  {
    id: 'summary-detailed-en',
    name: 'Detailed Notes',
    type: 'summary',
    content: `Please analyze the following transcript in detail and provide:

1. Complete meeting overview
2. Detailed explanation of each discussion point
3. Decisions made
4. Assigned action items and responsible persons
5. Next meeting arrangements

Please record all information as detailed as possible.`,
  },
  {
    id: 'summary-action-en',
    name: 'Action Focused',
    type: 'summary',
    content: `Please focus on the action items in the following transcript:

1. Brief topic
2. All action items (list in detail)
3. Responsible person for each task (if mentioned)
4. Time requirements (if mentioned)

Format should be clear and easy to execute.`,
  },
];

const getDefaultPrompts = (lang: 'zh' | 'en'): PromptTemplate[] => {
  if (lang === 'en') {
    return [
      ...DEFAULT_TRANSCRIBE_PROMPTS_EN,
      ...DEFAULT_SUMMARY_PROMPTS_EN,
    ];
  }
  return [
    ...DEFAULT_TRANSCRIBE_PROMPTS_ZH,
    ...DEFAULT_SUMMARY_PROMPTS_ZH,
  ];
};

const getDefaultActiveIds = (lang: 'zh' | 'en') => {
  if (lang === 'en') {
    return {
      transcribe: 'transcribe-default-en',
      summary: 'summary-default-en',
    };
  }
  return {
    transcribe: 'transcribe-default-zh',
    summary: 'summary-default-zh',
  };
};

const STORAGE_KEY = 'promptSettings';
const STORAGE_KEY_ACTIVE_TRANSCRIBE = 'promptSettings_active_transcribe';
const STORAGE_KEY_ACTIVE_SUMMARY = 'promptSettings_active_summary';
const STORAGE_KEY_LANG = 'promptSettings_lang';

interface PromptSettingsContextType {
  prompts: PromptTemplate[];
  activeTranscribePromptId: string;
  activeSummaryPromptId: string;
  setActiveTranscribePromptId: (id: string) => void;
  setActiveSummaryPromptId: (id: string) => void;
  updatePrompt: (id: string, updates: { name?: string; content?: string }) => void;
  addPrompt: (name: string, content: string, type: PromptType) => void;
  deletePrompt: (id: string) => void;
  getPromptsByType: (type: PromptType) => PromptTemplate[];
  getActiveTranscribePrompt: () => PromptTemplate;
  getActiveSummaryPrompt: () => PromptTemplate;
  resetToLanguageDefaults: (lang: 'zh' | 'en') => void;
}

const PromptSettingsContext = createContext<PromptSettingsContextType | undefined>(undefined);

export function PromptSettingsProvider({ children }: { children: ReactNode }) {
  const { lang } = useApp();

  // Get initial language
  const getInitialLang = (): 'zh' | 'en' => {
    if (typeof window === 'undefined') return 'zh';
    try {
      const savedPromptLang = localStorage.getItem(STORAGE_KEY_LANG);
      const appLang = localStorage.getItem('lang');
      return (savedPromptLang as 'zh' | 'en') || (appLang as 'zh' | 'en') || 'zh';
    } catch {
      return 'zh';
    }
  };

  const initialLang = getInitialLang();
  const defaultIds = getDefaultActiveIds(initialLang);

  const [prompts, setPrompts] = useState<PromptTemplate[]>(() => {
    if (typeof window === 'undefined') return getDefaultPrompts('zh');
    try {
      const savedLang = localStorage.getItem(STORAGE_KEY_LANG);
      const appLang = localStorage.getItem('lang') || 'zh';

      // If language changed, reset to defaults
      if (savedLang && savedLang !== appLang) {
        localStorage.setItem(STORAGE_KEY_LANG, appLang);
        return getDefaultPrompts(appLang as 'zh' | 'en');
      }

      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p: any) => ({
            ...p,
            type: p.type || 'summary',
          }));
        }
      }
    } catch {
      // Ignore parsing errors
    }
    const lang = getInitialLang();
    localStorage.setItem(STORAGE_KEY_LANG, lang);
    return getDefaultPrompts(lang);
  });

  const [activeTranscribePromptId, setActiveTranscribePromptId] = useState<string>(() => {
    if (typeof window === 'undefined') return defaultIds.transcribe;
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_TRANSCRIBE);
      return saved || defaultIds.transcribe;
    } catch {
      return defaultIds.transcribe;
    }
  });

  const [activeSummaryPromptId, setActiveSummaryPromptId] = useState<string>(() => {
    if (typeof window === 'undefined') return defaultIds.summary;
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_SUMMARY);
      return saved || defaultIds.summary;
    } catch {
      return defaultIds.summary;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));
  }, [prompts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ACTIVE_TRANSCRIBE, activeTranscribePromptId);
  }, [activeTranscribePromptId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ACTIVE_SUMMARY, activeSummaryPromptId);
  }, [activeSummaryPromptId]);

  const resetToLanguageDefaults = useCallback((lang: 'zh' | 'en') => {
    const defaults = getDefaultPrompts(lang);
    const defaultIdsForLang = getDefaultActiveIds(lang);
    setPrompts(defaults);
    setActiveTranscribePromptId(defaultIdsForLang.transcribe);
    setActiveSummaryPromptId(defaultIdsForLang.summary);
    localStorage.setItem(STORAGE_KEY_LANG, lang);
  }, []);

  // Listen to language changes from AppContext and reset prompts
  useEffect(() => {
    resetToLanguageDefaults(lang);
  }, [lang, resetToLanguageDefaults]);

  const updatePrompt = (id: string, updates: { name?: string; content?: string }) => {
    setPrompts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const addPrompt = (name: string, content: string, type: PromptType) => {
    const newPrompt: PromptTemplate = {
      id: `prompt_${Date.now()}`,
      name,
      content,
      type,
    };
    setPrompts((prev) => [...prev, newPrompt]);
  };

  const deletePrompt = (id: string) => {
    const prompt = prompts.find((p) => p.id === id);
    if (!prompt) return;

    const promptsOfSameType = prompts.filter((p) => p.type === prompt.type);
    if (promptsOfSameType.length <= 1) return;

    setPrompts((prev) => prev.filter((p) => p.id !== id));

    if (activeTranscribePromptId === id) {
      const remaining = prompts.find((p) => p.id !== id && p.type === 'transcribe');
      if (remaining) {
        setActiveTranscribePromptId(remaining.id);
      }
    }
    if (activeSummaryPromptId === id) {
      const remaining = prompts.find((p) => p.id !== id && p.type === 'summary');
      if (remaining) {
        setActiveSummaryPromptId(remaining.id);
      }
    }
  };

  const getPromptsByType = (type: PromptType) => {
    return prompts.filter((p) => p.type === type);
  };

  const getActiveTranscribePrompt = () => {
    return (
      prompts.find((p) => p.id === activeTranscribePromptId && p.type === 'transcribe') ||
      prompts.find((p) => p.type === 'transcribe') ||
      prompts[0]
    );
  };

  const getActiveSummaryPrompt = () => {
    return (
      prompts.find((p) => p.id === activeSummaryPromptId && p.type === 'summary') ||
      prompts.find((p) => p.type === 'summary') ||
      prompts[0]
    );
  };

  return (
    <PromptSettingsContext.Provider
      value={{
        prompts,
        activeTranscribePromptId,
        activeSummaryPromptId,
        setActiveTranscribePromptId,
        setActiveSummaryPromptId,
        updatePrompt,
        addPrompt,
        deletePrompt,
        getPromptsByType,
        getActiveTranscribePrompt,
        getActiveSummaryPrompt,
        resetToLanguageDefaults,
      }}
    >
      {children}
    </PromptSettingsContext.Provider>
  );
}

export function usePromptSettings() {
  const context = useContext(PromptSettingsContext);
  if (context === undefined) {
    throw new Error('usePromptSettings must be used within a PromptSettingsProvider');
  }
  return context;
}
