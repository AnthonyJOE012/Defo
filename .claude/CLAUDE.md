# Defo - Claude Code 项目指南

> Design 行业信息聚合阅读器

## 项目概述

Defo 是一个 Design 行业信息聚合阅读器，汇聚行业新闻、学术论文和设计比赛信息。

### 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React 18 + Vite + TypeScript |
| 状态管理 | Zustand |
| 数据获取 | TanStack Query + Dexie.js |
| 本地存储 | IndexedDB |
| 数据库 | Supabase PostgreSQL |
| 爬虫 | Python (httpx + beautifulsoup4 + scholarly) |
| 定时任务 | GitHub Actions |
| 部署 | Vercel |

### 数据来源

- **行业信息**: 19 个来源 (Designboom, Dezeen 等)
- **学术论文**: 5 个来源 (Google Scholar, ACM 等)
- **设计比赛**: 40+ 个来源 (A' Design Award, D&AD 等)

---

## 项目结构

```
Defo/
├── frontend/              # React + Vite 前端
├── crawlers/              # Python 爬虫
├── supabase/              # 数据库迁移
├── docs/                  # 项目文档
├── .claude/               # Claude Code 配置
│   ├── CLAUDE.md         # 本文件 - 项目指南
│   ├── rules/             # 规则文件
│   ├── commands/          # 快捷命令
│   ├── skills/            # 自动触发技能
│   └── agents/            # 子代理
└── .github/               # GitHub Actions
```

---

## 工作流程

### 开发流程

1. **研究 & 重用** - 先搜索 GitHub、现有项目、库文档
2. **计划** - 使用 `/plan` 创建实施计划
3. **TDD** - 使用 `/tdd` 测试驱动开发
4. **代码审查** - 使用 `/code-review` 审查代码
5. **提交 & 推送** - 遵循 conventional commits

### 文件输出规则

**所有 Claude Code 生成的文件必须保存到 `/Users/anthony/Claude_code/` 目录**，除非：
- 项目已有明确目录结构
- 明确指定了其他路径

---

## 决策确认规则

遇到以下情况时，**必须先询问再行动**：

- 有多种技术实现方案可选
- 设计决策影响后续代码结构
- 涉及架构调整或重构
- 需要修改核心逻辑
- 不确定当前需求的最佳实践

---

## 代码规范

### TypeScript

- 使用 **TypeScript strict mode**
- 避免 `any` 类型
- 优先使用 `interface` 而不是 `type`
- 遵循 ESLint + Prettier 配置

### Python (爬虫)

- 使用 `ruff` 进行格式化和检查
- 类型提示 (type hints)
- 异步优先 (asyncio + httpx)

### 数据库

- 使用 Supabase SDK
- 避免直接写 SQL（优先使用 SDK 方法）
- 迁移文件命名: `001_description.sql`

---

## 标签规则

按以下顺序添加标签：

```
type:feat|fix|refactor|docs|test|chore|perf|ci
scope:frontend|crawler|db|docs|infra
```

示例: `feat:frontend 添加文章列表组件`

---

## 阶段状态

| 阶段 | 内容 | 状态 |
|------|------|------|
| Phase 0 | 项目规划 & 文档 | ✅ 完成 |
| Phase 1 | 基础架构搭建 | ✅ 完成 |
| Phase 2 | 爬虫开发 | ✅ 完成 |
| Phase 3 | 前端核心开发 | ✅ 完成 |
| Phase 4 | 本地化与同步 | ⏳ 待开始 |
| Phase 5 | 搜索与筛选 | ⏳ 待开始 |
| Phase 6 | 收藏功能 | ⏳ 待开始 |
| Phase 7 | 部署与优化 | ⏳ 待开始 |

---

## 相关文档

- [接口文档](../docs/api.md) - API 详细设计
- [README](../README.md) - 项目概述
