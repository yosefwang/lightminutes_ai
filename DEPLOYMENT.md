# Docker 部署指南

本项目使用 Next.js 全栈架构，支持使用 Docker 和 Docker Compose 进行一键部署。

## 前置要求

- Docker 20.10+
- Docker Compose 2.0+

## 文件说明

| 文件 | 位置 | 说明 |
|------|------|------|
| `Dockerfile` | 根目录 | Next.js 应用 Docker 镜像配置（多阶段构建） |
| `docker-compose.yml` | 根目录 | 服务编排配置 |
| `.dockerignore` | 根目录 | Docker 构建忽略文件 |
| `.env` | 根目录 | 环境变量配置（所有环境变量都在这里） |

## 环境变量说明

本项目使用 **1 个 .env 文件**（位于项目根目录）：

### `.env` - 完整配置
```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key_here

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

## 快速开始

### 1. 配置环境变量

复制 `.env.example` 为 `.env` 并填入你的配置：

```bash
cp .env.example .env
# 编辑 .env 文件，填入你的实际配置
```

### 2. 构建并启动服务

```bash
# 在项目根目录执行
docker-compose up -d --build
```

### 3. 访问应用

- 应用: http://localhost:3000

## 常用命令

### 查看服务状态
```bash
docker-compose ps
```

### 查看日志
```bash
# 查看所有服务日志
docker-compose logs -f

# 只看应用日志
docker-compose logs -f app
```

### 停止服务
```bash
docker-compose down
```

### 停止服务并删除数据卷（⚠️ 会丢失所有数据）
```bash
docker-compose down -v
```

### 重新构建并启动
```bash
docker-compose up -d --build
```

### 进入容器
```bash
# 进入应用容器
docker-compose exec app sh
```

## 数据持久化

以下数据通过 Docker volumes 持久化保存：

- `lightminute-uploads` - 上传的音频文件
- `lightminute-data` - 数据库文件

即使容器被删除，这些数据也不会丢失。

## 备份数据

```bash
# 备份上传文件
docker run --rm -v lightminute-uploads:/data -v $(pwd):/backup alpine tar czf /backup/backup-uploads-$(date +%Y%m%d).tar.gz -C /data .

# 备份数据库
docker run --rm -v lightminute-data:/data -v $(pwd):/backup alpine tar czf /backup/backup-data-$(date +%Y%m%d).tar.gz -C /data .
```

## 生产环境建议

1. **使用 HTTPS**: 配置 SSL 证书（可以使用 Let's Encrypt + Nginx 或 Traefik）
2. **防火墙**: 只暴露必要的端口（3000, 80, 443）
3. **定期备份**: 设置定时任务备份数据卷
4. **资源限制**: 在 docker-compose.yml 中添加 CPU/内存限制
5. **日志轮转**: 配置 Docker 日志轮转

## 故障排查

### 应用无法启动
检查：
1. 容器是否正常运行: `docker-compose ps`
2. 应用日志: `docker-compose logs app`
3. 环境变量是否正确配置

### 音频上传失败
检查：
1. uploads 目录权限
2. 磁盘空间是否充足
3. `docker volume inspect lightminute-uploads`

### 环境变量不生效
确保：
1. `.env` 文件在项目根目录
2. 重新构建容器: `docker-compose up -d --build`

## 从旧版本迁移

如果你正在从旧的双容器架构（frontend + backend）迁移：

1. 备份旧数据（如果需要）
2. 使用新的单一 `.env` 文件格式
3. 更新 docker-compose.yml 引用
4. 数据卷名称已从 `backend-uploads` 和 `backend-data` 改为 `app-uploads` 和 `app-data`
