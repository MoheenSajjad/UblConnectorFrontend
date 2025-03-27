// import React, { useState, useRef, useEffect } from "react";
// import { DateRangeFilterProps } from "@/types/filter";

// // Helper functions for date handling
// const formatDate = (date: Date): string => {
//   // Create a new date to avoid timezone issues
//   const d = new Date(date);
//   // Set time to noon to avoid timezone issues
//   d.setHours(12, 0, 0, 0);
//   return d.toISOString().split("T")[0];
// };

// const formatDisplayDate = (dateStr: string): string => {
//   if (!dateStr) return "";
//   const date = new Date(dateStr);
//   return date.toLocaleDateString("en-US", {
//     month: "short",
//     day: "numeric",
//     year: "numeric",
//   });
// };

// const getDaysInMonth = (year: number, month: number): number => {
//   return new Date(year, month + 1, 0).getDate();
// };

// const createDaysArray = (
//   year: number,
//   month: number
// ): Array<{ day: number; currentMonth: boolean }> => {
//   const daysInMonth = getDaysInMonth(year, month);
//   const firstDayOfMonth = new Date(year, month, 1).getDay();

//   // Days from previous month
//   const prevMonthDays = [];
//   const prevMonth = month === 0 ? 11 : month - 1;
//   const prevMonthYear = month === 0 ? year - 1 : year;
//   const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonth);

//   for (let i = 0; i < firstDayOfMonth; i++) {
//     prevMonthDays.push({
//       day: daysInPrevMonth - firstDayOfMonth + i + 1,
//       currentMonth: false,
//     });
//   }

//   // Days from current month
//   const currentMonthDays = [];
//   for (let i = 1; i <= daysInMonth; i++) {
//     currentMonthDays.push({ day: i, currentMonth: true });
//   }

//   // Days from next month
//   const totalDaysDisplayed = 42; // 6 rows x 7 days
//   const nextMonthDays = [];
//   const daysToAdd =
//     totalDaysDisplayed - prevMonthDays.length - currentMonthDays.length;

//   for (let i = 1; i <= daysToAdd; i++) {
//     nextMonthDays.push({ day: i, currentMonth: false });
//   }

//   return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
// };

// const MONTH_NAMES = [
//   "January",
//   "February",
//   "March",
//   "April",
//   "May",
//   "June",
//   "July",
//   "August",
//   "September",
//   "October",
//   "November",
//   "December",
// ];

// const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
//   label,
//   startName,
//   endName,
//   startValue,
//   endValue,
//   onChange,
//   className = "",
// }) => {
//   const [isCalendarOpen, setIsCalendarOpen] = useState(false);
//   const [viewingMonth, setViewingMonth] = useState(new Date().getMonth());
//   const [viewingYear, setViewingYear] = useState(new Date().getFullYear());
//   const [secondViewingMonth, setSecondViewingMonth] = useState(
//     (new Date().getMonth() + 1) % 12
//   );
//   const [secondViewingYear, setSecondViewingYear] = useState(
//     new Date().getMonth() === 11
//       ? new Date().getFullYear() + 1
//       : new Date().getFullYear()
//   );
//   const [hoverDate, setHoverDate] = useState<string | null>(null);
//   const [calendarView, setCalendarView] = useState<
//     "dates" | "months" | "years"
//   >("dates");
//   const [yearRangeStart, setYearRangeStart] = useState(
//     Math.floor(viewingYear / 10) * 10
//   );
//   const [selectedCalendar, setSelectedCalendar] = useState<"first" | "second">(
//     "first"
//   );
//   const calendarRef = useRef<HTMLDivElement>(null);

//   // Close calendar when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         calendarRef.current &&
//         !calendarRef.current.contains(event.target as Node)
//       ) {
//         setIsCalendarOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   // Get current date for highlighting today
//   const today = new Date();
//   const todayFormatted = formatDate(today);

//   // Calendar navigation handlers
//   const goToPreviousMonth = () => {
//     if (viewingMonth === 0) {
//       setViewingMonth(11);
//       setViewingYear(viewingYear - 1);
//     } else {
//       setViewingMonth(viewingMonth - 1);
//     }

//     if (secondViewingMonth === 0) {
//       setSecondViewingMonth(11);
//       setSecondViewingYear(secondViewingYear - 1);
//     } else {
//       setSecondViewingMonth(secondViewingMonth - 1);
//     }
//   };

