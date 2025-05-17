import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { StepProps } from "@/types/edit-payload";
import { Grid, GridCell } from "@/components/ui/grid";
import { TextInput } from "@/components/ui/text-input";
import { TextInputControl } from "@/components/ui/text-input-control";
import { ReferenceDropdown } from "../reference-dropdown";
import { BusinessPartnerDropdown } from "../business-partner-dropdown";
import { Invoice } from "@/types/invoice";
import { DocTypeDropdown } from "../doctype-dropdown/DocTypeDropdown";
import { useNotify } from "@/components/ui/Notify";
import { useModal } from "@/hooks/use-modal";
import { OrderCode } from "@/types/sap";
import { useParams } from "react-router-dom";
import { OrderCodeSelectmodal } from "../order-code-select-modal";

export const HeaderFields = ({
  data,
  selectedReferenceType,
  handelFieldUpdate,
  isDisabled = false,
}: {
  data: Invoice;
  selectedReferenceType: string;
  handelFieldUpdate: (name: keyof Invoice, value: string) => void;
  isDisabled?: boolean;
}) => {
  const { notify } = useNotify();
  const { isOpen: isModalOpen, openModal, closeModal } = useModal();
  const { id } = useParams();

  const handelOpenModal = () => {
    if (!data.selectedDocType) {
      notify({
        status: "warning",
        title: "Required!",
        message: `Please Select the Doc Type first`,
      });
      return;
    }

    if (!data.selectedReferenceCode) {
      notify({
        status: "warning",
        title: "Required!",
        message: `Please Select the Reference first`,
      });
      return;
    }

    if (!data.selectedBusinessPartner) {
      notify({
        status: "warning",
        title: "Required!",
        message: `Please Select the Business Partner first`,
      });
      return;
    }
    openModal();
  };
  return (
    <>
      <Grid>
        {data?.IssueDate && (
          <Grid.Cell size={Grid.CellSize.S3}>
            <TextInput
              label="Inv Issue Date"
              className="w-full"
              value={data?.IssueDate}
              isDisabled
              inputType={TextInputControl.Type.DATE}
            />
          </Grid.Cell>
        )}
        {data?.DueDate && (
          <Grid.Cell size={Grid.CellSize.S3}>
            <TextInput
              label="Payment Due Date"
              className="w-full"
              value={data?.DueDate}
              isDisabled
              inputType={TextInputControl.Type.DATE}
            />
          </Grid.Cell>
        )}
        {data?.ID && (
          <Grid.Cell size={Grid.CellSize.S3}>
            <TextInput
              className="w-full"
              value={data?.ID}
              label="Invoice number"
              isDisabled
            />
          </Grid.Cell>
        )}
        {data?.AccountingCustomerParty?.Party?.EndpointID && (
          <Grid.Cell size={Grid.CellSize.S3}>
            <TextInput
              className="w-full"
              value={data?.AccountingCustomerParty?.Party?.EndpointID}
              label="Buyer reference"
              isDisabled
            />
          </Grid.Cell>
        )}
        {data?.LegalMonetaryTotal?.PayableAmount && (
          <Grid.Cell size={Grid.CellSize.S3}>
            <TextInput
              className="w-full flex-grow-0"
              value={data?.LegalMonetaryTotal?.PayableAmount}
              label="Amount due for payment"
              isDisabled
            />
          </Grid.Cell>
        )}
        <Grid.Cell size={Grid.CellSize.S3}>
          <DocTypeDropdown
            placeholder="Select DocType Type..."
            selectedItem={data?.selectedDocType ?? ""}
            onSelect={(item) =>
              handelFieldUpdate("selectedDocType", item.value)
            }
            clearSelection={() => handelFieldUpdate("selectedDocType", "")}
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

        <Grid.Cell size={Grid.CellSize.S3} className="flex-grow-0">
          <div className="flex-col w-full">
            <Input.Label value="Code" isRequired />
            <button
              className={`inline-flex w-full text-gray-800 bg-none font-medium rounded-md  px-3 py-2 text-base border border-gray-300`}
              onClick={() => handelOpenModal()}
            >
              Select Code
            </button>
          </div>
        </Grid.Cell>
      </Grid>
      {isModalOpen && (
        <OrderCodeSelectmodal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSelectCode={(orderCode: OrderCode) => {
            // handleCodeSelect(orderCode);
          }}
          prevSelectedCode={{ Code: "", Value: 1 }}
          transactionId={id}
          selectedBusinessPartner={data.selectedBusinessPartner}
          selectedDocType={data.selectedDocType}
          selectedReferenceCode={data.selectedReferenceCode}
        />
      )}
    </>
  );
};
