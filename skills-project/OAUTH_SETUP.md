# OAuth 登录配置指南

本指南将帮助您配置 Google 和 GitHub 的 OAuth 登录功能。

## 目录

- [Google OAuth 配置](#google-oauth-配置)
- [GitHub OAuth 配置](#github-oauth-配置)
- [环境变量配置](#环境变量配置)
- [回调 URL 配置](#回调-url-配置)
- [测试 OAuth 登录](#测试-oauth-登录)
- [常见问题](#常见问题)

---

## Google OAuth 配置

### 1. 创建 Google Cloud 项目

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 点击左上角的项目选择器，然后点击 **"新建项目"**
3. 输入项目名称（例如：`BotSkill`），然后点击 **"创建"**

### 2. 启用 Google+ API

1. 在 Google Cloud Console 中，进入 **"API 和服务" > "库"**
2. 搜索 **"Google+ API"** 或 **"Google Identity"**
3. 点击进入，然后点击 **"启用"**

> **注意**：Google 已弃用 Google+ API，现在使用 **Google Identity Services**。但 Passport.js 的 Google 策略仍然可以正常工作。

### 3. 创建 OAuth 2.0 凭据

1. 进入 **"API 和服务" > "凭据"**
2. 点击 **"+ 创建凭据"** > **"OAuth 客户端 ID"**
3. 如果是第一次创建，需要先配置 **"OAuth 同意屏幕"**：
   - **用户类型**：选择 **"外部"**（如果是个人项目）或 **"内部"**（如果是 Google Workspace）
   - **应用名称**：输入您的应用名称（例如：`BotSkill`）
   - **用户支持电子邮件**：选择您的邮箱
   - **开发者联系信息**：输入您的邮箱
   - 点击 **"保存并继续"**
   - **作用域**：可以跳过，直接点击 **"保存并继续"**
   - **测试用户**：如果是外部应用，需要添加测试用户（可选）
   - 点击 **"返回到信息中心"**

4. 创建 OAuth 客户端 ID：
   - **应用类型**：选择 **"Web 应用"**
   - **名称**：输入名称（例如：`BotSkill Web Client`）
   - **已授权的 JavaScript 来源**：
     - 开发环境：`http://localhost:5173`
     - 生产环境：`https://yourdomain.com`
   - **已授权的重定向 URI**：
     - 开发环境：`http://localhost:3001/api/auth/google/callback`
     - 生产环境：`https://yourdomain.com/api/auth/google/callback`
   - 点击 **"创建"**

5. 复制凭据：
   - 系统会显示 **客户端 ID** 和 **客户端密钥**
   - 将这些信息保存好，稍后需要配置到环境变量中

### 4. 获取凭据信息

- **GOOGLE_CLIENT_ID**：客户端 ID（例如：`123456789-abcdefghijklmnop.apps.googleusercontent.com`）
- **GOOGLE_CLIENT_SECRET**：客户端密钥（例如：`GOCSPX-abcdefghijklmnopqrstuvwxyz`）

---

## GitHub OAuth 配置

### 1. 创建 GitHub OAuth App

1. 登录 [GitHub](https://github.com/)
2. 点击右上角头像，进入 **"Settings"（设置）**
3. 在左侧菜单中，点击 **"Developer settings"（开发者设置）**
4. 点击 **"OAuth Apps"**，然后点击 **"New OAuth App"（新建 OAuth 应用）**

### 2. 填写应用信息

- **Application name**（应用名称）：输入应用名称（例如：`BotSkill`）
- **Homepage URL**（主页 URL）：
  - 开发环境：`http://localhost:5173`
  - 生产环境：`https://yourdomain.com`
- **Authorization callback URL**（授权回调 URL）：
  - 开发环境：`http://localhost:3001/api/auth/github/callback`
  - 生产环境：`https://yourdomain.com/api/auth/github/callback`
- 点击 **"Register application"（注册应用）**

### 3. 获取凭据信息

1. 创建应用后，GitHub 会显示应用信息
2. 点击 **"Generate a new client secret"（生成新的客户端密钥）**
3. 复制以下信息：
   - **Client ID**：客户端 ID（例如：`Iv1.8a61f9b3a7aba766`）
   - **Client secret**：客户端密钥（例如：`a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`）

> **注意**：客户端密钥只显示一次，请务必保存好。如果丢失，需要重新生成。

---

## 环境变量配置

### 后端环境变量

在 `backend/.env` 文件中添加以下配置：

```env
# OAuth 配置
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback

GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_CALLBACK_URL=http://localhost:3001/api/auth/github/callback

# 前端和后端 URL（用于 OAuth 回调）
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3001
```

### 生产环境配置

生产环境需要修改以下 URL：

```env
# 生产环境配置示例
GOOGLE_CALLBACK_URL=https://yourdomain.com/api/auth/google/callback
GITHUB_CALLBACK_URL=https://yourdomain.com/api/auth/github/callback
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://yourdomain.com
```

### 完整的环境变量示例

```env
# 基础配置
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb://localhost:27017/botskill
JWT_SECRET=your-super-secret-jwt-key-here

# OAuth 配置
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz
GOOGLE_CALLBACK_URL=https://yourdomain.com/api/auth/google/callback

GITHUB_CLIENT_ID=Iv1.8a61f9b3a7aba766
GITHUB_CLIENT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
GITHUB_CALLBACK_URL=https://yourdomain.com/api/auth/github/callback

# URL 配置
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://yourdomain.com
```

---

## 回调 URL 配置

### 重要提示

回调 URL 必须在 OAuth 提供商（Google/GitHub）和应用配置中**完全匹配**，包括：
- 协议（http/https）
- 域名
- 端口号（如果有）
- 路径

### 开发环境

- **Google 回调 URL**：`http://localhost:3001/api/auth/google/callback`
- **GitHub 回调 URL**：`http://localhost:3001/api/auth/github/callback`

### 生产环境

- **Google 回调 URL**：`https://yourdomain.com/api/auth/google/callback`
- **GitHub 回调 URL**：`https://yourdomain.com/api/auth/github/callback`

### 使用反向代理（Nginx）

如果使用 Nginx 作为反向代理，确保配置正确：

```nginx
location /api {
    proxy_pass http://127.0.0.1:3001;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

在这种情况下：
- **BACKEND_URL** 应该设置为：`https://yourdomain.com`
- **回调 URL** 应该设置为：`https://yourdomain.com/api/auth/google/callback`

---

## 测试 OAuth 登录

### 1. 启动应用

```bash
# 确保环境变量已配置
cd backend
# 检查 .env 文件是否存在且包含 OAuth 配置

# 启动后端
npm run dev:server

# 在另一个终端启动前端
cd client
npm run dev
```

### 2. 测试 Google 登录

1. 访问登录页面：`http://localhost:5173/login`
2. 点击 **"使用 Google 登录"** 按钮
3. 应该会跳转到 Google 授权页面
4. 授权后，应该会重定向回登录页面并自动登录

### 3. 测试 GitHub 登录

1. 访问登录页面：`http://localhost:5173/login`
2. 点击 **"使用 GitHub 登录"** 按钮
3. 应该会跳转到 GitHub 授权页面
4. 授权后，应该会重定向回登录页面并自动登录

### 4. 检查日志

如果遇到问题，检查后端控制台日志，查看是否有错误信息。

---

## 常见问题

### 1. "redirect_uri_mismatch" 错误

**问题**：回调 URL 不匹配

**解决方案**：
- 检查 Google/GitHub 中配置的回调 URL 是否与代码中的完全一致
- 确保协议（http/https）、域名、端口和路径都匹配
- 检查环境变量 `GOOGLE_CALLBACK_URL` 和 `GITHUB_CALLBACK_URL` 是否正确

### 2. "invalid_client" 错误

**问题**：客户端 ID 或密钥错误

**解决方案**：
- 检查环境变量中的 `GOOGLE_CLIENT_ID`、`GOOGLE_CLIENT_SECRET`、`GITHUB_CLIENT_ID`、`GITHUB_CLIENT_SECRET` 是否正确
- 确保没有多余的空格或换行符
- 重新生成客户端密钥（GitHub）

### 3. OAuth 登录后没有自动登录

**问题**：前端没有正确处理回调

**解决方案**：
- 检查 `FRONTEND_URL` 环境变量是否正确
- 检查前端登录页面是否正确处理 URL 参数（token、refreshToken、userId）
- 查看浏览器控制台是否有错误

### 4. 生产环境 OAuth 不工作

**问题**：生产环境配置不正确

**解决方案**：
- 确保生产环境使用 HTTPS
- 更新 Google/GitHub 中的回调 URL 为生产环境地址
- 检查 `BACKEND_URL` 和 `FRONTEND_URL` 环境变量
- 确保 Nginx 或其他反向代理配置正确

### 5. Google OAuth 显示 "应用未验证"

**问题**：应用处于测试模式

**解决方案**：
- 这是正常的，Google OAuth 应用在发布前会显示此警告
- 可以添加测试用户，或提交应用进行验证
- 对于个人项目，可以继续使用测试模式

### 6. GitHub OAuth 需要邮箱权限但获取不到

**问题**：GitHub 用户邮箱设置为私密

**解决方案**：
- 代码中已经处理了这种情况，会使用备用邮箱格式
- 如果用户邮箱是私密的，系统会生成一个临时邮箱格式：`github_${userId}@oauth.local`
- 用户可以在个人资料中手动更新邮箱

---

## 安全建议

1. **保护客户端密钥**：
   - 永远不要将客户端密钥提交到代码仓库
   - 使用环境变量或密钥管理服务
   - 定期轮换密钥

2. **使用 HTTPS**：
   - 生产环境必须使用 HTTPS
   - OAuth 回调必须通过 HTTPS

3. **限制回调 URL**：
   - 只添加必要的回调 URL
   - 不要使用通配符

4. **定期审查**：
   - 定期检查 OAuth 应用的使用情况
   - 删除不再使用的应用

---

## 参考链接

- [Google OAuth 2.0 文档](https://developers.google.com/identity/protocols/oauth2)
- [GitHub OAuth 文档](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps)
- [Passport.js Google 策略](http://www.passportjs.org/packages/passport-google-oauth20/)
- [Passport.js GitHub 策略](http://www.passportjs.org/packages/passport-github2/)

---

## 需要帮助？

如果遇到问题，请：
1. 检查本文档的常见问题部分
2. 查看后端控制台日志
3. 检查浏览器控制台错误
4. 确认所有环境变量都已正确配置