//   const goToNextMonth = () => {
//     if (viewingMonth === 11) {
//       setViewingMonth(0);
//       setViewingYear(viewingYear + 1);
//     } else {
//       setViewingMonth(viewingMonth + 1);
//     }

//     if (secondViewingMonth === 11) {
//       setSecondViewingMonth(0);
//       setSecondViewingYear(secondViewingYear + 1);
//     } else {
//       setSecondViewingMonth(secondViewingMonth + 1);
//     }
//   };

//   const goToPreviousYear = () => {
//     setViewingYear(viewingYear - 1);
//     setSecondViewingYear(secondViewingYear - 1);
//   };

//   const goToNextYear = () => {
//     setViewingYear(viewingYear + 1);
//     setSecondViewingYear(secondViewingYear + 1);
//   };

//   // Date selection handlers
//   const handleDateSelect = (year: number, month: number, day: number) => {
//     const selectedDate = new Date(year, month, day);
//     const formattedDate = formatDate(selectedDate);

//     // If both dates are set, reset and set start date
//     if (startValue && endValue) {
//       // If selecting a date after the current end date, use current end date as start
//       // and new date as end
//       const currentEndDate = new Date(endValue);
//       const newDate = new Date(formattedDate);

//       if (newDate > currentEndDate) {
//         onChange(endValue, formattedDate);
//       }
//       // If selecting a date before the current start date, use new date as start
//       // and current start date as end
//       else if (newDate < new Date(startValue)) {
//         onChange(formattedDate, startValue);
//       }
//       // Otherwise just start a new range with the selected date
//       else {
//         onChange(formattedDate, "");
//       }
//     }
//     // If start date is not set, set it
//     else if (!startValue) {
//       onChange(formattedDate, endValue);
//     }
//     // If start date is set and end date is not set
//     else if (startValue && !endValue) {
//       const startDate = new Date(startValue);

//       // If selected date is before start date, swap them
//       if (selectedDate < startDate) {
//         onChange(formattedDate, startValue);
//       } else {
//         onChange(startValue, formattedDate);
//         setIsCalendarOpen(false);
//       }
//     }
//   };

//   // Generate days for both months
//   const firstMonthDays = createDaysArray(viewingYear, viewingMonth);
//   const secondMonthDays = createDaysArray(
//     secondViewingYear,
//     secondViewingMonth
//   );

//   // Determine if a date is in the selected range
//   const isInRange = (year: number, month: number, day: number): boolean => {
//     if (!startValue || !endValue) {
//       if (hoverDate && startValue) {
//         const current = new Date(year, month, day).getTime();
//         const start = new Date(startValue).getTime();
//         const hover = new Date(hoverDate).getTime();
//         return (
//           (current >= start && current <= hover) ||
//           (current <= start && current >= hover)
//         );
//       }
//       return false;
//     }

//     const current = new Date(year, month, day).getTime();
//     const start = new Date(startValue).getTime();
//     const end = new Date(endValue).getTime();

//     return current >= start && current <= end;
//   };

//   // Determine if a date is the start or end of the range
//   const isRangeEnd = (year: number, month: number, day: number): boolean => {
//     const current = formatDate(new Date(year, month, day));
//     return current === startValue || current === endValue;
//   };

//   // Handle mouse hover for range preview
//   const handleDateHover = (year: number, month: number, day: number) => {
//     if (startValue && !endValue) {
//       setHoverDate(formatDate(new Date(year, month, day)));
//     }
//   };

