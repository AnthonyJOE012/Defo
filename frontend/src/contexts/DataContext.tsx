import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useOffline } from '../hooks/useOffline';
import { syncArticles, getLocalArticles } from '../services/sync';
import { LocalArticle } from '../lib/db';

interface DataContextType {
  articles: LocalArticle[];
  isLoading: boolean;
  isSyncing: boolean;
  isOffline: boolean;
  lastSyncAt: Date | null;
  error: string | null;
  refresh: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const isOffline = useOffline();
  const [articles, setArticles] = useState<LocalArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncAt, setLastSyncAt] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadLocalData = async () => {
    try {
      const localArticles = await getLocalArticles();
      setArticles(localArticles);
    } catch (err) {
      console.error('Failed to load local data:', err);
    }
  };

  const sync = async () => {
    if (isOffline) return;

    setIsSyncing(true);
    setError(null);

    try {
      const result = await syncArticles();
      if (result.success) {
        await loadLocalData();
        setLastSyncAt(new Date());
      } else {
        setError(result.error || 'Sync failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sync failed');
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await loadLocalData();
      await sync();
      setIsLoading(false);
    };

    init();
  }, []);

  // Auto-sync when network recovers
  useEffect(() => {
    if (!isOffline && lastSyncAt) {
      sync();
    }
  }, [isOffline]);

  return (
    <DataContext.Provider value={{
      articles,
      isLoading,
      isSyncing,
      isOffline,
      lastSyncAt,
      error,
      refresh: sync
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}