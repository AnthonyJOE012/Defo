# 代码风格规范

> Defo 项目代码风格规则

## TypeScript (前端)

### 基础规范

- 使用 **2 空格缩进**
- 使用 **单引号** 字符串
- **无分号**（遵循 standardjs）
- 使用 **ESLint + Prettier** 自动格式化

### 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 组件 | PascalCase | `ArticleCard.tsx` |
| Hooks | camelCase, use 前缀 | `useArticles.ts` |
| 工具函数 | camelCase | `formatDate.ts` |
| 常量 | UPPER_SNAKE_CASE | `MAX_PAGE_SIZE` |
| 类型/接口 | PascalCase | `ArticleProps` |

### 文件组织

```
frontend/src/
├── components/     # UI 组件
│   └── ui/        # 基础 UI 组件 (Button, Card, Input)
├── pages/         # 页面组件
├── hooks/         # 自定义 Hooks
├── stores/        # Zustand stores
├── services/      # API 服务
├── lib/           # 工具库
└── types/         # TypeScript 类型
```

### 组件规范

```typescript
// ✅ 正确：明确的 props 类型
interface ArticleCardProps {
  article: Article;
  onFavorite: (id: string) => void;
}

// ✅ 正确：使用 FC（仅无状态时）
const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return <div>{article.title}</div>;
};

// ❌ 错误：不要使用 any
const handleData = (data: any) => { };
```

### Immutability

```typescript
// ✅ 正确：创建新对象
const updatedArticles = [...articles, newArticle];

// ❌ 错误：不要直接修改
articles.push(newArticle);
```

---

## Python (爬虫)

### 基础规范

- 使用 **4 空格缩进**
- 使用 **PEP 8** 风格
- 使用 **ruff** 进行格式化和检查

### 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 模块 | snake_case | `news_crawler.py` |
| 类 | PascalCase | `BaseCrawler` |
| 函数 | snake_case | `fetch_articles()` |
| 常量 | UPPER_SNAKE_CASE | `MAX_RETRIES` |

### 异步优先

```python
# ✅ 正确：使用异步
import httpx
import asyncio

async def fetch_article(url: str) -> Article:
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        return parse_article(response.text)

# ❌ 错误：不要使用同步 requests
import requests
response = requests.get(url)
```

---

## 通用规范

### 错误处理

```typescript
// ✅ 正确：明确的错误处理
try {
  const data = await fetchArticles();
} catch (error) {
  console.error('Failed to fetch articles:', error);
  throw new Error('Failed to fetch articles');
}
```

### 注释规范

- **不要**写冗余注释
- 复杂逻辑需要解释 **为什么**，不是 **是什么**
- 使用 JSDoc / Docstring 记录公共 API

### 代码行数限制

| 类型 | 最大行数 |
|------|---------|
| 组件 | 200 行 |
| 函数 | 50 行 |
| 文件 | 400 行 |

超过时必须拆分。
