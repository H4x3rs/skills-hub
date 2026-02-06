# CentOS 9 邮件服务器配置方案 (Postfix + Dovecot)

## 环境信息

- **主域名**: botskill.ai
- **邮件域名**: mail.botskill.ai
- **MX 记录**: 已解析到 mail.botskill.ai
- **系统用户**: 与邮箱 `xxx@botskill.ai` 对应，xxx 为 Linux 系统用户名

---

## 一、前置准备

### 1.1 DNS 记录检查

确保以下记录已正确配置：

| 类型 | 名称 | 值 | TTL |
|------|------|-----|-----|
| A | mail | 服务器IP | 300 |
| MX | @ (或 botskill.ai) | mail.botskill.ai | 300 |
| SPF | @ | v=spf1 mx ~all | 300 |
| DKIM | 按需配置 | - | - |

### 1.2 防火墙端口

```bash
# 开放必要端口
firewall-cmd --permanent --add-service=smtp      # 25
firewall-cmd --permanent --add-service=smtps     # 465
firewall-cmd --permanent --add-service=submission # 587
firewall-cmd --permanent --add-service=imap      # 143
firewall-cmd --permanent --add-service=imaps     # 993
firewall-cmd --permanent --add-service=pop3      # 110
firewall-cmd --permanent --add-service=pop3s    # 995
firewall-cmd --reload
```

### 1.3 创建系统用户（邮箱账户）

```bash
# 创建用户，同时创建家目录和邮件目录
useradd -m -s /sbin/nologin admin
echo "your_password" | passwd --stdin admin

# 如需更多邮箱账户，重复上述命令
useradd -m -s /sbin/nologin support
echo "support_password" | passwd --stdin support
```

---

## 二、安装 Postfix

### 2.1 安装

```bash
dnf install -y postfix
```

### 2.2 主配置文件 `/etc/postfix/main.cf`

```ini
# 基本设置
myhostname = mail.botskill.ai
mydomain = botskill.ai
myorigin = $mydomain

# 网络
inet_interfaces = all
inet_protocols = ipv4

# 邮件存储 - 使用 Maildir 格式（与 Dovecot 配合）
home_mailbox = Maildir/

# 收件域名 - 接收发往 @botskill.ai 的邮件
mydestination = $myhostname, localhost.$mydomain, localhost, $mydomain

# 信任本地网络（按需调整）
mynetworks = 127.0.0.0/8 [::ffff:127.0.0.0]/104 [::1]/128

# 中继限制
relay_domains =
relayhost =

# 严格模式 - 仅接受发往 mydestination 的邮件
smtpd_recipient_restrictions =
    permit_mynetworks,
    permit_sasl_authenticated,
    reject_unauth_destination,
    reject_non_fqdn_sender,
    reject_non_fqdn_recipient,
    reject_unknown_sender_domain,
    reject_unknown_recipient_domain,
    permit

# SASL 认证（发信用）
smtpd_sasl_type = dovecot
smtpd_sasl_path = private/auth
smtpd_sasl_auth_enable = yes
smtpd_sasl_security_options = noanonymous
smtpd_sasl_local_domain = $myhostname

# TLS 配置
smtpd_tls_cert_file = /etc/pki/tls/certs/mail.botskill.ai.crt
smtpd_tls_key_file = /etc/pki/tls/private/mail.botskill.ai.key
smtpd_tls_security_level = may
smtpd_tls_auth_only = yes

smtp_tls_security_level = may
smtp_tls_CAfile = /etc/pki/tls/certs/ca-bundle.crt

# 发往 QQ/163 等外部邮箱需使用 587(submission) 或 465(smtps) 端口
# 相关服务定义在 master.cf 中
```

### 2.3 编辑 `/etc/postfix/master.cf`

确保以下行未被注释，并添加 submission 服务：