//   return (
//     <div className={`filter-group ${className}`} ref={calendarRef}>
//       {label && (
//         <div className="mb-2">
//           <label className="block text-sm font-medium text-gray-700">
//             {label}
//           </label>
//         </div>
//       )}
//       <div className="relative">
//         <div
//           className="flex items-center p-2 border border-gray-300 rounded-md shadow-sm cursor-pointer hover:border-blue-500"
//           onClick={() => setIsCalendarOpen(!isCalendarOpen)}
//         >
//           <input
//             type="text"
//             readOnly
//             placeholder="Start date"
//             value={startValue ? formatDisplayDate(startValue) : ""}
//             className="flex-1 pl-3 pr-1 py-1 border-0 focus:ring-0 text-sm placeholder-gray-400 focus:outline-none"
//           />
//           <span className="mx-2 text-gray-400">&rarr;</span>
//           <input
//             type="text"
//             readOnly
//             placeholder="End date"
//             value={endValue ? formatDisplayDate(endValue) : ""}
//             className="flex-1 pl-1 pr-3 py-1 border-0 focus:ring-0 text-sm placeholder-gray-400 focus:outline-none"
//           />
//           <button className="text-gray-400 hover:text-gray-600">
//             <svg
//               width="20"
//               height="20"
//               viewBox="0 0 24 24"
//               fill="none"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 d="M8 2V5"
//                 stroke="currentColor"
//                 strokeWidth="1.5"
//                 strokeMiterlimit="10"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//               <path
//                 d="M16 2V5"
//                 stroke="currentColor"
//                 strokeWidth="1.5"
//                 strokeMiterlimit="10"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//               <path
//                 d="M3.5 9.09H20.5"
//                 stroke="currentColor"
//                 strokeWidth="1.5"
//                 strokeMiterlimit="10"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//               <path
//                 d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
//                 stroke="currentColor"
//                 strokeWidth="1.5"
//                 strokeMiterlimit="10"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//             </svg>
//           </button>
//         </div>

//         {isCalendarOpen && (
//           <div className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-[680px]">
//             {calendarView === "dates" && (
//               <>
//                 <div className="flex justify-between items-center mb-4">
//                   <div className="flex space-x-2">
//                     <button
//                       onClick={goToPreviousYear}
//                       className="p-1 rounded-md hover:bg-gray-100"
//                     >
//                       <span className="text-gray-600">&laquo;</span>
//                     </button>
//                     <button
//                       onClick={goToPreviousMonth}
//                       className="p-1 rounded-md hover:bg-gray-100"
//                     >
//                       <span className="text-gray-600">&lsaquo;</span>
//                     </button>
//                   </div>
//                   <div className="flex space-x-16">
//                     <span
//                       className="font-medium cursor-pointer hover:text-blue-600"
//                       onClick={() => {
//                         setSelectedCalendar("first");
//                         setCalendarView("months");
//                       }}
//                     >
//                       {MONTH_NAMES[viewingMonth]} {viewingYear}
//                     </span>
//                     <span
//                       className="font-medium cursor-pointer hover:text-blue-600"
//                       onClick={() => {
//                         setSelectedCalendar("second");
//                         setCalendarView("months");
//                       }}
//                     >
//                       {MONTH_NAMES[secondViewingMonth]} {secondViewingYear}
//                     </span>
//                   </div>
//                   <div className="flex space-x-2">
//                     <button
//                       onClick={goToNextMonth}
//                       className="p-1 rounded-md hover:bg-gray-100"
//                     >
//                       <span className="text-gray-600">&rsaquo;</span>
//                     </button>
//                     <button
//                       onClick={goToNextYear}
//                       className="p-1 rounded-md hover:bg-gray-100"
//                     >
//                       <span className="text-gray-600">&raquo;</span>
//                     </button>
//                   </div>
//                 </div>

//                 <div className="flex space-x-4">
//                   {/* First Month Calendar */}
//                   <div className="flex-1">
//                     <div className="grid grid-cols-7 mb-2">
//                       {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(
//                         (day, index) => (
//                           <div
//                             key={`day-header-1-${index}`}
//                             className="text-center text-sm font-medium text-gray-600"
//                           >
//                             {day}
//                           </div>
//                         )
//                       )}
//                     </div>
//                     <div className="grid grid-cols-7 gap-1">
//                       {firstMonthDays.map((dayObj, index) => {
//                         const isToday =
//                           dayObj.currentMonth &&
//                           formatDate(
//                             new Date(viewingYear, viewingMonth, dayObj.day)
//                           ) === todayFormatted;

//                         const isSelected =
//                           dayObj.currentMonth &&
//                           (formatDate(
//                             new Date(viewingYear, viewingMonth, dayObj.day)
//                           ) === startValue ||
//                             formatDate(
//                               new Date(viewingYear, viewingMonth, dayObj.day)
//                             ) === endValue);

//                         const inRange =
//                           dayObj.currentMonth &&
//                           isInRange(viewingYear, viewingMonth, dayObj.day);

//                         const isEndpoint =
//                           dayObj.currentMonth &&
//                           isRangeEnd(viewingYear, viewingMonth, dayObj.day);

