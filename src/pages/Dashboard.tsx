import React, { useState, useEffect } from "react";
import Alert from "@/components/ui/Alert";
import { Actionbar } from "@/components/ui/ActionBar";
import { RefreshButton } from "@/components/ui/Buttons";
import { CardDefinition } from "@/types";
import {
  DashboardCard,
  CardSkeleton,
  CardGrid,
} from "@/components/parts/dashboard-report-card";
import { useReportData } from "@/hooks/use-report-data";

export const Dashboard: React.FC = () => {
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const { isLoading, error, fetchReportData, availableCards } = useReportData(
    transactionCardDefinitions
  );

  useEffect(() => {
    if (error) {
      setAlert({
        type: "error",
        message: error,
      });
    }
  }, [error, isLoading, availableCards]);

  const handleRefresh = () => {
    fetchReportData();
  };

  return (
    <div className="">
      <Actionbar title="Dashboard">
        <RefreshButton handleRefresh={handleRefresh} />
      </Actionbar>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <CardGrid title="Transactions">
        {isLoading ? (
          <CardSkeleton count={4} />
        ) : availableCards.length > 0 ? (
          availableCards.map((item, index) => (
            <DashboardCard
              key={index}
              title={item.title}
              value={item.value}
              url={item.url}
            />
          ))
        ) : (
          <div className="col-span-full p-4 text-center text-gray-500">
            No transaction data available
          </div>
        )}
      </CardGrid>

      <CardGrid
        title="Configuration"
        columns="grid-cols-1 sm:grid-cols-2 md:grid-cols-4"
      >
        {configData.map((item, index) => (
          <DashboardCard
            key={index}
            title={item.title}
            value={item.value}
            url={item.url}
          />
        ))}
      </CardGrid>
    </div>
  );
};

const transactionCardDefinitions: CardDefinition[] = [
  {
    apiField: "totalTransactions",
    title: "Inbound Transactions",
    url: "inbound-transactions",
  },
  {
    apiField: "totalCompanies",
    title: "Companies",
    url: "companies",
  },
  {
    apiField: "totalUsers",
    title: "Users",
    url: "users",
  },
];

const configData = [
  { title: "Inbound Systems", value: 1, url: "inbound-systems" },
  { title: "Outbound Systems", value: 2, url: "outbound-systems" },
  { title: "Systems Routing", value: 1, url: "systems-routing" },
  { title: "Inbound Users", value: 1, url: "inbound-users" },
];
