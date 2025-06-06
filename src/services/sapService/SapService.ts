import { OrderCodeResponse, OrderLineResponse } from "@/types/sap";
import { Sap, Transaction } from "../config/endpoints";

export interface ITestSAPConnectionProps {
  sapUrl: string;
  userName: string;
  password: string;
  companyDb: string;
}

export const testSAPConnection = async ({
  sapUrl,
  userName,
  password,
  companyDb,
}: ITestSAPConnectionProps) => {
  try {
    if (!sapUrl || !userName || !companyDb) return;
    const response = await Sap.TestSAPConnection({
      sapUrl,
      userName,
      password,
      companyDb,
    });

    console.log(response);

    if (response.data.responseCode !== 200) {
      throw new Error(response.data.message || "Failed to Test Connection");
    }

    return response.data;
  } catch (error: any) {
    throw error;
  }
};

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
  transactionId: string | undefined,
  cardCode: string,
  docType: string
) => {
  try {
    if (!transactionId || !cardCode || !docType) return;
    const response = await Sap.GetPurchaseOrderCodes(
      transactionId,
      cardCode,
      docType
    );

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
  transactionId: string | undefined,
  cardCode: string,
  docType: string
) => {
  try {
    if (!transactionId || !cardCode || !docType) return;
    const response = await Sap.GetGoodReceiptCodes(
      transactionId,
      cardCode,
      docType
    );

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
  docEntry: number[] | null,
  cardCode: string[] | null
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

export const GetSAPChartOfAccounts = async (
  transactionId: string | undefined
) => {
  try {
    if (!transactionId) return;
    const response = await Sap.GetSAPChartOfAccounts(transactionId);

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

export const GetSAPVatGroupCodes = async (
  transactionId: string | undefined
) => {
  try {
    if (!transactionId || transactionId == undefined) return;
    const response = await Sap.GetSAPVatGroupCodes(transactionId);

    if (response.data.responseCode !== 200) {
      throw new Error(response.data.message || "Failed to fetch report");
    }

    return response.data;
  } catch (error: any) {
    throw error;
  }
};
