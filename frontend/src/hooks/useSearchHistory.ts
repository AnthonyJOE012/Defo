/**
 * useSearchHistory Hook
 *
 * Manages local search history stored in IndexedDB.
 */

import { useState, useEffect, useCallback } from 'react';
import { db, SearchHistory } from '../lib/db';

export function useSearchHistory(limit = 10) {
  const [history, setHistory] = useState<SearchHistory[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const recent = await db.searchHistory
      .orderBy('searchedAt')
      .reverse()
      .limit(limit)
      .toArray();
    setHistory(recent);
  };

  const addToHistory = useCallback(async (query: string) => {
    if (!query.trim()) return;
    await db.searchHistory.add({
      query: query.trim(),
      searchedAt: new Date()
    });
    await loadHistory();
  }, []);

  const clearHistory = useCallback(async () => {
    await db.searchHistory.clear();
    setHistory([]);
  }, []);

  const removeFromHistory = useCallback(async (id: number) => {
    await db.searchHistory.delete(id);
    await loadHistory();
  }, []);

  return { history, addToHistory, clearHistory, removeFromHistory };
}
