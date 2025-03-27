import { BaseFilterProps } from "@/types/filter";

export interface DateRangeFilterProps extends BaseFilterProps {
  label?: string;
  startName: string;
  endName: string;
  startValue: string;
  endValue: string;
  onChange: (startDate: string, endDate: string) => void;
}

export type CalendarView = "dates" | "months" | "years";
export type CalendarSide = "first" | "second";

export interface MonthCalendarProps {
  year: number;
  month: number;
  startValue: string;
  endValue: string;
  todayFormatted: string;
  onDateSelect: (year: number, month: number, day: number) => void;
  onDateHover: (year: number, month: number, day: number) => void;
  isInRange: (year: number, month: number, day: number) => boolean;
  isRangeEnd: (year: number, month: number, day: number) => boolean;
}

export interface YearMonthHeaderProps {
  viewingMonth: number;
  viewingYear: number;
  secondViewingMonth: number;
  secondViewingYear: number;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onPreviousYear: () => void;
  onNextYear: () => void;
  onMonthYearClick: (side: CalendarSide) => void;
}

export interface MonthGridProps {
  selectedCalendar: CalendarSide;
  viewingMonth: number;
  viewingYear: number;
  secondViewingMonth: number;
  secondViewingYear: number;
  onPreviousYear: () => void;
  onNextYear: () => void;
  onMonthSelect: (month: number) => void;
  onYearClick: () => void;
}

export interface YearGridProps {
  selectedCalendar: CalendarSide;
  viewingYear: number;
  secondViewingYear: number;
  yearRangeStart: number;
  onPreviousDecade: () => void;
  onNextDecade: () => void;
  onYearSelect: (year: number) => void;
}
