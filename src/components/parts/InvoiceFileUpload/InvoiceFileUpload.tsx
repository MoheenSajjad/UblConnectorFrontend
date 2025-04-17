import React from "react";
import { CloseIcon } from "@/components/icons";
import {
  FileDropZone,
  FileItem,
  ProgressBar,
} from "@/components/ui/file-upload";
import { useFileUpload } from "@/hooks/use-file-upload";
import { CheckCircle } from "lucide-react";
import { Button, ButtonVariant } from "@/components/ui/Button";
import { InvoiceFileUploadApi } from "@/services/transactionService";
import { ApiResponse } from "@/types";
import { useNotify } from "@/components/ui/Notify";
import { Loading } from "@/components/ui/Loading";

interface MultiFileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: () => void;
}

export const InvoiceFileUpload: React.FC<MultiFileUploadModalProps> = ({
  isOpen,
  onClose,
  onUploadComplete,
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
    addFiles,
    removeFile,
    clearFiles,
    simulateUploadProgress,
  } = useFileUpload({
    validationRules: {
      maxSize: 25 * 1024 * 1024,
      allowedTypes: [".pdf", ".xml"],
      customValidation: (file) => {
        // If we already have both PDF and XML
        const hasPdf = files.some(
          (f) => f.type.includes("pdf") || f.name.endsWith(".pdf")
        );
        const hasXml = files.some((f) => f.name.endsWith(".xml"));

        if (file.type.includes("pdf") || file.name.endsWith(".pdf")) {
          if (hasPdf) return "Only one PDF file is allowed";
        } else if (file.name.endsWith(".xml")) {
          if (hasXml) return "Only one XML file is allowed";
        } else {
          return "Only PDF and XML files are allowed";
        }

        return null;
      },
    },
    maxFiles: 2,
  });

  const hasPdf = files.some(
    (f) => f.type.includes("pdf") || f.name.endsWith(".pdf")
  );
  const hasXml = files.some((f) => f.name.endsWith(".xml"));
  const isValid = hasPdf && hasXml && files.length === 2;

  React.useEffect(() => {
    if (!isOpen) {
      clearFiles();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleUpload = async () => {
    if (files.length === 0) {
      setError("Please select at least one file to upload");
      return;
    }

    if (!hasXml) {
      setError("An XML file is required");
      return;
    }

    try {
      setIsUploading(true);

      const formData = new FormData();
      files.forEach((file) => {
        if (file instanceof File) {
          if (file.name.endsWith(".xml")) {
            formData.append("XmlFile", file);
          } else if (file.name.endsWith(".pdf")) {
            formData.append("PdfFile", file);
          }
        } else {
          console.error("Invalid file object:", file);
        }
      });

      const response = (await InvoiceFileUploadApi(formData)) as ApiResponse;

      if (response.status) {
        notify({ title: "File Uploaded Successfully", status: "success" });
        setIsUploading(false);
        onUploadComplete();
        onClose();
      } else {
        notify({
          title: "File Upload Failed",
          status: "error",
          message: response.message || "",
        });
        setIsUploading(false);
        setError("Upload failed. Please try again.");
      }
    } catch (err) {
      setIsUploading(false);
      notify({
        title: "File Upload Failed",
        status: "error",
      });
      setError("Upload failed. Please try again.");
    }
  };

  const handelAddFiles = (incomingFiles: File[]) => {
    const existingPdf = files.some((f) => f.name.endsWith(".pdf"));
    const existingXml = files.some((f) => f.name.endsWith(".xml"));

    const newPdf = incomingFiles.filter((f) => f.name.endsWith(".pdf"));
    const newXml = incomingFiles.filter((f) => f.name.endsWith(".xml"));

    if ((existingPdf && newPdf.length) || newPdf.length > 1) {
      setError("Only one PDF file is allowed");
      return;
    }

    if ((existingXml && newXml.length) || newXml.length > 1) {
      setError("Only one XML file is allowed");
      return;
    }

    addFiles(incomingFiles);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6">
        <Loading isLoading={isUploading}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Upload Files
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <CloseIcon />
            </button>
          </div>

          <FileDropZone
            onFileSelect={addFile}
            onFilesSelect={(incomingFiles) => handelAddFiles(incomingFiles)}
            onError={setError}
            accept=".pdf,.xml"
            multiple={true}
            maxFiles={2}
            validationRules={{
              maxSize: 25 * 1024 * 1024,
              allowedTypes: [".pdf", ".xml"],
            }}
            className="mb-4"
          />

          <div className="mb-4 flex items-center gap-4">
            <div
              className={`flex items-center gap-2 ${
                hasPdf ? "text-green-600" : "text-gray-500"
              }`}
            >
              <CheckCircle
                size={16}
                className={hasPdf ? "opacity-100" : "opacity-50"}
              />
              <span className="text-sm">PDF file</span>
            </div>
            <div
              className={`flex items-center gap-2 ${
                hasXml ? "text-green-600" : "text-gray-500"
              }`}
            >
              <CheckCircle
                size={16}
                className={hasXml ? "opacity-100" : "opacity-50"}
              />
              <span className="text-sm">XML file</span>
            </div>
          </div>

          {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

          <div className="mb-2 text-sm text-gray-500">
            Required: 1 PDF file and 1 XML file
            <span className="float-right">Maximum size: 25MB each</span>
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
