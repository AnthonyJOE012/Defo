import { useParams, useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { ArticleCard } from "../components/ArticleCard";
import { useCollections } from "../contexts/CollectionContext";
import { mockArticles } from "../data/mockArticles";
import { useLanguage } from "../contexts/LanguageContext";
import { useState, useEffect } from "react";
import { getFavoriteArticles } from "../services/collections";

export default function CollectionInternal() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { collections, isLoading } = useCollections();
  const { t } = useLanguage();
  const [favoriteArticleIds, setFavoriteArticleIds] = useState<string[]>([]);

  const collection = collections.find((c) => c.id === id);

  useEffect(() => {
    const loadFavorites = async () => {
      if (id) {
        const ids = await getFavoriteArticles(id);
        setFavoriteArticleIds(ids);
      }
    };
    loadFavorites();
  }, [id]);

  if (isLoading) {
    return (
      <div className="bg-white h-screen w-full flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <p className="font-['Helvetica:Regular',sans-serif] text-[16px] text-gray-500">
            {t("Loading...", "加载中...")}
          </p>
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="bg-white h-screen w-full flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <p className="font-['Helvetica:Regular',sans-serif] text-[20px] text-black mb-6">
            {t("Collection not found", "收藏夹未找到")}
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-black text-white rounded-lg font-['Helvetica:Regular',sans-serif]"
          >
            {t("Go Back", "返回")}
          </button>
        </div>
      </div>
    );
  }

  const collectionArticles = mockArticles.filter((article) =>
    favoriteArticleIds.includes(article.id)
  );

  return (
    <div className="bg-white h-screen w-full flex flex-col overflow-hidden">
      {/* Fixed Header */}
      <div className="flex-shrink-0 px-[18px] pt-[64px] pb-[12px] flex items-center gap-3">
        <button
          onClick={() => navigate("/")}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-['Helvetica:Bold',sans-serif] text-[24px] text-black">
          {t(collection.name, collection.name === "My Library" ? "我的收藏" : collection.name)}
        </h1>
      </div>

      {/* Category filters placeholder */}
      <div className="flex-shrink-0 px-[18px] pb-[18px]">
        <div className="font-['Helvetica:Light',sans-serif] text-[12px] text-black leading-[22px]">
          <span>{t("All info", "全部信息")}</span>
          <span className="mx-[6px]">/</span>
          <span>{t("Design News", "设计新闻")}</span>
          <span className="mx-[6px]">/</span>
          <span>{t("Paper", "论文")}</span>
          <span className="mx-[6px]">/</span>
          <span>{t("Design Award", "设计奖项")}</span>
        </div>
      </div>

      {/* Scrollable Articles */}
      <div className="flex-1 overflow-y-auto px-[17px] pb-[20px]">
        {collectionArticles.length > 0 ? (
          collectionArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="font-['Helvetica:Regular',sans-serif] text-[16px] text-gray-500 mb-4">
              {t("No articles in this collection", "此收藏夹中暂无文章")}
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-black text-white rounded-lg font-['Helvetica:Regular',sans-serif] text-[14px]"
            >
              {t("Browse articles", "浏览文章")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
