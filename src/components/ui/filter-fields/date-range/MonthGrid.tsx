import React from "react";
import { MONTH_NAMES } from "./helpers";
import { MonthGridProps } from "./types";
import { ArrowButton } from "./YearMonthHeader";
import { ChevronsLeftIcon, ChevronsRightIcon } from "@/components/icons";
import { Flex } from "../../flex";

const MonthGrid: React.FC<MonthGridProps> = ({
  selectedCalendar,
  viewingMonth,
  viewingYear,
  secondViewingMonth,
  secondViewingYear,
  onPreviousYear,
  onNextYear,
  onMonthSelect,
  onYearClick,
}) => {
  return (
    <>
      <Flex>
        <ArrowButton onClick={onPreviousYear} icon={<ChevronsLeftIcon />} />
        <span
          className="font-medium cursor-pointer hover:text-blue-600"
          onClick={onYearClick}
        >
          {selectedCalendar === "first" ? viewingYear : secondViewingYear}
        </span>
        <ArrowButton onClick={onNextYear} icon={<ChevronsRightIcon />} />
      </Flex>
      <div className="grid grid-cols-3 gap-2">
        {MONTH_NAMES.map((month, index) => {
          const isCurrentMonth =
            (selectedCalendar === "first" && index === viewingMonth) ||
            (selectedCalendar === "second" && index === secondViewingMonth);

          return (
            <div
              key={`month-${index}`}
              className={`
                py-1.5 text-center cursor-pointer rounded-md
                ${
                  isCurrentMonth
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100"
                }
              `}
              onClick={() => onMonthSelect(index)}
            >
              {month.substring(0, 3)}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default MonthGrid;
