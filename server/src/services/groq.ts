import Groq from 'groq-sdk';
import fs from 'fs';

const apiKey = process.env.GROQ_API_KEY;
const groq = apiKey ? new Groq({ apiKey }) : null;
const sttModel = process.env.GROQ_STT_MODEL || 'whisper-large-v3';
const sttLanguage = process.env.STT_LANGUAGE || 'zh';

export async function transcribeAudio(audioPath: string, prompt?: string): Promise<string> {
  if (!groq) {
    return '请配置 GROQ_API_KEY 以启用语音转文字功能。';
  }

  const file = fs.createReadStream(audioPath);

  const options: any = {
    file,
    model: sttModel,
    language: sttLanguage,
    response_format: 'text',
  };

  // Only add prompt if it's not empty
  if (prompt && prompt.trim()) {
    options.prompt = prompt;
  }

  const response = await groq.audio.transcriptions.create(options);

  return response as unknown as string;
}
