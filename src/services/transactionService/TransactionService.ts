import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "../config/api-client";
import { baseUrl, defaultPageSize } from "@/config";
import { Transaction } from "../config/endpoints/endpoints";

export const GetAllTransactions = createAsyncThunk(
  "transactions/fetchTransactions",
  async (
    {
      pageNumber = 1,
      pageSize = defaultPageSize,
    }: { pageNumber?: number; pageSize?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await Transaction.getAllTransactions({
        pageNumber: 1,
        pageSize: 10,
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
