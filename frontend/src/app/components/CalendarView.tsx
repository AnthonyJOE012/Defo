import { X } from "lucide-react";
import { getDatesWithArticles } from "../data/mockArticles";

interface CalendarViewProps {
  onDateSelect: (date: string) => void;
  selectedDate?: string;
  onClose: () => void;
  datesWithArticles?: string[]; // Optional prop for API dates
}

export function CalendarView({ onDateSelect, selectedDate, onClose, datesWithArticles: apiDates }: CalendarViewProps) {
  const datesWithArticles = apiDates || getDatesWithArticles();
  
  // March 2026 calendar data
  const daysInMonth = [
    { day: 1, date: "2026-03-01", weekday: 6 }, // Sunday
    { day: 2, date: "2026-03-02", weekday: 0 }, // Monday
    { day: 3, date: "2026-03-03", weekday: 1 }, // Tuesday
    { day: 4, date: "2026-03-04", weekday: 2 }, // Wednesday
    { day: 5, date: "2026-03-05", weekday: 3 }, // Thursday
    { day: 6, date: "2026-03-06", weekday: 4 }, // Friday
    { day: 7, date: "2026-03-07", weekday: 5 }, // Saturday
    { day: 8, date: "2026-03-08", weekday: 6 }, // Sunday (today)
    { day: 9, date: "2026-03-09", weekday: 0 },
    { day: 10, date: "2026-03-10", weekday: 1 },
    { day: 11, date: "2026-03-11", weekday: 2 },
    { day: 12, date: "2026-03-12", weekday: 3 },
    { day: 13, date: "2026-03-13", weekday: 4 },
    { day: 14, date: "2026-03-14", weekday: 5 },
    { day: 15, date: "2026-03-15", weekday: 6 },
    { day: 16, date: "2026-03-16", weekday: 0 },
    { day: 17, date: "2026-03-17", weekday: 1 },
    { day: 18, date: "2026-03-18", weekday: 2 },
    { day: 19, date: "2026-03-19", weekday: 3 },
    { day: 20, date: "2026-03-20", weekday: 4 },
    { day: 21, date: "2026-03-21", weekday: 5 },
    { day: 22, date: "2026-03-22", weekday: 6 },
    { day: 23, date: "2026-03-23", weekday: 0 },
    { day: 24, date: "2026-03-24", weekday: 1 },
    { day: 25, date: "2026-03-25", weekday: 2 },
    { day: 26, date: "2026-03-26", weekday: 3 },
    { day: 27, date: "2026-03-27", weekday: 4 },
    { day: 28, date: "2026-03-28", weekday: 5 },
    { day: 29, date: "2026-03-29", weekday: 6 },
    { day: 30, date: "2026-03-30", weekday: 0 },
  ];

  const today = "2026-03-08";

  const handleDayClick = (date: string) => {
    if (datesWithArticles.includes(date)) {
      onDateSelect(date);
    }
  };

  const renderDay = (dayData: { day: number; date: string; weekday: number }) => {
    const hasArticles = datesWithArticles.includes(dayData.date);
    const isToday = dayData.date === today;
    const isSelected = dayData.date === selectedDate;

    return (
      <button
        type="button"
        className={`relative flex flex-col items-center justify-center min-w-[32px] sm:min-w-[40px] h-[32px] sm:h-[36px] ${
          hasArticles ? 'cursor-pointer hover:bg-gray-100 rounded' : 'cursor-default'
        }`}
        onClick={() => handleDayClick(dayData.date)}
        disabled={!hasArticles}
      >
        <span
          className={`font-['Inter:Regular',sans-serif] font-normal text-[14px] sm:text-[16px] ${
            isToday ? 'text-black font-semibold' : 'text-[#727272]'
          } ${isSelected ? 'font-semibold' : ''}`}
        >
          {dayData.day}
        </span>
        {hasArticles && (
          <div className="absolute bottom-1">
            <svg className="block size-[3px]" fill="none" preserveAspectRatio="none" viewBox="0 0 3 3">
              <circle cx="1.5" cy="1.5" fill="black" r="1.5" />
            </svg>
          </div>
        )}
      </button>
    );
  };

  // Organize days into weeks for grid layout
  const weeks: (typeof daysInMonth[0] | null)[][] = [];
  let currentWeek: (typeof daysInMonth[0] | null)[] = new Array(7).fill(null);
  
  daysInMonth.forEach((day) => {
    currentWeek[day.weekday] = day;
    if (day.weekday === 6) { // Sunday (end of week)
      weeks.push([...currentWeek]);
      currentWeek = new Array(7).fill(null);
    }
  });
  
  // Add the last incomplete week if exists
  if (currentWeek.some(day => day !== null)) {
    weeks.push(currentWeek);
  }

  return (
    <div className="w-full max-w-full mx-auto bg-white border-b border-gray-200 px-[18px] py-4">
      <div className="max-w-[500px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <p className="font-['Helvetica:Regular',sans-serif] text-[18px] sm:text-[20px] text-black">
            Calendar
          </p>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className="flex items-center justify-center">
              <p className="font-['Inter:Medium',sans-serif] font-medium text-[#727272] text-[12px] sm:text-[14px]">
                {day}
              </p>
            </div>
          ))}
        </div>

        {/* Calendar grid - organized by weeks */}
        <div className="space-y-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-1">
              {week.map((day, dayIndex) => (
                <div key={`${weekIndex}-${dayIndex}`} className="flex items-center justify-center">
                  {day ? renderDay(day) : <div className="min-w-[32px] sm:min-w-[40px] h-[32px] sm:h-[36px]" />}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}