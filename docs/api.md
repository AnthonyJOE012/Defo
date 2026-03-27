# Defo API Documentation

> Design 行业信息聚合阅读器 - 接口文档

## 基础信息

| 项目 | 值 |
|------|-----|
| Base URL | `https://[your-project].supabase.co` |
| API Version | `v1` |
| Content-Type | `application/json` |
| 认证方式 | 设备 ID (Device ID) |

---

## 通用规则

### 认证

所有 API 请求需要在 Header 中包含设备 ID：

```
Authorization: Bearer [SUPABASE_ANON_KEY]
X-Device-ID: [device-id]
```

> 设备 ID 由客户端生成，格式为 UUID v4，存储于本地 IndexedDB
>
> **注意**：仅使用 `Authorization` header，`apikey` 已废弃

### 分页

所有列表接口支持分页，响应包含自定义分页元数据：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `page` | integer | 1 | 页码 |
| `limit` | integer | 20 | 每页数量 (最大 100) |

> **分页机制说明**：同时支持两种分页方式
> 1. **自定义 meta**（推荐）：响应体中包含 `meta.page`、`meta.total` 等
> 2. **Supabase Range**：响应头包含 `Content-Range`，用于原生 Supabase 客户端

响应包含分页元数据：

```json
{
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 1000,
    "totalPages": 50
  }
}
```

### 错误响应

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {}
  }
}
```

### 错误码

| 错误码 | HTTP 状态码 | 说明 |
|--------|-------------|------|
| `INVALID_PARAMS` | 400 | 请求参数错误 |
| `UNAUTHORIZED` | 401 | 认证失败 |
| `FORBIDDEN` | 403 | 无权限访问 |
| `NOT_FOUND` | 404 | 资源不存在 |
| `RATE_LIMITED` | 429 | 请求过于频繁 |
| `SERVER_ERROR` | 500 | 服务器内部错误 |

### 速率限制超限响应

```json
{
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many requests. Please try again later.",
    "details": {
      "retry_after": 60
    }
  }
}
```

---

## 字段映射 (Database -> API)

数据库使用 snake_case，API 响应映射为前端需要的 camelCase：

| 数据库字段 | API 响应字段 | 说明 |
|-----------|-------------|------|
| `id` | `id` | UUID 转字符串 |
| `title` | `title` | - |
| `summary` | `description` | 重命名 |
| `type` (news/paper/competition) | `category` (Design News/Paper/Design Award) | 类型映射 |
| `published_at` | `date` | YYYY-MM-DD 格式 |
| `image_url` | `imageUrl` | 驼峰命名 |

### Category 映射规则

| 数据库 type | 前端 category |
|------------|---------------|
| `news` | `"Design News"` |
| `paper` | `"Paper"` |
| `competition` | `"Design Award"` |

---

## 接口列表

### Articles (文章)

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/articles` | 获取文章列表 |
| GET | `/articles/:id` | 获取文章详情 |

### Sources (来源)

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/sources` | 获取来源列表 |
| GET | `/sources/:id` | 获取单个来源 |
| GET | `/sources/:id/articles` | 获取指定来源的文章 |

### Favorites (收藏)

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/rpc/get_favorited_articles` | 获取收藏列表 |
| POST | `/favorites` | 添加收藏 |
| DELETE | `/favorites/:id` | 删除收藏 |

---

## 接口详情

### 1. 获取文章列表 (推荐)

```
GET /rest/v1/rpc/get_articles
```

**查询参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `page` | integer | 否 | 页码，默认 1 |
| `limit` | integer | 否 | 每页数量，默认 20 |
| `p_type` | string | 否 | 文章类型: `news`, `paper`, `competition` |
| `p_days` | integer | 否 | 返回最近 N 天内的文章 |
| `p_source_id` | UUID | 否 | 来源 ID |

**请求示例**

