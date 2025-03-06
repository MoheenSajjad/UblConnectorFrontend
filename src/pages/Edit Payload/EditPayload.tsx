import { EyeIcon, FileIcon } from "@/components/icons";
import { HeaderFields } from "@/components/parts/header-fields-step";
import { InvoiceDetailsStep } from "@/components/parts/invoice-detail-step/InvoiceDetailStep";
import { LineItemsStep } from "@/components/parts/line-items-step";
import { PaymentInfoStep } from "@/components/parts/payment-info-step";
import { StepIndicator } from "@/components/parts/step-indicator";
import { SummaryStep } from "@/components/parts/summary-step";
import { ActionBar } from "@/components/ui/ActionBar";
import { Button, ButtonSize, ButtonVariant } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Loading } from "@/components/ui/Loading";
import Tooltip from "@/components/ui/Tooltip/Tooltip";
import { useTDispatch } from "@/hooks/use-redux";
import { RootState } from "@/redux/store";
import { GetTransactionById } from "@/services/transactionService";
import { InvoiceFormData } from "@/types/edit-payload";
import { Invoice } from "@/types/invoice";
import { RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const STEPS = ["Header Fields", "Buyer Details", "Line Items", "Summary"];

const EditPayload = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [invoiceData, setInvoiceData] = useState<Invoice>();
  const [selectedReferenceType, setSelectedReferenceType] =
    useState<string>("po");
  const { id } = useParams<{ id: string }>();

  const dispatch = useTDispatch();

  const { transaction, loading, error, pageNumber, pageSize, totalCount } =
    useSelector((state: RootState) => state.transaction);

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

  useEffect(() => {
    if (transaction) {
      const data = JSON.parse(transaction?.editInvoicePayload);
      console.log(data);

      setInvoiceData(data);
    }
  }, [transaction]);

  console.log(invoiceData?.InvoiceLine);

  return (
    <>
      <div className=" ">
        <ActionBar backBtn title={`Edit Invoice`}>
          <Button
            variant={ButtonVariant.Secondary}
            size={ButtonSize.Medium}
            icon={<FileIcon />}
          >
            View PDF
          </Button>
          <Button
            variant={ButtonVariant.Primary}
            size={ButtonSize.Medium}
            icon={<RefreshCcw />}
            onClick={handleRefresh}
          >
            Refresh
          </Button>
        </ActionBar>

        <div className=" rounded-lg shadow-sm p-3 ">
          {transaction && (
            <HeaderFields
              data={invoiceData}
              selectedReferenceType={selectedReferenceType}
            />
          )}

          {invoiceData && <LineItemsStep data={invoiceData} />}
        </div>
      </div>
    </>
  );
};

export default EditPayload;
