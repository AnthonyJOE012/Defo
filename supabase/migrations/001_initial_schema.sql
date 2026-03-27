-- Migration: 001_initial_schema
-- Description: Initial database schema for Defo
--
-- FIELD MAPPING (Database -> API Response):
-- ┌─────────────────────┬─────────────────────┬──────────────────────────────┐
-- │ Database (snake)    │ API Response (camel)│ Notes                        │
-- ├─────────────────────┼─────────────────────┼──────────────────────────────┤
-- │ id                  │ id                  │ UUID (returned as string)    │
-- │ title               │ title               │                              │
-- │ summary             │ description         │ Renamed for API clarity      │
-- │ type                │ category            │ Mapped: news→Design News,    │
-- │                     │                     │ paper→Paper,                 │
-- │                     │                     │ competition→Design Award     │
-- │ published_at        │ date                │ YYYY-MM-DD format            │
-- │ image_url           │ imageUrl            │                              │
-- └─────────────────────┴─────────────────────┴──────────────────────────────┘

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================
-- SOURCES TABLE
-- ============================================
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

-- Index for slug lookups
CREATE INDEX idx_sources_slug ON sources(slug);
-- Index for type filtering
CREATE INDEX idx_sources_type ON sources(type);
-- Index for active status filtering
CREATE INDEX idx_sources_active ON sources(is_active) WHERE is_active = true;

-- ============================================
-- ARTICLES TABLE
-- ============================================
CREATE TABLE articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID REFERENCES sources(id) ON DELETE SET NULL,
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

-- Full text search indexes (GIN trigram indexes for fuzzy search)
CREATE INDEX idx_articles_title_trgm ON articles USING gin (title gin_trgm_ops);
CREATE INDEX idx_articles_summary_trgm ON articles USING gin (summary gin_trgm_ops);

-- Time sorting index (most recent first)
CREATE INDEX idx_articles_published_at ON articles(published_at DESC NULLS LAST);

-- Source + time compound index (for source-specific article queries)
CREATE INDEX idx_articles_source_published ON articles(source_id, published_at DESC NULLS LAST);

-- Partial index for non-archived articles (common query pattern)
CREATE INDEX idx_articles_archived ON articles(is_archived) WHERE is_archived = false;

-- Index for external_id lookups
CREATE INDEX idx_articles_external_id ON articles(external_id) WHERE external_id IS NOT NULL;

-- Index for scraped_at (sync operations)
CREATE INDEX idx_articles_scraped_at ON articles(scraped_at DESC);

-- ============================================
-- FAVORITES TABLE
-- ============================================
CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    device_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(article_id, device_id)
);

-- Index for device-based favorite queries (most recent first)
CREATE INDEX idx_favorites_device ON favorites(device_id, created_at DESC);
-- Index for article_id lookups (used in cascade delete and checks)
CREATE INDEX idx_favorites_article ON favorites(article_id);

-- ============================================
-- CRAWL_LOGS TABLE
-- ============================================
CREATE TABLE crawl_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID REFERENCES sources(id) ON DELETE SET NULL,
    status TEXT CHECK (status IN ('running', 'success', 'failed')),
    articles_count INTEGER DEFAULT 0,
    error_message TEXT,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Index for source_id lookups
CREATE INDEX idx_crawl_logs_source ON crawl_logs(source_id);
-- Index for status filtering
CREATE INDEX idx_crawl_logs_status ON crawl_logs(status);
-- Index for started_at (recent logs first)
CREATE INDEX idx_crawl_logs_started ON crawl_logs(started_at DESC);

-- ============================================
-- TRIGGER: updated_at auto-update
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_sources_updated_at
    BEFORE UPDATE ON sources
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at
    BEFORE UPDATE ON articles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to get device ID from request headers (with safe fallback)
CREATE OR REPLACE FUNCTION get_device_id()
RETURNS TEXT AS $$
BEGIN
    RETURN NULLIF(current_setting('request.headers', true)::json->>'x-device-id', '');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to map source type to frontend category
