# Docker 部署指南 / Docker Deployment Guide

本项目使用 Next.js 全栈架构，支持使用 Docker 和 Docker Compose 进行一键部署。

## 前置要求 / Prerequisites

- Docker 20.10+
- Docker Compose 2.0+

## 文件说明 / File Overview

| 文件 | 位置 | 说明 |
|------|------|
| `Dockerfile` | 根目录 | Next.js 应用 Docker 镜像配置（多阶段构建） |
| `docker-compose.yml` | 根目录 | 服务编排配置 |
| `.dockerignore` | 根目录 | Docker 构建忽略文件 |
| `.env` | 根目录 | 环境变量配置（所有环境变量都在这里） |

## 环境变量说明 / Environment Variables

本项目使用 **1 个 .env 文件**（位于项目根目录）：

### `.env` - 完整配置 / Full Configuration

```bash
# App URL (for internal API calls)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key_here

# Supabase (PostgreSQL Database) [OPTIONAL]
# If not provided, app uses local JSON file storage
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Trigger.dev v3 (Async Task Queue) [OPTIONAL]
# NOTE: When using Trigger.dev, you MUST also configure these environment
# variables in your Trigger.dev project settings (dashboard):
# - NEXT_PUBLIC_SUPABASE_URL
# - SUPABASE_SERVICE_ROLE_KEY
# - R2_ACCOUNT_ID
# - R2_ACCESS_KEY_ID
# - R2_SECRET_ACCESS_KEY
# - R2_BUCKET_NAME
# - R2_PUBLIC_URL
# - GROQ_API_KEY
# - ANTHROPIC_API_KEY
TRIGGER_SECRET_KEY=
TRIGGER_API_KEY=
NEXT_PUBLIC_TRIGGER_PUBLIC_KEY=
TRIGGER_PROJECT_ID=

# Groq API (STT - Speech to Text)
GROQ_API_KEY=gsk_your_groq_api_key_here

# Anthropic API (Summarization)
ANTHROPIC_API_KEY=sk-ant_your_anthropic_key_here

# STT Model Configuration
GROQ_STT_MODEL=whisper-large-v3
STT_LANGUAGE=zh

# LLM Model Configuration
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
LLM_LANGUAGE=zh

# Cloudflare R2 / S3 Configuration
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key
R2_BUCKET_NAME=lightminute-recordings
R2_PUBLIC_URL=https://your-r2-subdomain.r2.dev
```

## 快速开始 / Quick Start

### 1. 配置环境变量 / Configure Environment Variables

复制 `.env.example` 为 `.env` 并填入你的配置：

```bash
cp .env.example .env
# 编辑 .env 文件，填入你的实际配置
```

### 2. 构建并启动服务 / Build and Start Services

```bash
# 在项目根目录执行
docker-compose up -d --build
```

### 3. 访问应用 / Access the App

- 应用: http://localhost:3000

## 架构说明 / Architecture Overview

### Docker 构建策略 / Docker Build Strategy

项目使用 Next.js standalone 模式构建：

- **多阶段构建** / Multi-stage Build:
  - `base`: 基础 Node.js 镜像
  - `deps`: 安装依赖
  - `builder`: 构建 Next.js 应用
  - `runner`: 生产运行镜像

- **Standalone 输出** / Standalone Output:
  - 仅包含运行时所需的最小镜像
  - 不包含 node_modules 源代码
  - 镜像体积更小

### 环境变量处理 / Environment Variable Handling

**重要提示 / Important Notes:**

- `NEXT_PUBLIC_*` 变量在运行时读取，不在构建时内联
- 所有环境变量通过 `.env` 文件在容器启动时注入
- 修改环境变量后需要重启容器

## 常用命令 / Common Commands

### 查看服务状态 / Check Service Status

```bash
docker-compose ps
```

### 查看日志 / View Logs

```bash
# 查看所有服务日志
docker-compose logs -f

# 只看应用日志
docker-compose logs -f app
```

### 停止服务 / Stop Services

```bash
docker-compose down
```

### 停止服务并删除数据卷（⚠️ 会丢失所有数据）

```bash
docker-compose down -v
```

### 重新构建并启动 / Rebuild and Restart

```bash
docker-compose up -d --build
```

### 进入容器 / Enter Container

```bash
# 进入应用容器
docker-compose exec app sh
```

## 音频处理架构 / Audio Processing Architecture

### 上传方式 / Upload Methods

#### 方式一：R2 直传（推荐）/ Method 1: R2 Direct Upload (Recommended)

```
┌─────────┐     ┌──────────────┐     ┌──────────┐
│ Browser │────▶│  Next.js     │────▶│  R2      │
│         │     │  Get Presigned│     │  Storage │
│         │◀────│  URL          │◀────│           │
└─────────┘     └──────────────┘     └──────────┘
     │
     │                    ┌──────────────┐
     └───────────────────▶│  Create      │
                          │  Recording   │
                          └──────────────┘
```

