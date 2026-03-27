import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  getCollections,
  createCollection as createCollectionDB,
  deleteCollection as deleteCollectionDB,
  renameCollection as renameCollectionDB,
  addToCollection as addToCollectionDB,
  removeFromCollection as removeFromCollectionDB,
  initializeDefaultCollection,
} from "../../services/collections";
import { LocalCollection } from "../../lib/db";

interface CollectionContextType {
  collections: LocalCollection[];
  isLoading: boolean;
  addCollection: (name: string) => Promise<void>;
  removeCollection: (id: string) => Promise<void>;
  renameCollection: (id: string, newName: string) => Promise<void>;
  addArticleToCollection: (collectionId: string, articleId: string) => Promise<void>;
  removeArticleFromCollection: (collectionId: string, articleId: string) => Promise<void>;
  isArticleFavorited: (articleId: string) => Promise<boolean>;
  getArticleCollections: (articleId: string) => Promise<string[]>;
}

const CollectionContext = createContext<CollectionContextType | undefined>(undefined);

export function CollectionProvider({ children }: { children: ReactNode }) {
  const [collections, setCollections] = useState<LocalCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize and load collections from IndexedDB
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await initializeDefaultCollection();
      const localCollections = await getCollections();
      setCollections(localCollections);
      setIsLoading(false);
    };
    init();
  }, []);

  const loadCollections = async () => {
    const localCollections = await getCollections();
    setCollections(localCollections);
  };

  const addCollection = async (name: string) => {
    await createCollectionDB(name);
    await loadCollections();
  };

  const removeCollection = async (id: string) => {
    await deleteCollectionDB(id);
    await loadCollections();
  };

  const renameCollection = async (id: string, newName: string) => {
    await renameCollectionDB(id, newName);
    await loadCollections();
  };

  const addArticleToCollection = async (collectionId: string, articleId: string) => {
    await addToCollectionDB(collectionId, articleId);
  };

  const removeArticleFromCollection = async (collectionId: string, articleId: string) => {
    await removeFromCollectionDB(collectionId, articleId);
  };

  const isArticleFavorited = async (articleId: string) => {
    const { isArticleFavorited: checkFavorite } = await import("../../services/collections");
    return checkFavorite(articleId);
  };

  const getArticleCollections = async (articleId: string) => {
    const { getArticleCollections: getCollections } = await import("../../services/collections");
    return getCollections(articleId);
  };

  return (
    <CollectionContext.Provider
      value={{
        collections,
        isLoading,
        addCollection,
        removeCollection,
        renameCollection,
        addArticleToCollection,
        removeArticleFromCollection,
        isArticleFavorited,
        getArticleCollections,
      }}
    >
      {children}
    </CollectionContext.Provider>
  );
}

export function useCollections() {
  const context = useContext(CollectionContext);
  if (!context) {
    throw new Error("useCollections must be used within a CollectionProvider");
  }
  return context;
}
