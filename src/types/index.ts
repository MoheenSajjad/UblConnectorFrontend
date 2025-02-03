export * from "./api";
export * from "./config";
export * from "./auth";

export interface AlertProps {
  message: string;
  type: "success" | "error" | "warning" | "info";
  onClose?: () => void;
}
