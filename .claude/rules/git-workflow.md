# Git 工作流

> Defo 项目 Git 规范

## 分支命名

```
type/description

示例:
feat/article-list
fix/search-pagination
chore/update-deps
```

## Commit 格式

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Type

| type | 说明 |
|------|------|
| feat | 新功能 |
| fix | Bug 修复 |
| refactor | 重构 |
| docs | 文档 |
| test | 测试 |
| chore | 维护 |
| perf | 性能优化 |
| ci | CI/CD |

### Scope

| scope | 说明 |
|-------|------|
| frontend | 前端 |
| crawler | 爬虫 |
| db | 数据库 |
| docs | 文档 |
| infra | 基础设施 |

### 示例

```
feat(frontend): 添加文章列表组件

- 支持分页加载
- 支持下拉刷新
- 添加骨架屏

Closes #123
```

---

## Commit 频率

- **功能完成时** commit
- **不要**每改一行就 commit
- **保持 commit 原子性**：一个 commit 只做一件事

---

## PR 流程

1. 从 `main` 创建功能分支
2. 开发 + 测试
3. Commit (遵循格式)
4. Push
5. 创建 PR
6. Code Review
7. 合并到 `main`

---

## PR 模板

```markdown
## 描述
[简要描述做了什么]

## 变更类型
- [ ] feat
- [ ] fix
- [ ] refactor
- [ ] docs

## 测试
- [ ] 单元测试通过
- [ ] E2E 测试通过
- [ ] 手动测试通过

## 截图 (如有 UI 变更)
[添加截图]

## Checklist
- [ ] 代码遵循规范
- [ ] 没有 console.log
- [ ] 文档已更新
```

---

## 保护分支

- `main` 分支受保护
- 必须通过 PR 合并
- 需要至少 1 个 review
