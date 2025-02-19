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
import { Actionbar } from "@/components/ui/ActionBar";
import { Button, ButtonSize, ButtonVariant } from "@/components/ui/Button";
import { RefreshCcw } from "lucide-react";

import { Empty } from "@/components/ui/Empty";

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

  return (
    <div>
      <Actionbar backBtn title="Inbound Transaction Details">
        <Button
          variant={ButtonVariant.Primary}
          size={ButtonSize.Medium}
          icon={<RefreshCcw />}
          onClick={handleRefresh}
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
        </div>
      </div>

      {activeSection === "general" && (
        <TransactionGeneralDetails transaction={transaction} />
      )}

      {activeSection === "json" && (
        <TransactionDetailJsonPayload payload={transaction.requestPayload} />
      )}

      {activeSection === "xml" && (
        <TransactionDetailXmlPayload payload={transaction.requestPayload} />
      )}
    </div>
  );
};

export default InboundTransactionDetail;
