/**
 * useArticle Hook
 *
 * TanStack Query hook for fetching a single article by ID.
 */

import { useQuery } from '@tanstack/react-query';
import { fetchArticleById } from '../services/articles';
import { Article } from '../services/adapter';

export interface UseArticleResult {
  article: Article | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export function useArticle(id: string): UseArticleResult {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['article', id],
    queryFn: () => fetchArticleById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  return {
    article: data || null,
    isLoading,
    isError,
    error: error as Error | null,
  };
}
