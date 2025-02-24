import { Actionbar } from "@/components/ui/ActionBar";
import { Button, ButtonVariant, ButtonSize } from "@/components/ui/Button";
import { Table } from "@/components/ui/Table";
import { Tag } from "@/components/ui/Tag";
import { RefreshIcon, FilterIcon, EyeIcon } from "@/components/icons";
import { Empty } from "@/components/ui/Empty";
import { IconButton } from "@/components/ui/IconButton";
import { Pagination } from "@/components/pagination";
import { useEffect } from "react";
import Tooltip from "@/components/ui/Tooltip/Tooltip";
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
  FilterButton,
  RefreshButton,
  ViewButton,
} from "@/components/ui/Buttons";
import { TableSkeleton } from "@/components/ui/table-skeleton";

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
      <Actionbar
        backBtn
        title={`${type == "docflow" ? "DocFlow" : "Peppol"} Transactions`}
        totalCount={totalCount}
      >
        <FilterButton />
        <RefreshButton handleRefresh={handleRefresh} />
      </Actionbar>

      <div className="mt-7">
        <Table
          bordered
          head={
            <Table.Row>
              <Table.Header value="#" />
              <Table.Header value="ID" />
              <Table.Header value="Payload Type" />
              <Table.Header value="Outbound System" />
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
                    <Table.Cell>{item.id}</Table.Cell>
                    <Table.Cell>
                      {item.payloadType === "Json" ? "JSON" : "XML"}
                    </Table.Cell>

                    <Table.Cell className="underline decoration-dashed cursor-default">
                      {item.receivingCompany?.name}
                    </Table.Cell>

                    <Table.Cell>
                      <Tag
                        type={getStatusTagType(item.status)}
                        label={item.status}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      {new Date(item.createdAt).toLocaleString()}
                    </Table.Cell>

                    <Table.Cell>
                      <div className="flex items-center justify-center">
                        <ViewButton
                          onClick={() => navigate(`/transaction/${item.id}`)}
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
