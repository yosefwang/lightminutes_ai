'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useApp } from './AppContext';

export type PromptType = 'transcribe' | 'summary';

export interface BilingualContent {
  zh: string;
  en: string;
}

export interface BilingualName {
  zh: string;
  en: string;
}

export interface PromptTemplate {
  id: string;
  name: BilingualName | string;
  content: BilingualContent | string;
  type: PromptType;
  isDefault?: boolean;
}

// Type guards for backward compatibility
export function isBilingualName(name: any): name is BilingualName {
  return name && typeof name === 'object' && 'zh' in name && 'en' in name;
}

export function isBilingualContent(content: any): content is BilingualContent {
  return content && typeof content === 'object' && 'zh' in content && 'en' in content;
}

// Helper functions to get content for current language
export function getPromptName(prompt: PromptTemplate, lang: 'zh' | 'en'): string {
  if (isBilingualName(prompt.name)) {
    return prompt.name[lang];
  }
  return prompt.name as string;
}

export function getPromptContent(prompt: PromptTemplate, lang: 'zh' | 'en'): string {
  if (isBilingualContent(prompt.content)) {
    return prompt.content[lang];
  }
  return prompt.content as string;
}

// Chinese defaults
const DEFAULT_TRANSCRIBE_PROMPTS_ZH: PromptTemplate[] = [
  {
    id: 'transcribe-default-zh',
    name: { zh: '默认转录', en: 'Default Transcribe' },
    type: 'transcribe',
    content: { zh: '', en: '' },
    isDefault: true,
  },
];

const DEFAULT_SUMMARY_PROMPTS_ZH: PromptTemplate[] = [
  {
    id: 'summary-default-zh',
    name: { zh: '默认摘要', en: 'Default Summary' },
    type: 'summary',
    content: {
      zh: `请将以下转录内容整理成一份清晰的会议摘要，包括：

1. 会议主题
2. 关键要点（3-5个）
3. 待办事项

请使用简洁明了的语言。`,
      en: `Please organize the following transcript into a clear meeting summary including:

1. Meeting topic
2. Key points (3-5 items)
3. Action items

Use clear and concise language.`
    },
    isDefault: true,
  },
  {
    id: 'summary-detailed-zh',
    name: { zh: '详细笔记', en: 'Detailed Notes' },
    type: 'summary',
    content: {
      zh: `请详细分析以下转录内容，提供：

1. 完整的会议概述
2. 每个讨论点的详细说明
3. 做出的决定
4. 分配的行动项和负责人
5. 下次会议的安排

请尽可能详细地记录所有信息。`,
      en: `Please analyze the following transcript in detail and provide:

1. Complete meeting overview
2. Detailed explanation of each discussion point
3. Decisions made
4. Assigned action items and responsible persons
5. Next meeting arrangements

Please record all information as detailed as possible.`
    },
    isDefault: true,
  },
  {
    id: 'summary-action-zh',
    name: { zh: '行动项聚焦', en: 'Action Focused' },
    type: 'summary',
    content: {
      zh: `请重点关注以下转录内容中的行动项：

1. 简要主题
2. 所有待办事项（详细列出）
3. 每项任务的负责人（如果提到）
4. 时间要求（如果提到）

格式要清晰，便于执行。`,
      en: `Please focus on the action items in the following transcript:

1. Brief topic
2. All action items (list in detail)
3. Responsible person for each task (if mentioned)
4. Time requirements (if mentioned)

Format should be clear and easy to execute.`
    },
    isDefault: true,
  },
  {
    id: 'summary-faithful-clean-zh',
    name: { zh: '忠实文字整理', en: 'Faithful Transcript Cleaning' },
    type: 'summary',
    content: {
      zh: `请对以下转录内容进行忠实的文字整理：

1. 尽量保留所有原文内容
2. 原文不清楚、不通顺的地方，做最小程度的改写和补写，确保通顺和逻辑顺畅
3. 需要列表的地方请使用列表格式
4. 需要有序列表的地方请使用带数字的有序列表

请忠实于原意，不要添加额外的解读或摘要。`,
      en: `Please perform faithful cleaning of the following transcript:

1. Preserve all original content as much as possible
2. Where the original text is unclear or incoherent, make minimal rewrites and additions to ensure fluency and logical flow
3. Use bullet lists where lists are needed
4. Use numbered lists where ordered lists are needed

Please be faithful to the original intent, do not add additional interpretation or summary.`
    },
    isDefault: true,
  },
];

