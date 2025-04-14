import { CompanyFilterState } from "@/components/parts/company-filters";
import { TransactionFilterState } from "@/components/parts/transaction-filters";
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

type getAllTransactionsParams = {
  params?: PaginationParams;
  filters: TransactionFilterState | undefined;
};

export const Transaction = {
  getAllTransactions: (data: getAllTransactionsParams) =>
    post(`/GetAllTransactions`, { data }),
  getById: (transactionId: string) =>
    get(`/GetTransactionById/${transactionId}`),
  updateTransactionPayload: (
    transactionId: string,
    data: {
      invoiceEditPayload: string;
      postData: any;
      isSavePostData: boolean;
    }
  ) => {
    console.log("Payload sent to API:", data);
    return post(`/UpdateInvoicePayload/${transactionId}`, { ...data });
  },
  SaveAttachmentAsBase64: (transactionId: number, base64: string) =>
    post(`/SaveAttachmentAsBase64?transactionId=${transactionId}`, { base64 }),
  UploadInvoiceFiles: (request: FormData) =>
    post(`/UploadInvoiceFiles`, request),
};

export const Auth = {
  login: (credentials: LoginCredentials) => post("/SignIn", credentials),
};

export const Report = {
  Get: () => get("/Report"),
};

export const Sap = {
  GetBusinessPartners: (transactionId: string) =>
    get(`/GetSAPBusinessPartners?transactionId=${transactionId}`),
  GetPurchaseOrderCodes: (
    transactionId: string,
    cardCode: string,
    docType: string
  ) =>
    get(
      `/GetSAPPurchaseOrders?transactionId=${transactionId}&cardcode=${cardCode}&docType=${docType}`
    ),
  GetPurchaseOrderLines: (
    transactionId: string,
    docEntry: number,
    cardCode: string
  ) =>
    get(
      `/GetSAPPurchaseOrderLines?transactionId=${transactionId}&docEntry=${docEntry}&cardCode=${cardCode}`
    ),
  GetGoodReceiptCodes: (
    transactionId: string,
    cardCode: string,
    docType: string
  ) =>
    get(
      `/GetSAPGoodReceipt?transactionId=${transactionId}&cardcode=${cardCode}&docType=${docType}`
    ),
  GetGoodReceiptLines: (
    transactionId: string,
    docEntry: number,
    cardCode: string
  ) =>
    get(
      `/GetSAPGoodReceiptLines?transactionId=${transactionId}&docEntry=${docEntry}&cardCode=${cardCode}`
    ),
  GetVatGroupCodes: (transactionId: string) =>
    get(`/GetSAPVatGroupCodes?transactionId=${transactionId}`),
};

type getAllCompaniesParams = {
  params: PaginationParams;
  filters?: CompanyFilterState | {};
};
export const Company = {
  GetCompanies: () => get("/GetCompanies"),
  GetAllCompanies: (data?: getAllCompaniesParams) =>
    post("/GetAllCompanies", { data }),
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
