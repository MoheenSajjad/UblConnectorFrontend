import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
} from "@/components/ui/popover";
import { OrderLine } from "@/types/sap";
import { Table } from "@/components/ui/Table";

interface DocumentLineSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentLines: OrderLine[];
  onSelectLine: (line: OrderLine) => void;
}

export const OrderLineSelectionModal: React.FC<
  DocumentLineSelectionModalProps
> = ({ isOpen, onClose, documentLines, onSelectLine }) => {
  const [selectedLine, setSelectedLine] = useState<OrderLine | null>(null);

  if (!isOpen) return null;

  const handleSelect = (line: OrderLine, rowIndex: number) => {
    setSelectedLine(line);
  };

  const handleConfirm = () => {
    if (selectedLine) {
      onSelectLine(selectedLine);
      onClose();
    }
  };

  return (
    <div className="w-full ">
      <Popover onClose={onClose} size={Popover.Size.LARGE}>
        <PopoverHeader onClose={onClose}>Select Document Line</PopoverHeader>
        <PopoverContent>
          <div className="px-4">
            <Table
              bordered
              isLoading={false}
              head={
                <Table.Row>
                  <Table.Header value="#" />
                  <Table.Header value="Item Code" />
                  <Table.Header value="Description" />
                  <Table.Header value="Quantity" />
                  <Table.Header value="Price" />
                  <Table.Header value="Action" />
                </Table.Row>
              }
              body={
                documentLines && documentLines.length > 0
                  ? documentLines.map((line, index) => (
                      <Table.Row
                        key={line.LineNum}
                        className={
                          selectedLine?.LineNum === line.LineNum
                            ? "bg-blue-50"
                            : ""
                        }
                      >
                        <Table.Cell>{index + 1}</Table.Cell>
                        <Table.Cell>{line.ItemCode}</Table.Cell>
                        <Table.Cell>{line.ItemDescription}</Table.Cell>
                        <Table.Cell>{line.Quantity}</Table.Cell>
                        <Table.Cell>{line.Price.toFixed(2)}</Table.Cell>
                        <Table.Cell>
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => handleSelect(line, index)}
                              className={`rounded-md px-3 py-1.5 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
            ${
              selectedLine?.LineNum === line.LineNum
                ? "bg-blue-600 text-white hover:bg-blue-500"
                : "bg-white text-blue-600 border border-blue-600 hover:bg-blue-50"
            }`}
                            >
                              Select
                            </button>
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    ))
                  : null
              }
            />
          </div>

          <PopoverFooter>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!selectedLine}
              className={`inline-flex justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
                    ${
                      selectedLine
                        ? "bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline-blue-600"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
            >
              Confirm Selection
            </button>
            <button
              type="button"
              className="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              onClick={onClose}
            >
              Cancel
            </button>
          </PopoverFooter>
        </PopoverContent>
      </Popover>
    </div>
  );
};
