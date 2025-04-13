import React from "react";
import { createDaysArray, formatDate } from "./helpers";
import { MonthCalendarProps } from "./types";

const MonthCalendar: React.FC<MonthCalendarProps> = ({
  year,
  month,
  startValue,
  endValue,
  todayFormatted,
  onDateSelect,
  onDateHover,
  isInRange,
  isRangeEnd,
}) => {
  const days = createDaysArray(year, month);

  return (
    <div className="flex-1">
      <div className="grid grid-cols-7 mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day, index) => (
          <div
            key={`day-header-${month}-${index}`}
            className="text-center text-sm font-medium text-gray-600"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-2">
        {days.map((dayObj, index) => {
          const formattedDate = formatDate(new Date(year, month, dayObj.day));

          const isToday =
            dayObj.currentMonth &&
            formatDate(new Date(year, month, dayObj.day)) === todayFormatted;

          const isStartDate =
            dayObj.currentMonth && formattedDate === startValue;

          const isEndDate = dayObj.currentMonth && formattedDate === endValue;
          const isSelected =
            dayObj.currentMonth &&
            (formatDate(new Date(year, month, dayObj.day)) === startValue ||
              formatDate(new Date(year, month, dayObj.day)) === endValue);

          const inRange =
            dayObj.currentMonth && isInRange(year, month, dayObj.day);

          const isEndpoint =
            dayObj.currentMonth && isRangeEnd(year, month, dayObj.day);

          return (
            <div
              key={`day-${month}-${index}`}
              className={`
                text-center py-1 text-sm cursor-pointer
                ${!dayObj.currentMonth ? "text-gray-300" : ""}
                ${isToday ? "font-bold border rounded-md border-blue-300" : ""}
                ${
                  isStartDate
                    ? "bg-blue-600 text-white rounded-tl-md rounded-bl-md"
                    : ""
                }
                   ${
                     isEndDate
                       ? "bg-blue-600 text-white rounded-tr-md rounded-br-md"
                       : ""
                   }

                ${inRange && !isEndpoint ? "bg-blue-100" : ""}
                ${dayObj.currentMonth ? "hover:bg-gray-100" : ""}
              `}
              onClick={() =>
                dayObj.currentMonth && onDateSelect(year, month, dayObj.day)
              }
              onMouseEnter={() =>
                dayObj.currentMonth && onDateHover(year, month, dayObj.day)
              }
            >
              {dayObj.day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthCalendar;
