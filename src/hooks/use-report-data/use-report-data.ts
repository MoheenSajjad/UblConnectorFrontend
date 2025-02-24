// Hooks/useReportData.ts - Custom hook for fetching and managing report data
import { useState, useEffect } from "react";
import { ApiResponse, ReportData, CardDefinition } from "@/types";
import { getReport } from "@/services/reportsService";

interface UseReportDataResult {
  reportData: ReportData | null;
  isLoading: boolean;
  error: string | null;
  fetchReportData: () => Promise<void>;
  availableCards: Array<{ title: string; value: any; url: string }>;
}

export const useReportData = (
  cardDefinitions: CardDefinition[]
): UseReportDataResult => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReportData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response: ApiResponse = await getReport();

      if (response.status && response.responseCode === 200) {
        setReportData(response.data);
      } else {
        setError(response.message || "Failed to fetch report data");
      }
    } catch (err) {
      setError("An error occurred while fetching report data");

      console.error("Error fetching report data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  const getAvailableCards = () => {
    if (!reportData || error) return [];

    return cardDefinitions
      .filter((card) => reportData[card.apiField] !== null)
      .map((card) => ({
        title: card.title,
        value: reportData[card.apiField],
        url: card.url,
      }));
  };

  return {
    reportData,
    isLoading,
    error,
    fetchReportData,
    availableCards: getAvailableCards(),
  };
};