-- news -> "Design News"
-- paper -> "Paper"
-- competition -> "Design Award"
CREATE OR REPLACE FUNCTION map_type_to_category(p_type TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN CASE p_type
        WHEN 'news' THEN 'Design News'
        WHEN 'paper' THEN 'Paper'
        WHEN 'competition' THEN 'Design Award'
        ELSE p_type
    END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to format published_at as YYYY-MM-DD for frontend
CREATE OR REPLACE FUNCTION format_article_date(published_at TIMESTAMPTZ)
RETURNS TEXT AS $$
BEGIN
    RETURN TO_CHAR(published_at, 'YYYY-MM-DD');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================
-- RPC: Get articles with field mapping for frontend
-- ============================================
CREATE OR REPLACE FUNCTION get_articles(
    p_page INTEGER DEFAULT 1,
    p_limit INTEGER DEFAULT 20,
    p_type TEXT DEFAULT NULL,
    p_days INTEGER DEFAULT NULL,
    p_source_id UUID DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_offset INTEGER;
    v_total INTEGER;
    v_total_pages INTEGER;
    v_where_clause TEXT;
    v_articles JSONB;
BEGIN
    -- Calculate offset
    v_offset := (p_page - 1) * p_limit;

    -- Build WHERE clause
    v_where_clause := ' WHERE is_archived = false';

    IF p_type IS NOT NULL THEN
        v_where_clause := v_where_clause || ' AND s.type = ''' || p_type || '''';
    END IF;

    IF p_days IS NOT NULL THEN
        v_where_clause := v_where_clause || ' AND a.published_at >= NOW() - INTERVAL ''' || p_days || ' days''';
    END IF;

    IF p_source_id IS NOT NULL THEN
        v_where_clause := v_where_clause || ' AND a.source_id = ''' || p_source_id || '''';
    END IF;

    -- Get total count
    EXECUTE 'SELECT COUNT(*) FROM articles a LEFT JOIN sources s ON a.source_id = s.id' || v_where_clause INTO v_total;

    -- Calculate total pages
    v_total_pages := CEIL(v_total::NUMERIC / p_limit);

    -- Get articles with mapped fields
    EXECUTE format(
        'SELECT COALESCE(jsonb_agg(row_to_json(t)), ''[]''::jsonb) FROM (
            SELECT
                a.id::text,
                a.title,
                a.summary AS description,
                map_type_to_category(s.type) AS category,
                format_article_date(a.published_at) AS date,
                a.image_url AS "imageUrl",
                a.url,
                a.author,
                a.slug,
                jsonb_build_object(
                    ''id'', s.id::text,
                    ''name'', s.name,
                    ''slug'', s.slug,
                    ''logoUrl'', s.logo_url,
                    ''type'', s.type
                ) AS source
            FROM articles a
            LEFT JOIN sources s ON a.source_id = s.id
            %s
            ORDER BY a.published_at DESC NULLS LAST
            LIMIT %s OFFSET %s
        ) t',
        v_where_clause,
        p_limit,
        v_offset
    ) INTO v_articles;

    RETURN jsonb_build_object(
        'data', COALESCE(v_articles, '[]'::jsonb),
        'meta', jsonb_build_object(
            'page', p_page,
            'limit', p_limit,
            'total', v_total,
            'totalPages', v_total_pages
        )
    );
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on tables that need access control
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Favorites policy: users can only see and manage their own favorites
-- Device ID comes from X-Device-ID header, accessed via request.headers setting
CREATE POLICY favorites_own ON favorites
    FOR ALL
    USING (
        device_id = COALESCE(
            NULLIF(current_setting('request.headers', true)::json->>'x-device-id', ''),
            NULLIF(current_setting('request.headers', true)::json->>'x-device-id', '')
        )
    )
    WITH CHECK (
        device_id = COALESCE(
            NULLIF(current_setting('request.headers', true)::json->>'x-device-id', ''),
            NULLIF(current_setting('request.headers', true)::json->>'x-device-id', '')
        )
    );

-- Articles policy: public read access for all authenticated requests
CREATE POLICY articles_public_read ON articles
    FOR SELECT
    USING (true);

-- Articles policy: users can only archive/unarchive their favorited articles
-- A user can only update is_archived if they have favorited the article
CREATE POLICY articles_own_archive ON articles
    FOR UPDATE
    USING (
        -- Allow if article is already archived
        is_archived = true
        -- Or allow if user has favorited this article
        OR EXISTS (
            SELECT 1 FROM favorites f
            WHERE f.article_id = articles.id
            AND f.device_id = COALESCE(
                NULLIF(current_setting('request.headers', true)::json->>'x-device-id', ''),
                NULLIF(current_setting('request.headers', true)::json->>'x-device-id', '')
            )
        )
    )
    WITH CHECK (
        is_archived = true
        OR EXISTS (
            SELECT 1 FROM favorites f
            WHERE f.article_id = articles.id
            AND f.device_id = COALESCE(
                NULLIF(current_setting('request.headers', true)::json->>'x-device-id', ''),
                NULLIF(current_setting('request.headers', true)::json->>'x-device-id', '')
            )
        )
    );

-- Function to check if a device has favorited an article
CREATE OR REPLACE FUNCTION is_article_favorited(p_article_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM favorites
        WHERE article_id = p_article_id
        AND device_id = get_device_id()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
