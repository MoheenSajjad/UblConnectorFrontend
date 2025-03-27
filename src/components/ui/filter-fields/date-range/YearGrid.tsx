import React from "react";
import { YearGridProps } from "./types";
import { Flex } from "../../flex";
import { ArrowButton } from "./YearMonthHeader";
import { ChevronsLeftIcon, ChevronsRightIcon } from "@/components/icons";

const YearGrid: React.FC<YearGridProps> = ({
  selectedCalendar,
  viewingYear,
  secondViewingYear,
  yearRangeStart,
  onPreviousDecade,
  onNextDecade,
  onYearSelect,
}) => {
  return (
    <>
      <Flex>
        <ArrowButton onClick={onPreviousDecade} icon={<ChevronsLeftIcon />} />
        <span className="font-medium">
          {yearRangeStart}-{yearRangeStart + 9}
        </span>
        <ArrowButton onClick={onNextDecade} icon={<ChevronsRightIcon />} />
      </Flex>

      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 12 }, (_, i) => {
          const year = yearRangeStart - 1 + i;
          const isCurrentYear =
            (selectedCalendar === "first" && year === viewingYear) ||
            (selectedCalendar === "second" && year === secondViewingYear);
          const isOutOfRange = i === 0 || i === 11; // First and last years are out of range

          return (
            <div
              key={`year-${year}`}
              className={`
                py-1.5 text-center cursor-pointer rounded-md
                ${
                  isCurrentYear ? "bg-blue-600 text-white" : "hover:bg-gray-100"
                }
                ${isOutOfRange ? "text-gray-300" : ""}
              `}
              onClick={() => !isOutOfRange && onYearSelect(year)}
            >
              {year}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default YearGrid;
