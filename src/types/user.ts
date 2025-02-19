export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isSuperUser: boolean;
  isArchived: boolean;
  isActive: boolean;
  createdAt: string;
  companies: number[];
};
