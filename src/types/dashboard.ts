export type CardDefinition = {
  apiField: keyof ReportData;
  title: string;
  url: string;
};

export type CardProps = {
  title: string;
  value: number | string;
  url: string;
  onClick?: () => void;
};
export type ReportData = {
  peppolTransactions: PeppolTransactions;
  docFlowTransactions: DocFlowTransactions;
  general: GeneralStats;
  [key: string]: any;
};

export type PeppolTransactions = {
  failed: number;
  synced: number;
  posted: number;
  draft: number;
  received: number;
};

export type DocFlowTransactions = {
  failed: number;
  synced: number;
  posted: number;
  draft: number;
  received: number;
};

export type GeneralStats = {
  totalUsers: number;
  totalCompanies: number;
};
