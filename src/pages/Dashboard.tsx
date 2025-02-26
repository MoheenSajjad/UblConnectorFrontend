import React, { useState, useEffect } from "react";
import { ActionBar } from "@/components/ui/ActionBar";
import { RefreshButton } from "@/components/ui/Buttons";
import { Alert } from "@/components/ui/Alert";
import { CardDefinition } from "@/types";
import {
  DashboardCard,
  CardSkeleton,
  CardGrid,
} from "@/components/parts/dashboard-report-card";
import { useReportData } from "@/hooks/use-report-data";

export const Dashboard: React.FC = () => {
  const { isLoading, fetchReportData, availableCards, error } = useReportData(
    transactionCardDefinitions
  );

  const handleRefresh = () => {
    fetchReportData();
  };

  return (
    <>
      {error && <Alert status="error" title="Error" message={error} />}
      <div className="min-h-96">
        <ActionBar title="Dashboard">
          <RefreshButton handleRefresh={handleRefresh} />
        </ActionBar>

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
              No data available
            </div>
          )}
        </CardGrid>

        {/* <CardGrid
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
      </CardGrid> */}
      </div>
    </>
  );
};

const transactionCardDefinitions: CardDefinition[] = [
  {
    apiField: "docFlowTransactions",
    title: "DocFlow Transactions",
    url: `transactions?type=docflow`,
  },
  {
    apiField: "peppolTransactions",
    title: "Peppol Transactions",
    url: `transactions?type=peppol`,
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