```ini
# 在文件末尾或相应位置添加/确认：
submission inet n       -       n       -       -       smtpd
  -o syslog_name=postfix/submission
  -o smtpd_tls_security_level=encrypt
  -o smtpd_sasl_auth_enable=yes
  -o smtpd_client_restrictions=permit_sasl_authenticated,reject
  -o smtpd_recipient_restrictions=permit_sasl_authenticated,permit_mynetworks,reject_unauth_destination
  -o smtpd_tls_cert_file=/etc/pki/tls/certs/mail.botskill.ai.crt
  -o smtpd_tls_key_file=/etc/pki/tls/private/mail.botskill.ai.key

smtps     inet n       -       n       -       -       smtpd
  -o syslog_name=postfix/smtps
  -o smtpd_tls_wrappermode=yes
  -o smtpd_sasl_auth_enable=yes
  -o smtpd_client_restrictions=permit_sasl_authenticated,reject
  -o smtpd_recipient_restrictions=permit_sasl_authenticated,permit_mynetworks,reject_unauth_destination
```

### 2.4 生成/配置 SSL 证书

```bash
# 使用 Let's Encrypt（推荐）
dnf install -y certbot
certbot certonly --standalone -d mail.botskill.ai

# 证书路径
# /etc/letsencrypt/live/mail.botskill.ai/fullchain.pem
# /etc/letsencrypt/live/mail.botskill.ai/privkey.pem

# 创建软链接或复制到 Postfix 期望路径
mkdir -p /etc/pki/tls/certs /etc/pki/tls/private
ln -sf /etc/letsencrypt/live/mail.botskill.ai/fullchain.pem /etc/pki/tls/certs/mail.botskill.ai.crt
ln -sf /etc/letsencrypt/live/mail.botskill.ai/privkey.pem /etc/pki/tls/private/mail.botskill.ai.key
```

---

## 三、安装 Dovecot

### 3.1 安装

```bash
dnf install -y dovecot
```

### 3.2 主配置 `/etc/dovecot/dovecot.conf`

```conf
# 启用协议
protocols = imap pop3 lmtp

# 监听地址
listen = *
```

### 3.3 认证配置 `/etc/dovecot/conf.d/10-auth.conf`

```conf
# 禁用明文认证（生产环境）
disable_plaintext_auth = yes

# 认证机制
auth_mechanisms = plain login

# 使用系统用户
!include auth-system.conf.ext
```

### 3.4 邮件存储 `/etc/dovecot/conf.d/10-mail.conf`

```conf
# Maildir 格式
mail_location = maildir:~/Maildir

# 邮件目录权限
mail_privileged_group = mail
```

### 3.5 IMAP 配置 `/etc/dovecot/conf.d/10-master.conf`

在 `service auth` 块中取消注释并配置 Postfix 的 auth socket：

```conf
service auth {
  unix_listener /var/spool/postfix/private/auth {
    mode = 0660
    user = postfix
    group = postfix
  }
}
```

### 3.6 SSL 配置 `/etc/dovecot/conf.d/10-ssl.conf`

```conf
ssl = required
ssl_cert = </etc/pki/tls/certs/mail.botskill.ai.crt
ssl_key = </etc/pki/tls/private/mail.botskill.ai.key
```

### 3.7 创建 Postfix auth socket 目录

```bash
mkdir -p /var/spool/postfix/private
chmod 750 /var/spool/postfix/private
chown postfix:postfix /var/spool/postfix/private
```

---

## 四、发往 QQ/163 的配置要点

### 4.1 使用 587 端口（Submission）

- 客户端发信必须使用 **587 (Submission)** 或 **465 (SMTPS)**，并启用 TLS
- 端口 25 通常被运营商限制，发往 QQ/163 建议用 587

### 4.2 SPF 记录

在 DNS 添加 TXT 记录：

```
botskill.ai.  IN  TXT  "v=spf1 mx ~all"
```

### 4.3 反向 DNS (PTR)