```http
GET /rest/v1/rpc/get_articles?p_page=1&p_limit=20&p_type=news&p_days=30
```

**响应示例**

```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Apple Unveils Revolutionary Design Language",
      "description": "Apple has announced a new design approach...",
      "category": "Design News",
      "date": "2026-03-27",
      "imageUrl": "https://cdn.defo.com/images/apple.jpg",
      "url": "https://designboom.com/apple-design",
      "author": "John Doe",
      "slug": "apple-unveils-revolutionary-design-language",
      "source": {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "name": "Designboom",
        "slug": "designboom",
        "logoUrl": "https://cdn.defo.com/logos/designboom.png",
        "type": "news"
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 1000,
    "totalPages": 50
  }
}
```

---

### 2. 获取文章详情

```
GET /rest/v1/articles/:id
```

**路径参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| `id` | UUID | 文章 ID |

**响应示例**

```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Apple Unveils Revolutionary Design Language",
    "description": "Apple has announced a new design approach...",
    "category": "Design News",
    "date": "2026-03-27",
    "imageUrl": "https://cdn.defo.com/images/apple.jpg",
    "url": "https://designboom.com/apple-design",
    "author": "John Doe",
    "slug": "apple-unveils-revolutionary-design-language",
    "content": "Full article content...",
    "published_at": "2026-03-27T10:00:00Z",
    "source": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Designboom",
      "slug": "designboom",
      "type": "news",
      "url": "https://www.designboom.com",
      "logoUrl": "https://cdn.defo.com/logos/designboom.png"
    }
  }
}
```

> **注意**：获取文章详情后，需在前端适配层手动转换字段：
> - `summary` -> `description`
> - `published_at` -> `date` (格式化为 YYYY-MM-DD)
> - `image_url` -> `imageUrl`
> - `source.type` -> `category` (使用映射表)

---

### 3. 获取来源列表

```
GET /rest/v1/sources
```

**查询参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `select` | string | 否 | 返回字段，默认 `*` |
| `type` | string | 否 | 筛选类型: `news`, `paper`, `competition` |
| `is_active` | boolean | 否 | 是否启用，默认 `true` |
| `order` | string | 否 | 排序，如 `name.asc` |

**请求示例**

```http
GET /rest/v1/sources?type=eq.news&is_active=eq.true&order=name.asc
```

**响应示例**

```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Designboom",
      "slug": "designboom",
      "type": "news",
      "url": "https://www.designboom.com",
      "logoUrl": "https://cdn.defo.com/logos/designboom.png",
      "isActive": true,
      "createdAt": "2026-03-27T00:00:00Z",
      "updatedAt": "2026-03-27T00:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 100,
    "total": 19,
    "totalPages": 1
  }
}
```

> **注意**：Supabase 默认返回 snake_case，需前端适配层转换为 camelCase

---

### 4. 获取来源的文章

```
GET /rest/v1/sources/:id/articles
```

**路径参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| `id` | UUID | 来源 ID |

**查询参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `page` | integer | 否 | 页码，默认 1 |
| `limit` | integer | 否 | 每页数量，默认 20 |
| `order` | string | 否 | 排序，默认 `published_at.desc` |

**响应示例**