// English defaults
const DEFAULT_TRANSCRIBE_PROMPTS_EN: PromptTemplate[] = [
  {
    id: 'transcribe-default-en',
    name: { zh: '默认转录', en: 'Default Transcribe' },
    type: 'transcribe',
    content: { zh: '', en: '' },
    isDefault: true,
  },
];

const DEFAULT_SUMMARY_PROMPTS_EN: PromptTemplate[] = [
  {
    id: 'summary-default-en',
    name: { zh: '默认摘要', en: 'Default Summary' },
    type: 'summary',
    content: {
      zh: `请将以下转录内容整理成一份清晰的会议摘要，包括：

1. 会议主题
2. 关键要点（3-5个）
3. 待办事项

请使用简洁明了的语言。`,
      en: `Please organize the following transcript into a clear meeting summary including:

1. Meeting topic
2. Key points (3-5 items)
3. Action items

Use clear and concise language.`
    },
    isDefault: true,
  },
  {
    id: 'summary-detailed-en',
    name: { zh: '详细笔记', en: 'Detailed Notes' },
    type: 'summary',
    content: {
      zh: `请详细分析以下转录内容，提供：

1. 完整的会议概述
2. 每个讨论点的详细说明
3. 做出的决定
4. 分配的行动项和负责人
5. 下次会议的安排

请尽可能详细地记录所有信息。`,
      en: `Please analyze the following transcript in detail and provide:

1. Complete meeting overview
2. Detailed explanation of each discussion point
3. Decisions made
4. Assigned action items and responsible persons
5. Next meeting arrangements

Please record all information as detailed as possible.`
    },
    isDefault: true,
  },
  {
    id: 'summary-action-en',
    name: { zh: '行动项聚焦', en: 'Action Focused' },
    type: 'summary',
    content: {
      zh: `请重点关注以下转录内容中的行动项：

1. 简要主题
2. 所有待办事项（详细列出）
3. 每项任务的负责人（如果提到）
4. 时间要求（如果提到）

格式要清晰，便于执行。`,
      en: `Please focus on the action items in the following transcript:

1. Brief topic
2. All action items (list in detail)
3. Responsible person for each task (if mentioned)
4. Time requirements (if mentioned)

Format should be clear and easy to execute.`
    },
    isDefault: true,
  },
  {
    id: 'summary-faithful-en',
    name: { zh: '忠实文字整理', en: 'Faithful Transcript Cleaning' },
    type: 'summary',
    content: {
      zh: `请对以下转录内容进行忠实的文字整理：

1. 尽量保留所有原文内容
2. 原文不清楚、不通顺的地方，做最小程度的改写和补写，确保通顺和逻辑顺畅
3. 需要列表的地方请使用列表格式
4. 需要有序列表的地方请使用带数字的有序列表

请忠实于原意，不要添加额外的解读或摘要。`,
      en: `Please perform faithful cleaning of the following transcript:

1. Preserve all original content as much as possible
2. Where the original text is unclear or incoherent, make minimal rewrites and additions to ensure fluency and logical flow
3. Use bullet lists where lists are needed
4. Use numbered lists where ordered lists are needed

Please be faithful to the original intent, do not add additional interpretation or summary.`
    },
    isDefault: true,
  },
];

const getDefaultPrompts = (): PromptTemplate[] => {
  return [
    ...DEFAULT_TRANSCRIBE_PROMPTS_ZH,
    ...DEFAULT_SUMMARY_PROMPTS_ZH,
  ];
};

const getDefaultActiveIds = () => {
  return {
    transcribe: 'transcribe-default-zh',
    summary: 'summary-default-zh',
  };
};

const STORAGE_KEY = 'promptSettings_v2';
const STORAGE_KEY_ACTIVE_TRANSCRIBE = 'promptSettings_active_transcribe_v2';
const STORAGE_KEY_ACTIVE_SUMMARY = 'promptSettings_active_summary_v2';

interface PromptSettingsContextType {
  prompts: PromptTemplate[];
  activeTranscribePromptId: string;
  activeSummaryPromptId: string;
  setActiveTranscribePromptId: (id: string) => void;
  setActiveSummaryPromptId: (id: string) => void;
  updatePrompt: (id: string, updates: { name?: BilingualName | string; content?: BilingualContent | string }) => void;
  addPrompt: (name: BilingualName | string, content: BilingualContent | string, type: PromptType) => Promise<void>;
  deletePrompt: (id: string) => void;
  getPromptsByType: (type: PromptType) => PromptTemplate[];
  getActiveTranscribePrompt: () => PromptTemplate;
  getActiveSummaryPrompt: () => PromptTemplate;
  getPromptName: (prompt: PromptTemplate) => string;
  getPromptContent: (prompt: PromptTemplate) => string;
  isProcessingPrompt: boolean;
}

