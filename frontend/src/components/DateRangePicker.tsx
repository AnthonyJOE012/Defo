/**
 * DateRangePicker Component
 *
 * Simple date range selector for filtering articles by date.
 */

interface DateRangePickerProps {
  startDate: string | null;
  endDate: string | null;
  onStartDateChange: (date: string | null) => void;
  onEndDateChange: (date: string | null) => void;
  onClose: () => void;
}

export function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onClose,
}: DateRangePickerProps) {
  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value || null;
    onStartDateChange(value);
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value || null;
    onEndDateChange(value);
  };

  const handleClear = () => {
    onStartDateChange(null);
    onEndDateChange(null);
  };

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-lg">
      <div className="flex items-center gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[12px] text-gray-500">Start Date</label>
          <input
            type="date"
            value={startDate || ''}
            onChange={handleStartChange}
            className="h-[38px] px-3 text-[14px] border border-gray-300 rounded focus:outline-none focus:border-gray-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[12px] text-gray-500">End Date</label>
          <input
            type="date"
            value={endDate || ''}
            onChange={handleEndChange}
            min={startDate || undefined}
            className="h-[38px] px-3 text-[14px] border border-gray-300 rounded focus:outline-none focus:border-gray-500"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={handleClear}
          className="px-3 py-1.5 text-[14px] text-gray-600 hover:text-gray-800 transition-colors"
        >
          Clear
        </button>
        <button
          onClick={onClose}
          className="px-3 py-1.5 text-[14px] bg-black text-white rounded hover:opacity-80 transition-opacity"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