//                         return (
//                           <div
//                             key={`day-1-${index}`}
//                             className={`
//                               text-center py-1.5 text-sm cursor-pointer
//                               ${!dayObj.currentMonth ? "text-gray-300" : ""}
//                               ${isToday ? "font-bold" : ""}
//                               ${
//                                 isSelected
//                                   ? "bg-blue-600 text-white rounded-full"
//                                   : ""
//                               }
//                               ${inRange && !isEndpoint ? "bg-blue-100" : ""}
//                               ${dayObj.currentMonth ? "hover:bg-gray-100" : ""}
//                             `}
//                             onClick={() =>
//                               dayObj.currentMonth &&
//                               handleDateSelect(
//                                 viewingYear,
//                                 viewingMonth,
//                                 dayObj.day
//                               )
//                             }
//                             onMouseEnter={() =>
//                               dayObj.currentMonth &&
//                               handleDateHover(
//                                 viewingYear,
//                                 viewingMonth,
//                                 dayObj.day
//                               )
//                             }
//                           >
//                             {dayObj.day}
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </div>

//                   {/* Second Month Calendar */}
//                   <div className="flex-1">
//                     <div className="grid grid-cols-7 mb-2">
//                       {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(
//                         (day, index) => (
//                           <div
//                             key={`day-header-2-${index}`}
//                             className="text-center text-sm font-medium text-gray-600"
//                           >
//                             {day}
//                           </div>
//                         )
//                       )}
//                     </div>
//                     <div className="grid grid-cols-7 gap-1">
//                       {secondMonthDays.map((dayObj, index) => {
//                         const isToday =
//                           dayObj.currentMonth &&
//                           formatDate(
//                             new Date(
//                               secondViewingYear,
//                               secondViewingMonth,
//                               dayObj.day
//                             )
//                           ) === todayFormatted;

//                         const isSelected =
//                           dayObj.currentMonth &&
//                           (formatDate(
//                             new Date(
//                               secondViewingYear,
//                               secondViewingMonth,
//                               dayObj.day
//                             )
//                           ) === startValue ||
//                             formatDate(
//                               new Date(
//                                 secondViewingYear,
//                                 secondViewingMonth,
//                                 dayObj.day
//                               )
//                             ) === endValue);

//                         const inRange =
//                           dayObj.currentMonth &&
//                           isInRange(
//                             secondViewingYear,
//                             secondViewingMonth,
//                             dayObj.day
//                           );

//                         const isEndpoint =
//                           dayObj.currentMonth &&
//                           isRangeEnd(
//                             secondViewingYear,
//                             secondViewingMonth,
//                             dayObj.day
//                           );

//                         return (
//                           <div
//                             key={`day-2-${index}`}
//                             className={`
//                               text-center py-1.5 text-sm cursor-pointer
//                               ${!dayObj.currentMonth ? "text-gray-300" : ""}
//                               ${isToday ? "font-bold" : ""}
//                               ${
//                                 isSelected
//                                   ? "bg-blue-600 text-white rounded-full"
//                                   : ""
//                               }
//                               ${inRange && !isEndpoint ? "bg-blue-100" : ""}
//                               ${dayObj.currentMonth ? "hover:bg-gray-100" : ""}
//                             `}
//                             onClick={() =>
//                               dayObj.currentMonth &&
//                               handleDateSelect(
//                                 secondViewingYear,
//                                 secondViewingMonth,
//                                 dayObj.day
//                               )
//                             }
//                             onMouseEnter={() =>
//                               dayObj.currentMonth &&
//                               handleDateHover(
//                                 secondViewingYear,
//                                 secondViewingMonth,
//                                 dayObj.day
//                               )
//                             }
//                           >
//                             {dayObj.day}
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 </div>
//               </>
//             )}

//             {calendarView === "months" && (
//               <>
//                 <div className="flex justify-between items-center mb-4">
//                   <div className="flex space-x-2">
//                     <button
//                       onClick={() => {
//                         if (selectedCalendar === "first") {
//                           setViewingYear(viewingYear - 1);
//                         } else {
//                           setSecondViewingYear(secondViewingYear - 1);
//                         }
//                       }}
//                       className="p-1 rounded-md hover:bg-gray-100"
//                     >
//                       <span className="text-gray-600">&laquo;</span>
//                     </button>
//                   </div>
//                   <span
//                     className="font-medium cursor-pointer hover:text-blue-600"
//                     onClick={() => setCalendarView("years")}
//                   >
//                     {selectedCalendar === "first"
//                       ? viewingYear
//                       : secondViewingYear}
//                   </span>
//                   <div className="flex space-x-2">
//                     <button
//                       onClick={() => {
//                         if (selectedCalendar === "first") {
//                           setViewingYear(viewingYear + 1);
//                         } else {
//                           setSecondViewingYear(secondViewingYear + 1);
//                         }
//                       }}
//                       className="p-1 rounded-md hover:bg-gray-100"
//                     >
//                       <span className="text-gray-600">&raquo;</span>
//                     </button>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-3 gap-4">
//                   {MONTH_NAMES.map((month, index) => {
//                     const isCurrentMonth =
//                       (selectedCalendar === "first" &&
//                         index === viewingMonth) ||
//                       (selectedCalendar === "second" &&
//                         index === secondViewingMonth);

