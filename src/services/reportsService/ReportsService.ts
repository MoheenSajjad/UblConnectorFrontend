import { Report } from "../config/endpoints";

export const getReport = async () => {
  try {
    const response = await Report.Get();
    if (response.data.responseCode !== 200) {
      throw new Error(response.data.message || "Failed to fetch report");
    }

    return response.data;
  } catch (error: any) {
    throw error;
  }
};
