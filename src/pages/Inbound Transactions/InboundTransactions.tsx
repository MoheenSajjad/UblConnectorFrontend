import { Actionbar } from "@/components/ui/ActionBar";
import { Button, ButtonVariant, ButtonSize } from "@/components/ui/Button";
import { Table } from "@/components/ui/Table";
import { Tag } from "@/components/ui/Tag";
import { RefreshCcw, Filter, Eye } from "lucide-react";
import { Map } from "@/lib/Map";
import { Empty } from "@/components/ui/Empty";
import IconButton from "@/components/ui/IconButton/IconButton";
import { Pagination } from "@/components/pagination";
import { useState } from "react";
import Tooltip from "@/components/ui/Tooltip/Tooltip";
import { useNavigate } from "react-router-dom";

const users = [
  {
    id: 1,
    email: "dsa",
    name: "dsadsa",
    status: "Active",
    role: "Admin",
  },
  {
    id: 1,
    email: "dsa",
    name: "dsadsa",
    status: "Active",
    role: "Admin",
  },
  {
    id: 1,
    email: "dsa",
    name: "dsadsa",
    status: "Active",
    role: "Admin",
  },
  {
    id: 1,
    email: "dsa",
    name: "dsadsa",
    status: "Active",
    role: "Admin",
  },
  {
    id: 1,
    email: "dsa",
    name: "dsadsa",
    status: "Active",
    role: "Admin",
  },
  {
    id: 1,
    email: "dsa",
    name: "dsadsa",
    status: "Active",
    role: "Admin",
  },
  {
    id: 1,
    email: "dsa",
    name: "dsadsa",
    status: "Active",
    role: "Admin",
  },
  {
    id: 1,
    email: "dsa",
    name: "dsadsa",
    status: "Active",
    role: "Admin",
  },
];

export const InboundTransactions = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  return (
    <div>
      <Actionbar title="Inbound Transactions" totalCount={596}>
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
              <Table.Header value="Type" />
              <Table.Header value="Inbound user" />
              <Table.Header value="Inbound System" />
              <Table.Header value="Outbound System" />
              <Table.Header value="Status" />
              <Table.Header value="Posting Date" />

              <Table.Header value="Actions" />
            </Table.Row>
          }
          body={
            records.length > 0 ? (
              <Map
                items={records}
                renderItem={(item, index) => (
                  <Table.Row key={item.id}>
                    <Table.Cell>{index + 1}</Table.Cell>
                    <Table.Cell>{item.id}</Table.Cell>
                    <Table.Cell>{item.type}</Table.Cell>
                    <Table.Cell>
                      <Tooltip
                        content="SAP Customer Checkout "
                        position={Tooltip.Position.TopCenter}
                      >
                        <div className="underline decoration-dashed cursor-default">
                          {item.inboundUser?.name}
                        </div>
                      </Tooltip>
                    </Table.Cell>
                    <Table.Cell classname="underline decoration-dashed cursor-default">
                      {item.inboundSystem?.name}
                    </Table.Cell>

                    <Table.Cell classname="underline decoration-dashed cursor-default">
                      {item.outboundSystem?.name}
                    </Table.Cell>

                    <Table.Cell>
                      <Tag type={Tag.type.INFO} label={item.status} />
                    </Table.Cell>
                    <Table.Cell>{item.createdAt}</Table.Cell>

                    <Table.Cell>
                      <Tooltip
                        content="View Details"
                        position={Tooltip.Position.Left}
                      >
                        <IconButton
                          Icon={<Eye className="text-gray-600 w-5 h-5" />}
                          onClick={() =>
                            navigate(`/inbound-transactions/${item.id}`)
                          }
                        />
                      </Tooltip>
                    </Table.Cell>
                  </Table.Row>
                )}
              />
            ) : null
          }
          footer={
            <Pagination
              totalPages={10}
              onPage={(page) => setPage(page)}
              page={page}
            />
          }
          emptyState={<Empty />}
        />
      </div>
    </div>
  );
};

