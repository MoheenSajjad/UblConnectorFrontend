import * as React from "react";

type EditIconProps = {
  className?: string;
};

export const EditIcon = ({ className }: EditIconProps): JSX.Element => {
  return (
    /* eslint-disable max-len */
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#131414"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-square-pen"
    >
      <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
    </svg>
    /* eslint-disable max-len */
  );
};