```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Apple Unveils Revolutionary Design Language",
      "description": "Apple has announced a new design approach...",
      "category": "Design News",
      "date": "2026-03-27",
      "imageUrl": "https://cdn.defo.com/images/apple.jpg",
      "url": "https://designboom.com/apple-design",
      "author": "John Doe",
      "publishedAt": "2026-03-27T10:00:00Z",
      "sourceId": "550e8400-e29b-41d4-a716-446655440001"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

---

### 5. 全文搜索

```
POST /rest/v1/rpc/full_text_search
```

**请求体**

```json
{
  "query": "design trends 2026",
  "type": "news",
  "page": 1,
  "limit": 20
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `query` | string | 是 | 搜索关键词 |
| `type` | string | 否 | 文章类型筛选 |
| `page` | integer | 否 | 页码，默认 1 |
| `limit` | integer | 否 | 每页数量，默认 20 |

**响应示例**

```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Design Trends 2026",
      "description": "The top design trends...",
      "category": "Design News",
      "date": "2026-03-27",
      "imageUrl": "https://cdn.defo.com/images/apple.jpg",
      "url": "https://...",
      "source": {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "name": "Designboom",
        "logoUrl": "https://cdn.defo.com/logos/designboom.png"
      },
      "rank": 0.95
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "query": "design trends 2026"
  }
}
```

---

### 6. 增量同步

```
POST /rest/v1/rpc/sync_articles
```

**请求头**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `X-Device-ID` | string | 是 | 设备 ID |

**请求体**

```json
{
  "last_sync_at": "2026-03-26T00:00:00Z"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `last_sync_at` | timestamp | 否 | 上次同步时间，返回此后更新的数据 |

**响应示例**

```json
{
  "data": {
    "articles": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "title": "New Article",
        "date": "2026-03-27",
        "category": "Design News",
        "sourceId": "550e8400-e29b-41d4-a716-446655440001"
      }
    ],
    "deletedIds": ["uuid1", "uuid2"],
    "syncToken": "2026-03-27T12:00:00Z"
  },
  "meta": {
    "totalNew": 15,
    "totalDeleted": 2,
    "syncAt": "2026-03-27T12:00:00Z"
  }
}
```

---

### 7. 获取收藏列表

```
GET /rest/v1/rpc/get_favorited_articles
```

**请求头**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `X-Device-ID` | string | 是 | 设备 ID |

**查询参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `page` | integer | 否 | 页码，默认 1 |
| `limit` | integer | 否 | 每页数量，默认 20 |

**响应示例**

```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "articleId": "550e8400-e29b-41d4-a716-446655440000",
      "createdAt": "2026-03-27T10:00:00Z",
      "article": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "title": "Article Title",
        "description": "...",
        "category": "Design News",
        "date": "2026-03-27",
        "imageUrl": "https://cdn.defo.com/images/article.jpg",
        "url": "https://...",
        "source": {
          "id": "550e8400-e29b-41d4-a716-446655440001",
          "name": "Designboom",
          "logoUrl": "https://cdn.defo.com/logos/designboom.png"
        }
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 10,
    "totalPages": 1
  }
}
```

---

### 8. 添加收藏

```
POST /rest/v1/favorites
```

**请求头**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `X-Device-ID` | string | 是 | 设备 ID |

**请求体**

```json
{
  "article_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**响应示例**

```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "articleId": "550e8400-e29b-41d4-a716-446655440000",
    "deviceId": "uuid",
    "createdAt": "2026-03-27T10:00:00Z"
  }
}
```

---

### 9. 删除收藏

```
DELETE /rest/v1/favorites/:id
```

**请求头**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `X-Device-ID` | string | 是 | 设备 ID |

**路径参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| `id` | UUID | 收藏 ID |

**响应**

```
204 No Content
```

---

### 10. 批量归档/取消归档

```
POST /rest/v1/rpc/batch_archive
```

**请求头**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `X-Device-ID` | string | 是 | 设备 ID |

**请求体**

```json
{
  "article_ids": ["550e8400-e29b-41d4-a716-446655440000", "550e8400-e29b-41d4-a716-446655440001"],
  "is_archived": true
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `article_ids` | UUID[] | 是 | 文章 ID 数组 |
| `is_archived` | boolean | 是 | true=归档, false=取消归档 |

**响应示例**

```json
{
  "data": {
    "updatedCount": 2
  }
}
```

---

### 11. 获取归档列表

```
POST /rest/v1/rpc/get_archived
```

**请求头**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `X-Device-ID` | string | 是 | 设备 ID |

**请求体**

```json
{
  "page": 1,
  "limit": 20
}
```

**响应示例**

```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Archived Article",
      "description": "...",
      "category": "Design News",
      "date": "2026-03-27",
      "imageUrl": "https://cdn.defo.com/images/article.jpg",
      "url": "https://...",
      "source": {
        "name": "Designboom",
        "logoUrl": "https://cdn.defo.com/logos/designboom.png"
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "totalPages": 1
  }
}
```

---

## 数据库 Schema

### sources 表

```sql
CREATE TABLE sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('news', 'paper', 'competition')),
    url TEXT NOT NULL,
    logo_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### articles 表

