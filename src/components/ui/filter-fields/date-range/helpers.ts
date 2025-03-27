// Helper functions for date handling

export const formatDate = (date: Date): string => {
  // Create a new date to avoid timezone issues
  const d = new Date(date);
  // Set time to noon to avoid timezone issues
  d.setHours(12, 0, 0, 0);
  return d.toISOString().split("T")[0];
};

export const formatDisplayDate = (dateStr: string): string => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

export const createDaysArray = (
  year: number,
  month: number
): Array<{ day: number; currentMonth: boolean }> => {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  // Days from previous month
  const prevMonthDays = [];
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevMonthYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonth);

  for (let i = 0; i < firstDayOfMonth; i++) {
    prevMonthDays.push({
      day: daysInPrevMonth - firstDayOfMonth + i + 1,
      currentMonth: false,
    });
  }

  // Days from current month
  const currentMonthDays = [];
  for (let i = 1; i <= daysInMonth; i++) {
    currentMonthDays.push({ day: i, currentMonth: true });
  }

  // Days from next month
  const totalDaysDisplayed = 42; // 6 rows x 7 days
  const nextMonthDays = [];
  const daysToAdd =
    totalDaysDisplayed - prevMonthDays.length - currentMonthDays.length;

  for (let i = 1; i <= daysToAdd; i++) {
    nextMonthDays.push({ day: i, currentMonth: false });
  }

  return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
};

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
