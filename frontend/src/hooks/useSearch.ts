/**
 * useSearch Hook
 *
 * Search hook with debounce support for article search.
 */

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchArticles, ArticlesQueryParams } from '../services/articles';
import { Article } from '../services/adapter';

export function useSearch() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce processing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => searchArticles(debouncedQuery) as Promise<{ articles: Article[] }>,
    enabled: debouncedQuery.length > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const results = data?.articles || [];

  return {
    query,
    setQuery,
    results,
    isLoading,
    error: error as Error | null,
    hasResults: results.length > 0,
  };
}
