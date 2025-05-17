import { ActionBar } from "@/components/ui/ActionBar";
import { Table } from "@/components/ui/Table";
import { Tag, TagTypeStyles } from "@/components/ui/Tag";
import { Pagination } from "@/components/pagination";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTDispatch } from "@/hooks/use-redux";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { GetAllTransactions } from "@/services/transactionService";
import {
  transactiontype,
  transactionStatus,
  Transaction,
} from "@/types/transaction";
import { setPageNumber, setPageSize } from "@/redux/reducers/transactionSlice";
import { getStatusTagType } from "@/components/parts/detail-item";
import {
  EditButton,
  FilterButton,
  RefreshButton,
  ViewButton,
} from "@/components/ui/Buttons";
import { DateTime } from "@/utils/date-time";
import Tooltip from "@/components/ui/Tooltip/Tooltip";
import { IconButton } from "@/components/ui/IconButton";
import { useModal } from "@/hooks/use-modal";
import { FileUploadModal } from "@/components/parts/FileUploadModal";
import { FileUploadIcon } from "@/components/icons";
import { FilterModal, FilterOption } from "@/components/parts/filter-modal";
import {
  defaultFilterState,
  TransactionFilter,
  TransactionFilterState,
} from "@/components/parts/transaction-filters";
import { FadeInUp } from "@/components/animations";
import { NoDataBoundary } from "../../components/ui/no-data-boundary";

export const InboundTransactions = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") as transactiontype;
  const status = searchParams.get("status") as transactionStatus;

  const [selectedTransactionId, setSelectedTransactionId] = useState<
    null | number
  >(null);
  const [activeFilters, setActiveFilters] = useState<TransactionFilterState>({
    ...defaultFilterState,
    status,
    transactionType: type,
  });

  const navigate = useNavigate();
  const dispatch = useTDispatch();

  const { isOpen, openModal, closeModal } = useModal();
  const {
    isOpen: isFilterModalOpen,
    openModal: openFilters,
    closeModal: closeFilterModal,
  } = useModal();

  const { transactions, loading, error, pageNumber, pageSize, totalCount } =
    useSelector((state: RootState) => state.transaction);

  useEffect(() => {
    dispatch(
      GetAllTransactions({
        pageNumber,
        pageSize,
        filters: activeFilters,
      })
    );
  }, [dispatch, pageNumber, pageSize, activeFilters]);

  const handleRefresh = () => {
    dispatch(
      GetAllTransactions({
        pageNumber,
        pageSize,
        filters: activeFilters,
      })
    );
  };

  const handelOpenFileUploadModal = (id: number) => {
    setSelectedTransactionId(id);
    openModal();
  };

  const handleFilterSubmit = (filters: TransactionFilterState) => {
    setActiveFilters(filters);
    dispatch(setPageNumber(1));
  };

  const isFilterApplied = Object.entries(activeFilters).some(([key, value]) => {
    if (key === "status" || key === "transactionType") return false;
    if (key === "createdAt")
      return value?.start !== null || value?.end !== null;
    return Boolean(value);
  });

  return (
    <>
      <FadeInUp>
        <div>
          <ActionBar
            backBtn
            title={`${type == "docflow" ? "DocFlow" : "Peppol"} Transactions`}
            totalCount={totalCount}
          >
            <FilterButton
              onClick={() => openFilters()}
              isFiltered={isFilterApplied}
            />
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
                  {type === "peppol" && (
                    <>
                      <Table.Header value="Business Partner" />
                    </>
                  )}
                  <Table.Header value="DocNum" />
                  <Table.Header value="Created At" />
                  <Table.Header value="Actions" />
                </Table.Row>
              }
              body={
                <NoDataBoundary
                  condition={transactions && transactions?.length > 0}
                  fallback={<Table.Empty />}
                >
                  {transactions.map((item, index) => (
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
                      <Table.Cell>
                        {`${item.sendingCompany?.name} - ${item.sendingCompany.companyId}`}
                      </Table.Cell>

                      <Table.Cell>
                        <Tag
                          type={getStatusTagType(item.status)}
                          label={item.status}
                        />
                      </Table.Cell>
                      {type === "peppol" && (
                        <>
                          <Table.Cell>
                            {item?.businessPartnerName ?? "-"}
                          </Table.Cell>
                        </>
                      )}
                      <Table.Cell>{item?.docNum ?? "-"}</Table.Cell>
                      <Table.Cell>
                        {DateTime.parse(item.createdAt).toString()}
                      </Table.Cell>

                      <Table.Cell>
                        <div className="flex items-center justify-center">
                          <ViewButton
                            onClick={() => navigate(`/transaction/${item.id}`)}
                          />
                          {type === "peppol" && (
                            <EditButton
                              onClick={() =>
                                navigate(`/transaction/${item.id}/editPayload`)
                              }
                            />
                          )}

                          <RenderFileUploadIcon
                            item={item}
                            onClick={(id) => handelOpenFileUploadModal(id)}
                          />

                          {/* {(item.attachmentFlag === "S" &&
                            (item.status == "Draft" ||
                              item.status == "Received")) ||
                            (item.isCustomApi &&
                              item.attachmentFlag === "S" && (
                                <Tooltip
                                  content={"Upload File"}
                                  position={Tooltip.Position.Top}
                                >
                                  <IconButton
                                    icon={<FileUploadIcon />}
                                    onClick={() =>
                                      handelOpenFileUploadModal(item.id)
                                    }
                                  />
                                </Tooltip>
                              ))} */}
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </NoDataBoundary>
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
          {selectedTransactionId !== null && (
            <FileUploadModal
              isOpen={isOpen}
              onClose={closeModal}
              transactionId={selectedTransactionId}
              onUploadSuccess={() => handleRefresh()}
            />
          )}
        </div>

        {isFilterModalOpen && (
          <TransactionFilter
            initialFilters={activeFilters}
            onSubmit={handleFilterSubmit}
            onClose={closeFilterModal}
          />
        )}
      </FadeInUp>
    </>
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

const RenderFileUploadIcon = ({
  item,
  onClick,
}: {
  item: Transaction;
  onClick: (id: number) => void;
}) => {
  return (
    <>
      {item.attachmentFlag === "S" &&
        (item.status == "Draft" || item.status == "Received") && (
          <Tooltip content={"Upload File"} position={Tooltip.Position.Top}>
            <IconButton
              icon={<FileUploadIcon />}
              onClick={() => onClick(item.id)}
            />
          </Tooltip>
        )}
    </>
  );
};
