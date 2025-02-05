import { TransactionDetailPayload } from "@/components/parts/transaction-detail-payload";
import {
  TransactionDetailLink,
  TransactionDetailRow,
  TransactionDetailStatus,
} from "@/components/parts/transaction-detail-row";
import TransactionGeneralDetails from "@/components/parts/transaction-general-details/TransactionGeneralDetails";
import { Actionbar } from "@/components/ui/ActionBar";
import { Button, ButtonSize, ButtonVariant } from "@/components/ui/Button";
import { RefreshCcw } from "lucide-react";
import React, { useState } from "react";

const InboundTransactionDetail = () => {
  const [activeSection, setActiveSection] = useState<"general" | "json">(
    "general"
  );

  const jsonPayload = `{
    "CardCode": "C-1563RT",
    "NumAtCard": "NUM-1856GHY68",
    "Comments": "No Comments",
    "DocDate": "",
    "DocDueDate": "",
    "DocumentLines": [
      {
        "ItemCode": "IT-89YU",
        "Quantity": 1,
        "BaseEntry": 2,
        "BaseLine": 3,
        "BaseType": 4
      }
    ]
  }`;

  const handleButtonClick = (section: "general" | "json") => {
    setActiveSection(section);
  };

  return (
    <div>
      <Actionbar backBtn title="Inbound Transaction Details">
        <Button
          variant={ButtonVariant.Primary}
          size={ButtonSize.Medium}
          icon={RefreshCcw}
        >
          Refresh
        </Button>
      </Actionbar>
      <div className="mt-4 mb-4">
        <div className="flex gap-2">
          <Button
            variant={
              activeSection === "general"
                ? ButtonVariant.Primary
                : ButtonVariant.Secondary
            }
            size={ButtonSize.Medium}
            onClick={() => handleButtonClick("general")}
          >
            General
          </Button>
          <Button
            variant={
              activeSection === "json"
                ? ButtonVariant.Primary
                : ButtonVariant.Secondary
            }
            size={ButtonSize.Medium}
            onClick={() => handleButtonClick("json")}
          >
            Json Payload
          </Button>
        </div>
      </div>

      {/* Render content based on active section */}
      {activeSection === "general" && (
        <TransactionGeneralDetails>
          <TransactionDetailRow
            label="ID"
            value="c6b3a945-d427-423d-bbff-75e1909e5dde"
          />
          <TransactionDetailRow label="External ID" value="ITX-000000000087" />
          <TransactionDetailStatus label="Status" value="Received" />
          <TransactionDetailRow
            label="Inbound User"
            value="TST9"
            underline
            tooltip="SAP Customer Checkout"
          />
          <TransactionDetailRow
            label="Inbound System"
            value="TELAL"
            underline
            tooltip="SAP Customer Checkout"
          />
          <TransactionDetailRow
            label="Outbound System"
            value="B1@TELAL"
            underline
            tooltip="SAP Business One two th"
          />
          <TransactionDetailLink text="Go to transformed receipt" />
        </TransactionGeneralDetails>
      )}

      {activeSection === "json" && (
        <TransactionDetailPayload payload={jsonPayload} />
      )}
    </div>
  );
};

export default InboundTransactionDetail;
