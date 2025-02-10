import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "@/config";

export const GetAllTransactions = createAsyncThunk(
  "transactions/fetchTransactions",
  async (
    {
      pageNumber = 1,
      pageSize = 10,
    }: { pageNumber?: number; pageSize?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(`${baseUrl}/GetAllTransactions`, {
        params: { pageNumber, pageSize },
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
      const response = await axios.get(
        `${baseUrl}/GetTransactionById/${transactionId}`
      );

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
