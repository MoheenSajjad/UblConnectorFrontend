import { Sap } from "../config/endpoints";

export const getBusinessPartners = async () => {
  try {
    const response = await Sap.GetBusinessPartners();

    if (response.data.responseCode !== 200) {
      console.log("dsadsadsadsa");

      throw new Error(response.data.message || "Failed to fetch report");
    }

    return response.data;
  } catch (error: any) {
    throw error;
  }
};
