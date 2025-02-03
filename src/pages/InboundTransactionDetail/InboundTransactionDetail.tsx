import { Actionbar } from "@/components/ui/ActionBar";
import { Button, ButtonSize, ButtonVariant } from "@/components/ui/Button";
import { RefreshCcw } from "lucide-react";
import React from "react";

const InboundTransactionDetail = () => {
  return (
    <div>
      <Actionbar backBtn title="Inbound Transactions">
        <Button
          variant={ButtonVariant.Primary}
          size={ButtonSize.Medium}
          icon={RefreshCcw}
        >
          Refresh
        </Button>
      </Actionbar>
    </div>
  );
};

export default InboundTransactionDetail;
