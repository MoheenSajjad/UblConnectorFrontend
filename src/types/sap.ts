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
  LineStatus: string;
  LineNum: number;
  ItemCode: string;
  ItemDescription: string;
  Quantity: number;
  ShipDate: string;
  Price: number;
  PriceAfterVAT: number;
  Currency: string;
  Rate: number;
  DiscountPercent: number;
  VendorNum: string;
  SerialNum: string | null;
  WarehouseCode: string;
  SalesPersonCode: number;
  CommisionPercent: number;
  TreeType: string;
  AccountCode: string;
  UseBaseUnits: string;
  SupplierCatNum: string;
  CostingCode: string | null;
  ProjectCode: string;
  BarCode: string;
  VatGroup: string;
  Height1: number;
  Hight1Unit: string | null;
  Height2: number;
  Height2Unit: string | null;
  Lengh1: number;
  Lengh1Unit: string | null;
  Lengh2: number;
  Lengh2Unit: string | null;
  Weight1: number;
  Weight1Unit: string | null;
  Weight2: number;
  Weight2Unit: string | null;
  Factor1: number;
  Factor2: number;
  Factor3: number;
  Factor4: number;
  BaseType: number;
  BaseEntry: number;
  BaseLine: number;
  Volume: number;
  VolumeUnit: number;
  Width1: number;
  Width1Unit: string | null;
  Width2: number;
  Width2Unit: string | null;
  Address: string;
  TaxCode: string | null;
  TaxType: string;
  TaxLiable: string;
  PickStatus: string;
  PickQuantity: number;
  PickListIdNumber: string | null;
  OriginalItem: string | null;
  BackOrder: string | null;
  FreeText: string;
  ShippingMethod: number;
  POTargetNum: string | null;
  POTargetEntry: string;
  POTargetRowNum: number | null;
  CorrectionInvoiceItem: string;
  CorrInvAmountToStock: number;
  CorrInvAmountToDiffAcct: number;
  AppliedTax: number;
  AppliedTaxFC: number;
  AppliedTaxSC: number;
  WTLiable: string;
  DeferredTax: string;
  EqualizationTaxPercent: number;
  TotalEqualizationTax: number;
  TotalEqualizationTaxFC: number;
  TotalEqualizationTaxSC: number;
  NetTaxAmount: number;
  NetTaxAmountFC: number;
  NetTaxAmountSC: number;
  MeasureUnit: string;
  UnitsOfMeasurment: number;
  LineTotal: number;
  TaxPercentagePerRow: number;
  TaxTotal: number;
  ConsumerSalesForecast: string;
  ExciseAmount: number;
  TaxPerUnit: number;
  TotalInclTax: number;
  CountryOrg: string | null;
  TransactionType: string | null;
  DistributeExpense: string;
  RowTotalFC: number;
  RowTotalSC: number;
  LastBuyInmPrice: number;
  OpenAmount: number;
  OpenAmountFC: number;
  OpenAmountSC: number;
  DocEntry: number;
  GrossPrice: number;
  GrossTotal: number;
  GrossTotalFC: number;
  GrossTotalSC: number;
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
