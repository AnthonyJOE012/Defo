// Collection (bookmark folder) types and data
export interface Collection {
  id: string;
  name: string;
  isDefault: boolean; // true for "My Library"
  articleIds: string[];
  createdAt: string;
}

// Default collections
export const defaultCollections: Collection[] = [
  {
    id: "my-library",
    name: "My Library",
    isDefault: true,
    articleIds: [],
    createdAt: "2026-03-01T00:00:00Z",
  },
];

// Helper functions for collection management
export function createCollection(name: string): Collection {
  return {
    id: `collection-${Date.now()}`,
    name,
    isDefault: false,
    articleIds: [],
    createdAt: new Date().toISOString(),
  };
}

export function addArticleToCollection(
  collection: Collection,
  articleId: string
): Collection {
  if (collection.articleIds.includes(articleId)) {
    return collection;
  }
  return {
    ...collection,
    articleIds: [...collection.articleIds, articleId],
  };
}

export function removeArticleFromCollection(
  collection: Collection,
  articleId: string
): Collection {
  return {
    ...collection,
    articleIds: collection.articleIds.filter((id) => id !== articleId),
  };
}
