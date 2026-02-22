# LiteMinute AI - 详细开发指南 / Detailed Development Guide

> 中英文双语文档 / Bilingual Chinese-English Documentation

---

## 📋 目录 / Table of Contents

- [项目概述 / Project Overview](#项目概述--project-overview)
- [快速开始 / Quick Start](#快速开始--quick-start)
- [技术架构 / Technical Architecture](#技术架构--technical-architecture)
- [数据存储设计 / Data Storage Design](#数据存储设计--data-storage-design)
- [API 接口文档 / API Documentation](#api-接口文档--api-documentation)
- [前端开发 / Frontend Development](#前端开发--frontend-development)
- [后端开发 / Backend Development](#后端开发--backend-development)
- [Clerk 身份验证 / Clerk Authentication](#clerk-身份验证--clerk-authentication)
- [配色主题系统 / Color Theme System](#配色主题系统--color-theme-system)
- [提示词设置系统 / Prompt Settings System](#提示词设置系统--prompt-settings-system)
- [部署指南 / Deployment Guide](#部署指南--deployment-guide)

---

## 项目概述 / Project Overview

### 中文

LiteMinute AI 是一个极简、自控的语音转文字与摘要工具，采用常驻 Node.js 进程而非 Serverless 架构，避免冷启动延迟和文件大小限制。

**核心功能：**
- 🔐 Clerk 身份验证（登录/注册/登出）
- 🎤 移动端优先的录音界面
- 📤 自动上传音频文件
- 🤖 AI 语音转文字（Groq Whisper）
- 📝 智能摘要生成（Claude / DeepSeek）
- 💾 JSON 本地持久化存储
- ☁️ Cloudflare R2 云存储集成
- 📊 数据统计图表
- ⚙️ 可自定义提示词模板系统
- 🎨 5 种优雅配色主题（各有明暗模式）
- 🌓 明暗模式切换
- 🌍 中英文双语界面

### English

LiteMinute AI is a minimalist, self-controlled speech-to-text and summarization tool. It uses a persistent Node.js process instead of Serverless architecture to avoid cold-start delays and file size limitations.

**Core Features:**
- 🔐 Clerk Authentication (Sign in/Sign up/Sign out)
- 🎤 Mobile-first recording interface
- 📤 Automatic audio file upload
- 🤖 AI speech-to-text (Groq Whisper)
- 📝 Intelligent summary generation (Claude / DeepSeek)
- 💾 JSON local persistent storage
- ☁️ Cloudflare R2 cloud storage integration
- 📊 Data statistics charts
- ⚙️ Customizable prompt template system
- 🎨 5 elegant color themes (each with light/dark mode)
- 🌓 Light/dark mode toggle
- 🌍 Bilingual Chinese-English interface

---

## 快速开始 / Quick Start

### 前置要求 / Prerequisites

- Node.js >= 20
- npm 或 bun
- [Clerk](https://clerk.com) 账号 / Clerk account
- Groq API Key
- Anthropic API Key (可选 / Optional)
- Cloudflare R2 凭证 (可选 / Optional)

### 安装步骤 / Installation Steps

```bash
# 1. 克隆项目 / Clone the project
git clone <repository-url>
cd lightminute_ai

# 2. 安装前端依赖 / Install frontend dependencies
cd client
npm install
cd ..

# 3. 安装后端依赖 / Install backend dependencies
cd server
npm install
cd ..

# 4. 配置环境变量 / Configure environment variables

# 前端 / Frontend
cd client
cp .env.example .env
# 编辑 .env 填入 Clerk Publishable Key
# Edit .env with Clerk Publishable Key

# 后端 / Backend
cd ../server
cp .env.example .env
# 编辑 .env 填入 API keys
# Edit .env with API keys

# 5. 启动开发服务器 / Start development servers

# 终端1: 启动后端 / Terminal 1: Start backend
cd server
npm run dev

# 终端2: 启动前端 / Terminal 2: Start frontend
cd client
npm run dev
```

---

## 技术架构 / Technical Architecture

### 目录结构 / Project Structure

```
lightminute_ai/
├── client/                          # React 前端 / Frontend
│   ├── src/
│   │   ├── components/              # 组件 / Components
│   │   │   ├── ui/                  # Shadcn UI 基础组件
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   └── badge.tsx
│   │   │   ├── LandingPage.tsx      # 登录页 / Landing page
│   │   │   ├── UserMenu.tsx         # 用户菜单 / User menu
│   │   │   ├── PromptSettingsModal.tsx  # 提示词设置 / Prompt settings
│   │   │   ├── StatsChart.tsx       # 统计图表 / Stats charts
│   │   │   ├── AudioPlayer.tsx      # 音频播放器 / Audio player
│   │   │   ├── Recorder.tsx         # 录音组件 / Recorder
│   │   │   ├── RecordingList.tsx    # 录音列表 / Recording list
│   │   │   ├── CloudTab.tsx         # 云端标签 / Cloud tab
│   │   │   ├── ThemeToggle.tsx      # 主题切换 / Theme toggle
│   │   │   ├── LanguageToggle.tsx   # 语言切换 / Language toggle
│   │   │   └── ColorThemePicker.tsx # 配色选择 / Color theme picker
│   │   ├── contexts/                # React Contexts
│   │   │   ├── AppContext.tsx       # 应用状态 / App state
│   │   │   ├── ThemeColorContext.tsx # 配色主题 / Color theme
│   │   │   └── PromptSettingsContext.tsx # 提示词设置 / Prompt settings
│   │   ├── hooks/                   # 自定义 Hooks / Custom Hooks
│   │   │   ├── useLanguage.ts
│   │   │   └── useTheme.ts
│   │   ├── i18n/                    # 国际化 / Internationalization
│   │   │   ├── index.ts
│   │   │   ├── zh.json
│   │   │   └── en.json
│   │   ├── lib/                     # 工具函数 / Utilities
│   │   │   └── utils.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── server/                          # Hono 后端 / Backend
│   ├── src/
│   │   ├── db/
│   │   │   ├── index.ts             # JSON DB 实现 / JSON DB implementation
│   │   │   └── schema.ts            # 类型定义 / Type definitions
│   │   ├── services/
│   │   │   ├── groq.ts              # STT 服务 / Speech-to-Text
│   │   │   ├── llm.ts               # 摘要服务 / Summarization
│   │   │   └── r2.ts                # R2 云存储 / R2 cloud storage
│   │   └── index.ts                 # 路由 / Routes
│   ├── uploads/                     # 音频文件存储 / Audio storage
│   ├── data/                        # JSON 数据文件 / JSON data files
│   └── package.json
├── README.md
└── DEVELOPMENT.md                   # 本文档 / This document
```

### 技术栈详情 / Tech Stack Details

| 层级 / Layer | 技术 / Technology | 说明 / Description |
|-------------|------------------|-------------------|
| 前端 / Frontend | React 18 | UI 框架 / Framework |
| | Vite | 构建工具 / Bundler |
| | Tailwind CSS | 样式框架 / Styling |
| | Shadcn UI | UI 组件库 / Component library |
| | Framer Motion | 动画库 / Animations |
| | Lucide React | 图标库 / Icons |
| | Recharts | 图表库 / Charts |
| | Clerk React | 身份验证 / Authentication |
| 后端 / Backend | Hono.js | Web 框架 / Framework |
| | Node.js | 运行时 / Runtime |
| 数据存储 / Data Storage | JSON 文件 / JSON files | 数据存储 / Storage |
| AI 服务 / AI Services | Groq Whisper | 语音转文字 / STT |
| | Claude 3.5 Sonnet | 摘要生成 / Summarization |
| 云存储 / Cloud Storage | Cloudflare R2 | S3 兼容存储 / S3-compatible storage |

---

## 数据存储设计 / Data Storage Design

### 类型定义 / Type Definitions

```typescript
// server/src/db/schema.ts
export interface Recording {
  id: string;
  title: string;
  audioPath: string;
  transcript: string | null;
  summary: string | null;
  status: 'recording' | 'processing' | 'completed' | 'failed';
  duration: number | null;
  createdAt: number;
  cloudStatus: 'not_uploaded' | 'uploading' | 'uploaded' | 'deleting';
  cloudKey: string | null;
  cloudUrl: string | null;
  tags: string[];
  summaryLanguage: 'zh' | 'en' | 'bilingual';
}
```

### 状态说明 / Status Explanation

| 状态 / Status | 说明 / Description |
|--------------|-------------------|
| `recording` | 正在录音 / Currently recording |
| `processing` | 正在处理（转写+摘要）/ Processing (transcription + summarization) |
| `completed` | 处理完成 / Completed |
| `failed` | 处理失败 / Failed |

---

## API 接口文档 / API Documentation

### 基础信息 / Base Info

- Base URL: `http://localhost:8787`
- Content-Type: `application/json` (except upload)

### 1. 上传音频 / Upload Audio

**POST** `/api/upload`

上传音频文件并创建记录。

**请求 / Request:**
- Content-Type: `multipart/form-data`
- Body:
  - `audio`: File - 音频文件 / Audio file
  - `duration`: number - 录音时长（秒）/ Duration in seconds

**响应 / Response:**
```json
{
  "id": "ulid_1234567890"
}
```

---

### 2. 处理录音 / Process Recording

**POST** `/api/process/:id`

触发语音转文字和摘要生成。

**路径参数 / Path Params:**
- `id`: string - 录音 ID / Recording ID

**响应 / Response:**
```json
{
  "success": true,
  "id": "ulid_1234567890"
}
```

---

### 3. 获取历史记录 / Get History

**GET** `/api/history`

获取所有录音记录，按时间倒序。

**响应 / Response:**
```json
[
  {
    "id": "ulid_1234567890",
    "title": "新录音 2025-02-20T10:30:00.000Z",
    "audioPath": "/uploads/xxx.webm",
    "transcript": "这是转录的文字...",
    "summary": "# 会议主题\n\n## 关键要点...",
    "status": "completed",
    "duration": 120,
    "createdAt": 1739701800000,
    "cloudStatus": "not_uploaded",
    "cloudKey": null,
    "cloudUrl": null,
    "tags": [],
    "summaryLanguage": "zh"
  }
]
```

---

### 4. 获取单个录音 / Get Single Recording

**GET** `/api/recording/:id`

获取单个录音详情。

**响应 / Response:**
```json
{
  "id": "ulid_1234567890",
  "title": "新录音 2025-02-20T10:30:00.000Z",
  "audioPath": "/uploads/xxx.webm",
  "transcript": "这是转录的文字...",
  "summary": "...",
  "status": "completed",
  "duration": 120,
  "createdAt": 1739701800000
}
```

---

### 5. 删除录音 / Delete Recording

**DELETE** `/api/recording/:id`

删除录音记录及音频文件。

**响应 / Response:**
```json
{
  "success": true
}
```

---

### 6. 删除所有录音 / Delete All Recordings

**DELETE** `/api/recordings/all`

删除所有本地录音记录及音频文件。

---

### 7. 重新生成摘要 / Regenerate Summary

**POST** `/api/regenerate-summary/:id`

使用指定语言重新生成摘要。

**请求体 / Request Body:**
```json
{
  "language": "zh" | "en" | "bilingual"
}
```

---

### 8. 云存储接口 / Cloud Storage Endpoints

- **POST** `/api/cloud/upload/:id` - 上传到云端 / Upload to cloud
- **DELETE** `/api/cloud/delete/:id` - 从云端移除 / Remove from cloud
- **GET** `/api/cloud/list` - 列出云端录音 / List cloud recordings
- **DELETE** `/api/cloud/record/:key` - 删除云端录音 / Delete cloud recording

---

## 前端开发 / Frontend Development

### Clerk 身份验证 / Clerk Authentication

在 [Clerk](https://clerk.com) 创建应用后，获取 Publishable Key 并配置到 `.env`：

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

在 `main.tsx` 中使用 `ClerkProvider` 包装应用：

```typescript
import { ClerkProvider } from '@clerk/clerk-react';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ClerkProvider publishableKey={clerkPubKey}>
    <App />
  </ClerkProvider>
);
```

使用 `SignedIn` 和 `SignedOut` 组件控制内容显示：

```typescript
import { SignedIn, SignedOut } from '@clerk/clerk-react';

<SignedOut>
  <LandingPage />
</SignedOut>
<SignedIn>
  <MainApp />
</SignedIn>
```

### 国际化配置 / i18n Configuration

```json
// client/src/i18n/zh.json
{
  "app": {
    "title": "LiteMinute AI",
    "subtitle": "语音转文字与智能摘要"
  },
  "tabs": {
    "local": "本地",
    "cloud": "云端",
    "stats": "统计"
  },
  "nav": {
    "promptSettings": "提示词设置",
    "signOut": "退出登录"
  }
}
```

### 主题切换 / Theme Toggle

使用 `useTheme` Hook 管理明暗模式：

```typescript
// client/src/hooks/useTheme.ts
import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as Theme) ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return { theme, toggleTheme: () => setTheme(t => t === 'light' ? 'dark' : 'light') };
}
```

### 配色主题系统 / Color Theme System

使用 CSS 变量和 Context 管理动态配色：

```typescript
// 5 种配色主题 / 5 color themes
type ColorTheme = 'ocean' | 'forest' | 'sunset' | 'lavender' | 'rose';
```

每种配色都支持明暗模式。

### 提示词设置系统 / Prompt Settings System

使用 `localStorage` 快速、轻盈地存储提示词模板：

```typescript
interface PromptTemplate {
  id: string;
  name: string;
  content: string;
}
```

Schema 设计支持未来添加更多提示词。

### 音频播放器 / Audio Player

修复后的音频播放器支持：
- 拖拽进度条
- 点击进度条跳转
- 播放状态与进度条同步
- 音量控制
- 静音切换

---

## 后端开发 / Backend Development

### 环境变量 / Environment Variables

```env
# server/.env
PORT=8787
GROQ_API_KEY=gsk_...
ANTHROPIC_API_KEY=sk-ant-...
# Cloudflare R2 (可选 / Optional)
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=...
```

### Groq STT 服务 / Groq STT Service

```typescript
// server/src/services/groq.ts
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function transcribeAudio(audioPath: string): Promise<string> {
  const file = fs.createReadStream(audioPath);

  const response = await groq.audio.transcriptions.create({
    file,
    model: 'whisper-large-v3',
  });

  return response.text;
}
```

### LLM 摘要服务 / LLM Summary Service

```typescript
// server/src/services/llm.ts
export async function generateSummary(
  transcript: string,
  language: 'zh' | 'en' | 'bilingual'
): Promise<string> {
  // 调用 Claude API
  // Call Claude API
}
```

---

## Clerk 身份验证 / Clerk Authentication

### 1. 创建 Clerk 应用 / Create Clerk App

1. 访问 [clerk.com](https://clerk.com) 并注册账号
2. 创建新应用
3. 在配置中启用 Email/Password 登录方式
4. 复制 Publishable Key

### 2. 前端集成 / Frontend Integration

```typescript
// main.tsx - 已配置 / Already configured
import { ClerkProvider } from '@clerk/clerk-react';

// App.tsx - 使用 SignedIn/SignedOut / Use SignedIn/SignedOut
import { SignedIn, SignedOut, useUser, useClerk } from '@clerk/clerk-react';
```

### 3. 主要组件 / Key Components

- `LandingPage.tsx` - 包含 `SignInButton` 和 `SignUpButton`
- `UserMenu.tsx` - 用户菜单，包含登出和提示词设置
- `PromptSettingsModal.tsx` - 提示词设置对话框

---

## 配色主题系统 / Color Theme System

### 5 种配色主题 / 5 Color Themes

| 主题 / Theme | 说明 / Description | 主色调 / Primary Color |
|-------------|-------------------|---------------------|
| Ocean | 海洋蓝 / Ocean Blue | 天蓝色 / Sky blue |
| Forest | 森林绿 / Forest Green | 翠绿色 / Emerald green |
| Sunset | 日落橙 / Sunset Orange | 暖橙色 / Warm orange |
| Lavender | 薰衣草紫 / Lavender Purple | 淡紫色 / Soft purple |
| Rose | 玫瑰红 / Rose Red | 玫红色 / Rose pink |

### 实现原理 / Implementation

使用 CSS 变量 + Tailwind CSS：

```css
:root {
  --primary: 199.4 89.2% 48.4%; /* Ocean */
  /* ... */
}

/* 通过 JavaScript 动态修改 / Dynamically modified via JavaScript */
document.documentElement.style.setProperty('--primary', newValue);
```

---

## 提示词设置系统 / Prompt Settings System

### 数据结构 / Data Structure

```typescript
interface PromptTemplate {
  id: string;
  name: string;
  content: string;
}

// 默认提示词 / Default prompts
const DEFAULT_PROMPTS = [
  {
    id: 'default',
    name: 'Default Summary',
    content: '请将以下转录内容整理成一份清晰的会议摘要...'
  },
  {
    id: 'detailed',
    name: 'Detailed Notes',
    content: '请详细分析以下转录内容，提供...'
  }
];
```

### 存储方式 / Storage

使用 `localStorage` 实现快速、轻盈的存储：

```typescript
// 保存 / Save
localStorage.setItem('promptSettings', JSON.stringify(prompts));

// 读取 / Load
const saved = localStorage.getItem('promptSettings');
```

### 扩展性 / Extensibility

Schema 设计支持未来添加：
- 更多提示词模板
- 提示词分类
- 提示词导入导出
- 提示词分享

---

## 部署指南 / Deployment Guide

### 构建前端 / Build Frontend

```bash
cd client
npm run build
```

### 启动后端 / Start Backend

```bash
cd server
npm run build
# 使用 PM2 / Using PM2
pm2 start dist/index.js --name lightminute-server
```

---

## 开发清单 / Development Checklist

- [x] Clerk 身份验证集成 / Clerk authentication integration
- [x] Landing page 设计 / Landing page design
- [x] 主界面统计图表 / Stats charts in main interface
- [x] 用户菜单下拉 / User menu dropdown
- [x] 提示词设置功能 / Prompt settings feature
- [x] 5 种配色主题 / 5 color themes
- [x] 音频播放器修复 / Audio player fixes
- [x] 代码清理和精简 / Code cleanup and refactoring
- [x] 文档更新 / Documentation updates

---

*本文档最后更新 / Last updated: 2026-02-21*
