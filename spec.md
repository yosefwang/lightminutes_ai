# 📝 Spec: LiteMinute AI (Vibe-Steady Edition)

## 1. 项目愿景 (Vision)
构建一个极简、自控、非 Serverless 的语音转文字与摘要工具。
- **核心目标**：移动端优先，实现“录音 -> 自动上传 -> AI 转写 -> 智能总结”的闭环。
- **Vibe 原则**：
    - **拒绝 Serverless**：采用常驻 Node.js 进程，彻底解决冷启动延迟和上传文件大小限制。
    - **SQL 强持久化**：使用 SQLite 存储，确保每一条录音和摘要都有迹可循，不随页面刷新丢失。
    - **前后端分离**：React 负责 UI，Hono 负责逻辑，架构清晰，易于 AI 维护。

---

## 2. 技术栈 (Technical Stack)
- **Frontend (client)**: React (Vite) + Tailwind CSS + Lucide React + Shadcn UI (可选).
- **Backend (server)**: Hono.js (Node.js Adapter).
- **Database**: SQLite + Drizzle ORM.
- **AI Services**:
    - **STT**: Groq (Whisper-large-v3) - 极速语音转文字方案。
    - **LLM**: Claude 3.5 Sonnet / DeepSeek-V3 - 结构化摘要生成。

---

## 3. 项目目录结构 (Project Structure)
AI 在初始化时请严格遵循此结构：
```text
lite-minute/
├── client/                # React 前端
├── server/                # Hono 后端
│   ├── src/
│   │   ├── db/            # Schema 与数据库连接
│   │   ├── index.ts       # 接口路由
│   │   └── services/      # Groq 与 LLM 调用逻辑
│   ├── uploads/           # 存储本地音频文件 (.webm)
│   └── data/              # 存储 sqlite.db 文件
├── package.json           # 根目录管理脚本 (concurrently)
└── spec.md                # 核心需求文档
4. 数据库设计 (Database Schema)
使用 Drizzle ORM 定义以下 SQLite 字段：

字段名	类型	说明
id	text	主键 (UUID/ULID)
title	text	默认："新录音 " + ISO 时间
audioPath	text	音频文件在服务器的相对存储路径
transcript	text	Whisper 转录的原始文本
summary	text	AI 生成的 Markdown 摘要内容
status	text	'recording', 'processing', 'completed', 'failed'
duration	integer	录音时长（秒）
createdAt	integer	时间戳 (Date.now())
5. 核心 API 接口 (Hono)
POST /api/upload
逻辑：接收 multipart/form-data，保存音频至 ./server/uploads/，在 DB 插入 status='processing' 的记录。

返回：{ id: string }。

POST /api/process/:id
逻辑：

调用 Groq API 进行 Whisper 转录。

将转录文本发送至 LLM 生成摘要。

更新数据库字段，状态改为 completed。

Prompt 策略：摘要需包含：# 会议主题、## 关键要点、## 待办事项 (Action Items)。

GET /api/history
逻辑：从 SQLite 按 createdAt 降序查询
