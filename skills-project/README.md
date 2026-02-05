# BotSkill - 全栈AI技能管理平台

一个用于管理和分享AI代理技能的全栈应用程序，前端使用React，后端使用Node.js/Express/MongoDB。

## 项目结构

```
botskill/
├── client/                 # React前端应用
│   ├── public/
│   ├── src/
│   │   ├── components/     # 可复用UI组件
│   │   ├── pages/          # 页面组件
│   │   ├── contexts/       # React上下文
│   │   ├── hooks/          # 自定义Hook
│   │   ├── locales/        # 国际化资源
│   │   └── utils/          # 工具函数
│   ├── package.json
│   └── ...
├── backend/               # Node.js/Express后端API
│   ├── models/            # Mongoose模型
│   ├── controllers/       # 控制器逻辑
│   ├── routes/            # API路由
│   ├── middleware/        # Express中间件
│   ├── services/          # 业务服务
│   ├── utils/             # 工具函数
│   ├── config/            # 配置文件
│   ├── server.js          # 主服务器文件
│   └── package.json
├── package.json           # 根目录包配置
└── README.md
```

## 功能特性

### 前端 (React)
- 响应式用户界面，支持桌面和移动端
- 多语言支持 (中文、英文、日文、韩文、德文、法文、俄文、阿拉伯文)
- 主题切换 (明暗模式)
- 技能浏览、搜索和筛选
- 用户认证 (注册、登录)
- 个人资料管理
- 管理员后台

### 后端 (Node.js/Express)
- RESTful API设计
- JWT身份验证和授权
- 用户管理 (CRUD操作)
- 技能管理 (发布、编辑、审核)
- 角色权限控制 (用户、发布者、管理员)
- 数据验证和错误处理
- MongoDB数据存储

## API端点

### 认证相关
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 用户登出
- `GET /api/auth/me` - 获取当前用户信息

### 用户相关
- `GET /api/users` - 获取所有用户 (需管理员权限)
- `GET /api/users/:id` - 获取特定用户信息
- `PUT /api/users/:id` - 更新用户信息
- `DELETE /api/users/:id` - 删除用户 (需管理员权限)

### 技能相关
- `GET /api/skills` - 获取所有已发布技能
- `GET /api/skills/:id` - 获取特定技能
- `POST /api/skills` - 创建新技能 (需发布者或管理员权限)
- `PUT /api/skills/:id` - 更新技能
- `DELETE /api/skills/:id` - 删除技能
- `GET /api/skills/search` - 搜索技能
- `GET /api/skills/popular` - 获取热门技能
- `GET /api/skills/latest` - 获取最新技能

### 管理员相关
- `GET /api/admin/dashboard` - 获取仪表板统计数据
- `GET /api/admin/users` - 获取所有用户
- `GET /api/admin/skills` - 获取所有技能
- `PUT /api/admin/skills/:id/status` - 更新技能状态
- `PUT /api/admin/users/:id/role` - 管理用户角色

## 安装和运行

### 环境要求
- Node.js 16+
- MongoDB

### 快速开始

1. 克隆项目
```bash
git clone <repository-url>
cd botskill
```

2. 安装依赖
```bash
npm run install:all
```

3. 设置环境变量
在backend目录中创建 `.env` 文件：


backend/.env:
```
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/botskill
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
```

4. 启动开发服务器
```bash
# 并行启动前端和后端
npm run dev

# 或分别启动
npm run dev:client  # 启动前端
npm run dev:server  # 启动后端
```

5. 构建生产版本
```bash
npm run build:client  # 构建前端
```

## 技术栈

### 前端
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- i18next (国际化)

### 后端
- Node.js
- Express.js
- MongoDB + Mongoose
- JSON Web Tokens (JWT)
- Bcrypt (密码加密)

## 贡献

1. Fork项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建Pull Request

## 许可证

MIT License