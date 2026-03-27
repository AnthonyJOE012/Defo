import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Bookmark, BookmarkCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { mockArticles } from "../data/mockArticles";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useCollections } from "../contexts/CollectionContext";
import { useLanguage } from "../contexts/LanguageContext";
import { toast } from "sonner";

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { collections, addArticleToCollection, removeArticleFromCollection, getArticleCollections } = useCollections();
  const { t } = useLanguage();
  const [showCollectionMenu, setShowCollectionMenu] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [articleCollections, setArticleCollections] = useState<string[]>([]);

  const article = mockArticles.find((a) => a.id === id);

  useEffect(() => {
    const checkFavorite = async () => {
      if (article?.id) {
        const cols = await getArticleCollections(article.id);
        setArticleCollections(cols);
        setIsFavorited(cols.length > 0);
      }
    };
    checkFavorite();
  }, [article?.id, getArticleCollections]);

  if (!article) {
    return (
      <div className="bg-white h-screen w-full flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <p className="font-['Helvetica:Regular',sans-serif] text-[20px] text-black mb-6">
            Article not found
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-black text-white rounded-lg font-['Helvetica:Regular',sans-serif]"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleToggleCollection = async (collectionId: string, collectionName: string) => {
    const isInCollection = articleCollections.includes(collectionId);
    if (isInCollection) {
      await removeArticleFromCollection(collectionId, article.id);
      setArticleCollections(prev => prev.filter(id => id !== collectionId));
      if (articleCollections.length <= 1) {
        setIsFavorited(false);
      }
      toast.success(
        t(
          `Removed from ${collectionName}`,
          `已从${collectionName === "My Library" ? "我的收藏" : collectionName}移除`
        ),
        { duration: 3000, position: "bottom-center" }
      );
    } else {
      await addArticleToCollection(collectionId, article.id);
      setArticleCollections(prev => [...prev, collectionId]);
      setIsFavorited(true);
      toast.success(
        t(
          `Added to ${collectionName}`,
          `已添加到${collectionName === "My Library" ? "我的收藏" : collectionName}`
        ),
        { duration: 3000, position: "bottom-center" }
      );
    }
    setShowCollectionMenu(false);
  };

  return (
    <div className="bg-white h-screen w-full flex flex-col overflow-hidden">
      {/* Fixed Header */}
      <div className="flex-shrink-0 px-[18px] pt-[64px] pb-[12px] flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="font-['Helvetica:Regular',sans-serif] text-[20px] text-black">
            {t("Article Details", "文章详情")}
          </h1>
        </div>

        {/* Bookmark button - filled if favorited */}
        <div className="relative">
          <button
            onClick={() => setShowCollectionMenu(!showCollectionMenu)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            {isFavorited ? (
              <BookmarkCheck size={24} className="fill-black" />
            ) : (
              <Bookmark size={24} />
            )}
          </button>

          {/* Collection dropdown */}
          {showCollectionMenu && (
            <div className="absolute right-0 top-full mt-2 w-[200px] bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="p-2">
                <p className="px-3 py-2 font-['Helvetica:Bold',sans-serif] text-[12px] text-gray-500 uppercase">
                  {t("Save to", "保存到")}
                </p>
                {collections.map((collection) => {
                  const isInCollection = articleCollections.includes(collection.id);
                  return (
                    <button
                      key={collection.id}
                      onClick={() => handleToggleCollection(collection.id, collection.name)}
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
                <button
                  onClick={() => {
                    setShowCollectionMenu(false);
                    navigate("/collections/manage");
                  }}
                  className="w-full px-3 py-2 text-left font-['Helvetica:Regular',sans-serif] text-[14px] text-gray-500 hover:bg-gray-100 rounded transition-colors mt-1 border-t border-gray-200"
                >
                  {t("+ Manage folders", "+ 管理文件夹")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-[18px] py-[20px]">
        {/* Image */}
        <div className="w-full h-[250px] mb-4 overflow-hidden rounded-lg">
          {article.imageUrl ? (
            <ImageWithFallback
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="bg-[#d9d9d9] h-full w-full" />
          )}
        </div>

        {/* Category and Date */}
        <div className="flex items-center justify-between mb-3">
          <p className="font-['Times_New_Roman:Italic',sans-serif] italic text-[14px] text-[#474747]">
            {article.category}
          </p>
          <p className="font-['Helvetica:Light',sans-serif] text-[12px] text-gray-500">
            {new Date(article.date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Title */}
        <h2 className="font-['Helvetica:Regular',sans-serif] text-[28px] text-black leading-[34px] mb-4">
          {article.title}
        </h2>

        {/* Description */}
        <div className="font-['Helvetica:Regular',sans-serif] text-[16px] text-black leading-[24px] mb-6">
          <p className="mb-4">{article.description}</p>
          <p className="mb-4">
            This article provides comprehensive insights into the topic, exploring various aspects and perspectives.
            The content has been carefully curated to offer valuable information for design professionals and enthusiasts.
          </p>
          <p className="mb-4">
            In the ever-evolving landscape of design, staying informed about the latest trends, research, and awards
            is crucial for maintaining a competitive edge. This platform aggregates the most relevant design information
            from multiple sources, ensuring you never miss important updates.
          </p>
          <p>
            Whether you're looking for inspiration, conducting research, or simply staying current with industry news,
            our daily updates provide the comprehensive coverage you need to excel in your design practice.
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          <span className="px-3 py-1 bg-gray-100 rounded-full font-['Helvetica:Light',sans-serif] text-[12px] text-gray-700">
            Design
          </span>
          <span className="px-3 py-1 bg-gray-100 rounded-full font-['Helvetica:Light',sans-serif] text-[12px] text-gray-700">
            {article.category}
          </span>
          <span className="px-3 py-1 bg-gray-100 rounded-full font-['Helvetica:Light',sans-serif] text-[12px] text-gray-700">
            2026
          </span>
        </div>

        {/* Related Articles Section */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="font-['Helvetica:Bold',sans-serif] text-[18px] text-black mb-4">
            Related Articles
          </h3>
          <p className="font-['Helvetica:Light',sans-serif] text-[14px] text-gray-500">
            More articles from the same category coming soon...
          </p>
        </div>
      </div>
    </div>
  );
}
