import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronLast,
  ChevronFirst,
} from "lucide-react";

type PaginationProps = {
  page?: number;
  totalPages: number;
  from?: number;
  to?: number;
  total?: number;
  onPage?: (page: number) => void;
};

export const Pagination = ({
  page = 1,
  totalPages = 1,
  onPage,
  from,
  to,
  total,
}: PaginationProps): JSX.Element => {
  const generatePageNumbers = (page: number, totalPages: number) => {
    const pages: number[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
      } else if (page >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = page - 2; i <= page + 2; i++) {
          pages.push(i);
        }
      }
    }

    return pages;
  };

  const pages = generatePageNumbers(page, totalPages);

  return (
    <div className="flex items-center gap-x-3 justify-between mt-2">
      <div className="flex items-center gap-x-6">
        {/* <div>
          <p className="text-sm text-gray-700 flex gap-1">
            Showing
            <span className="font-medium">{from ?? 0}</span>
            to
            <span className="font-medium">{to ?? 0}</span>
            of
            <span className="font-medium">{total ?? 0}</span>
            results
          </p>
        </div> */}
        {/* <div className="flex items-center gap-x-2">
          <span className="text-sm text-gray-800 whitespace-nowrap dark:text-white">
            Go to
          </span>
          <input
            type="Number"
            min={1}
            // max={totalPages ?? 1}
            value={page}
            onChange={(e) => {
              const inputValue = Number(e.target.value);
              if (inputValue === 0) {
                onPage && onPage(1);
              }
              // Ensure input value is not greater than total pages
              if (inputValue <= totalPages) {
                onPage && onPage(inputValue);
              }
            }}
            onBlur={(e) => {
              const inputValue = Number(e.target.value);

              // Handle values less than 1 or greater than total pages
              if (inputValue < 1) {
                onPage && onPage(1);
              } else if (inputValue > totalPages) {
                onPage && onPage(totalPages);
              }
            }}
            className="min-h-[32px] py-1 px-2.5 block w-12 border  border-gray-200 rounded-lg text-sm text-center focus:border-blue-500 focus:ring-blue-500 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
          />

          <span className="text-sm text-gray-800 whitespace-nowrap dark:text-white">
            page
          </span>
        </div> */}
      </div>
      <div className="flex gap-x-3">
        <div className="flex items-center gap-x-1" aria-label="Pagination">
          {/* Previous Button */}
          <PaginationItem
            onClick={() => onPage && onPage(1)}
            disabled={page === 1}
            className="border  border-gray-300  "
          >
            <ChevronFirst className="w- h-5" />
          </PaginationItem>

          <PaginationItem
            onClick={() => onPage && onPage(page - 1)}
            disabled={page === 1}
            className="border  border-gray-300 "
          >
            <ChevronLeft className="w- h-5" />
          </PaginationItem>

          {/* Page Numbers */}
          <div className="flex items-center gap-x-1">
            {pages.map((pageNum, index) =>
              typeof pageNum === "number" ? (
                <PaginationItem
                  key={index}
                  isActive={pageNum === page}
                  onClick={() => onPage && onPage(pageNum)}
                >
                  {pageNum}
                </PaginationItem>
              ) : (
                <PaginationItem
                  isActive={!pages.includes(page)}
                  onClick={() => console.log("1")}
                  className="hover:text-blue-600"
                >
                  <span className=" text-xs">{pageNum}</span>
                </PaginationItem>
              )
            )}
          </div>

          {/* Next Button */}
          <PaginationItem
            onClick={() => onPage && onPage(page + 1)}
            disabled={page === totalPages}
            className="border  border-gray-300  "
          >
            <ChevronRight className="w- h-5" />
          </PaginationItem>

          {/* Last Button */}
          <PaginationItem
            onClick={() => onPage && onPage(totalPages)}
            disabled={page === totalPages}
            className="border  border-gray-300"
          >
            <ChevronLast className="w- h-5" />
          </PaginationItem>
        </div>
      </div>
    </div>
  );
};

type PaginationItemProps = {
  isActive?: boolean;
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
};

export const PaginationItem = ({
  isActive = false,
  children,
  onClick,
  disabled = false,
  className,
}: PaginationItemProps): JSX.Element => {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`min-h-[36px] min-w-[36px] flex  justify-center items-center text-gray-800 py-1 px-2 text-sm rounded-lg
      ${
        isActive
          ? "border border-[#6366f1]  text-[#6366f1] font-bold"
          : " hover:bg-gray-100"
      } 
      ${className} disabled:opacity-50 disabled:pointer-events-none`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
