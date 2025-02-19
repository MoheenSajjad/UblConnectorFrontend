import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { defaultPageSize } from "@/config";
import { Company } from "@/types/companies";
import {
  GetCompanyById,
  GetAllCompanies,
  DeleteCompany,
  UpdateCompany,
  CreateCompany,
} from "@/services/companiesService";

interface CompanyState {
  companies: Company[];
  company: Company | null;
  totalCount: number;
  loading: boolean;
  error: string | null;
  pageNumber: number;
  pageSize: number;
}

const initialState: CompanyState = {
  companies: [],
  company: null,
  totalCount: 0,
  loading: false,
  error: null,
  pageNumber: 1,
  pageSize: defaultPageSize,
};

const companySlice = createSlice({
  name: "companies",
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
      // GetAllCompanies
      .addCase(GetAllCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetAllCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload.records;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(GetAllCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch companies";
      })

      // GetCompanyById
      .addCase(GetCompanyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetCompanyById.fulfilled, (state, action) => {
        state.loading = false;
        state.company = action.payload;
      })
      .addCase(GetCompanyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch company details";
      })

      // CreateCompany
      .addCase(CreateCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(CreateCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.companies.push(action.payload);
      })
      .addCase(CreateCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create company";
      })

      // UpdateCompany
      .addCase(UpdateCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(UpdateCompany.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.companies.findIndex(
          (company) => company.id === action.payload.id
        );
        if (index !== -1) {
          state.companies[index] = action.payload;
        }
      })
      .addCase(UpdateCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update company";
      })

      // DeleteCompany
      .addCase(DeleteCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(DeleteCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = state.companies.map((company) =>
          company.id === action.payload.id
            ? { ...company, isArchived: !action.payload.isDelete }
            : company
        );
      })
      .addCase(DeleteCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete company";
      });
  },
});

export const { setPageNumber, setPageSize } = companySlice.actions;
export default companySlice.reducer;
