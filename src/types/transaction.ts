export interface Transaction {
  id: number;
  requestPayload: string;
  isCustomApi: boolean;
  isPushed: boolean;
  createdAt: string;
  retryDate: string | null;
  triggeredAt?: string;
  errorMessage: string | null;
  payloadType: "Json" | "Xml";
  status: string;
  sendingCompanyId: number;
  receivingCompanyId: number;
  sendingCompany: Company;
  receivingCompany: Company;
  editInvoicePayload: string;
  attachmentFlag: string;
  attachmentEntry: number;
  docEntry?: number;
  docNum?: number;
  businessPartnerName?: string;
}

interface Company {
  id: number;
  name: string;
  isActive: boolean;
  email: string;
  companyId: string;
}
