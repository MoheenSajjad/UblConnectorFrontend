import { Config } from "./config";

export interface ApiResponse {
  responseCode: number;
  message: string;
  data: any;
  status: boolean;
}
