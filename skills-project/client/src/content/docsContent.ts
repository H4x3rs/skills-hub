/**
 * 文档各章节的 Markdown 内容
 */
export const docsContent: Record<string, string> = {
  overview: `# 概述

BotSkill 是一个开放的 AI 技能市场，让开发者能够轻松发现、分享和集成各种智能技能。

## 什么是 BotSkill？

BotSkill 为 AI 代理、智能助手等应用提供可复用的技能模块。无论是数据处理、自然语言处理、API 集成还是其他功能，都可以在技能库中找到或发布。

## 核心概念

- **技能 (Skill)**：可重用的功能模块，通过 SKILL.md 定义元数据与文档
- **版本 (Version)**：技能的不同版本，支持语义化版本 (X.Y.Z)
- **发布者 (Publisher)**：技能的创建者和维护者
- **使用者**：浏览、下载、集成技能的开发者

## 功能特性

| Web 端 | CLI 与 API |
|--------|------------|
| 技能浏览、搜索、筛选 | skm 命令行工具 |
| 多语言、明暗主题 | RESTful API |
| 用户认证、个人资料 | JWT 认证 |
| 收藏、发布、数据统计 | 角色权限控制 |
| 管理员后台 | |
`,

  'getting-started': `# 快速开始

欢迎使用 BotSkill！这是一个为开发者提供的智能技能分享平台。本指南帮助您在 5 分钟内上手。

## 5 分钟上手

1. **注册账户**：点击右上角「注册」，填写用户名、邮箱、密码，完成注册后自动登录
2. **浏览技能**：进入「技能库」，可按分类（AI、数据、Web 等）或关键词搜索
3. **下载技能**：点击技能卡片进入详情页，复制安装命令 \`skm get 技能名\` 或点击下载按钮
4. **安装 CLI**（可选）：\`npm install -g @botskill/cli\`，使用 \`skm get 技能名\` 下载到本地
5. **发布技能**（需发布者角色）：在「个人资料 → 我的技能」点击「发布技能」，上传 SKILL.md 或压缩包

## 注册与登录

注册需提供：用户名（3–30 字符）、邮箱、密码（至少 8 字符，含大小写和数字）。登录支持邮箱或用户名 + 密码。登录后 Token 默认 7 天有效，支持刷新 Token 保持会话。

## 核心概念

- **技能 (Skill)**：可重用的功能模块，通过 SKILL.md 定义元数据与文档
- **版本 (Version)**：技能的不同版本，支持语义化版本 X.Y.Z
- **发布者 (Publisher)**：技能的创建者和维护者
- **使用者**：浏览、下载、集成技能的开发者

## 角色说明

- **用户 (user)**：浏览、下载、收藏技能
- **发布者 (publisher)**：可发布和管理自己的技能
- **管理员 (admin)**：完整管理权限，可审核技能、管理用户与系统设置

> 如何成为发布者：联系管理员将您的角色升级为 publisher，或使用 admin 账户在后台分配角色。
`,

  'web-usage': `# Web 端使用

## 技能库

在技能库页面可以：

- **搜索**：按技能名称、描述、标签搜索
- **筛选**：按分类（AI、数据、Web、DevOps、安全、工具）过滤
- **切换视图**：网格视图或列表视图
- **下载**：点击技能卡片或详情页的下载按钮

## 技能详情

点击技能进入详情页，可查看：

- 技能描述、作者、评分、下载量
- 安装命令（复制即用）
- 版本选择与 SKILL.md 文档
- 收藏按钮（需登录）

## 个人资料

登录后进入个人资料，包含：

- **个人资料**：编辑头像、昵称、简介
- **我的技能**：查看、搜索、管理已发布技能，支持编辑、分页
- **数据统计**：总下载量、技能数、下载趋势图
- **我的收藏**：收藏的技能列表，可取消收藏

## 发布技能（Web）

拥有发布者或管理员角色后，在「我的技能」点击「发布技能」：

- **上传文件**：支持 .zip、.tar.gz、.md，需包含 SKILL.md
- **从 URL 导入**：输入 GitHub 或远程地址，自动解析
- 解析后可编辑元数据，确认后保存
`,

  'cli-tool': `# CLI 工具

skm 是 BotSkill 官方命令行工具，用于管理、发布和获取 AI 技能。

## 安装

\`\`\`bash
npm install -g @botskill/cli
\`\`\`

或使用 npx：\`npx @botskill/cli list\`

依赖：Node.js v14+、npm v6+

## 命令概览

| 命令 | 描述 |
|------|------|
| \`skm init\` | 初始化新技能项目（创建 skill.config.json） |
| \`skm login\` | 登录 BotSkill 账户 |
| \`skm logout\` | 登出当前账户 |
| \`skm config\` | 管理 CLI 配置（apiUrl、token 等） |
| \`skm list\` | 列出技能，支持分类、搜索过滤 |
| \`skm search [query]\` | 按关键词搜索技能 |
| \`skm get [name]\` | 下载技能到本地，支持 name@version 指定版本 |
| \`skm info [name]\` | 查看技能详情（不下载） |
| \`skm push\` / \`skm publish\` | 发布技能到 BotSkill（需登录，发布者或管理员） |
| \`skm help\` | 显示帮助信息 |

## 常用示例

\`\`\`bash
# 搜索技能
skm search pdf
skm search translator --category ai

# 列出技能
skm list --category ai --limit 10
skm list --mine   # 我的技能（需登录）

# 下载技能
skm get pdf-processing
skm get pdf-processing@1.0.0 -o ./my-skills

# 查看技能详情
skm info pdf-processing
\`\`\`

## 配置

安装后会在用户主目录创建 \`~/.skm/\`，使用 \`skm config\` 管理：

\`\`\`bash
skm config --list              # 列出所有配置
skm config --get apiUrl      # 获取 API 地址
skm config --set apiUrl=...  # 设置 API 地址
\`\`\`

环境变量 \`BOTSKILL_API_URL\` 可覆盖 API 地址。
`,

  'publish-skill': `# 发布技能

## 发布方式

BotSkill 支持两种发布方式：

- **Web 端**：登录后进入个人资料 → 我的技能 → 发布技能，可上传文件或从 URL 导入
- **CLI**：使用 \`skm push\` 或 \`skm publish\` 从本地发布

## 技能格式（SKILL.md）

技能使用 SKILL.md 文件定义元数据，采用 YAML frontmatter + Markdown 文档：

\`\`\`yaml
---
name: my-skill
description: 技能简短描述
category: ai
tags: [nlp, translation]
license: MIT
metadata:
  version: 1.0.0
  author: your-username
---

# 技能文档

详细使用说明、示例代码等...
\`\`\`

支持格式：\`.zip\`、\`.tar.gz\` 压缩包（需包含 SKILL.md），或单独的 \`SKILL.md\` 文件。

## CLI 发布流程

1. 初始化项目：\`skm init --name my-skill --description "描述"\`
2. 编辑 \`skill.config.json\` 或创建 \`SKILL.md\`
3. 登录：\`skm login\`
4. 发布：\`skm push\` 或 \`skm publish\`

## 项目结构示例

\`\`\`
my-skill/
├── SKILL.md           # 技能元数据与文档（必需）
├── skill.config.json  # CLI 配置（skm init 生成）
├── index.js           # 主入口（可选）
├── package.json       # 依赖（可选）
└── examples/         # 示例（可选）
\`\`\`

## 分类与版本

- **分类**：ai, data, web, devops, security, tools
- **版本**：使用语义化版本 X.Y.Z
- 发布者需拥有 **publisher** 或 **admin** 角色
`,

  'api-reference': `# API 参考

BotSkill API 为 RESTful 接口，基础路径为 \`/api\`。除公开接口外，需在请求头携带 \`Authorization: Bearer <token>\`。

## 认证

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | \`/auth/register\` | 注册新用户 |
| POST | \`/auth/login\` | 登录（返回 accessToken、refreshToken） |
| POST | \`/auth/logout\` | 登出（需 refreshToken） |
| POST | \`/auth/refresh\` | 刷新 Token（需 refreshToken） |
| GET | \`/auth/me\` | 获取当前用户（需认证） |

## 技能（公开）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | \`/skills\` | 获取已发布技能列表（分页） |
| GET | \`/skills/search\` | 搜索技能 |
| GET | \`/skills/popular\` | 热门技能 |
| GET | \`/skills/latest\` | 最新技能 |
| GET | \`/skills/by-name/:name\` | 按名称获取技能 |
| GET | \`/skills/:id\` | 获取技能详情 |
| GET | \`/skills/:id/versions/:version\` | 获取指定版本详情 |
| GET | \`/skills/:id/download\` | 获取下载链接 |

搜索参数：\`q\` 关键词、\`category\` 分类、\`tags\` 标签、\`page\`、\`limit\`

## 用户（需认证）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | \`/users/:id\` | 获取用户信息 |
| PUT | \`/users/:id\` | 更新用户（fullName、bio、avatar） |
| GET | \`/users/stats\` | 获取个人数据统计 |
| GET | \`/users/me/favorites\` | 我的收藏 |
| POST | \`/users/me/favorites/:skillId\` | 添加收藏 |
| DELETE | \`/users/me/favorites/:skillId\` | 取消收藏 |

## 发布者（需 publisher/admin）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | \`/skills/my\` | 我的技能 |
| POST | \`/skills/upload\` | 上传技能包（zip/tar.gz/md） |
| POST | \`/skills/upload/parse\` | 解析上传文件（预览元数据） |
| POST | \`/skills/upload/parse-url\` | 从 URL 解析技能 |
| POST | \`/skills/create-from-form\` | 创建技能（表单） |
| PUT | \`/skills/update-from-form/:id\` | 更新技能 |
| POST | \`/skills\` | 创建技能（JSON） |
| PUT | \`/skills/:id\` | 更新技能 |
| DELETE | \`/skills/:id\` | 删除技能 |

## 管理员（需 admin）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | \`/admin/dashboard\` | 仪表板统计 |
| GET | \`/admin/users\` | 用户列表 |
| GET | \`/admin/users-with-roles\` | 用户及角色 |
| PUT | \`/admin/users/:id\` | 更新用户 |
| PUT | \`/admin/users/:id/role\` | 分配角色 |
| PUT | \`/admin/users/:id/status\` | 启用/禁用用户 |
| POST | \`/admin/users/:id/reset-password\` | 重置密码 |
| DELETE | \`/admin/users/:id\` | 删除用户 |
| GET | \`/admin/skills\` | 所有技能（含待审核） |
| PUT | \`/admin/skills/:id/status\` | 更新技能状态 |
| GET | \`/admin/roles\` | 角色列表 |
| GET | \`/admin/permissions\` | 权限列表 |
| GET | \`/admin/settings\` | 系统设置 |
| PUT | \`/admin/settings\` | 更新系统设置 |
`,

  'best-practices': `# 最佳实践

## 技能开发指南

- **清晰的接口设计**：提供简单、一致的 API 接口
- **充分的错误处理**：对可能的错误情况进行适当的处理
- **良好的文档**：提供详细的使用说明和示例代码
- **单元测试**：包含充分的测试用例确保功能正确性
- **向后兼容**：在更新时保持向后兼容性
- **性能优化**：优化性能，减少资源消耗

## 安全性考虑

- 对用户输入进行适当的验证和清理
- 避免执行任意代码或脚本
- 使用安全的数据传输协议
- 保护敏感信息不被泄露

## 发布建议

- 使用语义化版本号 (SemVer)，如 1.0.0
- 在 SKILL.md 中提供清晰的使用说明和示例
- 选择合适的分类和标签，便于用户发现
- 定期更新维护，积极响应用户反馈

## SKILL.md 规范

- \`name\`：小写字母、数字、连字符，1–64 字符
- \`description\`：必填，最多 1024 字符
- \`category\`：ai / data / web / devops / security / tools
- \`metadata.version\`：X.Y.Z 格式
`,

  deployment: `# 部署指南

## 环境要求

- Node.js 18+
- MongoDB 4.4+（本地或 Atlas）
- 内存建议 1GB+
- Docker 20+（可选，用于容器化部署）

## 本地开发

\`\`\`bash
# 克隆并安装
git clone <repo> && cd skills-project
npm run install:all

# 配置 backend/.env
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/botskill
JWT_SECRET=your-secret-key-at-least-32-chars

# 启动（前后端并行）
npm run dev
\`\`\`

前端默认 \`http://localhost:3000\`，后端 \`http://localhost:3001\`

---

## Docker 部署（推荐）

项目根目录提供 \`Dockerfile\`，可将前后端一体构建为单个镜像。

### 构建镜像

\`\`\`bash
cd skills-project
docker build -t botskill:latest .
\`\`\`

### 运行容器

\`\`\`bash
docker run -d \\
  --name botskill \\
  -p 3000:3000 \\
  -e MONGODB_URI=mongodb://host.docker.internal:27017/botskill \\
  -e JWT_SECRET=your-secret-key-at-least-32-chars \\
  botskill:latest
\`\`\`

- 端口 \`3000\`：应用入口（前端 + API 同源）
- \`MONGODB_URI\`：宿主机 MongoDB 可用 \`host.docker.internal\`（Mac/Windows）或宿主机 IP
- 生产环境建议使用外部 MongoDB（如 Atlas）

### Docker Compose 示例

\`\`\`yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      MONGODB_URI: mongodb://mongo:27017/botskill
      JWT_SECRET: \${JWT_SECRET}
    depends_on:
      - mongo
  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
volumes:
  mongo_data:
\`\`\`

\`\`\`bash
JWT_SECRET=your-secret docker-compose up -d
\`\`\`

### 初始化数据（Docker 内）

\`\`\`bash
docker exec -it botskill node scripts/create-admin.js
docker exec -it botskill node scripts/seed-permissions-roles.js
\`\`\`

---

## 传统部署（PM2 + Nginx）

### 1. 构建前端

\`\`\`bash
npm run build
\`\`\`

产物在 \`client/dist\`，可部署到 Nginx、Vercel 等静态托管。

### 2. 后端（PM2）

\`\`\`bash
cd backend
npm install --production
# 配置 .env (NODE_ENV=production, MONGODB_URI, JWT_SECRET)
pm2 start server.js --name skills-backend
pm2 startup && pm2 save
\`\`\`

### 3. Nginx 反向代理

\`\`\`nginx
# API 代理
location /api {
  proxy_pass http://127.0.0.1:3001;
  proxy_http_version 1.1;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;
}

# 前端 SPA
location / {
  root /path/to/client/dist;
  try_files $uri $uri/ /index.html;
}
\`\`\`

### 4. HTTPS 配置

使用 Let's Encrypt 免费证书：

\`\`\`bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d botskill.ai
\`\`\`

### 5. 初始化数据

\`\`\`bash
cd backend
npm run create-admin    # 创建管理员账户
npm run seed-permissions # 初始化权限与角色
\`\`\`

---

## 环境变量

| 变量 | 说明 |
|------|------|
| NODE_ENV | development / production |
| PORT | 应用端口，默认 3000 |
| MONGODB_URI | MongoDB 连接字符串 |
| JWT_SECRET | JWT 密钥，务必使用强随机串（\`openssl rand -base64 32\`） |
| FRONTEND_URL | 前端地址（OAuth 回调用，Docker 部署时通常同源可省略） |
| GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET | Google OAuth（可选） |
| GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET | GitHub OAuth（可选） |
`,

  faq: `# 常见问题

## 安装与运行

### 端口被占用怎么办？

修改 \`backend/.env\` 中的 \`PORT\`，或关闭占用该端口的进程。

### MongoDB 连接失败？

检查 \`MONGODB_URI\` 是否正确，MongoDB 服务是否运行，防火墙是否放行。

### 依赖安装失败？

尝试 \`npm cache clean --force\`，删除 \`node_modules\` 后重新 \`npm install\`。

## 部署

### 502 Bad Gateway？

确认后端进程（PM2）在运行，Nginx 的 proxy_pass 端口与后端一致。

### 如何配置 HTTPS？

使用 Let's Encrypt：\`certbot --nginx -d botskill.ai\`

## 使用

### 如何成为发布者？

联系管理员将您的角色升级为 publisher，或使用已有 admin 账户在后台分配角色。

### 技能审核流程？

发布者提交后状态为「待审核」，管理员在后台可批准（published）或拒绝（archived）。
`,

  appendix: `# 附录

## 技术栈

| 前端 | 后端 |
|------|------|
| React 18、TypeScript | Node.js、Express |
| Vite、Tailwind CSS | MongoDB、Mongoose |
| React Router、i18next | JWT、Bcrypt |

## 项目结构

\`\`\`
skills-project/
├── client/          # React 前端
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   └── locales/
│   └── package.json
├── backend/         # Express 后端
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
└── skm-cli/         # CLI 工具
\`\`\`

## 贡献指南

1. Fork 项目
2. 创建功能分支 \`git checkout -b feature/xxx\`
3. 提交更改 \`git commit -m 'Add xxx'\`
4. 推送分支并创建 Pull Request

许可证：MIT
`,
};
