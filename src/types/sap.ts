export interface BusinnessPartner {
  CardCode: string;
  CardName: string;
}

export interface OrderCode {
  "odata.etag": string;
  DocEntry: number;
  DocNum: number;
  CardCode: string;
  CardName: string;
  NumAtCard: string | null;
}

export interface OrderCodeResponse {
  "odata.metadata": string;
  value: OrderCode[];
}

export interface OrderLine {
  lineStatus: string;
  lineNum: number;
  itemCode: string;
  itemDescription: string;
  quantity: number;
  currency: string;
  accountCode: string;
  vatGroup: string;
  lineTotal: number;
  docEntry: number;
  unitPrice: number;
}

export interface OrderLineResponse {
  "odata.metadata": string;
  value: OrderLines[];
}

export interface OrderLines {
  "odata.etag": string;
  DocType: string;
  DocumentLines: OrderLine[];
}

export interface VatGroup {
  Code: string;
  Name: string;
}

export interface VATGroupResponse {
  "odata.metadata": string;
  value: VatGroup[];
}
// export interface Document {
//   "odata.etag": string;
//   DocType: string;
//   DocumentLines: DocumentLine[];
// }

export interface IChartOfAccount {
  Code: string;
  Name: string;
}
