import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
} from "@/components/ui/popover";
import { OrderLine, OrderLineResponse } from "@/types/sap";
import { Table } from "@/components/ui/Table";
import {
  getSAPGoodReceiptLines,
  getSAPPurchaseOrderLines,
} from "@/services/sapService";
import { Loading } from "@/components/ui/Loading";
import { TextInput } from "@/components/ui/text-input";
import { SearchIcon } from "@/components/icons";

interface DocumentLineSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLine: (line: OrderLine) => void;
  selectedLine: string;
  selectedReferenceCode: string;
  docEntry: number;
  cardCode: string;
  transactionId?: string;
  isDisabled?: boolean;
}

export const OrderLineSelectionModal: React.FC<
  DocumentLineSelectionModalProps
> = ({
  isOpen,
  onClose,
  onSelectLine,
  selectedLine,
  selectedReferenceCode,
  docEntry,
  cardCode,
  transactionId,
  isDisabled = false,
}) => {
  const [selectLine, setSelectLine] = useState<OrderLine | null>(null);
  const [orderCodesLines, setOrderCodesLines] = useState<OrderLine[] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchOrderLines = async () => {
    if (!docEntry || !cardCode) return;

    try {
      setIsLoading(true);
      setError(null);

      const response =
        selectedReferenceCode === "po"
          ? await getSAPPurchaseOrderLines(transactionId, docEntry, cardCode)
          : await getSAPGoodReceiptLines(transactionId, docEntry, cardCode);

      const orderLineData: OrderLineResponse = response;
      setOrderCodesLines(orderLineData?.value[0]?.DocumentLines || []);
    } catch (error) {
      setError("Failed to load order lines. Please try again.");
      console.error("Error fetching order lines:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchOrderLines();
    } else {
      setOrderCodesLines(null);
      setSelectLine(null);
    }
  }, [isOpen, docEntry, cardCode, selectedReferenceCode]);

  useEffect(() => {
    if (isOpen && selectedLine && orderCodesLines) {
      const preselectedLine =
        orderCodesLines.find((line) => line.ItemCode === selectedLine) || null;
      setSelectLine(preselectedLine);
    }
  }, [isOpen, selectedLine, orderCodesLines]);

  const handleSelect = (line: OrderLine) => {
    setSelectLine(line);
  };

  const handleConfirm = () => {
    if (selectLine) {
      onSelectLine(selectLine);
      onClose();
    }
  };

  const filteredData = orderCodesLines?.filter(
    (item) =>
      item?.ItemCode?.includes(searchTerm) ||
      item?.ItemDescription?.includes(searchTerm) ||
      String(item.Quantity)?.includes(searchTerm) ||
      String(item.Price)?.includes(searchTerm)
  );

  return isOpen ? (
    <div className="w-full">
      <Popover onClose={onClose} size={Popover.Size.LARGE}>
        <PopoverHeader onClose={onClose}>
          Selected{" "}
          {selectedReferenceCode === "po" ? "Purchase Order" : "Good Receipt"} (
          {cardCode} - {docEntry})
        </PopoverHeader>
        <Loading isLoading={isLoading}>
          <PopoverContent>
            <div className="px-4">
              {error && <p className="text-red-500">{error}</p>}
              <TextInput
                placeholder="Search..."
                icon={<SearchIcon />}
                onChange={(value) => setSearchTerm(value)}
              />
              <Table
                className="-mt-4"
                bordered
                isLoading={false}
                head={
                  <Table.Row className="-mt-5">
                    <Table.Header value="#" />
                    <Table.Header value="Item Code" />
                    <Table.Header value="Description" />
                    <Table.Header value="Quantity" />
                    <Table.Header value="Price" />
                    <Table.Header value="Action" />
                  </Table.Row>
                }
                body={
                  filteredData && filteredData.length > 0 ? (
                    filteredData.map((line, index) => (
                      <Table.Row
                        key={line.LineNum}
                        className={
                          selectLine?.LineNum === line.LineNum
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
                          <button
                            onClick={() => handleSelect(line)}
                            className={`rounded-md px-3 py-1.5 text-sm font-semibold shadow-sm focus-visible:outline 
                              ${
                                selectLine?.LineNum === line.LineNum
                                  ? "bg-blue-600 text-white hover:bg-blue-500"
                                  : "bg-white text-blue-600 border border-blue-600 hover:bg-blue-50"
                              }`}
                            disabled={isDisabled}
                          >
                            {selectLine?.LineNum === line.LineNum
                              ? "Selected"
                              : "Select"}
                          </button>
                        </Table.Cell>
                      </Table.Row>
                    ))
                  ) : (
                    <Table.Row>
                      <Table.Cell colSpan={6} className="text-center">
                        No order lines available.
                      </Table.Cell>
                    </Table.Row>
                  )
                }
              />
            </div>

            <PopoverFooter>
              {!isDisabled && (
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={!selectLine}
                  className={`inline-flex justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm 
                ${
                  selectLine
                    ? "bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline-blue-600"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                >
                  Confirm Selection
                </button>
              )}
              <button
                type="button"
                className="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm 
                ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                onClick={onClose}
              >
                Cancel
              </button>
            </PopoverFooter>
          </PopoverContent>
        </Loading>
      </Popover>
    </div>
  ) : null;
};
