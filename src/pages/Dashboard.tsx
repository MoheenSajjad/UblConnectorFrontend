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
import { Button } from "@/components/ui/Button";
import { useModal } from "@/hooks/use-modal";
import { InvoiceFileUpload } from "@/components/parts/InvoiceFileUpload";
import { NoDataBoundary } from "@/components/ui/no-data-boundary";
import { Empty } from "@/components/ui/Empty";
import { useAuth } from "@/hooks/use-auth";

export const Dashboard: React.FC = () => {
  const { isLoading, fetchReportData, error, reportData } = useReportData();

  const { isOpen, openModal, closeModal } = useModal();

  const handleRefresh = () => {
    fetchReportData();
  };

  const handelOpenFileUploadModal = () => {
    openModal();
  };

  const { isSuperUser } = useAuth();

  return (
    <>
      {error && <Alert status="error" title="Error" message={error} />}
      <div className="min-h-96">
        <ActionBar title="Dashboard">
          <Button onClick={handelOpenFileUploadModal}>Upload Invoice</Button>
          <RefreshButton handleRefresh={handleRefresh} />
        </ActionBar>

        {
          <>
            <CardGrid title="General">
              {isLoading ? (
                <CardSkeleton count={generalCards.length} />
              ) : (
                <NoDataBoundary
                  condition={generalCards && generalCards?.length > 0}
                  fallback={<Empty />}
                >
                  {generalCards?.map((item, index) => {
                    const value =
                      reportData?.general?.[item.key as keyof GeneralStats] ??
                      "0";
                    if (item.title === "Total Users" && !isSuperUser) return;
                    return (
                      <DashboardCard
                        key={index}
                        title={item.title}
                        value={value.toString()}
                        url={item.url}
                      />
                    );
                  })}
                </NoDataBoundary>
              )}
            </CardGrid>

            <CardGrid title="Peppol Transactions">
              {isLoading ? (
                <CardSkeleton count={peppolCards.length} />
              ) : (
                <NoDataBoundary
                  condition={peppolCards && peppolCards.length > 0}
                  fallback={
                    <div className="col-span-full ">
                      <Empty />
                    </div>
                  }
                >
                  {peppolCards.map((item, index) => {
                    const value =
                      reportData?.peppolTransactions?.[
                        item.key as keyof PeppolTransactions
                      ] ?? "0";

                    return (
                      <DashboardCard
                        key={index}
                        title={item.title}
                        value={value.toString()}
                        url={item.url}
                      />
                    );
                  })}
                </NoDataBoundary>
              )}
            </CardGrid>

            <CardGrid title="DocFlow Transactions">
              {isLoading ? (
                <CardSkeleton count={docFlowCards.length} />
              ) : (
                <NoDataBoundary
                  condition={docFlowCards && docFlowCards.length > 0}
                  fallback={
                    <div className="col-span-full ">
                      <Empty />
                    </div>
                  }
                >
                  {docFlowCards.map((item, index) => {
                    const value =
                      reportData?.docFlowTransactions?.[
                        item.key as keyof DocFlowTransactions
                      ] ?? "0";

                    return (
                      <DashboardCard
                        key={index}
                        title={item.title}
                        value={value.toString()}
                        url={item.url}
                      />
                    );
                  })}
                </NoDataBoundary>
              )}
            </CardGrid>
          </>
        }
      </div>
      {isOpen && (
        <InvoiceFileUpload
          isOpen={isOpen}
          onClose={closeModal}
          onUploadComplete={() => fetchReportData()}
        />
      )}
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
