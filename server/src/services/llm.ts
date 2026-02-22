const anthropicModel = process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022';

const SUMMARY_PROMPT_ZH = `
请将以下转录文本整理为结构化摘要，使用 Markdown 格式。

要求：
1. 首先用 "# " 写出会议/对话的主题
2. 然后用 "## 关键要点" 列出 3-7 个最重要的内容点
3. 最后用 "## 待办事项" 列出所有需要执行的任务，用 "- [ ] " 开头

在摘要的最后，单独用一行 "TAGS:" 开头，然后列出3个主题标签，从主到次、从大到小描述这段音频的主题。
重要要求：
- 每个标签必须是一个英文单词
- 全部使用英文标签
- 用逗号分隔

例如：
TAGS: meeting, feedback, design

转录内容如下：
{transcript}
`;

const SUMMARY_PROMPT_EN = `
Please organize the following transcript into a structured summary using Markdown format.

Requirements:
1. Start with "# " for the topic of the meeting/conversation
2. Then use "## Key Points" to list 3-7 most important points
3. Finally use "## Action Items" to list all tasks, starting with "- [ ] "

At the end of the summary, on a separate line starting with "TAGS:", list 3 topic tags describing the audio theme from primary to secondary.
Important requirements:
- Each tag must be a single English word
- All tags must be in English
- Separate with commas

Example:
TAGS: meeting, feedback, design

Transcript:
{transcript}
`;

const SUMMARY_PROMPT_BILINGUAL = `
请将以下转录文本整理为结构化摘要，同时提供中文和英文版本，使用 Markdown 格式。

要求：
1. 先提供中文版本，然后是英文版本
2. 每个版本都用 "# " 写出主题
3. 然后用 "## 关键要点 / Key Points" 列出 3-7 个最重要的内容点
4. 最后用 "## 待办事项 / Action Items" 列出所有需要执行的任务，用 "- [ ] " 开头

在整个摘要的最后，单独用一行 "TAGS:" 开头，然后列出3个主题标签，从主到次、从大到小描述这段音频的主题。
重要要求：
- 每个标签必须是一个英文单词
- 全部使用英文标签
- 用逗号分隔

例如：
TAGS: meeting, feedback, design

格式示例：
---

# 中文摘要 / Chinese Summary

## 关键要点
- ...

## 待办事项
- [ ] ...

---

# English Summary

## Key Points
- ...

## Action Items
- [ ] ...

---

TAGS: meeting, feedback, design

转录内容如下：
{transcript}
`;

type SummaryLanguage = 'zh' | 'en' | 'bilingual';

export interface SummaryResult {
  summary: string;
  tags: string[];
}

export async function generateSummary(
  transcript: string,
  language: SummaryLanguage = 'zh',
  customPrompt?: string
): Promise<SummaryResult> {
  let prompt: string;

  // Tag instruction that gets appended to all prompts
  const tagInstruction = language === 'en'
    ? `\n\nAt the END of your response, on a NEW LINE starting with "TAGS:", list exactly 3 English single-word topic tags that best describe this audio, separated by commas. Example: TAGS: meeting, planning, brainstorm`
    : `\n\n在回答的最后，单独起一行以 "TAGS:" 开头，列出3个最能描述这段音频的英文单词标签，用逗号分隔。例如：TAGS: meeting, planning, brainstorm`;

  if (customPrompt) {
    let basePrompt = customPrompt.replace('{transcript}', transcript);
    // If custom prompt doesn't have {transcript} placeholder, append transcript
    if (!customPrompt.includes('{transcript}')) {
      const transcriptLabel = language === 'en' ? '\n\nTranscript:\n' : '\n\n转录内容如下：\n';
      basePrompt = customPrompt + transcriptLabel + transcript;
    }
    // Add tag instruction to custom prompt
    prompt = basePrompt + tagInstruction;
  } else {
    switch (language) {
      case 'zh':
        prompt = SUMMARY_PROMPT_ZH.replace('{transcript}', transcript);
        break;
      case 'en':
        prompt = SUMMARY_PROMPT_EN.replace('{transcript}', transcript);
        break;
      case 'bilingual':
        prompt = SUMMARY_PROMPT_BILINGUAL.replace('{transcript}', transcript);
        break;
      default:
        prompt = SUMMARY_PROMPT_ZH.replace('{transcript}', transcript);
    }
  }

  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return generateMockSummary(transcript, language);
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: anthropicModel,
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
      console.error('Anthropic API error:', response.status, await response.text());
      return generateMockSummary(transcript, language);
    }

    const data = await response.json();
    const text = data.content[0].text;
    return parseSummaryAndTags(text);
  } catch (err) {
    console.error('LLM call failed, using mock summary:', err);
    return generateMockSummary(transcript, language);
  }
}

function parseSummaryAndTags(text: string): SummaryResult {
  const tagsLineRegex = /\nTAGS:\s*(.+)$/i;
  const match = text.match(tagsLineRegex);

  let tags: string[] = [];
  let summary = text;

  if (match) {
    const tagsStr = match[1].trim();
    tags = tagsStr
      .split(/[,，\s]+/)
      .map(t => t.trim().toLowerCase().replace(/[^a-z0-9_-]/g, ''))
      .filter(t => t.length > 0)
      .slice(0, 3);
    summary = text.replace(tagsLineRegex, '').trim();
  }

  if (tags.length === 0) {
    tags = ['recording', 'conversation', 'notes'];
  }

  return { summary, tags };
}

function generateMockSummary(transcript: string, language: SummaryLanguage): SummaryResult {
  switch (language) {
    case 'zh':
      return {
        summary: `# 录音摘要

## 关键要点
- ${transcript.slice(0, 50)}...

## 待办事项
- [ ] 查看完整转录内容
- [ ] 配置 API Key 启用 AI 摘要

TAGS: recording, conversation, notes`,
        tags: ['recording', 'conversation', 'notes']
      };

    case 'en':
      return {
        summary: `# Recording Summary

## Key Points
- ${transcript.slice(0, 50)}...

## Action Items
- [ ] Review full transcript
- [ ] Configure API Key for AI summary

TAGS: recording, conversation, notes`,
        tags: ['recording', 'conversation', 'notes']
      };

    case 'bilingual':
    default:
      return {
        summary: `---

# 中文摘要 / Chinese Summary

## 关键要点
- ${transcript.slice(0, 30)}...

## 待办事项
- [ ] 查看完整转录内容
- [ ] 配置 API Key 启用 AI 摘要

---

# English Summary

## Key Points
- ${transcript.slice(0, 30)}...

## Action Items
- [ ] Review full transcript
- [ ] Configure API Key for AI summary

---

TAGS: recording, conversation, notes`,
        tags: ['recording', 'conversation', 'notes']
      };
  }
}
