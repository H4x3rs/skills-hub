# SkillsHub 管理员和权限管理API文档

本文档介绍了为SkillsHub平台实现的管理员和权限管理功能。

## 1. 技能管理API (管理员专用)

### 获取所有技能（管理员视角）
- **GET** `/api/skills/admin/all`
- 需要管理员权限
- 参数: `page`, `limit`, `status`, `author`, `category`
- 返回: 包含分页信息的技能列表

### 管理员创建技能
- **POST** `/api/skills/admin/create`
- 需要管理员权限
- 请求体: `name`, `description`, `version`, `category`, `tags`, `repositoryUrl`, `documentationUrl`, `demoUrl`, `license`, `status`, `authorId`
- 注意: 管理员可直接发布技能，无需审核

### 管理员更新技能
- **PUT** `/api/skills/admin/:id`
- 需要管理员权限
- 可更新所有字段，包括作者和状态

### 管理员删除技能
- **DELETE** `/api/skills/admin/:id`
- 需要管理员权限
- 管理员可删除任何技能

## 2. 角色管理API

### 获取所有角色
- **GET** `/api/admin/roles`
- 需要管理员权限
- 参数: `page`, `limit`, `isActive`

### 根据名称获取角色
- **GET** `/api/admin/roles/:roleName`
- 需要管理员权限

### 创建角色
- **POST** `/api/admin/roles`
- 需要管理员权限
- 请求体: `name`, `description`, `permissionIds`

### 更新角色
- **PUT** `/api/admin/roles/:roleName`
- 需要管理员权限
- 请求体: `description`, `permissionIds`, `isActive`

### 删除角色
- **DELETE** `/api/admin/roles/:roleName`
- 需要管理员权限

### 更新角色权限
- **PUT** `/api/admin/roles/:roleName/permissions`
- 需要管理员权限
- 请求体: `permissionIds`

## 3. 权限管理API

### 获取所有权限
- **GET** `/api/admin/permissions`
- 需要管理员权限
- 参数: `page`, `limit`, `resource`, `action`

### 创建权限
- **POST** `/api/admin/permissions`
- 需要管理员权限
- 请求体: `name`, `description`, `resource`, `action`

### 更新权限
- **PUT** `/api/admin/permissions/:id`
- 需要管理员权限
- 请求体: `description`, `resource`, `action`

### 删除权限
- **DELETE** `/api/admin/permissions/:id`
- 需要管理员权限

## 4. 用户管理API

### 获取用户列表（带角色）
- **GET** `/api/admin/users-with-roles`
- 需要管理员权限
- 参数: `page`, `limit`, `role`

### 分配角色给用户
- **POST** `/api/admin/assign-role`
- 需要管理员权限
- 请求体: `userId`, `role`

## 5. 权限模型

### 权限类型
- `create_skill`: 创建技能
- `read_skill`: 读取技能
- `update_skill`: 更新技能
- `delete_skill`: 删除技能
- `manage_users`: 管理用户
- `manage_permissions`: 管理权限

### 预定义角色
- `user`: 普通用户，可以浏览和下载技能
- `publisher`: 发布者，可以发布技能
- `admin`: 管理员，拥有所有权限
- `moderator`: 版主，可以审核技能

## 6. 安全考虑

- 所有管理员功能都需要有效的JWT令牌和管理员权限
- 用户无法更改自己的角色
- 删除权限时会自动从相关角色中移除该权限
- 删除角色时会将拥有该角色的用户降级为普通用户

## 7. 数据模型

### 角色模型
```javascript
{
  name: String (唯一),
  description: String,
  permissions: [ObjectId references to Permission],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### 权限模型
```javascript
{
  name: String (唯一),
  description: String,
  resource: String,
  action: String (枚举: create, read, update, delete, manage),
  createdAt: Date,
  updatedAt: Date
}
```

以上API增强了SkillsHub平台的管理功能，使管理员能够更有效地管理系统中的技能、用户和权限。