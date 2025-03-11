import React, { useState } from "react";
import { Input } from "./Input";
import { Button } from "@/components/ui/Button";
import { StepProps } from "@/types/edit-payload";
import { Grid, GridCell } from "@/components/ui/grid";
import { TextInput } from "@/components/ui/text-input";
import { TextInputControl } from "@/components/ui/text-input-control";
import { ReferenceDropdown } from "../reference-dropdown";
import { BusinessPartnerDropdown } from "../business-partner-dropdown";
import { Invoice } from "@/types/invoice";

export const HeaderFields = ({
  data,
  selectedReferenceType,
  handelFieldUpdate,
}: {
  data: Invoice;
  selectedReferenceType: string;
  handelFieldUpdate: (name: keyof Invoice, value: string) => void;
}) => {
  const selectedBusinessPartner = "";
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
          <ReferenceDropdown
            placeholder="Select Reference Type..."
            selectedItem={data?.selectedReferenceCode ?? ""}
            onSelect={(item) =>
              handelFieldUpdate("selectedReferenceCode", item.value)
            }
            clearSelection={() =>
              handelFieldUpdate("selectedReferenceCode", "")
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
          />
        </Grid.Cell>
      </Grid>
    </>
  );
};
