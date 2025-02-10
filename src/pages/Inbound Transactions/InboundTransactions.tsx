import { Actionbar } from "@/components/ui/ActionBar";
import { Button, ButtonVariant, ButtonSize } from "@/components/ui/Button";
import { Table } from "@/components/ui/Table";
import { Tag } from "@/components/ui/Tag";
import { RefreshCcw, Filter, Eye } from "lucide-react";
import { Empty } from "@/components/ui/Empty";
import { IconButton } from "@/components/ui/IconButton";
import { Pagination } from "@/components/pagination";
import { useEffect } from "react";
import Tooltip from "@/components/ui/Tooltip/Tooltip";
import { useNavigate } from "react-router-dom";
import { useTDispatch } from "@/hooks/use-redux";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { GetAllTransactions } from "@/services/transactionService";
import { setPageNumber, setPageSize } from "@/redux/reducers/transactionSlice";

export const InboundTransactions = () => {
  const navigate = useNavigate();
  const dispatch = useTDispatch();

  const { transactions, loading, error, pageNumber, pageSize, totalCount } =
    useSelector((state: RootState) => state.transaction);

  useEffect(() => {
    dispatch(GetAllTransactions({ pageNumber, pageSize }));
  }, [dispatch, pageNumber, pageSize]);

  return (
    <div>
      <Actionbar title="Inbound Transactions" totalCount={totalCount}>
        <Button
          variant={ButtonVariant.Outline}
          size={ButtonSize.Medium}
          icon={Filter}
        >
          Filter
        </Button>
        <Button
          variant={ButtonVariant.Primary}
          size={ButtonSize.Medium}
          icon={RefreshCcw}
        >
          Refresh
        </Button>
      </Actionbar>

      <div className="mt-7">
        <Table
          bordered
          head={
            <Table.Row>
              <Table.Header value="#" />
              <Table.Header value="ID" />
              <Table.Header value="Payload Type" />
              <Table.Header value="Inbound System" />
              <Table.Header value="Outbound System" />
              <Table.Header value="Status" />
              <Table.Header value="Created At" />
              <Table.Header value="Actions" />
            </Table.Row>
          }
          body={
            transactions.length > 0 ? (
              transactions.map((item, index) => (
                <Table.Row key={item.id}>
                  <Table.Cell>{index + 1}</Table.Cell>
                  <Table.Cell>{item.id}</Table.Cell>
                  <Table.Cell>{item.payloadType}</Table.Cell>

                  <Table.Cell className="">
                    <Tooltip
                      content="SAP Customer Checkout"
                      position={Tooltip.Position.Right}
                    >
                      <p className="underline decoration-dashed cursor-default">
                        {item.sendingCompany?.name}
                      </p>
                    </Tooltip>
                  </Table.Cell>

                  <Table.Cell className="underline decoration-dashed cursor-default">
                    <Tooltip
                      content="SAP Customer Checkout"
                      position={Tooltip.Position.Right}
                    >
                      <p className="underline decoration-dashed cursor-default">
                        {item.receivingCompany?.name}
                      </p>
                    </Tooltip>
                  </Table.Cell>

                  <Table.Cell>
                    <Tag type={Tag.type.INFO} label={item.status} />
                  </Table.Cell>
                  <Table.Cell>
                    {new Date(item.createdAt).toLocaleString()}
                  </Table.Cell>

                  <Table.Cell>
                    <div className="flex items-center justify-center">
                      <Tooltip
                        content="View Details"
                        position={Tooltip.Position.Left}
                      >
                        <IconButton
                          icon={<Eye className="text-gray-600 w-5 h-5" />}
                          onClick={() =>
                            navigate(`/inbound-transactions/${item.id}`)
                          }
                        />
                      </Tooltip>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Empty />
            )
          }
          footer={
            <Pagination
              totalPages={Math.ceil(totalCount / pageSize)}
              onPage={(page) => dispatch(setPageNumber(page))}
              page={pageNumber}
              // onPageSizeChange={(size) => dispatch(setPageSize(size))}
            />
          }
        />
      </div>
    </div>
  );
};
