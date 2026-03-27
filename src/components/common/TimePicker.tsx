import { useRef } from "react";

interface TimePickerProp {
  label: string;
  name?: string;
  value?: string;
  min?: string;
  max?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  subtitle?: string;
}

function TimePicker({
  label,
  name,
  value,
  onChange,
  min,
  max,
  disabled = false,
  required = false,
  subtitle,
}: TimePickerProp) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleContainerClick = () => {
    if (!disabled && inputRef.current) {
      if (inputRef.current.type === "text") {
        inputRef.current.type = "time";
      }
      try {
        inputRef.current.showPicker?.();
      } catch {
        // ignore error in browsers that don't support showPicker
      }
      inputRef.current.focus();
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!value) {
      e.target.type = "text";
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
      {subtitle && <p className="text-base text-gray-500 mb-2">{subtitle}</p>}
      <div
        className={`
          relative cursor-pointer
          ${disabled ? "cursor-not-allowed" : ""}
        `}
        onClick={handleContainerClick}
      >
        <input
          ref={inputRef}
          type={value ? "time" : "text"}
          placeholder="hh : mm am/pm"
          onBlur={handleBlur}
          id={name}
          name={name}
          value={value}
          min={min}
          max={max}
          onChange={onChange}
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
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default TimePicker;
