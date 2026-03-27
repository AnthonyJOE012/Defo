# 子代理配置

> Defo 项目专用子代理

## 可用子代理

| Agent | 用途 | 触发场景 |
|-------|------|----------|
| planner | 实施规划 | 复杂功能、架构决策 |
| tdd-guide | TDD 流程 | 新功能、bug 修复 |
| code-reviewer | 代码审查 | 代码编写后 |
| build-error-resolver | 构建修复 | 构建失败时 |
| refactor-cleaner | 重构清理 | 代码维护 |

## 自动触发

- **复杂功能**: 自动调用 planner
- **代码编写后**: 自动调用 code-reviewer
- **Bug 修复/新功能**: 自动调用 tdd-guide

## 本项目特定配置

### 前端开发

- 使用 React 18 + TypeScript
- 遵循 `.claude/rules/frontend.md`

### 爬虫开发

- 使用 Python 3.11+
- 遵循 `.claude/rules/crawler.md`

### 数据库

- 使用 Supabase
- 遵循 `.claude/rules/supabase.md`
