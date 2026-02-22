function getEnvVars() {
  return {
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    ANTHROPIC_MODEL: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022',
    LLM_LANGUAGE: process.env.LLM_LANGUAGE || 'zh',
  };
}

function getLanguageInstructions(language?: string) {
  const { LLM_LANGUAGE } = getEnvVars();
  const lang = language || LLM_LANGUAGE;
  if (lang === 'en') {
    return 'Please respond in English.';
  } else if (lang === 'bilingual') {
    return 'Please provide your response in both Chinese and English.';
  }
  return '请用中文回复。';
}

function buildDefaultPrompt(transcript: string, language?: string) {
  const { LLM_LANGUAGE } = getEnvVars();
  const lang = language || LLM_LANGUAGE;

  if (lang === 'en') {
    return `Please summarize the following meeting transcript in a clear and structured format:

Transcript:
${transcript}

Please organize your summary with:
1. Meeting Topic
2. Key Points (3-5 bullet points)
3. Action Items

${getLanguageInstructions(language)}`;
  } else if (lang === 'bilingual') {
    return `请将以下会议转录整理成清晰的摘要：

Transcript:
${transcript}

请按以下结构组织摘要（请同时提供中英文）：
1. 会议主题 / Meeting Topic
2. 关键要点 / Key Points（3-5点）
3. 待办事项 / Action Items

${getLanguageInstructions(language)}`;
  }

  // Default Chinese
  return `请将以下会议转录整理成一份清晰的摘要：

Transcript:
${transcript}

请按以下结构组织：
1. 会议主题
2. 关键要点（3-5点）
3. 待办事项

${getLanguageInstructions(language)}`;
}

export async function generateSummary(transcript: string, language?: string, promptTemplate?: string): Promise<string> {
  const { ANTHROPIC_API_KEY, ANTHROPIC_MODEL } = getEnvVars();
  if (!ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is not set');
  }

  let prompt: string;
  if (promptTemplate && promptTemplate.includes('{transcript}')) {
    prompt = promptTemplate.replace('{transcript}', transcript);
  } else if (promptTemplate) {
    prompt = `${promptTemplate}\n\nTranscript:\n${transcript}`;
  } else {
    prompt = buildDefaultPrompt(transcript, language);
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Anthropic API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.content[0].text;
}
