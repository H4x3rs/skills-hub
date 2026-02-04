# SkillsHub 统一认证方案：Web + CLI（Refresh Token）

## 一、架构概览

```
┌─────────────────┐  Access + Refresh   ┌──────────────────┐
│   Web 前端       │ ◄────────────────► │                  │
│  (localStorage)  │   Token 双令牌      │   SkillsHub API  │
└─────────────────┘                    │  /api/auth/login  │
       │ 401 → 自动 refresh             │  /api/auth/refresh│
       └───────────────────────────────►│  /api/skills      │
                                        └──────────────────┘
┌─────────────────┐  Access + Refresh
│   skm-cli       │ ◄────────────────►
│  (configstore)  │
└─────────────────┘
```

**核心思路**：采用 **Refresh Token** 双令牌机制：
- **Access Token**：短期（默认 15 分钟），用于 API 请求
- **Refresh Token**：长期（默认 7 天），仅用于换取新 Access Token
- Access Token 过期时自动用 Refresh Token 刷新，用户无感知

---

## 二、认证流程

### 2.1 Web 端（已实现）

- 登录：`POST /api/auth/login` → 返回 `{ accessToken, refreshToken, user }`
- 存储：`localStorage` 存 `token`（accessToken）和 `refreshToken`
- 请求：`Authorization: Bearer <accessToken>`
- **401 处理**：自动调用 `POST /api/auth/refresh` 用 refreshToken 换新 accessToken，重试原请求；若刷新失败则跳转登录页

### 2.2 CLI 端（待实现）

- 登录：`skm login` → 调用 `POST /api/auth/login` → 返回 accessToken + refreshToken
- 存储：`configstore` 持久化（跨会话保持）
- 请求：带 `Authorization: Bearer <accessToken>`
- **401 处理**：尝试 `POST /api/auth/refresh`，成功则重试；失败则提示 `skm login`

---

## 三、实现方案

### 3.1 后端（已实现 Refresh Token）

| 接口 | 说明 |
|------|------|
| `POST /api/auth/login` | 登录，返回 accessToken + refreshToken |
| `POST /api/auth/register` | 注册，返回 accessToken + refreshToken |
| `POST /api/auth/refresh` | 用 refreshToken 换取新 accessToken（支持 token 轮转） |
| `POST /api/auth/logout` | 登出，可传 refreshToken 服务端作废 |
| `GET /api/auth/me` | 获取当前用户（需 accessToken） |
| `POST /api/skills` | 发布技能（需 accessToken，role 为 admin/publisher） |

**环境变量**（backend/.env）：
- `ACCESS_TOKEN_EXPIRES`：Access Token 有效期，默认 `15m`
- `REFRESH_TOKEN_EXPIRES_DAYS`：Refresh Token 有效天数，默认 `7`

### 3.2 skm-cli 配置存储

使用 `configstore`（已安装）存储：

```javascript
// 存储结构
{
  "apiUrl": "http://localhost:3001/api",
  "token": "eyJhbGciOiJIUzI1NiIs...",        // accessToken
  "refreshToken": "a1b2c3d4e5f6...",         // refreshToken
  "user": { "id": "...", "username": "..." }
}
```

存储路径（configstore 默认）：
- macOS: `~/Library/Preferences/skillshub-cli/config.json`
- Linux: `~/.config/skillshub-cli/config.json`
- Windows: `%APPDATA%\skillshub-cli\config.json`

### 3.3 skm login 实现

**交互式登录**（推荐）：
```
$ skm login
? Email or Username: user@example.com
? Password: ****
✓ Logged in as user@example.com
```

**非交互式**（脚本/CI）：
```
$ skm login -e user@example.com -p password
$ skm login --token <jwt_token>   # 直接使用 token
```

### 3.4 skm push 实现

1. 从 configstore 读取 token
2. 若无 token → 提示 `skm login` 先登录
3. 读取 `skill.config.json` 或命令行参数
4. `POST /api/skills`，Header: `Authorization: Bearer <token>`

### 3.5 Token 刷新策略（已实现）

- **Access Token**：15 分钟过期
- **Refresh Token**：7 天过期，每次使用后轮转（旧 token 作废）
- **Web**：401 时自动调用 `/auth/refresh`，成功后重试原请求
- **CLI**：401 时同样尝试 refresh，失败则提示 `skm login`

---

## 四、文件改动清单

### 4.1 新增/修改 skm-cli

| 文件 | 操作 |
|------|------|
| `src/lib/auth.js` | 新增：封装 login API、configstore 读写 |
| `src/commands/login.js` | 重写：调用 API、保存 token |
| `src/commands/push.js` | 重写：读取 token、调用 POST /api/skills |
| `src/commands/config.js` | 完善：支持 apiUrl、token 的 get/set |
| `src/commands/logout.js` | 新增：清除本地 token |

### 4.2 可选：Web 端导出 Token 给 CLI

在个人中心增加「复制 Token」或「导出 CLI 配置」，用户可手动执行：
```bash
skm login --token <粘贴的token>
```

---

## 五、技能发布数据结构

`skill.config.json` 示例（与 Skill 模型对应）：

```json
{
  "name": "my-skill",
  "description": "技能描述",
  "version": "1.0.0",
  "category": "ai",
  "tags": ["ai", "nlp"],
  "license": "MIT",
  "repositoryUrl": "https://github.com/...",
  "documentationUrl": "https://...",
  "demoUrl": "https://..."
}
```

`category` 枚举：`ai` | `data` | `web` | `devops` | `security` | `tools`

---

## 六、安全建议

1. **Token 存储**：configstore 文件权限建议 600
2. **密码输入**：使用 `inquirer` 的 `type: 'password'` 隐藏输入
3. **HTTPS**：生产环境 API 必须使用 HTTPS
4. **Token 传递**：避免在 shell 历史中留下 `--token xxx`，优先用交互式登录

---

## 七、使用流程示例

```bash
# 1. 配置 API 地址（可选，默认 localhost:3001）
skm config --set apiUrl=http://localhost:3001/api

# 2. 登录（持久化，重启终端仍有效）
skm login
# 或
skm login -e user@example.com -p mypassword

# 3. 查看登录状态
skm config --list

# 4. 在技能目录下发布
cd my-skill/
skm push

# 5. 登出
skm logout
```

---

## 八、实现优先级

1. **P0**：`src/lib/auth.js`（configstore + API 封装）
2. **P0**：`login.js` 完整实现
3. **P0**：`push.js` 集成认证并调用 API
4. **P1**：`logout.js`
5. **P1**：`config.js` 完善 apiUrl
6. **P2**：Web 端「复制 Token」功能
