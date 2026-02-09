---
name: learn-skills
description: 当用户或 Agent 需要某项能力时，搜索技能市场或网站，找到后询问是否安装，确认后执行安装，使新技能立即可用。Use when the user needs a capability, wants to learn/install a skill, or asks to add new functionality.
license: MIT
metadata:
  author: learn-skills
  version: "1.0.0"
category: tools
tags: []
---

# learn-skills

帮助用户或 Agent 在需要某项能力时，主动搜索可用技能、询问安装意愿，并在确认后完成安装，使新技能立即可用。

## 支持的 Agent 及安装目录

安装前需确定目标 Agent，根据下表选择安装目录：

| Agent | 安装目录 | 说明 |
|-------|----------|------|
| **Cursor** | `~/.cursor/skills/` | Cursor IDE 个人技能 |
| **Claude Code** | `~/.claude/skills/` | Claude Code 个人技能 |
| **Windsurf** | `~/.windsurf/skills/` | Windsurf (Codeium) 个人技能 |
| **GitHub Copilot** | `~/.copilot/skills/` | GitHub Copilot 个人技能 |
| **Gemini CLI** | `~/.gemini/skills/` | Gemini CLI 个人技能 |
| **项目级** | `.cursor/skills/` | 当前项目共享（仅 Cursor 支持） |

**确定目标 Agent**：若当前对话环境已知（如 Cursor），则使用对应目录；否则在询问安装时一并询问用户「要为哪个 Agent 安装？（Cursor / Claude Code / Windsurf / Copilot / Gemini / 项目级）」。

## 触发场景

在以下情况应使用本技能：

- 用户表达需要某种能力（如「我需要处理 PDF」「帮我写 commit message」「配置数据库」）
- Agent 发现自己缺少完成当前任务所需的技能
- 用户明确要求「搜索并安装」「找个技能」「学习新技能」

## 工作流程

### 1. 搜索技能

**优先使用 skm CLI**（若项目中有 `skm` 或 `npx skm`）：

```bash
skm search <能力关键词>
# 或
npx skm search <能力关键词>
```

示例：`skm search PDF`、`skm search commit message`、`skm search database`

**若 skm 不可用，使用 WebSearch**：

- 搜索：`BotSkill <能力关键词> skill` 或 `Cursor skill <能力关键词>`
- 关注来自 BotSkill、Cursor 技能市场或相关社区的技能介绍

### 2. 展示结果并询问安装

找到技能后，向用户说明：

- 技能名称（如 `@author/skill-name`）
- 简短描述
- 版本（如有）

**务必询问用户**：

> 找到技能「xxx」，可提供 [能力描述]。是否要安装？
> 若安装，请说明为哪个 Agent 安装（Cursor / Claude Code / Windsurf / Copilot / Gemini / 项目级），或由我根据当前环境选择。

等待用户确认（是/好/安装/确认等）后再继续。在确认时一并确定目标 Agent（若用户未指定，则根据当前环境推断，如 Cursor 环境用 `~/.cursor/skills/`）。

### 3. 执行安装

用户确认后，根据已确定的 Agent 从「支持的 Agent 及安装目录」表中选择 `OUTPUT_DIR`，执行：

```bash
skm get @author/skill-name -o <OUTPUT_DIR>
# 或指定版本
skm get @author/skill-name@1.0.0 -o <OUTPUT_DIR>
```

示例（Cursor）：`skm get @author/skill-name -o ~/.cursor/skills/`  
示例（Claude Code）：`skm get @author/skill-name -o ~/.claude/skills/`  
示例（项目级）：`skm get @author/skill-name -o .cursor/skills/`

若用户没有安装 skm：

```bash
npm install -g skm
# 或
npx skm get @author/skill-name -o <OUTPUT_DIR>
```

### 4. 验证并告知

安装完成后：

- 确认 `<OUTPUT_DIR>/skill-name/` 存在且包含 `SKILL.md`
- 告知用户：「技能已安装到 [Agent 对应目录]，可在下次对话中直接使用该能力。」

## 注意事项

- **必须征得用户同意**：未确认前不执行安装
- **安装目录**：按「支持的 Agent 及安装目录」表，根据目标 Agent 选择对应目录
- **skm 规范**：技能标识为 `@author/name`，可通过 `skm search` 结果获取
- **Web 搜索**：从搜索结果中提取技能名称、来源和安装方式，无法直接安装时指导用户手动操作

## 示例对话

**用户**：我需要一个能解析 PDF 的技能。

**Agent**：正在搜索 PDF 相关技能…  
（执行 `skm search PDF`）  
找到技能 `@example/pdf-parser`：提取 PDF 文本和表格。是否要安装？若安装，请说明为哪个 Agent（Cursor / Claude Code / Windsurf / Copilot / Gemini / 项目级），或由我根据当前环境选择。

**用户**：好的，安装到 Cursor。

**Agent**：（执行 `skm get @example/pdf-parser -o ~/.cursor/skills/`）  
技能已安装到 Cursor 的技能目录，可在下次对话中直接使用 PDF 解析能力。
