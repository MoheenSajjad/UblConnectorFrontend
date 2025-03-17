import * as React from "react";

type FilterIconProps = {
  className?: string;
};

export const SearchIcon = ({ className }: FilterIconProps): JSX.Element => {
  return (
    /* eslint-disable max-len */
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
    /* eslint-disable max-len */
  );
};