```sql
CREATE TABLE articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID REFERENCES sources(id),
    external_id TEXT,
    title TEXT NOT NULL,
    slug TEXT,
    summary TEXT,
    content TEXT,
    url TEXT NOT NULL,
    image_url TEXT,
    author TEXT,
    published_at TIMESTAMPTZ,
    scraped_at TIMESTAMPTZ DEFAULT NOW(),
    is_archived BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(source_id, external_id)
);
```

### favorites 表

```sql
CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    device_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(article_id, device_id)
);
```

### crawl_logs 表

```sql
CREATE TABLE crawl_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID REFERENCES sources(id),
    status TEXT CHECK (status IN ('running', 'success', 'failed')),
    articles_count INTEGER DEFAULT 0,
    error_message TEXT,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);
```

---

## 索引设计

```sql
-- 全文搜索索引
CREATE INDEX idx_articles_title_trgm ON articles USING gin (title gin_trgm_ops);
CREATE INDEX idx_articles_summary_trgm ON articles USING gin (summary gin_trgm_ops);

-- 时间排序索引
CREATE INDEX idx_articles_published_at ON articles(published_at DESC);

-- 来源 + 时间复合索引
CREATE INDEX idx_articles_source_published ON articles(source_id, published_at DESC);

-- 归档状态索引
CREATE INDEX idx_articles_archived ON articles(is_archived) WHERE is_archived = false;

-- 收藏查询索引
CREATE INDEX idx_favorites_device ON favorites(device_id, created_at DESC);
```

---

## RLS 策略

```sql
-- 启用 RLS
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- 收藏策略：只能查看和操作自己的收藏
CREATE POLICY favorites_own ON favorites
    FOR ALL USING (device_id = current_setting('request.headers', true)::json->>'x-device-id');

-- articles 表：公开读取
CREATE POLICY articles_public_read ON articles
    FOR SELECT USING (true);

-- 归档接口：只能操作自己的归档文章
CREATE POLICY articles_own_archive ON articles
    FOR UPDATE USING (
        is_archived = true
        OR id IN (
            SELECT article_id FROM favorites
            WHERE device_id = current_setting('request.headers', true)::json->>'x-device-id'
        )
    );
```

---

## 速率限制

| 接口 | 限制 |
|------|------|
| 搜索接口 (`/rpc/full_text_search`) | 30 次/分钟 |
| 同步接口 (`/rpc/sync_articles`) | 10 次/分钟 |
| 其他接口 | 100 次/分钟 |

---

## 前端适配层

前端需要使用 `/Users/anthony/Desktop/Defo/frontend/src/services/adapter.ts` 中的适配函数来转换数据。

主要转换：
- `summary` -> `description`
- `published_at` -> `date` (格式化为 YYYY-MM-DD)
- `image_url` -> `imageUrl`
- `type` -> `category` (使用映射表)
- snake_case -> camelCase

---

## 变更日志

| 版本 | 日期 | 说明 |
|------|------|------|
| v1.1.0 | 2026-03-27 | 添加 `get_articles` RPC；更新字段映射文档；补充 category 映射规则 |
| v1.0.1 | 2026-03-27 | 修正 is_favorited 查询方式；统一分页机制；补充错误响应示例；简化认证 Header |
| v1.0.0 | 2026-03-27 | 初始版本 |
