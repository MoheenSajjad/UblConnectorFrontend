import * as React from "react";
import clsx from "clsx";

enum IconButtonVariant {
  LIGHT = "light",
  DARK = "dark",
}

type IconButtonProps = {
  variant?: IconButtonVariant;
  icon?: React.ReactNode;
  isDisabled?: boolean;
  isSmall?: boolean;
  bordered?: boolean;
  className?: string;
  onClick?: () => void;
};

type IconButtonComponent = {
  (props: IconButtonProps): JSX.Element;
  Variant: typeof IconButtonVariant;
};

export const IconButton: IconButtonComponent = ({
  variant = IconButtonVariant.LIGHT,
  icon,
  isDisabled = false,
  bordered = false,
  isSmall = false,
  className,
  onClick,
}: IconButtonProps): JSX.Element => {
  const rootCls = clsx(
    "flex items-center justify-center  rounded-full  transition-all duration-300",
    bordered ? "border" : "border-none",
    isSmall ? "h-8 w-8 text-sm" : "h-9 w-9 text-lg",
    variant === IconButtonVariant.DARK
      ? "bg-gray-700 text-white hover:bg-gray-600 active:bg-gray-800 disabled:bg-gray-500"
      : "bg-transparent text-gray-700 hover:bg-gray-200 active:bg-gray-300 disabled:text-gray-400",
    "focus:outline-none",
    "disabled:cursor-not-allowed",
    className
  );

  return (
    <button
      className={rootCls}
      type="button"
      disabled={isDisabled}
      onClick={onClick}
    >
      {icon}
    </button>
  );
};

IconButton.Variant = IconButtonVariant;
