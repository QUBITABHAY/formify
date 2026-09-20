import { useRef, useState, useId } from "react";

interface FileUploadProps {
  id?: string;
  label: string;
  name?: string;
  accept?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  isUploading?: boolean;
  subtitle?: string;
  value?: string;
  maxSize?: number;
}

function FileUpload({
  id,
  label,
  name,
  accept,
  onChange,
  disabled = false,
  required = false,
  isUploading = false,
  subtitle,
  value = "",
  maxSize = 10 * 1024 * 1024,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const generatedId = useId();
  const inputId = id || (name ? `field-${name}` : generatedId);
  const errorId = `${inputId}-error`;

  const handleClick = () => {
    if (!disabled && inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > maxSize) {
        setValidationError(
          `File size exceeds ${(maxSize / (1024 * 1024)).toFixed(0)}MB limit.`,
        );
        if (inputRef.current) inputRef.current.value = "";
        return;
      }
      setValidationError(null);
    }
    onChange?.(e);
  };

  return (
    <div className="flex flex-col w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-normal text-gray-700 mb-2 block"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {subtitle && <p className="text-base text-gray-500 mb-2">{subtitle}</p>}
      <div
        onClick={handleClick}
        className={`
          relative flex flex-col items-center justify-center
          p-6 border-2 border-dashed border-gray-300 rounded-lg
          bg-gray-50 hover:bg-gray-100 hover:border-gray-900
          transition-all duration-200 cursor-pointer
          focus-within:ring-2 focus-within:ring-gray-900 focus-within:ring-offset-2
          ${disabled || isUploading ? "opacity-50 cursor-not-allowed hover:bg-gray-50 hover:border-gray-300" : ""}
          ${value ? "border-green-500 bg-green-50" : ""}
          ${validationError ? "border-red-400 bg-red-50" : ""}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          id={inputId}
          name={name}
          accept={accept}
          onChange={handleChange}
          disabled={disabled || isUploading}
          aria-invalid={validationError ? "true" : undefined}
          aria-describedby={validationError ? errorId : undefined}
          className="sr-only"
        />
        {isUploading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-3"></div>
            <p className="text-sm text-gray-600 font-medium">Uploading...</p>
          </div>
        ) : value ? (
          <div className="flex flex-col items-center">
            <svg
              className="w-10 h-10 text-green-500 mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm text-green-600 font-medium truncate max-w-xs">
              {value.split("/").pop()}
            </p>
            <p className="text-xs text-green-500 mt-1">Click to change file</p>
          </div>
        ) : (
          <>
            <svg
              className="w-10 h-10 text-gray-400 mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-sm text-gray-600 font-medium">
              Click to upload a file
            </p>
            <p className="text-xs text-gray-400 mt-1">or drag and drop</p>
          </>
        )}
      </div>
      {validationError && (
        <p id={errorId} className="text-sm text-red-600 mt-1" role="alert">
          {validationError}
        </p>
      )}
    </div>
  );
}

export default FileUpload;
