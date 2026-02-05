# Nginx 单域名部署指南

本指南说明如何将 BotSkill 项目的前后端部署在同一台服务器的同一个域名下。

## 部署架构

```
用户请求
   ↓
Nginx (80/443)
   ↓
后端 Node.js (3000) → 提供 API + 静态文件
```

## 前置要求

1. **服务器环境**
   - Linux 服务器（Ubuntu 20.04+ / CentOS 7+）
   - 已安装 Node.js 18+
   - 已安装 MongoDB
   - 已安装 Nginx

2. **域名配置**
   - 已购买域名
   - DNS 已解析到服务器 IP

## 部署步骤

### 1. 构建前端

在本地或服务器上构建前端，确保 API 使用相对路径：

```bash
cd skills-project/client

# 设置环境变量，使用相对路径 /api
export VITE_API_URL=/api

# 构建前端
npm run build
```

构建产物将生成在 `client/dist` 目录。

### 2. 部署后端

#### 2.1 上传代码到服务器

```bash
# 假设上传到 /var/www/skills-project
scp -r skills-project user@your-server:/var/www/
```

#### 2.2 安装后端依赖

```bash
cd /var/www/skills-project/backend
npm install --production
```

#### 2.3 配置环境变量

创建 `backend/.env` 文件：

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://localhost:27017/botskill
JWT_SECRET=your-very-long-random-secret-key-at-least-32-chars
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_EXPIRES_IN=30d
```

#### 2.4 复制前端构建产物到后端 public 目录

```bash
# 如果使用方案1（推荐）：后端提供静态文件
cp -r /var/www/skills-project/client/dist/* /var/www/skills-project/backend/public/

# 如果使用方案2（性能优化）：确保 public 目录存在
mkdir -p /var/www/skills-project/backend/public
cp -r /var/www/skills-project/client/dist/* /var/www/skills-project/backend/public/
```

#### 2.5 使用 PM2 启动后端

```bash
# 安装 PM2
sudo npm install -g pm2

# 启动后端
cd /var/www/skills-project/backend
pm2 start server.js --name skills-backend

# 设置开机自启
pm2 startup
pm2 save
```

### 3. 配置 Nginx

#### 3.1 选择配置方案

**方案1：简单方案（推荐）**
- 所有请求都代理到后端
- 后端已配置静态文件服务
- 配置文件：`nginx.conf`

**方案2：性能优化方案**
- 静态文件由 Nginx 直接提供
- API 请求代理到后端
- 配置文件：`nginx-optimized.conf`

#### 3.2 安装配置文件

```bash
# 复制配置文件到 Nginx 配置目录
sudo cp /var/www/skills-project/nginx.conf /etc/nginx/sites-available/skills-hub

# 或者使用优化方案
# sudo cp /var/www/skills-project/nginx-optimized.conf /etc/nginx/sites-available/skills-hub

# 编辑配置文件，替换域名
sudo nano /etc/nginx/sites-available/skills-hub
# 将 yourdomain.com 替换为您的实际域名

# 创建符号链接启用配置
sudo ln -s /etc/nginx/sites-available/skills-hub /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重载 Nginx
sudo systemctl reload nginx
```

### 4. 配置 HTTPS（推荐）

使用 Let's Encrypt 免费 SSL 证书：

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书（自动配置 Nginx）
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# 证书会自动续期，也可以手动测试
sudo certbot renew --dry-run
```

获取证书后，取消注释 nginx 配置文件中的 HTTPS 部分。

### 5. 配置防火墙

```bash
# 允许 HTTP 和 HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp  # SSH
sudo ufw enable
```

### 6. 验证部署

1. **检查后端服务**
   ```bash
   curl http://localhost:3000/api/health
   # 应返回 {"status":"OK","timestamp":"..."}
   ```

2. **检查 Nginx**
   ```bash
   curl http://yourdomain.com/api/health
   # 应返回 {"status":"OK","timestamp":"..."}
   ```

3. **访问前端**
   在浏览器中访问 `http://yourdomain.com`，应该能看到前端页面。

## 配置说明

### 方案1：简单方案（nginx.conf）

- **优点**：配置简单，后端统一处理所有请求
- **适用场景**：中小型项目，流量不大
- **特点**：所有请求（包括静态文件）都通过后端 Node.js 处理

### 方案2：性能优化方案（nginx-optimized.conf）

- **优点**：静态文件由 Nginx 直接提供，性能更好
- **适用场景**：高流量项目，需要更好的性能
- **特点**：
  - 静态资源（JS/CSS/图片等）由 Nginx 直接提供，并设置长期缓存
  - API 请求代理到后端
  - 前端路由由 Nginx 的 `try_files` 处理

## 更新部署

当需要更新代码时：

```bash
cd /var/www/skills-project

# 拉取最新代码
git pull

# 重新构建前端
cd client
export VITE_API_URL=/api
npm run build

# 复制前端文件到后端
cp -r dist/* ../backend/public/

# 更新后端依赖（如有变更）
cd ../backend
npm install --production

# 重启后端
pm2 restart skills-backend

# 重载 Nginx（如有配置变更）
sudo nginx -t && sudo systemctl reload nginx
```

## 常见问题

### 1. 502 Bad Gateway

**原因**：后端服务未运行或端口不匹配

**解决**：
```bash
# 检查 PM2 状态
pm2 status

# 检查后端日志
pm2 logs skills-backend

# 确认端口配置
# backend/.env 中的 PORT 应该与 nginx 配置中的 proxy_pass 端口一致
```

### 2. 前端页面空白或 404

**原因**：前端构建产物未正确复制或路径配置错误

**解决**：
```bash
# 检查 public 目录是否存在且包含 index.html
ls -la /var/www/skills-project/backend/public/

# 检查前端构建时 VITE_API_URL 是否正确设置
# 应该设置为 /api（相对路径）
```

### 3. API 请求失败

**原因**：前端 API 基础 URL 配置错误

**解决**：
- 确保前端构建时设置了 `VITE_API_URL=/api`
- 检查浏览器控制台的网络请求，确认 API 请求路径正确

### 4. 静态资源 404

**原因**：静态资源路径不正确

**解决**：
- 检查 `client/vite.config.ts` 中的 `base` 配置（应该为 `/`）
- 确保所有静态资源都正确复制到 `backend/public` 目录

### 5. OAuth 登录失败

**原因**：OAuth 回调 URL 配置错误

**解决**：
- 在 OAuth 提供商（Google/GitHub）中配置回调 URL 为：
  - `https://yourdomain.com/api/auth/google/callback`
  - `https://yourdomain.com/api/auth/github/callback`

## 性能优化建议

1. **启用 Gzip 压缩**（在 nginx 配置中添加）：
   ```nginx
   gzip on;
   gzip_vary on;
   gzip_min_length 1024;
   gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
   ```

2. **使用 CDN**：将静态资源（如图片）放到 CDN

3. **启用 HTTP/2**：在 HTTPS 配置中已包含 `http2`

4. **数据库优化**：为常用查询字段添加索引

5. **使用 Redis 缓存**：缓存频繁访问的数据

## 安全建议

1. **使用 HTTPS**：强制所有流量使用 HTTPS
2. **设置安全响应头**：后端已使用 Helmet，确保配置正确
3. **限制请求频率**：考虑添加 rate limiting
4. **定期更新依赖**：保持 Node.js 和 npm 包的最新版本
5. **监控日志**：定期检查 Nginx 和 PM2 日志

## 监控和维护

### 查看日志

```bash
# Nginx 访问日志
sudo tail -f /var/log/nginx/skills-hub-access.log

# Nginx 错误日志
sudo tail -f /var/log/nginx/skills-hub-error.log

# PM2 日志
pm2 logs skills-backend
```

### 健康检查脚本

可以创建一个简单的健康检查脚本：

```bash
#!/bin/bash
# health-check.sh
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "Backend is healthy"
else
    echo "Backend is down, restarting..."
    pm2 restart skills-backend
fi
```

添加到 crontab 每 5 分钟检查一次：
```bash
*/5 * * * * /path/to/health-check.sh
```
