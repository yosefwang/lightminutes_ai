import Groq from 'groq-sdk';

// Lazy initialize Groq client only when needed
let groqClient: Groq | null = null;

function getGroqClient(): Groq {
  if (!groqClient) {
    groqClient = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }
  return groqClient;
}

export async function transcribeAudio(audioBuffer: Buffer, mimeType: string, language?: string, prompt?: string): Promise<string> {
  const model = process.env.GROQ_STT_MODEL || 'whisper-large-v3';
  const lang = language || process.env.STT_LANGUAGE || 'zh';

  // Create a file-like object for Groq
  const file = new File([audioBuffer as unknown as BlobPart], 'audio.webm', { type: mimeType });

  const transcription = await getGroqClient().audio.transcriptions.create({
    file,
    model,
    language: lang,
    prompt: prompt || undefined,
    response_format: 'text',
  });

  return transcription as unknown as string;
}
