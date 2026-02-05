# BotSkill 项目结构说明

## 整体架构

```
botskill/                    # 项目根目录
├── client/                    # React前端应用
│   ├── public/                # 静态资源
│   │   └── favicon.ico
│   ├── src/                   # 源代码
│   │   ├── assets/            # 静态资源 (图片, 字体等)
│   │   ├── components/        # 可复用UI组件
│   │   │   ├── ui/            # 基础UI组件 (按钮、输入框等)
│   │   │   └── ...           # 业务组件
│   │   ├── pages/             # 页面组件
│   │   │   ├── HomePage.tsx
│   │   │   ├── SkillsPage.tsx
│   │   │   ├── AboutPage.tsx
│   │   │   ├── DocsPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   └── AdminPage.tsx
│   │   ├── contexts/          # React Context
│   │   │   └── ThemeContext.tsx
│   │   ├── hooks/             # 自定义React Hooks
│   │   ├── lib/               # 工具库
│   │   ├── locales/           # 国际化资源文件
│   │   │   ├── zh-CN.json
│   │   │   ├── en-US.json
│   │   │   ├── ja-JP.json
│   │   │   ├── ko-KR.json
│   │   │   ├── de-DE.json
│   │   │   ├── fr-FR.json
│   │   │   ├── ru-RU.json
│   │   │   └── ar-SA.json
│   │   ├── styles/            # 样式文件
│   │   │   └── index.css      # Tailwind CSS自定义样式
│   │   ├── types/             # TypeScript类型定义
│   │   ├── utils/             # 工具函数
│   │   ├── App.tsx            # 应用根组件
│   │   ├── main.tsx           # 应用入口文件
│   │   └── i18n.ts            # 国际化配置
│   ├── index.html             # HTML模板
│   ├── package.json           # 前端依赖配置
│   ├── tsconfig.json          # TypeScript配置
│   ├── vite.config.ts         # Vite构建配置
│   └── tailwind.config.ts     # Tailwind CSS配置
├── backend/                   # Node.js后端应用
│   ├── models/                # 数据模型 (Mongoose schemas)
│   │   ├── User.js            # 用户模型
│   │   └── Skill.js           # 技能模型
│   ├── controllers/           # 控制器逻辑
│   │   ├── authController.js  # 认证控制器
│   │   ├── userController.js  # 用户控制器
│   │   ├── skillController.js # 技能控制器
│   │   └── adminController.js # 管理员控制器
│   ├── routes/                # API路由定义
│   │   ├── auth.js            # 认证路由
│   │   ├── users.js           # 用户路由
│   │   ├── skills.js          # 技能路由
│   │   └── admin.js           # 管理员路由
│   ├── middleware/            # Express中间件
│   │   └── auth.js            # 认证中间件
│   ├── services/              # 业务逻辑服务 (预留)
│   ├── utils/                 # 工具函数 (预留)
│   ├── config/                # 配置文件 (预留)
│   ├── API.md                 # API文档
│   ├── server.js              # 主服务器文件
│   ├── package.json           # 后端依赖配置
│   └── .env                   # 环境变量配置
├── README.md                  # 项目说明文档
├── package.json               # 根目录依赖配置 (用于管理前后端)
└── .env                       # 根目录环境变量 (预留)
```

## 技术栈

### 前端 (client/)
- **React 18**: UI库
- **TypeScript**: 类型安全
- **Vite**: 构建工具
- **Tailwind CSS**: 样式框架
- **React Router**: 路由管理
- **i18next**: 国际化
- **Radix UI**: 无障碍UI组件
- **Lucide React**: 图标库

### 后端 (backend/)
- **Node.js**: 运行时环境
- **Express**: Web框架
- **MongoDB/Mongoose**: 数据库
- **JWT**: 身份验证
- **Bcrypt**: 密码加密
- **Joi**: 数据验证
- **Helmet/CORS**: 安全中间件

## 开发命令

### 根目录
- `npm run dev`: 并行启动前后端开发服务器
- `npm run dev:client`: 启动前端开发服务器
- `npm run dev:server`: 启动后端开发服务器
- `npm run build:client`: 构建前端生产版本
- `npm run install:all`: 安装所有依赖 (根目录、前端、后端)

### 前端 (client/)
- `npm run dev`: 启动Vite开发服务器
- `npm run build`: 构建生产版本
- `npm run preview`: 预览构建结果

### 后端 (backend/)
- `npm run dev`: 启动Nodemon开发服务器
- `npm start`: 启动生产服务器
- `npm test`: 运行测试

## API 端点

### 认证
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### 用户
- `GET /api/users`
- `GET /api/users/:id`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`

### 技能
- `GET /api/skills`
- `GET /api/skills/:id`
- `POST /api/skills`
- `PUT /api/skills/:id`
- `DELETE /api/skills/:id`
- `GET /api/skills/search`
- `GET /api/skills/popular`
- `GET /api/skills/latest`

### 管理员
- `GET /api/admin/dashboard`
- `GET /api/admin/users`
- `GET /api/admin/skills`
- `PUT /api/admin/skills/:id/status`
- `PUT /api/admin/users/:id/role`