import { ActionBar } from "@/components/ui/ActionBar";
import { Table } from "@/components/ui/Table";
import { Tag, TagTypeStyles } from "@/components/ui/Tag";
import { Pagination } from "@/components/pagination";
import { useEffect } from "react";
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

export const InboundTransactions = () => {
  const navigate = useNavigate();
  const dispatch = useTDispatch();
  const [searchParams] = useSearchParams();

  const type = searchParams.get("type") as transactiontype;

  const { transactions, loading, error, pageNumber, pageSize, totalCount } =
    useSelector((state: RootState) => state.transaction);

  useEffect(() => {
    dispatch(GetAllTransactions({ pageNumber, pageSize, type }));
  }, [dispatch, pageNumber, pageSize]);

  const handleRefresh = () => {
    dispatch(GetAllTransactions({ pageNumber, pageSize, type }));
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
                            : "Skipped"
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
                    <Table.Cell>
                      {/* {new Date(item.createdAt).toLocaleString()} */}
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
      return TagTypeStyles.INFO;
    default:
      return TagTypeStyles.INACTIVE;
  }
};
