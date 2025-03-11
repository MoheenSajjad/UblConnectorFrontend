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
  getSAPVatGroupCodes,
} from "@/services/sapService";
import {
  OrderCode,
  OrderLine,
  OrderCodeResponse,
  OrderLineResponse,
  VATGroupResponse,
  VatGroup,
} from "@/types/sap";
import { useFetch } from "@/hooks/use-fetch";
import { OrderLineSelectionModal } from "../order-line-select-modal";
import { Invoice, InvoiceLine } from "@/types/invoice";
import { VATGroupDropdown } from "../vat-group-dropdown";

export const LineItemsStep = ({
  data,
  handleInvoiceLineUpdate,
  handelInvoiceCodeUpdate,
}: {
  data: Invoice;
  handleInvoiceLineUpdate: (
    lineId: string,
    field: keyof InvoiceLine,
    value: string
  ) => void;
  handelInvoiceCodeUpdate: (
    lineId: string,
    newCode: string,
    newValue: number
  ) => void;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [OrderCodesLines, setOrderCodesLines] = useState<OrderLine[] | null>(
    null
  );
  const [clickedRow, setClickedRow] = useState<string | null>(null);
  const [selectedDocumentLine, setSelectedDocumentLine] =
    useState<OrderLine | null>(null);

  const { id } = useParams();

  //#region ApiCalls

  const fetchPurchaseOrderCodes = useCallback(
    () => getSAPPurchaseOrderCodes(id, data.selectedBusinessPartner),
    [id]
  );
  const fetchGoodReceiptCodes = useCallback(
    () => getSAPGoodReceiptCodes(id, data.selectedBusinessPartner),
    [id]
  );
  const fetchSAPVatGroupCodes = useCallback(
    () => getSAPVatGroupCodes(id),
    [id]
  );

  const {
    data: PurchaseOrderCodes,
    isLoading: PurchaseOrderCodesLoading,
    fetch: fetchPurchaseOrders,
  } = useFetch<OrderCodeResponse>(fetchPurchaseOrderCodes, {
    autoFetch: false,
  });

  const {
    data: GoodReceiptsOrderCodes,
    isLoading: GoodReceiptCodeLoading,
    fetch: fetchGoodReceiptOrders,
  } = useFetch<OrderCodeResponse>(fetchGoodReceiptCodes, {
    autoFetch: false,
  });

  const { data: VatGroupCodes, isLoading: VatGroupCodesLoading } =
    useFetch<VATGroupResponse>(fetchSAPVatGroupCodes, {
      autoFetch: true,
    });

  useEffect(() => {
    console.log("chaned");

    if (data.selectedBusinessPartner) {
      fetchPurchaseOrders();
      fetchGoodReceiptOrders();
    }
  }, [data.selectedBusinessPartner]);

  console.log(data);

  //#endregion

  //#region ModalOpenCloseFunction

  const handleOpenModal = (lineItemId: string) => {
    setClickedRow(lineItemId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  //#endregion

  const handleCodeSelect = (item: InvoiceLine, selectedCode: OrderCode) => {
    handelInvoiceCodeUpdate(
      item.ID,
      selectedCode.CardCode,
      selectedCode.DocEntry
    );
    handleInvoiceLineUpdate(item.ID, "selectedLine", "");
  };

  const handleVatGroupSelect = (item: InvoiceLine, selectedCode: VatGroup) => {
    handleInvoiceLineUpdate(item.ID, "selectedVat", selectedCode?.Code);
  };

  const handleCodeUnSelect = (itemId: string, field: keyof InvoiceLine) => {
    handleInvoiceLineUpdate(itemId, field, "");
    if (field === "selectedCode")
      handleInvoiceLineUpdate(itemId, "selectedLine", "");
  };

  const handleSelectLine = (line: OrderLine) => {
    if (!clickedRow) return;
    handleInvoiceLineUpdate(clickedRow, "selectedLine", line?.ItemCode);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="">
        <div className="bg-white rounded-lg ">
          <div className="grid grid-cols-12 gap-4  p-2 border-b text-sm font-medium text-gray-600">
            <div className="col-span-2 text-center">
              {data.selectedReferenceCode === "po"
                ? "PURCHASE ORDER CODE"
                : "GOOD RECEIPT CODE"}
            </div>
            <div className="col-span-2 text-center">
              {data.selectedReferenceCode === "po"
                ? "PURCHASE ORDER LINE"
                : "GOOD RECEIPT LINES"}
            </div>
            <div className="col-span-2 text-center">VAT</div>{" "}
            <div className="col-span-3 text-center">ITEM NAME</div>
            <div className="col-span-1 text-center">QTY</div>
            <div className="col-span-1 text-center">PRICE</div>
            <div className="col-span-1 text-center">AMOUNT</div>
          </div>

          <div>
            {data?.InvoiceLine.map((item, index) => (
              <div
                key={index}
                className={`grid grid-cols-12 gap-2 p-2 items-center`}
              >
                <div className="col-span-2">
                  {data.selectedReferenceCode === "po" ? (
                    <PurchaseOrderCodeDropdown
                      placeholder="Select Code..."
                      options={PurchaseOrderCodes?.value ?? []}
                      selectedItem={item.selectedCode.Value}
                      onSelect={(selectedItem) => {
                        handleCodeSelect(item, selectedItem);
                      }}
                      clearSelection={() =>
                        handleCodeUnSelect(item?.ID, "selectedCode")
                      }
                      isDisabled={PurchaseOrderCodesLoading}
                    />
                  ) : (
                    <GoodReceiptCodeDropdown
                      placeholder="Select Code..."
                      options={GoodReceiptsOrderCodes?.value ?? []}
                      selectedItem={item.selectedCode.Value}
                      onSelect={(selectedItem) =>
                        handleCodeSelect(item, selectedItem)
                      }
                      clearSelection={() =>
                        handleCodeUnSelect(item?.ID, "selectedCode")
                      }
                      isDisabled={GoodReceiptCodeLoading}
                    />
                  )}
                </div>
                <div className="col-span-2 text-center">
                  <button
                    onClick={() =>
                      item.selectedCode.Value && handleOpenModal(item?.ID)
                    }
                    disabled={!item.selectedCode.Value}
                    className={`inline-flex w-full justify-center rounded-md  px-3 py-2 text-sm font-semibold text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                      item.selectedLine ? "bg-blue-500" : "bg-gray-400"
                    } ${!item.selectedCode.Code ? "bg-gray-300" : ""}`}
                    title={
                      !item.selectedCode?.Code
                        ? "Please Selected Code First"
                        : undefined
                    }
                  >
                    {item.selectedLine ? `Selected` : "Select Document Line"}
                  </button>
                </div>
                <div className="col-span-2">
                  <VATGroupDropdown
                    placeholder="Select Code..."
                    options={VatGroupCodes?.value ?? []}
                    selectedItem={item?.selectedVat}
                    onSelect={(selectedItem) =>
                      handleVatGroupSelect(item, selectedItem)
                    }
                    clearSelection={() =>
                      handleCodeUnSelect(item?.ID, "selectedVat")
                    }
                    isDisabled={VatGroupCodesLoading}
                  />
                </div>
                <div className="col-span-3 font-medium  bg-gray-100 p-1 rounded text-gray-500">
                  {item?.Item?.Name}
                </div>
                <div className="col-span-1 text-center bg-gray-100 p-1 rounded text-gray-500">
                  {item?.InvoicedQuantity}
                </div>
                <div className="col-span-1 text-center  bg-gray-100 p-1 rounded flex items-center justify-center">
                  <span className="text-gray-600 mr-1">
                    {Number(item?.Price?.PriceAmount).toFixed(2)}
                  </span>
                  <DollarSign className="w-4 h-4 text-gray-500" />
                </div>
                <div className="col-span-1 text-center bg-gray-100 p-1 rounded text-gray-600">
                  {(
                    Number(item.InvoicedQuantity) *
                    Number(item.Price?.PriceAmount)
                  ).toFixed(2)}
                </div>
                {isModalOpen && clickedRow == item?.ID && (
                  <OrderLineSelectionModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    selectedLine={item.selectedLine}
                    selectedReferenceCode={data.selectedReferenceCode}
                    onSelectLine={(line: OrderLine) => {
                      handleSelectLine(line);
                    }}
                    docEntry={item?.selectedCode.Value}
                    cardCode={item?.selectedCode.Code}
                    transactionId={id}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
