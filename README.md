# LiteMinute AI

> 极简语音转文字与智能摘要工具 / Minimalist Speech-to-Text & Smart Summary Tool

## 功能特点 / Features

- 🔐 **Clerk 身份验证** / Clerk Authentication - 安全的用户登录和登出
- 🎤 移动端优先录音界面 / Mobile-first recording interface
- 🤖 AI 语音转文字（Groq Whisper）/ AI speech-to-text
- 📝 智能摘要生成（Claude 3.5 Sonnet）/ Smart summary generation
- 💾 SQLite 本地持久化 / SQLite local persistence
- ☁️ Cloudflare R2 云存储集成 / Cloudflare R2 cloud storage integration
- 📊 数据统计图表 / Data statistics charts
- ⚙️ 可自定义提示词模板 / Customizable prompt templates
- 🎨 5 种优雅配色主题 / 5 elegant color themes
- 🌓 明暗模式切换 / Light/dark mode toggle
- 🌍 中英文双语界面 / Bilingual Chinese-English UI

## 技术架构 / Technical Architecture

本项目已重构为 **Next.js 15 全栈架构**，使用 App Router：

- **框架 / Framework**: Next.js 15 (App Router)
- **前端 / Frontend**: React 18 + Tailwind CSS + Framer Motion + Lucide Icons
- **图表 / Charts**: Recharts
- **身份验证 / Authentication**: Clerk
- **后端 / Backend**: Next.js Route Handlers
- **数据库 / Database**: SQLite (文件存储)
- **AI**: Groq (Whisper) + Anthropic (Claude)
- **云存储 / Cloud Storage**: Cloudflare R2 (S3-compatible)

## 快速开始 / Quick Start

### 前置要求 / Prerequisites

- Node.js >= 20
- npm 或 pnpm
- [Clerk](https://clerk.com) 账号 / Clerk account
- Groq API Key
- Anthropic API Key (可选 / Optional)
- Cloudflare R2 凭证 (可选 / Optional)

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
│   │   ├── upload/route.ts      # 上传音频 / Upload audio
│   │   ├── process/[id]/route.ts # 处理录音 / Process recording
│   │   ├── history/route.ts     # 历史记录 / History
│   │   ├── recording/[id]/route.ts # 单个录音 / Single recording
│   │   ├── recordings/all/route.ts # 删除所有 / Delete all
│   │   ├── regenerate-summary/[id]/route.ts # 重新生成摘要
│   │   ├── cloud/               # 云存储接口 / Cloud storage
│   │   └── health/route.ts      # 健康检查 / Health check
│   ├── layout.tsx               # 根布局 / Root layout
│   └── page.tsx                 # 首页 / Home page
├── components/                   # React 组件 / Components
│   ├── ui/                      # UI 基础组件 / Base UI components
│   ├── Recorder.tsx             # 录音组件 / Recorder
│   ├── RecordingList.tsx        # 录音列表 / Recording list
│   ├── CloudTab.tsx             # 云端标签 / Cloud tab
│   ├── StatsChart.tsx           # 统计图表 / Stats charts
│   ├── PromptSettingsModal.tsx  # 提示词设置 / Prompt settings
│   ├── ThemeToggle.tsx          # 主题切换 / Theme toggle
│   ├── LanguageToggle.tsx       # 语言切换 / Language toggle
│   └── ...
├── contexts/                     # React Contexts
│   ├── AppContext.tsx           # 应用状态 / App state
│   ├── ThemeColorContext.tsx    # 配色主题 / Color theme
│   └── PromptSettingsContext.tsx # 提示词设置 / Prompt settings
├── hooks/                        # 自定义 Hooks / Custom Hooks
│   ├── useTheme.ts
│   └── useLanguage.ts
├── i18n/                         # 国际化 / Internationalization
│   ├── zh.json
│   ├── en.json
│   └── index.ts
├── lib/
│   ├── server/                   # 服务端代码 / Server-side code
│   │   ├── db/                  # 数据库操作 / Database operations
│   │   └── services/            # AI 服务 / AI services
│   └── utils.ts                  # 工具函数 / Utilities
├── data/                         # SQLite 数据库目录 / SQLite DB dir
├── uploads/                      # 音频文件上传目录 / Audio uploads dir
├── middleware.ts                 # Clerk 中间件 / Clerk middleware
├── Dockerfile                    # Docker 镜像配置
├── docker-compose.yml            # Docker Compose 配置
├── .env.example                  # 环境变量示例
├── README.md                     # 本文档 / This document
├── DEVELOPMENT.md                # 详细开发指南 / Detailed dev guide
└── DEPLOYMENT.md                 # 部署指南 / Deployment guide
```

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
- 修复了拖拽和播放同步问题

## 开发指南 / Development Guide

详细开发指南请参考 [DEVELOPMENT.md](./DEVELOPMENT.md)。

## License

MIT
