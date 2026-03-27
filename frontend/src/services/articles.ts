/**
 * Articles API Service
 *
 * Provides functions to fetch articles from Supabase using RPC calls.
 */

import { supabase } from './supabase';
import {
  Article,
  transformArticle,
  ApiMeta,
} from './adapter';

export interface ArticlesQueryParams {
  page?: number;
  limit?: number;
  type?: 'news' | 'paper' | 'competition';
  category?: Article['category'];
  days?: number;
  sourceId?: string;
}

export interface ArticlesResponse {
  articles: Article[];
  meta: ApiMeta;
}

/**
 * Convert category to type for API
 */
function categoryToType(category: Article['category']): string {
  const mapping: Record<string, string> = {
    'Design News': 'news',
    'Paper': 'paper',
    'Design Award': 'competition',
  };
  return mapping[category] || 'news';
}

/**
 * Fetch articles from Supabase RPC
 */
export async function fetchArticles(
  params: ArticlesQueryParams = {}
): Promise<ArticlesResponse> {
  const { page = 1, limit = 20, type, category, days, sourceId } = params;

  // Determine the type filter
  const typeFilter = type || (category ? categoryToType(category) : undefined);

  const { data, error } = await supabase.rpc('get_articles', {
    p_page: page,
    p_limit: limit,
    p_type: typeFilter || null,
    p_days: days || null,
    p_source_id: sourceId || null,
  });

  if (error) {
    throw new Error(`Failed to fetch articles: ${error.message}`);
  }

  // Handle the RPC response - it returns an object with data and meta
  const response = data as {
    data: unknown[];
    meta: ApiMeta;
  };

  const articles = (response.data || []).map((item) =>
    transformArticle(item as Parameters<typeof transformArticle>[0])
  );

  return {
    articles,
    meta: response.meta || {
      page,
      limit,
      total: 0,
      totalPages: 0,
    },
  };
}

/**
 * Search articles using full-text search RPC
 */
export async function searchArticles(
  query: string,
  params: ArticlesQueryParams = {}
): Promise<ArticlesResponse> {
  const { page = 1, limit = 20, type, category, days } = params;

  // Determine the type filter
  const typeFilter = type || (category ? categoryToType(category) : undefined);

  const { data, error } = await supabase.rpc('full_text_search', {
    p_query: query,
    p_type: typeFilter || null,
    p_limit: limit,
    p_offset: (page - 1) * limit,
    p_days: days || null,
  });

  if (error) {
    throw new Error(`Failed to search articles: ${error.message}`);
  }

  // Handle the search response
  const response = data as {
    data: unknown[];
    meta: ApiMeta;
  };

  const articles = (response.data || []).map((item) =>
    transformArticle(item as Parameters<typeof transformArticle>[0])
  );

  return {
    articles,
    meta: response.meta || {
      page,
      limit,
      total: 0,
      totalPages: 0,
    },
  };
}

/**
 * Get available dates with articles (for calendar)
 */
export async function getDatesWithArticles(
  days: number = 30
): Promise<string[]> {
  const { data, error } = await supabase.rpc('get_article_dates', {
    p_days: days,
  });

  if (error) {
    console.error('Failed to fetch article dates:', error);
    return [];
  }

  return (data || []) as string[];
}

/**
 * Fetch a single article by ID
 */
export async function fetchArticleById(id: string): Promise<Article | null> {
  const { data, error } = await supabase
    .from('articles')
    .select('*, source:source_id(id, name, slug, logo_url, type)')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Failed to fetch article:', error);
    return null;
  }

  if (!data) return null;

  return transformArticle(data);
}
