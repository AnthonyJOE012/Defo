import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { useCollections } from "../contexts/CollectionContext";
import { useLanguage } from "../contexts/LanguageContext";
import { getFavoriteArticles } from "../services/collections";

export default function ManageCollections() {
  const navigate = useNavigate();
  const { collections, isLoading, addCollection, removeCollection, renameCollection } = useCollections();
  const { t } = useLanguage();

  const [isCreating, setIsCreating] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [collectionArticleCounts, setCollectionArticleCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const loadArticleCounts = async () => {
      const counts: Record<string, number> = {};
      for (const collection of collections) {
        const articles = await getFavoriteArticles(collection.id);
        counts[collection.id] = articles.length;
      }
      setCollectionArticleCounts(counts);
    };
    if (collections.length > 0) {
      loadArticleCounts();
    }
  }, [collections]);

  const handleCreate = async () => {
    if (newCollectionName.trim()) {
      await addCollection(newCollectionName.trim());
      setNewCollectionName("");
      setIsCreating(false);
    }
  };

  const handleStartEdit = (id: string, currentName: string) => {
    setEditingId(id);
    setEditingName(currentName);
  };

  const handleSaveEdit = async () => {
    if (editingId && editingName.trim()) {
      await renameCollection(editingId, editingName.trim());
      setEditingId(null);
      setEditingName("");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t("Are you sure you want to delete this folder?", "确定要删除此文件夹吗？"))) {
      removeCollection(id);
    }
  };

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
          <h1 className="font-['Helvetica:Bold',sans-serif] text-[24px] text-black">
            {t("Manage Collections", "管理收藏夹")}
          </h1>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus size={18} />
          <span className="font-['Helvetica:Regular',sans-serif] text-[14px]">
            {t("New", "新建")}
          </span>
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-[18px] py-[20px]">
        {/* Create new collection form */}
        {isCreating && (
          <div className="mb-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
            <input
              type="text"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              placeholder={t("Folder name", "文件夹名称")}
              className="w-full px-3 py-2 border border-gray-300 rounded mb-3 font-['Helvetica:Regular',sans-serif] text-[16px]"
              autoFocus
              onKeyPress={(e) => e.key === "Enter" && handleCreate()}
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreate}
                className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-['Helvetica:Regular',sans-serif] text-[14px]"
              >
                {t("Create", "创建")}
              </button>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setNewCollectionName("");
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition-colors font-['Helvetica:Regular',sans-serif] text-[14px]"
              >
                {t("Cancel", "取消")}
              </button>
            </div>
          </div>
        )}

        {/* Collections list */}
        <div className="space-y-3">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
            >
              {editingId === collection.id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded font-['Helvetica:Regular',sans-serif] text-[16px]"
                    autoFocus
                    onKeyPress={(e) => e.key === "Enter" && handleSaveEdit()}
                  />
                  <button
                    onClick={handleSaveEdit}
                    className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Check size={18} />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="p-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-['Helvetica:Regular',sans-serif] text-[18px] text-black mb-1">
                      {collection.name}
                      {collection.isDefault && (
                        <span className="ml-2 text-[12px] text-gray-500">
                          ({t("Default", "默认")})
                        </span>
                      )}
                    </h3>
                    <p className="font-['Helvetica:Light',sans-serif] text-[14px] text-gray-500">
                      {collectionArticleCounts[collection.id] || 0} {t("articles", "篇文章")}
                    </p>
                  </div>

                  {!collection.isDefault && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStartEdit(collection.id, collection.name)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} className="text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(collection.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} className="text-red-500" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {collections.length === 1 && !isCreating && (
            <div className="text-center py-12">
              <p className="font-['Helvetica:Light',sans-serif] text-[14px] text-gray-500 mb-4">
                {t("Create custom folders to organize your saved articles", "创建自定义文件夹来整理您保存的文章")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
