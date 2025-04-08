// src/components/ui/file-upload/FileDropZone.tsx
import React, { useRef, useState, DragEvent, ChangeEvent } from "react";
import { FileValidationRules } from "@/hooks/use-file-upload";

interface FileDropZoneProps {
  onFileSelect: (file: File) => void;
  onFilesSelect?: (files: File[]) => void;
  validationRules?: FileValidationRules;
  onError?: (error: string) => void;
  accept?: string;
  multiple?: boolean;
  children?: React.ReactNode;
  className?: string;
  maxFiles?: number;
}

export const FileDropZone: React.FC<FileDropZoneProps> = ({
  onFileSelect,
  onFilesSelect,
  validationRules,
  onError,
  accept = "*",
  multiple = false,
  children,
  className,
  maxFiles,
}) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleFileDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);

      if (!multiple) {
        // If multiple is not allowed, just use the first file
        onFileSelect(filesArray[0]);
      } else if (onFilesSelect) {
        // If we're handling multiple files and have a bulk handler
        onFilesSelect(filesArray);
      } else {
        // If we have multiple files but only single file handler
        // Process one by one (up to maxFiles if specified)
        const filesToProcess = maxFiles
          ? filesArray.slice(0, maxFiles)
          : filesArray;
        filesToProcess.forEach((file) => onFileSelect(file));
      }
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);

      if (!multiple) {
        // If multiple is not allowed, just use the first file
        onFileSelect(filesArray[0]);
      } else if (onFilesSelect) {
        // If we're handling multiple files and have a bulk handler
        onFilesSelect(filesArray);
      } else {
        // If we have multiple files but only single file handler
        // Process one by one (up to maxFiles if specified)
        const filesToProcess = maxFiles
          ? filesArray.slice(0, maxFiles)
          : filesArray;
        filesToProcess.forEach((file) => onFileSelect(file));
      }
    }

    // Reset the input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${
        isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
      } ${className || ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleFileDrop}
      onClick={openFileDialog}
    >
      {children || (
        <div className="flex flex-col items-center justify-center">
          <div className="mb-3 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          <p className="mb-2 text-sm text-gray-700">
            Drag and Drop {multiple ? "files" : "file"} here or
          </p>
          <span className="text-blue-600 hover:underline text-sm font-medium">
            Choose {multiple ? "files" : "file"}
          </span>
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
      />
    </div>
  );
};
