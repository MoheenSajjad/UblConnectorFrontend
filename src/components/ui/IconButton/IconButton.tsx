import { LucideIcon } from "lucide-react";
import React from "react";

interface IconButtonProps {
  Icon: JSX.Element;
  onClick: () => void;
  className?: string;
}

const IconButton = ({ Icon, onClick, className }: IconButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        inline-flex items-center justify-center
        p-2
        rounded-full
        transition-colors
        duration-200
        hover:bg-gray-100
        ${className || ""}
      `}
    >
      {Icon}
    </button>
  );
};

export default IconButton;
