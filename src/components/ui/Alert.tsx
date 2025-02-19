import React, { useEffect } from "react";
import { AlertCircle, CheckCircle, Info, X, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AlertProps } from "@/types";

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const Alert: React.FC<AlertProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    if (onClose) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [onClose]);

  const Icon = icons[type];

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 flex items-center gap-2 p-4 rounded-lg shadow-lg",
        {
          "bg-green-50 text-green-800": type === "success",
          "bg-red-50 text-red-800": type === "error",
          "bg-yellow-50 text-yellow-800": type === "warning",
          "bg-blue-50 text-blue-800": type === "info",
        }
      )}
    >
      <Icon className="w-5 h-5" />
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} className="ml-2 hover:opacity-70">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;