const PromptSettingsContext = createContext<PromptSettingsContextType | undefined>(undefined);

// Function to detect language of text
function detectLanguage(text: string): 'zh' | 'en' {
  // Simple detection: check for Chinese characters
  const chineseRegex = /[\u4e00-\u9fff]/;
  return chineseRegex.test(text) ? 'zh' : 'en';
}

// Function to clean and optimize prompt
async function cleanAndTranslatePrompt(
  name: string,
  content: string,
  detectedLang: 'zh' | 'en'
): Promise<{ name: BilingualName; content: BilingualContent }> {
  // For now, return basic bilingual structure
  // In a real implementation, you would call LLM here
  const otherLang = detectedLang === 'zh' ? 'en' : 'zh';

  return {
    name: detectedLang === 'zh'
      ? { zh: name, en: name }
      : { zh: name, en: name },
    content: detectedLang === 'zh'
      ? { zh: content, en: content }
      : { zh: content, en: content }
  };
}

export function PromptSettingsProvider({ children }: { children: ReactNode }) {
  const { lang } = useApp();
  const [isProcessingPrompt, setIsProcessingPrompt] = useState(false);

  // Load prompts from localStorage or use defaults
  const [prompts, setPrompts] = useState<PromptTemplate[]>(() => {
    if (typeof window === 'undefined') return getDefaultPrompts();
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p: any) => ({
            ...p,
            type: p.type || 'summary',
            isDefault: p.isDefault || false,
          }));
        }
      }
    } catch {
      // Ignore parsing errors
    }
    return getDefaultPrompts();
  });

  const defaultIds = getDefaultActiveIds();

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

  // Save prompts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));
  }, [prompts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ACTIVE_TRANSCRIBE, activeTranscribePromptId);
  }, [activeTranscribePromptId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ACTIVE_SUMMARY, activeSummaryPromptId);
  }, [activeSummaryPromptId]);

  // Get localized name for current language
  const getPromptNameLocal = useCallback((prompt: PromptTemplate): string => {
    return getPromptName(prompt, lang);
  }, [lang]);

  // Get localized content for current language
  const getPromptContentLocal = useCallback((prompt: PromptTemplate): string => {
    return getPromptContent(prompt, lang);
  }, [lang]);

  const updatePrompt = (id: string, updates: { name?: BilingualName | string; content?: BilingualContent | string }) => {
    setPrompts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const addPrompt = async (name: string | BilingualName, content: string | BilingualContent, type: PromptType) => {
    setIsProcessingPrompt(true);
    try {
      let bilingualName: BilingualName;
      let bilingualContent: BilingualContent;

      // If input is already bilingual, use it directly
      if (isBilingualName(name) && isBilingualContent(content)) {
        bilingualName = name;
        bilingualContent = content;
      } else {
        // Detect language and clean/translate
        const nameStr = typeof name === 'string' ? name : (lang === 'zh' ? name.zh : name.en);
        const contentStr = typeof content === 'string' ? content : (lang === 'zh' ? content.zh : content.en);
        const detectedLang = detectLanguage(contentStr || nameStr);
        const result = await cleanAndTranslatePrompt(nameStr, contentStr, detectedLang);
        bilingualName = result.name;
        bilingualContent = result.content;
      }

      const newPrompt: PromptTemplate = {
        id: `prompt_${Date.now()}`,
        name: bilingualName,
        content: bilingualContent,
        type,
        isDefault: false,
      };
      setPrompts((prev) => [...prev, newPrompt]);
    } finally {
      setIsProcessingPrompt(false);
    }
  };

  const deletePrompt = (id: string) => {
    const prompt = prompts.find((p) => p.id === id);
    if (!prompt || prompt.isDefault) return;

    const promptsOfSameType = prompts.filter((p) => p.type === prompt.type);
    if (promptsOfSameType.filter((p) => !p.isDefault).length <= 0) return;

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
        getPromptName: getPromptNameLocal,
        getPromptContent: getPromptContentLocal,
        isProcessingPrompt,
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
