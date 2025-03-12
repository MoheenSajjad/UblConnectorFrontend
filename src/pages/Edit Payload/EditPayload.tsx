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
import { Invoice, InvoiceLine } from "@/types/invoice";
import { RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { UpdateTransactionPayload } from "@/services/transactionService";
import { useNotify } from "@/components/ui/Notify";
import { openPdfInNewTab } from "@/utils/pdf";

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

  const handelFieldUpdate = (name: keyof Invoice, value: string) => {
    setInvoiceData((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleInvoiceLineUpdate = (
    lineId: string,
    field: keyof InvoiceLine,
    value: string
  ) => {
    setInvoiceData((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        InvoiceLine: prev.InvoiceLine.map((line) =>
          line.ID === lineId ? { ...line, [field]: value } : line
        ),
      };
    });
  };

  const handelInvoiceCodeUpdate = (
    lineId: string,
    newCode: string,
    newValue: number
  ) => {
    setInvoiceData((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        InvoiceLine: prev.InvoiceLine.map((line) =>
          line.ID === lineId
            ? {
                ...line,
                selectedCode: {
                  Code: newCode,
                  Value: newValue,
                },
              }
            : line
        ),
      };
    });
  };

  const { notify } = useNotify();
  const handleSubmit = () => {
    if (!invoiceData) {
      notify({
        status: "warning",
        title: "Required!",
        message: "Invoice data is missing.",
      });

      return;
    }

    const { selectedReferenceCode, selectedBusinessPartner, InvoiceLine } =
      invoiceData;

    if (!selectedReferenceCode) {
      notify({
        status: "warning",
        title: "Required!",
        message: "Reference Code is required.",
      });
      return;
    }

    if (!selectedBusinessPartner) {
      notify({
        status: "warning",
        title: "Required!",
        message: "Business Partner is required.",
      });
      return;
    }

    for (const line of InvoiceLine) {
      if (!line.selectedCode?.Code || !line.selectedCode?.Value) {
        notify({
          status: "warning",
          title: "Required!",
          message: `Code is required for line ID: ${line.ID}`,
        });
        return;
      }

      if (!line.selectedLine) {
        notify({
          status: "warning",
          title: "Required!",
          message: `Line Code is required for line ID: ${line.ID}`,
        });
        return;
      }

      if (!line.selectedVat) {
        notify({
          status: "warning",
          title: "Required!",
          message: `VAT Code is required for line ID: ${line.ID}`,
        });

        return;
      }
    }

    const invoiceDataString = JSON.stringify(invoiceData);
    console.log(invoiceDataString);

    dispatch(
      UpdateTransactionPayload({ data: invoiceDataString, transactionId: id })
    );
  };

  const handleOpenPdf = () => {
    console.log(invoiceData);

    const pdfData =
      invoiceData?.AdditionalDocumentReference?.Attachment
        ?.EmbeddedDocumentBinaryObject ?? null;
    const fileName =
      invoiceData?.AdditionalDocumentReference?.Attachment
        ?.EmbeddedDocumentBinaryObject ?? null;

    if (!pdfData)
      notify({
        status: "error",
        title: "Failed to Open PDF",
        message: "Invalid PDF data. Unable to open the file.",
      });

    openPdfInNewTab(pdfData);
  };

  // JSX Button

  return (
    <>
      <div className=" ">
        <ActionBar backBtn title={`Edit Invoice`}>
          <Button
            variant={ButtonVariant.Secondary}
            size={ButtonSize.Medium}
            icon={<FileIcon />}
            onClick={() => handleOpenPdf()}
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
          <Button
            variant={ButtonVariant.Primary}
            size={ButtonSize.Medium}
            icon={<RefreshCcw />}
            onClick={handleSubmit}
          >
            Save
          </Button>
        </ActionBar>

        <div className=" rounded-lg shadow-sm p-3 ">
          {transaction && invoiceData && (
            <HeaderFields
              data={invoiceData}
              selectedReferenceType={selectedReferenceType}
              handelFieldUpdate={handelFieldUpdate}
            />
          )}

          {invoiceData && (
            <LineItemsStep
              data={invoiceData}
              handleInvoiceLineUpdate={handleInvoiceLineUpdate}
              handelInvoiceCodeUpdate={handelInvoiceCodeUpdate}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default EditPayload;
