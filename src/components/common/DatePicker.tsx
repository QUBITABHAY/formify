import { useRef } from "react";

interface DatePickerProp {
  label: string;
  name?: string;
  value?: string;
  min?: string;
  max?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
}

function DatePicker({
  label,
  name,
  value,
  onChange,
  min,
  max,
  disabled = false,
  required = false,
}: DatePickerProp) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleContainerClick = () => {
    if (!disabled && inputRef.current) {
      inputRef.current.showPicker?.();
      inputRef.current.focus();
    }
  };

  return (
    <div className="flex flex-col w-full">
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-normal text-gray-700 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div
        className={`
          relative cursor-pointer
          ${disabled ? "cursor-not-allowed" : ""}
        `}
        onClick={handleContainerClick}
      >
        <input
          ref={inputRef}
          type="date"
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          disabled={disabled}
          className={`
            w-full p-3 pr-10
            border-b border-gray-300
            bg-transparent
            text-gray-900
            cursor-pointer
            focus:outline-none focus:border-gray-900
            disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
            transition-colors duration-200
            [&::-webkit-calendar-picker-indicator]:opacity-0
            [&::-webkit-calendar-picker-indicator]:absolute
            [&::-webkit-calendar-picker-indicator]:left-0
            [&::-webkit-calendar-picker-indicator]:w-full
            [&::-webkit-calendar-picker-indicator]:h-full
            [&::-webkit-calendar-picker-indicator]:cursor-pointer
          `}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default DatePicker;
