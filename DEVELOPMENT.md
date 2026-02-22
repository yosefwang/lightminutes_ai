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
- [音频处理架构 / Audio Processing Architecture](#音频处理架构--audio-processing-architecture)
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
- 📤 两种音频上传方式：R2 直传或传统上传
- 🤖 AI 语音转文字（Groq Whisper）
- 📝 智能摘要生成（Claude / DeepSeek）
- 💾 双模式数据存储：SQLite 本地 + Supabase PostgreSQL
- ☁️ Cloudflare R2 云存储集成，支持 Range 请求
- ⚡ Trigger.dev 异步任务队列处理长音频
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
- 📤 Two audio upload methods: R2 direct upload or traditional upload
- 🤖 AI speech-to-text (Groq Whisper)
- 📝 Intelligent summary generation (Claude / DeepSeek)
- 💾 Dual-mode data storage: SQLite local + Supabase PostgreSQL
- ☁️ Cloudflare R2 cloud storage integration with Range request support
- ⚡ Trigger.dev async task queue for long audio processing
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
- Supabase 凭证 (可选 / Optional)
- Trigger.dev 凭证 (可选 / Optional)

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
│   │   ├── upload/route.ts      # 传统音频上传 / Legacy audio upload
│   │   ├── process/[id]/route.ts # 处理录音（本地模式）
│   │   ├── history/route.ts     # 历史记录 / History
│   │   ├── recording/[id]/route.ts # 单个录音 / Single recording
│   │   ├── recordings/all/route.ts # 删除所有 / Delete all
│   │   ├── regenerate-summary/[id]/route.ts # 重新生成摘要
│   │   ├── r2/                  # R2 相关 API / R2 related APIs
│   │   │   ├── presigned-url/route.ts # 预签名 URL
│   │   │   └── audio/[...key]/route.ts # 音频代理
│   │   └── recordings/route.ts  # 创建录音（Supabase模式）
├── components/                   # React 组件 / Components
├── contexts/                     # React Contexts
├── hooks/                        # 自定义 Hooks / Custom Hooks
├── i18n/                         # 国际化 / Internationalization
├── lib/
│   ├── server/                   # 服务端代码 / Server-side code
│   │   ├── db/                  # 数据库操作 / Database operations
│   │   ├── services/            # AI 和云存储服务 / AI & Cloud services
│   │   └── supabase.ts          # Supabase 客户端
├── trigger/                      # Trigger.dev 任务
├── data/                         # SQLite 数据库目录 / SQLite DB dir
├── uploads/                      # 音频文件上传目录 / Audio uploads dir
├── trigger.config.ts             # Trigger.dev 配置
└── ...
```

### 技术栈详情 / Tech Stack Details

| 层级 / Layer | 技术 / Technology | 说明 / Description |
|-------------|------------------|-------------------|
| 框架 / Framework | Next.js 15 | 全栈框架 / Full-stack framework |
| 前端 / Frontend | React 19 | UI 框架 / Framework |
| | Tailwind CSS | 样式框架 / Styling |
| | Framer Motion | 动画库 / Animations |
| | Lucide React | 图标库 / Icons |
| | Recharts | 图表库 / Charts |
| | Clerk Next.js | 身份验证 / Authentication |
| 后端 / Backend | Next.js Route Handlers | API 路由 / API routes |
| 数据存储 / Data Storage | SQLite / Supabase | 数据存储 / Storage |
| 异步任务 / Async Tasks | Trigger.dev v3 | 任务队列 / Task queue |
| AI 服务 / AI Services | Groq Whisper | 语音转文字 / STT |
| | Claude 3.5 Sonnet | 摘要生成 / Summarization |
| 云存储 / Cloud Storage | Cloudflare R2 | S3 兼容存储 / S3-compatible storage |

---

## 数据存储设计 / Data Storage Design

### 双模式存储 / Dual-mode Storage

系统支持两种存储模式，自动切换：

1. **SQLite 本地模式** / SQLite Local Mode (默认)
   - 使用 JSON 文件存储在 `data/db.json`
   - 音频文件存储在 `uploads/` 目录
   - 无需额外配置

2. **Supabase PostgreSQL 模式** / Supabase PostgreSQL Mode (可选)
   - 配置 Supabase 环境变量后自动启用
   - 使用 Trigger.dev 异步处理录音
   - 数据持久化，支持多设备同步

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

## 音频处理架构 / Audio Processing Architecture

### 录音流程 / Recording Flow

```
┌─────────────┐     ┌─────────────────────┐     ┌─────────────────┐
│  前端录音   │     │  获取预签名 URL    │     │  直传 R2        │
│  Recorder   │────▶│  /api/r2/presigned │────▶│  (推荐)         │
└─────────────┘     └─────────────────────┘     └─────────────────┘
       │
       │                    ┌─────────────────────┐
       └───────────────────▶│  传统上传           │
                            │  /api/upload         │
                            └─────────────────────┘
```

### R2 直传流程 / R2 Direct Upload Flow (推荐)

1. **前端请求预签名 URL** / Frontend requests presigned URL
   ```
   POST /api/r2/presigned-url
   Body: { fileExtension: 'webm', mimeType: 'audio/webm' }
   Response: { key, uploadUrl, publicUrl }
   ```

2. **前端直接上传到 R2** / Frontend uploads directly to R2
   - 使用 fetch PUT 到 uploadUrl
   - 不经过服务器，节省带宽

3. **创建录音记录** / Create recording record
   ```
   POST /api/recordings
   Body: { title, r2AudioKey, r2AudioUrl, duration, ... }
   ```

4. **触发异步处理** / Trigger async processing
   - Supabase 模式：触发 Trigger.dev 任务
   - 本地模式：调用 `/api/process/[id]`

### 音频代理与 Range 请求 / Audio Proxy & Range Requests

为了解决 R2 签名 URL 的跨域和过期问题，系统提供 API 代理：

```typescript
// app/api/r2/audio/[...key]/route.ts
export async function GET(request: Request, { params }) {
  const range = request.headers.get('range');

  if (range) {
    // 处理 Range 请求，支持音频流式播放
    // Handle Range request for audio streaming
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    return new NextResponse(stream, {
      status: 206,
      headers: {
        'Content-Type': contentType,
        'Content-Length': chunkSize.toString(),
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
      },
    });
  }
}
```

### 长音频处理 / Long Audio Handling

#### 转写限制 / Transcription Limits
- Groq Whisper API：最大 25MB
- 建议单条录音不超过 2 小时
- 支持 WebM、M4A、WAV、MP3 格式

#### 流式播放 / Streaming Playback
- 音频播放器使用 HTML5 Audio Element
- 通过 Range 请求分段加载
- 无需下载整个文件即可播放
- 进度条跳转时自动请求相应位置

#### 异步处理 / Async Processing
- 使用 Trigger.dev 处理长音频（最长 5 分钟）
- 任务失败自动重试（最多 3 次）
- 实时轮询更新处理状态

---

## API 接口文档 / API Documentation

### 基础信息 / Base Info

- Base URL: `http://localhost:3000`
- Content-Type: `application/json` (except upload)

### 1. 获取 R2 预签名 URL / Get R2 Presigned URL

**POST** `/api/r2/presigned-url`

获取用于直接上传到 R2 的预签名 URL。

**请求 / Request:**
```json
{
  "fileExtension": "webm",
  "mimeType": "audio/webm"
}
```

**响应 / Response:**
```json
{
  "key": "users/user_123/abc123/audio.webm",
  "uploadUrl": "https://...",
  "publicUrl": "https://..."
}
```

---

### 2. 创建录音（Supabase 模式）/ Create Recording (Supabase Mode)

**POST** `/api/recordings`

使用 R2 直传后，创建录音记录并触发处理。

**请求 / Request:**
```json
{
  "title": "会议录音",
  "r2AudioKey": "users/user_123/abc123/audio.webm",
  "r2AudioUrl": "https://...",
  "duration": 120,
  "summaryLanguage": "zh",
  "tags": ["工作", "会议"],
  "promptTemplate": "自定义提示词（可选）"
}
```

**响应 / Response:**
```json
{
  "id": "uuid_123",
  "recording": { ... }
}
```

---

### 3. 传统音频上传 / Legacy Audio Upload

**POST** `/api/upload`

上传音频文件到服务器本地存储。

**请求 / Request:**
- Content-Type: `multipart/form-data`
- Body:
  - `audio`: File - 音频文件 / Audio file
  - `duration`: number - 录音时长（秒）/ Duration in seconds
  - `mimeType`: string - MIME 类型
  - `language`: string - 摘要语言

**响应 / Response:**
```json
{
  "id": "ulid_1234567890"
}
```

---

### 4. 处理录音（本地模式）/ Process Recording (Local Mode)

**POST** `/api/process/:id`

触发语音转文字和摘要生成（仅本地模式）。

---

### 5. 获取历史记录 / Get History

**GET** `/api/history`

获取所有录音记录，按时间倒序。

---

### 6. 删除单个录音 / Delete Single Recording

**DELETE** `/api/recording/:id`

删除单个录音，同时删除 R2 文件（如果有）。

---

### 7. 删除所有录音 / Delete All Recordings

**DELETE** `/api/recordings/all`

删除当前用户的所有录音，包括：
- Supabase 中的所有记录
- R2 中的所有音频和元数据文件
- 本地 SQLite 数据库记录

---

### 8. 重新生成摘要 / Regenerate Summary

**POST** `/api/regenerate-summary/:id`

使用指定语言重新生成摘要。

**请求体 / Request Body:**
```json
{
  "language": "zh" | "en" | "bilingual",
  "promptTemplate": "自定义提示词（可选）"
}
```

---

### 9. R2 音频代理 / R2 Audio Proxy

**GET** `/api/r2/audio/[...key]`

代理访问 R2 音频文件，支持 Range 请求。

---

## 前端开发 / Frontend Development

### Clerk 身份验证 / Clerk Authentication

在 [Clerk](https://clerk.com) 创建应用后，获取 Publishable Key 和 Secret Key 并配置到 `.env`：

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### 主题切换 / Theme Toggle

使用 `useTheme` Hook 管理明暗模式，支持 MutationObserver 实时跟踪 DOM 变化。

### 配色主题系统 / Color Theme System

使用 CSS 变量和 Context 管理动态配色，5 种配色主题：Ocean、Forest、Sunset、Lavender、Rose。

### 提示词设置系统 / Prompt Settings System

使用 `localStorage` 快速、轻盈地存储提示词模板，支持自定义和语言切换自动更新。

### 音频播放器 / Audio Player

- 支持 Range 请求，流式播放长音频
- 拖拽进度条和点击跳转
- 播放状态与进度条同步
- 音量控制和静音切换
- R2 URL 自动通过代理访问

---

## 后端开发 / Backend Development

### 环境变量 / Environment Variables

完整列表请参考 `.env.example`。关键变量：

```env
# Clerk (必需)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# AI Services (必需)
GROQ_API_KEY=
ANTHROPIC_API_KEY=

# Supabase (可选)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# R2 (可选)
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=

# Trigger.dev (可选)
TRIGGER_SECRET_KEY=
TRIGGER_API_KEY=
NEXT_PUBLIC_TRIGGER_PUBLIC_KEY=
TRIGGER_PROJECT_ID=
```

### Trigger.dev 异步任务 / Trigger.dev Async Tasks

Trigger.dev 任务在 `trigger/process-recording.ts` 中定义：

- `process-recording`: 处理新录音（转写 + 摘要）
- `regenerate-summary`: 重新生成摘要

任务启动时会记录环境配置状态，方便调试。

### 删除操作 / Delete Operations

删除操作会级联删除：
1. R2 中的音频文件和元数据
2. Supabase 或 SQLite 中的数据库记录
3. 本地音频文件（如有）

---

## 部署指南 / Deployment Guide

详细部署指南请参考 [DEPLOYMENT.md](./DEPLOYMENT.md)。

---

## 开发清单 / Development Checklist

- [x] 重构为 Next.js 15 全栈架构
- [x] Clerk 身份验证集成
- [x] R2 预签名 URL 直传
- [x] R2 音频代理 + Range 请求
- [x] Supabase 双模式支持
- [x] Trigger.dev 异步任务
- [x] 提示词设置功能
- [x] 5 种配色主题 + 明暗模式
- [x] 长音频流式播放
- [x] 级联删除（数据库 + R2）
- [x] 中英文双语界面

---

*本文档最后更新 / Last updated: 2026-02-22*
