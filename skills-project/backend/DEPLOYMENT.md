# Backend 服务器部署指南

## 一、服务器要求

- **系统**: Linux (Ubuntu 20.04+ / CentOS 7+ 等)
- **Node.js**: 18.x 或更高版本
- **MongoDB**: 4.4+ (本地安装或使用 MongoDB Atlas 云服务)
- **内存**: 建议 1GB 以上

## 二、部署步骤

### 1. 安装 Node.js

```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证
node -v   # v20.x.x
npm -v
```

### 2. 安装 MongoDB（可选，也可使用 Atlas）

**本地安装 (Ubuntu):**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

**或使用 MongoDB Atlas**: 在 [atlas.mongodb.com](https://www.mongodb.com/atlas) 创建免费集群，获取连接字符串。

### 3. 上传代码并安装依赖

```bash
# 进入项目目录（假设代码已上传到 /var/www/skills-project）
cd /var/www/skills-project/backend

# 安装生产依赖（不装 devDependencies）
npm install --production
```

> **npm 404 错误**：若服务器使用腾讯云等国内镜像且出现 `E404 Not Found`（如 npm-run-path），项目根目录的 `.npmrc` 会强制使用官方源。若官方源较慢，可改为 `registry=https://registry.npmmirror.com`。

### 4. 配置环境变量

创建 `backend/.env` 文件：

```env
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb://localhost:27017/botskill
# 或 Atlas: mongodb+srv://user:pass@cluster.mongodb.net/botskill

# JWT 配置（务必使用强随机字符串）
JWT_SECRET=your-very-long-random-secret-key-at-least-32-chars
JWT_EXPIRES_IN=7d

# Refresh Token 过期时间（可选）
REFRESH_TOKEN_EXPIRES_IN=30d
```

> ⚠️ **安全提示**: `JWT_SECRET` 务必使用强随机字符串，可用 `openssl rand -base64 32` 生成。

### 5. 使用 PM2 进程管理（推荐）

PM2 可保持应用常驻、自动重启、日志管理。

```bash
# 安装 PM2
sudo npm install -g pm2

# 启动后端
cd /var/www/skills-project/backend
pm2 start server.js --name skills-backend

# 开机自启
pm2 startup
pm2 save

# 常用命令
pm2 status          # 查看状态
pm2 logs            # 查看日志
pm2 restart skills-backend   # 重启
```

### 6. 使用 Nginx 反向代理（可选）

若需通过域名访问或配置 HTTPS：

```nginx
# /etc/nginx/sites-available/skills-api
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/skills-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 7. 配置 HTTPS（推荐使用 Let's Encrypt）

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

### 8. 初始化数据

首次部署后执行：

```bash
cd /var/www/skills-project/backend

# 创建管理员（若尚未有 admin 用户）
npm run create-admin

# 初始化权限和角色
npm run seed-permissions
```

## 三、防火墙

```bash
# 若使用 Nginx，只开放 80/443
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 22   # SSH
sudo ufw enable

# 若直接暴露 Node，开放 3001
# sudo ufw allow 3001
```

## 四、更新部署

```bash
cd /var/www/skills-project
git pull

cd backend
npm install --production
pm2 restart skills-backend
```

## 五、健康检查

```bash
curl http://localhost:3001/api/health
# 应返回 {"status":"OK","timestamp":"..."}
```

## 六、常见问题

| 问题 | 处理 |
|------|------|
| **npm E404**（如 npm-run-path 等包找不到） | 项目含 `.npmrc` 指定官方源；若仍失败，执行 `npm config set registry https://registry.npmjs.org/` 或改用 `https://registry.npmmirror.com` |
| 端口被占用 | 修改 `.env` 中 `PORT`，或 `pm2 delete` 后重启 |
| MongoDB 连接失败 | 检查 `MONGODB_URI`、防火墙、MongoDB 服务状态 |
| 502 Bad Gateway | 确认 PM2 中 backend 进程在运行，端口与 Nginx 一致 |
| 内存不足 | 使用 `pm2 start server.js --max-memory-restart 300M` |
