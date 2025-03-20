import { Transaction } from "@/types/transaction";
import { DetailWrapper } from "../detail-wrapper";
import { DetailItem } from "../detail-item";
import { getStatusTagType } from "../detail-item";
import { Tag } from "@/components/ui/Tag";
import { DateTime } from "@/utils/date-time";
import { getAttachmentTagType } from "@/pages";

type TransactionGeneralDetailsProps = {
  transaction: Transaction;
};

export const TransactionGeneralDetails = ({
  transaction,
}: TransactionGeneralDetailsProps) => {
  return (
    <DetailWrapper>
      <DetailItem label="Payload Type">
        <span className={`text-gray-700 `}>
          {transaction.payloadType === "Json" ? "JSON" : "XML"}
        </span>
      </DetailItem>
      <DetailItem label="Status">
        <Tag
          type={getStatusTagType(transaction.status!)}
          label={transaction.status!}
        />
      </DetailItem>
      <DetailItem label="Company">
        <span className={`text-gray-700 `}>
          {transaction?.sendingCompany?.name}
        </span>
      </DetailItem>

      <DetailItem label="Company Id">
        <span className={`text-gray-700 `}>
          {transaction?.sendingCompany?.companyId}
        </span>
      </DetailItem>

      <DetailItem label="Attachment">
        <span className={`text-gray-700 `}>
          <Tag
            type={getAttachmentTagType(transaction.attachmentFlag)}
            label={
              transaction.attachmentFlag === "P"
                ? "Pending"
                : transaction.attachmentFlag === "C"
                ? "Created"
                : "Not Available"
            }
          />
        </span>
      </DetailItem>
      {transaction.docEntry && (
        <DetailItem label="DocEntry">
          <span className={`text-gray-700 `}>{transaction.docEntry}</span>
        </DetailItem>
      )}
      {transaction.docNum && (
        <DetailItem label="DocEntry">
          <span className={`text-gray-700 `}>{transaction.docNum}</span>
        </DetailItem>
      )}
      {transaction.retryDate && (
        <DetailItem label="Last Retry">
          <span className={`text-gray-700 `}>
            {DateTime.parse(transaction.retryDate).toString()}
          </span>
        </DetailItem>
      )}
      {/* <DetailItem label="Go to transformed receipt" isLink /> */}
    </DetailWrapper>
  );
};