确保服务器 IP 的反向解析指向 `mail.botskill.ai`，否则 QQ/163 可能拒收。

### 4.4 避免进入垃圾箱

- 配置 **DKIM** 签名
- 配置 **DMARC** 策略
- 避免群发、避免敏感词

---

## 五、客户端配置示例

### 5.1 发信 (SMTP)

| 项目 | 值 |
|------|-----|
| 服务器 | mail.botskill.ai |
| 端口 | 587 (TLS) 或 465 (SSL) |
| 加密 | STARTTLS / SSL |
| 认证 | 是 |
| 用户名 | admin（系统用户） |
| 密码 | 对应用户密码 |

### 5.2 收信 (IMAP)

| 项目 | 值 |
|------|-----|
| 服务器 | mail.botskill.ai |
| 端口 | 993 (SSL) |
| 加密 | SSL/TLS |
| 用户名 | admin |
| 密码 | 对应用户密码 |

### 5.3 收信 (POP3)

| 项目 | 值 |
|------|-----|
| 服务器 | mail.botskill.ai |
| 端口 | 995 (SSL) |
| 加密 | SSL/TLS |
| 用户名 | admin |
| 密码 | 对应用户密码 |

---

## 六、启动与验证

### 6.1 启动服务

```bash
systemctl enable postfix dovecot
systemctl start postfix dovecot
systemctl status postfix dovecot
```

### 6.2 测试发信

```bash
# 使用 swaks 测试（需安装：dnf install -y swaks）
swaks --to test@qq.com \
  --from admin@botskill.ai \
  --server mail.botskill.ai:587 \
  --auth-user admin \
  --auth-password 'your_password' \
  --tls


# 连接 587 端口（Submission）
openssl s_client -connect mail.botskill.ai:587 -starttls smtp -quiet

EHLO localhost
AUTH LOGIN
<输入 base64 编码的用户名，或直接输入>
admin
<输入密码>
your_password
MAIL FROM:<admin@botskill.ai>
RCPT TO:<test@qq.com>
DATA
Subject: Test
From: admin@botskill.ai

This is a test.
.
QUIT
```

### 6.3 测试收信

```bash
# 使用 openssl 测试 IMAP
openssl s_client -connect mail.botskill.ai:993 -quiet
# 输入: a1 LOGIN admin your_password
# 输入: a2 LIST "" "*"
# 输入: a3 LOGOUT
```

---

## 七、常见问题

### 7.1 发往 QQ/163 被拒收

- 检查 SPF、PTR、DKIM
- 查看 Postfix 日志：`journalctl -u postfix -f`
- 查看对方退信原因

### 7.2 收不到外部邮件

- 确认 MX 记录指向正确
- 确认 `mydestination` 包含 `botskill.ai`
- 确认防火墙 25 端口开放

### 7.3 SASL 认证失败

- 确认 `/var/spool/postfix/private/auth` 存在且权限正确
- 确认 Dovecot 已启动
- 检查 `smtpd_sasl_path = private/auth`（相对 Postfix 队列目录）

---

## 八、安全建议

1. 定期更新证书（Let's Encrypt 90 天）
2. 限制 SSH 登录，使用密钥认证
3. 配置 fail2ban 防止暴力破解
4. 定期检查日志和异常连接

---

## 九、配置清单速查

| 组件 | 配置文件 | 说明 |
|------|----------|------|
| Postfix | /etc/postfix/main.cf | 主配置 |
| Postfix | /etc/postfix/master.cf | 服务定义 |
| Dovecot | /etc/dovecot/dovecot.conf | 主配置 |
| Dovecot | /etc/dovecot/conf.d/10-auth.conf | 认证 |
| Dovecot | /etc/dovecot/conf.d/10-mail.conf | 邮件存储 |
| Dovecot | /etc/dovecot/conf.d/10-master.conf | Auth socket |
| Dovecot | /etc/dovecot/conf.d/10-ssl.conf | SSL |
