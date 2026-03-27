# Supabase 规范

> Defo 数据库设计规范

## 迁移文件

```
supabase/
└── migrations/
    ├── 001_initial_schema.sql
    ├── 002_rls_policies.sql
    ├── 003_search_functions.sql
    └── 004_indexes.sql
```

## 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 表 | snake_case, 复数 | `articles`, `favorites` |
| 列 | snake_case | `published_at`, `source_id` |
| 索引 | `idx_<table>_<column>` | `idx_articles_published_at` |
| 外键 | `fk_<table>_<referenced>` | `fk_articles_source` |

## Schema 设计

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

## 索引设计

```sql
-- 全文搜索
CREATE INDEX idx_articles_title_trgm ON articles USING gin (title gin_trgm_ops);
CREATE INDEX idx_articles_summary_trgm ON articles USING gin (summary gin_trgm_ops);

-- 时间排序
CREATE INDEX idx_articles_published_at ON articles(published_at DESC);

-- 来源 + 时间
CREATE INDEX idx_articles_source_published ON articles(source_id, published_at DESC);

-- 归档过滤
CREATE INDEX idx_articles_archived ON articles(is_archived) WHERE is_archived = false;

-- 收藏查询
CREATE INDEX idx_favorites_device ON favorites(device_id, created_at DESC);
```

## RLS 策略

```sql
-- 启用 RLS
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- 收藏：只能操作自己的
CREATE POLICY favorites_own ON favorites
    FOR ALL USING (device_id = current_setting('request.headers', true)::json->>'x-device-id');

-- 文章：公开读取
CREATE POLICY articles_public_read ON articles
    FOR SELECT USING (true);

-- 文章更新：只能操作归档状态
CREATE POLICY articles_own_archive ON articles
    FOR UPDATE USING (
        is_archived = true
        OR id IN (
            SELECT article_id FROM favorites
            WHERE device_id = current_setting('request.headers', true)::json->>'x-device-id'
        )
    );
```

## RPC 函数

### 全文搜索

```sql
CREATE OR REPLACE FUNCTION full_text_search(
    query TEXT,
    type_filter TEXT DEFAULT NULL,
    limit_count INTEGER DEFAULT 20,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE(...) AS $$
BEGIN
    RETURN QUERY
    SELECT ...
    FROM articles
    WHERE
        (type_filter IS NULL OR source_id IN (SELECT id FROM sources WHERE type = type_filter))
        AND (
            title ILIKE '%' || query || '%'
            OR summary ILIKE '%' || query || '%'
        )
    ORDER BY published_at DESC
    LIMIT limit_count OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;
```

### 增量同步

```sql
CREATE OR REPLACE FUNCTION sync_articles(
    last_sync_at TIMESTAMPTZ DEFAULT NULL
)
RETURNS TABLE(...) AS $$
BEGIN
    RETURN QUERY
    SELECT ...
    FROM articles
    WHERE
        (last_sync_at IS NULL OR updated_at > last_sync_at)
    ORDER BY updated_at DESC;
END;
$$ LANGUAGE plpgsql;
```

## 迁移执行

```bash
# 本地 Supabase
supabase db push

# CI/CD
supabase db push --db-url $DATABASE_URL
```

## 数据清理

30 天未归档数据自动清理（通过 cron job）：

```sql
DELETE FROM articles
WHERE
    is_archived = false
    AND created_at < NOW() - INTERVAL '30 days';
```
