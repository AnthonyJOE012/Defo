# 前端规范

> Defo 前端开发规范

## 技术栈

- **框架**: React 18 + Vite
- **语言**: TypeScript (strict mode)
- **样式**: Tailwind CSS
- **状态管理**: Zustand
- **数据获取**: TanStack Query
- **本地存储**: Dexie.js (IndexedDB)
- **路由**: React Router v6

## 项目结构

```
frontend/
├── src/
│   ├── components/        # 组件
│   │   ├── ui/           # 基础 UI (Button, Card, Input...)
│   │   ├── layout/       # 布局组件 (Header, Sidebar, Footer)
│   │   └── features/     # 功能组件 (ArticleCard, SearchBar...)
│   ├── pages/            # 页面
│   │   ├── Home.tsx
│   │   ├── Articles.tsx
│   │   ├── Article.tsx
│   │   ├── Favorites.tsx
│   │   └── Search.tsx
│   ├── hooks/            # 自定义 Hooks
│   ├── stores/           # Zustand stores
│   ├── services/         # API 服务 (Supabase)
│   ├── lib/              # 工具 (db.ts, utils.ts)
│   ├── types/            # TypeScript 类型
│   └── App.tsx
├── public/
└── index.html
```

## 组件规范

### 命名

- 文件名: PascalCase (`ArticleCard.tsx`)
- 组件名: PascalCase
- CSS 类: Tailwind (无自定义 CSS)

### Props

```typescript
// ✅ 使用 interface
interface ArticleCardProps {
  article: Article;
  onFavorite?: (id: string) => void;
  variant?: 'default' | 'compact';
}

// ❌ 不要用 type alias
type Props = { ... }
```

### 组件拆分

- 每个组件**不超过 200 行**
- 超过时拆分为子组件
- 优先使用 **composition** 而非条件渲染

## 状态管理

### Zustand Store

```typescript
// stores/articleStore.ts
import { create } from 'zustand';

interface ArticleState {
  articles: Article[];
  setArticles: (articles: Article[]) => void;
}

export const useArticleStore = create<ArticleState>((set) => ({
  articles: [],
  setArticles: (articles) => set({ articles }),
}));
```

### TanStack Query

```typescript
// services/articles.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useArticles(page: number) {
  return useQuery({
    queryKey: ['articles', page],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .range((page - 1) * 20, page * 20);
      if (error) throw error;
      return data;
    },
  });
}
```

## API 层

所有 API 调用通过 `services/` 目录：

```
services/
├── supabase.ts      # Supabase 客户端
├── articles.ts      # 文章相关 API
├── sources.ts       # 来源相关 API
├── favorites.ts     # 收藏相关 API
└── sync.ts         # 同步相关 API
```

## 样式规范

- 使用 **Tailwind CSS** 原子类
- **不要**创建自定义 CSS 文件
- 响应式设计使用 Tailwind breakpoints

```tsx
// ✅ 正确
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// ❌ 错误
<div className="custom-grid">
```

## 环境变量

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## 构建与部署

- 使用 `npm run build` 构建
- 输出到 `dist/` 目录
- Vercel 自动部署 `main` 分支
