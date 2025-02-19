import { get, post, put, destroy } from "@/services/config/api-client";
import { LoginCredentials } from "@/types";
import { Company as CompanyRecord } from "@/types/companies";
import { User as UserRecord } from "@/types/user";

export type PaginationParams = {
  pageNumber?: number;
  pageSize?: number;
};

type updateCompanyProps = {
  id: CompanyRecord["id"];
  company: CompanyRecord;
};

export const Transaction = {
  getAllTransactions: (params?: PaginationParams) =>
    get("/GetAllTransactions", { params }),
  getById: (transactionId: string) =>
    get(`/GetTransactionById/${transactionId}`),
};

export const Auth = {
  login: (credentials: LoginCredentials) => post("/SignIn", credentials),
};

export const Report = {
  Get: () => get("/Report"),
};

export const Company = {
  GetAllCompanies: (params?: PaginationParams) =>
    get("/GetAllCompanies", { params }),
  GetCompanyById: (id: string) => post(`/GetCompanyById/${id}`),
  CreateCompany: (company: Omit<CompanyRecord, "id">) =>
    post(`/CreateCompany`, company),
  UpdateCompany: ({ id, company }: updateCompanyProps) =>
    post(`/UpdateCompany/${id}`, company),
  DeleteCompany: (id: CompanyRecord["id"], isDelete: boolean) =>
    destroy(`/DeleteCompany/${id}?isArchived=${!isDelete}`),
};

export const User = {
  GetAllUsers: (params?: PaginationParams) => get("/GetAllUsers", { params }),
  GetUserById: (id: string) => post(`/GetUserById/${id}`),
  CreateUser: (user: Omit<UserRecord, "id" | "createdAt">) =>
    post(`/CreateUser`, user),
  UpdateUser: ({
    id,
    user,
  }: {
    id: string;
    user: Omit<UserRecord, "createdAt">;
  }) => post(`/UpdateUser/${id}`, user),
  DeleteUser: (id: UserRecord["id"], isDelete: boolean) =>
    destroy(`/DeleteUser/${id}?isArchived=${!isDelete}`),
};
