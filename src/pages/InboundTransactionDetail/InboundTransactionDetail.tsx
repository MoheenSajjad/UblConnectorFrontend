import {
  TransactionDetailLink,
  TransactionDetailRow,
} from "@/components/parts/transaction-detail-row";
import TransactionGeneralDetails from "@/components/parts/transaction-general-details/TransactionGeneralDetails";
import { Actionbar } from "@/components/ui/ActionBar";
import { Button, ButtonSize, ButtonVariant } from "@/components/ui/Button";
import { RefreshCcw } from "lucide-react";
import React from "react";

const InboundTransactionDetail = () => {
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
            variant={ButtonVariant.Primary}
            size={ButtonSize.Medium}
            icon={RefreshCcw}
          >
            Refresh
          </Button>
          <Button
            variant={ButtonVariant.Secondary}
            size={ButtonSize.Medium}
            icon={RefreshCcw}
          >
            Refresh
          </Button>
        </div>
      </div>
      <TransactionGeneralDetails>
        <TransactionDetailRow
          label="ID"
          value="c6b3a945-d427-423d-bbff-75e1909e5dde"
        />
        <TransactionDetailRow label="External ID" value="ITX-000000000087" />
        <TransactionDetailRow label="Status" value="Active" />
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
    </div>
  );
};

export default InboundTransactionDetail;
