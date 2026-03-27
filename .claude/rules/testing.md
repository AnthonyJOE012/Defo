# 测试规范

> Defo 项目测试要求

## 覆盖率要求

**最低覆盖率: 80%**

| 类型 | 要求 |
|------|------|
| 单元测试 | 所有工具函数、Hooks |
| 集成测试 | API 服务、数据库操作 |
| E2E 测试 | 关键用户流程 |

---

## 前端测试 (Vitest + Playwright)

### 单元测试

```typescript
// components/__tests__/ArticleCard.test.tsx
import { render, screen } from '@testing-library/react';
import { ArticleCard } from '../ArticleCard';

describe('ArticleCard', () => {
  it('renders article title', () => {
    render(<ArticleCard article={mockArticle} />);
    expect(screen.getByText(mockArticle.title)).toBeInTheDocument();
  });
});
```

### 集成测试

```typescript
// services/__tests__/articles.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useArticles } from '../useArticles';

describe('useArticles', () => {
  it('fetches articles successfully', async () => {
    const { result } = renderHook(() => useArticles());
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
```

### E2E 测试 (Playwright)

```typescript
// e2e/articles.spec.ts
import { test, expect } from '@playwright/test';

test('user can browse articles', async ({ page }) => {
  await page.goto('/articles');
  await expect(page.getByRole('article')).toHaveCount(20);
});
```

### 测试命令

```bash
# 运行单元测试
npm run test

# 运行覆盖率报告
npm run test:coverage

# 运行 E2E 测试
npm run test:e2e
```

---

## Python 测试 (pytest)

### 单元测试

```python
# tests/test_parser.py
import pytest
from crawlers.parser import parse_article

def test_parse_article_html():
    html = "<h1>Test</h1><p>Content</p>"
    article = parse_article(html)
    assert article.title == "Test"
```

### 集成测试

```python
# tests/test_crawler.py
import pytest
from crawlers.news.designboom import DesignboomCrawler

@pytest.mark.asyncio
async def test_fetch_articles():
    crawler = DesignboomCrawler()
    articles = await crawler.fetch()
    assert len(articles) > 0
```

### 测试命令

```bash
# 运行测试
pytest

# 带覆盖率
pytest --cov=crawlers --cov-report=html
```

---

## 测试文件位置

```
# 前端
frontend/
├── src/
│   ├── components/__tests__/
│   ├── hooks/__tests__/
│   └── services/__tests__/
└── e2e/

# Python
crawlers/
├── tests/
│   ├── test_parser.py
│   ├── test_crawler.py
│   └── __init__.py
└── news/
    └── __init__.py
```

---

## Mock 规则

- 使用 **msw** (前端) / **pytest-mock** (Python) 进行 API mock
- 不要 mock 内部实现，只 mock 外部依赖
- 单元测试中避免网络请求
