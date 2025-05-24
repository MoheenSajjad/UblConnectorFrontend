import { FileIcon, PostIcon, UploadIcon, WarningX } from "@/components/icons";
import { HeaderFields } from "@/components/parts/header-fields-step";
import { LineItemsStep } from "@/components/parts/line-items-step";
import { ActionBar } from "@/components/ui/ActionBar";
import { Button, ButtonSize, ButtonVariant } from "@/components/ui/Button";
import { useTDispatch } from "@/hooks/use-redux";
import { RootState } from "@/redux/store";
import {
  GetTransactionById,
  ResetTransactionApi,
} from "@/services/transactionService";
import { Invoice, InvoiceLine, selectedCodeItem } from "@/types/invoice";
import { RefreshCcw } from "lucide-react";
import { useEffect, useState, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { UpdateTransactionPayload } from "@/services/transactionService";
import { useNotify } from "@/components/ui/Notify";
import { openPdfInNewTab } from "@/utils/pdf";
import { PostConfirmationModal } from "@/components/parts/post-confirmation-modal";
import { Loading } from "@/components/ui/Loading";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { InvoiceLineMatching } from "@/components/parts/invoice-line-matching";
import { useModal } from "@/hooks/use-modal";
import { ResetConfirmationModal } from "@/components/parts/reset-confirmation-modal";
import { IInvoiceItem } from "@/utils/item-matching";
import { OrderLine } from "@/types/sap";

const EditPayload = () => {
  const [invoiceData, setInvoiceData] = useState<Invoice>();
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedReferenceType, setSelectedReferenceType] =
    useState<string>("po");

  // State to track reordered invoice items from the matching component
  const [reorderedInvoiceItems, setReorderedInvoiceItems] = useState<
    IInvoiceItem[]
  >([]);
  const [selectedInvoiceItems, setSelectedInvoiceItems] = useState<
    IInvoiceItem[]
  >([]);
  const [sapItems, setSapItems] = useState<OrderLine[]>([]);

  // Use ref to prevent unnecessary callback recreations
  const reorderedItemsRef = useRef<IInvoiceItem[]>([]);
  const selectedItemsRef = useRef<IInvoiceItem[]>([]);

  const { id } = useParams<{ id: string }>();
  const { isOpen, openModal, closeModal } = useModal();

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

  const handleSapItemsUpdate = useCallback((items: OrderLine[]) => {
    setSapItems(items);
  }, []);

  // Memoized callback handlers to prevent infinite loops
  const handleInvoiceItemsReorder = useCallback(
    (reorderedItems: IInvoiceItem[]) => {
      // Only update if the items actually changed
      const itemsChanged =
        JSON.stringify(reorderedItemsRef.current) !==
        JSON.stringify(reorderedItems);

      if (itemsChanged) {
        console.log("Reordered Invoice Items:", reorderedItems);
        reorderedItemsRef.current = reorderedItems;
        setReorderedInvoiceItems(reorderedItems);

        // Update the original invoice data with the new order
        setInvoiceData((prev) => {
          if (!prev) return prev;

          const updatedInvoiceData = {
            ...prev,
            InvoiceLine: reorderedItems.map((reorderedItem) => {
              // Find the original invoice line data
              const originalLine = prev.InvoiceLine.find(
                (line) => line.ID === reorderedItem.id
              );

              if (originalLine) {
                return {
                  ...originalLine,
                  isSelected: reorderedItem.isSelected,
                };
              }

              // If original line not found, create a new line (shouldn't happen normally)
              return {
                ID: reorderedItem.id,
                Item: { Name: reorderedItem.name },
                Price: { PriceAmount: reorderedItem.price },
                InvoicedQuantity: reorderedItem.quantity,
                LineExtensionAmount: reorderedItem.lineExtensionAmount,
                isSelected: reorderedItem.isSelected,
                selectedCode: { Code: "", Name: "", Value: 0 },
                selectedLine: "",
                selectedVat: "",
                selectedBaseEntry: 0,
                selectedLineNum: 0,
                accountCode: "",
              };
            }),
          };

          return updatedInvoiceData;
        });
      }
    },
    []
  );

  const handleInvoiceItemsSelection = useCallback(
    (selectedItems: IInvoiceItem[]) => {
      // Only update if the selection actually changed
      const selectionChanged =
        JSON.stringify(selectedItemsRef.current) !==
        JSON.stringify(selectedItems);

      if (selectionChanged) {
        console.log("Selected Invoice Items:", selectedItems);
        selectedItemsRef.current = selectedItems;
        setSelectedInvoiceItems(selectedItems);
      }
    },
    []
  );

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

    console.log("=== SAVE BUTTON CLICKED ===");
    console.log("Current Invoice Data:", invoiceData);
    console.log("Reordered Invoice Items:", reorderedInvoiceItems);
    console.log("Selected Invoice Items:", selectedInvoiceItems);
    console.log("Invoice Lines in Order:", invoiceData.InvoiceLine);

    const selectedItems = reorderedInvoiceItems.filter(
      (item) => item.isSelected
    );

    // Check if at least one item is selected
    if (selectedItems.length === 0) {
      notify({
        status: "warning",
        title: "No Items Selected!",
        message: "Please select at least one invoice item to proceed.",
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

    invoiceData.isPayloadSaved = isSavePostData;
    const invoiceDataString = JSON.stringify(invoiceData);

    let postData;
    if (invoiceData.selectedReferenceCode !== "cost") {
      if (invoiceData.selectedDocType === "I") {
        postData = convertInvoiceToItemsPostPayload(
          invoiceData,
          reorderedInvoiceItems,
          sapItems
        );
      } else {
        postData = convertInvoiceToServicePostPayload(
          invoiceData,
          reorderedInvoiceItems,
          sapItems
        );
      }
    } else {
      postData = convertInvoiceToCostInvoicePayload(invoiceData);
    }
    console.log("Generated Post Data:", postData);
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

  const handelResetData = async () => {
    try {
      if (!transaction || !transaction.id) return;
      setIsLoading(true);
      const response = await ResetTransactionApi(transaction.id);
      if (!response.status) {
        setIsLoading(false);
        notify({
          status: "error",
          title: "Failed!",
          message: "Failed to reset the transaction",
        });
        closeModal();
      }
      notify({
        status: "success",
        title: "Success!",
        message: "Transaction Reset Successful",
      });
      setIsLoading(false);
      closeModal();
      window.history.back();
    } catch (error) {
      setIsLoading(false);
      closeModal();
      notify({
        status: "error",
        title: "Failed!",
        message: "Failed to reset the transaction",
      });
    }
  };

  return (
    <>
      <div className="">
        <Loading isLoading={loading}>
          <InvoiceActionButtons
            handleOpenPdf={handleOpenPdf}
            handleSubmit={(isSavePostData: boolean) =>
              handleSubmit(isSavePostData)
            }
            openModal={() => setShowModal(true)}
            showResetButton={transaction?.status === "Draft"}
            openResetModal={() => openModal()}
            isPayloadSaved={
              (invoiceData?.isPayloadSaved &&
                transaction?.status !== "Failed") ??
              false
            }
          />

          <div className="py-3">
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
                isDisabled={transaction.status !== "Failed"}
              />
            ) : (
              transaction &&
              invoiceData && (
                <InvoiceLineMatching
                  data={invoiceData}
                  docEntry={invoiceData.selectedPoOrderCode?.Value}
                  poCode={invoiceData.selectedPoOrderCode?.Code}
                  grnCodes={invoiceData.selectedGrnOrderCode}
                  transactionId={id}
                  onItemsReorder={handleInvoiceItemsReorder}
                  onSelectionChange={handleInvoiceItemsSelection}
                  onSapItemsUpdate={handleSapItemsUpdate}
                />
              )
            )}
          </div>
        </Loading>
      </div>
      <PostConfirmationModal
        isOpen={showModal}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
      <ResetConfirmationModal
        isOpen={isOpen}
        isLoading={isLoading}
        onConfirm={() => {
          handelResetData();
        }}
        onCancel={() => closeModal()}
      />
    </>
  );
};

export default EditPayload;

// Rest of your existing components and functions remain the same...
const InvoiceActionButtons = ({
  handleOpenPdf,
  handleSubmit,
  openModal,
  openResetModal,
  showResetButton,
  isPayloadSaved = false,
}: {
  handleOpenPdf: () => void;
  handleSubmit: (isSavePostData: boolean) => void;
  openModal: () => void;
  openResetModal: () => void;
  showResetButton: boolean;
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
    {showResetButton && (
      <Button
        variant={ButtonVariant.Destructive}
        size={ButtonSize.Medium}
        icon={<WarningX />}
        onClick={openResetModal}
      >
        Reset
      </Button>
    )}
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

// const convertInvoiceToItemsPostPayload = (invoice: Invoice) => {
//   return {
//     CardCode: invoice.selectedBusinessPartner,
//     DocType: invoice.selectedDocType,
//     DocDate: invoice.IssueDate.replace(/-/g, ""),
//     DocDueDate: invoice.DueDate.replace(/-/g, ""),
//     NumAtCard: invoice.ID,
//     AttachmentEntry: invoice.attachmentEntry
//       ? Number(invoice.attachmentEntry)
//       : "null",
//     Comments: invoice?.Note ?? "",
//     DocumentLines: invoice.InvoiceLine.map((line) => ({
//       ItemCode: String(line?.selectedLine),
//       Quantity: parseFloat(line?.InvoicedQuantity?.trim() || "0"),
//       UnitPrice: parseFloat(line?.Price?.PriceAmount?.trim() || "0"),
//       VatGroup: String(line?.selectedVat),
//       BaseEntry: line.selectedBaseEntry,
//       BaseLine: line.selectedLineNum,
//       BaseType: invoice.selectedReferenceCode === "po" ? 22 : 20,
//     })),
//   };
// };

const convertInvoiceToItemsPostPayload = (
  invoice: Invoice,
  reorderedInvoiceItems: IInvoiceItem[],
  sapItems: OrderLine[]
) => {
  const selectedInvoiceItems = reorderedInvoiceItems.filter(
    (invItem) => invItem.isSelected
  );

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
    DocumentLines: selectedInvoiceItems.map((invItem, index) => {
      const sapItem = sapItems[index];

      if (!sapItem) {
        console.warn(
          `No SAP item found at index ${index} for invoice item ${invItem.id}`
        );
        // Return a basic structure if no SAP item is found
        return {
          ItemCode: "", // Will need to be handled
          Quantity: parseFloat(invItem.quantity?.trim() || "0"),
          UnitPrice: parseFloat(invItem.price?.trim() || "0"),
          VatGroup: "", // Will need to be handled
          BaseEntry: 0,
          BaseLine: 0,
          BaseType: invoice.selectedReferenceCode === "po" ? 22 : 20,
        };
      }

      return {
        ItemCode: sapItem.ItemCode,
        Quantity: parseFloat(invItem.quantity?.trim() || "0"),
        UnitPrice: parseFloat(invItem.price?.trim() || "0"),
        VatGroup: sapItem.VatGroup,
        BaseEntry: sapItem.DocEntry,
        BaseLine: sapItem.LineNum,
        BaseType: invoice.selectedReferenceCode === "po" ? 22 : 20,
      };
    }),
  };
};

const convertInvoiceToServicePostPayload = (
  invoice: Invoice,
  reorderedInvoiceItems: IInvoiceItem[],
  sapItems: OrderLine[]
) => {
  // Filter to only include selected invoice items
  const selectedInvoiceItems = reorderedInvoiceItems.filter(
    (invItem) => invItem.isSelected
  );

  return {
    CardCode: invoice.selectedBusinessPartner,
    DocType: invoice.selectedDocType,
    DocDate: invoice.IssueDate.replace(/-/g, ""),
    DocDueDate: invoice.DueDate.replace(/-/g, ""),
    NumAtCard: invoice.ID,
    Comments: invoice?.Note ?? "",
    DocumentLines: selectedInvoiceItems.map((invItem) => {
      const originalIndex = reorderedInvoiceItems.findIndex(
        (item) => item.id === invItem.id
      );
      const sapItem = sapItems[originalIndex];

      if (!sapItem) {
        console.warn(
          `No SAP item found at index ${originalIndex} for selected service invoice item ${invItem.id}`
        );

        return {
          AccountCode: "",
          LineTotal: invItem.lineExtensionAmount,
          ItemDescription: invItem.name,
          VatGroup: "",
          BaseEntry: 0,
          BaseLine: 0,
          BaseType: invoice.selectedReferenceCode === "po" ? 22 : 20,
        };
      }

      return {
        AccountCode: String(sapItem.AccountCode),
        LineTotal: invItem.lineExtensionAmount,
        ItemDescription: invItem.name,
        VatGroup: sapItem.VatGroup, // From corresponding SAP item
        BaseEntry: sapItem.DocEntry,
        BaseLine: sapItem.LineNum,
        BaseType: invoice.selectedReferenceCode === "po" ? 22 : 20,
      };
    }),
  };
};

// const convertInvoiceToServicePostPayload = (invoice: Invoice) => {
//   return {
//     CardCode: invoice.selectedBusinessPartner,
//     DocType: invoice.selectedDocType,
//     DocDate: invoice.IssueDate.replace(/-/g, ""),
//     DocDueDate: invoice.DueDate.replace(/-/g, ""),
//     NumAtCard: invoice.ID,
//     // AttachmentEntry: Number(invoice.absoluteEntry),
//     Comments: invoice?.Note ?? "",
//     DocumentLines: invoice.InvoiceLine.map((line) => ({
//       AccountCode: String(line?.selectedLine),
//       LineTotal: line.Price?.PriceAmount,
//       ItemDescription: line.Item?.Name,
//       VatGroup: String(line?.selectedVat),
//       BaseEntry: line.selectedBaseEntry,
//       BaseLine: line.selectedLineNum,
//       BaseType: invoice.selectedReferenceCode === "po" ? 22 : 20,
//     })),
//   };
// };

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
