import React from "react";
import { UploadProgressProps } from "./types";

export const ProgressBar: React.FC<UploadProgressProps> = ({ progress }) => {
  return (
    <div className="mt-2">
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="text-right text-xs text-gray-500 mt-1">{progress}%</div>
    </div>
  );
};
