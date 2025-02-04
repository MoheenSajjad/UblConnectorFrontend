import React from "react";

enum TableAlign {
  LEFT = "left",
  CENTER = "center",
  RIGHT = "right",
}

// Create a context to share the bordered state across all table subcomponents
interface TableContextType {
  bordered: boolean;
}
const TableContext = React.createContext<TableContextType>({ bordered: false });

type TableProps = {
  head?: React.ReactNode;
  footer?: React.ReactNode;
  body?: React.ReactNode;
  emptyState?: React.ReactNode;
  bordered?: boolean;
};

type TableComponent = {
  (props: TableProps): JSX.Element;
  Align: typeof TableAlign;
  Row: typeof TableRow;
  Header: typeof TableHeader;
  Cell: typeof TableCell;
};

export const Table: TableComponent = ({
  head,
  body,
  emptyState,
  footer,
  bordered = false,
}) => {
  const isEmpty = React.Children.count(body) === 0;

  return (
    <TableContext.Provider value={{ bordered }}>
      <div className="overflow-x-auto overflow-y-auto custom-scroll relative">
        <table className="min-w-full rounded-lg overflow-hidden">
          <thead className="sticky top-0 bg-[#2f7bb9] shadow-sm z-10 rounded-t-lg">
            {head}
          </thead>
          <tbody>
            {isEmpty ? (
              <TableRow>
                <TableCell align={TableAlign.CENTER} colSpan={100}>
                  {emptyState || "No data available"}
                </TableCell>
              </TableRow>
            ) : (
              body
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
}

export const TableRow = ({ children }: TableRowProps): JSX.Element => {
  const { bordered } = React.useContext(TableContext);
  return (
    <tr
      className={` transition  duration-150 ease-in-out ${
        bordered ? "border-b border-[#d3d0d0]" : "border-b border-gray-300"
      }`}
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
  classname?: string;
  colSpan?: number;
};

export const TableCell = ({
  align = TableAlign.CENTER,
  children,
  classname,
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
      className={`px-3 py-[1px]  whitespace-nowrap text-sm tracking-wider font-normal text-[#2b2e27] ${alignmentClass} ${
        bordered ? "border-l border-r border-[#d3d0d0]" : ""
      } ${classname || ""}`}
    >
      {children}
    </td>
  );
};

Table.Align = TableAlign;
Table.Row = TableRow;
Table.Header = TableHeader;
Table.Cell = TableCell;
