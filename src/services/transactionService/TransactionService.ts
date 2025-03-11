import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "../config/api-client";
import { baseUrl, defaultPageSize } from "@/config";
import { Transaction } from "../config/endpoints/endpoints";

export type transactiontype = "docflow" | "peppol";

export const GetAllTransactions = createAsyncThunk(
  "transactions/fetchTransactions",
  async (
    {
      pageNumber = 1,
      pageSize = defaultPageSize,
      type = "docflow",
    }: { pageNumber?: number; pageSize?: number; type: transactiontype },
    { rejectWithValue }
  ) => {
    try {
      const response = await Transaction.getAllTransactions(type, {
        pageNumber,
        pageSize,
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
    }: { data: string; transactionId: string | undefined },
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
