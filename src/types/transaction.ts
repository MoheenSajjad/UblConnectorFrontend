type SystemInfo = {
  id: string;
  name: string;
  type: string;
  typeDescription: string;
};

type Transaction = {
  id: string;
  externalId: string;
  type: string;
  typeDescription: string;
  inboundUser: SystemInfo;
  inboundSystem: SystemInfo;
  outboundSystem: SystemInfo;
  status: string;
  statusDescription: string;
  createdAt: string;
};
