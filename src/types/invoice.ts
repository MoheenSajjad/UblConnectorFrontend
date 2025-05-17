export interface Invoice {
  CustomizationID: string;
  ProfileID: string;
  ID: string;
  IssueDate: string;
  Note?: string;
  DueDate: string;
  InvoiceTypeCode: string;
  DocumentCurrencyCode: string;
  EmbeddedDocumentBinaryObject: string;
  AdditionalDocumentReference: {
    ID: string;
    Attachment: {
      EmbeddedDocumentBinaryObject: string;
    };
  };
  ProjectReference: {
    ID: string;
  };
  AccountingSupplierParty: {
    Party: Party;
  };
  AccountingCustomerParty: {
    Party: Party;
  };
  LegalMonetaryTotal: {
    LineExtensionAmount: string;
    TaxExclusiveAmount: string;
    TaxInclusiveAmount: string;
    PayableAmount: string;
  };
  InvoiceLine: InvoiceLine[];
  selectedReferenceCode: string;
  selectedBusinessPartner: string;
  selectedDocType: string;
  selectedPoOrderCode: selectedCodeItem;
  selectedGrnOrderCode: selectedCodeItem[];
  attachmentEntry: string;
  isPayloadSaved: boolean;
}

interface Party {
  EndpointID: string;
  PartyName: {
    Name: string;
  };
  PostalAddress: {
    StreetName: string;
    CityName?: string;
    PostalZone?: string;
    CountrySubentity?: string;
    Country: {
      IdentificationCode: string;
    };
  };
  PartyTaxScheme?: {
    CompanyID: string;
    TaxScheme: {
      ID: string;
    };
  };
  PartyLegalEntity: {
    RegistrationName: string;
    CompanyID?: string;
  };
  Contact?: {
    Name?: string;
    Telephone?: string;
    ElectronicMail: string;
  };
}

export interface InvoiceLine {
  ID: string;
  InvoicedQuantity: string;
  LineExtensionAmount: string;
  Item: {
    Name: string;
  };
  Price: {
    PriceAmount: string;
  };
  selectedCode: selectedCodeItem;
  selectedLine: string;
  selectedVat: string;
  selectedBaseEntry: number;
  selectedLineNum: number;

  accountCode: string;
}

export interface selectedCodeItem {
  Code: string;
  Name: string;
  Value: number;
}
