import { forwardRef, useId } from "react";

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  title: string;
  options: Option[];
  name?: string;
  id?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  subtitle?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      title,
      options,
      name,
      id,
      value,
      onChange,
      placeholder = "Select an option",
      subtitle,
      disabled,
      required,
      error,
    },
    ref,
  ) => {
    const generatedId = useId();
    const selectId = id || name || generatedId;
    const descId = subtitle ? `${selectId}-desc` : undefined;
    const errorId = error ? `${selectId}-error` : undefined;

    return (
      <div className="flex flex-col w-full">
        <label
          htmlFor={selectId}
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
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            required={required}
            aria-invalid={!!error}
            aria-describedby={
              [descId, errorId].filter(Boolean).join(" ") || undefined
            }
            className={`w-full p-3 border-b bg-transparent appearance-none cursor-pointer focus:outline-none transition-colors ${
              error
                ? "border-red-500 focus:border-red-600 text-red-900"
                : "border-gray-300 focus:border-gray-900"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
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

Select.displayName = "Select";

export default Select;
