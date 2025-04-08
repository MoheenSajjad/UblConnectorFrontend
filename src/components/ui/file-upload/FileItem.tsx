import React from "react";
import { XCircle } from "lucide-react";
import { FileItemProps } from "./types";

export const FileItem: React.FC<FileItemProps> = ({ file, onRemove }) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " bytes";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getFileIcon = () => {
    if (file.type.includes("pdf")) {
      return (
        <svg
          className="w-6 h-6 text-red-500"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 13.5v-7c0-.41.34-.75.75-.75s.75.34.75.75v7c0 .41-.34.75-.75.75s-.75-.34-.75-.75zm1.5-9c0 .55-.45 1-1 1s-1-.45-1-1 .45-1 1-1 1 .45 1 1z" />
        </svg>
      );
    }

    // Default file icon
    return (
      <svg
        className="w-6 h-6 text-blue-500"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h6v6h6v10H6z" />
      </svg>
    );
  };

  return (
    <div className="border rounded-lg p-3 bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">{getFileIcon()}</div>
          <div>
            <p className="text-sm font-medium text-gray-900">{file.name}</p>
            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
          </div>
        </div>
        <button
          onClick={onRemove}
          className="text-gray-400 hover:text-gray-600"
        >
          <XCircle size={20} />
        </button>
      </div>
    </div>
  );
};
