import React from "react";

enum GridCellSize {
  S3 = "s3",
  S4 = "s4",
  S6 = "s6",
  S8 = "s8",
  S12 = "s12",
}

type GridComponent = {
  (props: GridProps): JSX.Element;
  CellSize: typeof GridCellSize;
  Cell: typeof GridCell;
};

type GridProps = {
  children?: React.ReactNode;
  className?: string;
};

export const Grid: GridComponent = ({
  children,
  className,
}: GridProps): JSX.Element => {
  return (
    <div className={`flex  items-center justify-start flex-wrap ${className}`}>
      {children}
    </div>
  );
};

type GridCellProps = {
  size?: GridCellSize;
  children?: React.ReactNode;
  className?: string;
};

export const GridCell = ({
  size = GridCellSize.S4,
  children,
  className,
}: GridCellProps): JSX.Element => {
  const sizeClass = {
    [GridCellSize.S3]: "w-full md:w-1/3",
    [GridCellSize.S4]: "w-full md:w-1/3",
    [GridCellSize.S6]: "w-full md:w-1/2",
    [GridCellSize.S8]: "w-full md:w-2/3",
    [GridCellSize.S12]: "w-full",
  }[size];

  return (
    <div
      className={`flex flex-row items-start justify-start px-3 min-w-[250px]  ${sizeClass} ${className}`}
    >
      {children}
    </div>
  );
};

Grid.Cell = GridCell;
Grid.CellSize = GridCellSize;
