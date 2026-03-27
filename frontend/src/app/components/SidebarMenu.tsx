import { useState } from "react";
import { useNavigate } from "react-router";
import { useLanguage } from "../contexts/LanguageContext";
import { useCollections } from "../contexts/CollectionContext";

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SidebarMenu({ isOpen, onClose }: SidebarMenuProps) {
  const navigate = useNavigate();
  const { language, toggleLanguage, t } = useLanguage();
  const { collections, removeCollection } = useCollections();
  const [longPressCollection, setLongPressCollection] = useState<string | null>(null);
  const [longPressTimer, setLongPressTimer] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleNavigateCollection = (collectionId: string) => {
    navigate(`/collection/${collectionId}`);
    onClose();
  };

  const handleManageCollections = () => {
    navigate("/collections/manage");
    onClose();
  };

  const handleNavigateAbout = () => {
    navigate("/about");
    onClose();
  };

  const handleLongPressStart = (collectionId: string, isDefault: boolean) => {
    if (isDefault) return; // Don't allow long press on default collections
    
    const timer = setTimeout(() => {
      setLongPressCollection(collectionId);
    }, 500); // 500ms long press
    setLongPressTimer(timer);
  };

  const handleLongPressEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleDeleteCollection = (collectionId: string) => {
    removeCollection(collectionId);
    setLongPressCollection(null);
  };

  return (
    <>
      {/* Backdrop - clicking closes sidebar */}
      <div
        className={`fixed inset-0 bg-transparent z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Black sidebar menu */}
      <div className={`fixed top-0 right-0 h-full w-[303px] bg-[#0f0f0f] z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full px-[25px] py-[107px] overflow-y-auto">
          {/* Setting title - Bold */}
          <h2 className="font-['Helvetica:Bold',sans-serif] text-[24px] text-white leading-[22px] mb-[85px]">
            {t("Setting", "设置")}
          </h2>

          {/* Language toggle - Regular */}
          <button
            onClick={toggleLanguage}
            className="font-['Helvetica:Regular',sans-serif] text-[24px] text-white leading-[22px] mb-[42px] text-left hover:opacity-70 transition-opacity"
          >
            {language === "en" ? "Eng / 中" : "中 / Eng"}
          </button>

          {/* Collection section - no expand/collapse */}
          <div className="mb-[42px]">
            <h3 className="font-['Helvetica:Regular',sans-serif] text-[24px] text-white leading-[22px] mb-[36px]">
              {t("Collection", "收藏")}
            </h3>

            {/* Collection list - always visible */}
            <div className="space-y-[36px]">
              {collections.map((collection) => (
                <button
                  key={collection.id}
                  onMouseDown={() => handleLongPressStart(collection.id, collection.isDefault)}
                  onMouseUp={handleLongPressEnd}
                  onMouseLeave={handleLongPressEnd}
                  onTouchStart={() => handleLongPressStart(collection.id, collection.isDefault)}
                  onTouchEnd={handleLongPressEnd}
                  onClick={() => handleNavigateCollection(collection.id)}
                  className="block font-['Helvetica:Regular',sans-serif] text-[16px] text-white leading-[22px] hover:opacity-70 transition-opacity text-left w-full"
                >
                  {t(collection.name, collection.name === "My Library" ? "我的收藏" : collection.name)}
                  {collection.articleIds.length > 0 && (
                    <span className="ml-2 text-[14px] opacity-60">
                      ({collection.articleIds.length})
                    </span>
                  )}
                </button>
              ))}

              {/* Manage collections button */}
              <button
                onClick={handleManageCollections}
                className="block font-['Helvetica:Regular',sans-serif] text-[16px] text-white leading-[22px] hover:opacity-70 transition-opacity text-left w-full opacity-60"
              >
                {t("+ Manage Folders", "+ 管理文件夹")}
              </button>
            </div>
          </div>

          {/* About US - Regular */}
          <button
            onClick={handleNavigateAbout}
            className="font-['Helvetica:Regular',sans-serif] text-[24px] text-white leading-[22px] text-left hover:opacity-70 transition-opacity"
          >
            {t("About US", "关于我们")}
          </button>
        </div>
      </div>

      {/* Delete confirmation panel */}
      {longPressCollection && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-[60]"
            onClick={() => setLongPressCollection(null)}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 z-[70] w-[280px] shadow-2xl">
            <h3 className="font-['Helvetica:Bold',sans-serif] text-[18px] text-black mb-3">
              {t("Delete Folder?", "删除文件夹？")}
            </h3>
            <p className="font-['Helvetica:Regular',sans-serif] text-[14px] text-gray-600 mb-6">
              {t(
                "This folder and its contents will be permanently deleted.",
                "此文件夹及其内容将被永久删除。"
              )}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setLongPressCollection(null)}
                className="flex-1 px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition-colors font-['Helvetica:Regular',sans-serif] text-[14px]"
              >
                {t("Cancel", "取消")}
              </button>
              <button
                onClick={() => handleDeleteCollection(longPressCollection)}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-['Helvetica:Regular',sans-serif] text-[14px]"
              >
                {t("Delete", "删除")}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}