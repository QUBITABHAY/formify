import { forwardRef } from "react";

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  title: string;
  options: Option[];
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  disabled?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      title,
      options,
      name,
      value,
      onChange,
      placeholder = "Select an option",
      disabled,
    },
    ref,
  ) => {
    return (
      <div className="flex flex-col w-full">
        <label className="text-sm font-normal text-gray-700 mb-2">
          {title}
        </label>
        <div className="relative">
          <select
            ref={ref}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className="w-full p-3 border-b border-gray-300 focus:outline-none focus:border-gray-900 bg-transparent appearance-none cursor-pointer"
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
      </div>
    );
  },
);

export default Select;
