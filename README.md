# LiteMinute AI

> 极简语音转文字与智能摘要工具 / Minimalist Speech-to-Text & Smart Summary Tool

## 功能特点 / Features

- 🔐 **Clerk 身份验证** / Clerk Authentication - 安全的用户登录和登出
- 🎤 移动端优先录音界面 / Mobile-first recording interface
- 🤖 AI 语音转文字（Groq Whisper）/ AI speech-to-text
- 📝 智能摘要生成（Claude 3.5 Sonnet）/ Smart summary generation
- 💾 双模式数据存储 / Dual-mode data storage
  - SQLite 本地持久化 / SQLite local persistence
  - Supabase PostgreSQL 数据库 / Supabase PostgreSQL database (可选)
- ☁️ Cloudflare R2 云存储集成 / Cloudflare R2 cloud storage integration
  - 预签名 URL 直传 / Presigned URL direct upload
  - API 代理支持 Range 请求 / API proxy with Range request support
- ⚡ Trigger.dev 异步任务队列 / Trigger.dev async task queue
- 📊 数据统计图表 / Data statistics charts
- ⚙️ 可自定义提示词模板 / Customizable prompt templates
- 🎨 5 种优雅配色主题 / 5 elegant color themes
- 🌓 明暗模式切换 / Light/dark mode toggle
- 🌍 中英文双语界面 / Bilingual Chinese-English UI

## 技术架构 / Technical Architecture

本项目已重构为 **Next.js 15 全栈架构**，使用 App Router：

- **框架 / Framework**: Next.js 15 (App Router)
- **前端 / Frontend**: React 19 + Tailwind CSS + Framer Motion + Lucide Icons
- **图表 / Charts**: Recharts
- **身份验证 / Authentication**: Clerk
- **后端 / Backend**: Next.js Route Handlers
- **数据库 / Database**:
  - SQLite (文件存储，默认) / SQLite (file storage, default)
  - Supabase PostgreSQL (可选) / Supabase PostgreSQL (optional)
- **异步任务 / Async Tasks**: Trigger.dev v3
- **AI**: Groq (Whisper) + Anthropic (Claude)
- **云存储 / Cloud Storage**: Cloudflare R2 (S3-compatible)

## 音频处理说明 / Audio Processing

### 录音流程 / Recording Flow

1. **前端录音** / Frontend Recording
   - 使用 MediaRecorder API 录制音频 (WebM 格式)
   - 支持实时音量显示和暂停/继续

2. **上传方式** / Upload Methods
   - **方式一：R2 直传** / Method 1: R2 Direct Upload (推荐)
     - 获取预签名 URL: `POST /api/r2/presigned-url`
     - 前端直接上传到 R2，不经过服务器
     - 节省服务器带宽和存储空间
   - **方式二：传统上传** / Method 2: Traditional Upload
     - 上传到服务器: `POST /api/upload`
     - 服务器保存到本地 `uploads/` 目录

3. **音频播放** / Audio Playback
   - R2 URL 通过 API 代理访问: `/api/r2/audio/[...key]`
   - 支持 Range 请求，支持流式播放长音频
   - 支持进度条拖拽和跳转

### 长音频处理 / Long Audio Handling

- **转写支持** / Transcription Support
  - Groq Whisper API 支持最长 25MB 的音频文件
  - 建议单条录音不超过 2 小时
- **流式播放** / Streaming Playback
  - 音频播放器使用 Range 请求分段加载
  - 无需下载整个文件即可开始播放
  - 进度条跳转时自动请求相应位置的数据

### R2 音频代理 / R2 Audio Proxy

由于 R2 签名 URL 可能存在跨域或过期问题，系统提供 API 代理：

```
GET /api/r2/audio/[...key]
```

- 支持 Range 请求头，支持音频流式播放
- 自动设置正确的 Content-Type
- 添加缓存头 (Cache-Control: public, max-age=31536000)

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

### 本地开发 / Local Development

```bash
# 1. 安装依赖 / Install dependencies
npm install

# 2. 配置环境变量 / Configure environment variables
cp .env.example .env
# 编辑 .env 填入你的配置 / Edit .env with your configuration

# 3. 启动开发服务器 / Start dev server
npm run dev
```

访问 / Visit: http://localhost:3000

### 构建生产版本 / Build for Production

```bash
npm run build
npm start
```

## Docker 部署 / Docker Deployment

详细部署指南请参考 [DEPLOYMENT.md](./DEPLOYMENT.md)。

快速开始 / Quick Start:

```bash
cp .env.example .env
# 编辑 .env 填入配置 / Edit .env with your configuration
docker-compose up -d --build
```

## 项目结构 / Project Structure

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
├── .env.example                  # 环境变量示例
└── README.md                     # 本文档 / This document
```

## 环境变量 / Environment Variables

完整的环境变量列表请参考 `.env.example`。关键变量包括：

### 必需 / Required
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk 公钥
- `CLERK_SECRET_KEY` - Clerk 密钥
- `GROQ_API_KEY` - Groq API 密钥（语音转文字）
- `ANTHROPIC_API_KEY` - Anthropic API 密钥（摘要生成）

### 可选 / Optional
- **Supabase**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- **R2**: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`
- **Trigger.dev**: `TRIGGER_SECRET_KEY`, `TRIGGER_API_KEY`, `NEXT_PUBLIC_TRIGGER_PUBLIC_KEY`, `TRIGGER_PROJECT_ID`

### Trigger.dev 配置说明

使用 Trigger.dev 时，**必须**在 Trigger.dev 项目设置中配置以下环境变量：
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET_NAME`
- `R2_PUBLIC_URL`
- `GROQ_API_KEY`
- `ANTHROPIC_API_KEY`

## 主要功能说明 / Key Features

### 身份验证 / Authentication
- 使用 Clerk 提供安全的登录和注册
- Landing page 展示产品特点
- 登录后进入主应用

### 提示词设置 / Prompt Settings
- 默认提供中英文提示词模板
- 支持创建、编辑、删除自定义提示词
- 使用 localStorage 快速、轻盈地存储
- 切换语言时自动更新提示词模板

### 配色主题 / Color Themes
5 种优雅配色，每种都支持明暗模式：
- Ocean (海洋蓝)
- Forest (森林绿)
- Sunset (日落橙)
- Lavender (薰衣草紫)
- Rose (玫瑰红)

### 统计图表 / Stats Charts
- 录音数量和总时长统计卡片
- 本周录音柱状图
- 近6个月时长折线图
- 状态分布饼图

### 音频播放器 / Audio Player
- 支持拖拽进度条
- 支持点击进度条跳转
- 支持 Range 请求，流式播放长音频
- R2 文件通过 API 代理访问

### 删除功能 / Delete Functionality
- 单个删除：同时删除数据库记录和 R2 文件
- 全部删除：删除该用户的所有数据（数据库 + R2）

## 开发指南 / Development Guide

详细开发指南请参考 [DEVELOPMENT.md](./DEVELOPMENT.md)。

## License

MIT
