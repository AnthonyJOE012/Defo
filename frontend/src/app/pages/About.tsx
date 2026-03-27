import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

export default function About() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  return (
    <div className="bg-white h-screen w-full flex flex-col overflow-hidden">
      {/* Fixed Header */}
      <div className="flex-shrink-0 px-[18px] pt-[64px] pb-[12px] flex items-center gap-3 border-b border-gray-200">
        <button
          onClick={() => navigate("/")}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-['Helvetica:Bold',sans-serif] text-[24px] text-black">
          {t("About US", "关于我们")}
        </h1>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-[18px] py-[40px]">
        <div className="max-w-[500px]">
          {/* About text */}
          <div className="mb-8">
            {language === "zh" ? (
              <>
                <p className="font-['Helvetica:Regular','Noto_Sans_SC:Regular',sans-serif] text-[15px] leading-[22px] text-black mb-4">
                  感谢使用。
                </p>
                <p className="font-['Helvetica:Regular','Noto_Sans_SC:Regular',sans-serif] text-[15px] leading-[22px] text-black mb-8">
                  不介意的话给我打点钱，介意的话也要打。
                </p>
              </>
            ) : (
              <>
                <p className="font-['Helvetica:Regular',sans-serif] text-[15px] leading-[22px] text-black mb-4">
                  Thank you for using our design information platform.
                </p>
                <p className="font-['Helvetica:Regular',sans-serif] text-[15px] leading-[22px] text-black mb-8">
                  If you don't mind, please support us. If you do mind, please support us anyway.
                </p>
              </>
            )}
          </div>

          {/* Design by */}
          <div className="mb-12">
            <p className="font-['Helvetica:Regular',sans-serif] text-[16px] leading-[22px] text-black">
              Design by Anthony
            </p>
          </div>

          {/* Additional info */}
          <div className="pt-8 border-t border-gray-200">
            <h2 className="font-['Helvetica:Bold',sans-serif] text-[20px] text-black mb-4">
              {t("Features", "功能特点")}
            </h2>
            <ul className="space-y-3">
              <li className="font-['Helvetica:Light',sans-serif] text-[14px] text-gray-700">
                • {t("Daily curated design articles", "每日精选设计文章")}
              </li>
              <li className="font-['Helvetica:Light',sans-serif] text-[14px] text-gray-700">
                • {t("Custom collection folders", "自定义收藏文件夹")}
              </li>
              <li className="font-['Helvetica:Light',sans-serif] text-[14px] text-gray-700">
                • {t("Bilingual support (English/Chinese)", "双语支持（英文/中文）")}
              </li>
              <li className="font-['Helvetica:Light',sans-serif] text-[14px] text-gray-700">
                • {t("Calendar-based article navigation", "基于日历的文章导航")}
              </li>
              <li className="font-['Helvetica:Light',sans-serif] text-[14px] text-gray-700">
                • {t("Category filtering", "分类筛选")}
              </li>
            </ul>
          </div>

          {/* Version */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="font-['Helvetica:Light',sans-serif] text-[12px] text-gray-500 text-center">
              Design Info v1.0.0
              <br />
              © 2026 Anthony. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}