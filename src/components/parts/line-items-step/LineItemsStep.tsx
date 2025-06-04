import React, { useCallback, useState } from "react";

import { ChartOfAccountDropdown } from "../chart-of-account-dropdown";
import { useParams } from "react-router-dom";
import {
  GetSAPChartOfAccounts,
  GetSAPVatGroupCodes,
} from "@/services/sapService";
import {
  OrderLine,
  VATGroupResponse,
  VatGroup,
  IChartOfAccount,
} from "@/types/sap";
import { useFetch } from "@/hooks/use-fetch";
// import { OrderLineSelectionModal } from "../order-line-select-modal";
import { Invoice, InvoiceLine } from "@/types/invoice";
import { VatGroupDropdown } from "../vat-group-dropdown";
import { useModal } from "@/hooks/use-modal";

export const LineItemsStep = ({
  data,
  handleInvoiceLineUpdate,
  isDisabled = false,
}: {
  data: Invoice;
  handleInvoiceLineUpdate: (
    lineId: string,
    field: keyof InvoiceLine,
    value: string | number
  ) => void;

  isDisabled?: boolean;
}) => {
  const { id } = useParams();

  const fetchSAPVatGroupCodes = useCallback(
    () => GetSAPVatGroupCodes(id),
    [id]
  );

  const { data: vatGroups, isLoading: vatGroupsLoading } =
    useFetch<VATGroupResponse>(fetchSAPVatGroupCodes, {
      autoFetch: true,
    });

  const fetchChartOfAccounts = useCallback(
    () => GetSAPChartOfAccounts(id),
    [id]
  );

  const { data: chartOfAccounts, isLoading: chartOfAccountsLoading } = useFetch<
    IChartOfAccount[]
  >(fetchChartOfAccounts, {
    autoFetch: true,
  });

  const handleaccountCodeSelect = (
    item: InvoiceLine,
    selectedCode: VatGroup
  ) => {
    handleInvoiceLineUpdate(item.ID, "selectedVat", selectedCode?.Code);
  };

  const handleVatUnSelect = (itemId: string, field: keyof InvoiceLine) => {
    handleInvoiceLineUpdate(itemId, field, "");
    if (field === "selectedCode")
      handleInvoiceLineUpdate(itemId, "selectedLine", "");
  };

  return (
    <>
      <div className="">
        <div className="bg-white rounded-lg ">
          <div className="grid grid-cols-12 gap-4  p-2 border-b text-sm font-medium text-gray-600">
            <div className="col-span-2 text-center">G/L Account</div>
            <div className="col-span-2 text-center">VAT</div>
            <div className="col-span-3 text-center">ITEM NAME</div>
            <div className="col-span-1 text-center">QTY</div>
            <div className="col-span-1 text-center">PRICE</div>
            <div className="col-span-1 text-center">AMOUNT</div>
          </div>

          <div>
            {data?.InvoiceLine?.map((item: InvoiceLine, index) => (
              <div
                key={index}
                className={`grid grid-cols-12 gap-2 p-2 items-center`}
              >
                <div className="col-span-2">
                  <ChartOfAccountDropdown
                    placeholder={
                      chartOfAccountsLoading
                        ? "Loading..."
                        : "Select G/L Account..."
                    }
                    accounts={chartOfAccounts ?? []}
                    onSelect={(data) => {
                      handleInvoiceLineUpdate(
                        item.ID,
                        "accountCode",
                        data?.Code
                      );
                    }}
                    selectedItem={item.accountCode}
                    clearSelection={() => {
                      handleInvoiceLineUpdate(item.ID, "selectedVat", "");
                    }}
                    isDisabled={
                      chartOfAccountsLoading ||
                      (data.isPayloadSaved && isDisabled)
                    }
                  />
                </div>
                <div className="col-span-2">
                  <VatGroupDropdown
                    placeholder={
                      vatGroupsLoading ? "Loading..." : "Select Code..."
                    }
                    options={vatGroups?.value ?? []}
                    selectedItem={item?.selectedVat}
                    onSelect={(selectedItem) =>
                      handleaccountCodeSelect(item, selectedItem)
                    }
                    clearSelection={() =>
                      handleVatUnSelect(item?.ID, "selectedVat")
                    }
                    isDisabled={
                      vatGroupsLoading || (data.isPayloadSaved && isDisabled)
                    }
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
                    {data?.DocumentcurrencyCode}
                  </span>
                </div>
                <div className="col-span-1 text-center bg-gray-100 p-1 rounded text-gray-600">
                  {(
                    Number(item.InvoicedQuantity) *
                    Number(item.Price?.PriceAmount)
                  ).toFixed(2)}{" "}
                  {data?.DocumentcurrencyCode}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
