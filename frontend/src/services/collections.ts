/**
 * Collections Service
 *
 * Provides functions to manage collections (bookmark folders) and favorites
 * using IndexedDB for persistence.
 */

import { db, LocalCollection } from '../lib/db';

const DEFAULT_COLLECTION_ID = 'my-library';
const DEFAULT_COLLECTION_NAME = 'My Library';

/**
 * Initialize default collection if not exists
 */
export async function initializeDefaultCollection(): Promise<void> {
  const existing = await db.collections.get(DEFAULT_COLLECTION_ID);
  if (!existing) {
    await db.collections.add({
      id: DEFAULT_COLLECTION_ID,
      name: DEFAULT_COLLECTION_NAME,
      isDefault: true,
      createdAt: new Date('2026-03-01T00:00:00Z'),
      articleIds: []
    });
  }
}

/**
 * Get all collections
 */
export async function getCollections(): Promise<LocalCollection[]> {
  return await db.collections.toArray();
}

/**
 * Create a new collection
 */
export async function createCollection(name: string): Promise<string> {
  const id = `collection-${Date.now()}`;
  await db.collections.add({
    id,
    name,
    isDefault: false,
    createdAt: new Date(),
    articleIds: []
  });
  return id;
}

/**
 * Delete a collection and all its favorites
 */
export async function deleteCollection(id: string): Promise<void> {
  // Don't delete default collection
  const collection = await db.collections.get(id);
  if (collection?.isDefault) {
    return;
  }

  await db.transaction('rw', db.collections, db.favorites, async () => {
    await db.favorites.where('collectionId').equals(id).delete();
    await db.collections.delete(id);
  });
}

/**
 * Rename a collection
 */
export async function renameCollection(id: string, newName: string): Promise<void> {
  await db.collections.update(id, { name: newName });
}

/**
 * Add an article to a collection
 */
export async function addToCollection(collectionId: string, articleId: string): Promise<void> {
  const id = `${collectionId}-${articleId}`;
  const existing = await db.favorites.get(id);
  if (!existing) {
    await db.favorites.add({
      id,
      collectionId,
      articleId,
      createdAt: new Date()
    });
  }
}

/**
 * Remove an article from a collection
 */
export async function removeFromCollection(collectionId: string, articleId: string): Promise<void> {
  const id = `${collectionId}-${articleId}`;
  await db.favorites.delete(id);
}

/**
 * Get all article IDs in a collection
 */
export async function getFavoriteArticles(collectionId: string): Promise<string[]> {
  const favorites = await db.favorites
    .where('collectionId')
    .equals(collectionId)
    .toArray();
  return favorites.map(f => f.articleId);
}

/**
 * Check if an article is favorited in any collection
 */
export async function isArticleFavorited(articleId: string): Promise<boolean> {
  const count = await db.favorites.where('articleId').equals(articleId).count();
  return count > 0;
}

/**
 * Check if an article is in a specific collection
 */
export async function isArticleInCollection(collectionId: string, articleId: string): Promise<boolean> {
  const id = `${collectionId}-${articleId}`;
  const favorite = await db.favorites.get(id);
  return !!favorite;
}

/**
 * Get all collections that contain a specific article
 */
export async function getArticleCollections(articleId: string): Promise<string[]> {
  const favorites = await db.favorites
    .where('articleId')
    .equals(articleId)
    .toArray();
  return favorites.map(f => f.collectionId);
}
