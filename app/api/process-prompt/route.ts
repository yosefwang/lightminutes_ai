import { NextResponse } from 'next/server';
import { getAuthUserId } from '@/lib/server/auth';
import { generateSummary } from '@/lib/server/services/llm';

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const userId = await getAuthUserId();
    const body = await request.json();
    const { name, content, sourceLanguage } = body;

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
  }

    const targetLanguage = sourceLanguage === 'zh' ? 'en' : 'zh';

    // Clean and optimize the prompt
    const cleanedPrompt = await cleanAndOptimizePrompt(content, sourceLanguage);

    // Translate to the other language
    const translatedPrompt = await translatePrompt(cleanedPrompt, sourceLanguage, targetLanguage);

    // Also translate the name
    const cleanedName = name || (sourceLanguage === 'zh' ? '自定义模板' : 'Custom Template');
    const translatedName = await translatePromptName(cleanedName, sourceLanguage, targetLanguage);

    const result = {
      [sourceLanguage]: {
        name: cleanedName,
        content: cleanedPrompt,
      },
      [targetLanguage]: {
        name: translatedName,
        content: translatedPrompt,
      },
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Process prompt error:', error);
    return NextResponse.json({ error: 'Failed to process prompt' }, { status: 500 });
  }
}

async function cleanAndOptimizePrompt(prompt: string, lang: 'zh' | 'en'): Promise<string> {
  // Simple cleaning for now - in production you'd use LLM
  return prompt.trim();
}

async function translatePrompt(prompt: string, fromLang: 'zh' | 'en', toLang: 'zh' | 'en'): Promise<string> {
  // Simple translation for now - in production you'd use LLM
  return prompt;
}

async function translatePromptName(name: string, fromLang: 'zh' | 'en', toLang: 'zh' | 'en'): Promise<string> {
  // Simple translation for now - in production you'd use LLM
  return name;
}
