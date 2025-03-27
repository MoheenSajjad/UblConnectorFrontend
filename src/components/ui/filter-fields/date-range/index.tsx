import React, { useState, useRef, useEffect } from "react";
import { DateRangeFilterProps, CalendarView, CalendarSide } from "./types";
import { formatDate, formatDisplayDate } from "./helpers";
import MonthCalendar from "./MonthCalendar";
import YearMonthHeader from "./YearMonthHeader";
import MonthGrid from "./MonthGrid";
import YearGrid from "./YearGrid";
import { Input } from "../../input";

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  label,
  startName,
  endName,
  startValue,
  endValue,
  onChange,
  className = "",
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [viewingMonth, setViewingMonth] = useState(new Date().getMonth());
  const [viewingYear, setViewingYear] = useState(new Date().getFullYear());
  const [secondViewingMonth, setSecondViewingMonth] = useState(
    (new Date().getMonth() + 1) % 12
  );
  const [secondViewingYear, setSecondViewingYear] = useState(
    new Date().getMonth() === 11
      ? new Date().getFullYear() + 1
      : new Date().getFullYear()
  );
  const [hoverDate, setHoverDate] = useState<string | null>(null);
  const [calendarView, setCalendarView] = useState<CalendarView>("dates");
  const [yearRangeStart, setYearRangeStart] = useState(
    Math.floor(viewingYear / 10) * 10
  );
  const [selectedCalendar, setSelectedCalendar] =
    useState<CalendarSide>("first");
  const calendarRef = useRef<HTMLDivElement>(null);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setIsCalendarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get current date for highlighting today
  const today = new Date();
  const todayFormatted = formatDate(today);

  // Calendar navigation handlers
  const goToPreviousMonth = () => {
    if (viewingMonth === 0) {
      setViewingMonth(11);
      setViewingYear(viewingYear - 1);
    } else {
      setViewingMonth(viewingMonth - 1);
    }

    if (secondViewingMonth === 0) {
      setSecondViewingMonth(11);
      setSecondViewingYear(secondViewingYear - 1);
    } else {
      setSecondViewingMonth(secondViewingMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (viewingMonth === 11) {
      setViewingMonth(0);
      setViewingYear(viewingYear + 1);
    } else {
      setViewingMonth(viewingMonth + 1);
    }

    if (secondViewingMonth === 11) {
      setSecondViewingMonth(0);
      setSecondViewingYear(secondViewingYear + 1);
    } else {
      setSecondViewingMonth(secondViewingMonth + 1);
    }
  };

  const goToPreviousYear = () => {
    setViewingYear(viewingYear - 1);
    setSecondViewingYear(secondViewingYear - 1);
  };

  const goToNextYear = () => {
    setViewingYear(viewingYear + 1);
    setSecondViewingYear(secondViewingYear + 1);
  };

  // Date selection handlers
  const handleDateSelect = (year: number, month: number, day: number) => {
    const selectedDate = new Date(year, month, day);
    const formattedDate = formatDate(selectedDate);

    // If both dates are set, reset and set start date
    if (startValue && endValue) {
      // If selecting a date after the current end date, use current end date as start
      // and new date as end
      const currentEndDate = new Date(endValue);
      const newDate = new Date(formattedDate);

      if (newDate > currentEndDate) {
        onChange(endValue, formattedDate);
      }
      // If selecting a date before the current start date, use new date as start
      // and current start date as end
      else if (newDate < new Date(startValue)) {
        onChange(formattedDate, startValue);
      }
      // Otherwise just start a new range with the selected date
      else {
        onChange(formattedDate, "");
      }
    }
    // If start date is not set, set it
    else if (!startValue) {
      onChange(formattedDate, endValue);
    }
    // If start date is set and end date is not set
    else if (startValue && !endValue) {
      const startDate = new Date(startValue);

      // If selected date is before start date, swap them
      if (selectedDate < startDate) {
        onChange(formattedDate, startValue);
      } else {
        onChange(startValue, formattedDate);
        setIsCalendarOpen(false);
      }
    }
  };

  // Determine if a date is in the selected range
  const isInRange = (year: number, month: number, day: number): boolean => {
    if (!startValue || !endValue) {
      if (hoverDate && startValue) {
        const current = new Date(year, month, day).getTime();
        const start = new Date(startValue).getTime();
        const hover = new Date(hoverDate).getTime();
        return (
          (current >= start && current <= hover) ||
          (current <= start && current >= hover)
        );
      }
      return false;
    }

    const current = new Date(year, month, day).getTime();
    const start = new Date(startValue).getTime();
    const end = new Date(endValue).getTime();

    return current >= start && current <= end;
  };

  // Determine if a date is the start or end of the range
  const isRangeEnd = (year: number, month: number, day: number): boolean => {
    const current = formatDate(new Date(year, month, day));
    return current === startValue || current === endValue;
  };

  // Handle mouse hover for range preview
  const handleDateHover = (year: number, month: number, day: number) => {
    if (startValue && !endValue) {
      setHoverDate(formatDate(new Date(year, month, day)));
    }
  };

  const handleMonthSelect = (month: number) => {
    if (selectedCalendar === "first") {
      setViewingMonth(month);
    } else {
      setSecondViewingMonth(month);
    }
    setCalendarView("dates");
  };

  const handleYearSelect = (year: number) => {
    if (selectedCalendar === "first") {
      setViewingYear(year);
    } else {
      setSecondViewingYear(year);
    }
    setCalendarView("months");
  };

  const handleCalendarViewChange = (side: CalendarSide) => {
    setSelectedCalendar(side);
    setCalendarView("months");
  };

  return (
    <div className={`filter-group w-full ${className}`} ref={calendarRef}>
      {label && <Input.Label value={label} />}
      <div className="relative">
        <div
          className="flex  items-center p-[4px] border border-gray-300 rounded-md shadow-sm cursor-pointer hover:border-blue-500"
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
        >
          <input
            type="text"
            readOnly
            placeholder="Start date"
            value={startValue ? formatDisplayDate(startValue) : ""}
            className="flex-1 pl-3 pr-1 border-0 focus:ring-0 text-sm placeholder-gray-400 focus:outline-none"
          />
          <span className="mx-2 text-gray-400">&rarr;</span>
          <input
            type="text"
            readOnly
            placeholder="End date"
            value={endValue ? formatDisplayDate(endValue) : ""}
            className="flex-1 pl-1 pr-3  border-0 focus:ring-0 text-sm placeholder-gray-400 focus:outline-none"
          />
          <button className="text-gray-400 hover:text-gray-600">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 2V5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 2V5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3.5 9.09H20.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {isCalendarOpen && (
          <div className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-[550px]">
            {calendarView === "dates" && (
              <>
                <YearMonthHeader
                  viewingMonth={viewingMonth}
                  viewingYear={viewingYear}
                  secondViewingMonth={secondViewingMonth}
                  secondViewingYear={secondViewingYear}
                  onPreviousMonth={goToPreviousMonth}
                  onNextMonth={goToNextMonth}
                  onPreviousYear={goToPreviousYear}
                  onNextYear={goToNextYear}
                  onMonthYearClick={handleCalendarViewChange}
                />

                <div className="flex space-x-4">
                  <MonthCalendar
                    year={viewingYear}
                    month={viewingMonth}
                    startValue={startValue}
                    endValue={endValue}
                    todayFormatted={todayFormatted}
                    onDateSelect={handleDateSelect}
                    onDateHover={handleDateHover}
                    isInRange={isInRange}
                    isRangeEnd={isRangeEnd}
                  />

                  <MonthCalendar
                    year={secondViewingYear}
                    month={secondViewingMonth}
                    startValue={startValue}
                    endValue={endValue}
                    todayFormatted={todayFormatted}
                    onDateSelect={handleDateSelect}
                    onDateHover={handleDateHover}
                    isInRange={isInRange}
                    isRangeEnd={isRangeEnd}
                  />
                </div>
              </>
            )}

            {calendarView === "months" && (
              <MonthGrid
                selectedCalendar={selectedCalendar}
                viewingMonth={viewingMonth}
                viewingYear={viewingYear}
                secondViewingMonth={secondViewingMonth}
                secondViewingYear={secondViewingYear}
                onPreviousYear={() => {
                  if (selectedCalendar === "first") {
                    setViewingYear(viewingYear - 1);
                  } else {
                    setSecondViewingYear(secondViewingYear - 1);
                  }
                }}
                onNextYear={() => {
                  if (selectedCalendar === "first") {
                    setViewingYear(viewingYear + 1);
                  } else {
                    setSecondViewingYear(secondViewingYear + 1);
                  }
                }}
                onMonthSelect={handleMonthSelect}
                onYearClick={() => setCalendarView("years")}
              />
            )}

            {calendarView === "years" && (
              <YearGrid
                selectedCalendar={selectedCalendar}
                viewingYear={viewingYear}
                secondViewingYear={secondViewingYear}
                yearRangeStart={yearRangeStart}
                onPreviousDecade={() => setYearRangeStart(yearRangeStart - 10)}
                onNextDecade={() => setYearRangeStart(yearRangeStart + 10)}
                onYearSelect={handleYearSelect}
              />
            )}

            {/* Footer with buttons */}
            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end space-x-2">
              <button
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => {
                  onChange("", "");
                  // Reset to current month and year
                  const currentDate = new Date();
                  setViewingMonth(currentDate.getMonth());
                  setViewingYear(currentDate.getFullYear());

                  // Set second month to next month, handling year change for December
                  const nextMonth =
                    currentDate.getMonth() === 11
                      ? 0
                      : currentDate.getMonth() + 1;
                  const nextMonthYear =
                    currentDate.getMonth() === 11
                      ? currentDate.getFullYear() + 1
                      : currentDate.getFullYear();
                  setSecondViewingMonth(nextMonth);
                  setSecondViewingYear(nextMonthYear);

                  // Reset calendar view to dates
                  setCalendarView("dates");
                  setIsCalendarOpen(false);
                }}
              >
                Clear
              </button>
              <button
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={() => setIsCalendarOpen(false)}
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
