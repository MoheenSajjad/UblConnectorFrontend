import * as React from "react";

type SvgIconProps = {
  width: number;
  height: number;
  className?: string;
  children: React.ReactNode;
  fill?: string;
};

export const SvgIcon = (props: SvgIconProps): JSX.Element => {
  const { width, height, className, children, fill = "currentColor" } = props;

  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox={`0 0 1024 1024`}
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  );
};
