/**
 * useArticles Hook
 *
 * TanStack Query hook for fetching articles from Supabase.
 */

import { useQuery } from '@tanstack/react-query';
import { fetchArticles, searchArticles, ArticlesQueryParams, ArticlesResponse } from '../services/articles';
import { Article } from '../services/adapter';

export interface UseArticlesOptions extends ArticlesQueryParams {
  enabled?: boolean;
}

export interface UseArticlesResult {
  articles: Article[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  refetch: () => void;
}

export function useArticles(options: UseArticlesOptions = {}): UseArticlesResult {
  const { enabled = true, ...params } = options;

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<ArticlesResponse>({
    queryKey: ['articles', params],
    queryFn: () => fetchArticles(params),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });

  return {
    articles: data?.articles || [],
    isLoading,
    isError,
    error: error as Error | null,
    meta: data?.meta || {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0,
    },
    refetch,
  };
}

export interface UseSearchArticlesOptions extends ArticlesQueryParams {
  query: string;
  enabled?: boolean;
}

export interface UseSearchArticlesResult {
  articles: Article[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useSearchArticles(
  options: UseSearchArticlesOptions
): UseSearchArticlesResult {
  const { query, enabled = true, ...params } = options;

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<ArticlesResponse>({
    queryKey: ['articles', 'search', { query, ...params }],
    queryFn: () => searchArticles(query, params),
    enabled: enabled && query.length > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    articles: data?.articles || [],
    isLoading,
    isError,
    error: error as Error | null,
    refetch,
  };
}
