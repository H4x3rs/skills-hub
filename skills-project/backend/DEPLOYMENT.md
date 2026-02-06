# Backend 服务器部署指南

## 一、服务器要求

- **系统**: Linux (Ubuntu 20.04+ / CentOS 7+ 等)
- **Node.js**: 18.x 或更高版本（已测试 Node 24.x）
- **MongoDB**: 4.4+ (本地安装或使用 MongoDB Atlas 云服务)
- **内存**: 建议 1GB 以上

## 二、部署步骤

### 1. Node.js

若已安装 Node 24.x，直接验证即可：

```bash
node -v   # v24.11.1
npm -v
```

**未安装时：**

```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# CentOS 7/8/9
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs
# 或 CentOS 8+: sudo dnf install -y nodejs
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

**本地安装 (CentOS 7/8/9):**
```bash
# 创建 repo 文件
cat << 'EOF' | sudo tee /etc/yum.repos.d/mongodb-org-7.0.repo
[mongodb-org-7.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/7.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-7.0.asc
EOF

sudo yum install -y mongodb-org
# 或 CentOS 8+: sudo dnf install -y mongodb-org

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

# 生产环境域名（OAuth 回调等）
FRONTEND_URL=https://botskill.ai
BACKEND_URL=https://botskill.ai

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
# Ubuntu: /etc/nginx/sites-available/skills-api
# CentOS: /etc/nginx/conf.d/skills-api.conf

# HTTP 重定向到 HTTPS（可选，证书就绪后启用）
# server {
#     listen 80;
#     server_name botskill.ai *.botskill.ai;
#     return 301 https://$host$request_uri;
# }

server {
    listen 80;
    listen 443 ssl http2;
    server_name botskill.ai *.botskill.ai;

    # 通配符证书路径（certbot 生成后）
    ssl_certificate     /etc/letsencrypt/live/botskill.ai/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/botskill.ai/privkey.pem;

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
# Ubuntu
sudo ln -s /etc/nginx/sites-available/skills-api /etc/nginx/sites-enabled/

# CentOS（直接创建 conf.d 下的文件即可，无需 ln）
# 文件已放在 /etc/nginx/conf.d/skills-api.conf

sudo nginx -t
sudo systemctl reload nginx
```

### 7. 配置 HTTPS（推荐使用 Let's Encrypt）

**通配符证书**（覆盖 `botskill.ai` 及所有 `*.botskill.ai`）需使用 DNS 验证。域名在 **AWS Route 53** 时推荐使用 Route 53 插件自动验证与续期：

```bash
# 安装 certbot 及 Route 53 插件
# Ubuntu: sudo apt install certbot python3-certbot-dns-route53
# CentOS: sudo yum install -y certbot python3-certbot-dns-route53
# 若系统包不可用: pip install certbot-dns-route53

# 配置 AWS 凭证（certbot 以 root 运行，故用 /root/.aws/credentials）
# 方式 A：环境变量（推荐，避免 credentials 文件解析错误）
export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_key
sudo -E certbot certonly --dns-route53 -d botskill.ai -d "*.botskill.ai"

# 方式 B：凭证文件（格式须严格正确，见下方「常见问题」）
# sudo certbot certonly --dns-route53 -d botskill.ai -d "*.botskill.ai"
```

> **IAM 权限**：用于 certbot 的 IAM 用户/角色需具备 `route53:ListHostedZones`、`route53:GetChange`、`route53:ChangeResourceRecordSets`（作用于 botskill.ai 的 Hosted Zone）。

**手动 DNS 验证**（通用，需在 Route 53 控制台手动添加 TXT 记录）：

```bash
sudo certbot certonly --manual --preferred-challenges dns \
  -d botskill.ai -d "*.botskill.ai"
# 按提示在 Route 53 中为 _acme-challenge.botskill.ai 添加 TXT 记录，验证后回车
```

**仅主域名**（不含通配符）可用 HTTP 验证：`certbot --nginx -d botskill.ai`

证书生成后，Nginx 中 `ssl_certificate` 指向 `/etc/letsencrypt/live/botskill.ai/fullchain.pem`，`ssl_certificate_key` 指向 `privkey.pem`（见上方 Nginx 示例）。通配符证书需每 90 天续期；使用 Route 53 插件时，crontab `0 0 1 * * certbot renew --quiet` 可自动续期。

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
# Ubuntu (ufw)
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 22
sudo ufw enable

# CentOS (firewalld)
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --reload

# 若直接暴露 Node 3001 端口
# CentOS: sudo firewall-cmd --permanent --add-port=3001/tcp && sudo firewall-cmd --reload
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
| **ConfigParseError: Unable to parse config file: /root/.aws/credentials** | 凭证文件格式错误。推荐改用环境变量：`export AWS_ACCESS_KEY_ID=xxx AWS_SECRET_ACCESS_KEY=xxx` 后执行 `sudo -E certbot ...`。若用文件，`/root/.aws/credentials` 须为：`[default]` 换行 `aws_access_key_id=xxx` 换行 `aws_secret_access_key=xxx`，无多余空格、BOM 或特殊字符，权限 `chmod 600`。 |
| **npm E404**（如 npm-run-path 等包找不到） | 项目含 `.npmrc` 指定官方源；若仍失败，执行 `npm config set registry https://registry.npmjs.org/` 或改用 `https://registry.npmmirror.com` |
| 端口被占用 | 修改 `.env` 中 `PORT`，或 `pm2 delete` 后重启 |
| MongoDB 连接失败 | 检查 `MONGODB_URI`、防火墙、MongoDB 服务状态 |
| 502 Bad Gateway | 确认 PM2 中 backend 进程在运行，端口与 Nginx 一致 |
| 内存不足 | 使用 `pm2 start server.js --max-memory-restart 300M` |
| **Python 3.9 support will be dropped** | 仅为提示，不影响当前运行；可升级系统 Python 或使用 `pip install certbot certbot-dns-route53` 安装新版。 |
