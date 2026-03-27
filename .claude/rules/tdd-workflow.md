# TDD 工作流规范

> Defo 项目的测试驱动开发规范，遵循 Red-Green-Refactor 循环。

---

## 核心原则

### 测试先行 (Test First)

**每行代码都必须有测试支撑。**

```
1. 编写一个失败的测试 (RED)
2. 运行测试验证失败 (确认测试有效)
3. 编写最小实现代码使测试通过 (GREEN)
4. 重构优化代码 (REFACTOR)
5. 确保测试仍然通过
6. 重复循环
```

### 覆盖率要求

| 类型 | 目标 | 说明 |
|------|------|------|
| 分支覆盖率 | >= 80% | 所有 if/else 分支 |
| 函数覆盖率 | >= 80% | 所有公开函数 |
| 行覆盖率 | >= 80% | 所有代码行 |
| 语句覆盖率 | >= 80% | 所有可执行语句 |

---

## RED 阶段 - 编写失败测试

### 目标
编写一个明确定义预期行为的测试，运行后必须失败。

### 步骤

1. **分析需求**
   - 要实现什么功能？
   - 函数的输入是什么？
   - 期望的输出是什么？
   - 边界条件有哪些？

2. **编写测试文件**
   ```typescript
   // frontend/src/services/__tests__/articles.test.ts
   // 或
   // crawlers/tests/test_parser.py
   ```

3. **测试结构**
   ```typescript
   describe('功能名称', () => {
     it('should [预期行为]', () => {
       // Given - 准备测试数据
       const input = ...

       // When - 执行被测函数
       const result = myFunction(input);

       // Then - 验证预期结果
       expect(result).toBe(...);
     });
   });
   ```

4. **运行测试确认失败**
   ```bash
   # 前端
   npm run test -- --run

   # Python
   pytest -v
   ```
   **测试必须失败**，如果测试通过，说明测试没有正确验证功能。

### 必须测试的边界情况

| 边界类型 | 测试场景 |
|---------|---------|
| 空值 | `null`, `undefined`, `""`, `[]` |
| 边界值 | 最小值、最大值、临界值 |
| 错误路径 | 网络失败、数据库错误、无权限 |
| 类型错误 | 传入错误类型参数 |
| 大数据 | 10000+ 条记录的性能 |

---

## GREEN 阶段 - 最小实现

### 目标
编写最少量代码使测试通过，**不追求完美**。

### 原则

- **只实现测试要求的功能**
- **不使用未测试的辅助函数**
- **不提前优化性能**
- **不添加测试未覆盖的功能**

### 步骤

1. 运行测试，确认失败信息清晰
2. 编写最简单能通过测试的代码
3. 运行测试，确认全部通过
4. 提交当前状态 (可选)

### 前端示例

```typescript
// 最小实现 - 只为了让测试通过
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString();
}
```

### Python 示例

```python
# 最小实现
def parse_article(html: str) -> dict:
    return {"title": "Parsed", "content": html}
```

---

## REFACTOR 阶段 - 重构优化

### 目标
在保持测试通过的前提下，优化代码结构。

### 可重构内容

- 提取重复代码
- 重命名变量/函数使其更清晰
- 优化性能
- 改善错误处理
- 添加边界情况处理

### 步骤

1. 确认所有测试通过
2. 进行一处重构
3. 运行测试确认仍然通过
4. 重复直到重构完成

### 重构禁忌

- **不要改变已通过测试的行为**
- **不要删除测试覆盖的代码路径**
- **不要添加未测试的新功能**

---

## 前端测试规范 (React 18 + TypeScript + Vitest)

### 测试文件位置

```
frontend/src/
├── components/
│   └── __tests__/          # 组件测试
│       └── ArticleCard.test.tsx
├── hooks/
│   └── __tests__/          # Hook 测试
│       └── useArticles.test.ts
├── services/
│   └── __tests__/          # 服务层测试
│       └── articles.test.ts
└── utils/
    └── __tests__/          # 工具函数测试
        └── format.test.ts
```

### 命名规范

| 类型 | 命名格式 | 示例 |
|------|---------|------|
| 测试文件 | `[name].test.ts[x]` | `useArticles.test.ts` |
| 测试套件 | `describe('...')` | `describe('useArticles')` |
| 测试用例 | `it('should...')` | `it('should fetch articles')` |

### 测试模板

