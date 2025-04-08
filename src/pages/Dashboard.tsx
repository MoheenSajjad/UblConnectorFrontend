import React, { useState, useEffect } from "react";
import { ActionBar } from "@/components/ui/ActionBar";
import { RefreshButton } from "@/components/ui/Buttons";
import { Alert } from "@/components/ui/Alert";
import { DocFlowTransactions, GeneralStats, PeppolTransactions } from "@/types";
import {
  DashboardCard,
  CardSkeleton,
  CardGrid,
} from "@/components/parts/dashboard-report-card";
import { useReportData } from "@/hooks/use-report-data";

export const Dashboard: React.FC = () => {
  const { isLoading, fetchReportData, error, reportData } = useReportData();

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

        {reportData ? (
          <>
            <CardGrid title="General">
              {isLoading ? (
                <CardSkeleton count={generalCards.length} />
              ) : (
                generalCards.map((item, index) => {
                  const value =
                    reportData?.general?.[item.key as keyof GeneralStats] ??
                    "N/A";
                  return (
                    <DashboardCard
                      key={index}
                      title={item.title}
                      value={value.toString()}
                      url={item.url}
                    />
                  );
                })
              )}
            </CardGrid>

            <CardGrid title="Peppol Transactions">
              {isLoading ? (
                <CardSkeleton count={peppolCards.length} />
              ) : (
                peppolCards.map((item, index) => {
                  const value =
                    reportData?.peppolTransactions?.[
                      item.key as keyof PeppolTransactions
                    ] ?? "N/A";

                  return (
                    <DashboardCard
                      key={index}
                      title={item.title}
                      value={value.toString()}
                      url={item.url}
                    />
                  );
                })
              )}
            </CardGrid>

            <CardGrid title="DocFlow Transactions">
              {isLoading ? (
                <CardSkeleton count={docFlowCards.length} />
              ) : (
                docFlowCards.map((item, index) => {
                  const value =
                    reportData?.docFlowTransactions?.[
                      item.key as keyof DocFlowTransactions
                    ] ?? "N/A";
                  return (
                    <DashboardCard
                      key={index}
                      title={item.title}
                      value={value.toString()}
                      url={item.url}
                    />
                  );
                })
              )}
            </CardGrid>
          </>
        ) : (
          <div className="col-span-full p-4 text-center text-gray-500">
            No data available
          </div>
        )}
      </div>
    </>
  );
};
const peppolCards: {
  key: keyof PeppolTransactions;
  title: string;
  url: string;
}[] = [
  {
    key: "all",
    title: "All",
    url: "/transactions?type=peppol",
  },
  {
    key: "received",
    title: "Received",
    url: "/transactions?type=peppol&status=Received",
  },
  {
    key: "draft",
    title: "Draft",
    url: "/transactions?type=peppol&status=Draft",
  },
  {
    key: "posted",
    title: "Posted",
    url: "/transactions?type=peppol&status=Posted",
  },
  {
    key: "synced",
    title: "Synced",
    url: "/transactions?type=peppol&status=Synced",
  },
  {
    key: "failed",
    title: "Failed",
    url: "/transactions?type=peppol&status=Failed",
  },
];

const docFlowCards: {
  key: keyof DocFlowTransactions;
  title: string;
  url: string;
}[] = [
  {
    key: "all",
    title: "All",
    url: "/transactions?type=docflow",
  },
  // {
  //   key: "received",
  //   title: "Received",
  //   url: "/transactions?type=docflow&status=Received",
  // },
  // {
  //   key: "draft",
  //   title: "Draft",
  //   url: "/transactions?type=docflow&status=Draft",
  // },
  {
    key: "posted",
    title: "Posted",
    url: "/transactions?type=docflow&status=Posted",
  },
  {
    key: "synced",
    title: "Synced",
    url: "/transactions?type=docflow&status=Synced",
  },
  {
    key: "failed",
    title: "Failed",
    url: "/transactions?type=docflow&status=Failed",
  },
];

const generalCards: { key: keyof GeneralStats; title: string; url: string }[] =
  [
    { key: "totalUsers", title: "Total Users", url: "/users" },
    {
      key: "totalCompanies",
      title: "Total Companies",
      url: "/companies",
    },
  ];
