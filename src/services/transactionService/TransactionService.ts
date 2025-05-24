import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "../config/api-client";
import { baseUrl, defaultPageSize } from "@/config";
import { Transaction } from "../config/endpoints/endpoints";
import { TransactionFilterState } from "@/components/parts/transaction-filters";
import { ApiResponse } from "@/types";

export const GetAllTransactions = createAsyncThunk(
  "transactions/fetchTransactions",
  async (
    {
      pageNumber = 1,
      pageSize = defaultPageSize,
      filters,
    }: {
      pageNumber?: number;
      pageSize?: number;
      filters: TransactionFilterState;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await Transaction.getAllTransactions({
        params: { pageNumber, pageSize },
        filters,
      });

      if (response.data.responseCode !== 200) {
        throw new Error(
          response.data.message || "Failed to fetch transactions"
        );
      }

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const GetTransactionById = createAsyncThunk(
  "transactions/fetchTransactionById",
  async (transactionId: string, { rejectWithValue }) => {
    try {
      const response = await Transaction.getById(transactionId);

      if (response.data.responseCode !== 200) {
        throw new Error(
          response.data.message || "Failed to fetch transaction details"
        );
      }

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const UpdateTransactionPayload = createAsyncThunk(
  "transactions/UpdateTransactionPayload",
  async (
    {
      data,
      transactionId,
    }: {
      data: {
        invoiceEditPayload: string;
        postData: any;
        isSavePostData: boolean;
      };
      transactionId: string | undefined;
    },
    { rejectWithValue }
  ) => {
    try {
      if (!transactionId) return;
      const response = await Transaction.updateTransactionPayload(
        transactionId,
        data
      );

      if (response.data.responseCode !== 200) {
        throw new Error(
          response.data.message || "Failed to updateTransactionPayload"
        );
      }

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const SaveAttachmentAsBase64 = async (
  transactionId: number,
  base64: string
) => {
  try {
    if (!transactionId) return;
    const response = await Transaction.SaveAttachmentAsBase64(
      transactionId,
      base64
    );
    const data = response.data as ApiResponse;

    if (response.data.responseCode !== 200 || !data.status) {
      throw new Error(response.data.message || "Failed to Upload the Files");
    }

    return response.data;
  } catch (error: any) {
    throw error;
  }
};
export const InvoiceFileUploadApi = async (formdata: FormData) => {
  try {
    // for (const pair of formdata.entries()) {
    //   console.log(`${pair[0]}: ${pair[1]}`);
    // }

    const response = await Transaction.UploadInvoiceFiles(formdata);
    const data = response.data as ApiResponse;

    if (data.responseCode !== 200 || !data.status) {
      throw new Error(response.data.message || "Failed to Upload the files");
    }
    return data;
  } catch (error: any) {
    throw error;
  }
};

export const ResetTransactionApi = async (id: number) => {
  try {
    const res = await Transaction.ResetTransactionApi(id);
    const data = res.data as ApiResponse;

    if (data.responseCode !== 200 || !data.status) {
      throw new Error(res.data.message || "Failed to Reset");
    }
    return data;
  } catch (error) {
    throw error;
  }
};
