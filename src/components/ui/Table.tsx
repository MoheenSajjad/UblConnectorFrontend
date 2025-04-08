import React from "react";
import { TableSkeleton } from "./table-skeleton";
import { Empty } from "./Empty";

export enum TableAlign {
  LEFT = "left",
  CENTER = "center",
  RIGHT = "right",
}

interface TableContextType {
  bordered: boolean;
}
const TableContext = React.createContext<TableContextType>({ bordered: false });

type TableProps = {
  head?: React.ReactNode;
  footer?: React.ReactNode;
  body?: React.ReactNode;
  bordered?: boolean;
  isLoading: boolean;
  className?: string;
};

type TableComponent = {
  (props: TableProps): JSX.Element;
  Align: typeof TableAlign;
  Row: typeof TableRow;
  Header: typeof TableHeader;
  Cell: typeof TableCell;
  Empty: typeof TableEmpty;
};

export const Table: TableComponent = ({
  head,
  body,
  footer,
  bordered = false,
  isLoading = true,
  className,
}) => {
  const isEmpty = React.Children.count(body) === 0;

  return (
    <TableContext.Provider value={{ bordered }}>
      <div
        className={`overflow-x-auto overflow-y-auto custom-scroll relative ${className}`}
      >
        <table className="min-w-full rounded-lg overflow-hidden">
          <thead className="sticky top-0 bg-[#2f7bb9] shadow-sm z-10 rounded-t-lg">
            {head}
          </thead>
          <tbody>
            {isLoading && (
              <TableRow>
                <TableCell
                  align={TableAlign.CENTER}
                  colSpan={100}
                  className="py-2"
                >
                  <TableSkeleton count={8} />
                </TableCell>
              </TableRow>
            )}
            {!isEmpty && !isLoading && body}
            {isEmpty && !isLoading && (
              <TableRow>
                <TableCell
                  align={TableAlign.CENTER}
                  colSpan={100}
                  className="py-6"
                >
                  <Empty />
                </TableCell>
              </TableRow>
            )}
          </tbody>
        </table>
        <div className="bg-white z-10 w-full rounded-b-lg">{footer}</div>
      </div>
    </TableContext.Provider>
  );
};

interface TableRowProps {
  children?: React.ReactNode;
  className?: string;
  isSelected?: boolean;
}

export const TableRow = ({
  children,
  className,
  isSelected = false,
}: TableRowProps): JSX.Element => {
  const { bordered } = React.useContext(TableContext);
  return (
    <tr
      className={` transition  duration-150  ease-in-out  ${
        bordered ? "border-b border-[#d3d0d0]" : "border-b border-gray-300"
      }
      ${isSelected && "bg-blue-50"} ${className}`}
    >
      {children}
    </tr>
  );
};

type TableHeaderProps = {
  value?: string;
  align?: TableAlign;
  className?: string;
};

export const TableHeader = ({
  value,
  align = TableAlign.CENTER,
  className = "",
}: TableHeaderProps): JSX.Element => {
  const { bordered } = React.useContext(TableContext);
  const alignmentClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[align as "left" | "center" | "right"];

  return (
    <th
      scope="col"
      className={`px-3 py-[8px] text-left text-xs font-bold text-white uppercase tracking-wider ${alignmentClass} ${
        bordered ? "border-r border-[#d3d0d0]" : ""
      } ${className}`}
    >
      {value}
    </th>
  );
};

type TableCellProps = {
  align?: TableAlign;
  children?: React.ReactNode;
  className?: string;
  colSpan?: number;
};

export const TableCell = ({
  align = TableAlign.CENTER,
  children,
  className,
  colSpan,
}: TableCellProps): JSX.Element => {
  const { bordered } = React.useContext(TableContext);
  const alignmentClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[align as "left" | "center" | "right"];

  return (
    <td
      colSpan={colSpan}
      className={`px-3 py-1 whitespace-nowrap text-sm tracking-wider font-normal text-[#2b2e27] ${alignmentClass} ${
        bordered ? "border-l border-r border-[#d3d0d0]" : ""
      } ${className || ""}`}
    >
      {children}
    </td>
  );
};

export const TableEmpty = () => {
  return (
    <TableRow>
      <TableCell align={TableAlign.CENTER} colSpan={100} className="py-6">
        <Empty />
      </TableCell>
    </TableRow>
  );
};

Table.Align = TableAlign;
Table.Row = TableRow;
Table.Header = TableHeader;
Table.Cell = TableCell;
Table.Empty = TableEmpty;
