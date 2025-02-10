import { TransactionDetailWrapper } from "../transaction-detail-wrapper";
import { Transaction } from "@/types/transaction";
import { TransactionDetailItem } from "../transaction-detail-item";

type TransactionGeneralDetailsProps = {
  transaction: Transaction;
};

export const TransactionGeneralDetails = ({
  transaction,
}: TransactionGeneralDetailsProps) => {
  const details = [
    { label: "ID", value: transaction.id.toString() },
    { label: "Payload Type", value: transaction.payloadType },
    { label: "Status", value: transaction.status, isStatus: true },
    {
      label: "Inbound User",
      value: "TST9",
      tooltip: "SAP Customer Checkout",
      underline: true,
    },
    {
      label: "Inbound System",
      value: transaction.sendingCompany.name,
      tooltip: "SAP Customer Checkout",
      underline: true,
    },
    {
      label: "Outbound System",
      value: transaction.receivingCompany.name,
      tooltip: "SAP Business One",
      underline: true,
    },
  ];

  return (
    <TransactionDetailWrapper>
      {details.map(({ label, value, isStatus, tooltip, underline }) => (
        <TransactionDetailItem
          key={label}
          label={label}
          value={value}
          isStatus={isStatus}
          tooltip={tooltip}
          underline={underline}
        />
      ))}
      <TransactionDetailItem label="Go to transformed receipt" isLink />
    </TransactionDetailWrapper>
  );
};
