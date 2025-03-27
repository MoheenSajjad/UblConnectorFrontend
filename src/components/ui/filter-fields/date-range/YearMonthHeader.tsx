import React, { ReactNode } from "react";
import { MONTH_NAMES } from "./helpers";
import { YearMonthHeaderProps } from "./types";
import { Flex } from "../../flex";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "@/components/icons";

const YearMonthHeader: React.FC<YearMonthHeaderProps> = ({
  viewingMonth,
  viewingYear,
  secondViewingMonth,
  secondViewingYear,
  onPreviousMonth,
  onNextMonth,
  onPreviousYear,
  onNextYear,
  onMonthYearClick,
}) => {
  return (
    <Flex className="mb-4" justify={Flex.JustifyContent.Between}>
      <Flex className="space-x-2" direction={Flex.Direction.Row}>
        <ArrowButton onClick={onPreviousYear} icon={<ChevronsLeftIcon />} />
        <ArrowButton onClick={onPreviousMonth} icon={<ChevronLeftIcon />} />
      </Flex>
      <Flex className="space-x-16">
        <span
          className="font-medium cursor-pointer hover:text-blue-600"
          onClick={() => onMonthYearClick("first")}
        >
          {MONTH_NAMES[viewingMonth]} {viewingYear}
        </span>
        <span
          className="font-medium cursor-pointer hover:text-blue-600"
          onClick={() => onMonthYearClick("second")}
        >
          {MONTH_NAMES[secondViewingMonth]} {secondViewingYear}
        </span>
      </Flex>
      <Flex className="space-x-2">
        <ArrowButton onClick={onNextMonth} icon={<ChevronRightIcon />} />
        <ArrowButton onClick={onNextYear} icon={<ChevronsRightIcon />} />
      </Flex>
    </Flex>
  );
};

export default YearMonthHeader;

export const ArrowButton = ({
  onClick,
  icon,
}: {
  onClick: () => void;
  icon: ReactNode;
}) => {
  return (
    <button onClick={onClick} className="p-1 rounded-md hover:bg-gray-100">
      {icon}
    </button>
  );
};
