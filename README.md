# LiteMinute AI

> 极简语音转文字与智能摘要工具 / Minimalist Speech-to-Text & Smart Summary Tool

## 功能特点 / Features

- 🔐 **Clerk 身份验证** / Clerk Authentication - 安全的用户登录和登出
- 🎤 移动端优先录音界面 / Mobile-first recording interface
- 🤖 AI 语音转文字（Groq Whisper）/ AI speech-to-text
- 📝 智能摘要生成（Claude 3.5 Sonnet）/ Smart summary generation
- 💾 JSON 本地持久化 / Local JSON persistence
- ☁️ Cloudflare R2 云存储集成 / Cloudflare R2 cloud storage integration
- 📊 数据统计图表 / Data statistics charts
- ⚙️ 可自定义提示词模板 / Customizable prompt templates
- 🎨 5 种优雅配色主题 / 5 elegant color themes
- 🌓 明暗模式切换 / Light/dark mode toggle
- 🌍 中英文双语界面 / Bilingual Chinese-English UI

## 快速开始 / Quick Start

### 1. 安装依赖 / Install Dependencies

```bash
# 前端 / Frontend
cd client
npm install

# 后端 / Backend
cd ../server
npm install
```

### 2. 配置环境变量 / Configure Environment Variables

#### 前端 / Frontend

```bash
cd client
cp .env.example .env
# 编辑 .env 填入你的 Clerk Publishable Key
# Edit .env with your Clerk Publishable Key
```

需要在 [Clerk](https://clerk.com) 创建一个应用，获取 Publishable Key。

Create an app at [Clerk](https://clerk.com) to get your Publishable Key.

#### 后端 / Backend

```bash
cd server
cp .env.example .env
# 编辑 .env 填入你的 API keys / Edit .env with your API keys
```

### 3. 启动开发服务器 / Start Dev Servers

```bash
# 启动后端 / Start backend (in server directory)
cd server
npm run dev

# 在新终端启动前端 / Start frontend in a new terminal (in client directory)
cd client
npm run dev
```

- 前端: http://localhost:3000
- 后端: http://localhost:8787

## 项目结构 / Project Structure

```
lightminute_ai/
├── client/                  # React 前端 / Frontend
│   ├── src/
│   │   ├── components/      # UI 组件 / Components
│   │   │   ├── ui/          # Shadcn UI 组件
│   │   │   ├── LandingPage.tsx
│   │   │   ├── UserMenu.tsx
│   │   │   ├── PromptSettingsModal.tsx
│   │   │   ├── StatsChart.tsx
│   │   │   ├── AudioPlayer.tsx
│   │   │   ├── Recorder.tsx
│   │   │   ├── RecordingList.tsx
│   │   │   ├── CloudTab.tsx
│   │   │   ├── ThemeToggle.tsx
│   │   │   ├── LanguageToggle.tsx
│   │   │   └── ColorThemePicker.tsx
│   │   ├── contexts/        # React Contexts
│   │   │   ├── AppContext.tsx
│   │   │   ├── ThemeColorContext.tsx
│   │   │   └── PromptSettingsContext.tsx
│   │   ├── hooks/           # 自定义 Hooks / Custom Hooks
│   │   ├── i18n/            # 国际化 / Internationalization
│   │   └── lib/             # 工具函数 / Utilities
│   └── package.json
├── server/                  # Hono 后端 / Backend
│   ├── src/
│   │   ├── db/              # 数据库 / Database
│   │   └── services/        # AI 服务 / AI Services
│   ├── uploads/             # 音频文件存储 / Audio storage
│   ├── data/                # JSON 数据文件 / JSON data files
│   └── package.json
├── README.md
└── DEVELOPMENT.md           # 详细开发指南 / Detailed dev guide
```

## 技术栈 / Tech Stack

- **前端 / Frontend**: React 18 + Vite + Tailwind CSS + Shadcn UI + Framer Motion + Lucide Icons
- **图表 / Charts**: Recharts
- **身份验证 / Authentication**: Clerk
- **后端 / Backend**: Hono.js + Node.js
- **数据库 / Database**: JSON file-based storage
- **AI**: Groq (Whisper) + Anthropic (Claude)
- **云存储 / Cloud Storage**: Cloudflare R2 (S3-compatible)

## 主要功能说明 / Key Features

### 身份验证 / Authentication
- 使用 Clerk 提供安全的登录和注册
- Landing page 展示产品特点
- 登录后进入主应用

### 提示词设置 / Prompt Settings
- 默认提供两个提示词模板
- 支持创建、编辑、删除自定义提示词
- 使用 localStorage 快速、轻盈地存储
- Schema 设计支持未来添加更多提示词

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
