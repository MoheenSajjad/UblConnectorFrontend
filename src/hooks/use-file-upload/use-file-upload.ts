// src/hooks/use-file-upload.ts
import { useState } from "react";

export interface FileValidationRules {
  maxSize?: number;
  allowedTypes?: string[];
  customValidation?: (file: File) => string | null;
}

interface UseFileUploadOptions {
  validationRules?: FileValidationRules;
  maxFiles?: number;
}

export const useFileUpload = (options?: UseFileUploadOptions) => {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const validateFile = (file: File): boolean => {
    // Check file types if specified
    if (
      options?.validationRules?.allowedTypes &&
      options.validationRules.allowedTypes.length > 0
    ) {
      const fileType = file.type;
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      const isTypeValid = options.validationRules.allowedTypes.some(
        (type) => fileType.includes(type) || `.${fileExtension}` === type
      );

      if (!isTypeValid) {
        const allowedTypesString =
          options.validationRules.allowedTypes.join(", ");
        setError(`Only ${allowedTypesString} files are allowed`);
        return false;
      }
    }

    // Check file size if specified
    if (
      options?.validationRules?.maxSize &&
      file.size > options.validationRules.maxSize
    ) {
      const maxSizeMB = Math.floor(
        options.validationRules.maxSize / (1024 * 1024)
      );
      setError(`File size exceeds ${maxSizeMB}MB limit`);
      return false;
    }

    // Run custom validation if provided
    if (options?.validationRules?.customValidation) {
      const customError = options.validationRules.customValidation(file);
      if (customError) {
        setError(customError);
        return false;
      }
    }

    return true;
  };

  const addFile = (file: File) => {
    // Check if we would exceed the max files limit
    if (options?.maxFiles && files.length >= options.maxFiles) {
      setError(`Maximum ${options.maxFiles} files allowed`);
      return;
    }

    // Validate the file
    if (validateFile(file)) {
      setFiles((prev) => [...prev, file]);
      setError(null);
    }
  };

  const addFiles = (newFiles: File[]) => {
    // Calculate how many more files we can add
    const remainingSlots = options?.maxFiles
      ? options.maxFiles - files.length
      : newFiles.length;

    if (remainingSlots <= 0) {
      setError(`Maximum ${options?.maxFiles} files allowed`);
      return;
    }

    // Only take as many files as we have slots for
    const filesToAdd = newFiles.slice(0, remainingSlots);

    // Filter valid files
    const validFiles = filesToAdd.filter(validateFile);

    if (validFiles.length > 0) {
      setFiles((prev) => [...prev, ...validFiles]);
      setError(null);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setError(null);
  };

  const clearFiles = () => {
    setFiles([]);
    setError(null);
  };

  const simulateUploadProgress = (callback?: () => void) => {
    let progress = 0;
    setIsUploading(true);

    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setIsUploading(false);
        if (callback) callback();
      }
    }, 100);

    return () => {
      clearInterval(interval);
      setIsUploading(false);
    };
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

  return {
    files,
    error,
    setError,
    isUploading,
    uploadProgress,
    addFile,
    addFiles,
    removeFile,
    clearFiles,
    setIsUploading,
    setUploadProgress,
    simulateUploadProgress,
    convertToBase64,
  };
};
