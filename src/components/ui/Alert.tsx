import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  CheckCircle,
  AlertCircle,
  Info,
  XCircle,
  X as CloseIcon,
} from "lucide-react";

export type AlertStatus = "success" | "error" | "info" | "warning";

export interface AlertProps {
  status?: AlertStatus;
  title: string;
  message?: string;
  duration?: number;
  onClose?: () => void;
  className?: string;
}

const statusConfig = {
  success: {
    icon: CheckCircle,
    color: "bg-green-500",
    border: "border-green-500",
    text: "text-green-700",
    bg: "bg-green-50",
  },
  error: {
    icon: XCircle,
    color: "bg-red-500",
    border: "border-red-500",
    text: "text-red-700",
    bg: "bg-red-50",
  },
  warning: {
    icon: AlertCircle,
    color: "bg-yellow-500",
    border: "border-yellow-500",
    text: "text-yellow-700",
    bg: "bg-yellow-50",
  },
  info: {
    icon: Info,
    color: "bg-blue-500",
    border: "border-blue-500",
    text: "text-blue-700",
    bg: "bg-blue-50",
  },
};

export const Alert = ({
  status = "info",
  title,
  message,
  duration = 2800,
  onClose,
  className,
}: AlertProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const config = statusConfig[status];
  const Icon = config.icon;

  useEffect(() => {
    if (!duration) return;

    const interval = 50; // Update every 50ms for smooth progress
    const step = (interval / duration) * 100;

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - step;
        if (newProgress <= 0) {
          clearInterval(timerRef.current!);
          setIsVisible(false);
          onClose?.();
          return 0;
        }
        return newProgress;
      });
    }, interval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed top-4 right-2 z-[60] overflow-hidden rounded-lg border p-4 max-w-md shadow-sm",
        config.bg,
        config.border,
        className
      )}
    >
      {/* Progress Bar */}
      <div
        className={cn("absolute top-0 left-0 h-1", config.color)}
        style={{ width: `${progress}%`, transition: "width 50ms linear" }}
      />

      <div className="flex items-start gap-3">
        <Icon className={cn("h-5 w-5 mt-0.5", config.text)} />

        <div className="flex-1">
          <h4 className={cn("text-sm font-medium mb-1", config.text)}>
            {title}
          </h4>
          <p className={cn("text-sm", config.text)}>{message}</p>
        </div>

        <button
          onClick={() => {
            setIsVisible(false);
            if (timerRef.current) clearInterval(timerRef.current);
            onClose?.();
          }}
          className={cn(
            "opacity-70 hover:opacity-100 transition-opacity",
            config.text
          )}
        >
          <CloseIcon className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    </div>
  );
};

// import React, { useEffect } from "react";
// import { AlertCircle, CheckCircle, Info, X, XCircle } from "lucide-react";
// import { cn } from "@/lib/utils";
// import type { AlertProps } from "@/types";

// const icons = {
//   success: CheckCircle,
//   error: XCircle,
//   warning: AlertCircle,
//   info: Info,
// };

// const Alert: React.FC<AlertProps> = ({ message, type, onClose }) => {
//   useEffect(() => {
//     if (onClose) {
//       const timer = setTimeout(onClose, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [onClose]);

//   const Icon = icons[type];

//   return (
//     <div
//       className={cn(
//         "fixed top-4 right-4 z-50 flex items-center gap-2 p-4 rounded-lg shadow-lg",
//         {
//           "bg-green-50 text-green-800": type === "success",
//           "bg-red-50 text-red-800": type === "error",
//           "bg-yellow-50 text-yellow-800": type === "warning",
//           "bg-blue-50 text-blue-800": type === "info",
//         }
//       )}
//     >
//       <Icon className="w-5 h-5" />
//       <span>{message}</span>
//       {onClose && (
//         <button onClick={onClose} className="ml-2 hover:opacity-70">
//           <X className="w-4 h-4" />
//         </button>
//       )}
//     </div>
//   );
// };

// export default Alert;
