import { FileIcon, PostIcon, UploadIcon } from "@/components/icons";
import { HeaderFields } from "@/components/parts/header-fields-step";
import { LineItemsStep } from "@/components/parts/line-items-step";
import { ActionBar } from "@/components/ui/ActionBar";
import { Button, ButtonSize, ButtonVariant } from "@/components/ui/Button";
import { useTDispatch } from "@/hooks/use-redux";
import { RootState } from "@/redux/store";
import { GetTransactionById } from "@/services/transactionService";
import { Invoice, InvoiceLine } from "@/types/invoice";
import { RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { UpdateTransactionPayload } from "@/services/transactionService";
import { useNotify } from "@/components/ui/Notify";
import { openPdfInNewTab } from "@/utils/pdf";
import { PostConfirmationModal } from "@/components/parts/post-confirmation-modal";
import { Loading } from "@/components/ui/Loading";

const EditPayload = () => {
  const [invoiceData, setInvoiceData] = useState<Invoice>();
  const [showModal, setShowModal] = useState(false);
  const [selectedReferenceType, setSelectedReferenceType] =
    useState<string>("po");
  const { id } = useParams<{ id: string }>();

  const dispatch = useTDispatch();

  const { transaction, loading, error } = useSelector(
    (state: RootState) => state.transaction
  );

  useEffect(() => {
    if (id) {
      dispatch(GetTransactionById(id));
    }
  }, [dispatch, id]);

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

      const updatedInvoice = {
        ...prev,
        [name]: value,
      };

      if (
        name === "selectedDocType" ||
        name === "selectedBusinessPartner" ||
        name === "selectedReferenceCode"
      ) {
        updatedInvoice.InvoiceLine = prev.InvoiceLine.map((item) => ({
          ...item,
          selectedLine: "",
          selectedCode: {
            Code: "",
            Value: 0,
          },
        }));
      }

      return updatedInvoice;
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
  const handleSubmit = (isSavePostData: boolean) => {
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

    invoiceData.isPayloadSaved = isSavePostData;

    const invoiceDataString = JSON.stringify(invoiceData);
    console.log(invoiceDataString);

    let postData;
    if (invoiceData.selectedDocType === "I") {
      postData = convertInvoiceToItemsPostPayload(invoiceData);
    } else {
      postData = convertInvoiceToServicePostPayload(invoiceData);
    }

    console.log(postData);

    const data = {
      invoiceEditPayload: invoiceDataString,
      postData,
      isSavePostData,
    };
    dispatch(UpdateTransactionPayload({ data, transactionId: id }));
  };

  const handleOpenPdf = () => {
    if (
      !invoiceData?.AdditionalDocumentReference?.Attachment
        ?.EmbeddedDocumentBinaryObject
    ) {
      notify({
        status: "error",
        title: "Failed to Open PDF",
        message: "Invalid PDF data. Unable to open the file.",
      });
      return;
    }

    openPdfInNewTab(
      invoiceData.AdditionalDocumentReference.Attachment
        .EmbeddedDocumentBinaryObject
    );
  };

  const handleConfirm = () => {
    handleSubmit(true);
    setShowModal(false);
  };

  const handleCancel = () => {
    console.log("User cancelled action");
    setShowModal(false);
  };

  return (
    <>
      <div className=" ">
        <Loading isLoading={loading}>
          <InvoiceActionButtons
            handleOpenPdf={handleOpenPdf}
            handleSubmit={(isSavePostData: boolean) =>
              handleSubmit(isSavePostData)
            }
            openModal={() => setShowModal(true)}
            isPayloadSaved={invoiceData?.isPayloadSaved ?? false}
          />

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
        </Loading>
      </div>
      <PostConfirmationModal
        isOpen={showModal}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
};

export default EditPayload;

const InvoiceActionButtons = ({
  handleOpenPdf,
  handleSubmit,
  openModal,
  isPayloadSaved = false,
}: {
  handleOpenPdf: () => void;
  handleSubmit: (isSavePostData: boolean) => void;
  openModal: () => void;
  isPayloadSaved: boolean;
}) => (
  <ActionBar backBtn title="Edit Invoice">
    <Button
      variant={ButtonVariant.Secondary}
      size={ButtonSize.Medium}
      icon={<FileIcon />}
      onClick={handleOpenPdf}
    >
      View PDF
    </Button>
    {!isPayloadSaved && (
      <>
        <Button
          variant={ButtonVariant.Outline}
          size={ButtonSize.Medium}
          icon={<UploadIcon />}
          onClick={() => handleSubmit(false)}
        >
          Save
        </Button>
        <Button
          variant={ButtonVariant.Primary}
          size={ButtonSize.Medium}
          icon={<PostIcon />}
          onClick={openModal}
        >
          POST
        </Button>
      </>
    )}
  </ActionBar>
);

const convertInvoiceToItemsPostPayload = (invoice: Invoice) => {
  return {
    CardCode: invoice.selectedBusinessPartner,
    DocType: invoice.selectedDocType,
    DocDate: invoice.IssueDate.replace(/-/g, ""),
    DocDueDate: invoice.DueDate.replace(/-/g, ""),
    NumAtCard: "null",
    AttachmentEntry: Number(invoice.absoluteEntry),
    Comments: "Purchase Invoice for Office Supplies",
    DocumentLines: invoice.InvoiceLine.map((line) => ({
      ItemCode: String(line?.selectedCode?.Code),
      Quantity: Number(line?.InvoicedQuantity),
      UnitPrice: Number(line?.Price?.PriceAmount),
      VatGroup: String(line?.selectedVat),
    })),
  };
};

const convertInvoiceToServicePostPayload = (invoice: Invoice) => {
  return {
    CardCode: invoice.selectedBusinessPartner,
    DocType: invoice.selectedDocType,
    DocDate: invoice.IssueDate.replace(/-/g, ""),
    DocDueDate: invoice.DueDate.replace(/-/g, ""),
    NumAtCard: "null",
    // AttachmentEntry: Number(invoice.absoluteEntry),
    Comments: "Purchase Invoice for Office Supplies",
    DocumentLines: invoice.InvoiceLine.map((line) => ({
      AccountCode: String(line?.selectedCode?.Code),
      LineTotal: line.Price,
      ItemDescription: line.Item,
      VatGroup: String(line?.selectedVat),
    })),
  };
};
