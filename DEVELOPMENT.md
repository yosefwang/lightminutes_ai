# LiteMinute AI - 详细开发指南 / Detailed Development Guide

> 中英文双语文档 / Bilingual Chinese-English Documentation
>
> **注意**: 本项目已重构为 Next.js 15 全栈架构，不再使用分离的 client/server 目录。
> **Note**: This project has been refactored to Next.js 15 full-stack architecture, no longer using separate client/server directories.

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

LiteMinute AI 是一个极简、自控的语音转文字与摘要工具，采用 **Next.js 15 全栈架构**，使用 App Router，前后端一体化。

**核心功能：**
- 🔐 Clerk 身份验证（登录/注册/登出）
- 🎤 移动端优先的录音界面
- 📤 自动上传音频文件
- 🤖 AI 语音转文字（Groq Whisper）
- 📝 智能摘要生成（Claude / DeepSeek）
- 💾 SQLite 本地持久化存储
- ☁️ Cloudflare R2 云存储集成
- 📊 数据统计图表
- ⚙️ 可自定义提示词模板系统
- 🎨 5 种优雅配色主题（各有明暗模式）
- 🌓 明暗模式切换
- 🌍 中英文双语界面

### English

LiteMinute AI is a minimalist, self-controlled speech-to-text and summarization tool. It uses **Next.js 15 full-stack architecture** with App Router, integrating frontend and backend.

**Core Features:**
- 🔐 Clerk Authentication (Sign in/Sign up/Sign out)
- 🎤 Mobile-first recording interface
- 📤 Automatic audio file upload
- 🤖 AI speech-to-text (Groq Whisper)
- 📝 Intelligent summary generation (Claude / DeepSeek)
- 💾 SQLite local persistent storage
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
- npm 或 pnpm
- [Clerk](https://clerk.com) 账号 / Clerk account
- Groq API Key
- Anthropic API Key (可选 / Optional)
- Cloudflare R2 凭证 (可选 / Optional)

### 安装步骤 / Installation Steps

```bash
# 1. 克隆项目 / Clone the project
git clone <repository-url>
cd lightminute_ai

# 2. 安装依赖 / Install dependencies
npm install

# 3. 配置环境变量 / Configure environment variables
cp .env.example .env
# 编辑 .env 填入配置 / Edit .env with your configuration

# 4. 启动开发服务器 / Start development server
npm run dev
```

访问 / Visit: http://localhost:3000

---

## 技术架构 / Technical Architecture

### 目录结构 / Project Structure

```
lightminute_ai/
├── app/                          # Next.js App Router
│   ├── api/                     # API 路由 / API Routes
│   │   ├── upload/route.ts      # 上传音频 / Upload audio
│   │   ├── process/[id]/route.ts # 处理录音 / Process recording
│   │   ├── history/route.ts     # 历史记录 / History
│   │   ├── recording/[id]/route.ts # 单个录音 / Single recording
│   │   ├── recordings/all/route.ts # 删除所有 / Delete all
│   │   ├── regenerate-summary/[id]/route.ts # 重新生成摘要
│   │   ├── cloud/               # 云存储接口 / Cloud storage
│   │   │   ├── upload/[id]/route.ts
│   │   │   ├── delete/[id]/route.ts
│   │   │   ├── list/route.ts
│   │   │   └── record/[key]/route.ts
│   │   └── health/route.ts      # 健康检查 / Health check
│   ├── layout.tsx               # 根布局 / Root layout
│   └── page.tsx                 # 首页 / Home page
├── components/                   # React 组件 / Components
│   ├── ui/                      # UI 基础组件 / Base UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── badge.tsx
│   ├── App.tsx                  # 主应用组件 / Main app component
│   ├── LandingPage.tsx          # 登录页 / Landing page
│   ├── UserMenu.tsx             # 用户菜单 / User menu
│   ├── PromptSettingsModal.tsx  # 提示词设置 / Prompt settings
│   ├── StatsChart.tsx           # 统计图表 / Stats charts
│   ├── AudioPlayer.tsx          # 音频播放器 / Audio player
│   ├── Recorder.tsx             # 录音组件 / Recorder
│   ├── RecordingList.tsx        # 录音列表 / Recording list
│   ├── CloudTab.tsx             # 云端标签 / Cloud tab
│   ├── ThemeToggle.tsx          # 主题切换 / Theme toggle
│   ├── LanguageToggle.tsx       # 语言切换 / Language toggle
│   └── ColorThemePicker.tsx     # 配色选择 / Color theme picker
├── contexts/                     # React Contexts
│   ├── AppContext.tsx           # 应用状态 / App state
│   ├── ThemeColorContext.tsx    # 配色主题 / Color theme
│   └── PromptSettingsContext.tsx # 提示词设置 / Prompt settings
├── hooks/                        # 自定义 Hooks / Custom Hooks
│   ├── useLanguage.ts
│   ├── useTheme.ts
│   └── index.ts
├── i18n/                         # 国际化 / Internationalization
│   ├── index.ts
│   ├── zh.json
│   └── en.json
├── lib/
│   ├── server/                   # 服务端代码 / Server-side code
│   │   ├── db/
│   │   │   ├── index.ts         # SQLite DB 实现 / SQLite DB implementation
│   │   │   └── schema.ts        # 类型定义 / Type definitions
│   │   └── services/
│   │       ├── groq.ts          # STT 服务 / Speech-to-Text
│   │       ├── llm.ts           # 摘要服务 / Summarization
│   │       └── r2.ts            # R2 云存储 / R2 cloud storage
│   └── utils.ts                  # 工具函数 / Utilities
├── data/                         # SQLite 数据库目录 / SQLite DB dir
├── uploads/                      # 音频文件上传目录 / Audio uploads dir
├── middleware.ts                 # Clerk 中间件 / Clerk middleware
├── next.config.ts                # Next.js 配置
├── tailwind.config.ts            # Tailwind CSS 配置
├── tsconfig.json                 # TypeScript 配置
├── Dockerfile                    # Docker 镜像配置
├── docker-compose.yml            # Docker Compose 配置
├── .env.example                  # 环境变量示例
├── README.md                     # 项目说明 / Project README
├── DEVELOPMENT.md                # 本文档 / This document
└── DEPLOYMENT.md                 # 部署指南 / Deployment guide
```

### 技术栈详情 / Tech Stack Details

| 层级 / Layer | 技术 / Technology | 说明 / Description |
|-------------|------------------|-------------------|
| 框架 / Framework | Next.js 15 | 全栈框架 / Full-stack framework |
| 前端 / Frontend | React 18 | UI 框架 / Framework |
| | Tailwind CSS | 样式框架 / Styling |
| | Framer Motion | 动画库 / Animations |
| | Lucide React | 图标库 / Icons |
| | Recharts | 图表库 / Charts |
| | Clerk Next.js | 身份验证 / Authentication |
| 后端 / Backend | Next.js Route Handlers | API 路由 / API routes |
| 数据存储 / Data Storage | SQLite | 数据存储 / Storage |
| AI 服务 / AI Services | Groq Whisper | 语音转文字 / STT |
| | Claude 3.5 Sonnet | 摘要生成 / Summarization |
| 云存储 / Cloud Storage | Cloudflare R2 | S3 兼容存储 / S3-compatible storage |

---

## 数据存储设计 / Data Storage Design

### 类型定义 / Type Definitions

```typescript
// lib/server/db/schema.ts
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

- Base URL: `http://localhost:3000`
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

在 [Clerk](https://clerk.com) 创建应用后，获取 Publishable Key 和 Secret Key 并配置到 `.env`：

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

在 `app/layout.tsx` 中使用 `ClerkProvider` 包装应用：

```typescript
import { ClerkProvider } from '@clerk/nextjs';

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="zh-CN">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

使用 `SignedIn` 和 `SignedOut` 组件控制内容显示：

```typescript
import { SignedIn, SignedOut } from '@clerk/nextjs';

<SignedOut>
  <LandingPage />
</SignedOut>
<SignedIn>
  <MainApp />
</SignedIn>
```

### 国际化配置 / i18n Configuration

```json
// i18n/zh.json
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
// hooks/useTheme.ts
import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as Theme) ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  // 立即应用主题 / Apply theme immediately
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, []);

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

