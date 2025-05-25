import React, { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
} from "@/components/ui/popover";
import { Table } from "@/components/ui/Table";
import { Loading } from "@/components/ui/Loading";
import { TextInput } from "@/components/ui/text-input";
import { SearchIcon } from "@/components/icons";
import {
  getSAPGoodReceiptCodes,
  getSAPPurchaseOrderCodes,
} from "@/services/sapService";
import { OrderCode, OrderCodeResponse } from "@/types/sap";
import { selectedCodeItem } from "@/types/invoice";

interface OrderCodeSelectmodalProps {
  isOpen: boolean;
  onClose: () => void;
  prevSelectedCode: selectedCodeItem;
  selectedBusinessPartner: string;
  selectedDocType: string;
  transactionId: string | undefined;
  onSelectCode: (orderCode: OrderCode) => void;
  isDisabled?: boolean;
}

export const OrderCodeSelectmodal: React.FC<OrderCodeSelectmodalProps> = ({
  isOpen,
  onClose,
  prevSelectedCode,
  selectedBusinessPartner,
  selectedDocType,
  transactionId,
  isDisabled,
  onSelectCode,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderCodes, setOrderCodes] = useState<OrderCode[] | null>(null);
  const [selectedCode, setSelectedCode] = useState<OrderCode | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isOpen && prevSelectedCode && orderCodes) {
      const preSelectedCode =
        orderCodes?.find(
          (code) =>
            code.DocEntry === prevSelectedCode.Value &&
            code.CardCode === prevSelectedCode.Code
        ) || null;
      setSelectedCode(preSelectedCode);
    }
  }, [isOpen, prevSelectedCode, orderCodes]);

  const fetchOrderCode = async () => {
    if (!transactionId || !selectedDocType) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await getSAPPurchaseOrderCodes(
        transactionId,
        selectedBusinessPartner,
        selectedDocType
      );

      const data: OrderCodeResponse = response.data;
      console.log(data.value);

      setOrderCodes(data.value);
    } catch (error) {
      setError("Failed to load order codes. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchOrderCode();
    }
  }, [isOpen, selectedDocType, selectedBusinessPartner]);

  const filteredData = orderCodes?.filter(
    (item) =>
      item.CardCode?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      item.CardName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      String(item.DocEntry).includes(searchTerm?.toLowerCase()) ||
      String(item.DocNum)?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  const handleSelect = (orderCode: OrderCode) => {
    setSelectedCode(orderCode);
  };

  function isItemSelected(orderCode: OrderCode) {
    return selectedCode?.DocEntry === orderCode.DocEntry;
  }

  const handleConfirm = () => {
    if (selectedCode) {
      onSelectCode(selectedCode);
      onClose();
    }
  };

  return (
    <Popover onClose={onClose} size={Popover.Size.MEDIUM}>
      <PopoverHeader onClose={onClose}>
        Select Purchase Order Code
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
                  <Table.Header value="Card Code" />
                  <Table.Header value="Card Name" />
                  <Table.Header value="docEntry" />
                  <Table.Header value="DocNum" />{" "}
                  <Table.Header value="Action" />
                </Table.Row>
              }
              body={
                filteredData && filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <Table.Row key={index} isSelected={isItemSelected(item)}>
                      <Table.Cell>{index + 1}</Table.Cell>
                      <Table.Cell>{item.CardCode ?? "-"}</Table.Cell>
                      <Table.Cell>{item.CardName ?? "-"}</Table.Cell>
                      <Table.Cell>{item.DocEntry}</Table.Cell>
                      <Table.Cell>{item.DocNum}</Table.Cell>

                      <Table.Cell>
                        <button
                          onClick={() => handleSelect(item)}
                          className={`rounded-md px-3 py-1.5 text-sm font-semibold shadow-sm focus-visible:outline
                              ${
                                isItemSelected(item)
                                  ? "bg-blue-600 text-white hover:bg-blue-500"
                                  : "bg-white text-blue-600 border border-blue-600 hover:bg-blue-50"
                              } `}
                          disabled={isDisabled}
                        >
                          {isItemSelected(item) ? "Selected" : "Select"}
                        </button>
                      </Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row>
                    <Table.Cell colSpan={7} className="text-center">
                      No order codes available.
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
                disabled={!selectedCode}
                className={`inline-flex justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm 
                ${
                  selectedCode
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
  );
};
