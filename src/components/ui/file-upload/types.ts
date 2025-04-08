export interface FileWithPreview extends File {
  preview?: string;
}

export interface FileValidationRules {
  maxSize?: number;
  allowedTypes?: string[];
  customValidation?: (file: File) => string | null;
}

export interface UploadProgressProps {
  progress: number;
}

export interface FileItemProps {
  file: File;
  onRemove: () => void;
}
