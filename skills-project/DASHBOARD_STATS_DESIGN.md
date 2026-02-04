# Dashboard 统计功能设计方案

## 一、现状分析

### 1.1 当前实现
- **前端**：`AdminDashboard` 使用硬编码 `MOCK_STATS`，未调用真实 API
- **后端**：已有 `getDashboardStats`（`GET /api/admin/dashboard`），返回：
  - `totalUsers`、`totalSkills`、`publishedSkills`、`pendingSkills`、`totalDownloads`
  - 缺少：`activeToday`（今日活跃）
- **数据流**：Dashboard 的 users/skills 列表来自 `useAdminUsers` 和 `useAdminSkills`，统计卡片仍为假数据

### 1.2 性能风险点
| 操作 | 说明 | 影响 |
|------|------|------|
| `User.countDocuments()` | 全表计数 | 数据量大时可能慢 |
| `Skill.countDocuments({ status })` | 带条件计数 | 依赖索引 |
| `Skill.aggregate($group)` | 汇总 downloads | 全表扫描 |
| 多次串行查询 | 5 次 DB 调用 | 延迟累加 |

---

## 二、设计目标

1. **隔离性**：统计逻辑独立，不影响用户端 API（技能搜索、登录等）
2. **低延迟**：Dashboard 打开时快速展示
3. **可扩展**：后续可增加趋势图、更多维度
4. **零侵入**：不改变现有业务接口的调用方式与性能

---

## 三、方案对比

### 方案 A：直接查询 + 并行化（推荐，实现简单）
- **做法**：保持现有 `getDashboardStats`，用 `Promise.all` 并行执行所有 count/aggregate
- **优点**：实现快、无额外存储、逻辑清晰
- **缺点**：每次访问都查 DB，数据量极大时仍有压力
- **适用**：用户/技能量级 < 10 万

### 方案 B：内存缓存（推荐，平衡性能与复杂度）
- **做法**：在 `getDashboardStats` 内加内存缓存，TTL 60–120 秒
- **优点**：重复访问几乎无 DB 压力，实现简单
- **缺点**：多实例部署时各实例缓存独立（可接受，统计允许短暂延迟）
- **适用**：单实例或小规模多实例

### 方案 C：预聚合表 + 定时/事件更新
- **做法**：新增 `DashboardStats` 集合，由定时任务或 Change Stream 更新
- **优点**：读性能最好，对主业务表无实时压力
- **缺点**：实现复杂，需维护一致性
- **适用**：百万级数据、高并发管理端

### 方案 D：Redis 缓存
- **做法**：统计结果写入 Redis，TTL 1–5 分钟
- **优点**：多实例共享、可做分布式
- **缺点**：引入 Redis 依赖
- **适用**：已有 Redis 或计划引入

---

## 四、推荐方案：B（内存缓存 + 并行查询）

### 4.1 架构示意

```
┌─────────────────┐     GET /api/admin/dashboard      ┌──────────────────┐
│  AdminDashboard │ ────────────────────────────────► │  adminController  │
│  (前端)         │                                   │  getDashboardStats│
└─────────────────┘                                   └────────┬─────────┘
                                                                │
                                     ┌──────────────────────────┼──────────────────────────┐
                                     │ 内存缓存 (TTL 60s)        │ 缓存未命中                 │
                                     │ 命中 → 直接返回           │ 未命中 → 并行执行以下查询   │
                                     └──────────────────────────┴──────────────────────────┘
                                                                 │
                    ┌────────────────────────────────────────────┼────────────────────────────────────────────┐
                    │                    Promise.all([...])       │                                             │
                    ▼                    ▼                       ▼                                             ▼
             User.countDocuments()  Skill.countDocuments()  Skill.countDocuments()  Skill.aggregate()  User.countDocuments()
             (totalUsers)           (totalSkills)           ({status:'published'})  ($sum downloads)  (createdAt >= today)
                                                                                    (totalDownloads)  (newUsersToday)
```

### 4.2 统计指标定义

| 指标 | 数据源 | 查询方式 |
|------|--------|----------|
| totalUsers | User | `countDocuments()` |
| totalSkills | Skill | `countDocuments()` |
| publishedSkills | Skill | `countDocuments({ status: 'published' })` |
| pendingSkills | Skill | `countDocuments({ status: 'pending_review' })` |
| totalDownloads | Skill | `aggregate([{ $group: { _id: null, total: { $sum: '$downloads' } } }])` |
| newUsersToday | User | `countDocuments({ createdAt: { $gte: startOfToday } })` |

> **说明**：`activeToday` 改为 `newUsersToday`（今日新增用户），因 User 模型暂无 `lastLoginAt`。若后续需要真实“今日活跃”，需在 User 上增加 `lastLoginAt` 并在登录时更新。

### 4.3 缓存策略

```javascript
// 伪代码
const statsCache = { data: null, expiresAt: 0 };
const CACHE_TTL_MS = 60 * 1000; // 60 秒

function getDashboardStats(req, res) {
  if (statsCache.data && Date.now() < statsCache.expiresAt) {
    return res.json({ success: true, data: { stats: statsCache.data } });
  }
  // 并行查询...
  statsCache.data = result;
  statsCache.expiresAt = Date.now() + CACHE_TTL_MS;
  res.json(...);
}
```

### 4.4 索引建议

确保以下索引存在（部分已存在）：

```javascript
// User
userSchema.index({ createdAt: -1 });  // 用于 newUsersToday

// Skill（已有）
skillSchema.index({ status: 1 });
skillSchema.index({ category: 1, status: 1 });
```

### 4.5 对其它功能的影响

| 功能 | 影响 |
|------|------|
| 技能搜索 / 列表 | 无，独立接口 |
| 用户管理 | 无，独立接口 |
| 登录 / 注册 | 无，独立接口 |
| 技能发布 | 无，统计有缓存延迟，可接受 |

---

## 五、实现清单

### 5.1 后端
- [ ] 在 `getDashboardStats` 中实现 `Promise.all` 并行查询
- [ ] 增加内存缓存（TTL 60s）
- [ ] 增加 `newUsersToday` 统计（或保留 `activeToday` 命名，用今日注册数替代）
- [ ] 为 User 添加 `createdAt` 索引（若使用 timestamps 则已有）
- [ ] 可选：增加 `?refresh=1` 参数强制刷新缓存

### 5.2 前端
- [ ] 在 `api.ts` 中新增 `adminAPI.getDashboardStats()`
- [ ] 新建 `useDashboardStats` Hook
- [ ] 修改 `AdminDashboard`，用真实统计替换 `MOCK_STATS`
- [ ] 增加 loading、error 状态

### 5.3 国际化
- [ ] 新增 `admin.newUsersToday` 或调整 `admin.activeToday` 文案

---

## 六、后续扩展（可选）

1. **趋势图**：近 7/30 日注册、发布、下载趋势 → 可新增 `DashboardStatsHistory` 集合，定时聚合
2. **真实活跃**：在 User 中增加 `lastLoginAt`，登录时更新
3. **Redis**：多实例部署时，将缓存迁移到 Redis

---

## 七、总结

采用 **内存缓存 + 并行查询** 可在不改动现有业务接口的前提下，实现 Dashboard 统计并控制性能影响。统计接口仅在管理员访问时调用，且 60 秒内重复访问不触发 DB 查询，对其它功能无影响。
