import Dexie, { Table } from 'dexie';

export interface LocalArticle {
  id: string;
  title: string;
  description: string;
  category: "Design News" | "Paper" | "Design Award";
  date: string;
  imageUrl: string;
  sourceId: string;
  syncedAt: Date;
}

export interface SyncMeta {
  id: string;
  lastSyncAt: Date;
  syncStatus: 'idle' | 'syncing' | 'error';
}

export interface SearchHistory {
  id?: number;
  query: string;
  searchedAt: Date;
}

export interface LocalCollection {
  id: string;
  name: string;
  isDefault: boolean;
  createdAt: Date;
  articleIds: string[];
}

export interface LocalFavorite {
  id: string;
  articleId: string;
  collectionId: string;
  createdAt: Date;
}

export class DefoDatabase extends Dexie {
  articles!: Table<LocalArticle>;
  syncMeta!: Table<SyncMeta>;
  searchHistory!: Table<SearchHistory>;
  collections!: Table<LocalCollection>;
  favorites!: Table<LocalFavorite>;

  constructor() {
    super('DefoDB');
    this.version(2).stores({
      articles: 'id, category, date, sourceId, syncedAt',
      syncMeta: 'id',
      searchHistory: '++id, query, searchedAt',
      collections: 'id, name',
      favorites: 'id, articleId, collectionId'
    });
  }
}

export const db = new DefoDatabase();