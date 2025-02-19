export type ReportData = {
  totalTransactions?: number;
  totalUsers?: number;
  totalCompanies?: number;
  [key: string]: any;
};

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
