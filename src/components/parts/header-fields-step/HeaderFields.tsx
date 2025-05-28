import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { StepProps } from "@/types/edit-payload";
import { Grid, GridCell } from "@/components/ui/grid";
import { TextInput, TextInputControlType } from "@/components/ui/text-input";
import { TextInputControl } from "@/components/ui/text-input-control";
import { ReferenceDropdown } from "../reference-dropdown";
import { BusinessPartnerDropdown } from "../business-partner-dropdown";
import { Invoice, selectedCodeItem } from "@/types/invoice";
import { DocTypeDropdown } from "../doctype-dropdown/DocTypeDropdown";
import { useNotify } from "@/components/ui/Notify";
import { useModal } from "@/hooks/use-modal";
import { OrderCode } from "@/types/sap";
import { useParams } from "react-router-dom";
import { OrderCodeSelectmodal } from "../order-code-select-modal";
import { GrnCodeSelectmodal } from "../grn-code-select-modal copy";

export const HeaderFields = ({
  data,
  selectedReferenceType,
  handelFieldUpdate,
  isDisabled = false,
}: {
  data: Invoice;
  selectedReferenceType: string;
  handelFieldUpdate: (
    name: keyof Invoice,
    value: string | selectedCodeItem | selectedCodeItem[]
  ) => void;
  isDisabled?: boolean;
}) => {
  const { notify } = useNotify();
  const { isOpen: isModalOpen, openModal, closeModal } = useModal();
  const { id } = useParams();

  const handleOpenModal = () => {
    if (
      !data.selectedDocType ||
      !data.selectedReferenceCode ||
      !data.selectedBusinessPartner
    ) {
      const message = !data.selectedDocType
        ? "Please Select the Doc Type first"
        : !data.selectedReferenceCode
        ? "Please Select the Reference first"
        : "Please Select the Business Partner first";

      notify({ status: "warning", title: "Required!", message });
      return;
    }

    openModal();
  };

  const renderCodeButtonText = () => {
    const refCode = data.selectedReferenceCode;

    if (refCode === "po") {
      const code = data.selectedPoOrderCode;
      return code?.Code
        ? `${code.Code} - ${code.Name} - ${code.Value}`
        : "Select Document";
    }

    if (refCode === "grn") {
      const grnCodes = data.selectedGrnOrderCode || [];
      if (grnCodes.length === 0) return "Select Document(s)";
      if (grnCodes.length > 1) return `${grnCodes.length} Document(s) Selected`;
      const grn = grnCodes[0];
      return `${grn.Code} - ${grn.Name} - ${grn.Value}`;
    }

    return "Select Document(s)";
  };

  const renderReadOnlyTextInput = (
    label: string,
    value?: string,
    inputType?: TextInputControlType
  ) =>
    value ? (
      <Grid.Cell size={Grid.CellSize.S3}>
        <TextInput
          className="w-full"
          label={label}
          value={value}
          isDisabled
          inputType={inputType}
        />
      </Grid.Cell>
    ) : null;
  console.log(data);

  return (
    <>
      <Grid>
        {renderReadOnlyTextInput(
          "Inv Issue Date",
          data?.IssueDate,
          TextInputControl.Type.DATE
        )}
        {renderReadOnlyTextInput(
          "Payment Due Date",
          data?.DueDate,
          TextInputControl.Type.DATE
        )}
        {renderReadOnlyTextInput("Invoice number", data?.ID)}
        {renderReadOnlyTextInput(
          "Buyer reference",
          data?.AccountingCustomerParty?.Party?.EndpointID
        )}
        {renderReadOnlyTextInput(
          "Amount due for payment",
          data?.LegalMonetaryTotal?.PayableAmount
        )}
        <Grid.Cell size={Grid.CellSize.S3}>
          <DocTypeDropdown
            placeholder="Select DocType Type..."
            selectedItem={data?.selectedDocType ?? ""}
            onSelect={(item) =>
              handelFieldUpdate("selectedDocType", item.value)
            }
            clearSelection={() => handelFieldUpdate("selectedDocType", "")}
            isDisabeld={
              (data.isPayloadSaved && isDisabled) ||
              data.selectedReferenceCode === "cost"
            }
          />
        </Grid.Cell>
        <Grid.Cell size={Grid.CellSize.S3}>
          <BusinessPartnerDropdown
            placeholder="Select Business Partner..."
            selectedItem={data?.selectedBusinessPartner ?? ""}
            onSelect={(item) =>
              handelFieldUpdate("selectedBusinessPartner", item.CardCode)
            }
            clearSelection={() =>
              handelFieldUpdate("selectedBusinessPartner", "")
            }
            isDisabeld={data.isPayloadSaved && isDisabled}
          />
        </Grid.Cell>

        <Grid.Cell size={Grid.CellSize.S3}>
          <ReferenceDropdown
            placeholder="Select Reference Type..."
            selectedItem={data?.selectedReferenceCode ?? ""}
            onSelect={(item) =>
              handelFieldUpdate("selectedReferenceCode", item.value)
            }
            clearSelection={() =>
              handelFieldUpdate("selectedReferenceCode", "")
            }
            isDisabeld={data.isPayloadSaved && isDisabled}
          />
        </Grid.Cell>

        {data.selectedReferenceCode !== "cost" && (
          <Grid.Cell size={Grid.CellSize.S3} className="flex-grow-0">
            <div className="flex-col w-full">
              <Input.Label value="Reference Document(s)" isRequired />
              <button
                className={`inline-flex w-full text-gray-800 bg-none font-medium rounded-md  px-3 py-2 text-base border border-gray-300`}
                onClick={() => handleOpenModal()}
                disabled={data.isPayloadSaved && isDisabled}
              >
                {renderCodeButtonText()}
              </button>
            </div>
          </Grid.Cell>
        )}
      </Grid>

      {isModalOpen && data.selectedReferenceCode === "po" && (
        <OrderCodeSelectmodal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSelectCode={(orderCode: OrderCode) => {
            handelFieldUpdate("selectedPoOrderCode", {
              Code: orderCode.CardCode,
              Value: orderCode.DocEntry,
              Name: orderCode.CardName,
            });
          }}
          prevSelectedCode={data.selectedPoOrderCode}
          transactionId={id}
          selectedBusinessPartner={data.selectedBusinessPartner}
          selectedDocType={data.selectedDocType}
        />
      )}

      {isModalOpen && data.selectedReferenceCode === "grn" && (
        <GrnCodeSelectmodal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSelectCode={(orderCodes: OrderCode[]) => {
            const mappedCodes = orderCodes.map((code) => ({
              Code: code.CardCode,
              Name: code.CardName,
              Value: code.DocEntry,
            }));
            handelFieldUpdate("selectedGrnOrderCode", mappedCodes);
          }}
          prevSelectedCode={data.selectedGrnOrderCode}
          transactionId={id}
          selectedBusinessPartner={data.selectedBusinessPartner}
          selectedDocType={data.selectedDocType}
        />
      )}
    </>
  );
};
