import React, { useState, useRef, DragEvent, ChangeEvent } from "react";
import { XCircle } from "lucide-react";
import { SaveAttachmentAsBase64 } from "@/services/transactionService";
import { ApiResponse } from "@/types";
import { useNotify } from "@/components/ui/Notify";

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionId: number;
  // onUpload: (base64: string) => Promise<void>;
}

export const FileUploadModal: React.FC<FileUploadModalProps> = ({
  isOpen,
  onClose,
  transactionId,
  // onUpload,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { notify } = useNotify();

  React.useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null);
      setUploadProgress(0);
      setIsUploading(false);
      setError(null);
    }
  }, [isOpen]);

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

  const validateFile = (file: File): boolean => {
    if (!file.type.includes("pdf")) {
      setError("Only PDF files are allowed");
      return false;
    }

    if (file.size > 25 * 1024 * 1024) {
      setError("File size exceeds 25MB limit");
      return false;
    }

    setError(null);
    return true;
  };

  const handleFileDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        const result = reader.result as string;
        const base64String = result.split(",")[1];
        resolve(base64String);
      };

      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const simulateUploadProgress = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file to upload");
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      const clearProgressSimulation = simulateUploadProgress();

      const base64Data = await convertToBase64(selectedFile);

      const response = (await SaveAttachmentAsBase64(
        transactionId,
        base64Data
      )) as ApiResponse;

      if (response.status) {
        notify({ title: "File Uploaded SuccessFully", status: "success" });
      }

      clearProgressSimulation();
      setUploadProgress(100);

      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      setError("Upload failed. Please try again.");
      setUploadProgress(0);
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " bytes";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Upload file</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-8 mb-4 text-center ${
            isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleFileDrop}
        >
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
              Drag and Drop file here or
            </p>
            <button
              type="button"
              className="text-blue-600 hover:underline text-sm font-medium"
              onClick={() => fileInputRef.current?.click()}
            >
              Choose file
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".pdf"
              onChange={handleFileChange}
            />
          </div>
        </div>

        {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

        <div className="mb-2 text-sm text-gray-500">
          Supported formats: PDF
          <span className="float-right">Maximum size: 25MB</span>
        </div>

        {selectedFile && (
          <div className="mt-4 border rounded-lg p-3 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-red-500"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 13.5v-7c0-.41.34-.75.75-.75s.75.34.75.75v7c0 .41-.34.75-.75.75s-.75-.34-.75-.75zm1.5-9c0 .55-.45 1-1 1s-1-.45-1-1 .45-1 1-1 1 .45 1 1z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemoveFile}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle size={20} />
              </button>
            </div>

            {isUploading && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <div className="text-right text-xs text-gray-500 mt-1">
                  {uploadProgress}%
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={isUploading}
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
};