//                     return (
//                       <div
//                         key={`month-${index}`}
//                         className={`
//                           py-3 text-center cursor-pointer rounded-md
//                           ${
//                             isCurrentMonth
//                               ? "bg-blue-600 text-white"
//                               : "hover:bg-gray-100"
//                           }
//                         `}
//                         onClick={() => {
//                           if (selectedCalendar === "first") {
//                             setViewingMonth(index);
//                           } else {
//                             setSecondViewingMonth(index);
//                           }
//                           setCalendarView("dates");
//                         }}
//                       >
//                         {month.substring(0, 3)}
//                       </div>
//                     );
//                   })}
//                 </div>
//               </>
//             )}

//             {calendarView === "years" && (
//               <>
//                 <div className="flex justify-between items-center mb-4">
//                   <div className="flex space-x-2">
//                     <button
//                       onClick={() => setYearRangeStart(yearRangeStart - 10)}
//                       className="p-1 rounded-md hover:bg-gray-100"
//                     >
//                       <span className="text-gray-600">&laquo;</span>
//                     </button>
//                   </div>
//                   <span className="font-medium">
//                     {yearRangeStart}-{yearRangeStart + 9}
//                   </span>
//                   <div className="flex space-x-2">
//                     <button
//                       onClick={() => setYearRangeStart(yearRangeStart + 10)}
//                       className="p-1 rounded-md hover:bg-gray-100"
//                     >
//                       <span className="text-gray-600">&raquo;</span>
//                     </button>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-3 gap-4">
//                   {Array.from({ length: 12 }, (_, i) => {
//                     const year = yearRangeStart - 1 + i;
//                     const isCurrentYear =
//                       (selectedCalendar === "first" && year === viewingYear) ||
//                       (selectedCalendar === "second" &&
//                         year === secondViewingYear);
//                     const isOutOfRange = i === 0 || i === 11; // First and last years are out of range

//                     return (
//                       <div
//                         key={`year-${year}`}
//                         className={`
//                           py-3 text-center cursor-pointer rounded-md
//                           ${
//                             isCurrentYear
//                               ? "bg-blue-600 text-white"
//                               : "hover:bg-gray-100"
//                           }
//                           ${isOutOfRange ? "text-gray-300" : ""}
//                         `}
//                         onClick={() => {
//                           if (isOutOfRange) return;
//                           if (selectedCalendar === "first") {
//                             setViewingYear(year);
//                           } else {
//                             setSecondViewingYear(year);
//                           }
//                           setCalendarView("months");
//                         }}
//                       >
//                         {year}
//                       </div>
//                     );
//                   })}
//                 </div>
//               </>
//             )}

//             {/* Footer with buttons */}
//             <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end space-x-2">
//               <button
//                 className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
//                 onClick={() => {
//                   onChange("", "");
//                   // Reset to current month and year
//                   const currentDate = new Date();
//                   setViewingMonth(currentDate.getMonth());
//                   setViewingYear(currentDate.getFullYear());

//                   // Set second month to next month, handling year change for December
//                   const nextMonth =
//                     currentDate.getMonth() === 11
//                       ? 0
//                       : currentDate.getMonth() + 1;
//                   const nextMonthYear =
//                     currentDate.getMonth() === 11
//                       ? currentDate.getFullYear() + 1
//                       : currentDate.getFullYear();
//                   setSecondViewingMonth(nextMonth);
//                   setSecondViewingYear(nextMonthYear);

//                   // Reset calendar view to dates
//                   setCalendarView("dates");
//                   //   setIsCalendarOpen(false);
//                 }}
//               >
//                 Clear
//               </button>
//               <button
//                 className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
//                 onClick={() => setIsCalendarOpen(false)}
//               >
//                 Apply
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DateRangeFilter;
