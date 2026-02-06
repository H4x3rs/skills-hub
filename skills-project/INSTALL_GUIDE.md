# BotSkill 安装和运行指南

## 系统要求

- Node.js 16.x 或更高版本
- npm 或 yarn 包管理器
- MongoDB (本地或云端实例)

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/botskill-ai/botskill
cd botskill
```

### 2. 安装依赖

```bash
# 安装根目录依赖及前后端所有依赖
npm run install:all
```

或者分别安装：

```bash
# 根目录
npm install

# 前端
cd client && npm install && cd ..

# 后端
cd backend && npm install && cd ..
```

### 3. 配置环境变量

#### 后端配置

在 `backend/.env` 文件中配置：

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/botskill
JWT_SECRET=your-super-secret-jwt-key-for-botskill
JWT_EXPIRES_IN=7d
```

### 4. 启动应用

#### 开发模式

```bash
# 并行启动前后端 (推荐)
npm run dev
```

前端将在 `http://localhost:3000` 上运行
后端API将在 `http://localhost:3001` 上运行

#### 单独启动

```bash
# 仅启动前端
npm run dev:client

# 仅启动后端
npm run dev:server
```

### 5. 构建生产版本

```bash
# 构建前端
npm run build:client
```

## 目录结构

```
botskill/
├── client/          # React前端应用
├── backend/         # Node.js后端API
├── README.md        # 项目概述
└── package.json     # 根目录脚本配置
```

## 数据库设置

### 本地 MongoDB

1. 安装 MongoDB Community Edition
2. 启动 MongoDB 服务
3. 确保 `MONGODB_URI` 指向本地实例

### MongoDB Atlas (云)

1. 在 MongoDB Atlas 创建集群
2. 获取连接字符串
3. 更新 `MONGODB_URI` 环境变量

## API 测试

### 注册第一个用户

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "SecurePassword123",
    "fullName": "Admin User"
  }'
```

### 登录

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "SecurePassword123"
  }'
```

## 故障排除

### 常见问题

1. **端口被占用**
   - 检查 `PORT` 环境变量
   - 确保没有其他服务使用相同端口

2. **数据库连接失败**
   - 检查 `MONGODB_URI` 是否正确
   - 确保 MongoDB 服务正在运行
   - 检查防火墙设置

3. **依赖安装失败**
   - 清除 npm 缓存: `npm cache clean --force`
   - 删除 node_modules 并重新安装

### 开发工具

- **前端**: VS Code 推荐安装 ES7+ React/Redux/React-Native snippets, Tailwind CSS IntelliSense
- **后端**: Postman 或 Insomnia 用于 API 测试
- **数据库**: MongoDB Compass 用于数据库可视化

## 部署

### 生产环境

1. 将 `NODE_ENV` 设置为 `production`
2. 配置生产数据库连接
3. 设置反向代理 (如 Nginx)
4. 配置 SSL 证书

### Docker 部署 (未来扩展)

项目结构已为 Docker 部署做好准备，可通过添加 `Dockerfile` 和 `docker-compose.yml` 来实现容器化部署。