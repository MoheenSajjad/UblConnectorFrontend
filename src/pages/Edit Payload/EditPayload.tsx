import { FileIcon, PostIcon, UploadIcon } from "@/components/icons";
import { HeaderFields } from "@/components/parts/header-fields-step";
import { LineItemsStep } from "@/components/parts/line-items-step";
import { ActionBar } from "@/components/ui/ActionBar";
import { Button, ButtonSize, ButtonVariant } from "@/components/ui/Button";
import { useTDispatch } from "@/hooks/use-redux";
import { RootState } from "@/redux/store";
import { GetTransactionById } from "@/services/transactionService";
import { Invoice, InvoiceLine, selectedCodeItem } from "@/types/invoice";
import { RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { UpdateTransactionPayload } from "@/services/transactionService";
import { useNotify } from "@/components/ui/Notify";
import { openPdfInNewTab } from "@/utils/pdf";
import { PostConfirmationModal } from "@/components/parts/post-confirmation-modal";
import { Loading } from "@/components/ui/Loading";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { InvoiceLineMatching } from "@/components/parts/invoice-line-matching";

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

      setInvoiceData(data);
    }
  }, [transaction]);

  const handelFieldUpdate = (
    name: keyof Invoice,
    value: selectedCodeItem | selectedCodeItem[] | string
  ) => {
    setInvoiceData((prev) => {
      if (!prev) return prev;

      const updatedInvoice = {
        ...prev,
        [name]: value,
      };

      if (
        name === "selectedBusinessPartner" ||
        name === "selectedReferenceCode"
      ) {
        updatedInvoice.selectedPoOrderCode = {
          Code: "",
          Name: "",
          Value: 0,
        };
        updatedInvoice.selectedGrnOrderCode = [];
        // updatedInvoice.InvoiceLine = prev.InvoiceLine.map((item) => ({
        //   ...item,
        //   selectedLine: "",
        //   selectedCode: {
        //     Code: "",
        //     Name: "",
        //     Value: 0,
        //   },
        // }));
      }

      return updatedInvoice;
    });
  };

  const handleInvoiceLineUpdate = (
    lineId: string,
    field: keyof InvoiceLine,
    value: string | number
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
                  Name: "",
                  Value: newValue,
                },
              }
            : line
        ),
      };
    });
  };

  const { notify } = useNotify();
  const handleSubmit = async (isSavePostData: boolean) => {
    if (!invoiceData) {
      notify({
        status: "warning",
        title: "Required!",
        message: "Invoice data is missing.",
      });

      return;
    }

    const {
      selectedReferenceCode,
      selectedBusinessPartner,
      InvoiceLine,
      selectedDocType,
    } = invoiceData;

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
      console.log(selectedReferenceCode, line);
      if (
        selectedReferenceCode !== "cost" &&
        (!line.selectedCode?.Code || !line.selectedCode?.Value)
      ) {
        notify({
          status: "warning",
          title: "Required!",
          message: `Code is required for line ID: ${line.ID}`,
        });
        return;
      }

      if (!line.accountCode) {
        notify({
          status: "warning",
          title: "Required!",
          message: `G/L Account is required for line ID: ${line.ID}`,
        });
        return;
      }

      if (selectedReferenceCode !== "cost" && !line.selectedLine) {
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

    let postData;
    if (invoiceData.selectedReferenceCode !== "cost") {
      if (invoiceData.selectedDocType === "I") {
        postData = convertInvoiceToItemsPostPayload(invoiceData);
      } else {
        postData = convertInvoiceToServicePostPayload(invoiceData);
      }
    } else {
      postData = convertInvoiceToCostInvoicePayload(invoiceData);
    }

    const data = {
      invoiceEditPayload: invoiceDataString,
      postData,
      isSavePostData,
    };

    const response = await dispatch(
      UpdateTransactionPayload({ data, transactionId: id })
    );

    if (response?.payload?.id) {
      notify({
        status: "success",
        title: "Success!",
        message: isSavePostData
          ? "Invocie Posted SuccesFully"
          : "Invoice Saved Successfully",
      });
      window.history.back();
    } else {
      notify({
        status: "error",
        title: "Failed!",
        message: response?.payload?.message || "Error Occured",
      });
    }
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

    const base64 =
      invoiceData.AdditionalDocumentReference.Attachment
        .EmbeddedDocumentBinaryObject ??
      invoiceData.EmbeddedDocumentBinaryObject;
    openPdfInNewTab(base64);
  };

  const handleConfirm = () => {
    handleSubmit(true);
    setShowModal(false);
  };

  const handleCancel = () => {
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
            isPayloadSaved={
              (invoiceData?.isPayloadSaved &&
                transaction?.status !== "Failed") ??
              false
            }
          />

          <div className=" py-3 ">
            {transaction && invoiceData && (
              <HeaderFields
                data={invoiceData}
                selectedReferenceType={selectedReferenceType}
                handelFieldUpdate={handelFieldUpdate}
                isDisabled={transaction.status !== "Failed"}
              />
            )}
            <SectionTitle title="Invoice Content" />

            {transaction &&
            invoiceData &&
            invoiceData.selectedReferenceCode === "cost" ? (
              <LineItemsStep
                data={invoiceData}
                handleInvoiceLineUpdate={handleInvoiceLineUpdate}
                handelInvoiceCodeUpdate={handelInvoiceCodeUpdate}
                isDisabled={transaction.status !== "Failed"}
              />
            ) : (
              <InvoiceLineMatching />
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
    NumAtCard: invoice.ID,
    AttachmentEntry: invoice.attachmentEntry
      ? Number(invoice.attachmentEntry)
      : "null",
    Comments: invoice?.Note ?? "",
    DocumentLines: invoice.InvoiceLine.map((line) => ({
      ItemCode: String(line?.selectedLine),
      Quantity: parseFloat(line?.InvoicedQuantity?.trim() || "0"),
      UnitPrice: parseFloat(line?.Price?.PriceAmount?.trim() || "0"),
      VatGroup: String(line?.selectedVat),
      BaseEntry: line.selectedBaseEntry,
      BaseLine: line.selectedLineNum,
      BaseType: invoice.selectedReferenceCode === "po" ? 22 : 20,
    })),
  };
};

const convertInvoiceToServicePostPayload = (invoice: Invoice) => {
  return {
    CardCode: invoice.selectedBusinessPartner,
    DocType: invoice.selectedDocType,
    DocDate: invoice.IssueDate.replace(/-/g, ""),
    DocDueDate: invoice.DueDate.replace(/-/g, ""),
    NumAtCard: invoice.ID,
    // AttachmentEntry: Number(invoice.absoluteEntry),
    Comments: invoice?.Note ?? "",
    DocumentLines: invoice.InvoiceLine.map((line) => ({
      AccountCode: String(line?.selectedLine),
      LineTotal: line.Price?.PriceAmount,
      ItemDescription: line.Item?.Name,
      VatGroup: String(line?.selectedVat),
      BaseEntry: line.selectedBaseEntry,
      BaseLine: line.selectedLineNum,
      BaseType: invoice.selectedReferenceCode === "po" ? 22 : 20,
    })),
  };
};

const convertInvoiceToCostInvoicePayload = (invoice: Invoice) => {
  return {
    CardCode: invoice.selectedBusinessPartner,
    DocType: invoice.selectedDocType,
    DocDate: invoice.IssueDate.replace(/-/g, ""),
    DocDueDate: invoice.DueDate.replace(/-/g, ""),
    NumAtCard: invoice.ID,
    AttachmentEntry: invoice.attachmentEntry
      ? Number(invoice.attachmentEntry)
      : null,
    Comments: invoice?.Note ?? "",
    DocumentLines: invoice.InvoiceLine.map((line) => ({
      AccountCode: String(line?.accountCode),
      LineTotal: line.Price?.PriceAmount,
      ItemDescription: line.Item?.Name,
      VatGroup: String(line?.selectedVat),
      UnitPrice: parseFloat(line?.Price?.PriceAmount?.trim() || "0"),
      BaseEntry: null,
      BaseLine: null,
      BaseType: null,
      // AccountName: line.accountCode,
    })),
  };
};