```typescript
import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';

describe('ComponentName', () => {
  // 准备通用 mock
  const mockData = { id: 1, title: 'Test' };

  beforeEach(() => {
    // 重置 mocks
    vi.clearAllMocks();
  });

  describe('when rendering', () => {
    it('should display title', () => {
      render(<MyComponent data={mockData} />);
      expect(screen.getByText('Test')).toBeInTheDocument();
    });
  });

  describe('when data is empty', () => {
    it('should show empty state', () => {
      render(<MyComponent data={null} />);
      expect(screen.getByText('No data')).toBeInTheDocument();
    });
  });

  describe('when API fails', () => {
    it('should show error message', async () => {
      vi.spyOn(api, 'fetch').mockRejectedValue(new Error('Network error'));
      render(<MyComponent />);
      expect(await screen.findByText('Error')).toBeInTheDocument();
    });
  });
});
```

### Hook 测试模板

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useAsync } from '../useAsync';

describe('useAsync', () => {
  it('should load data successfully', async () => {
    const { result } = renderHook(() =>
      useAsync(() => Promise.resolve({ data: 'test' }))
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBe('test');
  });

  it('should handle error', async () => {
    const { result } = renderHook(() =>
      useAsync(() => Promise.reject(new Error('Failed')))
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
  });
});
```

---

## Python 测试规范 (pytest)

### 测试文件位置

```
crawlers/
├── tests/
│   ├── __init__.py
│   ├── test_parser.py      # 解析器测试
│   ├── test_crawler.py     # 爬虫测试
│   └── conftest.py         # pytest 配置和 fixtures
└── news/
    └── tests/
        └── test_designboom.py
```

### 命名规范

| 类型 | 命名格式 | 示例 |
|------|---------|------|
| 测试文件 | `test_[name].py` | `test_parser.py` |
| 测试函数 | `test_[描述]` | `def test_parse_article_html()` |
| Fixture | `pytest.fixture` | `@pytest.fixture` |

### 测试模板

```python
import pytest
from crawlers.parser import parse_article

class TestParser:
    """解析器测试套件"""

    @pytest.fixture
    def sample_html(self):
        return """
        <html>
            <h1>Test Title</h1>
            <p>Test content paragraph.</p>
        </html>
        """

    def test_parse_article_html(self, sample_html):
        """应该正确解析 HTML"""
        # Given
        html = sample_html

        # When
        result = parse_article(html)

        # Then
        assert result.title == "Test Title"
        assert result.content == "Test content paragraph."

    def test_parse_empty_html(self):
        """应该处理空 HTML"""
        result = parse_article("")
        assert result is None

    def test_parse_invalid_html(self):
        """应该处理无效 HTML"""
        with pytest.raises(ValueError):
            parse_article(None)
```

### 异步测试模板

```python
import pytest
from crawlers.news.designboom import DesignboomCrawler

@pytest.mark.asyncio
async def test_fetch_articles():
    """应该获取文章列表"""
    crawler = DesignboomCrawler()

    articles = await crawler.fetch()

    assert len(articles) > 0
    assert all(hasattr(a, 'title') for a in articles)

@pytest.mark.asyncio
async def test_fetch_handles_network_error():
    """应该处理网络错误"""
    crawler = DesignboomCrawler()

    with pytest.raises(NetworkError):
        await crawler.fetch(url="invalid-url")
```

---

## 集成测试规范

### 前端集成测试 (API + 数据库)

```typescript
// services/__tests__/articles.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useArticles } from '../useArticles';
import { server } from '../mocks/server';

// 启动 MSW 服务器
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('useArticles (Integration)', () => {
  it('should fetch from Supabase', async () => {
    const { result } = renderHook(() => useArticles({ page: 1 }));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveLength(20);
  });

  it('should handle Supabase error', async () => {
    server.use(
      rest.get('/rest/v1/articles', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ message: 'Server error' }));
      })
    );

    const { result } = renderHook(() => useArticles());

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
```

### Python 集成测试 (数据库)

```python
# tests/test_db_integration.py
import pytest
from supabase import create_client
from crawlers.db import ArticleRepository

@pytest.fixture
def db_client():
    return create_client(SUPABASE_URL, SUPABASE_KEY)

@pytest.fixture
def article_repo(db_client):
    return ArticleRepository(db_client)

def test_save_article_to_db(article_repo, sample_article):
    """应该保存文章到数据库"""
    saved = article_repo.create(sample_article)

    assert saved.id is not None
    assert saved.title == sample_article.title

def test_fetch_articles_from_db(article_repo):
    """应该从数据库获取文章"""
    articles = article_repo.find_all(limit=10)

    assert len(articles) <= 10
    assert all(hasattr(a, 'id') for a in articles)
```

---

## E2E 测试规范 (Playwright)

### 测试文件位置

```
frontend/
└── e2e/
    ├── articles.spec.ts
    ├── auth.spec.ts
    └── crawl.spec.ts
```

### 命名规范

| 类型 | 命名格式 | 示例 |
|------|---------|------|
| 测试文件 | `[feature].spec.ts` | `articles.spec.ts` |
| 测试函数 | `test('...')` | `test('user can browse articles')` |

### 测试模板

```typescript
// e2e/articles.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Articles', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/articles');
  });

  test('should display article list', async ({ page }) => {
    await expect(page.getByRole('article')).toHaveCount(20);
  });

  test('should navigate to article detail', async ({ page }) => {
    await page.getByRole('article').first().click();
    await expect(page).toHaveURL(/\/articles\/\d+/);
  });

  test('should handle empty state', async ({ page }) => {
    // Mock empty response
    await page.route('**/rest/v1/articles', (route) => {
      route.fulfill({ body: { data: [] } });
    });

    await page.reload();
    await expect(page.getByText('No articles found')).toBeInTheDocument();
  });
});
```

---

## 测试覆盖率检查

### 运行覆盖率报告

```bash
# 前端
npm run test:coverage

