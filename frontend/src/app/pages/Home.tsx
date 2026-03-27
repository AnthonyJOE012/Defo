import { useState, useEffect, useRef } from "react";
import { SidebarMenu } from "../components/SidebarMenu";
import { ArticleCard } from "../components/ArticleCard";
import { CalendarView } from "../components/CalendarView";
import { DateRangePicker } from "../components/DateRangePicker";
import { mockArticles, getArticlesByCategory, getArticlesByDate, ArticleCategory, getArticleCountByCategory } from "../data/mockArticles";
import svgPaths from "../../imports/svg-60podcrfbk";
import { useLanguage } from "../contexts/LanguageContext";
import { useArticles, useSearchArticles } from "../../hooks/useArticles";
import { useSearchHistory } from "../../hooks/useSearchHistory";
import { Article } from "../../services/adapter";

// Search icon SVG path
const searchIconPath = "M13.406 12.016l3.312 3.312-1.078 1.078-3.312-3.312zm4.125-4.297c1.625-1.625 2.625-3.891 2.625-6.359s-1-4.734-2.625-6.359C16.078.625 13.812-.375 11.344-.375c-2.469 0-4.734 1-6.359 2.625S2.36 3.969 2.36 6.438s1 4.734 2.625 6.359c1.625 1.625 3.891 2.625 6.359 2.625 2.469 0 4.734-1 6.359-2.625zm-.656-1.078c-1.406-1.406-2.203-3.266-2.203-5.281 0-2.016.797-3.875 2.203-5.281C17.953.422 19.812-.375 21.828-.375c2.016 0 3.875.797 5.281 2.203 1.406 1.406 2.203 3.266 2.203 5.281 0 2.016-.797 3.875-2.203 5.281-1.406 1.406-3.266 2.203-5.281 2.203-2.016 0-3.875-.797-5.281-2.203z";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ArticleCategory | "all">("all");
  const [selectedDate, setSelectedDate] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<{ start: string | null; end: string | null }>({
    start: null,
    end: null,
  });
  const [articles, setArticles] = useState<Article[]>(mockArticles);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  // Search history management
  const { history: searchHistory, addToHistory, clearHistory } = useSearchHistory();

  // Determine if we're in search mode
  const isSearchMode = searchQuery.trim().length > 0;

  // Determine API params based on filters
  const getApiParams = () => {
    if (isSearchMode) {
      return { query: searchQuery };
    }
    if (selectedDate) {
      return {};
    }
    if (selectedCategory !== "all") {
      return { category: selectedCategory };
    }
    return {};
  };

  // Use search API when there's a search query
  const {
    articles: searchResults,
    isLoading: isSearchLoading,
    isError: isSearchError,
    refetch: refetchSearch,
  } = useSearchArticles({
    query: searchQuery,
    ...(selectedCategory !== "all" ? { category: selectedCategory } : {}),
    enabled: isSearchMode,
  });

  // Use regular articles API
  const {
    articles: fetchedArticles,
    isLoading: isArticlesLoading,
    isError: isArticlesError,
    refetch: refetchArticles,
  } = useArticles({
    category: selectedCategory !== "all" ? selectedCategory : undefined,
    enabled: !isSearchMode,
  });

  // Update articles based on data source
  useEffect(() => {
    if (isSearchMode) {
      setArticles(searchResults);
    } else {
      setArticles(fetchedArticles.length > 0 ? fetchedArticles : mockArticles);
    }
  }, [searchResults, fetchedArticles, isSearchMode]);

  // Filter articles by date if a date is selected
  const displayedArticles = selectedDate
    ? articles.filter((article) => article.date === selectedDate)
    : articles;

  const isLoading = isSearchMode ? isSearchLoading : isArticlesLoading;
  const isError = isSearchMode ? isSearchError : isArticlesError;

  const handleRefresh = () => {
    setIsRefreshing(true);
    if (isSearchMode) {
      refetchSearch();
    } else {
      refetchArticles();
    }
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  const handleCategoryChange = (category: ArticleCategory | "all") => {
    setSelectedCategory(category);
    setSelectedDate(undefined);
    setIsCalendarOpen(false);
    setSearchQuery("");
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setIsCalendarOpen(false);
    setSearchQuery("");
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  };

  const handleCalendarToggle = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  const handleDateRangeChange = (range: { start: string | null; end: string | null }) => {
    setDateRange(range);
    if (range.start && range.end) {
      setIsDatePickerOpen(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      addToHistory(searchQuery);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedDate(undefined);
    setDateRange({ start: null, end: null });
  };

  const handleSearchHistoryClick = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="bg-white h-screen w-full flex flex-col overflow-hidden">
      {/* Fixed Top Section */}
      <div className="flex-shrink-0">
        {/* Title and Controls */}
        <div className="px-[18px] pt-[64px] pb-[12px] flex items-start justify-between">
          {/* Design info - Bold */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex flex-col hover:opacity-70 transition-opacity disabled:opacity-50"
          >
            <h1 className="font-['Helvetica:Bold',sans-serif] text-[24px] text-black leading-[22px]">
              Design
            </h1>
            <h1 className="font-['Helvetica:Bold',sans-serif] text-[24px] text-black leading-[22px]">
              info
            </h1>
          </button>

          <div className="flex items-center gap-4">
            {/* Search bar */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder={t("Search", "搜索")}
                className="w-[120px] sm:w-[160px] h-[38px] pl-8 pr-8 text-[14px] border border-gray-300 rounded-full focus:outline-none focus:border-gray-500 bg-white"
              />
              <svg
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 20 20"
              >
                <path d={searchIconPath} fill="var(--fill-0, #727272)" />
              </svg>
              {/* Clear search button */}
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12">
                    <path d="M9 3L3 9M3 3l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              )}
            </form>

            {/* Date range picker button */}
            <button
              onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
              className={`flex items-center gap-2 transition-opacity ${dateRange.start ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
            >
              <div className="w-[17px] h-[17px]">
                <svg className="block w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.584 15.584">
                  <path d={svgPaths.p10363500} fill="var(--fill-0, #333333)" />
                </svg>
              </div>
              <span className="font-['Helvetica:Regular',sans-serif] text-[20px] text-black leading-[22px]">
                {dateRange.start ? `${dateRange.start} - ${dateRange.end || ''}` : 'Calendar'}
              </span>
            </button>

            {/* Hamburger button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="w-[38px] h-[38px] flex items-center justify-center hover:opacity-70 transition-opacity"
            >
              <svg className="w-[28.5px] h-[22.166px]" fill="none" preserveAspectRatio="none" viewBox="0 0 28.5 22.166">
                <path d={svgPaths.p140e1700} fill="var(--fill-0, #333333)" />
              </svg>
            </button>
          </div>
        </div>

        {/* Category Filter - Hidden when searching, shown otherwise */}
        {!isSearchMode && (
          <div className="px-[18px] pb-[18px]">
            <div className="font-['Helvetica:Light',sans-serif] text-[12px] text-black leading-[22px] flex items-center gap-[6px]">
              <button
                onClick={() => handleCategoryChange("all")}
                className={`hover:opacity-70 transition-opacity ${
                  selectedCategory === "all" ? "opacity-100" : "opacity-50"
                }`}
              >
                {t("All info", "全部信息")} ({articles.length || getArticleCountByCategory("all")})
              </button>
              <span>/</span>
              <button
                onClick={() => handleCategoryChange("Design News")}
                className={`hover:opacity-70 transition-opacity ${
                  selectedCategory === "Design News" ? "opacity-100" : "opacity-50"
                }`}
              >
                {t("Design News", "设计新闻")}
              </button>
              <span>/</span>
              <button
                onClick={() => handleCategoryChange("Paper")}
                className={`hover:opacity-70 transition-opacity ${
                  selectedCategory === "Paper" ? "opacity-100" : "opacity-50"
                }`}
              >
                {t("Paper", "论文")}
              </button>
              <span>/</span>
              <button
                onClick={() => handleCategoryChange("Design Award")}
                className={`hover:opacity-70 transition-opacity ${
                  selectedCategory === "Design Award" ? "opacity-100" : "opacity-50"
                }`}
              >
                {t("Design Award", "设计奖项")}
              </button>
            </div>
          </div>
        )}

        {/* Search Results Info */}
        {isSearchMode && (
          <div className="px-[18px] pb-[18px]">
            <div className="font-['Helvetica:Light',sans-serif] text-[12px] text-black leading-[22px] flex items-center gap-[6px]">
              <span className="opacity-70">
                {t("Results for", "搜索结果")} "{searchQuery}"
              </span>
              <span className="opacity-50">
                ({displayedArticles.length} {t("articles", "篇文章")})
              </span>
              <button
                onClick={handleClearSearch}
                className="ml-2 opacity-50 hover:opacity-100 transition-opacity"
              >
                {t("Clear search", "清除搜索")}
              </button>
            </div>

            {/* Search History */}
            {searchHistory.length > 0 && !searchQuery && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[10px] text-gray-500">{t("Recent searches", "最近搜索")}:</span>
                {searchHistory.slice(0, 5).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSearchHistoryClick(item.query)}
                    className="px-2 py-0.5 text-[10px] bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {item.query}
                  </button>
                ))}
                <button
                  onClick={clearHistory}
                  className="text-[10px] text-gray-400 hover:text-gray-600"
                >
                  {t("Clear history", "清除历史")}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Calendar View */}
        {isCalendarOpen && (
          <CalendarView
            onDateSelect={handleDateSelect}
            selectedDate={selectedDate}
            onClose={() => setIsCalendarOpen(false)}
          />
        )}

        {/* Date Range Picker */}
        {isDatePickerOpen && (
          <div className="px-[18px] pb-[18px]">
            <DateRangePicker
              startDate={dateRange.start}
              endDate={dateRange.end}
              onStartDateChange={(date) => setDateRange((prev) => ({ ...prev, start: date }))}
              onEndDateChange={(date) => setDateRange((prev) => ({ ...prev, end: date }))}
              onClose={() => setIsDatePickerOpen(false)}
            />
          </div>
        )}
      </div>

      {/* Scrollable Articles */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-[17px] pb-[20px]"
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="font-['Helvetica:Regular',sans-serif] text-[16px] text-gray-500">
              {t("Loading...", "加载中...")}
            </p>
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center h-full">
            <p className="font-['Helvetica:Regular',sans-serif] text-[16px] text-red-500">
              {t("Failed to load articles", "加载文章失败")}
            </p>
          </div>
        ) : displayedArticles.length > 0 ? (
          displayedArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="font-['Helvetica:Regular',sans-serif] text-[16px] text-gray-500">
              {searchQuery
                ? t("No results found", "未找到搜索结果")
                : t("No articles found for this selection", "未找到文章")}
            </p>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <SidebarMenu isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </div>
  );
}
