/**
 * FilterPanel Component
 *
 * Provides type and date range filtering for articles.
 */

import { ArticleCategory } from '../app/data/mockArticles';

interface FilterPanelProps {
  selectedType: ArticleCategory | 'all';
  onTypeChange: (type: ArticleCategory | 'all') => void;
  dateRange: { start: string | null; end: string | null };
  onDateRangeChange: (range: { start: string | null; end: string | null }) => void;
  availableDates?: string[];
}

export function FilterPanel({
  selectedType,
  onTypeChange,
  dateRange,
  onDateRangeChange,
}: FilterPanelProps) {
  return (
    <div className="flex gap-4 items-center">
      {/* Type Filter */}
      <select
        value={selectedType}
        onChange={(e) => onTypeChange(e.target.value as ArticleCategory | 'all')}
        className="h-[38px] px-3 text-[14px] border border-gray-300 rounded-full focus:outline-none focus:border-gray-500 bg-white"
      >
        <option value="all">All</option>
        <option value="Design News">Design News</option>
        <option value="Paper">Paper</option>
        <option value="Design Award">Design Award</option>
      </select>

      {/* Date Range Display */}
      <button
        onClick={() => {
          // Toggle date picker visibility - parent handles this
        }}
        className="h-[38px] px-3 text-[14px] border border-gray-300 rounded-full hover:border-gray-500 transition-colors bg-white"
      >
        {dateRange.start ? `${dateRange.start} - ${dateRange.end || ''}` : 'Select dates'}
      </button>

      {/* Clear Date Range */}
      {dateRange.start && (
        <button
          onClick={() => onDateRangeChange({ start: null, end: null })}
          className="text-[12px] text-gray-500 hover:text-gray-700"
        >
          Clear dates
        </button>
      )}
    </div>
  );
}
