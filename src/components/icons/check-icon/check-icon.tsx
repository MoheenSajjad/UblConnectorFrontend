import React from "react";

interface CheckIconProps {
  className?: string;
}

export const CheckIcon = ({ className }: CheckIconProps) => {
  return (
    <svg
      className={`w-5 h-5 text-gray-800 dark:text-white ${className}`}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      height="1em"
      width="1em"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M5 11.917 9.724 16.5 19 7.5"
      />
    </svg>
  );
};
