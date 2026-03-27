import { db, LocalArticle } from '../lib/db';
import { fetchArticles } from './articles';
import { transformArticle } from './adapter';

export interface SyncResult {
  success: boolean;
  articlesCount: number;
  error?: string;
}

export async function syncArticles(): Promise<SyncResult> {
  try {
    // Get last sync time
    const meta = await db.syncMeta.get('last-sync');
    const lastSyncAt = meta?.lastSyncAt;

    // Fetch incremental data from API
    const response = await fetchArticles({
      page: 1,
      limit: 100,
      ...(lastSyncAt && { days: Math.ceil((Date.now() - lastSyncAt.getTime()) / (1000 * 60 * 60 * 24)) })
    });

    // Transform and store locally
    const localArticles: LocalArticle[] = response.articles.map(article => ({
      ...article,
      sourceId: '', // TODO: Extract source_id from article if available
      syncedAt: new Date()
    }));

    await db.articles.bulkPut(localArticles);

    // Update sync metadata
    await db.syncMeta.put({
      id: 'last-sync',
      lastSyncAt: new Date(),
      syncStatus: 'idle'
    });

    return {
      success: true,
      articlesCount: localArticles.length
    };
  } catch (error) {
    return {
      success: false,
      articlesCount: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function getLocalArticles(category?: string, limit = 50): Promise<LocalArticle[]> {
  if (category) {
    return await db.articles
      .where('category').equals(category)
      .reverse()
      .limit(limit)
      .toArray();
  }

  return await db.articles
    .orderBy('date')
    .reverse()
    .limit(limit)
    .toArray();
}

export async function clearOldArticles(daysOld = 30): Promise<number> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  const oldArticles = await db.articles
    .where('syncedAt').below(cutoffDate)
    .toArray();

  await db.articles.bulkDelete(oldArticles.map(a => a.id));

  return oldArticles.length;
}