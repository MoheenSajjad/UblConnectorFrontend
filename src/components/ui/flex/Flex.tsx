import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Define enums for dot notation usage
enum Direction {
  Row = "row",
  Column = "column",
  RowReverse = "row-reverse",
  ColumnReverse = "column-reverse",
}

enum AlignItems {
  Start = "start",
  Center = "center",
  End = "end",
  Stretch = "stretch",
  Baseline = "baseline",
}

enum JustifyContent {
  Start = "start",
  Center = "center",
  End = "end",
  Between = "between",
  Around = "around",
  Evenly = "evenly",
}

interface FlexProps {
  children: ReactNode;
  className?: string;
  direction?: Direction;
  gap?: number | string;
  wrap?: boolean;
  align?: AlignItems;
  justify?: JustifyContent;
}

const baseFlex = ({
  children,
  className,
  direction = Direction.Row,
  gap,
  wrap = false,
  align = AlignItems.Center,
  justify,
}: FlexProps) => {
  const gapClass = gap ? `gap-${gap}` : "";

  // Map direction to Tailwind classes
  let flexDirection = "";
  switch (direction) {
    case Direction.Row:
      flexDirection = "flex-row";
      break;
    case Direction.Column:
      flexDirection = "flex-col";
      break;
    case Direction.RowReverse:
      flexDirection = "flex-row-reverse";
      break;
    case Direction.ColumnReverse:
      flexDirection = "flex-col-reverse";
      break;
  }

  const wrapClass = wrap ? "flex-wrap" : "flex-nowrap";

  // Map align to Tailwind classes
  let alignClass = "";
  switch (align) {
    case AlignItems.Start:
      alignClass = "items-start";
      break;
    case AlignItems.Center:
      alignClass = "items-center";
      break;
    case AlignItems.End:
      alignClass = "items-end";
      break;
    case AlignItems.Stretch:
      alignClass = "items-stretch";
      break;
    case AlignItems.Baseline:
      alignClass = "items-baseline";
      break;
  }

  // Map justify to Tailwind classes
  let justifyClass = "";
  if (justify) {
    switch (justify) {
      case JustifyContent.Start:
        justifyClass = "justify-start";
        break;
      case JustifyContent.Center:
        justifyClass = "justify-center";
        break;
      case JustifyContent.End:
        justifyClass = "justify-end";
        break;
      case JustifyContent.Between:
        justifyClass = "justify-between";
        break;
      case JustifyContent.Around:
        justifyClass = "justify-around";
        break;
      case JustifyContent.Evenly:
        justifyClass = "justify-evenly";
        break;
    }
  }

  return (
    <div
      className={cn(
        "flex",
        flexDirection,
        wrapClass,
        gapClass,
        alignClass,
        justifyClass,
        className
      )}
    >
      {children}
    </div>
  );
};

// Base Flex component
const Flex = ({
  children,
  className,
  direction = Direction.Row,
  gap,
  wrap = false,
  align = AlignItems.Center,
  justify = JustifyContent.Between,
}: FlexProps) => {
  return baseFlex({
    children,
    className,
    direction,
    gap,
    wrap,
    align,
    justify,
  });
};

// Add the enums as static properties
Flex.Direction = Direction;
Flex.AlignItems = AlignItems;
Flex.JustifyContent = JustifyContent;

// Flex with justify-content: space-between
Flex.Between = ({
  children,
  className,
  direction = Direction.Row,
  gap,
  wrap = false,
  align = AlignItems.Center,
}: Omit<FlexProps, "justify">) => {
  return baseFlex({
    children,
    className,
    direction,
    gap,
    wrap,
    align,
    justify: JustifyContent.Between,
  });
};

// Flex with justify-content: space-around
Flex.Around = ({
  children,
  className,
  direction = Direction.Row,
  gap,
  wrap = false,
  align = AlignItems.Center,
}: Omit<FlexProps, "justify">) => {
  return baseFlex({
    children,
    className,
    direction,
    gap,
    wrap,
    align,
    justify: JustifyContent.Around,
  });
};

// Flex with justify-content: space-evenly
Flex.Evenly = ({
  children,
  className,
  direction = Direction.Row,
  gap,
  wrap = false,
  align = AlignItems.Center,
}: Omit<FlexProps, "justify">) => {
  return baseFlex({
    children,
    className,
    direction,
    gap,
    wrap,
    align,
    justify: JustifyContent.Evenly,
  });
};

// Flex with justify-content: center
Flex.Center = ({
  children,
  className,
  direction = Direction.Row,
  gap,
  wrap = false,
  align = AlignItems.Center,
}: Omit<FlexProps, "justify">) => {
  return baseFlex({
    children,
    className,
    direction,
    gap,
    wrap,
    align,
    justify: JustifyContent.Center,
  });
};

// Flex with justify-content: flex-start
Flex.Start = ({
  children,
  className,
  direction = Direction.Row,
  gap,
  wrap = false,
  align = AlignItems.Center,
}: Omit<FlexProps, "justify">) => {
  return baseFlex({
    children,
    className,
    direction,
    gap,
    wrap,
    align,
    justify: JustifyContent.Start,
  });
};

// Flex with justify-content: flex-end
Flex.End = ({
  children,
  className,
  direction = Direction.Row,
  gap,
  wrap = false,
  align = AlignItems.Center,
}: Omit<FlexProps, "justify">) => {
  return baseFlex({
    children,
    className,
    direction,
    gap,
    wrap,
    align,
    justify: JustifyContent.End,
  });
};

// Column flex (direction: column) with align-items: center by default
Flex.Col = ({
  children,
  className,
  gap,
  wrap = false,
  align = AlignItems.Center,
  justify,
}: Omit<FlexProps, "direction">) => {
  return baseFlex({
    children,
    className,
    direction: Direction.Column,
    gap,
    wrap,
    align,
    justify,
  });
};

// Column flex with items centered both horizontally and vertically
Flex.ColCenter = ({
  children,
  className,
  gap,
  wrap = false,
}: Omit<FlexProps, "direction" | "align" | "justify">) => {
  return baseFlex({
    children,
    className,
    direction: Direction.Column,
    gap,
    wrap,
    align: AlignItems.Center,
    justify: JustifyContent.Center,
  });
};

export { Flex };
