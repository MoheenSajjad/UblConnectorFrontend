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
import { useModal } from "@/hooks/use-modal";
import { OrderCodeSelectmodal } from "../order-code-select-modal";

export const LineItemsStep = ({
  data,
  handleInvoiceLineUpdate,
  handelInvoiceCodeUpdate,
}: {
  data: Invoice;
  handleInvoiceLineUpdate: (
    lineId: string,
    field: keyof InvoiceLine,
    value: string | number
  ) => void;
  handelInvoiceCodeUpdate: (
    lineId: string,
    newCode: string,
    newValue: number
  ) => void;
}) => {
  const { isOpen, openModal, closeModal } = useModal();

  const {
    isOpen: isOrderCodeModalOpen,
    openModal: openOrderCodeModal,
    closeModal: closeOrderCodeModal,
  } = useModal();

  const [clickedRow, setClickedRow] = useState<string | null>(null);

  const { id } = useParams();

  const fetchSAPVatGroupCodes = useCallback(
    () => getSAPVatGroupCodes(id),
    [id]
  );

  const { data: VatGroupCodes, isLoading: VatGroupCodesLoading } =
    useFetch<VATGroupResponse>(fetchSAPVatGroupCodes, {
      autoFetch: true,
    });

  const handleOpenModal = (lineItemId: string) => {
    setClickedRow(lineItemId);
    openModal();
  };

  const handelOpenOrderCodeModal = (lineItemId: string) => {
    setClickedRow(lineItemId);
    openOrderCodeModal();
  };

  const handleCloseModal = () => closeModal();

  const handleVatGroupSelect = (item: InvoiceLine, selectedCode: VatGroup) => {
    handleInvoiceLineUpdate(item.ID, "selectedVat", selectedCode?.Code);
  };

  const handleVatUnSelect = (itemId: string, field: keyof InvoiceLine) => {
    handleInvoiceLineUpdate(itemId, field, "");
    if (field === "selectedCode")
      handleInvoiceLineUpdate(itemId, "selectedLine", "");
  };

  const handleSelectLine = (line: OrderLine) => {
    if (!clickedRow) return;
    handleInvoiceLineUpdate(clickedRow, "selectedVat", line.VatGroup);
    handleInvoiceLineUpdate(clickedRow, "selectedBaseEntry", line.DocEntry);
    handleInvoiceLineUpdate(clickedRow, "selectedLineNum", line.LineNum);

    if (data?.selectedDocType === "I") {
      handleInvoiceLineUpdate(clickedRow, "selectedLine", line?.ItemCode);
    } else {
      handleInvoiceLineUpdate(clickedRow, "selectedLine", line?.AccountCode);
    }
    closeModal();
  };

  const handleCodeSelect = (selectedCode: OrderCode) => {
    if (!clickedRow) return;
    handelInvoiceCodeUpdate(
      clickedRow,
      selectedCode.CardCode,
      selectedCode.DocEntry
    );
    handleInvoiceLineUpdate(clickedRow, "selectedLine", "");
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
            <div className="col-span-2 text-center">VAT</div>
            <div className="col-span-3 text-center">ITEM NAME</div>
            <div className="col-span-1 text-center">QTY</div>
            <div className="col-span-1 text-center">PRICE</div>
            <div className="col-span-1 text-center">AMOUNT</div>
          </div>

          <div>
            {data?.InvoiceLine.map((item: InvoiceLine, index) => (
              <div
                key={index}
                className={`grid grid-cols-12 gap-2 p-2 items-center`}
              >
                <div className="col-span-2">
                  <button
                    className={`inline-flex w-full justify-center rounded-md  px-3 py-2 text-sm font-semibold text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                      item.selectedCode.Code ? "bg-blue-500" : "bg-gray-400"
                    } ${!data.selectedBusinessPartner ? "bg-gray-300" : ""}`}
                    title={
                      !data.selectedBusinessPartner
                        ? "Please Select Business Partner"
                        : undefined
                    }
                    onClick={() =>
                      data.selectedBusinessPartner &&
                      handelOpenOrderCodeModal(item.ID)
                    }
                  >
                    {item.selectedCode?.Value
                      ? `Selected`
                      : "Select Order Code"}
                  </button>
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
                        ? "Please Select Code First"
                        : undefined
                    }
                  >
                    {item.selectedLine ? `Selected` : "Select Document Line"}
                  </button>
                </div>
                <div className="col-span-2">
                  <VATGroupDropdown
                    placeholder={
                      VatGroupCodesLoading ? "Loading..." : "Select Code..."
                    }
                    options={VatGroupCodes?.value ?? []}
                    selectedItem={item?.selectedVat}
                    onSelect={(selectedItem) =>
                      handleVatGroupSelect(item, selectedItem)
                    }
                    clearSelection={() =>
                      handleVatUnSelect(item?.ID, "selectedVat")
                    }
                    isDisabled={VatGroupCodesLoading || data.isPayloadSaved}
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
                    {Number(item?.Price?.PriceAmount).toFixed(2)}{" "}
                    {data?.DocumentCurrencyCode}
                  </span>
                </div>
                <div className="col-span-1 text-center bg-gray-100 p-1 rounded text-gray-600">
                  {(
                    Number(item.InvoicedQuantity) *
                    Number(item.Price?.PriceAmount)
                  ).toFixed(2)}{" "}
                  {data?.DocumentCurrencyCode}
                </div>
                {isOpen && clickedRow == item?.ID && (
                  <OrderLineSelectionModal
                    isOpen={isOpen}
                    onClose={handleCloseModal}
                    selectedLine={item.selectedLine}
                    selectedReferenceCode={data.selectedReferenceCode}
                    onSelectLine={(line: OrderLine) => {
                      handleSelectLine(line);
                    }}
                    docEntry={item?.selectedCode.Value}
                    cardCode={item?.selectedCode.Code}
                    transactionId={id}
                    isDisabled={data.isPayloadSaved}
                  />
                )}
                {isOrderCodeModalOpen &&
                  data.selectedBusinessPartner &&
                  data.selectedDocType &&
                  data.selectedReferenceCode &&
                  clickedRow == item?.ID && (
                    <OrderCodeSelectmodal
                      isOpen={isOrderCodeModalOpen}
                      onClose={closeOrderCodeModal}
                      onSelectCode={(orderCode: OrderCode) => {
                        handleCodeSelect(orderCode);
                      }}
                      prevSelectedCode={item.selectedCode}
                      transactionId={id}
                      selectedBusinessPartner={data.selectedBusinessPartner}
                      selectedDocType={data.selectedDocType}
                      selectedReferenceCode={data.selectedReferenceCode}
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
