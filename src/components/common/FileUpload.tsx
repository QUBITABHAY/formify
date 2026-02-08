import { useRef } from "react";

interface FileUploadProps {
  label: string;
  name?: string;
  accept?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
}

function FileUpload({
  label,
  name,
  accept,
  onChange,
  disabled = false,
  required = false,
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
          bg-gray-50 hover:bg-gray-100 hover:border-indigo-400
          transition-all duration-200 cursor-pointer
          ${disabled ? "opacity-50 cursor-not-allowed hover:bg-gray-50 hover:border-gray-300" : ""}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          id={name}
          name={name}
          accept={accept}
          onChange={onChange}
          disabled={disabled}
          className="hidden"
        />
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
      </div>
    </div>
  );
}

export default FileUpload;
