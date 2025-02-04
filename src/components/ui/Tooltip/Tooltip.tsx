import React, { ReactNode, useState } from "react";
import "./Tooltip.css";

const Position = {
  TopRight: "top-right",
  TopLeft: "top-left",
  TopCenter: "top-center",
  BottomRight: "bottom-right",
  BottomLeft: "bottom-left",
  BottomCenter: "bottom-center",
  Left: "left",
  Right: "Right",
  Top: "top",
  Bottom: "bottom",
} as const;

type PositionType = (typeof Position)[keyof typeof Position];

interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: PositionType;
  className?: string;
}

const Tooltip = ({
  children,
  content,
  position = Position.TopCenter,
  className = "",
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const getPositionClasses = (pos: PositionType) => {
    const base = "absolute z-50 transform rounded-md";
    const diamond =
      "w-[10px] h-[10px] bg-gray-800 absolute transform rotate-45";

    switch (pos) {
      case Position.Left:
        return {
          tooltip: `${base} right-full top-1 -translate-y-1/2 mr-3`,
          diamond: `${diamond} -right-0 top-1/2 -translate-y-1/2 translate-x-1/2`,
        };
      case Position.Right:
        return {
          tooltip: `${base} left-full -top-0 -translate-y-1/2 ml-3`,
          diamond: `${diamond} -left-0 top-1/2 -translate-y-1/2 -translate-x-1/2`,
        };
      case Position.Top:
        return {
          tooltip: `${base} bottom-full -right-[50%]  mb-2`,
          diamond: `${diamond} -bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2`,
        };
      case Position.Bottom:
        return {
          tooltip: `${base} top-full left-1/2 -translate-x-1/2 mt-2`,
          diamond: `${diamond} -top-1 left-1/2 -translate-x-1/2 -translate-y-1/2`,
        };
      case Position.TopRight:
        return {
          tooltip: `${base} bottom-full  mb-2 translate-x-50`,
          diamond: `${diamond} -bottom-1 left-1/2 -translate-x-1/2 translate-y-1/2`,
        };
      case Position.TopLeft:
        return {
          tooltip: `${base} bottom-full right-full mb-2 translate-x-1`,
          diamond: `${diamond} -bottom-1 left-1/2 -translate-x-1/2 translate-y-1/2`,
        };
      case Position.TopCenter:
        return {
          tooltip: `${base} bottom-full -left-1/2 -translate-x-1/2 mb-2`,
          diamond: `${diamond} -bottom-0 left-1/2 translate-y-1/2`,
        };
      case Position.BottomRight:
        return {
          tooltip: `${base} top-full mt-5 -translate-x-7`,
          diamond: `${diamond} -top-0 left-5 -translate-x-1/2 -translate-y-1/2`,
        };
      case Position.BottomLeft:
        return {
          tooltip: `${base} top-full right-1/4 mt-5 -translate-x-8`,
          diamond: `${diamond} -top-0 right-2 -translate-x-1/2 -translate-y-1/2`,
        };
      case Position.BottomCenter:
        return {
          tooltip: `${base} top-full left-1/2 -translate-x-1/2 mt-2`,
          diamond: `${diamond} -top-1 left-1/2 -translate-x-1/2 -translate-y-1/2`,
        };
      default:
        return {
          tooltip: `${base} bottom-full left-1/2 -translate-x-1/2 mb-2`,
          diamond: `${diamond} -bottom-1 left-1/2 -translate-x-1/2 translate-y-1/2`,
        };
    }
  };

  const getAnimationClass = (pos: PositionType) => {
    if (pos === Position.Left) return "animate-slide-in-from-right";
    if (pos === Position.Right) return "animate-slide-in-from-left";
    if (pos.startsWith("bottom")) return "animate-slide-in-from-top";
    return "animate-slide-in-from-bottom";
  };

  const { tooltip, diamond } = getPositionClasses(position);
  const animationClass = getAnimationClass(position);

  return (
    <div
      className={`relative    ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}

      {isVisible && (
        <div className={`${tooltip}    ${animationClass}`}>
          <div className="relative">
            <div className="bg-gray-800 font-semibold rounded-lg text-white text-sm px-3 py-1  shadow-lg whitespace-nowrap">
              {content}
              <div className={diamond} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Attach Position enum to Tooltip component
(Tooltip as any).Position = Position;

export default Tooltip as typeof Tooltip & { Position: typeof Position };
