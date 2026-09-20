import { forwardRef, useId } from "react";

interface InputFieldProps {
  title: string;
  type?: string;
  placeholder?: string;
  maxLength?: number;
  name?: string;
  id?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autoFocus?: boolean;
  subtitle?: string;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
  inputMode?:
    | "search"
    | "text"
    | "email"
    | "tel"
    | "url"
    | "numeric"
    | "decimal"
    | "none";
  error?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      title,
      type = "text",
      placeholder,
      maxLength,
      name,
      id,
      value,
      onChange,
      autoFocus,
      subtitle,
      disabled,
      required,
      autoComplete,
      inputMode,
      error,
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id || name || generatedId;
    const descId = subtitle ? `${inputId}-desc` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;

    return (
      <div className="flex flex-col w-full">
        <label
          htmlFor={inputId}
          className="text-sm font-normal text-gray-700 mb-2 cursor-pointer flex items-center justify-between"
        >
          <span>
            {title}
            {required && (
              <span className="text-red-500 ml-1" aria-hidden="true">
                *
              </span>
            )}
          </span>
        </label>
        {subtitle && (
          <p id={descId} className="text-base text-gray-500 mb-2">
            {subtitle}
          </p>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          inputMode={inputMode}
          required={required}
          aria-invalid={!!error}
          aria-describedby={
            [descId, errorId].filter(Boolean).join(" ") || undefined
          }
          className={`p-3 border-b bg-transparent transition-colors focus:outline-none ${
            error
              ? "border-red-500 focus:border-red-600 text-red-900"
              : "border-gray-300 focus:border-gray-900"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          placeholder={placeholder}
          maxLength={maxLength}
          autoFocus={autoFocus}
          disabled={disabled}
        />
        {error && (
          <p
            id={errorId}
            role="alert"
            className="text-sm text-red-600 mt-1.5 flex items-center gap-1"
          >
            <svg
              className="w-4 h-4 shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </p>
        )}
      </div>
    );
  },
);

InputField.displayName = "InputField";

export default InputField;