**优点 / Advantages:**
- 节省服务器带宽
- 支持大文件上传
- 减少服务器存储压力

#### 方式二：传统上传 / Method 2: Traditional Upload

```
┌─────────┐     ┌──────────────┐
│ Browser │────▶│  Next.js     │────▶│  Local    │
│         │     │  Save to     │     │  uploads/ │
└─────────┘     └──────────────┘     └──────────┘
```

### 音频播放 / Audio Playback

R2 音频通过 API 代理访问，支持 Range 请求：

```
GET /api/r2/audio/[...key]
```

**特性 / Features:**
- 支持 Range 请求头
- 支持音频流式播放
- 自动设置正确的 Content-Type
- 添加缓存头

### 长音频处理 / Long Audio Handling

- **转写支持** / Transcription Support:
  - Groq Whisper API 支持最长 25MB
  - 建议单条录音不超过 2 小时
  - Trigger.dev 异步任务最长执行时间 5 分钟

- **流式播放** / Streaming Playback:
  - 音频播放器使用 Range 请求分段加载
  - 无需下载整个文件即可开始播放
  - 进度条跳转时自动请求相应位置的数据

## 数据持久化 / Data Persistence

以下数据通过 Docker volumes 持久化保存：

- `lightminute-uploads` - 上传的音频文件（传统上传模式）
- `lightminute-data` - 数据库文件（SQLite 本地模式）

即使容器被删除，这些数据也不会丢失。

## 备份数据 / Backup Data

```bash
# 备份上传文件
docker run --rm -v lightminute-uploads:/data -v $(pwd):/backup alpine tar czf /backup/backup-uploads-$(date +%Y%m%d).tar.gz -C /data .

# 备份数据库
docker run --rm -v lightminute-data:/data -v $(pwd):/backup alpine tar czf /backup/backup-data-$(date +%Y%m%d).tar.gz -C /data .
```

## Trigger.dev 配置 / Trigger.dev Configuration

### 使用 Trigger.dev / Using Trigger.dev

1. 在 Trigger.dev 控制台创建项目
2. 获取项目 ID 和 API 密钥
3. 配置环境变量到 `.env`
4. **重要** / Important: 在 Trigger.dev 项目设置中配置所有必要的环境变量

### Trigger.dev 需要的环境变量 / Required Env Vars

在 Trigger.dev 控制台必须配置：

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET_NAME`
- `R2_PUBLIC_URL`
- `GROQ_API_KEY`
- `ANTHROPIC_API_KEY`

## 删除操作 / Delete Operations

删除操作会级联删除：

1. R2 中的音频文件和元数据
2. Supabase 或 SQLite 中的数据库记录
3. 本地音频文件（如有）

## 单个删除：`DELETE /api/recording/:id`
全部删除：`DELETE /api/recordings/all`

## 生产环境建议 / Production Recommendations

1. **使用 HTTPS** / Use HTTPS: 配置 SSL 证书（可以使用 Let's Encrypt + Nginx 或 Traefik）
2. **防火墙** / Firewall: 只暴露必要的端口（3000, 80, 443）
3. **定期备份** / Regular Backups: 设置定时任务备份数据卷
4. **资源限制** / Resource Limits: 在 docker-compose.yml 中添加 CPU/内存限制
5. **日志轮转** / Log Rotation: 配置 Docker 日志轮转
6. **环境变量安全** / Env Var Security: 不要把 .env 文件权限设置为 600

## 故障排查 / Troubleshooting

### 应用无法启动 / App Won't Start

检查：
1. 容器是否正常运行: `docker-compose ps`
2. 应用日志: `docker-compose logs app`
3. 环境变量是否正确配置

### 音频上传失败 / Audio Upload Failed

检查：
1. uploads 目录权限
2. 磁盘空间是否充足
3. `docker volume inspect lightminute-uploads`

### 音频无法播放 / Audio Won't Play

检查：
1. R2 配置是否正确
2. API 代理是否正常工作
3. 浏览器控制台网络请求
4. Range 请求是否正常

### 环境变量不生效 / Environment Variables Not Working

确保：
1. `.env` 文件在项目根目录
2. 重新构建容器: `docker-compose up -d --build`

### Trigger.dev 任务失败 / Trigger.dev Tasks Failing

检查：
1. Trigger.dev 控制台日志
2. Trigger.dev 项目设置中的环境变量
3. 任务运行日志中的环境配置状态输出

## 从旧版本迁移 / Migration from Older Versions

如果你正在从旧的双容器架构（frontend + backend）迁移：

1. 备份旧数据（如果需要）
2. 使用新的单一 `.env` 文件格式
3. 更新 docker-compose.yml 引用
4. 数据卷名称已从 `backend-uploads` 和 `backend-data` 改为 `app-uploads` 和 `app-data`
