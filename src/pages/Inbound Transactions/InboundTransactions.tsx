import { ActionBar } from "@/components/ui/ActionBar";
import { Table } from "@/components/ui/Table";
import { Tag, TagTypeStyles } from "@/components/ui/Tag";
import { Pagination } from "@/components/pagination";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTDispatch } from "@/hooks/use-redux";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  GetAllTransactions,
  transactiontype,
} from "@/services/transactionService";
import { setPageNumber, setPageSize } from "@/redux/reducers/transactionSlice";
import { getStatusTagType } from "@/components/parts/detail-item";
import {
  EditButton,
  FilterButton,
  RefreshButton,
  ViewButton,
} from "@/components/ui/Buttons";
import { DateTime } from "@/utils/date-time";
import { FileUp } from "lucide-react";
import Tooltip from "@/components/ui/Tooltip/Tooltip";
import { IconButton } from "@/components/ui/IconButton";
import { useModal } from "@/hooks/use-modal";
import { FileUploadModal } from "@/components/parts/FileUploadModal";
import { FileUploadIcon } from "@/components/icons";

export const InboundTransactions = () => {
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    null | number
  >(null);

  const navigate = useNavigate();
  const dispatch = useTDispatch();
  const [searchParams] = useSearchParams();
  const { isOpen, openModal, closeModal } = useModal();

  const type = searchParams.get("type") as transactiontype;

  const { transactions, loading, error, pageNumber, pageSize, totalCount } =
    useSelector((state: RootState) => state.transaction);

  useEffect(() => {
    dispatch(GetAllTransactions({ pageNumber, pageSize, type }));
  }, [dispatch, pageNumber, pageSize]);

  const handleRefresh = () => {
    dispatch(GetAllTransactions({ pageNumber, pageSize, type }));
  };

  // const handleFileUpload = async (base64: string) => {
  //   try {
  //     // Example API call with the base64 data
  //     // await fetch('your-api-endpoint', {
  //     //   method: 'POST',
  //     //   headers: {
  //     //     'Content-Type': 'application/json',
  //     //   },
  //     //   body: JSON.stringify({ file: base64 }),
  //     // });
  //     console.log("File uploaded successfully!", base64);
  //   } catch (error) {
  //     console.error("Error uploading file:", error);
  //     throw error;
  //   }
  // };

  const handelOpenFileUploadModal = (id: number) => {
    setSelectedTransactionId(id);
    openModal();
  };
  return (
    <div>
      <ActionBar
        backBtn
        title={`${type == "docflow" ? "DocFlow" : "Peppol"} Transactions`}
        totalCount={totalCount}
      >
        <FilterButton />
        <RefreshButton handleRefresh={handleRefresh} />
      </ActionBar>

      <div className="mt-7">
        <Table
          bordered
          head={
            <Table.Row>
              <Table.Header value="#" />
              <Table.Header value="Payload Type" />
              <Table.Header value="Attachment" />
              <Table.Header value="Company" />
              <Table.Header value="Status" />
              <Table.Header value="Business Partner" />
              <Table.Header value="DocNum" />
              <Table.Header value="Created At" />
              <Table.Header value="Actions" />
            </Table.Row>
          }
          body={
            transactions && transactions?.length > 0
              ? transactions.map((item, index) => (
                  <Table.Row key={item.id}>
                    <Table.Cell>{index + 1}</Table.Cell>
                    <Table.Cell>
                      {item.payloadType === "Json" ? "JSON" : "XML"}
                    </Table.Cell>
                    <Table.Cell>
                      <Tag
                        type={getAttachmentTagType(item.attachmentFlag)}
                        label={
                          item.attachmentFlag === "P"
                            ? "Pending"
                            : item.attachmentFlag === "C"
                            ? "Created"
                            : "Not Available"
                        }
                      />
                    </Table.Cell>
                    <Table.Cell className="underline decoration-dashed cursor-default">
                      {`${item.sendingCompany?.name} - ${item.sendingCompany.companyId}`}
                    </Table.Cell>

                    <Table.Cell>
                      <Tag
                        type={getStatusTagType(item.status)}
                        label={item.status}
                      />
                    </Table.Cell>
                    <Table.Cell>{item?.businessPartnerName ?? "-"}</Table.Cell>
                    <Table.Cell>{item?.docNum ?? "-"}</Table.Cell>
                    <Table.Cell>
                      {DateTime.parse(item.createdAt).toString()}
                    </Table.Cell>

                    <Table.Cell>
                      <div className="flex items-center justify-center">
                        <ViewButton
                          onClick={() => navigate(`/transaction/${item.id}`)}
                        />
                        <EditButton
                          onClick={() =>
                            navigate(`/transaction/${item.id}/editPayload`)
                          }
                        />
                        <Tooltip
                          content={"Upload File"}
                          position={Tooltip.Position.Top}
                        >
                          <IconButton
                            icon={<FileUploadIcon />}
                            onClick={() => handelOpenFileUploadModal(item.id)}
                          />
                        </Tooltip>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))
              : null
          }
          isLoading={loading}
          footer={
            <Pagination
              totalPages={Math.ceil(totalCount / pageSize)}
              onPage={(page) => dispatch(setPageNumber(page))}
              page={pageNumber}
            />
          }
        />
      </div>
      {selectedTransactionId && (
        <FileUploadModal
          isOpen={isOpen}
          onClose={closeModal}
          transactionId={selectedTransactionId}
        />
      )}
    </div>
  );
};

export const getAttachmentTagType = (
  status: string
): Partial<TagTypeStyles> => {
  switch (status) {
    case "C":
      return TagTypeStyles.ACTIVE;
    case "S":
      return TagTypeStyles.WARNING;
    default:
      return TagTypeStyles.INACTIVE;
  }
};
