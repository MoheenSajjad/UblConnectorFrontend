import { Transaction } from "@/types/transaction";
import { DetailWrapper } from "../detail-wrapper";
import { DetailItem } from "../detail-item";

type TransactionGeneralDetailsProps = {
  transaction: Transaction;
};

export const TransactionGeneralDetails = ({
  transaction,
}: TransactionGeneralDetailsProps) => {
  const details = [
    { label: "ID", value: transaction.id.toString() },
    {
      label: "Payload Type",
      value: transaction.payloadType === "Json" ? "JSON" : "XML",
    },
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
    <DetailWrapper>
      {details.map(({ label, value, isStatus, tooltip, underline }) => (
        <DetailItem
          key={label}
          label={label}
          value={value}
          isStatus={isStatus}
          tooltip={tooltip}
          underline={underline}
        />
      ))}
      <DetailItem label="Go to transformed receipt" isLink />
    </DetailWrapper>
  );
};
