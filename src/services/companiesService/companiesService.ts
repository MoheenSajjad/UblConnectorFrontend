import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl, defaultPageSize } from "@/config";
import { Company as CompanyRecord } from "@/types/companies";
import { Company } from "../config/endpoints/endpoints";
import { useNotify } from "@/components/ui/Notify";
import { CompanyFilterState } from "@/components/parts/company-filters";
import { ApiResponse } from "@/types";

type GetAllCompaniesProps = {
  pageNumber?: number;
  pageSize?: number;
  filters?: CompanyFilterState | {};
};

export const GetAllCompanies = createAsyncThunk(
  "companies/fetchCompanies",
  async (apiOptions: GetAllCompaniesProps, { rejectWithValue }) => {
    try {
      const { pageNumber, pageSize, filters } = apiOptions;
      const response = await Company.GetAllCompanies({
        params: { pageNumber, pageSize },
        filters,
      });
      if (response.data.responseCode !== 200) {
        throw new Error(response.data.message || "Failed to fetch companies");
      }

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const GetCompanies = async () => {
  try {
    const response = await Company.GetCompanies();
    if (response.data.responseCode !== 200) {
      throw new Error(response.data.message || "Failed to fetch companies");
    }

    return response.data.data;
  } catch (error: any) {
    throw error;
  }
};

export const GetCompanyById = createAsyncThunk(
  "companies/fetchCompanyById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await Company.GetCompanyById(id);
      if (response.data.responseCode !== 200) {
        throw new Error(response.data.message || "Failed to fetch company");
      }
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const CreateCompany = createAsyncThunk(
  "companies/createCompany",
  async (company: Omit<CompanyRecord, "id">, { rejectWithValue }) => {
    try {
      const response = await Company.CreateCompany(company);
      const data = response.data as ApiResponse;

      if (response.data.responseCode !== 200 || !data.status) {
        throw new Error(data.message || "Failed to create company");
      }
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const UpdateCompany = createAsyncThunk(
  "companies/updateCompany",
  async (company: CompanyRecord, { rejectWithValue }) => {
    try {
      const response = await Company.UpdateCompany({ id: company.id, company });
      const data = response.data as ApiResponse;

      if (response.data.responseCode !== 200 || !data.status) {
        throw new Error(data.message || "Failed to create company");
      }
      return response.data.data;
    } catch (error: any) {
      console.log(error);

      return rejectWithValue(error.message);
    }
  }
);

export const DeleteCompany = createAsyncThunk(
  "companies/deleteCompany",
  async (
    { id, isDelete }: { id: number; isDelete: boolean },
    { rejectWithValue }
  ) => {
    try {
      const response = await Company.DeleteCompany(id, isDelete);
      if (response.data.responseCode !== 200) {
        throw new Error(response.data.message || "Failed to delete company");
      }

      return { id, isDelete };
    } catch (error: any) {
      console.log(error);

      return rejectWithValue(error.message);
    }
  }
);