语言切换时自动更新提示词模板。

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
# .env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Groq API (STT - Speech to Text)
GROQ_API_KEY=gsk_...

# Anthropic API (Summarization)
ANTHROPIC_API_KEY=sk-ant_...

# STT Model Configuration
GROQ_STT_MODEL=whisper-large-v3
STT_LANGUAGE=zh

# LLM Model Configuration
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
LLM_LANGUAGE=zh

# Cloudflare R2 / S3 Configuration (Optional)
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=...
R2_PUBLIC_URL=...
```

### Groq STT 服务 / Groq STT Service

```typescript
// lib/server/services/groq.ts
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
// lib/server/services/llm.ts
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
4. 复制 Publishable Key 和 Secret Key

### 2. 中间件配置 / Middleware Configuration

使用 `middleware.ts` 保护路由：

```typescript
import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
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
  type: 'transcribe' | 'summary';
}

// 默认提示词 / Default prompts
const DEFAULT_PROMPTS_ZH = [...];
const DEFAULT_PROMPTS_EN = [...];
```

### 存储方式 / Storage

使用 `localStorage` 实现快速、轻盈的存储：

```typescript
// 保存 / Save
localStorage.setItem('promptSettings', JSON.stringify(prompts));

// 读取 / Load
const saved = localStorage.getItem('promptSettings');
```

### 语言切换 / Language Switching

当用户切换界面语言时，提示词模板会自动切换到对应语言的默认模板。

### 扩展性 / Extensibility

Schema 设计支持未来添加：
- 更多提示词模板
- 提示词分类
- 提示词导入导出
- 提示词分享

---

## 部署指南 / Deployment Guide

### Docker 部署 / Docker Deployment

详细部署指南请参考 [DEPLOYMENT.md](./DEPLOYMENT.md)。

### 构建生产版本 / Build for Production

```bash
npm run build
npm start
```

---

## 开发清单 / Development Checklist

- [x] 重构为 Next.js 15 全栈架构 / Refactor to Next.js 15 full-stack
- [x] Clerk 身份验证集成 / Clerk authentication integration
- [x] Landing page 设计 / Landing page design
- [x] 主界面统计图表 / Stats charts in main interface
- [x] 用户菜单下拉 / User menu dropdown
- [x] 提示词设置功能 / Prompt settings feature
- [x] 5 种配色主题 / 5 color themes
- [x] 音频播放器修复 / Audio player fixes
- [x] 语言切换时自动更新提示词 / Auto-update prompts on language switch
- [x] 明暗主题立即生效 / Light/dark theme applies immediately
- [x] 文档更新 / Documentation updates

---

*本文档最后更新 / Last updated: 2026-02-22*