# 打开 HTML 报告
open frontend/coverage/index.html
```

```bash
# Python
pytest --cov=crawlers --cov-report=html --cov-report=term

# 打开 HTML 报告
open htmlcov/index.html
```

### 覆盖率阈值配置

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80
      }
    }
  }
});
```

```ini
# .coveragerc
[report]
fail_under = 80
show_missing = True
skip_covered = False
```

---

## Mock 规则

### 前端 Mock (Vitest + msw)

**原则**: 只 mock 外部依赖，不 mock 内部实现

```typescript
// Mock API 响应
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  http.get('/rest/v1/articles', () => {
    return HttpResponse.json({ data: mockArticles });
  })
);

// 在测试中使用
it('should fetch articles', async () => {
  renderHook(() => useArticles());
  await waitFor(() => expect(screen.getByText('Article 1')).toBeInTheDocument());
});
```

### Python Mock (pytest-mock)

```python
from unittest.mock import patch, AsyncMock

def test_parser_with_network_mock():
    """使用 mock 网络请求"""
    with patch('crawlers.parser.requests.get') as mock_get:
        mock_get.return_value.text = "<h1>Mock</h1>"

        result = parse_article_from_url("http://test.com")

        assert result.title == "Mock"

@pytest.mark.asyncio
async def test_crawler_with_mock():
    """使用 mock 异步请求"""
    with patch('crawlers.news.designboom.aiohttp.ClientSession') as mock_session:
        mock_instance = AsyncMock()
        mock_instance.__aenter__.return_value.get.return_value.json.return_value = {
            "data": [{"title": "Test"}]
        }
        mock_session.return_value = mock_instance

        crawler = DesignboomCrawler()
        articles = await crawler.fetch()
```

---

## 代码审查清单

提交前检查:

- [ ] 所有新函数有单元测试
- [ ] 所有 API 端点有集成测试
- [ ] 关键用户流程有 E2E 测试
- [ ] 边界情况已覆盖 (null, empty, error)
- [ ] 测试覆盖率 >= 80%
- [ ] 测试可独立运行，无依赖
- [ ] Mock 正确使用，不依赖外部服务
- [ ] 测试命名清晰，描述预期行为

---

## TDD 常见问题

### Q: 测试一直失败怎么办？

1. 检查测试是否正确编写
2. 确认测试的预期值是否正确
3. 使用 `console.log` 调试测试
4. 简化测试，逐步验证

### Q: 如何处理异步代码？

```typescript
// 使用 waitFor
await waitFor(() => {
  expect(result.current.isLoading).toBe(false);
});
```

```python
# 使用 pytest-asyncio
@pytest.mark.asyncio
async def test_async():
    result = await async_function()
    assert result is not None
```

### Q: 如何测试 React Router 导航？

```typescript
import { MemoryRouter } from 'react-router-dom';

render(
  <MemoryRouter initialEntries={['/articles']}>
    <App />
  </MemoryRouter>
);
```

### Q: 如何测试数据库操作？

1. 使用测试数据库
2. 每个测试前后清理数据
3. 使用事务回滚

---

## 相关文件

- [testing.md](./testing.md) - 测试基础规范
- [frontend.md](./frontend.md) - 前端技术栈
- [crawler.md](./crawler.md) - 爬虫技术栈
- [supabase.md](./supabase.md) - 数据库规范
