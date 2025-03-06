import { Invoice } from "./invoice";

export interface Address {
  name: string;
  address: string;
  zip: string;
  city: string;
  country: string;
  email: string;
  phone: string;
}

export interface InvoiceDetails {
  logo?: File;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  currency: string;
  template: string;
}

export interface LineItem {
  id: string;
  name: string;
  quantity: number;
  rate: number;
  description: string;
}

export interface PaymentInfo {
  bankName: string;
  accountName: string;
  accountNumber: string;
}

export interface Summary {
  signature?: string;
  additionalNotes: string;
  paymentTerms: string;
  discount: number;
  tax: number;
  shipping: number;
  includeInWords: boolean;
}

export interface InvoiceFormData {
  billFrom: Address;
  billTo: Address;
  invoiceDetails: InvoiceDetails;
  lineItems: LineItem[];
  paymentInfo: PaymentInfo;
  summary: Summary;
  selectedBusinessPartner: string | null;
  selectedGoodReceiptCode: string | null;
  selectedPurchaseOrderCode: string | null;
  selectedReferenceType: string;
}

export type StepProps = {
  data: Invoice;
};
