import React from "react";
import { CloseIcon } from "@/components/icons";
import {
  FileDropZone,
  ProgressBar,
  FileItem,
} from "@/components/ui/file-upload";
import { SaveAttachmentAsBase64 } from "@/services/transactionService";
import { ApiResponse } from "@/types";
import { useNotify } from "@/components/ui/Notify";
import { useFileUpload } from "@/hooks/use-file-upload";
import { Loading } from "@/components/ui/Loading";
import { Button, ButtonVariant } from "@/components/ui/Button";

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionId: number;
}

export const FileUploadModal: React.FC<FileUploadModalProps> = ({
  isOpen,
  onClose,
  transactionId,
}) => {
  const { notify } = useNotify();
  const {
    files,
    error,
    setError,
    isUploading,
    setIsUploading,
    uploadProgress,
    addFile,
    removeFile,
    clearFiles,
    simulateUploadProgress,
    convertToBase64,
  } = useFileUpload({
    validationRules: {
      maxSize: 25 * 1024 * 1024,
      allowedTypes: ["application/pdf", ".pdf"],
    },
    maxFiles: 1,
  });

  React.useEffect(() => {
    if (!isOpen) {
      clearFiles();
    }
  }, [isOpen]);

  const handleUpload = async () => {
    if (files.length === 0) {
      setError("Please select a file to upload");
      return;
    }

    try {
      setIsUploading(true);

      const base64Data = await convertToBase64(files[0]);

      const response = (await SaveAttachmentAsBase64(
        transactionId,
        base64Data
      )) as ApiResponse;

      if (response.status) {
        notify({ title: "File Uploaded Successfully", status: "success" });
        setIsUploading(false);
      } else {
        setIsUploading(false);
        // clearProgressSimulation();
        setError("Upload failed. Please try again.");
      }
    } catch (err) {
      setIsUploading(false);
      setError("Upload failed. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        <Loading isLoading={isUploading}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Upload file</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <CloseIcon />
            </button>
          </div>

          <FileDropZone
            onFileSelect={addFile}
            onError={setError}
            accept=".pdf"
            validationRules={{
              maxSize: 25 * 1024 * 1024, // 25MB
              allowedTypes: ["application/pdf", ".pdf"],
            }}
            className="mb-4"
          />

          {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

          <div className="mb-2 text-sm text-gray-500">
            Supported formats: PDF
            <span className="float-right">Maximum size: 25MB</span>
          </div>

          {files.length > 0 && (
            <div className="mt-4">
              {files.map((file, index) => (
                <div key={index} className="mb-2">
                  <FileItem file={file} onRemove={() => removeFile(index)} />
                  {/* {isUploading && <ProgressBar progress={uploadProgress} />} */}
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 flex justify-end space-x-3">
            <Button
              onClick={onClose}
              variant={ButtonVariant.Outline}
              disabled={isUploading}
            >
              Cancel
            </Button>

            <Button
              isLoading={isUploading}
              disabled={files.length === 0 || isUploading}
              variant={ButtonVariant.Primary}
              onClick={handleUpload}
            >
              {isUploading ? "Uploading..." : "Submit"}
            </Button>
          </div>
        </Loading>
      </div>
    </div>
  );
};
