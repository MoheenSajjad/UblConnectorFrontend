import React, { useState } from "react";

import Alert from "@/components/ui/Alert";
import { Button, ButtonSize, ButtonVariant } from "@/components/ui/Button";

import { RefreshCcw } from "lucide-react";

import { Actionbar } from "@/components/ui/ActionBar";
import { useNavigate } from "react-router-dom";

export const Dashboard: React.FC = () => {
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const Navigate = useNavigate();
  return (
    <div className="">
      <Actionbar title="Dashboard">
        <Button
          variant={ButtonVariant.Primary}
          size={ButtonSize.Medium}
          icon={RefreshCcw}
        >
          Refresh
        </Button>
      </Actionbar>
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <section className=" mt-6">
        <h2 className="text-lg font-semibold mb-2 ml-1">Transactions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 ">
          {data.map((item, index) => (
            <div
              key={index}
              onClick={() => Navigate(item.url)}
              className={`p-4 border-l-4 border-t-[1px] rounded-lg shadow-lg text-center hover:-translate-y-1 transition-transform duration-150 ${
                item.isFailed ? "border-l-red-500" : "border-l-blue-500"
              }`}
            >
              <p className=" font-medium mb-2">{item.title}</p>
              <p
                className={`text-2xl font-bold animate-slide-in-from-bottom ${
                  item.isFailed ? "text-red-500" : "text-black"
                }`}
              >
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Configuration</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {configData.map((item, index) => (
            <div
              key={index}
              className="border-l-blue-500  p-4 border-l-4 border-t-[1px] rounded-lg shadow-lg text-center hover:-translate-y-1 transition-transform duration-150"
            >
              <p className=" font-medium mb-2">{item.title}</p>
              <p className="text-2xl font-bold text-black animate-slide-in-from-bottom">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </section>
      {/* <div className="bg-white rounded-lg shadow">
        <Table
          head={
            <Table.Row>
              <Table.Header value="ID" />
              <Table.Header value="Name" />

              <Table.Header value="Active" align={Table.Align.CENTER} />
              <Table.Header value="Start Date" />
              <Table.Header value="End Date" />
            </Table.Row>
          }
          body={
            users.length > 0 ? (
              <Map
                items={users}
                renderItem={(item) => (
                  <Table.Row key={item.id} bordered>
                    <Table.Cell>{item.email}</Table.Cell>
                    <Table.Cell>{item.name}</Table.Cell>
                    <Table.Cell align={Table.Align.CENTER}>
                      <Tag type={Tag.type.INFO} label={item.status} />
                    </Table.Cell>
                    <Table.Cell>{item.role}</Table.Cell>
                    <Table.Cell>{item.status}</Table.Cell>
                  </Table.Row>
                )}
              />
            ) : null
          }
          emptyState={<Empty />}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New User"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            name="name"
            prefixIcon={User}
            placeholder="Enter name"
            required
          />

          <Input
            label="Email"
            name="email"
            type="email"
            prefixIcon={Mail}
            placeholder="Enter email"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <div className="relative">
              <select
                name="role"
                className="mt-1 block w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 py-2 text-sm"
                required
              >
                <option value="">Select a role</option>
                <option value="Admin">Admin</option>
                <option value="User">User</option>
                <option value="Editor">Editor</option>
              </select>
              <UserCircle className="absolute left-3 top-[60%] -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              type="button"
              onClick={() => setIsModalOpen(false)}
              variant={ButtonVariant.Ghost}
              size={ButtonSize.Medium}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant={ButtonVariant.Primary}
              size={ButtonSize.Medium}
            >
              Add User
            </Button>
          </div>
        </form>
      </Modal> */}
    </div>
  );
};

const data = [
  { title: "Inbound Transactions", value: 19, url: "/inbound-transactions" },
  { title: "Transformed Receipts", value: 19, url: "inbound-transactions" },
  { title: "Aggregated Receipts", value: 9, url: "inbound-transactions" },
  { title: "Outbound Transactions", value: 7, url: "inbound-transactions" },
  {
    title: "Failed Inbound Transactions",
    value: 0,
    isFailed: true,
    url: "inbound-transactions",
  },
  {
    title: "Failed Outbound Transactions",
    value: 3,
    isFailed: true,
    url: "inbound-transactions",
  },
];

const configData = [
  { title: "Inbound Systems", value: 1, url: "inbound-transactions" },
  { title: "Outbound Systems", value: 2, url: "inbound-transactions" },
  { title: "Systems Routing", value: 1, url: "inbound-transactions" },
  { title: "Inbound Users", value: 1, url: "inbound-transactions" },
];
