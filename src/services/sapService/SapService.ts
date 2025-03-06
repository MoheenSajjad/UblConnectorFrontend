import { OrderLineResponse } from "@/types/sap";
import { Sap } from "../config/endpoints";

export const getBusinessPartners = async (
  transactionId: string | undefined
) => {
  try {
    if (!transactionId || transactionId == undefined) return;
    const response = await Sap.GetBusinessPartners(transactionId);

    if (response.data.responseCode !== 200) {
      throw new Error(response.data.message || "Failed to fetch report");
    }

    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const getSAPPurchaseOrderCodes = async (
  transactionId: string | undefined
): Promise<OrderLineResponse | undefined> => {
  try {
    if (!transactionId) return;
    const response = await Sap.GetPurchaseOrderCodes(transactionId);

    if (response.data.responseCode !== 200) {
      throw new Error(
        response.data.message || "Failed to SAP Purchase Order Codes"
      );
    }

    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const getSAPPurchaseOrderLines = async (
  transactionId: string | undefined,
  docEntry: number | null,
  cardCode: string | null
) => {
  try {
    if (!transactionId || !cardCode || !docEntry || transactionId == undefined)
      return;
    const response = await Sap.GetPurchaseOrderLines(
      transactionId,
      docEntry,
      cardCode
    );

    if (response.data.responseCode !== 200) {
      throw new Error(
        response.data.message || "Failed to SAP Purchase Order Codes"
      );
    }

    return response.data?.data;
  } catch (error: any) {
    throw error;
  }
};

export const getSAPGoodReceiptCodes = async (
  transactionId: string | undefined
) => {
  try {
    if (!transactionId || transactionId == undefined) return;
    const response = await Sap.GetGoodReceiptCodes(transactionId);

    if (response.data.responseCode !== 200) {
      throw new Error(
        response.data.message || "Failed to fetch SAP Good Receipt Codes"
      );
    }

    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const getSAPGoodReceiptLines = async (
  transactionId: string | undefined,
  docEntry: number | null,
  cardCode: string | null
) => {
  try {
    if (!transactionId || !docEntry || !cardCode || transactionId == undefined)
      return;
    const response = await Sap.GetGoodReceiptLines(
      transactionId,
      docEntry,
      cardCode
    );

    if (response.data.responseCode !== 200) {
      throw new Error(
        response.data.message || "Failed to fetch SAP Good Receipt Codes"
      );
    }

    return response.data?.data;
  } catch (error: any) {
    throw error;
  }
};
