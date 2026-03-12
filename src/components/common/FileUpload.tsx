import { useRef } from "react";

interface FileUploadProps {
  label: string;
  name?: string;
  accept?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  isUploading?: boolean;
  value?: string;
}

function FileUpload({
  label,
  name,
  accept,
  onChange,
  disabled = false,
  required = false,
  isUploading = false,
  value = "",
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!disabled && inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col w-full">
      {label && (
        <label className="text-sm font-normal text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div
        onClick={handleClick}
        className={`
          relative flex flex-col items-center justify-center
          p-6 border-2 border-dashed border-gray-300 rounded-lg
          bg-gray-50 hover:bg-gray-100 hover:border-gray-900
          transition-all duration-200 cursor-pointer
          ${disabled || isUploading ? "opacity-50 cursor-not-allowed hover:bg-gray-50 hover:border-gray-300" : ""}
          ${value ? "border-green-500 bg-green-50" : ""}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          id={name}
          name={name}
          accept={accept}
          onChange={onChange}
          disabled={disabled || isUploading}
          className="hidden"
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
    </div>
  );
}

export default FileUpload;
