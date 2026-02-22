# Docker 部署指南

本项目支持使用 Docker 和 Docker Compose 进行一键部署。

## 前置要求

- Docker 20.10+
- Docker Compose 2.0+

## 文件说明

| 文件 | 位置 | 说明 |
|------|------|------|
| `Dockerfile` | `server/` | 后端服务 Docker 镜像配置 |
| `Dockerfile` | `client/` | 前端服务 Docker 镜像配置（多阶段构建） |
| `nginx.conf` | `client/` | Nginx 配置，支持 SPA 路由和 API 代理 |
| `docker-compose.yml` | 根目录 | 服务编排配置 |
| `.dockerignore` | 根目录、server/、client/ | Docker 构建忽略文件 |
| `.env` | `server/` | 后端环境变量（GROQ、R2 等） |
| `.env` | `client/` | 前端环境变量（Clerk 等） |
| `.env` | 根目录 | Docker Compose 构建时变量（仅 VITE_CLERK_PUBLISHABLE_KEY） |

## 环境变量说明

本项目使用 **3 个 .env 文件**：

### 1. `server/.env` - 后端运行时配置
```bash
PORT=8787
GROQ_API_KEY=...
ANTHROPIC_API_KEY=...
GROQ_STT_MODEL=whisper-large-v3
STT_LANGUAGE=zh
ANTHROPIC_MODEL=claude-sonnet-4-6
LLM_LANGUAGE=zh
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=...
R2_PUBLIC_URL=...
```

### 2. `client/.env` - 前端开发配置
```bash
VITE_CLERK_PUBLISHABLE_KEY=...
```

### 3. 根目录 `.env` - Docker 构建配置
```bash
# 仅需要前端构建时的变量
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

## 快速开始

### 1. 确认环境变量已配置

确保以下文件存在并已正确配置：
- `server/.env` - 后端配置
- `client/.env` - 前端配置
- 根目录 `.env` - Docker 构建配置（从 client/.env 复制 VITE_CLERK_PUBLISHABLE_KEY）

如果根目录 `.env` 不存在：
```bash
# 从 client/.env 复制需要的变量
echo "VITE_CLERK_PUBLISHABLE_KEY=$(grep VITE_CLERK_PUBLISHABLE_KEY client/.env | cut -d= -f2)" > .env
```

### 2. 构建并启动服务

```bash
# 在项目根目录执行
docker-compose up -d --build
```

### 3. 访问应用

- 前端: http://localhost
- 后端 API: http://localhost:8787
- 健康检查: http://localhost:8787/api/health

## 常用命令

### 查看服务状态
```bash
docker-compose ps
```

### 查看日志
```bash
# 查看所有服务日志
docker-compose logs -f

# 只看后端日志
docker-compose logs -f backend

# 只看前端日志
docker-compose logs -f frontend
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
# 进入后端容器
docker-compose exec backend sh

# 进入前端容器
docker-compose exec frontend sh
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

1. **使用 HTTPS**: 配置 SSL 证书（可以使用 Let's Encrypt + Nginx）
2. **防火墙**: 只暴露必要的端口（80, 443）
3. **定期备份**: 设置定时任务备份数据卷
4. **资源限制**: 在 docker-compose.yml 中添加 CPU/内存限制
5. **日志轮转**: 配置 Docker 日志轮转

## 故障排查

### 前端无法访问后端 API
检查：
1. 后端容器是否正常运行: `docker-compose ps`
2. 后端日志: `docker-compose logs backend`
3. Nginx 配置中的 proxy_pass 是否正确

### 音频上传失败
检查：
1. uploads 目录权限
2. 磁盘空间是否充足
3. `docker volume inspect lightminute-uploads`

### 环境变量不生效
确保：
1. `.env` 文件在项目根目录
2. 重新构建容器: `docker-compose up -d --build`
