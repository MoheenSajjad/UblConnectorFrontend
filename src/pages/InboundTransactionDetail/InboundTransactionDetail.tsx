import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTDispatch } from "@/hooks/use-redux";
import { RootState } from "@/redux/store";
import { GetTransactionById } from "@/services/transactionService";
import {
  TransactionDetailJsonPayload,
  TransactionDetailXmlPayload,
} from "@/components/parts/detail-payload";
import { TransactionGeneralDetails } from "@/components/parts/transaction-general-details/TransactionGeneralDetails";
import { ActionBar } from "@/components/ui/ActionBar";
import { Button, ButtonSize, ButtonVariant } from "@/components/ui/Button";
import { RefreshCcw } from "lucide-react";

import { Empty } from "@/components/ui/Empty";
import { Invoice } from "@/types/invoice";
import { openPdfInNewTab } from "@/utils/pdf";
import { FadeInUp, SlideUp } from "@/components/animations";

const InboundTransactionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useTDispatch();
  const [activeSection, setActiveSection] = useState<
    "general" | "json" | "xml"
  >("general");

  const { transaction, loading, error } = useSelector(
    (state: RootState) => state.transaction
  );

  useEffect(() => {
    if (id) {
      dispatch(GetTransactionById(id));
    }
  }, [dispatch, id]);

  const handleRefresh = () => {
    if (id) {
      dispatch(GetTransactionById(id));
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (!transaction) {
    return <Empty />;
  }

  const invoiceData = JSON.parse(transaction?.editInvoicePayload) as Invoice;
  const base64 =
    invoiceData?.AdditionalDocumentReference?.Attachment
      ?.EmbeddedDocumentBinaryObject ??
    invoiceData?.EmbeddedDocumentBinaryObject;

  const handleOpenPdf = () => {
    openPdfInNewTab(base64);
  };

  return (
    <FadeInUp>
      <div>
        <ActionBar backBtn title="Inbound Transaction Details">
          <Button
            variant={ButtonVariant.Primary}
            size={ButtonSize.Medium}
            icon={<RefreshCcw />}
            onClick={handleRefresh}
          >
            Refresh
          </Button>
        </ActionBar>

        <div className="mt-4 mb-4">
          <div className="flex gap-2">
            <Button
              variant={
                activeSection === "general"
                  ? ButtonVariant.Primary
                  : ButtonVariant.Secondary
              }
              size={ButtonSize.Medium}
              onClick={() => setActiveSection("general")}
            >
              General
            </Button>
            <Button
              variant={
                activeSection === "json" || activeSection === "xml"
                  ? ButtonVariant.Primary
                  : ButtonVariant.Secondary
              }
              size={ButtonSize.Medium}
              onClick={() =>
                transaction.payloadType === "Json"
                  ? setActiveSection("json")
                  : setActiveSection("xml")
              }
            >
              {transaction.payloadType === "Json"
                ? "JSON Payload"
                : "XML Payload"}
            </Button>
            {base64 && (
              <Button
                variant={ButtonVariant.Outline}
                size={ButtonSize.Medium}
                onClick={() => handleOpenPdf()}
              >
                View PDF
              </Button>
            )}
          </div>
        </div>

        {activeSection === "general" && (
          <SlideUp>
            <TransactionGeneralDetails transaction={transaction} />
          </SlideUp>
        )}

        {activeSection === "json" && (
          <SlideUp>
            <TransactionDetailJsonPayload
              payload={transaction.requestPayload}
            />
          </SlideUp>
        )}

        {activeSection === "xml" && (
          <SlideUp>
            <TransactionDetailXmlPayload payload={transaction.requestPayload} />
          </SlideUp>
        )}
      </div>
    </FadeInUp>
  );
};

export default InboundTransactionDetail;