const records = [
  {
    id: "c6b3a945-d427-423d-bbff-75e1909e5dde",
    externalId: "ITX-000000000087",
    type: "sap-cco",
    typeDescription: "SAP Customer Checkout",
    inboundUser: {
      id: "0797aff7-8d94-45a7-94c0-dd29618107a5",
      name: "TST9",
      type: "sap-cco",
      typeDescription: "SAP Customer Checkout",
    },
    inboundSystem: {
      id: "35db7afd-fa6d-498a-a1ca-4c56b93e8ea5",
      name: "TELAL",
      type: "sap-cco",
      typeDescription: "SAP Customer Checkout",
    },
    outboundSystem: {
      id: "bfb08f41-e7cb-48c5-8d06-3db996b33dfa",
      name: "B1 @ Telal",
      type: "sap-b1",
      typeDescription: "SAP Business One",
    },
    status: "treated",
    statusDescription: "Treated",
    createdAt: "2025-02-01 07:30:51",
  },
  {
    id: "c0be5f47-3649-4ea3-89ae-30f740cae4c8",
    externalId: "ITX-000000000086",
    type: "sap-cco",
    typeDescription: "SAP Customer Checkout",
    inboundUser: {
      id: "0797aff7-8d94-45a7-94c0-dd29618107a5",
      name: "TST9",
      type: "sap-cco",
      typeDescription: "SAP Customer Checkout",
    },
    inboundSystem: {
      id: "35db7afd-fa6d-498a-a1ca-4c56b93e8ea5",
      name: "TELAL",
      type: "sap-cco",
      typeDescription: "SAP Customer Checkout",
    },
    outboundSystem: {
      id: "bfb08f41-e7cb-48c5-8d06-3db996b33dfa",
      name: "B1 @ Telal",
      type: "sap-b1",
      typeDescription: "SAP Business One",
    },
    status: "treated",
    statusDescription: "Treated",
    createdAt: "2025-02-01 07:25:49",
  },
  {
    id: "67e99661-a9d0-4aa2-ae14-1928daac86fa",
    externalId: "ITX-000000000085",
    type: "sap-cco",
    typeDescription: "SAP Customer Checkout",
    inboundUser: {
      id: "0797aff7-8d94-45a7-94c0-dd29618107a5",
      name: "TST9",
      type: "sap-cco",
      typeDescription: "SAP Customer Checkout",
    },
    inboundSystem: {
      id: "35db7afd-fa6d-498a-a1ca-4c56b93e8ea5",
      name: "TELAL",
      type: "sap-cco",
      typeDescription: "SAP Customer Checkout",
    },
    outboundSystem: {
      id: "bfb08f41-e7cb-48c5-8d06-3db996b33dfa",
      name: "B1 @ Telal",
      type: "sap-b1",
      typeDescription: "SAP Business One",
    },
    status: "treated",
    statusDescription: "Treated",
    createdAt: "2025-02-01 07:24:40",
  },
  {
    id: "ed403cf0-3a3a-4d8e-9c24-1192bcc39401",
    externalId: "ITX-000000000084",
    type: "sap-cco",
    typeDescription: "SAP Customer Checkout",
    inboundUser: {
      id: "0797aff7-8d94-45a7-94c0-dd29618107a5",
      name: "TST9",
      type: "sap-cco",
      typeDescription: "SAP Customer Checkout",
    },
    inboundSystem: {
      id: "35db7afd-fa6d-498a-a1ca-4c56b93e8ea5",
      name: "TELAL",
      type: "sap-cco",
      typeDescription: "SAP Customer Checkout",
    },
    outboundSystem: {
      id: "bfb08f41-e7cb-48c5-8d06-3db996b33dfa",
      name: "B1 @ Telal",
      type: "sap-b1",
      typeDescription: "SAP Business One",
    },
    status: "treated",
    statusDescription: "Treated",
    createdAt: "2025-02-01 07:24:00",
  },
  {
    id: "119238a2-5bb6-4140-8a0d-387f8efcfed5",
    externalId: "ITX-000000000083",
    type: "sap-cco",
    typeDescription: "SAP Customer Checkout",
    inboundUser: {
      id: "0797aff7-8d94-45a7-94c0-dd29618107a5",
      name: "TST9",
      type: "sap-cco",
      typeDescription: "SAP Customer Checkout",
    },
    inboundSystem: {
      id: "35db7afd-fa6d-498a-a1ca-4c56b93e8ea5",
      name: "TELAL",
      type: "sap-cco",
      typeDescription: "SAP Customer Checkout",
    },
    outboundSystem: {
      id: "bfb08f41-e7cb-48c5-8d06-3db996b33dfa",
      name: "B1 @ Telal",
      type: "sap-b1",
      typeDescription: "SAP Business One",
    },
    status: "treated",
    statusDescription: "Treated",
    createdAt: "2025-02-01 07:22:54",
  },
  {
    id: "1f2f65d5-3112-458c-9d9d-4ff21c97aace",
    externalId: "ITX-000000000082",
    type: "sap-cco",
    typeDescription: "SAP Customer Checkout",
    inboundUser: {
      id: "0797aff7-8d94-45a7-94c0-dd29618107a5",
      name: "TST9",
      type: "sap-cco",
      typeDescription: "SAP Customer Checkout",
    },
    inboundSystem: {
      id: "35db7afd-fa6d-498a-a1ca-4c56b93e8ea5",
      name: "TELAL",
      type: "sap-cco",
      typeDescription: "SAP Customer Checkout",
    },
    outboundSystem: {
      id: "bfb08f41-e7cb-48c5-8d06-3db996b33dfa",
      name: "B1 @ Telal",
      type: "sap-b1",
      typeDescription: "SAP Business One",
    },
    status: "treated",
    statusDescription: "Treated",
    createdAt: "2025-02-01 07:22:23",
  },
  {
    id: "9cdf8991-6720-4fa2-b374-2221dd70f04e",
    externalId: "ITX-000000000081",
    type: "sap-cco",
    typeDescription: "SAP Customer Checkout",
    inboundUser: {
      id: "0797aff7-8d94-45a7-94c0-dd29618107a5",
      name: "TST9",
      type: "sap-cco",
      typeDescription: "SAP Customer Checkout",
    },
    inboundSystem: {
      id: "35db7afd-fa6d-498a-a1ca-4c56b93e8ea5",
      name: "TELAL",
      type: "sap-cco",
      typeDescription: "SAP Customer Checkout",
    },
    outboundSystem: {
      id: "bfb08f41-e7cb-48c5-8d06-3db996b33dfa",
      name: "B1 @ Telal",
      type: "sap-b1",
      typeDescription: "SAP Business One",
    },
    status: "treated",
    statusDescription: "Treated",
    createdAt: "2025-02-01 07:13:43",
  },
  {
    id: "08ab3502-5e16-4ab7-b6bc-c44332bb6ebf",
    externalId: "ITX-000000000080",
    type: "sap-cco",
    typeDescription: "SAP Customer Checkout",
    inboundUser: {
      id: "0797aff7-8d94-45a7-94c0-dd29618107a5",
      name: "TST9",
      type: "sap-cco",
      typeDescription: "SAP Customer Checkout",
    },
    inboundSystem: {
      id: "35db7afd-fa6d-498a-a1ca-4c56b93e8ea5",
      name: "TELAL",
      type: "sap-cco",
      typeDescription: "SAP Customer Checkout",
    },
    outboundSystem: {
      id: "bfb08f41-e7cb-48c5-8d06-3db996b33dfa",
      name: "B1 @ Telal",
      type: "sap-b1",
      typeDescription: "SAP Business One",
    },
    status: "treated",
    statusDescription: "Treated",
    createdAt: "2025-02-01 07:11:10",
  },
  {
    id: "fbe9ebd7-ec3e-4458-ae6d-49776a99c927",
    externalId: "ITX-000000000079",
    type: "sap-cco",
    typeDescription: "SAP Customer Checkout",
    inboundUser: {
      id: "0797aff7-8d94-45a7-94c0-dd29618107a5",
      name: "TST9",
      type: "sap-cco",
      typeDescription: "SAP Customer Checkout",
    },
    inboundSystem: {
      id: "35db7afd-fa6d-498a-a1ca-4c56b93e8ea5",
      name: "TELAL",
      type: "sap-cco",
      typeDescription: "SAP Customer Checkout",
    },
    outboundSystem: {
      id: "bfb08f41-e7cb-48c5-8d06-3db996b33dfa",
      name: "B1 @ Telal",
      type: "sap-b1",
      typeDescription: "SAP Business One",
    },
    status: "treated",
    statusDescription: "Treated",
    createdAt: "2025-02-01 06:29:22",
  },
  {
    id: "5f80453e-b6bb-4f17-b3d7-60e8f5e6c075",
    externalId: "ITX-000000000078",
    type: "sap-cco",
    typeDescription: "SAP Customer Checkout",
    inboundUser: {
      id: "0797aff7-8d94-45a7-94c0-dd29618107a5",
      name: "TST9",
      type: "sap-cco",
      typeDescription: "SAP Customer Checkout",
    },
    inboundSystem: {
      id: "35db7afd-fa6d-498a-a1ca-4c56b93e8ea5",
      name: "TELAL",
      type: "sap-cco",
      typeDescription: "SAP Customer Checkout",
    },
    outboundSystem: {
      id: "bfb08f41-e7cb-48c5-8d06-3db996b33dfa",
      name: "B1 @ Telal",
      type: "sap-b1",
      typeDescription: "SAP Business One",
    },
    status: "treated",
    statusDescription: "Treated",
    createdAt: "2025-02-01 06:15:47",
  },
  {
    id: "07775123-2f5e-4990-a52f-58ca4de7195a",
    externalId: "ITX-000000000027",
    type: "sap-cco",
    typeDescription: "SAP Customer Checkout",
    inboundUser: {
      id: "0797aff7-8d94-45a7-94c0-dd29618107a5",
      name: "TST9",
      type: "sap-cco",
      typeDescription: "SAP Customer Checkout",
    },
    inboundSystem: {
      id: "35db7afd-fa6d-498a-a1ca-4c56b93e8ea5",
      name: "TELAL",
      type: "sap-cco",
      typeDescription: "SAP Customer Checkout",
    },
    outboundSystem: {
      id: "bfb08f41-e7cb-48c5-8d06-3db996b33dfa",
      name: "B1 @ Telal",
      type: "sap-b1",
      typeDescription: "SAP Business One",
    },
    status: "treated",
    statusDescription: "Treated",
    createdAt: "2025-02-01 06:07:15",
  },
  {
    id: "44543771-dc31-4a34-9a87-c9bb3f4e5e32",
    externalId: "ITX-000000000064",
    type: "sap-cco",
    typeDescription: "SAP Customer Checkout",
    inboundUser: {
      id: "0797aff7-8d94-45a7-94c0-dd29618107a5",
      name: "TST9",
      type: "sap-cco",
      typeDescription: "SAP Customer Checkout",
    },
    inboundSystem: {
      id: "35db7afd-fa6d-498a-a1ca-4c56b93e8ea5",
      name: "TELAL",
      type: "sap-cco",
      typeDescription: "SAP Customer Checkout",
    },
    outboundSystem: {
      id: "bfb08f41-e7cb-48c5-8d06-3db996b33dfa",
      name: "B1 @ Telal",
      type: "sap-b1",
      typeDescription: "SAP Business One",
    },
    status: "treated",
    statusDescription: "Treated",
    createdAt: "2025-02-01 06:06:13",
  },
  {
    id: "e3a800f7-c52f-4500-8166-476e426b38c6",
    externalId: "ITX-000000000063",
    type: "sap-cco",
    typeDescription: "SAP Customer Checkout",
    inboundUser: {
      id: "0797aff7-8d94-45a7-94c0-dd29618107a5",
      name: "TST9",
      type: "sap-cco",
      typeDescription: "SAP Customer Checkout",
    },
    inboundSystem: {
      id: "35db7afd-fa6d-498a-a1ca-4c56b93e8ea5",
      name: "TELAL",
      type: "sap-cco",
      typeDescription: "SAP Customer Checkout",
    },
    outboundSystem: {
      id: "bfb08f41-e7cb-48c5-8d06-3db996b33dfa",
      name: "B1 @ Telal",
      type: "sap-b1",
      typeDescription: "SAP Business One",
    },
    status: "treated",
    statusDescription: "Treated",
    createdAt: "2025-02-01 06:06:13",
  },
  {
    id: "ee173e71-2a6e-49f4-b863-d16cb918038a",
    externalId: "ITX-000000000062",
    type: "sap-cco",
    typeDescription: "SAP Customer Checkout",
    inboundUser: {
      id: "0797aff7-8d94-45a7-94c0-dd29618107a5",
      name: "TST9",
      type: "sap-cco",
      typeDescription: "SAP Customer Checkout",
    },
    inboundSystem: {
      id: "35db7afd-fa6d-498a-a1ca-4c56b93e8ea5",
      name: "TELAL",
      type: "sap-cco",
      typeDescription: "SAP Customer Checkout",
    },
    outboundSystem: {
      id: "bfb08f41-e7cb-48c5-8d06-3db996b33dfa",
      name: "B1 @ Telal",
      type: "sap-b1",
      typeDescription: "SAP Business One",
    },
    status: "treated",
    statusDescription: "Treated",
    createdAt: "2025-02-01 06:06:13",
  },
  {
    id: "51b08427-61fb-4b33-a32e-7aaf0cdfc0f8",
    externalId: "ITX-000000000061",
    type: "sap-cco",
    typeDescription: "SAP Customer Checkout",
    inboundUser: {
      id: "0797aff7-8d94-45a7-94c0-dd29618107a5",
      name: "TST9",
      type: "sap-cco",
      typeDescription: "SAP Customer Checkout",
    },
    inboundSystem: {
      id: "35db7afd-fa6d-498a-a1ca-4c56b93e8ea5",
      name: "TELAL",
      type: "sap-cco",
      typeDescription: "SAP Customer Checkout",
    },
    outboundSystem: {
      id: "bfb08f41-e7cb-48c5-8d06-3db996b33dfa",
      name: "B1 @ Telal",
      type: "sap-b1",
      typeDescription: "SAP Business One",
    },
    status: "treated",
    statusDescription: "Treated",
    createdAt: "2025-02-01 06:06:13",
  },
  {
    id: "72287b2c-5f68-40f9-ad6b-ace5fd1dea59",
    externalId: "ITX-000000000060",
    type: "sap-cco",
    typeDescription: "SAP Customer Checkout",
    inboundUser: {
      id: "0797aff7-8d94-45a7-94c0-dd29618107a5",
      name: "TST9",
      type: "sap-cco",
      typeDescription: "SAP Customer Checkout",
    },
    inboundSystem: {
      id: "35db7afd-fa6d-498a-a1ca-4c56b93e8ea5",
      name: "TELAL",
      type: "sap-cco",
      typeDescription: "SAP Customer Checkout",
    },
    outboundSystem: {
      id: "bfb08f41-e7cb-48c5-8d06-3db996b33dfa",
      name: "B1 @ Telal",
      type: "sap-b1",
      typeDescription: "SAP Business One",
    },
    status: "treated",
    statusDescription: "Treated",
    createdAt: "2025-02-01 06:06:13",
  },
  {
    id: "b0601e38-725b-4eac-b5cb-c3c41d76b2a4",
    externalId: "ITX-000000000059",
    type: "sap-cco",
    typeDescription: "SAP Customer Checkout",
    inboundUser: {
      id: "0797aff7-8d94-45a7-94c0-dd29618107a5",
      name: "TST9",
      type: "sap-cco",
      typeDescription: "SAP Customer Checkout",
    },
    inboundSystem: {
      id: "35db7afd-fa6d-498a-a1ca-4c56b93e8ea5",
      name: "TELAL",
      type: "sap-cco",
      typeDescription: "SAP Customer Checkout",
    },
    outboundSystem: {
      id: "bfb08f41-e7cb-48c5-8d06-3db996b33dfa",
      name: "B1 @ Telal",
      type: "sap-b1",
      typeDescription: "SAP Business One",
    },
    status: "treated",
    statusDescription: "Treated",
    createdAt: "2025-02-01 06:06:13",
  },
  {
    id: "f3b46039-9462-4303-8da6-0bbdee86f65e",
    externalId: "ITX-000000000058",
    type: "sap-cco",
    typeDescription: "SAP Customer Checkout",
    inboundUser: {
      id: "0797aff7-8d94-45a7-94c0-dd29618107a5",
      name: "TST9",
      type: "sap-cco",
      typeDescription: "SAP Customer Checkout",
    },
    inboundSystem: {
      id: "35db7afd-fa6d-498a-a1ca-4c56b93e8ea5",
      name: "TELAL",
      type: "sap-cco",
      typeDescription: "SAP Customer Checkout",
    },
    outboundSystem: {
      id: "bfb08f41-e7cb-48c5-8d06-3db996b33dfa",
      name: "B1 @ Telal",
      type: "sap-b1",
      typeDescription: "SAP Business One",
    },
    status: "treated",
    statusDescription: "Treated",
    createdAt: "2025-02-01 06:06:13",
  },
  {
    id: "a44e71eb-aeb7-49e2-9464-0c918ad111ab",
    externalId: "ITX-000000000057",
    type: "sap-cco",
    typeDescription: "SAP Customer Checkout",
    inboundUser: {
      id: "0797aff7-8d94-45a7-94c0-dd29618107a5",
      name: "TST9",
      type: "sap-cco",
      typeDescription: "SAP Customer Checkout",
    },
    inboundSystem: {
      id: "35db7afd-fa6d-498a-a1ca-4c56b93e8ea5",
      name: "TELAL",
      type: "sap-cco",
      typeDescription: "SAP Customer Checkout",
    },
    outboundSystem: {
      id: "bfb08f41-e7cb-48c5-8d06-3db996b33dfa",
      name: "B1 @ Telal",
      type: "sap-b1",
      typeDescription: "SAP Business One",
    },
    status: "treated",
    statusDescription: "Treated",
    createdAt: "2025-02-01 06:06:13",
  },
  {
    id: "80d242a1-d4c4-419a-b7f6-be5ff01b95cc",
    externalId: "ITX-000000000056",
    type: "sap-cco",
    typeDescription: "SAP Customer Checkout",
    inboundUser: {
      id: "0797aff7-8d94-45a7-94c0-dd29618107a5",
      name: "TST9",
      type: "sap-cco",
      typeDescription: "SAP Customer Checkout",
    },
    inboundSystem: {
      id: "35db7afd-fa6d-498a-a1ca-4c56b93e8ea5",
      name: "TELAL",
      type: "sap-cco",
      typeDescription: "SAP Customer Checkout",
    },
    outboundSystem: {
      id: "bfb08f41-e7cb-48c5-8d06-3db996b33dfa",
      name: "B1 @ Telal",
      type: "sap-b1",
      typeDescription: "SAP Business One",
    },
    status: "treated",
    statusDescription: "Treated",
    createdAt: "2025-02-01 06:06:13",
  },
  {
    id: "8e058602-00be-4f74-93bb-357e019824bc",
    externalId: "ITX-000000000055",
    type: "sap-cco",
    typeDescription: "SAP Customer Checkout",
    inboundUser: {
      id: "0797aff7-8d94-45a7-94c0-dd29618107a5",
      name: "TST9",
      type: "sap-cco",
      typeDescription: "SAP Customer Checkout",
    },
    inboundSystem: {
      id: "35db7afd-fa6d-498a-a1ca-4c56b93e8ea5",
      name: "TELAL",
      type: "sap-cco",
      typeDescription: "SAP Customer Checkout",
    },
    outboundSystem: {
      id: "bfb08f41-e7cb-48c5-8d06-3db996b33dfa",
      name: "B1 @ Telal",
      type: "sap-b1",
      typeDescription: "SAP Business One",
    },
    status: "treated",
    statusDescription: "Treated",
    createdAt: "2025-02-01 06:06:13",
  },
  {
    id: "d46c75b8-068c-40c8-979a-26adc06796ef",
    externalId: "ITX-000000000054",
    type: "sap-cco",
    typeDescription: "SAP Customer Checkout",
    inboundUser: {
      id: "0797aff7-8d94-45a7-94c0-dd29618107a5",
      name: "TST9",
      type: "sap-cco",
      typeDescription: "SAP Customer Checkout",
    },
    inboundSystem: {
      id: "35db7afd-fa6d-498a-a1ca-4c56b93e8ea5",
      name: "TELAL",
      type: "sap-cco",
      typeDescription: "SAP Customer Checkout",
    },
    outboundSystem: {
      id: "bfb08f41-e7cb-48c5-8d06-3db996b33dfa",
      name: "B1 @ Telal",
      type: "sap-b1",
      typeDescription: "SAP Business One",
    },
    status: "treated",
    statusDescription: "Treated",
    createdAt: "2025-02-01 06:06:13",
  },
  {
    id: "bb82848e-227b-4769-90dc-6d6044e75fd8",
    externalId: "ITX-000000000053",
    type: "sap-cco",
    typeDescription: "SAP Customer Checkout",
    inboundUser: {
      id: "0797aff7-8d94-45a7-94c0-dd29618107a5",
      name: "TST9",
      type: "sap-cco",
      typeDescription: "SAP Customer Checkout",
    },
    inboundSystem: {
      id: "35db7afd-fa6d-498a-a1ca-4c56b93e8ea5",
      name: "TELAL",
      type: "sap-cco",
      typeDescription: "SAP Customer Checkout",
    },
    outboundSystem: {
      id: "bfb08f41-e7cb-48c5-8d06-3db996b33dfa",
      name: "B1 @ Telal",
      type: "sap-b1",
      typeDescription: "SAP Business One",
    },
    status: "treated",
    statusDescription: "Treated",
    createdAt: "2025-02-01 06:06:13",
  },
  {
    id: "baad8556-94ce-4ff6-9af3-f511a1dfd90a",
    externalId: "ITX-000000000052",
    type: "sap-cco",
    typeDescription: "SAP Customer Checkout",
    inboundUser: {
      id: "0797aff7-8d94-45a7-94c0-dd29618107a5",
      name: "TST9",
      type: "sap-cco",
      typeDescription: "SAP Customer Checkout",
    },
    inboundSystem: {
      id: "35db7afd-fa6d-498a-a1ca-4c56b93e8ea5",
      name: "TELAL",
      type: "sap-cco",
      typeDescription: "SAP Customer Checkout",
    },
    outboundSystem: {
      id: "bfb08f41-e7cb-48c5-8d06-3db996b33dfa",
      name: "B1 @ Telal",
      type: "sap-b1",
      typeDescription: "SAP Business One",
    },
    status: "treated",
    statusDescription: "Treated",
    createdAt: "2025-02-01 06:06:12",
  },
  {
    id: "38f0c8c5-8801-4caa-9638-6d2700427aed",
    externalId: "ITX-000000000051",
    type: "sap-cco",
    typeDescription: "SAP Customer Checkout",
    inboundUser: {
      id: "0797aff7-8d94-45a7-94c0-dd29618107a5",
      name: "TST9",
      type: "sap-cco",
      typeDescription: "SAP Customer Checkout",
    },
    inboundSystem: {
      id: "35db7afd-fa6d-498a-a1ca-4c56b93e8ea5",
      name: "TELAL",
      type: "sap-cco",
      typeDescription: "SAP Customer Checkout",
    },
    outboundSystem: {
      id: "bfb08f41-e7cb-48c5-8d06-3db996b33dfa",
      name: "B1 @ Telal",
      type: "sap-b1",
      typeDescription: "SAP Business One",
    },
    status: "treated",
    statusDescription: "Treated",
    createdAt: "2025-02-01 06:06:12",
  },
];
