import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { InvoiceFormData, StepProps } from "@/types/edit-payload";
import { DollarSign, Info } from "lucide-react";
import { BusinessPartnerDropdown } from "../business-partner-dropdown";
import { GoodReceiptCodeDropdown } from "../good-receipt-code-dropdown";
import { PurchaseOrderCodeDropdown } from "../purchase-order-code-dropdown";
import { useParams } from "react-router-dom";
import {
  getSAPGoodReceiptCodes,
  getSAPGoodReceiptLines,
  getSAPPurchaseOrderCodes,
  getSAPPurchaseOrderLines,
} from "@/services/sapService";
import {
  OrderCode,
  OrderLine,
  OrderCodeResponse,
  OrderLineResponse,
} from "@/types/sap";
import { useFetch } from "@/hooks/use-fetch";
import { OrderLineSelectionModal } from "../order-line-select-modal";
import { Invoice } from "@/types/invoice";

interface Item {
  name: string;
  qty: number;
  price: number;
  selectedCode: string | null;
  selectedLine: string | null;
}

export const LineItemsStep = ({ data }: { data: Invoice }) => {
  const [items, setItems] = useState<Item[]>([
    {
      name: "Coca Cola",
      qty: 12,
      price: 0.5,
      selectedCode: null,
      selectedLine: null,
    },
    {
      name: "Noodle Can",
      qty: 5,
      price: 0.75,
      selectedCode: null,
      selectedLine: null,
    },
    {
      name: "Beer",
      qty: 6,
      price: 0.5,
      selectedCode: null,
      selectedLine: null,
    },
    {
      name: "Fanta",
      qty: 8,
      price: 0.5,
      selectedCode: null,
      selectedLine: null,
    },
    {
      name: "Pepsi",
      qty: 12,
      price: 0.5,
      selectedCode: null,
      selectedLine: null,
    },
  ]);
  const [selectedDocEntry, setSelectedDocEntry] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [OrderCodesLines, setOrderCodesLines] = useState<OrderLine[] | null>(
    null
  );
  const [clickedRow, setClickedRow] = useState<number | null>(null);
  const [selectedDocumentLine, setSelectedDocumentLine] =
    useState<OrderLine | null>(null);

  const { id } = useParams();

  //#region ApiCalls

  const fetchPurchaseOrderCodes = useCallback(
    () => getSAPPurchaseOrderCodes(id),
    [id]
  );

  const fetchGoodReceiptCodes = useCallback(
    () => getSAPGoodReceiptCodes(id),
    [id]
  );

  const { data: OrderCodes, isLoading: OrderCodesLoading } =
    useFetch<OrderCodeResponse>(
      data.selectedReferenceCode === "po"
        ? fetchPurchaseOrderCodes
        : fetchGoodReceiptCodes,
      {
        autoFetch: true,
      }
    );

  const fetchOrderLines = async (docEntry: number, cardCode: string) => {
    try {
      console.log(docEntry, data.selectedBusinessPartner, cardCode);

      setIsLoading(true);
      let response;
      if (data.selectedReferenceCode === "po") {
        response = await getSAPPurchaseOrderLines(id, docEntry, cardCode);
      } else {
        response = await getSAPGoodReceiptLines(id, docEntry, cardCode);
      }

      const orderLineData: OrderLineResponse = response;

      setOrderCodesLines(orderLineData?.value[0]?.DocumentLines);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };
  //#endregion

  //#region ModalOpenCloseFunction

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  //#endregion

  const handleCodeSelect = (rowIndex: number, item: OrderCode) => {
    setItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[rowIndex].selectedCode = item.CardCode;
      updatedItems[rowIndex].selectedLine = null;
      return updatedItems;
    });
    fetchOrderLines(item.DocEntry, item.CardCode);
  };

  const handleCodeUnSelect = (rowIndex: number) => {
    setItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[rowIndex].selectedCode = null;
      updatedItems[rowIndex].selectedLine = null;
      return updatedItems;
    });
  };

  const handleSelectLine = (line: OrderLine) => {
    if (clickedRow !== null) {
      const updatedItems = [...items];
      updatedItems[clickedRow].selectedLine = line.ItemCode;
      setItems(updatedItems);
    }
    setIsModalOpen(false);
  };

  useEffect(() => {
    console.log(items);
  }, [items]);

  return (
    <>
      <div className="">
        <div className="bg-white rounded-lg ">
          <div className="grid grid-cols-12 gap-4  p-2 border-b text-sm font-medium text-gray-600">
            <div className="col-span-2 text-center">
              {"po" === "po" ? "PURCHASE ORDER CODE" : "GOOD RECEIPT CODE"}
            </div>
            <div className="col-span-2 text-center">
              {"po" === "po" ? "PURCHASE ORDER LINE" : "GOOD RECEIPT LINES"}
            </div>
            <div className="col-span-2 text-center">VAT</div>{" "}
            <div className="col-span-3 text-center">ITEM NAME</div>
            <div className="col-span-1 text-center">QTY</div>
            <div className="col-span-1 text-center">PRICE</div>
            <div className="col-span-1 text-center">AMOUNT</div>
          </div>

          <div>
            {items.map((item, index) => (
              <div
                key={index}
                className={`grid grid-cols-12 gap-2 p-2 items-center`}
              >
                <div className="col-span-2">
                  {/* {data.selectedReferenceType === "po" ? (
                    <PurchaseOrderCodeDropdown
                      placeholder="Select Code..."
                      options={OrderCodes?.value ?? []}
                      selectedItem={item.selectedCode}
                      onSelect={(selectedItem) => {
                        handleCodeSelect(index, selectedItem);
                        setClickedRow(index);
                      }}
                      clearSelection={() => handleCodeUnSelect(index)}
                      isDisabled={OrderCodesLoading}
                    />
                  ) : (
                    <GoodReceiptCodeDropdown
                      placeholder="Select Code..."
                      options={OrderCodes?.value ?? []}
                      selectedItem={item.selectedCode}
                      onSelect={(selectedItem) =>
                        handleCodeSelect(index, selectedItem)
                      }
                      clearSelection={() => handleCodeUnSelect(index)}
                      isDisabled={OrderCodesLoading}
                    />
                  )} */}
                </div>
                <div className="col-span-2 text-center">
                  <button
                    onClick={item.selectedCode ? handleOpenModal : () => {}}
                    className={`inline-flex w-full justify-center rounded-md  px-3 py-2 text-sm font-semibold text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                      item.selectedLine ? "bg-blue-500" : "bg-gray-400"
                    } ${!item.selectedCode ? "bg-gray-300" : ""}`}
                  >
                    {item.selectedLine ? `Selected` : "Select Document Line"}
                  </button>
                </div>
                <div className="col-span-2"></div>
                <div className="col-span-3 font-medium  bg-gray-100 p-1 rounded text-gray-500">
                  {item.name}
                </div>
                <div className="col-span-1 text-center bg-gray-100 p-1 rounded text-gray-500">
                  {item.qty}
                </div>
                <div className="col-span-1 text-center  bg-gray-100 p-1 rounded flex items-center justify-center">
                  <span className="text-gray-600 mr-1">
                    {item.price.toFixed(2)}
                  </span>
                  <DollarSign className="w-4 h-4 text-gray-500" />
                </div>
                <div className="col-span-1 text-center bg-gray-100 p-1 rounded text-gray-600">
                  {(item.qty * item.price).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && OrderCodesLines && (
        <OrderLineSelectionModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          documentLines={OrderCodesLines}
          onSelectLine={(line: OrderLine) => {
            handleSelectLine(line);
          }}
        />
      )}
    </>
  );
};
