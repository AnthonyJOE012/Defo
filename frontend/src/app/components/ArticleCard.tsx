import { Link } from "react-router";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";
import { Article } from "../../services/adapter";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useCollections } from "../contexts/CollectionContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useState, useEffect } from "react";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const { collections, addArticleToCollection, removeArticleFromCollection, getArticleCollections } = useCollections();
  const { t } = useLanguage();
  const [showCollectionMenu, setShowCollectionMenu] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [articleCollections, setArticleCollections] = useState<string[]>([]);

  useEffect(() => {
    const checkFavorite = async () => {
      const cols = await getArticleCollections(article.id);
      setArticleCollections(cols);
      setIsFavorited(cols.length > 0);
    };
    checkFavorite();
  }, [article.id, getArticleCollections]);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowCollectionMenu(!showCollectionMenu);
  };

  const handleAddToCollection = (e: React.MouseEvent, collectionId: string, collectionName: string) => {
    e.preventDefault();
    e.stopPropagation();
    addArticleToCollection(collectionId, article.id);
    setArticleCollections(prev => [...prev, collectionId]);
    setIsFavorited(true);
    setShowCollectionMenu(false);

    toast.success(
      t(
        `Added to ${collectionName}`,
        `已添加到${collectionName === "My Library" ? "我的收藏" : collectionName}`
      ),
      {
        duration: 3000,
        position: "bottom-center",
      }
    );
  };

  const handleRemoveFromCollection = (e: React.MouseEvent, collectionId: string, collectionName: string) => {
    e.preventDefault();
    e.stopPropagation();
    removeArticleFromCollection(collectionId, article.id);
    setArticleCollections(prev => prev.filter(id => id !== collectionId));
    if (articleCollections.length <= 1) {
      setIsFavorited(false);
    }
    setShowCollectionMenu(false);

    toast.success(
      t(
        `Removed from ${collectionName}`,
        `已从${collectionName === "My Library" ? "我的收藏" : collectionName}移除`
      ),
      {
        duration: 3000,
        position: "bottom-center",
      }
    );
  };

  return (
    <div className="relative block mb-[26px]">
      <Link to={`/article/${article.id}`} className="block">
        <div className="h-[302px] w-full">
          {/* Image with bookmark icon */}
          <div className="relative h-[194px] w-full mb-2 overflow-hidden rounded-sm group">
            {article.imageUrl ? (
              <ImageWithFallback
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="bg-[#d9d9d9] h-full w-full" />
            )}

            {/* Bookmark icon - filled if favorited */}
            <button
              onClick={handleBookmarkClick}
              className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-all z-10"
            >
              {isFavorited ? (
                <BookmarkCheck size={20} className="text-black fill-black" />
              ) : (
                <Bookmark size={20} className="text-black" />
              )}
            </button>
          </div>

          {/* Category */}
          <p className="font-['Times_New_Roman:Italic',sans-serif] italic leading-[22px] text-[#474747] text-[14px] mb-[6px]">
            {article.category}
          </p>

          {/* Title */}
          <p className="font-['Helvetica:Regular',sans-serif] leading-[22px] text-[24px] text-black mb-[3px] line-clamp-1">
            {article.title}
          </p>

          {/* Description */}
          <p className="font-['Helvetica:Regular',sans-serif] text-[14px] text-black leading-[22px] line-clamp-2">
            {article.description}
          </p>
        </div>
      </Link>

      {/* Collection menu dropdown */}
      {showCollectionMenu && (
        <>
          {/* Backdrop to close menu */}
          <div
            className="fixed inset-0 z-20"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowCollectionMenu(false);
            }}
          />

          {/* Menu */}
          <div className="absolute right-3 top-[210px] w-[200px] bg-white border border-gray-200 rounded-lg shadow-lg z-30">
            <div className="p-2">
              <p className="px-3 py-2 font-['Helvetica:Bold',sans-serif] text-[12px] text-gray-500 uppercase">
                {t("Save to", "保存到")}
              </p>
              {collections.map((collection) => {
                const isInCollection = articleCollections.includes(collection.id);
                return (
                  <button
                    key={collection.id}
                    onClick={(e) =>
                      isInCollection
                        ? handleRemoveFromCollection(e, collection.id, collection.name)
                        : handleAddToCollection(e, collection.id, collection.name)
                    }
                    className="w-full px-3 py-2 text-left font-['Helvetica:Regular',sans-serif] text-[14px] text-black hover:bg-gray-100 rounded transition-colors flex items-center justify-between"
                  >
                    <span>
                      {t(
                        collection.name,
                        collection.name === "My Library" ? "我的收藏" : collection.name
                      )}
                    </span>
                    {isInCollection && (
                      <BookmarkCheck size={16} className="text-gray-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
