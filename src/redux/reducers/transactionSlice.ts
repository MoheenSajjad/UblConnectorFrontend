import { Transaction } from "@/types/transaction";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { defaultPageSize } from "@/config";
import {
  GetAllTransactions,
  GetTransactionById,
} from "@/services/transactionService";

interface TransactionState {
  transactions: Transaction[];
  transaction: Transaction | null;
  totalCount: number;
  loading: boolean;
  error: string | null;
  pageNumber: number;
  pageSize: number;
}

const initialState: TransactionState = {
  transactions: [],
  transaction: null,
  totalCount: 0,
  loading: false,
  error: null,
  pageNumber: 1,
  pageSize: defaultPageSize,
};

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    setPageNumber: (state, action: PayloadAction<number>) => {
      state.pageNumber = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(GetAllTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        GetAllTransactions.fulfilled,
        (
          state,
          action: PayloadAction<{ totalCount: number; records: Transaction[] }>
        ) => {
          state.loading = false;
          state.transactions = action.payload.records;
          state.totalCount = action.payload.totalCount;
        }
      )
      .addCase(GetAllTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(GetTransactionById.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetTransactionById.fulfilled, (state, action) => {
        state.loading = false;
        state.transaction = action.payload;
      })
      .addCase(GetTransactionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setPageNumber, setPageSize } = transactionSlice.actions;
export default transactionSlice.reducer;
